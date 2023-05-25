### 原因

其实就是：**苹果手机浏览页面中设置的css伪类：active失效了。**

### 解决方法

- `在iOS系统的移动设备中，需要在按钮元素或body/html上绑定一个touchstart事件才能激活:active状态。`
- `<div touchstart=""></div>`