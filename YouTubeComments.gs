function scrapComments(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result=[['Name','Comment','Time','Likes','Reply Count']];
  var vid = ss.getSheetByName('Sheet1').getRange(1,1).getValue();
  var nextPageToken=undefined;
  var data = YouTube.CommentThreads.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageToken});
  nextPageToken=data.nextPageToken;
  //console.log(nextPageToken);
  for (var row=0; row<data.items.length; row++) {
    result.push([data.items[row].snippet.topLevelComment.snippet.authorDisplayName,
                 data.items[row].snippet.topLevelComment.snippet.textDisplay,
                 data.items[row].snippet.topLevelComment.snippet.publishedAt,
                 data.items[row].snippet.topLevelComment.snippet.likeCount,
                 data.items[row].snippet.totalReplyCount]);
  }
  //console.log(result.length)
  //console.log(result);
  
  var i=0
  while(1){
    if(nextPageToken =="" || typeof nextPageToken === "undefined"){
      break;
    }
    else{
      i=i+1
      var data = YouTube.CommentThreads.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageToken})
      nextPageToken=data.nextPageToken
      //console.log(nextPageToken);
      for (var row=0; row<data.items.length; row++) {
        result.push([data.items[row].snippet.topLevelComment.snippet.authorDisplayName,
                     data.items[row].snippet.topLevelComment.snippet.textDisplay,
                     data.items[row].snippet.topLevelComment.snippet.publishedAt,
                     data.items[row].snippet.topLevelComment.snippet.likeCount,
                     data.items[row].snippet.totalReplyCount]);
      }
    }
}
var newSheet=ss.insertSheet(1)
newSheet.getRange(1, 1,result.length,5).setValues(result)

}
