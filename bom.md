					第13单元  BOM（1）

课程目标产出:

    1、了解什么是BOM
    
    2、掌握window对象的部分属性和方法
    
    3、重点掌握超时调用和间歇调用
    
    				    知识点


一、什么是BOM

    BOM（browser object model）浏览器对象模型
    
    它提供了很多对象，用于访问浏览器的功能。BOM缺少规范，每个浏览器提供商又

按照自己想法去扩展它，那么浏览器共有对象就成了事实的标准。所以，BOM本身是没

有标准的或者还没有哪个组织去标准它。

二、window对象

    BOM的核心对象是window，它表示浏览器的一个实例。
    
    全局作用域：所有在全局作用域中声明的变量、函数都会变成window对象的属性
和方法。	
​	
	var num = 2; ===>  window.num = 2
	
	var fn = function(){} ===> window.fn = function(){}

  1、对象的部分方法 

    *系统对话框
    
       1) alert() ==> 系统弹出框
    
       2) prompt( 提示字符串1 , 提示字符串2 ) ==> 输入弹出框
       		点击确定返回输入的内容 ==> 字符串
       		点击取消或关闭返回 null ==> object 
    
       3) confirm() ==> 确认弹出框
            点击确定返回 true
            点击取消或关闭返回 false
    
            var flag = confirm("您确定要删除么?");
            if( flag ){
            	// 删除操作
            }
    
    * 超时调用和间歇调用
    
    1) setTimeout() 超时调用 ==> 只执行一次
    
    	语法结构: setTimeout( 要执行的语句或函数,延时时间ms )
    
    2) clearTimeout(id)  ==> 清除超时调用
    
    3) setInterval()  间歇调用  ==》 重复执行
    	语法结构: setInterval( 要执行的语句或函数,间隔时间ms )
    4) clearInterval( id ) 清除间歇调用
    
    * window.open()
    
    window.open()方法可以导航到一个特定的URL，也可以打开一个新的浏览器窗口。
    
    它可以接受四个参数：
    
    1.要加载的URL；
    
    2.窗口的名称或窗口目标；
    
    3.一个特性字符串，用于设置窗口的某些属性值；
    
    4.一个表示新页面是否取代浏览器记录中当前加载页面的布尔值。
    
    * window.close()
    
    关闭新打开的窗口。
    
    newWindow.close()
					第13单元  BOM（2）
课程目标产出:

    1、掌握location对象部分属性和方法
    
    2、了解history对象
    
    3、了解screen对象
    
    4、了解navigator对象
    				    知识点


一、location对象 ==》 重点
​    
    location是BOM对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。
    
    *location对象的部分常用属性
    
    1）location.href
    
      功能：返回当前加载页面的完整URL
    
    2）location.hash
    
      功能：返回URL中的hash（#号后的字符包括#），如果不包含则返回
空字符串

	3）location.search
	
	  功能：返回URL的查询字符串。这个字符串以问号开头(包括?)。
	
	*location的位置操作
	
	1）改变浏览器位置的方法中，最常用的是设置location.href属性
	
		location.href = url;


​	
二、history对象  ==》 了解

	history对象是window对象的属性，它保存着用户上网的记录，从窗口被打开的那一刻算起。
	
	1）history.go(-n)
	
	  功能：回到历史记录的前n步
	
	2）history.go(n)
	
	  功能：回到历史记录的后n步
	
	3）history.back()
	
	  功能：回到历史记录的上一步
说明：相当于使用了history.go(-1)

	4）history.forward()
	
	  功能：回到历史记录的下一步
说明：相当于使用了history.go(1)

	注意 ===》 可以通过判断history.length == 0，得到是否有历史记录。
	
		history.length = 0;// 清空历史记录
	
		history.go( 0 );// 刷新页面 

三、screen对象 ==》 了解

     screen对象用于获取用户的屏幕信息。
    
     screen用于表明客户端的能力。


四、navigator对象 ==》 了解

     识别客户端浏览器的事实标准。