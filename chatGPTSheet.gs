function onOpen() {
   SpreadsheetApp.getUi().createMenu("OpenAI")
    .addItem("Generate Text", "generateText")
    .addItem("Generate Images", "generateImages")
    .addToUi();
}
function generateText(){
  var sh = SpreadsheetApp.getActiveSheet()
  var data = sh.getDataRange().getValues()
  var apiKey = "YOUR API KEY";
  var model = "text-davinci-003"
  temperature= 0
  maxTokens = 2500
  var textData=[]

  for (var i =1; i<data.length; i++){
    var prompt = data[i][0]
    const requestBody = {
      "model": model,
      "prompt": prompt,
      "temperature": temperature,
      "max_tokens": maxTokens,
    };

    const requestOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+apiKey
      },
      "payload": JSON.stringify(requestBody)
    }

  // Call the OpenAI API

    const response = UrlFetchApp.fetch("https://api.openai.com/v1/completions", requestOptions);
    var responseText = response.getContentText();
    var json = JSON.parse(responseText);
    textData.push ([json['choices'][0]['text']])
  }
  sh.getRange(2,2,textData.length,1).setValues(textData)
}

function generateImages(){
  var sh = SpreadsheetApp.getActiveSheet()
  var data = sh.getDataRange().getValues()
  var apiKey = "YOUR API KEY";
  temperature= 0
  maxTokens = 2500
  var imageLinks=[]
  for (var i =1; i<data.length; i++){
    var prompt = data[i][0]
    const requestBody2 = {
      "prompt": prompt,
      "n": 2,
      "size": "512x512"
    };

    const requestOptions2 = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+apiKey
      },
      "payload": JSON.stringify(requestBody2)
    }
    const response = UrlFetchApp.fetch("https://api.openai.com/v1/images/generations", requestOptions2);
    // Parse the response and get the generated text
    var responseText = response.getContentText();
    var json = JSON.parse(responseText);
    var url1=json['data'][0]['url']
    var url2=json['data'][1]['url']

    var im1=UrlFetchApp.fetch(url1).getContent()
    var blob1 = Utilities.newBlob(im1, 'image/png', data[i][0]+'-Image1');
    var save1 = DriveApp.createFile(blob1);
    var imgUrl1 = save1.getUrl();
    var im2=UrlFetchApp.fetch(url2).getContent()
    var blob2 = Utilities.newBlob(im2, 'image/png', data[i][0]+'-Image2');
    var save2 = DriveApp.createFile(blob2);
    var imgUrl2 = save2.getUrl();
    imageLinks.push([imgUrl1,imgUrl2])
  }
  Logger.log(imageLinks)
  sh.getRange(2,3,imageLinks.length,2).setValues(imageLinks)
}
