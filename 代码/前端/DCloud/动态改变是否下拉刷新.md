```js
pullType(type) { // type: true or false
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];  
    const currentWebview = page.$getAppWebview();  
    // #ifdef APP-PLUS
    currentWebview.setStyle({
        pullToRefresh: {  
            support: type,  
            style: plus.os.name === 'Android' ? 'circle' : 'default'  
        }  
    });
    // #endif
}
```

