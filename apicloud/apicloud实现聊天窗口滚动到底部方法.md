```
//滑动到底部
    function pageDown(time) {
        setTimeout(function() {
            api.pageDown({
                bottom: true,
                animate: true
            }, function(ret) {});
        }, time || 0)
    }
```

一般time为300,用定时器原因是(可能),因为pageDown会先执行,但是数据好没有加载完,所以延时执行