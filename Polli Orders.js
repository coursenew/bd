// Google Apps Script কোড - পুরোপুরি নতুন করে দিন
function doPost(e) {
  try {
    const sheetId = 'https://script.google.com/macros/s/AKfycbzvAinnzNmBpzsWdGeosKYx-eHOhoJzo5dU2oV8q0moThgRV87CZrYV5kmYjhhI_519/exec'; // 👈 আপনার Sheet এর আইডি দিন
    const data = JSON.parse(e.postData.contents);
    
    // আজকের তারিখ
    const today = new Date();
    const dateStr = Utilities.formatDate(today, 'Asia/Dhaka', 'yyyy-MM-dd');
    
    // Sheet ওপেন করুন
    const ss = SpreadsheetApp.openById(sheetId);
    let sheet = ss.getSheetByName(dateStr);
    
    // নতুন শীট তৈরি করুন যদি না থাকে
    if (!sheet) {
      sheet = ss.insertSheet(dateStr);
      // হেডার সেট করুন
      const headers = ['টাইমস্ট্যাম্প', 'নাম', 'ফোন', 'ঠিকানা', 'কোর্সের নাম', 'কোর্সের দাম', 'প্রশ্ন', 'স্ট্যাটাস'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // ডাটা যোগ করুন
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1).setValue(new Date()); // টাইমস্ট্যাম্প
    sheet.getRange(newRow, 2).setValue(data.name);
    sheet.getRange(newRow, 3).setValue(data.phone);
    sheet.getRange(newRow, 4).setValue(data.address);
    sheet.getRange(newRow, 5).setValue(data.courseTitle);
    sheet.getRange(newRow, 6).setValue(data.coursePrice);
    sheet.getRange(newRow, 7).setValue(data.message || '');
    sheet.getRange(newRow, 8).setValue('INACTIVE');
    
    // সাকসেস রেসপন্স
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved', sheet: dateStr }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET রিকোয়েস্ট হ্যান্ডেল (টেস্টিং এর জন্য)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'Web App is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
