[转自](https://www.cnblogs.com/zichi/p/9068481.html)

`pointer-events: none` 真是个神奇的属性。

该属性有什么用？借用 [CSS3 pointer-events:none 应用举例及扩展](http://www.zhangxinxu.com/wordpress/2011/12/css3-pointer-events-none-javascript/) 的总结来说：

> `pointer-events: none` 顾名思义，就是鼠标事件拜拜的意思。元素应用了该 CSS 属性，链接啊，点击啊什么的都变成了 “浮云牌酱油”。`pointer-events: none` 的作用是让元素实体 “虚化”。例如一个应用 pointer-events: none 的按钮元素，则我们在页面上看到的这个按钮，只是一个虚幻的影子而已，您可以理解为海市蜃楼，幽灵的躯体。当我们用手触碰它的时候可以轻易地没有任何感觉地从中穿过去。

大家都知道 `input[type=text|button|radio|checkbox]` 支持 `disabled` 属性，可以实现事件的完全禁用。如果其他标签需要类似的禁用效果，可以试试 `pointer-events: none`

举个简单的例子：

```
<a href="http://sf.gg" style="pointer-events: none">click me</a>
```

这个链接，你是点不了的，并且 hover 也没有效果。（值得一提的是，仅仅是鼠标事件失效，用 tab 键还是可以选中该链接的，然后 enter 打开，这个时候可以去掉 a 标签的 href 属性，就不能让 tab 键选中了）

> 比如在某个项目中，很多元素需要定位在一个地图层上面，这里就要用到很多绝对定位或者相对定位的元素，但是这样的话，这些浮在上面的 div 或者其它元素一般都会给个宽高，或者 relative 的元素可以不给宽高，这个时候，这些元素就会盖住下面的地图层，以至于地图层无法操作。那么我们就可以给这个 div 设置 pointer-events: none，然后你就会发现下面的地图就可以拖动和点击了。但是悲剧的是，操作区域本身却无法操作了，直接被无视掉了，不过不用担心，我们可以给里面的元素重新设置为 pointer-events:auto，当然，只给需要操作的元素区域设置。