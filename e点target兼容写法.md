# 需要用到e.target查看事件源兼容IE的写法

```javascript
$("div").click(function(e){

    var event = e || window.event;
    var target = event.target || event.srcElement;

})
```

