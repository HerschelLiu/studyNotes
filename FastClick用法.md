纯Javascript版

```javascript
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
```

jQuery版

```javascript
$(function() {
	FastClick.attach(document.body);
});
```

类似Common JS的模块系统方式

```javascript
var attachFastClick = require('fastclick');
attachFastClick(document.body);
```

#### 使用needsclick过滤特定的元素

如果页面上有一些特定的元素不需要使用fastclick来立刻触发点击事件，可以在元素的class上添加needsclick:

```html
<a class="needsclick">Ignored by FastClick</a>
```

### 不需要使用fastclick的情况

以下这几种情况是不需要使用fastclick：

1、FastClick是不会对PC浏览器添加监听事件
2、Android版Chrome 32+浏览器，如果设置viewport meta的值为width=device-width，这种情况下浏览器会马上出发点击事件，不会延迟300毫秒。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

3、所有版本的Android Chrome浏览器，如果设置viewport meta的值有user-scalable=no，浏览器也是会马上出发点击事件。
4、IE11+浏览器设置了css的属性touch-action: manipulation，它会在某些标签（a，button等）禁止双击事件，IE10的为-ms-touch-action: manipulation