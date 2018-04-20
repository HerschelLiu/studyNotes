# 端设置

* 图标最好为150*150大小的

* 启动页最好上传一个1080*1920大小的
# js模块写法

* api.require(模块名)
* 可以包含在函数中，调用函数时候才运行。如果不在函数中，就要加上`apiready= `
  + 例子

```
// function
<div class="hello" onclick="openScanner()">Hello APICloud</div>
<script>
  function openScanner(){
    // 以下代码调用二维码扫描模块
    var scanner = api.require('scanner');
    scanner.open();
  }
</script>


//apiready打开软件就运行二维码扫描模块
apiready = function(){
      var scanner = api.require('scanner');
      scanner.open();
  }
```

* 解决程序与手机状态栏重合产生的问题

 ```
var header = $api.dom('header'); // 获取 header 标签元素
// 修复开启沉浸式效果带来的顶部Header与手机状态栏重合的问题，会自动为header上面加上状态栏呢的高度。最新api.js方法已支持适配iPhoneX；
var headerH = $api.fixStatusBar(header);

api.openFrame({
    rect: { // 推荐使用Margin布局，用于适配屏幕的动态变化
                marginTop: headerH, // main页面距离win顶部的高度
                marginBottom: footerH, // main页面距离win底部的高度
                w: 'auto' // main页面的宽度 自适应屏幕宽度
            }
});
 ```

* ​


* 想要程序与手机状态栏不重合，就设置`<preference name="statusBarAppearance" value=""/>`的value值为false

* 获取元素

  ```
  $api.dom('header'); // 获取 header 标签元素
  $api.byId('year'); // 获取 id元素
  ```

  ​

  ​

# 目录结构

* `feature`文件夹存放模块相关资源。比如表情模块，各种表情图片就存放在这个文件夹中
* `icon`和`launch`文件夹分别保存本地打包用的应用图标和启动页。其中的文件名必须要是`icon150x150.png` `launch1080x1920.png`格式。这两个文件夹在编译正式包时建议删除
* `res`文件夹是存放二进制流的资源，比如音频、视频文件，也可以存放客户端的https的证书，或者类似于支付宝、微信支付等里面的一些密钥信息的xml文件。就是说存放一些应用的加密信息和流媒体资源
* `wgt`存放一些子widget
* 自定义错误页面：新建error文件夹，里面新建error.html文件。如果出错会自动跳转到error.html页面
* 根窗口的名字为root
