# webstorm中.vue文件中写stylus

> WebStorm 默认不识别 `.vue` 里的 stylus 块，需要在 `<style>` 上显式声明 `type`。

```vue
<template>
  <div class="box">stylus 示例</div>
</template>

<style lang="stylus" type="text/stylus">
.box
  color #333
  padding 10px
</style>
```

- `lang="stylus"` 让构建工具按 stylus 编译（Vite / webpack 需要装 `stylus`、`stylus-loader`）。
- `type="text/stylus"` 让 WebStorm 把块内当 stylus 做语法高亮与提示。
- 只写 `lang` 不写 `type` 时，部分 WebStorm 版本不会高亮。
