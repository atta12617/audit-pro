# AdAudit Pro — Deployment Guide

## What you're deploying
A full-stack AI ad audit tool with:
- Landing page with CTA
- WhatsApp number collection + OTP verification gate
- 7-step intake form (47 questions)
- CSV upload for Meta + Google exports
- AI-powered audit report (via Anthropic API, server-side)
- Feedback collection with star rating
- All tester data logged to Netlify function logs (or Google Sheets)

---

## Deploy in 10 minutes (free)

### Step 1 — Create a GitHub repo
1. Go to github.com → New repository → name it `adaudit-pro`
2. Upload all files from this folder maintaining the structure:
   ```
   adaudit-pro/
   ├── netlify.toml
   ├── public/
   │   └── index.html
   └── netlify/
       └── functions/
           ├── audit.js
           └── feedback.js
   ```

### Step 2 — Deploy on Netlify (free)
1. Go to app.netlify.com → "Add new site" → "Import from Git"
2. Connect your GitHub account → select `adaudit-pro`
3. Build settings: leave everything blank (no build command needed)
4. Click "Deploy site"
5. Your site will be live at: `https://random-name.netlify.app`

### Step 3 — Add your Anthropic API key
1. In Netlify dashboard → Site settings → Environment variables
2. Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Redeploy (Deploys tab → Trigger deploy)

### Step 4 — Set a custom subdomain (optional but looks professional)
1. Netlify dashboard → Domain management → Options → Edit site name
2. Set it to something like `adauditpro` → your URL becomes `adauditpro.netlify.app`

### Step 5 — Collect feedback in Google Sheets (optional)
1. Create a Google Sheet
2. Go to Extensions → Apps Script → paste this:
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.ts, data.name, data.phone, data.role,
    data.rating, data.whatUseful, data.improve, data.missing,
    data.client, data.platforms
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```
3. Deploy as Web App → Anyone → Copy the URL
4. Add to Netlify env vars: `FEEDBACK_WEBHOOK_URL` = that URL
5. In `public/index.html`, uncomment the fetch line in `submitFeedback()`
6. In `netlify/functions/audit.js`, uncomment the fetch line in `logTester()`

---

## Collecting WhatsApp numbers for real (production)

The OTP in this demo shows the code on screen. To send real WhatsApp OTPs:

### Option A — Twilio (easiest, ~$0.005/message)
1. Create account at twilio.com
2. Get a WhatsApp-enabled number
3. Add to Netlify env: `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
4. Replace the OTP section in `audit.js` with Twilio's WhatsApp API

### Option B — WhatsApp Business API via 360dialog (cheaper for scale)
1. Sign up at 360dialog.com
2. Connect your WhatsApp Business number
3. Use their API to send template messages

### Option C — Manual (works fine for first 20 testers)
The current setup shows the OTP on screen. For your first 20 beta testers,
you can collect numbers from the Netlify logs and message them manually on WhatsApp.
This is actually fine for beta — keeps it personal.

---

## Your shareable link
Once deployed: `https://adauditpro.netlify.app`

Share this in:
- Facebook groups for digital marketers
- LinkedIn post
- Direct DM to freelancers on Upwork
- WhatsApp marketing groups

---

## Monitoring testers
- Netlify dashboard → Functions → audit → View logs (see every audit run)
- Netlify dashboard → Functions → feedback → View logs (see all feedback)
- Google Sheets (if webhook set up) for a clean spreadsheet view

## Updating the tool
Just push changes to GitHub — Netlify auto-deploys in ~30 seconds.
