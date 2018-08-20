# HTML中设置网页自适应的MATE标签



## 一、`<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">`

1. name="viewport"      //设置视口（网页可绘制的区域）
2. width=device-width    //应用程序的宽度和屏幕的宽度是一样的
3. height=device-height  //应用程序的高度和屏幕的高是一样的
4. initial-scale=1.0  //应用程序启动时候的缩放尺度（1.0表示不缩放）
5. minimum-scale=1.0  //用户可以缩放到的最小尺度（1.0表示不缩放）
6. maximum-scale=1.0  //用户可以放大到的最大尺度（1.0表示不缩放）
7. user-scalable=no  //用户是否可以通过他的手势来缩放整个应用程序，使应用程序的尺度发生一个改变（yes/no）

## 二、`<meta name="viewport" content="target-densitydpi=device-dpi, width=480px, user-scalable=no">`

1. target-densitydpi=device-dpi     //指定屏幕像素密度DPI,device-dpi 为设备原本的DPI值,不会有任何缩放.( dpi是单位,一般指每英寸的像素)

## 三、`<meta name="apple-mobile-web-app-capable" content="yes"> `

//说明：网站开启对web app程序的支持

1. apple-mobile-web-app-capable //

2. content="yes"  //是否开启（开启）

## 四、`<meta http-equiv="X-UA-Compatible" content="IE=edge">` //强制使用ie最新内核模式渲染

## 五、`<meta name="format-detection" content="telephone=no">`

当该 HTML 页面在手机上浏览时，该标签用于指定是否将网页内容中的手机号码显示为拨号的超链接
在 iPhone 上默认值是：
<meta name="format-detection" content="telephone=yes"/>`
如果你不希望手机自动将网页中的电话号码显示为拨号的超链接，那么可以这样写：
`<meta name="format-detection" content="telephone=no"/>`

## 六、`<meta content="email=no" name="format-detection" />`//将不识别邮箱，告诉设备忽略将页面中的数字识别为电话号码 。

## 七、<meta name="apple-mobile-web-app-status-bar-style" content="black" />`

在web app应用下状态条（屏幕顶部条）的颜色；
默认值为default（白色），可以定为black（黑色）和black-translucent（灰色半透明）。
注意：若值为“black-translucent”将会占据页面px位置，浮在页面上方（会覆盖页面20px高度–iphone4和itouch4的Retina屏幕为40px）。

## 八、`<meta name="apple-touch-fullscreen" content="yes">`  //"添加到主屏幕“后，全屏显示

## 九、`<meta name="apple-mobile-web-app-capable" content="yes" />`

//这meta的作用就是删除默认的苹果工具栏和菜单栏。content有两个值”yes”和”no”,当我们需要显示工具栏和菜单栏时，这个行meta就不用加了，默认就是显示。

## 十、苹果web app其他设置：

1. `<link rel="apple-touch-icon-precomposed" href="iphone_milanoo.png" />`

说明：这个link就是设置web app的放置主屏幕上icon文件路径。
使用：该路径需要注意的就是放到将网站的文档根目录下但不是服务器的文档的根目录。图片尺寸可以设定为57*57（px）或者Retina可以定为114*114（px），ipad尺寸为72*72（px）。

2. `<link rel="apple-touch-startup-image" href="milanoo_startup.png" />`

说明：这个link就是设置启动时候的界面（图片五），放置的路劲和上面类似。
使用：该路径需要注意的就是放到将网站的文档根目录下但不是服务器的文档的根目录。官方规定启动界面的尺寸必须为 320*640（px），原本以为Retina屏幕可以支持双倍，但是不支持，图片显示不出来。

## 十一、`<META NAME="MobileOptimized" CONTENT="240">`