```
<img src="default.png" onload="fnLoadImage(this)" data-url="{{= ware.thumbnail.url}}">

function fnLoadImage(ele_) {
            var dataUrl = $api.attr(ele_,'data-url');
            if (dataUrl) {
                api.imageCache({
                    url: dataUrl
                }, function (ret, err) { 
                    if(ret){
                        ele_.src = ret.url
                    }
                 });
            }
        }
```

