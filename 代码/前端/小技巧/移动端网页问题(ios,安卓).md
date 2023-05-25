**1.** 手机端a标签触碰时背景色消除

```css
a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    outline: none;
    background: none;
    text-decoration: none;
}
```

**2.** 解决移动端iPhone设备点击时出现半透明的灰色背景

```css
html,body{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

**3.** 禁止选中文本

```css
body {
  -webkit-user-select: none;
}
```

**4.**  **禁止 ios 长按时不触发系统的菜单，禁止 ios&android 长按时下载图片**（3D Touch或Haptic Touch 功能触发的系统菜单也是这个）

```css
body {
  -webkit-touch-callout: none;
}
```

**5.** **打电话&发短信&发邮件的如何实现**

```css
// 打电话
<a href="tel:0755-10086">打电话给:0755-10086</a> 
<a href="tel:4008106999,1034">400-810-6999 转 1034</a>
// 发短信
<a href="sms:10086">发短信给: 10086</a> 
// 发短信 短信内容 （本人进行测试，多个号码发送短信，功能实现不了，始终给第一个号码发送）
安卓手机：<a href="sms:10086?body=内容">发短信给: 10086</a> 
苹果手机：<a href="sms:10086&body=内容">发短信给: 10086</a> 
多个号码：<a href="sms:10086,10010&body=内容">发短信给: 10086和10010</a> 
         <a href="sms:10086,10010?body=内容">发短信给: 10086和10010</a> 
// 发邮件
<a href="mailto:peun@foxmail.com">单击这里给peun发电子邮件</a>
// 移动web页面自动探测电话号码：
<meta name="format-detection" content="telephone=yes">
// 使用wtai协议进行拨打电话：
<a href="wtai://wp//mc;15110418977">拨打XXX</a> 
<a href="wtai://wp/ap;15110418977;">将XXX存储至电话簿 </a>
// 在电话号码前加上 + （加号）表示国际号码:
<a href="wtai://wp/mc;+15110418977">+15110418977</a>
// 地图定位GPS：
<a href="geopoint:[经度],[纬度]">me位置</a> 比如：<a href="geopoint:200,20">me位置</a>
```

**6.** 屏幕旋转的事件和样式

```javascript
// 1. 事件
window.orientation，取值：正负90表示横屏模式、0和180表现为竖屏模式；
// 代码判断
window.onorientationchange = function(){ 
  switch(window.orientation){ 
    case -90: 
    case 90: 
        alert("横屏:" + window.orientation); 
    case 0: 
    case 180: 
        alert("竖屏:" + window.orientation); 
    break; 
    } 
}

// 2. 样式
/*竖屏时使用的样式*/ 
@media all and (orientation:portrait) {
  .css{} 
}

/*横屏时使用的样式*/ 
@media all and (orientation:landscape) {
  .css{}
} 
```

**7.** ios 视频默认全屏播放，如何阻止全屏播放－ webkit-playsinline

```html
<video id="video" src="" webkit-playsinline poster="" ></video>
```

**8.** ios手机设置input为readonly后，解决仍会获得焦点弹起软键盘

可以在input中添加unselectable="on" onfocus="this.blur()"最终为

```html
<input type="text"  readonly="readonly" unselectable="on" onfocus="this.blur()"/>
```

**9.** ios唤起键盘页面被顶上去且无法自动回退带来的问题

解决方法是添加js代码，使input失去焦点后让页面滑动

```javascript
// 1.
dom.input.on('blur', function(){
    document.querySelector('#msg_end').scrollIntoView();
});

//2.
window.scroll(0, document.body.clientHeight) 
```



**10.** overflow:scroll;在ISO机型中滑动卡顿问题

```css
-webkit-overflow-scrolling: touch;
```



