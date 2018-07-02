```
apiready = function() {
        var header = $api.dom('.header');
        if (api.systemType == 'android') {
            //如果为安卓则增加25px的top
            $api.css(header, 'padding-top: 25px');
        }
        if (api.systemType == 'ios') {
            $api.fixStatusBar(header);
        }
    };
```

