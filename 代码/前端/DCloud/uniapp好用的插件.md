## 框架

### [unibest](https://www.unibest.tech/base/1-introduction)

由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` + `VSCode`(可选 `webstorm`) + `uni插件`+ `wot-ui`（可选其他 UI 库）构建，集成了多种工具和技术，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式即可运行 `web`、`小程序` 和 `App`。（注：`App` 还是需要 `HBuilderX`）

`unibest` 内置了 `约定式路由`、`layout布局`、`请求封装`、`请求拦截`、`登录拦截`、`UnoCSS`、`i18n多语言` 等基础功能，提供了 `代码提示`、`自动格式化`、`统一配置`、`代码片段` 等辅助功能，让你编写 `uniapp` 拥有 `best` 体验 （ `unibest 的由来`）。

> `unibest` 目前支持 `H5`、`小程序` 和 `App`。

## 插件

### [uni-helper](https://uni-helper.js.org/)

增强 uni-app 系列产品的开发体验

#### [文件路由vite-plugin-uni-pages](https://uni-helper.js.org/vite-plugin-uni-pages)

#### 类型

uniapp 本身不支持组件类型，安装[`@uni-helper/uni-typed`](https://uni-typed.netlify.app/)来支持[git地址](https://github.com/uni-helper/uni-typed)

**不是直接安装@uni-helper/uni-typed**，没有。而是安装他的子包

## UI

### [uview-plus](https://uiadmin.net/uview-plus/)（推荐）/uv-ui

支持全平台

可以通过 `@ttou/uv-typings` 提供类型支持。

- Vue组件
  - vue <= 2.6 引用 `v2.d.ts`，需要安装 `@vue/runtime-dom`
  - vue >= 3 引用 `v3.d.ts`

```json
{
  "compilerOptions": {
    "types": [
      "@ttou/uv-typings/v2"
    ]
  }
}
```



### [wot-ui](https://www.wot-design-uni.cn/guide/introduction)（推荐）

仅支持微信小程序、支付宝小程序、钉钉小程序、H5、APP 

### [nutui-uniapp](https://nutui-uniapp.netlify.app/)