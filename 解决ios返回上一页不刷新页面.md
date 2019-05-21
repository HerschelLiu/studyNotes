```js
//第一种方法
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
//第二种
    var isPageHide = fasle;
    window.addEventListener('pageshow', function () {
        alert(isPageHide)
        if (isPageHide) {
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
//第三种
    window.addEventListener('pageshow', function(e) {
        // 通过persisted属性判断是否存在 BF Cache
        alert(e.persisted)
        if (e.persisted) {
            location.reload();
        }
    });
```