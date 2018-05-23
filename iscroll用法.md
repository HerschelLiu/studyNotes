```

<div id="wrapper">
	<div id="scroller">
	// 滚动的内容，只会滚动这里的首个div，弱项多个滚动，请用一个div包裹他们
	</div>
</div>
var myScroll = new IScroll('#wrapper', {
        scrollbars: true,// 是否开启滚动条
        mouseWheel: true,// 鼠标滚轮
        interactiveScrollbars: true, //此属性可以让滚动条能拖动，用户可以与之交互
        shrinkScrollbars: 'scale', //当在滚动区域外面滚动时滚动条是否可以收缩到较小的尺寸
        fadeScrollbars: true // 不想使用滚动条淡入淡出方式时，需要设置此属性为false以便节省资源。
    });
```

滚动条类名为iScrollIndicator 