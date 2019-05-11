```js
api.ajax({
                url: baseUrl + 'index.php/Api/Goods/goodsDescribe',
                method: 'post',
                data: {
                    values: {
                        goodsId: goodsId,
                    },
                }
            }, function(ret, err) {
                var data = ret.info.replace("\\", "");
                var strs = new Array(); //定义一数组
                strs = data.split("/ueditor"); //字符分割
                var img = '';
                for (var i = 0; i < strs.length; i++) {
                    if (i == strs.length - 1) {
                        img += strs[i];
                    } else {
                        img += strs[i] + baseUrl + 'ueditor';
                    }
                }

                $api.html(goodsdetails, img);
            });
```

