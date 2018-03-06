# 以饿了么项目为例
要将父子组件串联起来，实现父子组件之间通信

子组件`ratingselect.vue`中的`methods`
```
select (type, event) {
        if (!event._constructed) {
          return
        }
        this.selectType = type
        this.$emit('ratingtypeSelect', type)
      },
      toggleContent () {
        if (!event._constructed) {
          return
        }
        this.onlyContent = !this.onlyContent
        this.$emit('contentToggle', this.onlyContent)
      }
```
使用`this.$emit('ratingtypeSelect', type)`给父组件发射一个方法

父组件`food.vue`中在调用子组件位置`<ratingselect :selectType="selectType" :onlyContent="onlyContent"
                        :desc="desc" :ratings="food.ratings"
                        @ratingtypeSelect="ratingtypeSelect1"
                        @contentToggle="contentToggle"></ratingselect>`
						添加`@ratingtypeSelect="ratingtypeSelect1"`
						并在`methods`中添加
```
ratingtypeSelect1 (...) {
    ...
}
```
这样就联通起来了
# 注意父子之间不管是$emit中，还是@的地方，命名全是驼峰命名