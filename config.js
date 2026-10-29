/**
 * SSC CPO 2025 Result Checker - Configuration
 *
 * HOW TO CONNECT YOUR GOOGLE SHEET:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/18p73GRMu5fOb6xOKzSQkGRRNrxdQdBv4i9Hw00b1BZA/edit
 * 2. Go to Extensions > Apps Script and paste the Code.gs script.
 * 3. Deploy as Web App (Execute as: "Me", Who has access: "Anyone").
 * 4. Paste your Web App URL or Deployment ID below in GOOGLE_SCRIPT_URL:
 *    Example: "https://script.google.com/macros/s/AKfycb.../exec"
 *    Or simply: "AKfycb..."
 */

window.CONFIG = {
  // Paste your Google Apps Script Web App URL or Deployment ID here:
  GOOGLE_SCRIPT_URL: "",

  // Google Sheet Link (for reference)
  SHEET_URL: "https://docs.google.com/spreadsheets/d/18p73GRMu5fOb6xOKzSQkGRRNrxdQdBv4i9Hw00b1BZA/edit?gid=0#gid=0",

  // Examination Details
  EXAM_TITLE: "SSC CPO 2025 (PST/PET)",
  EXAM_SUBTITLE: "Sub-Inspector in Delhi Police & CAPFs Examination, 2025",
  STAGE_NAME: "List of Candidates Qualified in PST/PET for Appearing in Paper-II",

  // Stats
  TOTAL_QUALIFIED: 10676,
  FEMALE_QUALIFIED: 510,
  MALE_QUALIFIED: 10166,

  // Category Code Decoders as per SSC Standards
  CATEGORY_MAP: {
    "0": "EWS (Economically Weaker Section)",
    "1": "SC (Scheduled Caste)",
    "2": "ST (Scheduled Tribe)",
    "3": "ESM (Ex-Servicemen)",
    "4": "OH (Orthopaedically Handicapped)",
    "5": "HH (Hearing Handicapped)",
    "6": "OBC (Other Backward Classes)",
    "7": "VH (Visually Handicapped)",
    "8": "Other PWD",
    "9": "UR (Unreserved / General)"
  }
};
