```
  // 改变header颜色
    function changeHeaderBg() {
        var scrollTop = document.body.scrollTop;
        var headerBox = $api.dom('.headerBox');
        var header = $api.dom('header');
        var headerH = $api.offset(header).h;

        if (scrollTop == 0) {
            $api.removeCls(headerBox, 'headerBg--pink');
            $api.removeCls(headerBox, 'headerBg--pink5');
        } else if (scrollTop > 0 && scrollTop < 50) {
            $api.addCls(headerBox, 'headerBg--pink5');
        } else {
            $api.removeCls(headerBox, 'headerBg--pink5');
            $api.addCls(headerBox, 'headerBg--pink');
        }
    }

    // 页面滑动header变色
    window.addEventListener('scroll', function() {
        changeHeaderBg();
    });
    window.addEventListener('touchmove', function() {
        changeHeaderBg();
    });

    window.addEventListener('touchend', function() {
        changeHeaderBg();
    });
```

