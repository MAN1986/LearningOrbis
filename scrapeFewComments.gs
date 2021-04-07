function scrapeFewComments(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result=[['Name','Comment','Time','Likes','Reply Count']];
  var vid = ss.getSheets()[0].getRange(1,1).getValue();
  var nextPageToken=undefined;
  var total=1000 //Change this 1000 to any number but multiple of 100
  var t=total/100
  var i=0
 
  while(1){
    var data = YouTube.CommentThreads.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageToken})
    nextPageToken=data.nextPageToken
    i=i+1
    //console.log(nextPageToken);
    for (var row=0; row<data.items.length; row++) {
      result.push([data.items[row].snippet.topLevelComment.snippet.authorDisplayName,
                   data.items[row].snippet.topLevelComment.snippet.textDisplay,
                   data.items[row].snippet.topLevelComment.snippet.publishedAt,
                   data.items[row].snippet.topLevelComment.snippet.likeCount,
                   data.items[row].snippet.totalReplyCount]);
    }
    if(nextPageToken =="" || typeof nextPageToken === "undefined"||i==t){
      break;
    }
  }
var newSheet=ss.insertSheet(ss.getNumSheets())
newSheet.getRange(1, 1,result.length,5).setValues(result)

}
