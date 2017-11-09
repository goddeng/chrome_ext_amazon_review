var nextPage;

//注册前台页面监听事件
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		getlistReview( sendResponse );
	});

//获取下一页URL
function getNextPage(){	
	var np=$("ul.a-pagination li:last a");
	var first=false;
	if(np.length > 0){
			url = $("ul.a-pagination li:last a").attr("href");
			if(url.indexOf("pageSize") > 0 ){
				//url=changeURLArg(url,'pageSize',50);
				if(getQueryString("pageSize")!=50){
					url=changeURLArg(url,'pageSize',50);
					first=true;
				}
			}else{
				url+="&pageSize=50";
				first=true;
			}
			if(url.indexOf("sortBy") > 0 ) { 
				url=changeURLArg(url,'sortBy','recent');
			}else{
				url+="&sortBy=recent";
			}
			if(first){
					if(url.indexOf("reviewerType") > 0){
						url=changeURLArg(url,'reviewerType','all_reviews');
					}
					if(url.indexOf("pageNumber") > 0){
						url=changeURLArg(url,'pageNumber',1);
					}
			}
			return url;
	}
	return '';
}

//获取参数值
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

//替换url的参数值
function changeURLArg(url,arg,arg_val){ 
    var pattern=arg+'=([^&]*)'; 
    var replaceText=arg+'='+arg_val; 
    if(url.match(pattern)){ 
        var tmp='/('+ arg+'=)([^&]*)/gi'; 
        tmp=url.replace(eval(tmp),replaceText); 
        return tmp; 
    }else{ 
        if(url.match('[\?]')){ 
            return url+'&'+replaceText; 
        }else{ 
            return url+'?'+replaceText; 
        } 
    } 
    return url+'\n'+arg+'\n'+arg_val; 
} 

//获取ASIN
function getAsinCode(){
	var url = window.location.href;
	urlArr=url.split("/");
	for(i=0; i<urlArr.length; i++){
		if(urlArr[i]=='product-reviews'){
			return urlArr[i+1];
		}
	}
	return '';
}


//获取评论列表
function getlistReview( sendResponse ){
	listReview=[];
	splitstr = "@_@";
	$("#cm_cr-review_list div[data-hook=review]").each(function(){
	var rplatform=document.domain;
	var rsellerid = $("div.a-row.product-by-line > a").text();
	var rasin = getAsinCode();
    var rid = $(this).attr('id');
	var rstar=parseInt($(this).find("i[data-hook=review-star-rating] span").text());
	var rtitle=$(this).find("a[data-hook=review-title]").text();
	var rauthor=$(this).find("a[data-hook=review-author]").text();
	var ravp=$(this).find("span[data-hook=avp-badge]").text();
	var rcontents=$(this).find("span[data-hook=review-body]").text().replace(/[\r\n]\ +/g,"");
	var rhelpful=parseInt($(this).find("span[data-hook=helpful-vote-statement]").text());
	var rattr=$(this).find("a[data-hook=format-strip]").text().replace(/[\r\n]\ +/g,"");
	var rdate=$(this).find("span[data-hook=review-date]").text();
	var rproductTtitle=$("h1 a[data-hook=product-link]").text();
	var rproductReviewLink=window.location.href;

    listReview.push(
		rplatform+splitstr+
		rsellerid+splitstr+
		rasin+splitstr+
		rid+splitstr+
		rstar+splitstr+
		rtitle+splitstr+
		rauthor+splitstr+
		ravp+splitstr+
		rcontents+splitstr+
		rhelpful+splitstr+
		rattr+splitstr+
		rdate+splitstr+
		rproductTtitle+splitstr+
		rproductReviewLink
	);
  });

	if(listReview.length > 0){
		//判断是否有下一页
		nextPage=getNextPage();
		if(nextPage.length > 0){
			console.log("---------next-------");
			sendMsg( listReview, "next" );
			   console.log(nextPage);
				window.location.href = nextPage;
		}else{
			console.log("---------end-------");
			sendMsg( listReview, "end" );
			   window.open('http://edc.boxintheship.com/collect/tools/amazon/getasinreviews/');
		}
	}else{
		console.log("---------end-------");
		sendMsg( listReview, "end" );
		window.open('http://edc.boxintheship.com/collect/tools/amazon/getasinreviews/');
	}
}

//将获取内容传递给后台文件进行处理
function sendMsg( msg, cmd){
	chrome.extension.sendMessage({"msg": msg, "cmd": cmd}, function(response) {});
}