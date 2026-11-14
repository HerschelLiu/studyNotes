# e.target 兼容写法

```javascript
$("div").click(function(e){

    var event = e || window.event;
    var target = event.target || event.srcElement;

})
```
