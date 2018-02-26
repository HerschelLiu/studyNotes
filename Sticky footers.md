# 如果页面内容不够长的时候，页脚块粘贴在视窗底部；如果内容足够长时，页脚块会被内容向下推送。
# 兼容性最好的一种方法
```
<div class="detail-wrapper clearfix">
	<div class="datail-main"></div><!--真正内容所在的div-->
</div><!--内容部分，clearfix是为了清除浮动的-->
<div class="detail-close"></div><!--最底下的部分-->
```
`detail-wrapper`只要设置`min-height: 100%;`
`<div class="datail-main">`部分要设置`padding-bottom`，数值为`<div class="detail-close">`部分的高度，
`<div class="detail-close">`只要加上`position: relative;`就行，
但是`<div class="detail-close">`的位置会被上面的内容挤走，加个margin-top为负的自身高度就行了