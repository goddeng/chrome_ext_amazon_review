var flag = false;
var currentTabId;
chrome.browserAction.onClicked.addListener(function(tab) {
	counter = 40;
	console.log('Turning ' + tab.url);
	flag = true;
	currentTabId = tab.id;
	chrome.tabs.getSelected(null, function(tab) {
		sendMsg(tab.id);
	});
});


chrome.webNavigation.onCompleted.addListener(function( tab ){
	console.log('加载完成***' + tab.tabId );
	if( flag ){
		sendMsg( tab.tabId );
	}
});

chrome.extension.onMessage.addListener(

function(request, sender, sendResponse) {
	console.log("*******evenPage.js***chrome.extension.onMessage.addListener"); 
	articleData = request;
	$.ajax({
		url: "http://edc.boxintheship.com/collect/tools/amazon/reviewreceivedata",
		cache: false,
		type: "POST",
		data: {'listReview': request.msg.join("#$#")},
		dataType: "json"
		}).done(function(msg) {
			console.log('*******************json*************' + msg.sql );
			chrome.tabs.sendMessage(currentTabId, {"cmd":"end"}, 
			function(response) { 
				console.log(response); 
			});
}).fail(function(jqXHR, textStatus) {
	articleData.firstAccess = textStatus;
});
cmd = request.cmd;
if('end' == cmd){
	flag = false;//确保不会自动运行
		iconBlack();
}
});

function sendMsg( tabid ){
	console.log(tabid + "--sendMsg()----eventPage.js");
	chrome.tabs.sendMessage(tabid, {greeting: "start working"}, function(response) {
	});
}