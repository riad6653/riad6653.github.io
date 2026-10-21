/* =====================================================================
   RC ACCESS GUARD v3.5 — serverless instant revocation
   DB: GitHub repo riad6653/rc-license-db -> db.json (AES-256-GCM encrypted)
   - Client: list fetch + decrypt -> rcAdminKeys inject (login block)
             + session kill (<=60s / tab focus / page load)
   - Admin : Revoke/Delete/Generate -> encrypted publish (fine-grained PAT)
   ===================================================================== */
(function () {
  var DB_RAW = "https://raw.githubusercontent.com/riad6653/rc-license-db/main/db.json";
  var DB_API = "https://api.github.com/repos/riad6653/rc-license-db/contents/db.json";
  var KEY_HEX = "7ab38f6ee04c379e8fd287363c61fe2b530488a7ee0b8f042201c903b84e95fc";
  var list = null;
  var cryptoOk = !!(window.crypto && window.crypto.subtle);

  function hexToBytes(hex) {
    var b = new Uint8Array(hex.length / 2);
    for (var i = 0; i < b.length; i++) b[i] = parseInt(hex.substr(i * 2, 2), 16);
    return b;
  }
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var b = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
    return b;
  }
  function bytesToB64(b) {
    var s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  function getKey() {
    return window.crypto.subtle.importKey("raw", hexToBytes(KEY_HEX), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  }
  function decryptDb(db) {
    return getKey().then(function (k) {
      return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(db.iv) }, k, b64ToBytes(db.ct));
    }).then(function (buf) {
      return JSON.parse(new TextDecoder().decode(buf));
    });
  }
  function encryptDb(obj) {
    var iv = window.crypto.getRandomValues(new Uint8Array(12));
    return getKey().then(function (k) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, new TextEncoder().encode(JSON.stringify(obj)));
    }).then(function (ct) {
      return { v: 1, iv: bytesToB64(iv), ct: bytesToB64(new Uint8Array(ct)) };
    });
  }

  function merged() {
    if (!list) return [];
    return (list.keys || []).concat(list.tombstones || []);
  }
  function isAdminSession() {
    try {
      var s = JSON.parse(localStorage.getItem("rcWebSession") || "null");
      return !!(s && s.isAdmin);
    } catch (e) { return false; }
  }
  function inject() {
    if (isAdminSession()) return;
    var ks = merged();
    if (ks.length) localStorage.setItem("rcAdminKeys", JSON.stringify(ks));
  }
  function refresh(cb) {
    if (!cryptoOk) { if (cb) cb(); return; }
    fetch(DB_RAW + "?ts=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (db) {
        if (db && db.ct && db.iv) return decryptDb(db).then(function (d) { list = d || { keys: [] }; inject(); });
        return null;
      })
      .then(function () { if (cb) cb(); })
      .catch(function () { if (cb) cb(); });
  }
  function sessionKillCheck() {
    try {
      var s = JSON.parse(localStorage.getItem("rcWebSession") || "null");
      if (!s || s.isAdmin) return;
      var key = String(s.key || "").toUpperCase();
      var email = String(s.email || "").toLowerCase();
      var all = merged();
      if (!all.length) return;
      var hit = null;
      for (var i = 0; i < all.length; i++) {
        var k = all[i];
        var lk = String(k.license_key || "").toUpperCase();
        var contact = String(k.client_contact || "").toLowerCase();
        if (key && lk && lk === key && k.status !== "active") { hit = k; break; }
        if (email && contact.indexOf("@") > -1 && contact === email && k.status !== "active") { hit = k; break; }
      }
      if (hit) {
        localStorage.removeItem("rcWebSession");
        sessionStorage.setItem("rcRevokedMsg", hit.status === "deleted" ? "deleted" : "revoked");
        try { location.reload(); } catch (e) {}
      }
    } catch (e) {}
  }
  function showRevokedMsg() {
    var m = sessionStorage.getItem("rcRevokedMsg");
    if (!m) return;
    sessionStorage.removeItem("rcRevokedMsg");
    var el = document.getElementById("login-error");
    if (el) {
      el.textContent =
        m === "deleted"
          ? "⛔ দুঃখিত — আপনার অ্যাক্সেস অ্যাডমিন কর্তৃক বাতিল (Remove) করা হয়েছে। নতুন অ্যাক্সেস নিতে WhatsApp-এ যোগাযোগ করুন।"
          : "⛔ এই Password / License Key টি অ্যাডমিন স্থগিত (Revoke) করেছেন। নতুন Key নিতে WhatsApp-এ যোগাযোগ করুন।";
      el.classList.remove("hidden");
    }
  }
  function toast(t) {
    var el = document.getElementById("global-toast");
    if (el) {
      el.textContent = t;
      el.classList.remove("hidden");
      setTimeout(function () { el.classList.add("hidden"); }, 2600);
    }
  }

  // ---------------- admin publish (encrypted -> GitHub) ----------------
  function publish() {
    var token = localStorage.getItem("rcPublishToken");
    if (!token) { promptToken(); return; }
    var keys = [];
    try { keys = JSON.parse(localStorage.getItem("rcAdminKeys") || "[]"); } catch (e) {}
    var payload = {
      keys: keys.map(function (k) {
        return {
          id: k.id, license_key: k.license_key, status: k.status,
          client_contact: k.client_contact || "", client_name: k.client_name || "", plan_code: k.plan_code || "",
        };
      }),
    };
    if (window.__RC_TOMBSTONES__ && window.__RC_TOMBSTONES__.length) payload.tombstones = window.__RC_TOMBSTONES__;
    encryptDb(payload)
      .then(function (enc) {
        return fetch(DB_API, { headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" } })
          .then(function (r) { return r.ok ? r.json() : { sha: null }; })
          .then(function (cur) {
            var body = { message: "rc access list sync", content: bytesToB64(new TextEncoder().encode(JSON.stringify(enc))) };
            if (cur && cur.sha) body.sha = cur.sha;
            return fetch(DB_API, {
              method: "PUT",
              headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
          });
      })
      .then(function (r) {
        if (r.ok) toast("☁️ অ্যাক্সেস লিস্ট সার্ভারে সিঙ্ক হয়েছে — Revoke এখনই সব ইউজারের জন্য প্রযোজ্য!");
        else toast("⚠️ সিঙ্ক ব্যর্থ (token permission check korun) — HTTP " + r.status);
      })
      .catch(function (err) { toast("⚠️ সিঙ্ক ব্যর্থ: " + err.message); });
  }
  function promptToken() {
    if (document.getElementById("rc-secret-panel")) return;
    if (!isAdminSession()) return;
    var d = document.createElement("div");
    d.id = "rc-secret-panel";
    d.style.cssText =
      "position:fixed;top:14px;right:14px;z-index:9998;background:linear-gradient(160deg,#1c1f2b,#12141d);border:1px solid rgba(245,214,115,.5);border-radius:14px;padding:14px 16px;max-width:360px;color:#f7f3ea;font-family:system-ui,'Noto Sans Bengali',sans-serif;font-size:13px;box-shadow:0 18px 50px rgba(0,0,0,.55)";
    d.innerHTML =
      '<strong style="color:#f5d673;">☁️ GitHub Sync Token (একবার)</strong>' +
      '<p style="margin:6px 0 8px;color:#b7b0a2;line-height:1.6;">Revoke/Delete সার্ভারে সিঙ্ক করতে আপনার <b>fine-grained PAT</b> লাগবে (শুধু rc-license-db repo, Contents: Read &amp; write)। একবার paste করলে এই ব্রাউজারে সেভ থাকবে।</p>' +
      '<input id="rc-secret-input" type="password" style="width:100%;padding:8px;border-radius:8px;border:1px solid #444;background:#0d0f15;color:#fff;" placeholder="github_pat_..." />' +
      '<button id="rc-secret-save" type="button" style="margin-top:8px;padding:8px 14px;border-radius:8px;border:none;background:linear-gradient(135deg,#f7dd8b,#e3b64e);color:#241c05;font-weight:700;cursor:pointer;">Save & Sync</button>';
    document.body.appendChild(d);
    d.querySelector("#rc-secret-save").onclick = function () {
      var v = d.querySelector("#rc-secret-input").value.trim();
      if (v) { localStorage.setItem("rcPublishToken", v); d.remove(); publish(); }
    };
  }

  // ---- admin actions intercept (toggle / delete / generate) ----
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-toggle-k],[data-del-k]") : null;
    if (!t) return;
    if (t.hasAttribute("data-del-k")) {
      try {
        var ks = JSON.parse(localStorage.getItem("rcAdminKeys") || "[]");
        var id = t.getAttribute("data-del-k");
        var entry = null;
        for (var i = 0; i < ks.length; i++) if (String(ks[i].id) === String(id)) entry = ks[i];
        if (entry) {
          window.__RC_TOMBSTONES__ = window.__RC_TOMBSTONES__ || [];
          window.__RC_TOMBSTONES__.push({
            id: entry.id, license_key: entry.license_key, status: "deleted",
            client_contact: entry.client_contact || "", client_name: entry.client_name || "", plan_code: entry.plan_code || "",
          });
        }
      } catch (err) {}
    }
    setTimeout(publish, 900);
  }, true);
  var genForm = document.getElementById("admin-gen-form");
  if (genForm) genForm.addEventListener("submit", function () { setTimeout(publish, 900); });

  // ---- boot ----
  function boot() {
    showRevokedMsg();
    refresh(function () { sessionKillCheck(); });
    setInterval(function () { refresh(function () { sessionKillCheck(); }); }, 60000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refresh(function () { sessionKillCheck(); });
    });
    setTimeout(function () {
      if (isAdminSession() && !localStorage.getItem("rcPublishToken")) promptToken();
    }, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
