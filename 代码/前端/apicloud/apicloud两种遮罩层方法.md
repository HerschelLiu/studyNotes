## 方法一：openFrame方式

```
// 新建一个遮罩层的页面，写如下代码
<style>
        html,
        body {
            /*height: 98%;*/
            background: transparent;// 使背景为透明
            -webkit-touch-callout: none;
            font-family: Tahoma, Geneva, sans-serif;
            font-style: normal;
        }

        #dialog {
            position: absolute;//fixed也可以
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
      		height: 100%;
            -webkit-transition: all .1s;
            transition: all .1s;
            -webkit-transform: scale(0);
            transform: scale(0);
            opacity: 0;
            background-color: #e7e7e7;//可以不写，作用不知道
        }

        #dialog.in {
            -webkit-transform: scale(1);
            transform: scale(1);
            opacity: 1;
        }

        .confirmBox {
            position: fixed;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            width: 15rem;
            height: 15rem;
            background: red;
            z-index: 10;
        }
    </style>
</head>

<body>
    <div id="dialog"></div>
    <div class="confirmBox">
      4564645645664
    </div>
</body>

//原文件
var redBtn = $api.byId('redItem');
    $api.addEvt(redBtn, 'click', function() {
        api.openFrame({
            name: 'transaction-black',
            url: 'transaction-black.html',
            bounces: false,
            bgColor: 'rgba(0,0,0,0.6)',
            rect: {
                x: 0,
                y: 0,
                w: api.winWidth,
                h:api.winHeight
            }
        });
    });
```

## 方法二 aui.pupup.js

```
//触发的按钮，aui-popup-for的值为id
<div class="tc-medium-item" id="redItem" aui-popup-for="confirmBox">
//弹出框体
<div class="aui-popup my-popup-center" id="confirmBox">
      <div class="aui-popup-arrow"></div>// 此为弹出菜单的小三角
      <div class="aui-popup-content confirmBox"></div>// 弹出框的内容部分，操作圆角什么的在这写
 </div>
 
 
 .my-popup-center{// 不需要position，因为aui-popup中已经写了，并且写好了默认背景颜色为白色
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 12rem;
  height: 10rem;
}
.confirmBox{
  border-radius: 0.5rem;
}
```

