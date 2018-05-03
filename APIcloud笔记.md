### 添加meta标签

在布局app样式时，为了确保绘制和缩放的效果需要在`<head>`标签中添加 `viewport` 元数据标签

`<meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>`

同时添加`format-detection`，防止ios机型将连续数组转为手机号码

`<meta name="format-detection" content="telephone=no"/>`

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

### api.css

* 清除浏览器默认样式表：margin、padding、border、display···

* 清除浏览器默认的交互效果：默认弹出菜单、点击效果、自动播放···

* APICloud应用推荐CSS使用

  + 不要使用过大的通用样式文件
  + 每个页面独立定义样式
  + div+css
  + display+position+float
  + 弹性盒布局FlexBox

### api.js

* ECMA工具函数：String、Format···
* DOM操作：event、selector、operation、style
* APICloud扩展：status bar、toast、ajax、localStorage

### $api与api

* $api：前端框架中定义的对象，引入api.js即可使用，无需等待apiready事件
* api：淫情扩展的对象，apiready事件之后使用，封装了平台的最基础功能

### 自定义AppLoader（调试微信分享模块）

1. 在APIC;oud平台创建应用，并正确配置证书及包名，编译生成安装包，安装<br />

   到手机，使用签名工具（在微信开放平台中的Android资源下载中有签名生成工具），获取应用签名

​   2. 在微信开放平台创建应用：open.weixin.qq.com

* 申请：Appid、AppSecret
* 提供：应用包名、应用签名、其他信息
* 服务：好友分享、朋友圈（这两个默认选中），登录、支付（需要自己选择）

3. 配置config文件、提交配置（写法见文档）
4. 编译自定义AppLoader
5. 使用自定义AppLoader开发调试

  ####   总结

  1. 编译自定义AppLoader一定要先进行云端控制台设置，并提交config.xml文件

  2. 申请微信的AppId与AppSecret时所填写的应用的包名、生成的签名等要与APICloud<br  />

    平台上的完全一致

   3. 详细阅读wx模块的API文档，注意某些功能需要在特定的场景下才起作用，以及图片的<br />

      格式、图片的大小、本地或网络图片等的限制
### 主widget与子widget

1. 主widget

  * 加载机制：是应用的入口widget，应用启动之后首先启动自动加载运行主widget
  * 生命周期：等于整个应用的生命周期，关闭主widget、就会退出应用
  * 配置文件：作为应用的配置文件，在云端编译应用的时候使用
  * 代码位置：编译后存在于应用的安装包中，即ipa或apk包中
2. 子widget
   * 加载机制：不会被应用自动加载运行，需要被其他的widget调用才能运行
   * 生命周期 ：从api.openWidget开始，到api.closeWidget结束
   * 配置文件：对引擎和云端设置的配置项无效，其他配置项有效
   * 代码位置：可以存在于应用安装包中，也可以存在于应用沙箱中
3. widget之间调用
   * 打开子widget：api.openWidget
   * 关闭：api.closeWidget
   * 获取参数：api.wgtParam
   * 子widget搜索路径：主widget包的wgt目录、沙箱中的wgt目录
* 例子

  1. 在主widget的wgt文件夹中新建一个名称为子widget的ID的文件夹

  2. 将子widget的所有文件（.svn和.project文件除外）复制进这个新建的文件夹中

  3. 主widget的index.html文件中调用子widget的`api.openWidget`方法中的id值就为子widget的id<br />

     `api.openWidget`中还可以传参数给子.加上`wgtParam: {}`

  4. ​完成后，提交代码到云端，然后云编译自定义AppLoader
### 应用资源访问方式

1. 资源存放的位置：

   + widget包中
   + 应用沙箱中
2. 资源访问协议
   + widge://
   + fs://
   + cache://
3. api对象
   + api.wgtRootDir
   + api.fsDir
   + api.cacheDir

### 应用沙箱

1. 默认沙箱位置：
   + Android: sdcard/UZMap/appId/
   + IOS: Documents/uzfs/appId
2. 修改Android的沙箱位置，通过修改配置文件：
   + `<widget id="A1234567890123" sandbox="test">`
   + Android: sdcard/test/A1234567890123/

### 应用间通信

1. 判断应用是否安装：`api.appInstalled()`
2. 安装应用：`api.installApp()`
3. 打开其他应用：`api.openApp()`
4. 本应用被其他应用调起事件：`appintent`

### 总结

1. APICloud应用由Widget所组成
2. 通常APICloud应用只包含一个主Widget，但平台支持多Widget运行
3. 主Widget的配置决定了应用的配置
4. 每个应用具有独立的沙箱，APICloud提供资源访问协议
5. APICloud支持widget之间的通信和调用
6. APICloud应用可以同设备中其他的Native应用进行通信和调用

## 模块

#### clipBoard（复制，获取内容）

[  clipBoard文档](https://docs.apicloud.com/Client-API/Device-Access/clipBoard)

