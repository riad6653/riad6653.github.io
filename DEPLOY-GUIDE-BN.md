# 🚀 RC Microstock Research Pro — FREE Hosting + Domain + Google Deploy Guide (বাংলা)

**LIVE NOW (০ টাকা):**
- ⭐ Primary (name domain): **https://riad-chowdhury-pro.netlify.app/**
- 🪞 Mirror/backup: **https://riad6653.github.io/**
- Canonical (Google-কে যেটা দেখানো হয়): netlify primary URL
- Owner: Riad Chowdhury • rjriadchowdhury2005@gmail.com

> `riad-chowdhury` ও `riadchowdhury` subdomain Netlify+GitHub-এ অন্য কারো দখলে, তাই **riad-chowdhury-pro** নেওয়া হয়েছে।
> পুরনো `Riad-Chowdhury` GitHub account-এর password ফিরে পেলে আমাকে বলবেন — সব `riad-chowdhury.github.io`-তে migrate করে দেবো।

---

## ⚠️ আগে: ৬টা ফাইল এখনো missing (upload করবেন)

আপনার `index.html` এই ফাইলগুলো খোঁজে — এগুলো ছাড়া site ভাঙা দেখাবে:

| # | ফাইল | কোথায় রাখবেন |
|---|-------|---------------|
| 1 | `styles.css` | ফোল্ডারের root-এ |
| 2 | `app.js` | root-এ |
| 3 | `crypto-license.js` | root-এ |
| 4 | `offline-catalog.js` | root-এ |
| 5 | আপনার আসল logo (যদি থাকে) | `assets/logo-full.png` replace করুন |
| 6 | `RC-Microstock-Extension-Pro.zip`, `RC-Microstock-Pro-COMPLETE-PACKAGE.zip` | `downloads/` ফোল্ডারে |

> GitHub-এ একটা ফাইল সর্বোচ্চ **100 MB** হতে পারবে। ZIP 100MB-এর বড় হলে বলবেন — GitHub Releases-এ রাখার ব্যবস্থা করে দেবো।

---

## ধাপ ১ — GitHub free account খুলুন (২ মিনিট)

1. https://github.com → **Sign up**
2. **Username দিন exactly: `riad-chowdhury`** ← এটাই আপনার domain হবে!
   (যদি username আগেই কেউ নিয়ে থাকে, তবে `riad-chowdhury-bd` বা `riadchowdhury` দিন — domain সেটাই হবে)
3. Email verify করুন।

## ধাপ ২ — Deploy (৩টা অপশন, যেকোনো একটা)

### অপশন C: ⭐ সবচেয়ে সহজ — আমি করে দেবো
1. GitHub account খুলুন (username: `riad-chowdhury`)
2. https://github.com/settings/tokens/new → note: "rc-site-deploy", expiry 7 days,
   scope দিন: **repo** + **workflow** → Generate → token টা কপি করে Arena chat-এ paste করুন
3. বাকি সব (repo তৈরি, push, Pages ON, live check) আমি করে দেবো।
   কাজ শেষ হলে token টা **Delete** করে দেবেন (settings → tokens → delete)।

### অপশন A: One-click script (কম্পিউটারে Git + gh CLI থাকলে)
- Windows: `deploy-windows.bat` ফাইলে **double-click**
- Mac/Linux: টার্মিনালে `bash deploy-mac-linux.sh`
- প্রথমবার browser খুলে GitHub login চাইবে — login করলেই বাকি সব অটো:
  repo তৈরি → files push → Pages ON → auto-deploy workflow চালু।

### অপশন B: Browser দিয়ে manual (কোনো software লাগবে না) ⭐ সহজ
1. GitHub-এ login → ডান পাশে **+** → **New repository**
2. Repository name লিখুন: **`riad-chowdhury.github.io`** (username যেটা নিয়েছেন সেটা.github.io)
3. **Public** সিলেক্ট → **Create repository**
4. Repo পেজে **uploading an existing file** লিংকে ক্লিক করুন
5. এই ফোল্ডারের **সব ফাইল + ফোল্ডার** drag & drop করুন:
   `index.html`, `styles.css`, `app.js`, `crypto-license.js`, `offline-catalog.js`,
   `robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll`, `assets/` ফোল্ডার, `downloads/` ফোল্ডার, `.github/` ফোল্ডার
   (browser-এ ফোল্ডার drag করলে ভেতরের ফাইলসহ উঠে যায়; `.github` ও `.nojekyll` লুকানো ফাইল —
   Windows-এ View → Hidden items ON করে তবে drag করুন, নাহলে পরে Settings থেকে যোগ করবেন)
6. নিচে commit message দিয়ে **Commit changes**
7. এবার **Settings → Pages** tab:
   - *Build and deployment* → **Source:** `GitHub Actions` সিলেক্ট করুন
   - উপরে **Actions** tab-এ গিয়ে দেখবেন "Deploy to GitHub Pages" workflow নিজে নিজে চলছে ✅
8. ১–২ মিনিট পর খুলুন: **https://riad-chowdhury.github.io/** 🎉

> `.github/workflows/deploy-pages.yml` ফাইলটা থাকায় এখন থেকে **নতুন ফাইল push/upload করলেই site অটো আপডেট** হবে — আর কিছু করতে হবে না।

## ধাপ ৩ — Google-এ আনার কাজ (৫ মিনিট)

1. খুলুন: https://search.google.com/search-console
2. **URL prefix** দিন: `https://riad-chowdhury.github.io/` → Continue
3. Verify করুন: **HTML file** method বেছে Google-এর দেওয়া ফাইল ডাউনলোড করে
   এই ফোল্ডারে রেখে আবার upload+commit করুন (অথবা DNS/Tag method) → Verify
4. বাঁ পাশের মেনু → **Sitemaps** → লিখুন `sitemap.xml` → Submit
5. উপরের বক্সে URL লিখে **Request Indexing** চাপুন
6. ৩–৭ দিনে Google-এ `RC Microstock Research Pro` / `Riad Chowdhury microstock` লিখলে site আসবে।
   (নতুন site indexing একটু সময় নেয় — স্বাভাবিক)

**Bonus (share-preview):** landing page-এ Open Graph tag দেওয়া আছে, তাই WhatsApp/Facebook-এ link share করলে
সুন্দর card (logo + title + description) দেখাবে।

## ধাপ ৪ — পরে আপডেট করতে চাইলে

নতুন ফাইল/পরিবর্তন হলে শুধু repo-তে upload/commit করুন — Actions নিজে deploy করে দেবে।
অথবা কম্পিউটারে git থাকলে: `git add -A && git commit -m "update" && git push`

---

## 🔒 Security note

- আপনার license system এখনো অক্ষত: landing page শুধু **marketing surface**; Pro app আগের মতোই Gmail + Password/RCVIP Key-তে locked।
- `downloads/` ফোল্ডার `robots.txt` দিয়ে Google থেকে লুকানো — paid ZIP search-এ আসবে না।
- Login ছাড়া কেউ app-এর ভেতরে ঢুকতে পারবে না (আপনার app.js-ই gatekeeper)।

## ❓ সমস্যা হলে

- Site 404 দেখালে: repo-এর নাম ঠিক আছে কিনা দেখুন (`username.github.io`), আর Settings → Pages-এ source = GitHub Actions কিনা।
- Style ভাঙা দেখালে: `styles.css` আপলোড হয়েছে কিনা দেখুন।
- Login কাজ না করলে: `app.js`, `crypto-license.js`, `offline-catalog.js` তিনটাই আছে কিনা দেখুন।
