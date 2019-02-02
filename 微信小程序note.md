#### ​事件的绑定

bind和catch区别：bind开头的事件绑定不会阻止冒泡事件向上冒泡，而catch开头的会阻止

#### 尺寸单位

在微信小程序中

* rpx：可以根据屏幕宽度自适应。规定屏幕宽度为750rpx。
* rem：规定屏幕宽度为20rem。1rem = (750/20)rpx.

#### data- 属性

data- 后的命名如希望结果是驼峰，则用“-”，其他的会传唤为全是小写

```
// em1
<view data-demo-test='1' bindtap='test'></view>
// em2
<view data-demoTest='1' bindtap='test'></view>
// 事件
test: function(e){
    consolo.log(e);
}

```

控制台输出结果：
em1：target下的dataset中就变为{demoTest}

em2：target下的dataset中就变为{demotest}