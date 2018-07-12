```
<style>
        html,
        body {
            width: 100%;
            height: 100%;
            background: transparent;
        }

        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.25);
            z-index: 5;
        }

        .confirm {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 81.1%;
            height: 164px;
            margin: auto;
            background: #f7f7f7;
            border-radius: 15px;
            z-index: 10;
        }

        .confirm>.top {
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 126px;
            font-size: .75rem;
            color: #666;
        }

        .confirm>.btnBox {
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 38px;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
        }

        .btnBox>.cancel {
            width: 50%;
            height: 38px;
            line-height: 38px;
            background: #fff;
            padding-left: .25rem;
            text-align: center;
            font-size: .65rem;
            color: #999;
            letter-spacing: .25rem;
            box-sizing: border-box;
        }

        .btnBox>.ok {
            width: 50%;
            height: 38px;
            line-height: 38px;
            background: #f77045;
            padding-left: .25rem;
            text-align: center;
            font-size: .65rem;
            color: #fff;
            letter-spacing: .25rem;
            box-sizing: border-box;
        }
    </style>
    <body>
    <div class="mask"></div>
    <div class="confirm pingfangRegular">
        <div class="top">
            确定结束聊天?
        </div>
        <div class="btnBox">
            <div class="cancel" tapmode>暂不</div>
            <div class="ok" tapmode>确认</div>
        </div>
    </div>
</body>
<script type="text/javascript">
    apiready = function() {

    };
    var cancel = $api.dom('.cancel');

    $api.addEvt(cancel, 'click', function() {
        api.closeFrame();
    });

    var ok = $api.dom('.ok');

    $api.addEvt(ok, 'click', function() {
        api.closeWin({
            name: 'win_talk'
        });
    });

    var mask = $api.dom('.mask');

    $api.addEvt(mask, 'touchstart', function() {
        api.closeFrame();
        event.perventDefault();
    });
</script>




api.openFrame({
                    name: 'fm_coupon-confirm',
                    url: './fm_coupon-confirm.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0)',
                    vScrollBarEnabled: true,
                    hScrollBarEnabled: true,
                    animation: {
                        type: 'fade'
                    }
                });
```

