在设置了全屏width:100%;height:100%的情况下。IphoneX底部会有一个空白区域，这个是IphoneX底部是预留操作区。需要手动拖动才能把白色区域给覆盖。

# 解决办法

那么如何一开始全屏呢？消除白色区域呢？

Iphone官网已经给予解决方案。在viewport加入 viewport-fit=cover 属性。就可以解决了

```
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

# 说明

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