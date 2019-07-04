```
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0" />
    <title>弹窗</title>
    <link rel="stylesheet" type="text/css" href="../css/api.css" />
    <link rel="stylesheet" type="text/css" href="../css/aui.css" />
    <link rel="stylesheet" type="text/css" href="../css/font.css" />
    <style>
        html,
        body {
            width: 100%;
            height: 100%;
            background: transparent !important;
        }

        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 5;
        }

        .confirm {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 91.2%;
            height: 9.95rem;
            background: #fff;
            border-radius: .25rem;
            z-index: 10;
            overflow: hidden;
        }

        .content {
            /*position: relative;*/
            width: 100%;
            height: 7.4rem;
            padding: 1rem .75rem 0;
            box-sizing: border-box;
        }

        .content>.title {
            /*position: absolute;*/
            /*top: 1rem;*/
            width: 100%;
            margin-bottom: 1rem;
            text-align: center;
            font-size: .95rem;
            color: #ff4b87;
        }

        .content>p {
            text-align: center;
            font-size: .75rem;
            color: #121212;
        }

        .bottomBtn {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 2.55rem;
            font-size: .85rem;
        }

        .think {
            width: 50%;
            height: 100%;
            line-height: 2.55rem;
            text-align: center;
            background: #f2f2f2;
            color: #121212;
        }

        .think:active {
            background: #e0dddd;
        }

        .ok {
            width: 50%;
            height: 100%;
            line-height: 2.55rem;
            text-align: center;
            background: linear-gradient(left, #ff4b87, #fb2c62);
            background: -webkit-linear-gradient(left, #ff4b87, #fb2c62);
            color: #fff;
        }

        .ok:active {
            background: linear-gradient(left, #cc3c6c, #c7234e);
            background: -webkit-linear-gradient(left, #cc3c6c, #c7234e);
            color: #eee;
        }
    </style>
</head>

<body>
    <div class="mask"></div>
    <div class="confirm">
        <div class="content">
            <div class="title #fb2c62">确认离开收银台?</div>
            <p class="pingfangRegular">您的订单在24小时内未支付将被取消,请尽快完成支付。</p>
        </div>
        <div class="bottomBtn pingfangRegular">
            <div class="think" tapmode>再想想</div>
            <div class="ok" tapmode>确认离开</div>
        </div>
    </div>
</body>
<script type="text/javascript" src="../script/api.js"></script>
<script type="text/javascript">
    apiready = function() {

    };
    var think = $api.dom('.think');
    var ok = $api.dom('.ok');

    $api.addEvt(think, 'click', function() {
        api.closeFrame();
    });
    $api.addEvt(ok, 'click', function() {
        api.closeWin({
            name: 'win_cashier'
        });

    });
</script>

</html>

```

