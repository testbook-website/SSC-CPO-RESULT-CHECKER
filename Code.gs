/**
 * SSC CPO 2025 Result Checker - Google Apps Script
 * Attached to Google Sheet: https://docs.google.com/spreadsheets/d/18p73GRMu5fOb6xOKzSQkGRRNrxdQdBv4i9Hw00b1BZA/edit
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet
 * 2. Click "Extensions" > "Apps Script"
 * 3. Delete any default code in Code.gs and paste this ENTIRE code
 * 4. Click "Save" (Ctrl+S or Floppy disk icon)
 * 5. Click "Deploy" (top right blue button) > "New deployment"
 * 6. Click the gear icon next to "Select type" and choose "Web app"
 * 7. Set Description: "SSC CPO Result Checker API"
 * 8. Set "Execute as": "Me"
 * 9. Set "Who has access": "Anyone" (VERY IMPORTANT: Choose "Anyone" so the widget can log entries)
 * 10. Click "Deploy" and authorize permissions
 * 11. Copy the "Web app URL" (or the Deployment ID) and paste it into config.js in your widget!
 */

const SHEET_ID = "18p73GRMu5fOb6xOKzSQkGRRNrxdQdBv4i9Hw00b1BZA";

function getSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss.getActiveSheet();
  } catch (e) {}
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Timestamp (IST)",
      "Student Name",
      "Roll Number",
      "Mobile Number",
      "Result Status",
      "Official Name (PDF)",
      "Gender",
      "Category",
      "Father's Name",
      "Mother's Name",
      "List Name",
      "Submission Source"
    ];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1e293b"); // Slate dark
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
}

function handleData(payload) {
  const sheet = getSheet();
  ensureHeaders(sheet);

  const timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

  const row = [
    timestamp,
    payload.name || "",
    payload.rollNumber ? "'" + payload.rollNumber : "", // Prefix with ' to preserve leading zeroes in Excel/Sheets
    payload.mobileNumber ? "'" + payload.mobileNumber : "",
    payload.status || "UNKNOWN",
    payload.officialName || "",
    payload.gender || "",
    payload.category || "",
    payload.fatherName || "",
    payload.motherName || "",
    payload.listName || "",
    payload.source || "Widget"
  ];

  sheet.appendRow(row);

  // Apply conditional color to the status cell if desired
  const lastRow = sheet.getLastRow();
  const statusCell = sheet.getRange(lastRow, 5);
  if (payload.status === "QUALIFIED") {
    statusCell.setBackground("#dcfce7"); // Soft green
    statusCell.setFontColor("#15803d");
    statusCell.setFontWeight("bold");
  } else if (payload.status === "NOT QUALIFIED") {
    statusCell.setBackground("#fee2e2"); // Soft red
    statusCell.setFontColor("#b91c1c");
  }

  return {
    success: true,
    message: "Record saved successfully",
    rowNumber: lastRow,
    timestamp: timestamp
  };
}

// Handle POST requests
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const result = handleData(payload);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (allows fallback or test ping)
function doGet(e) {
  try {
    if (e && e.parameter && (e.parameter.rollNumber || e.parameter.name || e.parameter.data)) {
      let payload = e.parameter;
      if (e.parameter.data) {
        try {
          payload = JSON.parse(e.parameter.data);
        } catch (ex) {}
      }
      const result = handleData(payload);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "active",
        service: "SSC CPO Result Checker Logging API",
        timeIST: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss")
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this function inside Apps Script editor to test if your sheet works!
 */
function testSheetLogging() {
  const testPayload = {
    name: "Test Candidate",
    rollNumber: "125130000530",
    mobileNumber: "9876543210",
    status: "QUALIFIED",
    officialName: "DEEPIKA",
    gender: "Female",
    category: "0 (EWS)",
    fatherName: "KRISHAN",
    motherName: "MUKESH DEVI",
    listName: "LIST-1 (Female)",
    source: "Self Test"
  };
  const res = handleData(testPayload);
  Logger.log("Result: " + JSON.stringify(res));
}
