```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script>
      var coverSupport = 'CSS' in window && typeof CSS.supports === 'function' && (CSS.supports('top: env(a)') ||
        CSS.supports('top: constant(a)'))
      document.write(
        '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' +
        (coverSupport ? ', viewport-fit=cover' : '') + '" />')
    </script>
    <title></title>
    <!--preload-links-->
    <!--app-context-->
  </head>
  <body></body>
</html>

```

> 该代码片段是一个HTML函数，用于检测设备是否支持CSS环境变量和CSS支持函数，并根据支持情况在meta标签中设置视图范围。如果支持，则在viewport标签中添加viewport-fit=cover属性，以适应设备屏幕的大小。



```html
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover" />
<!-- webApp全屏显示，IOS设备 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- 通用的浏览器 -->
<meta name="full-screen" content="true" />
<!-- QQ浏览器（X5内核）独有的META -->
<meta name="x5-fullscreen" content="true" />
<!-- 360浏览器独有的 -->
<meta name="360-fullscreen" content="true" />
```

