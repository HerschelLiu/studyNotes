插件描述：和 Lazy Load 一样，Echo.js 也是一个用于图像延迟加载 JavaScript。不同的是 Lazy Load 是基于 jQuery 的插件，而 Echo.js 不依赖于 jQuery 或其他 JavaScript 库，可独立使用。并且 Echo.js 非常小巧，压缩后不足 1KB。

## 兼容性

Echo.js 使用了 HTML5 的 date 属性，并且需要获取该属性的值，所以它并不兼容 IE6、IE7。虽然 Lazy Load 也使用了 HTML5 的 date 属性，但它获取值的方法不一样。

## 使用方法

1、引入文件

2、HTML

blank.gif 是一个 1 x 1 的图片，用做默认图片，data-echo 的属性值是图片的真实地址。同样最好给图片设置宽度和高度，或者在 CSS 中设置也可以，否则似乎很底部很底部的图片才会延迟加载。

3、JavaScript

## 参数

| 参数     | 说明                               |
| -------- | ---------------------------------- |
| offset   | 离可视区域多少像素的图片可以被加载 |
| throttle | 图片延迟多少毫秒加载               |