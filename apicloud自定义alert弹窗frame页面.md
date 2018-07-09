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
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.25);
            z-index: 5;
        }

        .evaluate {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 91%;
            height: 222px;
            margin: auto;
            background: #f7f7f7;
            z-index: 10;
        }

        .evaluate>.content {
            width: 100%;
            height: 179px;
            padding-top: 28px;
        }

        .evaluate>.content>.title {
            margin-bottom: 47px;
            padding-left: .3rem;
            text-align: center;
            font-size: .8rem;
            color: #0351d6;
            letter-spacing: .3rem;
            box-sizing: border-box;
        }

        .evaluate>.content>.evaInput {
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            align-items: center;
            width: 73%;
            margin: 0 auto;
        }

        .evaluate>.content>.evaInput>span {
            font-size: .5rem;
            color: #999;
            letter-spacing: .2rem;
        }

        .evaluate>.content>.evaInput>input {
            width: 75%;
            height: 1.05rem;
            min-height: 1.05rem;
            text-indent: 4px;
            border-bottom: 1px solid #999;
        }

        .evaluate>.btn {
            width: 100%;
            height: 43px;
            line-height: 43px;
            padding-left: .35rem;
            background: linear-gradient(left, #0f4bb2, #0052df);
            background: -webkit-linear-gradient(left, #0f4bb2, #0052df);
            text-align: center;
            font-size: 1rem;
            color: #fff;
            letter-spacing: .35rem;
            box-sizing: border-box;
        }
    </style>
    <body>
    <div class="mask"></div>
    <div class="evaluate pingfangRegular">
        <div class="content">
            <div class="title">请输入您想要修改的群名</div>
            <div class="evaInput">
                <span>请输入</span>
                <input type="text">
            </div>
        </div>
        <div class="btn">确定</div>
    </div>
</body>
<script type="text/javascript">
    apiready = function() {

    };
    var mask = $api.dom('.mask');
    var evaluate = $api.dom('.evaInput');
    var evaluateSub = $api.dom('.evaluate>.btn');
    var evaluateInput = $api.dom(evaluate, '.evaInput>input');

    $api.addEvt(mask, 'touchstart', function() {
        api.closeFrame();
    });

    $api.addEvt(evaluateSub, 'click', function() {
        if ($aapi.val(evaluateInput) == '') {
            api.alert({
                title: '提示',
                msg: '请输入您想修改的群名',
            }, function(ret, err) {});
        } else {
            api.closeFrame();
        }
    });
</script>
```

