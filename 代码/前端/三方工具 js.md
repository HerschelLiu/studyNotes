* [Luckysheet (gitee.io)](https://mengshukeji.gitee.io/luckysheetdocs/zh/)纯前端类似excel的在线表格
* bpmn.js：流程图
* [Babylonjs中文网 (cnbabylon.com)](https://www.cnbabylon.com/)：Web3D渲染引擎
* [Cesium](http://cesiumcn.org/)：是一款开源的基于JavaScript的3D地图框架。其实他就是一个地图可视化框架

* [Installation | GSAP | Docs & Learning](https://gsap.com/docs/v3/Installation/?tab=npm&module=esm&method=private+registry&tier=free&club=false&require=false&trial=true): 动画库。scrollTrigger视差滚动

* lorem图片[Lorem Picsum](https://picsum.photos/)：不是 npm 包，只是个网址

* [Formily - 阿里巴巴统一前端表单解决方案 - Formily (formilyjs.org)](https://formilyjs.org/zh-CN)

* [Overview - Get started - Atlassian Design System](https://atlassian.design/get-started)-拖拽

* Unplugin-auto-import-模块自动导入,有很多子包，支持多种编译工具

  * ```js
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

* [VueDraggablePlus | 支持 Vue2 和 Vue3 的拖拽组件 (vue-draggable-plus.pages.dev)](https://vue-draggable-plus.pages.dev/)
