## vite自动导入文件

```js
// webpack require.context
/** svg */
const req = require.context('./icons', false, /\.svg$/)
const requireAll = (requireContext: any) => requireContext.keys().map((name: any) => requireContext(name))
requireAll(req)

// vite import.meta.globEager
/** 自动引入图片 */
const files = import.meta.globEager('../static/**/*.{png,jpg,jpeg,svg,gif}')
const asyncImagesmodules: any = {}

Object.keys(files).forEach((key: string) => {
  Reflect.set(asyncImagesmodules, key.replace(/^\..\/static\//, ''), files[key].default)
})

export default asyncImagesmodules
```

`import.meta.globEager`只有default没有name