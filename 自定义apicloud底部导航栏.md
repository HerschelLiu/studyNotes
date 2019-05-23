```html
.aui-bar-tab .aui-bar-tab-item .menu-one,
        .aui-bar-tab .aui-bar-tab-item .menu-two,
        .aui-bar-tab .aui-bar-tab-item .menu-three,
        .aui-bar-tab .aui-bar-tab-item .menu-four,
        .aui-bar-tab .aui-bar-tab-item .menu-five {
            position: relative;
            top: 0.1rem;
            height: 1.05rem;
            margin: 0 auto;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .menu-active .aui-bar-tab-label,
        .aui-bar-tab .menu-active .aui-bar-tab-label,
        .aui-bar-tab .menu-active .aui-bar-tab-label,
        .aui-bar-tab .menu-active .aui-bar-tab-label,
        .aui-bar-tab .menu-active .aui-bar-tab-label {
            color: #0052df!important;
        }

        .aui-bar-tab .menu-active .menu-one {
            background: url('./image/tab-logo-active.png')!important;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .menu-active .menu-two {
            background: url('./image/tab-msg-active.png')!important;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .menu-active .menu-three {
            background: url('./image/tab-jiance-active.png')!important;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .menu-active .menu-four {
            background: url('./image/tab-words-active.png')!important;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .menu-active .menu-five {
            background: url('./image/tab-personal-active.png')!important;
            background-size: cover!important;
            background-repeat: no-repeat!important;
        }

        .aui-bar-tab .aui-bar-tab-item .menu-one {
            width: 1.15rem;
            background: url('./image/tab-logo.png');
        }

        .aui-bar-tab .aui-bar-tab-item .menu-two {
            width: 1.2rem;
            background: url('./image/tab-msg.png');
        }

        .aui-bar-tab .aui-bar-tab-item .menu-three {
            width: .9rem;
            height: 1.1rem;
            background: url('./image/tab-jiance_.png');
        }

        .aui-bar-tab .aui-bar-tab-item .menu-four {
            width: 1.05rem;
            background: url('./image/tab-words.png');
        }

        .aui-bar-tab .aui-bar-tab-item .menu-five {
            width: 1rem;
            height: 1.1rem;
            background: url('./image/tab-personal.png');
        }

        .aui-bar-tab .aui-bar-tab-label {
            bottom: -0.4rem;
            font-family: pingfangMedium, arial, sans-serif!important;
            color: #a9a9a9;
            padding-left: .25rem;
            letter-spacing: .25rem;
            box-sizing: border-box;
        }
        
        
        
        <footer id="footer" class="aui-bar aui-bar-tab">
        <div class="aui-bar-tab-item menu-active" tapmode onclick="setMenuIndex(0)">
            <div class="menu-one"></div>
            <div class="aui-bar-tab-label">夫子医</div>
        </div>
        <div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(1)">
            <div class="aui-dot"></div>
            <div class="menu-two"></div>
            <div class="aui-bar-tab-label">消息</div>
        </div>
        <div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(2)">
            <div class="menu-three"></div>
            <div class="aui-bar-tab-label">检测</div>
        </div>
        <div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(3)">
            <div class="menu-four"></div>
            <div class="aui-bar-tab-label">留言</div>
        </div>
        <div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(4)">
            <div class="menu-five"></div>
            <div class="aui-bar-tab-label">个人</div>
        </div>
    </footer>
```

```js
api.openFrameGroup({

            name: 'index',
            background: '#fff',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: height - footerH
            },
            index: 0,
            preload:0,
            frames: [{
                name: 'homepage',
                url: './html/fm_homepage.html',
            }, {
                name: 'classification',
                url: './html/fm_classification.html'
            }, {
                name: 'wallet',
                url: './html/fm_wallet.html'
            }, {
                name: 'shoppingcart',
                url: './html/fm_shoppingcart.html',
            }, {
                name: 'personal',
                url: './html/fm_personal.html'
            }]
        }, function(ret, err) {
            menuSelect(ret.index);
        });
    };

    //切换菜单选中状态
    function menuSelect(_index) {
        for (var i = 0; i < menus.length; i++) {
            if (_index == i) {
                $api.addCls(menus[i], 'menu-active');
            } else {
                $api.removeCls(menus[i], 'menu-active');
            }
        }
    }

function setMenuIndex(_index){
    api.setFrameGroupIndex({
        name: 'index',
        index: _index,
    });
}

```

