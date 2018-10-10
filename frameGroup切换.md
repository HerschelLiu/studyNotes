```
<div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(0)">
            <div class="menu-three"></div>
            <div class="aui-bar-tab-label">夫子圈</div>
        </div>
        <div class="aui-bar-tab-item" tapmode onclick="setMenuIndex(1)">
            <div class="menu-four"></div>
            <div class="aui-bar-tab-label">吐槽</div>
        </div>
        
        api.openFrameGroup({
            name: 'index',
            background: '#fff',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerH,
                w: 'auto',
                h: height - headerH - footerH
            },
            index: 2,
            preload: 4,
            frames: [{
                name: 'fm_homePage',
                url: './html/homePage.html',
                bgColor: '#fff'
            }, {
                name: 'fm_message',
                url: './html/fm_message.html',
                bgColor: '#fff'
            }, {
                name: 'fz_circle',
                url: './html/fz_circle.html',
                bgColor: '#fff',
                pageParam: {
                    footerH: footerH
                }
            }, {
                name: 'fm_words',
                url: './html/fm_words.html',
                bgColor: '#fff'
            }, {
                name: 'fm_personal',
                url: './html/fm_personal.html',
                bgColor: '#fff'
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

    function setMenuIndex(_index) {
        api.setFrameGroupIndex({
            name: 'index',
            index: _index,
            scroll: true
        });
    }

```

