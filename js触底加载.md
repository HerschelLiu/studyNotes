我们先看一下滚动条滚动到底部时触发事件的原理：

当（可视区域的高度+可视区域距离内容顶部的距离） >=  内容的真实高度   的时候触发数据加载事件，加载下一页的数据。



```javascript
// 获取页面高度
function getScrollTop () {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

// 获取当前可视高度
function getClientHeight () {
    return document.documentElement.clientHeight;
}

// 文档完整的高度
function getScrollHeight () {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

// 检查滚动高度是否到了底部
function checkScrollHeight () {
    return getScrollHeight() - getClientHeight() - getScrollTop() <= 50;
}
```

