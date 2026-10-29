# SSC CPO 2025 Result Checker Widget 🇮🇳

An interactive, responsive, and embeddable widget to check the **SSC CPO 2025 (PST/PET)** exam result for shortlisted candidates appearing in **Paper-II** (Delhi Police & CAPFs).

The widget instantly checks candidate roll numbers against the official qualified lists (10,676 total candidates: 510 Female + 10,166 Male) and captures student details (**Full Name**, **12-Digit Roll Number**, **Mobile Number**, and **Result Status**) into your Google Sheet via Google Apps Script.

---

## 📊 Summary of Extracted Data
- **Examination**: Sub-Inspector in Delhi Police and Central Armed Police Forces Examination, 2025 (PST/PET)
- **LIST-1 (Female Candidates)**: `510` qualified candidates
- **LIST-2 (Male Candidates)**: `10,166` qualified candidates
- **Total Qualified Candidates Indexed**: `10,676` candidates
- **Lookup Speed**: Instantaneous client-side lookup (< 1 millisecond)

---

## 🚀 Quick Setup & Deployment Guide

### Step 1: Set up Google Sheet Integration (Google Apps Script)

Your target Google Sheet:
[Open Google Sheet](https://docs.google.com/spreadsheets/d/18p73GRMu5fOb6xOKzSQkGRRNrxdQdBv4i9Hw00b1BZA/edit?gid=0#gid=0)

1. Open the Google Sheet above in your browser.
2. In the top menu, click **Extensions** > **Apps Script**.
3. In the script editor, delete any default code inside `Code.gs`.
4. Open the `Code.gs` file from this repository, copy all the code, and paste it into the editor.
5. Click **Save** (disk icon or `Ctrl + S`).
6. In the top right corner, click the blue **Deploy** button > **New deployment**.
7. Click the gear icon next to *Select type* and choose **Web app**.
8. Fill in the deployment details:
   - **Description**: `SSC CPO Result Checker API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: This allows the widget to log student submissions)*
9. Click **Deploy**.
10. Click **Authorize access**, select your Google account, click *Advanced*, then click *Go to Untitled project (unsafe)*, and click **Allow**.
11. Copy the generated **Web app URL** (or the **Deployment ID**).
    - Example URL: `https://script.google.com/macros/s/AKfycb.../exec`
    - Or Deployment ID: `AKfycb...`

---

### Step 2: Connect the Web App URL to the Widget

You have two easy ways to connect:

#### Option A: In `config.js` (Permanent for all users)
Open [`config.js`](file:///config.js) and paste your URL or Deployment ID:
```javascript
window.CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  // ...
};
```

#### Option B: Directly inside the Widget UI
1. Open the widget in your browser.
2. Click the **Gear (Settings)** icon in the top right.
3. Paste your Deployment ID or Web App URL.
4. Click **Save & Test**. The widget will automatically store and use it!

---

### Step 3: Push to GitHub & Enable GitHub Pages

Run these commands in PowerShell or Terminal inside this folder:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: SSC CPO Result Checker with 10676 candidates and Apps Script"

# 4. Link your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ssc-cpo-result.git

# 5. Push to GitHub
git push -u origin main
```

#### Enable Free GitHub Pages:
1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/ssc-cpo-result`.
2. Click **Settings** (tab at top) > **Pages** (in left sidebar).
3. Under **Branch**, select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. After 30 seconds, your widget will be live at:
   `https://YOUR_USERNAME.github.io/ssc-cpo-result/`

---

### Step 4: Embed Widget in WordPress / Any Website (Iframe)

Paste this HTML code anywhere in your WordPress post/page (using a "Custom HTML" block) or on any webpage:

```html
<!-- SSC CPO 2025 Result Checker Embed -->
<iframe 
  src="https://YOUR_USERNAME.github.io/ssc-cpo-result/" 
  width="100%" 
  height="720" 
  style="border: none; border-radius: 16px; max-width: 600px; display: block; margin: 20px auto; box-shadow: 0 15px 35px rgba(0,0,0,0.25);" 
  loading="lazy" 
  title="SSC CPO Result Checker 2025"
  allowtransparency="true">
</iframe>
```

---

## 📁 Repository Structure
```
ssc-cpo-result/
├── index.html            # Main responsive widget interface (iframe-ready)
├── style.css             # Modern glassmorphism & responsive design system
├── widget.js             # Controller: validation, search, confetti, Apps Script sync
├── config.js             # Exam details, sheet link & Apps Script configuration
├── candidates_data.js    # Pre-compiled lookup database of 10,676 qualified candidates
├── Code.gs               # Google Apps Script to copy-paste into Google Sheets
├── Female list.pdf       # Official SSC CPO Female Qualified Candidates (List-1)
├── Male List.pdf         # Official SSC CPO Male Qualified Candidates (List-2)
└── README.md             # Complete documentation and setup guide
```

---

## 🔒 Captured Fields in Google Sheet
Every time a student checks their result, the following row is appended:
1. **Timestamp (IST)**
2. **Student Name** (as entered in form)
3. **Roll Number** (12 digits)
4. **Mobile Number** (10 digits)
5. **Result Status** (`QUALIFIED` in green / `NOT QUALIFIED` in red)
6. **Official Name** (extracted from official SSC PDF)
7. **Gender** (`Female` / `Male`)
8. **Category** (e.g. `0 - EWS`, `1 - SC`, `6 - OBC`, `9 - UR`)
9. **Father's Name** (from official list)
10. **Mother's Name** (from official list)
11. **List Name** (`LIST-1` / `LIST-2`)
12. **Submission Source** (`Iframe / Hostname`)
