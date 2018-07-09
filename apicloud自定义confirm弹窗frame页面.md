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
            background: linear-gradient(left, #0f4bb2, #0052df);
            background: -webkit-linear-gradient(left, #0f4bb2, #0052df);
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
```

