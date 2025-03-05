## vueuse

一款基于Vue组合式API的函数工具集。

它基于**Vue Composition Api (组合式API)**，只有在支持组合式API的环境下，才可以正常使用它；什么是组合式API?

**安装**

```
npm i @vueuse/core
// or
yarn add @vueuse/core
```

**例子1：useMouse**

```vue
<template>
  <div id="app">
    <h3>Mouse: {{x}} x {{y}}</h3>
  </div>
</template>
<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()
</script>

<!--或-->

<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

**例子2：useInterval**

```vue
<script setup lang="ts">
import { useInterval } from '.'
const { counter, pause, resume } = useInterval(200, { controls: true })

// counter 一个 Ref 对象，它是响应式的，counter.value等于已经计数的次数
// pause() 暂停
// resume() 恢复 
</script>

<template>
  <div id="APP">
    <p>Interval fired: {{ counter }}</p>
  </div>
</template>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

**例子3：useVModel**

```vue
<template>
  <div>
    name:
    <input v-model="_name"/>
    age:
    <input v-model="_age"/>
    sex:
    <input v-model="_sex"/>
  </div>
</template>
<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
const props = defineProps({
  name: String,
  age: String,
  sex: String
})
const emit = defineEmits(['update:name', 'update:age', 'update:sex'])

const _name = useVModel(props, 'name', emit)
const _age = useVModel(props, 'age', emit)
const _sex = useVModel(props, 'sex', emit)
</script>

<!-- 接着，在index.vue中使用它 -->

<template>
  <div>
    <Test
    v-model:name="formData.name"
    v-model:age="formData.age"
    v-model:sex="formData.sex"
    ></Test>
    {{ formData }}
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue-demi';
import Test from './Test.vue'
const formData = reactive({
  name: 'lily',
  age: '8',
  sex: 'boy'
})
</script>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## dom-to-image

可以将任意dom节点转换为矢量(SVG)或光栅(PNG或JPEG)图像.支持promise

### 安装

```bash
npm install dom-to-image -S
```

### 使用

```js
/* in ES 6 */
import domtoimage from 'dom-to-image';
/* in ES 5 */
var domtoimage = require('dom-to-image');
```

### 用法

1. 获取PNG图像base64编码的data URL：

```js
<div id="my-node"></div>

var node = document.getElementById('my-node');
// options 可不传
var options = {}  
domtoimage.toPng(node, options)
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
复制代码
```

1. 获取图像blob：

```js
domtoimage.toBlob(document.getElementById('my-node'))
    .then(function (blob) { 
        console.log('blob', blob)
    });
```

1. 获取JPEG图像base64编码的data URL并下载：

```javascript
domtoimage.toJpeg(document.getElementById('my-node'), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
});
```

1. 获取SVGdata URL，但筛选出所有元素：

```javascript
function filter (node) {
    return (node.tagName !== 'i');
}
 
domtoimage.toSvg(document.getElementById('my-node'), {filter: filter})
    .then(function (dataUrl) {
        /* do something */
});
```

1. 以uint8数组的形式获取原始像素数据，每4个数组元素表示一个像素的RGBA数据：

```javascript
var node = document.getElementById('my-node');
 
domtoimage.toPixelData(node)
    .then(function (pixels) {
        for (var y = 0; y < node.scrollHeight; ++y) {
          for (var x = 0; x < node.scrollWidth; ++x) {
            pixelAtXYOffset = (4 * y * node.scrollHeight) + (4 * x);
            /* pixelAtXY is a Uint8Array[4] containing RGBA values of the pixel at (x, y) in the range 0..255 */
            pixelAtXY = pixels.slice(pixelAtXYOffset, pixelAtXYOffset + 4);
          }
        }
    });
