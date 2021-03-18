## 宽度单位和像素密度

react的宽度不支持百分比，设置宽度时不需要带单位 `{width: 10}`

react 宽度基于`pt`为单位, 可以通过`Dimensions` 来获取宽高，`PixelRatio` 获取密度，比如200*100的图

```js
 var image = getImage({
   width: 200 * PixelRatio.get(),
   height: 100 * PixelRatio.get()
 });
```

### Text的样式继承

实际上React-native里边是没有样式继承这种说法的,但是对于Text元素里边的Text元素是直接继承父亲Text的

1. 文字必须放在Text元素里边
2. Text元素可以相互嵌套，且存在样式继承关系
3. `numberOfLines` 需要放在最外层的Text元素上，且虽然截取了文字但是还是会占用空间

## flex

基于flex的布局

1. view默认宽度为100%
2. 水平居中用`alignItems`, 垂直居中用`justifyContent`
3. 基于flex能够实现现有的网格系统需求，且网格能够各种嵌套无bug

## 图片布局

1. 通过`Image.resizeMode`来适配图片布局，包括`contain`, `cover`, `stretch`
2. 默认不设置模式等于cover模式
3. contain模式自适应宽高，给出高度值即可
4. cover铺满容器，但是会做截取
5. stretch铺满容器，拉伸

## 定位

1. 定位相对于父元素，父元素不用设置position：relative|absolute也行
2. padding 设置在Text元素上的时候会存在bug。所有padding变成了marginBottom

