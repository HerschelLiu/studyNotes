#### 1.分解引导页功能点

​    引导页在APP第一次启动时显示,一般由几张全屏图片组成.用户滑动到页尾时,点击进入app主页面,由此归纳出下面的功能点列表

* 引导页的显示判断(通常只有第一次app启动时才显示)
* 引导页的内容图片显示
* 引导页的滑动切换图片功能
* 点击引导页尾页进入app主页面

#### 2.功能点实现

(1) 引导页显示判断.引导页在第一次启动app时显示,可使用`api.getPrefs`方法对第一次启动进行变量标识缓存,以后每次启动都判断标识是否存在,如不存在,则判断为第一次启动app

```javascript
apireader = function () {
            //引导页显示判断
            var isFirst = api.getPrefs({
                key: 'isFirst',
                sync: true
            });

            if (!isFirst) { // 第一次启动app,启动引导页面
                fnStartGuidePage();
                
            } else { // 不是第一次启动app,跳转正常主页面
                fnStartMainPage();
            }
        };
```

​	(2) 引导页的内容图片展示与滑动切换图片.UIScrollPicture模块支持多张本地或网络图片的显示，并支持手势滑动切换图片。只要将UIScrollPicture的模块尺寸设置全屏，就实现了引导页的主体功能。

​	（3）点击引导页尾页启动app主页。引导页滑动至页尾的判断可通过UIScrollPicture.open方法的回调callback中的index来判断，点击事件可以写在callback中的click时间触发逻辑中。<br>

​	需要说明的是，一般的引导页实在尾页上放按钮，点击按钮跳转主页面。因为模块特殊性，一般dom元素无法存在于模块之上。可以用UIButtom，如果按钮样式特殊可以用frame。以下使用UIBotton。

```javascript
 function fnStartGuidePage() { // 启动显示引导页
            // 设置页面默认图片
            var tData = [
                'widget://res/guide1.png',
                'widget://res/guide2.png',
                'widget://res/guide3.png',
                'widget://res/guide4.png',
            ];
            UIScrollPicture = api.require('UIScrollPicture');
            UIScrollPicture.open({
                rect: {
                    x: 0,
                    y: 0,
                    w: 'auto',
                    h: 'auto',
                },
                data: {
                    paths: tData
                },
                styles: {
                    indicator: { // 指示器
                        align: 'center',
                        color: 'rgba(255,255,255,0.4)',
                        activeColor: '#fff'
                    }
                },
                contentMode: 'scaleToFill', // 图片填充模式: 填充
                auto: false, // 禁止自动滚动
                loop: false // 禁止循环播放
            }, function (ret, err) {
                if (ret) {
                    /*
                    // 方法1 点击末页任意位置进入主页面
                    if('click' == ret.eventType){
                        if(ret.index == 3){
                            //关闭页面,进入主页
                            fnStartMainPage();
                        }
                    }
                    */

                    // 方法2 点击末页按钮进入主页面
                    // 设计思路： 添加一个UIButton模块，在UIScrollPicture页面滑动到末页时显示UIButton模块，其余页面隐藏按钮模块，在按钮模块添加事件点击模块进入主页面
                    // 添加末页点击进入主页面方法
                    if ('show' == ret.eventType) {
                        UIScrollPicture.addEventListener({
                            name: 'scroll'
                        },function (ret, err) { 
                            if (ret.status) {
                                if (ret.index == (tData.length - 1)) {
                                    // 显示进入按钮
                                    fnShowStartBtn();
                                } else {
                                    // 隐藏进入按钮
                                    fnHideStartBtn();
                                }
                            }
                         });
                    }
                }
            });
        }
```

