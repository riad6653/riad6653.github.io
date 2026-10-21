/* =========================================================================
 * RC MICROSTOCK RESEARCH PRO v3.4 — Strict Role-Based Security & License Engine
 * Exclusive Owner & Brand: Riad Chowdhury (WhatsApp: 01618674044)
 * ========================================================================= */
(function (global) {
  "use strict";

  const SECRET_SALT = "RC_RIAD_CHOWDHURY_VAULT_2026_#01618674044";
  const ADMIN_EMAIL_SHA256 = "f149abfa954fa848200538aa644713149f03833d667f3a1715d4b6c58a66a530";
  const DEFAULT_MASTER_PASS = "RC@Riad2026";
  const STORAGE_MASTER_PASS_KEY = "rc_master_admin_password";
  const ADMIN_WHATSAPP = "8801618674044";
  const ADMIN_DISPLAY_PHONE = "01618674044";

  const PLAN_DEFS = {
    TR3: { label: "3-Day Trial Pass", days: 3 },
    D07: { label: "7-Day Starter Plan", days: 7 },
    D30: { label: "30-Day Pro Monthly", days: 30 },
    D90: { label: "90-Day Agency Pro", days: 90 },
    Y01: { label: "1-Year Elite Plan", days: 365 },
    VIP: { label: "Lifetime VIP Edition", days: 99999 }
  };

  function sha256Hex(ascii) {
    const bytes = new TextEncoder().encode(ascii);
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    let H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const bitLen = bytes.length * 8;
    const padLen = ((bytes.length + 9 + 63) >> 6) << 6;
    const buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[bytes.length] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
    dv.setUint32(padLen - 4, bitLen >>> 0, false);

    const W = new Uint32Array(64);
    const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

    for (let offset = 0; offset < padLen; offset += 64) {
      for (let i = 0; i < 16; i++) W[i] = dv.getUint32(offset + i * 4, false);
      for (let i = 16; i < 64; i++) {
        const s0 = (rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3)) >>> 0;
        const s1 = (rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10)) >>> 0;
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
        const ch = ((e & f) ^ ((~e >>> 0) & g)) >>> 0;
        const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
        const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
        const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        const temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e;
        e = (d + temp1) >>> 0;
        d = c; c = b; b = a;
        a = (temp1 + temp2) >>> 0;
      }
      H = [
        (H[0] + a) >>> 0, (H[1] + b) >>> 0, (H[2] + c) >>> 0, (H[3] + d) >>> 0,
        (H[4] + e) >>> 0, (H[5] + f) >>> 0, (H[6] + g) >>> 0, (H[7] + h) >>> 0
      ];
    }
    return H.map((v) => v.toString(16).padStart(8, "0")).join("");
  }

  function isAdminEmail(emailStr) {
    const clean = String(emailStr || "").trim().toLowerCase();
    if (!clean) return false;
    return sha256Hex(clean) === ADMIN_EMAIL_SHA256;
  }

  function getAdminPassword() {
    try {
      if (global.__RC_EXT_ADMIN_PASS__) return String(global.__RC_EXT_ADMIN_PASS__);
      const saved = global.localStorage && global.localStorage.getItem(STORAGE_MASTER_PASS_KEY);
      if (saved && saved.trim().length >= 4) return saved.trim();
    } catch (_) {}
    return DEFAULT_MASTER_PASS;
  }

  function setAdminPassword(newPass) {
    const clean = String(newPass || "").trim();
    if (clean.length < 4) {
      throw new Error("নতুন Admin Password কমপক্ষে ৪ অক্ষরের হতে হবে!");
    }
    global.__RC_EXT_ADMIN_PASS__ = clean;
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORAGE_MASTER_PASS_KEY, clean);
      }
    } catch (_) {}
    return clean;
  }

  function sanitizeClientSlug(name) {
    const cleaned = String(name || "CLIENT")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10);
    return cleaned || "CLIENT";
  }

  function generateLicenseKey(clientName, planCode) {
    const plan = PLAN_DEFS[planCode] ? planCode : "D30";
    const slug = sanitizeClientSlug(clientName);
    const todayDay = Math.floor(Date.now() / 86400000);
    const expDay = plan === "VIP" ? 99999 : todayDay + PLAN_DEFS[plan].days;
    const raw = `RCVIP|${plan}|${expDay}|${slug}|${SECRET_SALT}`;
    const sig = sha256Hex(raw).slice(0, 8).toUpperCase();
    return {
      key: `RCVIP-${plan}-${expDay}-${slug}-${sig}`,
      plan,
      planLabel: PLAN_DEFS[plan].label,
      expDay,
      clientSlug: slug
    };
  }

  // Cryptographic SHA-256 Admin Role Verification (Zero Admin Gmail exposed in source or UI)
  function verifyCredential(inputPass, emailInput, customKeysList) {
    const pass = String(inputPass || "").trim();
    const email = String(emailInput || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return { valid: false, error: "অনুগ্রহ করে প্রথমে আপনার সঠিক Gmail ঠিকানা লিখুন!" };
    }
    if (!pass) {
      return { valid: false, error: "অনুগ্রহ করে Password অথবা License Key দিন।" };
    }

    const activeAdminPass = getAdminPassword();

    // CASE A: Cryptographic SHA-256 Owner Vault check
    if (isAdminEmail(email)) {
      if (pass === activeAdminPass) {
        return {
          valid: true,
          role: "admin",
          isAdmin: true,
          email: "",
          emailHash: ADMIN_EMAIL_SHA256,
          clientName: "Riad Chowdhury (Owner)",
          planCode: "ADMIN",
          planLabel: "Master Admin Vault",
          daysLeft: "Unlimited Admin",
          key: pass
        };
      }
      if (pass.toUpperCase().startsWith("RCVIP-")) {
        return {
          valid: false,
          error: "Client License Key ব্যবহার করতে আপনার ইউজার Gmail দিন!"
        };
      }
      return {
        valid: false,
        error: "ভুল Admin Password! সঠিক বর্তমান Admin Password দিন।"
      };
    }

    // CASE B: Standard / VIP Client Login
    const localKeys = Array.isArray(customKeysList) ? customKeysList : [];
    const matchedLocal = localKeys.find(
      (k) => String(k.license_key || "").trim().toUpperCase() === pass.toUpperCase()
    );
    if (matchedLocal) {
      if (matchedLocal.status !== "active") {
        return { valid: false, error: "এই Password / Key টি Admin কর্তৃক স্থগিত (Revoked) করা হয়েছে!" };
      }
      const contactLower = String(matchedLocal.client_contact || "").trim().toLowerCase();
      if (contactLower.includes("@") && contactLower !== email) {
        return { valid: false, error: `এই পাসওয়ার্ডটি শুধুমাত্র ${contactLower} জিমেইলের জন্য নির্ধারিত!` };
      }
      return {
        valid: true,
        role: "pro",
        isAdmin: false,
        email,
        clientName: matchedLocal.client_name || email,
        planCode: matchedLocal.plan_code || "D30",
        planLabel: matchedLocal.plan_label || "Pro Client",
        daysLeft: "Active Member",
        key: pass
      };
    }

    const upper = pass.toUpperCase();
    const parts = upper.split("-");
    if (parts.length === 5 && parts[0] === "RCVIP") {
      const [, plan, expStr, slug, sig] = parts;
      const expDay = parseInt(expStr, 10);
      if (!PLAN_DEFS[plan] || isNaN(expDay)) {
        return { valid: false, error: "Invalid License Key ফরম্যাট!" };
      }
      const expected = sha256Hex(`RCVIP|${plan}|${expDay}|${slug}|${SECRET_SALT}`).slice(0, 8).toUpperCase();
      if (sig !== expected) {
        return { valid: false, error: "ভুল বা পরিবর্তিত License Key! অ্যাডমিনের সাথে যোগাযোগ করুন।" };
      }
      const todayDay = Math.floor(Date.now() / 86400000);
      if (expDay !== 99999 && todayDay > expDay) {
        return { valid: false, error: "আপনার License Key-এর মেয়াদ শেষ! Riad Chowdhury-এর সাথে WhatsApp-এ যোগাযোগ করুন।" };
      }
      const daysLeft = expDay === 99999 ? "Lifetime VIP" : `${expDay - todayDay} Days Left`;
      return {
        valid: true,
        role: "pro",
        isAdmin: false,
        email,
        clientName: `${slug} (${email})`,
        planCode: plan,
        planLabel: PLAN_DEFS[plan].label,
        daysLeft,
        key: upper
      };
    }

    if (pass === activeAdminPass) {
      return {
        valid: true,
        role: "pro",
        isAdmin: false,
        email,
        clientName: email,
        planCode: "MEMBER",
        planLabel: "Standard User View",
        daysLeft: "Active Access",
        key: pass
      };
    }

    return {
      valid: false,
      error: "সঠিক Password বা License Key দিন অথবা নিচে WhatsApp বাটনে ক্লিক করে Admin (Riad Chowdhury)-এর কাছ থেকে পাসওয়ার্ড নিন।"
    };
  }

  function buildWhatsAppUrl(customText) {
    const msg = customText ||
      "Assalamu Alaikum Riad Chowdhury Vai! Ami RC Microstock Research Pro tracker use korte chai. Amake akta Access Password / License Key diben please.";
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  global.RCLicense = {
    ADMIN_EMAIL_SHA256,
    DEFAULT_MASTER_PASS,
    STORAGE_MASTER_PASS_KEY,
    ADMIN_WHATSAPP,
    ADMIN_DISPLAY_PHONE,
    PLAN_DEFS,
    sha256Hex,
    isAdminEmail,
    getAdminPassword,
    setAdminPassword,
    generateLicenseKey,
    verifyCredential,
    buildWhatsAppUrl
  };
})(typeof window !== "undefined" ? window : self);
