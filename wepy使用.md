#### 创建

```
全局安装或更新WePY命令行工具
npm install -g wepy-cli

wepy init standard my-project
cd my-project
npm install

wepy build --watch
```

1. 使用`微信开发者工具`-->`添加项目`，`项目目录`请选择`dist`目录。
2. `微信开发者工具`-->`详情`-->`关闭ES6转ES5`。 重要：漏掉此项会运行报错。
3. `微信开发者工具`-->`详情`-->`关闭上传代码时样式自动补全`。 重要：某些情况下漏掉此项也会运行报错。
4. `微信开发者工具`-->`详情`-->`关闭代码压缩上传`。 重要：开启后，会导致真机computed, props.sync 等等属性失效。（注：压缩功能可使用WePY提供的build指令代替，详见后文相关介绍以及Demo项目根目录中的`wepy.config.js`和`package.json`文件。）
5. 本地项目根目录运行`wepy build --watch`，开启实时编译。（注：如果同时在`微信开发者工具`-->`设置`-->`编辑器`中勾选了`文件保存时自动编译小程序`，将可以实时预览，非常方便。）

#### 目录结构



#### wepy项目中使用Promise

在1.4.1以下版本，wepy生成的项目默认都会加入promise polyfill。

在1.4.1以后的版本，需要用户手动加入，具体方法如下：

- **进入项目根目录，安装polyfill**(如果安装的是standard 就再spp.wpy中使API promise化)

```
npm install wepy-async-function --save
```

- **在app.wpy中引入polyfill**

```
import 'wepy-async-function'; 
```

- **在app.wpy中使API promise化**

```
export default class extends wepy.app {

    constructor () {
        super();
        this.use('promisify');
    }

}
```

#### 文件中script写法

```js
import wepy from 'wepy';

export default class MyPage extends wepy.page {
// export default class MyComponent extends wepy.component {
    customData = {}  // 自定义数据

    customFunction ()　{}  //自定义方法

    onLoad () {}  // 在Page和Component共用的生命周期函数

    onShow () {}  // 只在Page中存在的页面生命周期函数

    config = {};  // 只在Page实例中存在的配置数据，对应于原生的page.json文件

    data = {};  // 页面所需数据均需在这里声明，可用于模板数据绑定

    components = {};  // 声明页面中所引用的组件，或声明组件中所引用的子组件

    mixins = [];  // 声明页面所引用的Mixin实例

    computed = {};  // 声明计算属性（详见后文介绍）

    watch = {};  // 声明数据watcher（详见后文介绍）

    methods = {};  // 声明页面wxml中标签的事件处理函数。注意，此处只用于声明页面wxml中标签的bind、catch事件(官方的)，自定义方法需以自定义方法的方式声明

    events = {};  // 声明组件之间的事件处理函数
}
```



#### 支持

目前支持`wepy-compiler-less`， `wepy-compiler-postcss`，`wepy-compiler-sass`、`wepy-compiler-babel`、`wepy-compiler-pug`对应各compiler请参考各自文档：

[wepy compiler](https://tencent.github.io/wepy/document.html#/)

**plugins：** plugins为`1.1.6`版本之后的功能，目前支持js压缩`wepy-plugin-ugliyjs`、图片压缩`wepy-plugin-imagemin`，其他plugin持续开发中......

#### [WePY数据绑定方式](https://tencent.github.io/wepy/document.html#/?id=wepy数据绑定方式)

WePY使用脏数据检查对setData进行封装，在函数运行周期结束时执行脏数据检查，一来可以不用关心页面多次setData是否会有性能上的问题，二来可以更加简洁去修改数据实现绑定，不用重复去写setData方法。代码如下：

```javascript
this.title = 'this is title';
```

需注意的是，在异步函数中更新数据的时候，必须手动调用`$apply`方法，才会触发脏数据检查流程的运行。如：

```javascript
setTimeout(() => {
    this.title = 'this is title';
    this.$apply();
}, 3000);
```

### [其它优化细节](https://tencent.github.io/wepy/document.html#/?id=其它优化细节)

#### [1. wx.request 接收参数修改](https://tencent.github.io/wepy/document.html#/?id=_1-wxrequest-接收参数修改)

点这里查看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)

```javascript
// 原生代码:

wx.request({
    url: 'xxx',
    success: function (data) {
        console.log(data);
    }
});

// WePY 使用方式, 需要开启 Promise 支持，参考开发规范章节
wepy.request('xxxx').then((d) => console.log(d));

// async/await 的使用方式, 需要开启 Promise 和 async/await 支持，参考 WIKI
async function request () {
   let d = await wepy.request('xxxxx');
   console.log(d);
}
```

#### 第三方组件

1. 微信小程序 wepyjs 第三方toast组件`npm install wepy-com-toast --save`

#### vscode 用户代码片段

```json
{
    "wepy-page": {
        "prefix": "wepy",
        "body": [
            "<style lang='less'>\n",
            "</style>\n",
            "<template>",
            "\t<view></view>",
            "</template>\n",
            "<script>",
            "import wepy from 'wepy'\n",
            "export default class ${1:${TM_FILENAME_BASE/([a-zA-Z])(.*)/${1:/upcase}$2/g}} extends wepy.${2|page,component,app|} {",
            "\t$3",
            "}",
            "</script>\n"
        ]
    },
    "Single Element": {
        "prefix": "singletag",
        "body": [
            "<$1 />\n"
        ]
    },
    "wepy-config": {
        "prefix": "configwepy",
        "body": [
            "config = {",
            "\tnavigationBarTitleText: '$1'",
            "}",
        ]
    }
}
```

### [实例](https://tencent.github.io/wepy/document.html#/?id=实例)

[查看更多](https://tencent.github.io/wepy/document.html#/?id=关于compilers和plugins)

通过前文的介绍可知，在 WePY 中，小程序被分为三个实例：小程序实例`App`、页面实例`Page`、组件实例`Component`。其中`Page`实例继承自`Component`。各自的声明方式如下：

```javascript
import wepy from 'wepy';

// 声明一个App小程序实例
export default class MyAPP extends wepy.app {
}

// 声明一个Page页面实例
export default class IndexPage extends wepy.page {
}

// 声明一个Component组件实例
export default class MyComponent extends wepy.component {
}
```

#### 笔记

1. 如果想要build之后dist文件夹里也有相应的文件夹,直接再src文件夹里创建就好

2. 运行clone的项目

   ```
   git clone '地址'
   
   cd '项目'
   
   npm install wepy-cli -g // 如果没有wepy脚手架的话
   npm install
   
   npm run dev
   ```

3. 压缩sass/less

    ```
    // 压缩sass
    // module.exports.compilers['sass'] = {outputStyle: 'compressed'}

    // 压缩less
    module.exports.compilers['less'] = {compress: true}
    ```

4. 找不到编译器：wepy-compiler-less

    ```
    npm install less 后再 npm install wepy-compiler-less 解决
    ```

5. 默认是在src/pages下创建wpy文件,编译后就是在dist下的pages下,但是这样所有的的文件都堆在一起,如果想像官方推荐的目录结构只要在src/pages下创建文件名就好了:scr/pages/项目名/项目名.wpy