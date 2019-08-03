最近做很多HTML5的项目，很多页面会通过微信微博等SNS分享出去。在分享页面上提供公司APP的下载。但是在很多应用的浏览器中，点击下载链接无法下载应用。那么针对这些浏览器我们需要给用户提示从safari或者系统自带的浏览器打开分享页面。**通过js就可以判断当前页面是在什么浏览器打开的。**

以下是一段示例代码，注释中表明了通过JS如何判断是否在微信浏览器打开，是否在QQ空间浏览器，是否在新浪微博打开。当然可以做得更完善一点，再加上判断是在移动设备打开还是在PC端浏览器打开的，更加细分一点，可以判断是在安卓系统的浏览器打开的还是IOS系统浏览器打开的。


  ```javascript
if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
        }
        if (ua.match(/WeiBo/i) == "weibo") {
                //在新浪微博客户端打开
        }
        if (ua.match(/QQ/i) == "qq") {
                //在QQ空间打开
        }
        if (browser.versions.ios) {
                //是否在IOS浏览器打开
        } 
        if(browser.versions.android){
                //是否在安卓浏览器打开
        }
} else {
        //否则就是PC浏览器打开
}

  ```

再附上browser的代码，通过以下方法可以判断很多浏览器。**包括判断IE浏览器，Opera浏览器，苹果浏览器，谷歌浏览器，火狐浏览器等。**

```javascript
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
```

在微信浏览器中监听
```javascript

document.addEventListener("WeixinJSBridgeReady", function() {
					if (browser.versions.ios) {
						//是否在IOS浏览器打开
						console.log('weixin ios');
						$('.browser .ios').show();
						$('.browser .android').hide();
					} else if (browser.versions.android) {
						//是否在安卓浏览器打开
						console.log('weixin android');
						$('.browser .android').show();
					}

					$('.goApplets_title_wx').show();
				}, false);
```
