**问题描述**：实现当页面主体内容少于一个屏幕时，footer固定在屏幕底部，当页面内容超过一个屏幕时，在内容的后面

## 方法一

```html
<div id="container"> 
	<div id="header">Header Section</div> 
	<div id="page" class="clearfix"> 
		页面容容部分 
	</div> 
	<div id="footer">Footer Section</div> 
</div> 
```

```css
html,body { 
    margin: 0; 
    padding:0; 
    height: 100%; 
} 
#container { 
    min-height:100%; 
    height: auto !important; 
    height: 100%; /*IE6不识别min-height*/ 
    position: relative; 
} 
#header { 
    background: #ff0; 
    padding: 10px; 
} 
#page { 
    width: 960px; 
    margin: 0 auto; 
    padding-bottom: 60px;/*等于footer的高度*/ 
} 
#footer { 
    position: absolute; 
    bottom: 0; 
    width: 100%; 
    height: 60px;/*脚部的高度*/ 
    background: #6cf; 
    clear:both; 
} 
```



其中div#container是一个容器，在这个容器之中，包含了header，page（页面主体部分，可以在这里增加更多的div结构），footer。<br>

1. html，body必须将高度设置为100%，这样就可以在容器上设置百分比高度
2. div#container容器必须设置最小高度（min-height）为100%，这样在内容很少时候能保持100%的高度，病为其设置`position:relative`
3. div#page要有padding-bottom，这个值要等于或略大于footer的高度，**千万不要用margin-bottom代替padding-bottom**，不然无法实现效果；
4. div#footer容器**必须有固定的高**。footer还要有`position:absolute;bottom:0`使footer固定在container内的最底部

## 方法二：利用footer的margin-top负值来实现

```html
<div id="container"> 
	<div id="page">Main Content</div> 
</div> 
<div id="footer">footer</div> 
```

```css
html, 
body { 
    height: 100%; 
    margin: 0; 
    padding: 0; 
} 
#container { 
    min-height: 100%; 
    height: auto !important; 
    height: 100%; 
} 
#page { 
	padding-bottom: 60px;/*高度等于footer的高度*/ 
} 
#footer { 
    position: relative; 
    margin-top: -60px;/*等于footer的高度*/ 
    height: 60px; 
    clear:both; 
    background: #c6f; 
} 
```

方法一和方法二有几点是完全相同的，比如说方法一中的1-3三点，在方法二中都一样，换句话说，方法二中也需要把html,body高度设置为100%,并重置margin,padding为0；其二div#container也需要设置min-height:100%,并处理好IE6下的min-height兼容问题；其三也需要在div#page容器上设置一个padding-bottom或border-bottom-width值等于div#footer高度值（或略大于）。**那么两种方法不同之处是**： 

1. div#footer放在div#container容器外面，也就是说两者是同级关系，如果你有新元素需要放置在与div#container容器同级，那你需要将此元素进行绝对定位，不然将会破坏div#container容器的min-height值； 
2. div#footer进行margin-top的负值设置，并且此值等于div#footer的高度值，而且也要和div#page容器的padding-bottom(或border-bottom-width)值相等。 
  优点： 结构简单清晰，无需js和任何hack能实现各浏览器下的兼容。 <br>
  缺点： 要给footer设置固定值，因此无法让footer部分自适应高度。

## 方法三

```html
<div id="container"> 
    <div id="page">Your Website content here.</div> 
    <div class="push"><!-- not have any content --></div> 
</div> 
<div id="footer">Footer Section</div> 
```

```css
html, 
body{ 
    height: 100%; 
    margin:0; 
    padding:0; 
} 
#container { 
    min-height: 100%; 
    height: auto !important; 
    height: 100%; 
    margin: 0 auto -60px;/*margin-bottom的负值等于footer高度*/ 
} 
.push, 
#footer { 
    height: 60px; 
    clear:both; 
} 
```

  跟前面两种方法相比较，方法三更类似于方法二，他们都将div#footer放在div#container容器之外，而且这个方法在div#container容器中还增加了一个div.push用来把div#footer推下去，下面我们就一起看看这种方法是怎么实现页脚永远固定在页面底部的。

