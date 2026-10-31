## 点击空白位置浮层消失

#### 方法一**监听弹出层的点击事件->判断点击的区域不是内容区也不是内容区的子元素->关闭**

```html+javascript
<body>
    <div id="test2">
        //空白遮罩、指定区域外
        <p id="test">
        //指定区域
        </p>
    </div>
</body>
$(document).on('click', function(e) {
    var contentEle= $('#test');
    if(contentEle!== e.target && contentEle.has(e.target).length === 0) {
        //关闭弹出层的代码或者需要在点击指定区域之外区域才执行的代码
    }
});
```

#### 方法二**：用Event对象的stopPropagation()方法来停止事件的传播**

```html+javascript
<body>
    <div id="test2">
        //空白遮罩、指定区域外
        <p id="test">
        //指定区域
        </p>
    </div>
</body>
$(document).on('click', function(e) {
    var contentEle= $('#test');
    if(contentEle!== e.target && contentEle.has(e.target).length === 0) {
        //关闭弹出层的代码或者需要在点击指定区域之外区域才执行的代码
    }
});
```



## 格式化手机号码(加空格)

```ts
/**
 * 格式化手机号码
 */
export function getPhoneNumberStyle(mobilePhone: string) {
  const reg = /(?=(\B)(\d{4})+$)/g
  return mobilePhone.replace(reg, ' ')
}
```



## 获取#或？传值后的值

```javascript
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = (window.location.hash || window.location.search).substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}
```

```html
<a href="./myOrder.html?whatTab=1" class="order-item">
                    <i class="e1 iconfont icon-kache"></i>
                    <div class="e2">
                        未取订单
                    </div>
                </a>
```

```javascript
getQueryString('whatTab') // 1
```

hash值得是#后的值,search指的是?后的值

## 监听浏览器返回

```javascript
pushHistory();  
            window.addEventListener("popstate", function(e) {  
                alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能 
        }, false);  
        function pushHistory() {  
            var state = {  
                title: "title",  
                url: "#"  
            };  
            window.history.pushState(state, "title", "#");  
        }
```

可以用在浏览器或者是微信公众号哪里,其他地方没试.

只要浏览器触发了回退的操作就会触发



## 检测是否为数组的兼容写法

```js
var arr = [1,2,3,1];
var arr2 = [{ abac : 1, abc : 2 }];
function isArrayFn(value){
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}
alert(isArrayFn(arr));// true
alert(isArrayFn(arr2));// true
```



## 排列组合函数(笛卡尔积)

```js
function calcDescartes (array) {
    if (array.length < 2) return array[0] || [];
    return [].reduce.call(array, function (col, set) {
        var res = [];
        col.forEach(function (c) {
            set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
            })
        });
        return res;
    });
}
```



## 判断浏览器类型

```js

/**
 * @description 判断用户浏览器类型
 * @author Yu-Root
 * @version 0.0.1
 * @returns {Boolean} true/false
 *
 */
let ua = navigator.userAgent,
  //IE浏览器（IE10与IE10以下版本）
  isOldIE = !!ua.match(/MSIE/i),
  //IE浏览器（IE11以上版本）
  isNewIE = !!ua.match(/Trident/i),
  //Edge 浏览器
  isEdge = !!ua.match(/Edge/i),
  //android终端
  isAndroid = !!ua.match(/Android/i),
  //ios终端
  isIOS = !!ua.match(/iPhone|iPad|iPod/i),
  //支付宝
  isAlipay = ua.match(/AlipayClient/i),
  //微信浏览器
  isWechat = ua.includes("MicroMessenger"),
  //QQ浏览器
  isQQ = ua.includes("QQ");

// 使用
// 判断浏览器
if(isAndroid||isIOS){
   // mobile
   if(wechat){
       //do something
   }else{
       //do something
   }
}else{
   // Pc
}
```



## 全局回车事件

```js
document.onkeydown = function(e) {
    // 兼容FF和IE和Opera 
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        commentTalk(); //具体处理函数
        return false;
    }
    return true;
};
```

