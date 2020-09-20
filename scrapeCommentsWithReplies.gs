function scrapeCommentsWithReplies(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result=[['Name','Comment','Time','Likes','Reply Count','Reply Author','Reply','Published','Updated']];
  var vid = ss.getSheets()[0].getRange(1,1).getValue();
  var nextPageToken=undefined;
  
  while(1){
   
      var data = YouTube.CommentThreads.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageToken})
      nextPageToken=data.nextPageToken
      for (var row=0; row<data.items.length; row++) {
            result.push([data.items[row].snippet.topLevelComment.snippet.authorDisplayName,
                 data.items[row].snippet.topLevelComment.snippet.textDisplay,
                 data.items[row].snippet.topLevelComment.snippet.publishedAt,
                 data.items[row].snippet.topLevelComment.snippet.likeCount,
                 data.items[row].snippet.totalReplyCount,'','','','']);
        if(data.items[row].snippet.totalReplyCount>0){
          parent=data.items[row].snippet.topLevelComment.id
          var nextPageTokenRep=undefined
          while(1){
            var data2=YouTube.Comments.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageTokenRep,parentId:parent})
            nextPageTokenRep=data2.nextPageToken;
            for (var i =data2.items.length-1;i>=0;i--){
              result.push(['','','','','',
                       data2.items[i].snippet.authorDisplayName,
                       data2.items[i].snippet.textDisplay,
                       data2.items[i].snippet.publishedAt,
                       data2.items[i].snippet.updatedAt]);
            }
            if(nextPageTokenRep =="" || typeof nextPageTokenRep === "undefined"){
              break
            }
          } 
        }
      }   
    if(nextPageToken =="" || typeof nextPageToken === "undefined"){
      break;
    }
}

var newSheet=ss.insertSheet(ss.getNumSheets())
newSheet.getRange(1, 1,result.length,9).setValues(result)

}