```



> 作者：知其
> 链接：https://juejin.cn/post/6988045156473634852
> 来源：稀土掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### options参数

| Name             | 类型     | Default     | Description                                                  |
| ---------------- | -------- | ----------- | ------------------------------------------------------------ |
| filter           | Function | ——          | 以DOM节点为参数的函数。如果传递的节点应包含在输出中，则应返回true(排除节点意味着也排除其子节点) |
| bgcolor          | String   | ——          | 背景色的字符串值，任何有效的CSS颜色值。                      |
| height           | Number   | ——          | 渲染前应用于节点的高度（以像素为单位）。                     |
| width            | Number   | ——          | 渲染前应用于节点的宽度（以像素为单位）。                     |
| style            | Object   | ——          | object对象，其属性在渲染之前要复制到节点的样式中。           |
| quality          | Number   | `1.0`       | 介于0和1之间的数字，表示JPEG图像的图像质量(例如0.92=>92%)。默认值为1.0（100%） |
| cacheBust        | Boolean  | `false`     | 设置为true可将当前时间作为查询字符串附加到URL请求以启用清除缓存。 |
| imagePlaceholder | Boolean  | `undefined` | 获取图片失败时使用图片的数据URL作为占位符。默认为未定义，并将在失败的图像上引发错误。 |

## js-base64

## nprogress

顶部进度条

## path-to-regexp

该工具库用来处理 url 中地址与参数，能够很方便得到我们想要的数据。js 中有 RegExp 方法做正则表达式校验，而 path-to-regexp 可以看成是 url 字符串的正则表达式。

## tinymce

富文本编辑器

## vuedraggable

拖拽组件

## unocss

原子化css

## js-cookie

一个简单、轻量级的JavaScript API，用于处理cookie。适用于所有浏览器，接受任何字符，经过严格测试，无依赖关系，支持ES模块，支持AMD/Common

## normalize.css

Normalize.css 是一个可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一。 Normalize.css 能干什么：保留有用的默认值，不同于许多 CSS 的重置标准化的样式，适用范围广的元素。纠正错误和常见的浏览器的不一致性。一些细微的改进，提高了易用性。使用详细的注释来解释代码。

## nprogress

这是一个类似youtube、Medium等网站顶部小进度条插件。

## QS

是一个增加了一些安全性的查询字符串解析和序列化字符串的库。`qs.parse()`是将URL解析成对象的形式`qs.stringify()`是将对象 序列化成URL的形式，以&进行拼接.`let data = qs.stringify({"username":this.username, "password":this.password});` =>`username=renping&password=123456`

## screenfull

实现全屏功能`npm install --save screenfull`

## v-viewer

vue图片点击放大`npm install v-viewer --save`

## vue-awesome-swiper

vue轮播插件，基于swiper`npm install --save vue-awesome-swiper`

## vue-countTo

数字滚动插件`npm install vue-count-to`

## vue-cropper：图片裁剪

## 拖拽

* [vue-drag-resize](https://github.com/kirillmurashov/vue-drag-resize)：拖拽缩放;
* vuedraggable：拖拽，页面中使用需要引用组件vuedraggable， 支持vue2.0，1.0
  * [vuedraggable@next](https://github.com/SortableJS/vue.draggable.next): vue3
* vue-draggable-plus 支持 Vue3 或 Vue 2.7+

## vue-svgicon：一个创建 svg 图标组件的工具

```json
// package.json
// 生成 svg 图标组件, -s: svg 源文件，-t: 图标组件生成路径
{
    "scripts": {
    "svg": "vsvg -s ./src/icons/svg -t ./src/icons/components --ext ts --es6"
    }
}
// 执行命令 npm run svg
```

```css
/* 首先，需要为 vue-svgicon 在全局写一些样式代码。 */
/* recommended css code for vue-svgicon */
.svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: inherit;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
}

.svg-fill {
    fill: currentColor;
    stroke: none;
}

.svg-up {
    /* 默认 */
    transform: rotate(0deg);
}

.svg-right {
    transform: rotate(90deg);
}

.svg-down {
    transform: rotate(180deg);
}

.svg-left {
    transform: rotate(-90deg);
}
```

```js
/* 在main.js中引入svgIcon组件并且全局注册 vue-svgicon 组件 */
// main.js
import Vue from 'vue'
import App from './App.vue'
import SvgIcon from 'vue-svgicon'

// Default tag name is 'svgicon'
Vue.use(SvgIcon, {
        tagName: 'svgicon'
    }

) new Vue( {
        el: '#app',
        render: h=> h(App)
    }

)
```

```vue
/* 在组件中使用 */
<template>
    <div id="app">
        <p>
            <svgicon
                name="404"
                width="200"
                height="200"
                color="#42b983 #35495e"
            ></svgicon>
        </p>
    </div>
</template>
 
<script>
// �使用之前需要引入生成的图标�
import 'src/icons/components/404'
 
export default {
    name: 'app',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>
```

## vuex-module-decorators

TypeScriptES7装饰器，用于以声明方式创建Vuex模块

## vue-class-component

提供了Vue、Component等

## vue-property-decorator

深度依赖了vue-class-component，拓展出了更多操作符：@Prop、@Emit、@Inject、@Model、@Provide、@Watch

```js
import {Component, Prop, Vue} from 'vue-property-decorator'
 
@Component
export default class App extends Vue {
 name:string = 'Simon Zhang'
 
 // computed
 get MyName():string {
 return `My name is ${this.name}`
 }
 
 // methods
 sayHello():void {
 alert(`Hello ${this.name}`)
 }
 
 mounted() {
 this.sayHello();
 }
}
```

相当于

```js
export default {
 data () {
 return {
  name: 'Simon Zhang'
 }
 },
 
 mounted () {
 this.sayHello()
 },
 
 computed: {
 MyName() {
  return `My name is ${this.name}`
 }
 },
 
 methods: {
 sayHello() {
  alert(`Hello ${this.name}`)
 },
 }
}
```

* 页面引导：https://www.shepherdjs.dev/
