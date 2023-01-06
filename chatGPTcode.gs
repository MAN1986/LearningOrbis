function generateInvitationPDFs() {
  // Get the active sheet
  var sheet = SpreadsheetApp.getActiveSheet();

  // Get the data range for the sheet
  var dataRange = sheet.getDataRange();

  // Get the values from the sheet
  var data = dataRange.getValues();

  // Loop through each row in the sheet
  for (var i = 1; i < data.length; i++) {
    // Get the current row
    var row = data[i];

    // Get the first name, last name, time, zoom link, and email
    var firstName = row[0];
    var lastName = row[1];
    var time = row[2];
    var zoomLink = row[3];
    var email = row[4];

    // Make a copy of the template document
    var docId = DriveApp.getFileById("ID of Doc Template").makeCopy("Invitation from Learning Orbis").getId();
    var doc = DocumentApp.openById(docId);

    // Replace the placeholders in the document with the appropriate values
    doc.getBody().replaceText("{{First}}", firstName);
    doc.getBody().replaceText("{{Last}}", lastName);
    doc.getBody().replaceText("{{Meeting Time}}", time);
    doc.getBody().replaceText("{{Zoom Link}}", zoomLink);
    doc.getBody().replaceText("{{Today}}", new Date().toLocaleDateString());
    doc.saveAndClose()

    // Save the document as a PDF
    var pdf = doc.getAs("application/pdf");

    // Send the PDF as an email attachment
    GmailApp.sendEmail(email, "Invitation from Learning Orbis", "", {
      attachments: [pdf]
    });

    // Delete the temporary document
    DriveApp.getFileById(docId).setTrashed(true);
  }
}
