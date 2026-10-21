# RC Microstock Research Pro v3.4 — by Riad Chowdhury

Live microstock design research suite: Adobe Stock, Freepik, Vecteezy, Shutterstock,
Creative Fabrica ও Pngtree-এর লাইভ রিসার্চ, AI Prompt + Adobe Stock Bulk CSV Generator,
Niche Score & 49 SEO Tags, Seasonal Event Calendar (24h auto-sync), Passive Income
Calculator (USD/BDT), URL Inspector, Personal Tracker ও Chrome Extension।

- **Live site (primary):** https://riad-chowdhury-pro.netlify.app/
- **Mirror:** https://riad6653.github.io/
- **Owner/Admin:** Riad Chowdhury • WhatsApp +880 1618-674044
- **Deploy guide (বাংলা):** [`DEPLOY-GUIDE-BN.md`](DEPLOY-GUIDE-BN.md)
- **One-click deploy:** `deploy-windows.bat` (Windows) / `deploy-mac-linux.sh` (Mac/Linux)
- **Auto-deploy:** push to `main` → GitHub Actions → GitHub Pages (`.github/workflows/deploy-pages.yml`)

## Structure

```
index.html            SEO landing (public) + lock-gated Pro app
styles.css            app styles (integrated)
app.js                app logic (integrated)
crypto-license.js     RCVIP license system (integrated)
offline-catalog.js    offline design catalog (integrated)
assets/               logo, favicon, OG cover
downloads/            paid ZIPs রাখুন (robots.txt-এ Google থেকে ব্লক) — এখনো আপলোড বাকি
robots.txt sitemap.xml 404.html .nojekyll
```

Landing gate: লগইন না করা visitor প্রথমে public landing page দেখে (যেটা Google index করে);
লগইন সফল হলে আপনার আসল lock-flow অনুযায়ী Pro workspace খুলে যায়। `?app` বা `#app` দিয়ে সরাসরি app-এ যাওয়া যায়।
