# Technotreon AI Chatbot – Deployment Guide
# Powered by Google Gemini (100% Free API)

## Project Files

```
technotreon-gemini/
├── public/
│   └── chatbot.html     ← Chatbot UI (floating widget)
├── server.js            ← Node.js backend (keeps API key safe)
├── package.json         ← Node dependencies
├── .env.example         ← Rename to .env and fill your key
├── .gitignore
└── README.md
```

---

## STEP 1 – Get Your FREE Gemini API Key

1. Go to → https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. It's FREE with 60 requests/minute, 1500 requests/day – no credit card needed

---

## STEP 2 – Run Locally (Test First)

```bash
# Make sure Node.js v18+ is installed
# Download from: https://nodejs.org

# Install project dependencies
cd technotreon-gemini
npm install

# Create your .env file
cp .env.example .env

# Open .env in any text editor and replace:
# GEMINI_API_KEY=AIza_REPLACE_WITH_YOUR_KEY
# → paste your actual key here

# Start the server
npm start

# Open in your browser:
# http://localhost:3000/chatbot.html
```

You should see the Technotreon chatbot floating widget. Test a few messages!

---

## STEP 3 – Deploy FREE to the Internet

### Option A: Railway (Recommended – Free tier, no credit card)

1. Create a free account at https://railway.app
2. Push your project folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Technotreon AI chatbot"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/technotreon-ai.git
   git push -u origin main
   ```
3. In Railway → New Project → Deploy from GitHub → select your repo
4. Go to Variables tab → Add:
   - `GEMINI_API_KEY` = your key
   - `ALLOWED_ORIGIN` = https://technotreon.in
   - `PORT` = 3000
5. Railway gives you a live URL like:
   `https://technotreon-ai-production.up.railway.app`

---

### Option B: Render (Free tier)

1. Go to https://render.com → Sign up free
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Environment Variables:
   - `GEMINI_API_KEY` = your key
   - `PORT` = 3000
5. Your live URL:
   `https://technotreon-ai.onrender.com`

Note: Free tier on Render sleeps after 15 min inactivity (first message may be slow).

---

### Option C: Vercel (Free, instant deploys)

Convert to serverless — create `/api/chat.js`:
```js
export default async function handler(req, res) {
  // paste the /api/chat logic from server.js here
}
```
Then deploy with:
```bash
npm install -g vercel
vercel
```

---

## STEP 4 – Embed on technotreon.in

### Floating Widget (Recommended)
Add before `</body>` on any page of your website:
```html
<!-- Technotreon AI Chatbot -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://YOUR-RAILWAY-URL.up.railway.app/chatbot.html';
    iframe.style = 'position:fixed;bottom:0;right:0;width:420px;height:700px;border:none;z-index:9999;background:transparent';
    iframe.allow = 'clipboard-write';
    document.body.appendChild(iframe);
  })();
</script>
```

### Full Page Embed
```html
<iframe
  src="https://YOUR-RAILWAY-URL.up.railway.app/chatbot.html"
  style="width:100%;height:650px;border:none;border-radius:16px;"
  title="Technotreon AI Assistant">
</iframe>
```

---

## STEP 5 – Collect Leads (Optional Integrations)

Leads are logged in server console by default. To receive them by email:

### Gmail via Nodemailer:
```bash
npm install nodemailer
```
Add to .env:
```
EMAIL_USER=technotreon@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx   # Gmail App Password
```
Uncomment the Nodemailer block in server.js `/api/lead` endpoint.

### Google Sheets (no code):
Use https://sheet.best — connect a Google Sheet, get an API endpoint.
Uncomment the sheet.best block in server.js.

---

## Gemini Free Tier Limits

| Limit          | Value                      |
|----------------|----------------------------|
| Requests/min   | 15 RPM (free)              |
| Requests/day   | 1,500 RPD (free)           |
| Tokens/min     | 1 million TPM              |
| Cost           | $0 – completely free       |
| Model used     | gemini-1.5-flash           |

For higher traffic, upgrade to Gemini paid tier (~$0.075 per 1M tokens).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "GEMINI_API_KEY not set" | Check your .env file has the key |
| Chat not responding | Check server logs: `npm start` |
| CORS error | Set ALLOWED_ORIGIN in .env to your domain |
| Render slow first message | Normal – free tier sleeps; use Railway instead |
| 429 rate limit error | Too many requests; wait 1 min or upgrade |

---

## Need Help?

Contact Technotreon: https://technotreon.in/contact-us
Office Hours: Monday–Saturday, 10:00 AM – 7:00 PM IST
