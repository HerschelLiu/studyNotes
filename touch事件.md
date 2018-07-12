因为touchmove后也会触发touchend,所以需要定义一个`var isMove = false;`来判定

```
<div class="infoBar" ontouchstart="touchstartThis(this)" ontouchmove="touchmoveThis(this)" ontouchend="touchendThis(this)">

var isMove = false;

    function touchstartThis(self) {
        $api.css(self, 'background: #eaeaea');
        // event.preventDefault();
        isMove = false;
    }

    function touchmoveThis(self) {
        isMove = true;
        $api.css(self, 'background: #f5f5f5');
    }
  function touchendThis(self) {
      $api.css(self, 'background: #f5f5f5');
        if (isMove == false) {
            // $api.css(self, 'background: #f5f5f5');
            api.openWin({
                name: 'win_coupon-info',
                url: './win_coupon-info.html'
            });
        }
    }
```

