iPhoneX的适配---适配方案viewport-fit

###     3.1  PhoneX的适配，在iOS 11中采用了viewport-fit的meta标签作为适配方案；viewport-fit的默认值是auto。

　　  viewport-fit取值如下：

| auto  | 默认：viewprot-fit:contain;页面内容显示在safe area内 |
| ----- | ---------------------------------------------------- |
| cover | viewport-fit:cover,页面内容充满屏幕                  |

　　    viewport-fit meta标签设置(cover时)

 

```
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

###     3.2  css constant()函数 与safe-area-inset-top & safe-area-inset-left & safe-area-inset-right & safe-area-inset-bottom的介绍

 ![img](https://images2017.cnblogs.com/blog/949019/201711/949019-20171106205332075-1346398687.png)

如上图所示 在iOS 11中的WebKit包含了一个新的[CSS函数constant()](https://github.com/w3c/csswg-drafts/pull/1817)，以及一组[四个预定义的常量](https://github.com/w3c/csswg-drafts/pull/1819)：safe-area-inset-left, safe-area-inset-right, safe-area-inset-top和 safe-area-inset-bottom。当合并一起使用时，允许样式引用每个方面的安全区域的大小。

​    3.1当我们设置viewport-fit:contain,也就是默认的时候时;设置safe-area-inset-left, safe-area-inset-right, safe-area-inset-top和 safe-area-inset-bottom等参数时不起作用的。

​    3.2当我们设置viewport-fit:cover时：设置如下

```
body {
    padding-top: constant(safe-area-inset-top);   //为导航栏+状态栏的高度 88px            
    padding-left: constant(safe-area-inset-left);   //如果未竖屏时为0                
    padding-right: constant(safe-area-inset-right); //如果未竖屏时为0                
    padding-bottom: constant(safe-area-inset-bottom);//为底下圆弧的高度 34px       
}
```

# 5.iPhoneX的适配---媒体查询

注意这里采用的是690px(safe area高度)，不是812px;

```
`@media only ``screen` `and (``width``: ``375px``) and (``height``: ``690px``){``    ``body {``        ``background``: ``blue``;``    ``}``}`
```

viewport-fit的作用，它有三个可能的值：

- contain：视口应该完全包含网页内容。这意味着位置固定元素将被包含在iOS 11的安全区域内。
- cover：网页内容应该完全覆盖屏幕。这意味着位置固定元素将固定到屏幕，即使这意味着它们将被遮挡。这恢复了我们在iOS 10上的行为。
- auto：默认值，在这种情况下，它的行为与contain。

因此，要将屏幕覆盖全部屏幕，您需要添加viewport-fit=cover到标记。

安卓暂定为40px

##### **如何适配全面屏手机**

根据谷歌兼容性（CTS）标准要求,应用必须按以下方式中的任意一种，在AndroidManifest.xml中配置方可全屏显示，否则将以非全屏显示。

方式一：配置支持最大高宽比

\* <meta-data android:name="android.max_aspect"  android:value="ratio_float" />

\* android:maxAspectRatio="ratio_float"   （API LEVEL 26）

说明：以上两种接口可以二选一，ratio_float = 屏幕高 / 屏幕宽 （如oppo新机型屏幕分辨率为2280 x 1080， ratio_float = 2280 / 1080 = 2.11，建议设置 ratio_float为2.2或者更大）



方式二：支持分屏，注意验证分屏下界面兼容性

android:resizeableActivity="true"  

建议采用方式二适配支持全面屏。