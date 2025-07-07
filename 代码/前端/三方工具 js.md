[TOC]

## 通用

### JavaScript 库时间格式化功能：[Luxon](https://luxon.nodejs.cn/?id=luxon)和[date-fns](https://date-fns.org/)

### 跨平台桌面应用框架[tauri](https://tauri.app/zh-cn/)：

Tauri 是一个构建适用于所有主流桌面和移动平台的轻快二进制文件的框架

* electron包含最新chrome内核各个平台表现一致
* tauri使用的是每个平台自由的浏览器内核，需要考虑兼容问题
* tauri更安全
* tauri编译后包体积轻量

### 样式

#### [shadcn](https://www.shadcn.com.cn/)

#### 鼠标交互动画[cursify](https://cursify.vercel.app/)

### 动画

#### [anime.js](https://anime.js.cool/documentation/)

#### [animejs](https://animejs.com/)

#### [Installation | GSAP | Docs & Learning](https://gsap.com/docs/v3/Installation/?tab=npm&module=esm&method=private+registry&tier=free&club=false&require=false&trial=true): 动画库。scrollTrigger视差滚动

#### **[GSAP](https://gsap.com/docs/v3/)**： 前端页面动效

#### **[Lottie](https://lottiefiles.com/)**


### [Luckysheet (gitee.io)](https://mengshukeji.gitee.io/luckysheetdocs/zh/)纯前端类似excel的在线表格

### bpmn.js：流程图

### web 3D

#### [Babylonjs中文网 (cnbabylon.com)](https://www.cnbabylon.com/)：Web3D渲染引擎

#### [Cesium](http://cesiumcn.org/)：是一款开源的基于JavaScript的3D地图框架。其实他就是一个地图可视化框架

### lorem图片[Lorem Picsum](https://picsum.photos/)：不是 npm 包，只是个网址

### [Formily - 阿里巴巴统一前端表单解决方案 - Formily (formilyjs.org)](https://formilyjs.org/zh-CN)

### 拖拽

#### [Atlassian Design System](https://atlassian.design/get-started)



### 自动化测试工具

#### [Jest](https://www.jestjs.cn/)功能强大的 JavaScript 测试框架，尤其适合 React 项目。

- 开箱即用，无需额外配置。
- 内置断言库和 Mock 功能。
- 支持快照测试。

#### [Cypress](https://www.cypress.io/)功能强大的端到端（e2e测试）测试框架。

- 可视化运行测试用例，调试友好。
- 支持跨浏览器测试。
- 内置等待机制，减少显式等待代码。

### npkill

是一个用于快速查找和删除系统中旧的和占用大量空间的 **node_modules** 文件夹的工具。它可以帮助你释放宝贵的磁盘空间，并且使用起来非常简单

可以通过以下命令直接使用 npkill，而无需安装

```bash
npx npkill
```

默认情况下，npkill 会从执行命令的路径开始扫描 **node_modules** 文件夹。你可以使用上下箭头键（或 *j* 和 *k* 键）在列出的文件夹之间移动，并按空格键或删除键来删除选定的文件夹。按 *o* 键可以打开选定结果所在的目录，按 *Q* 或 *Ctrl + c* 键可以退出[1](https://www.npmjs.com/package/npkill)

选项

npkill 提供了多种选项来定制搜索和删除操作，例如：



- *-c, --bg-color*：更改行高亮颜色（可选颜色：blue, cyan, magenta, white, red, yellow）。
- *-d, --directory*：设置开始搜索的目录（默认是当前目录）。
- *-D, --delete-all*：自动删除找到的所有 node_modules 文件夹。
- *-e, --hide-errors*：隐藏错误信息。
- *-E, --exclude*：排除指定目录。
- *-f, --full*：从用户的主目录开始搜索。
- *-gb*：以 GB 为单位显示文件夹大小。
- *-s, --sort*：按大小、路径或最后修改时间排序结果。
- *-t, --target*：指定要搜索的目录名称（默认是 node_modules）。
- *-x, --exclude-hidden-directories*：排除隐藏目录。
- *--dry-run*：模拟删除操作，不实际删除任何内容。

### 数据库

#### idb

最热门的`IndexedDB`包装库

### Canvas

* [modern-screenshot](https://github.com/qq15725/modern-screenshot)：生成图片

### PDF

#### **html2pdf.js**

将内容导出为 PDF`npm i html2pdf.js`.图片需要先加载再导出为pdf，不然回事空白，将图片地址变为base64；部分图片的宽度会过大，导致图片加载不全的问题，这在预览的情况下也存在，加上样式：

```css
img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
  height: auto !important;
  width: auto !important;
  margin: 10px 0;
}

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1921151470918673625
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

故此需要在导出pdf前，添加以上样式。

为什么要前端导出？因为后端抓取的数据中前端标签会不闭合，但是浏览器会自动补全，所以后有一种方法，即前端获取innerHTML然后交给后端

```html
作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1921151470918673625
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 使用示例，纯在标签闭合不完整的情况
let element = `
  <div>
    <img src='http://t13.baidu.com/it/u=2041049195,1001882902&fm=224&app=112&f=JPEG?w=500&h=500' style="width: 300px;" >
    <p>职业：前端</p>
    <p>技能：唱、跳、rap</p
  </div
`;

function generatePDF() {
  element =`<style>
  img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
      height: auto !important;
      width: auto !important;
      margin: 10px 0;
    }
  </style>` + element;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = element;
  // 获取到完整的html结构，提交给后端处理
  console.log(tempDiv.innerHTML);
}
```



### 请求工具集

#### [alovajs](https://alova.js.org/zh-CN/tutorial/getting-started/introduce)

```bash
npm install alova --save
```

支持uniapp、taro

#### 请求增强多框架：[TanStack Query](https://cangsdarm.github.io/react-query-web-i18n/vue)

---------------------

## vue

### 拖拽

#### [VueDraggablePlus | 支持 Vue2 和 Vue3 的拖拽组件 (vue-draggable-plus.pages.dev)](https://vue-draggable-plus.pages.dev/)

### 动画

#### 一个专门为Vue与Nuxt设计的组件集[inspira-ui](https://github.com/unovue/inspira-ui/tree/main)

#### 高级图片裁剪工具[Advanced Cropper](https://advanced-cropper.github.io/vue-advanced-cropper/)

----------

## React

### hooks

#### [ahooks](https://ahooks.js.org/zh-CN/)

### 通用

#### [弹窗封装](https://github.com/eBay/nice-modal-react)

#### [日程时间轴组件](https://planby.netlify.app/)

### 动画

#### [Framer Motion](https://motion.framer.wiki/introduction)

--------------

## vite

### Unplugin-auto-import-模块自动导入,有很多子包，支持多种编译工具

```ts
// 比如 vite
// vite.config
import viteAutoImport from 'unplugin-auto-import/vite

export default defineConfig({
  plugins: [
    viteAutoImport({
      imports: ['vue', 'vue-router'], // 公共库的自动引用
      dirs: ['./src/api'], // 本地代码自动引用
      dts: './src/auto-import.d.ts' // 只有使用 ts 才需要此配置。此配置会自动生成类型定义文件到相应路径
    })
  ]
})
```

