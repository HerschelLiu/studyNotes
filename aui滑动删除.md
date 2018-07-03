```
.orderFormBar {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            width: 100%;
            padding: 11px 0;
            border-bottom: 3px solid #0f4bb2;
        }

        .orderFormBar>.content {
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            min-height: 81px;
            padding-right: 13px;
            padding-left: 18px;
            background: #f7f7f7;
            box-shadow: 0 0 13px rgba(39, 62, 129, 0.25);
            box-sizing: border-box;
        }

        .orderFormBar>.content>.left>.leftItem {
            font-size: 0;
        }

        .orderFormBar>.content>.left>.name {
            font-size: .6rem;
            color: #0351d6;
            letter-spacing: .2rem;
        }

        .orderFormBar>.content>.left .time {
            font-size: .55rem;
            color: #0351d6;
            letter-spacing: .2rem;
        }

        .leftItem>span:last-child {
            font-size: .5rem;
            color: #666;
            letter-spacing: .2rem;
            word-wrap: break-word;
            word-break: break-all;
        }

        .orderFormBar>.content>.right {
            font-size: .85rem;
            color: #dc0101;
        }

//滑动所需样式
.aui-swipe-handle {
            overflow-x: hidden;
            position: relative;
            z-index: 1;
            background-color: #ffffff;
        }

        .aui-swipe-btn {
            position: absolute;
            right: 0;
            z-index: 0;
            height: 81px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-flex: 1;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
        }

        .aui-swipe-btn .aui-btn {
            border-radius: 0;
            height: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
        }
        
        
        
        <div class="orderFormBar">
            <div class="content aui-swipe-handle">
                <div class="left pingfangRegular">
                    <div class="name">患者名称1</div>
                    <div class="leftItem">
                        <span class="mainComplaint">主&nbsp;诉:&nbsp;</span>
                        <span>头疼脑热 血压高</span>
                    </div>
                    <div class="leftItem">
                        <span class="time">时&nbsp;间:&nbsp;</span>
                        <span>2018-12-12</span>
                    </div>
                </div>
            </div>
            <div class="aui-swipe-btn">
                <div class="aui-btn aui-btn-danger" onclick="removeMessageBar(this)">删除</div>
            </div>
        </div>
        
        <script type="text/javascript" src="../script/aui-list-swipe.js"></script>
        //滑动删除事件
    var swipe = new auiListSwipe(function(ret) {
        // console.log(ret)
    });

    //移除对话条
    function removeMessageBar(el) {
        var thisParent = $api.closest(el, '.orderFormBar');
        $api.remove(thisParent);
    }
```

