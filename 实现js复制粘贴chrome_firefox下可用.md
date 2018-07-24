用JS操作粘贴板IE下很好用，直接支持一个window.clipboardData对象，通过这个对象可以访问到粘贴板中内容。但是chrome和firefox支持不是很好。Chrome和firefox为什么不支持有点难以理解，为了保护系统，免受外来侵害？

在网上搜了很多资料，但是大部分资料都是介绍在IE下使用window.clipboardData对象访问粘贴板实现Copy和paste，但是单独只为IE开发一个复制、粘贴功能，非常不实用；当然网上还有其他方法，比如通过Flash的间接方式操作OS粘贴板，虽然有这类插件，但是也很不好用，只能用户点击复制按钮才行，而且也不灵活。

  后来想了想，很多页面都是禁止copy的，那么通过浏览器事件，是不是可以访问到粘贴板？查了下资料，IE/Chrome/Firefox都支持oncopy/onpaste/oncut事件，虽然不是在所有元素上都支持。但是这里通过事件的event应该可以访问到用户复制了什么内容，并修改Data。动手实验了下，通过console.debug查看chrome和firefox的event对象，会发现event里面有一个clipboardData对象，所以后面的事情就不难了

虽然Chrome和Firefox下可以通过event获取clipboardData对象，但是要注意在IE下面，copy和paste事件的event对象是没有这个对象的，所以还需要通过window来获取clipboardData，最终代码如下：

```
//绑定在了body上，也可以绑定在其他可用元素行，但是不是所有元素都支持copy和past事件。



$(document.body).bind({



	copy: function(e) {//copy事件



		var cpTxt = "复制的数据";



		var clipboardData = window.clipboardData; //for IE



		if (!clipboardData) { // for chrome



			clipboardData = e.originalEvent.clipboardData;



		}



		//e.clipboardData.getData('text');//可以获取用户选中复制的数据



		clipboardData.setData('Text', cpTxt);



		alert(cpTxt);



		$('#message').text('Copy Data : ' + cpTxt);



		return false;//否则设不生效



	},paste: function(e) {//paste事件



		var eve = e.originalEvent



		var cp = eve.clipboardData;



		var data = null;



		var clipboardData = window.clipboardData; // IE



		if (!clipboardData) { //chrome



			clipboardData = e.originalEvent.clipboardData



		}



		data = clipboardData.getData('Text');



		$('#message').html(data);



	}



});
```

 

通过clipboardData的getData和setData方法就可以和粘贴板交互了。而且要注意的是getData和setData只接受Text和Url两个控制参数，一般用Text参数就够了。