1. <html>和<body>标签：html,body标签和前两种方法一样，需要设置“height:100%”并重置“margin”和“padding”为0；
2. div#container:方法三关键部分就在于div#container的设置，首先需要设置其最小高度（min-height）为100％,为了能兼容好IE6，需要对min-height进行兼容处理（具体处理方法看前面或代码）另外这里还有一个关键点在div#container容器上需要设置一个margin-bottom，并且给其取负值，而且值的大小等于div#footer和div.push的高度，如果div#footer和div.push设置了padding和border值，那么div#container的margin-bottom负值需要加上div#footer和div.push的padding和border值。也就是说“div#container{margin-bottom:-[div#footer的height+padding+border]或者-[div.push的height+padding+border]}”。一句话来说：div#container的margin-bottom负值需要和div#footer以及div.push的高度一致（如果有padding或border时，高度值需要加上他们）； 
3. div.push:在div.push中我们不应该放置任何内容，而且这个div必须放置在div#container容器中，而且是最底部，并且需要设置其高度值等于div#footer的值，最好加上clear:both来清除浮动。div.push容器在此处所起的作用就是将footer往下推。 
4. div#footer容器：div#footer容器和方法二一样，不能放到div#container内部，而和div#container容器同级，如果需要设置元素和footer之间的间距，最好使用padding来代替margin值。 
  优点： 简单明了，易于理解，兼容所有浏览器。 <br>
  缺点： 较之前面的两种方法，多使用了一个div.push容器，同样此方法限制了footer部分高度，无法达到自适应高度效果。   

## 方法四

```html
<div id="header">Header Section</div> 
<div id="page" class="clearfix"> 
    <div id="left">Left sidebar</div> 
    <div id="content">Main Content</div> 
    <div id="right">Right Content</div> 
</div> 
<div id="footer">Footer Section</div> 
```

```css
*{margin: 0;padding:0;} 
.clearfix:before, 
.clearfix:after { 
    content:""; 
    display:table; 
} 
.clearfix:after { 
	clear:both; 
} 
.clearfix { 
	zoom:1; /* IE <8 */ 
} 
#footer{ 
    height: 60px; 
    background: #fc6; 
    width: 100%; 
} 
```

这个方法不像前面三种方法靠CSS来实现效果，这里只需要按正常的样式需求写样式，不过有一点需要特别注意在html,body中不可以设置高度height为100%，否则此方法无法正常运行，如果你在div#footer中设置了一个高度并把宽度设置为100%将更是万无一失了。 

```javascript
<script type="text/javascript">
		// Window load event used just in case window height is dependant upon images 
		$(window).bind("load", function () {
			var footerHeight = 0,
				footerTop = 0,
				$footer = $("#footer");
			positionFooter();
			//定义positionFooter function 
			function positionFooter() {
				//取到div#footer高度 
				footerHeight = $footer.height();
				//div#footer离屏幕顶部的距离 
				footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";
				/* DEBUGGING STUFF 
				console.log("Document height: ", $(document.body).height()); 
				console.log("Window height: ", $(window).height()); 
				console.log("Window scroll: ", $(window).scrollTop()); 
				console.log("Footer height: ", footerHeight); 
				console.log("Footer top: ", footerTop); 
				console.log("-----------") 
				*/
				//如果页面内容高度小于屏幕高度，div#footer将绝对定位到屏幕底部，否则div#footer保留它的正常静态定位 
				if (($(document.body).height() + footerHeight) < $(window).height()) {
					$footer.css({
						position: "absolute"
					}).stop().animate({
						top: footerTop
					});
				} else {
					$footer.css({
						position: "static"
					});
				}
			}
			$(window).scroll(positionFooter).resize(positionFooter);
		});
	</script>
```

