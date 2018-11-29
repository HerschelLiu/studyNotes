* 页面关键词 `<meta name="keywords" content="your tags" />`

* 页面描述`<meta name="description" content="150 words" />`

* 搜索引擎索引方式`<meta name="robots" content="index,follow" />`
  <!--
  　　all：文件将被检索，且页面上的链接可以被查询；
  　　none：文件将不被检索，且页面上的链接不可以被查询；
  　　index：文件将被检索；
  　　follow：页面上的链接可以被查询；
  　　noindex：文件将不被检索；
  　　nofollow：页面上的链接不可以被查询。
  　　-->

* 页面重定向和刷新`<meta http-equiv="refresh" content="0;url=" />`

* minimal-ui ：iOS 7.1的Safari为meta（viewportd的）标签新增minimal-ui属性，在网页加载时隐藏地址栏与导航栏

* 移动设备`<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>`
    <!-- `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边  -->

* WebApp全屏模式`<meta name="apple-mobile-web-app-capable" content="yes" />` <!-- 启用 WebApp 全屏模式 -->

* 隐藏状态栏/设置状态栏颜色`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`

* 忽略数字自动识别为电话号码`<meta content="telephone=no" name="format-detection" />`

* 忽略识别邮箱`<meta content="email=no" name="format-detection" />`

* 优先使用 IE 最新版本和 Chrome`<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />`

* 使用web应用程序的名称(当网站作为一个应用程序的时候)`<meta name="application-name" content="Application Name">`

* 简短描述你的网站的主题`<meta name="subject" content="your website's subject">`

* 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓`<meta name="HandheldFriendly" content="true">`

* 微软的老式浏览器`<meta name="MobileOptimized" content="320">`

* uc强制竖屏 `<meta name="screen-orientation" content="portrait">`

* QQ强制竖屏`<meta name="x5-orientation" content="portrait">`

* UC强制全屏`<meta name="full-screen" content="yes">`

* QQ强制全屏`<meta name="x5-fullscreen" content="true">`

* UC应用模式`<meta name="browsermode" content="application">`

* QQ应用模式`<meta name="x5-page-mode" content="app">`

* 浏览器内核控制：国内浏览器很多都是双内核（webkit和Trident），webkit内核高速浏览，IE内核兼容网页和旧版网站。而添加meta标签的网站可以控制浏览器选择何种内核渲染。`<meta name="renderer" content="webkit|ie-comp|ie-stand">`

    > 国内双核浏览器默认内核模式如下：

    > 1. 搜狗高速浏览器、QQ浏览器：IE内核（兼容模式）
    > 2. 360极速浏览器、遨游浏览器：Webkit内核（极速模式）

* 主要用于PC-手机页的对应关系。

    ```html
    <meta name="mobile-agent"content="format=[wml|xhtml|html5]; url=url">
    <!--
    [wml|xhtml|html5]根据手机页的协议语言，选择其中一种；
    url="url" 后者代表当前PC页所对应的手机页URL，两者必须是一一对应关系。
     -->
    
    ```

* 这个meta 标签是禁止百度转码的``<meta http-equiv="Cache-Control" content="no-siteapp" />`

  j禁止神马转码`<meta http-equiv="Cache-Control" content="no-transform " />`,只要两条都加上就好

===========================================================================

* 告诉谷歌搜索框不显示链接`<meta name="google" content="nositelinkssearchbox">`
* 告诉谷歌不要翻译这个页面`<meta name="google" content="notranslate">`
* Google网站管理员工具的特定元标记，核实对谷歌搜索控制台所有权`<meta name="google-site-verification" content="verification_token">`
* 说明用什么软件构建生成的网站，(例如,WordPress,Dreamweaver)`<meta name="generator" content="program">`
* 完整的域名或网址`<meta name="url" content="https://example.com/">`
* 对当前页面一个等级衡量，告诉蜘蛛当前页面在整个网站中的权重到底是多少。General是一般页面，Mature是比较成熟的页面，Restricted代表受限制的。`<meta name="rating" content="General">`
* 隐藏发送请求时请求头表示来源的referrer字段。`<meta name="referrer" content="no-referrer">`
* 通过设置“off”,完全退出DNS队列`<meta http-equiv="x-dns-prefetch-control" content="off">`
* 在客户端存储 cookie，web 浏览器的客户端识别`<meta http-equiv="set-cookie" content="name=value; expires=date; path=url">`
* 指定要显示在一个特定框架中的页面`<meta http-equiv="Window-Target" content="_value">`
* 地理标签

```html
<meta name="ICBM" content="latitude, longitude">
<meta name="geo.position" content="latitude;longitude">
<meta name="geo.region" content="country[-state]"><!-- 国家代码 (ISO 3166-1): 强制性, 州代码 (ISO 3166-2): 可选; 如 content="US" / content="US-NY" -->
<meta name="geo.placename" content="city/town"><!-- 如 content="New York City" -->

```

* 添加智能 App 广告条 Smart App Banner：告诉浏览器这个网站对应的app，并在页面上显示下载banner(如下图`<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL"> `