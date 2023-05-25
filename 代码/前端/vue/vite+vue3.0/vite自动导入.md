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

```ts
/** Components */
const asyncComponentsFiles: any = import.meta.globEager('./components/**/index.vue')
Object.keys(asyncComponentsFiles).forEach((key: any) => {
  const file = asyncComponentsFiles[key].default
  /** vue文件中需要写name */
  app.component(`Comp${file.name}`, file)
})

/** directives */
const asyncDirectivesFiles: any = import.meta.globEager('./directives/*.ts')
Object.keys(asyncDirectivesFiles).forEach(key => {
  const name = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
  const file = asyncDirectivesFiles[key][name]
  app.directive(name, file)
})
```