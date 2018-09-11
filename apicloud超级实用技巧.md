[TOC]





#### 1.很多安卓手机都有虚拟按键，当虚拟按键隐藏后会出现问题。因为虚拟按键收起，window的高度加高了，页面footer部分下沉，而frame中的高度是固定的，这样页面底部多出一条空白区域

```javascript
//  示例代码
api.openFrame({
    name: 'page2',
    url: './page2.html',
    rect: {
        x: 0,
        y: 0,
        w: 'auto',
        h: 'auto'// 如果使用h参数，就会出现上面的问题
    }
});
```

针对上面提出的问题，apicloud平台增加了margin系列参数

```javascript
//  示例代码
api.openFrame({
    name: 'page2',
    url: './page2.html',
    rect: {
        x: 0,
        y: 0,
        w: 'auto',
        marginBottom: '50'// footer的高度
    }
});
```

这样就可以完美解决安卓虚拟按键栏的问题<br>

ios也会有类似问题：用户在使用app过程中，如果来了一个电话，会在状态栏与app之间插入一条电话的状态栏，也使用margin布局

```javascript
//  示例代码
api.openFrame({
    name: 'page2',
    url: './page2.html',
    rect: {
        x: 0,
        marginTop: '50', // 计算出来的header的高度
        w: 'auto',
        marginBottom: '50'// footer的高度
    }
});
```

#### 2.获取手机验证码功能实现

```javascript
//倒计时
function getCode(){// 获取验证码
    if(timeCode !== 60) { //倒计时中屏蔽点击事件
        return;
    } else {
        $api.dom('input[name="phone"]').blur();
        $api.dom('input[name="code"]').blur();
        timeCode -= 1;
        $api.text($api.dom('.get-code'), timeCode + '秒重发');
        var loopTime = setInterval(function (){
            if(timeCode !== 0){
                timeCode -= 1 // 计时器计数减1
                $api.text($api.dom('.get-code'), timeCode + '秒重发');
                getCode();
            } else {
                clearInterval(loopTime); // 计时器为0，取消计时器
                $api.text($api.dom('.get-code'), '获取验证码');
                timeCode = 60;
            }
        }, 1000);
    }
}
```

#### 3.打开远程连接

使用`api.openFrame`方法打开远程连接

```javascript
api.openFrame({
    name: 'remote_html',
    url: 'https://www.apicloud.com/',
    bounces: false,
    rect: {
        marginTop: 44,
        marginBottom: 50
    },
    progress: { // 设置进度条类型和样式
        type: 'page', 
        // 加载进度效果类型，默认为default，取值范围为default | page，default等同于
        // showProgress参数效果；为page时，进度效果为仿浏览器类型，固定在页面顶部
        color: '#45c01a' // type为page时的进度条颜色
    }
});
```

#### 4. 实现更换皮肤功能

​        移动应用会有更换皮肤的应用场景。比较简单的就是实现日间模式和夜间模式<br>

​	（1）准备多套css皮肤样式，以下两种css主题为例

```css
// black.css
body {
    background: #000;
    color: #fff;
}

// white.css
body {
    background: #fff;
    color: #000;
}
```

（2）设置默认皮肤的css。给link标签添加名为theme的id属性，用于页面初始化时，为href重新赋值。

`<link id="theme" rel="stylesheet" type="text/css" href="../css/white.css">`

（3）页面加载时，根据存储的皮肤类型引入不同css。由于apicloud引擎的实现机制，window.onload将会在apiready之前执行，在window.onload里初始化皮肤，能有效避免更换皮肤时闪屏问题

```javascript
window.onload = function (){
    fnInitBg();
}

function fnInitBg() {
    var theme = $api.getStorage('theme'); // 从storage中取出存储的皮肤类型
    var oTheme = document.getElementById('theme');
    if(theme == "white") { // 重新为id为theme的link标签赋值
        oTheme.href = "../css/white.css";
    } else {
        oTheme.href = "../css/black.css";
    }
}
```

（4）更换皮肤类型，需要存储将要使用的皮肤类型，并重启app

> 不建议通过界面间通信来改变已经被打开的window皮肤，会出现闪屏

```javascript
function fnChangeWhiteTheme() {
    $api.setStorage('theme', 'white'); //存储将要使用的皮肤类型
    api.rebootApp(); // 重启app
}

function fnChangeBlackTheme() {
    $api.setStorage('theme', 'black'); //存储将要使用的皮肤类型
    api.rebootApp(); // 重启app
}
```

#### 5.实现多语言切换功能

实现步骤如下

（1）准备多种语言对应的json数据，写道JavaScript中，并引入界面。准备语言数据，参照如下

```javascript
<script type="text/javascript" src="srcipt/lan.js"></script>

// lan.js
var chLanJson = {
    "select_lan" : "选择语言",
    "ch": "中文",
    "en": "英文"
}；

var enLanJson = {
    "select_lan" : "select language",
    "ch": "Chinese",
    "en": "English"
}；

```

其中每一个json为一种语言的翻译集合。在不同语言翻译集合json中，key时相同的，value则对应不同语言的翻译。<br>

（2）为要切换语言的标签设置类名以及自定义属性。需要切换语言的标签统一设置class为“lan”，同时设置自定义属性set-lan。set-lan属性中html或value为标签要设置的内容类型。<br>

例如div中的set-lan=“html：ch“的意义是，该标签的innerHtml设置为chLanJson或enLanJson中key为ch所对应的值，即为”中文“或”Chinese“

```html
<div set-lan="html:ch" class="lan" tapmode onclick="fnChangeCh()"></div>         
<div set-lan="html:en" class="lan" tapmode onclick="fnChangeEn()"></div>  
<input type="text" set-lan="value:en" class="lan">  
```

（3）页面初始化时根据存储的语言类型进行切换

```javascript
window.onload = function (){
    fnInitLan();
};

function fnInitLan(){
    var all = $api.domAll('.lan'); //获取所有class=lan的元素
    var lan = $api.getStorage('lan'); // 获取存储的语言类型
    for(var i = 0;i < all.length; i++){
        var el = all[i];
        var attr = el.getAttribute('set-lan'); // 获取set-lan属性
        if(attr) {
            var attrs = attr.split(':'); 
    //解析set-lan中的值，冒号之前的为标签要设置的内容类型；冒号之后的为翻译集合中的key；
            var attrType = attrs[0];
            var lanVal;
            if(lan == 'ch'){ // 根据获取到的key，获取标签要设置的内容
                lanVal = chLanJson[attrs[1]];
            } else {
                lanVal = enLanJson[attrs[1]];
            }
            
            if(attrType == 'html'){ //根据获取到的内容类型，为标签设置获取到的内容
                $api.html(el, lanVal);
            } else if(attrType == 'value') {
                $api.val(el, lanVal);
            }
        }
    }
}
```

（4）切换语言类型，存储将要使用的语言类型，并重启app

```javascript
function fnChangeCh(){
    $api.setStorage('lan', 'ch');
    $api.rebootApp();
}

function fnChangeEn(){
    $api.setStorage('lan', 'en');
    $api.rebootApp();
}
```

在项目根目录下创建`.syncignore`文件，以自定义在真机同步时忽略默写文件