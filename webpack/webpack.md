# 基本概念

平时我们 `npm` 中安装的文件中有 -S -D, -D 表示我们的依赖是安装在开发环境的，而-S 的是安装依赖在生产环境中。

* 入口（enrty） 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始，webpack 会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。
  - 默认值是 `./src/index.js`，然而，可以通过在 webpack 配置中配置 entry 属性，来指定一个不同的入口起点（或者也可以指定多个入口起点）。
* 出口（output）属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，主输出文件默认为 `./dist/main.js`，其他生成文件的默认输出目录是 `./dist`
* [loader](https://link.juejin.im?target=https%3A%2F%2Fwww.webpackjs.com%2Fconcepts%2Floaders%2F): 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
* [插件 plugins](https://link.juejin.im/?target=https%3A%2F%2Fwww.webpackjs.com%2Fconcepts%2Fplugins%2F): loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
* [模式 mode](https://link.juejin.im/?target=https%3A%2F%2Fwww.webpackjs.com%2Fconcepts%2Fmode%2F): 通过选择 `development` 或 `production` 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

# 搭建(babel)

## 安装

```
mkdir webpack-dev && cd webpack-dev
npm init -y // 初始化，会出现package.json文件
npm i webpack webpack-cli -D
```

生成了 package.json 文件，在文件中添加

```
"scripts": {
  "start": "webpack --mode development",
  "build": "webpack --mode production"
}
```

> --`mode` 模式 (必选，不然会有 `WARNING`)，是 `webpack4` 新增的参数选项，默认是 `production`:`--mode production` 生产环境;;--mode development 开发环境

要想对 webpack 中增加更多的配置信息，我们需要建立一个 webpack 的配置文件。在根目录下创建 `webpack.config.js` 后再执行 `webpack` 命令，webpack 就会使用这个配置文件的配置了

配置中具备以下的基本信息：

```js
const path = require('path')
module.exports = {
    entry: './src/index.js', // 打包入口：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
    output: {
        path: path.resolve(__dirname, 'dist'),// 解析路径为 ./dist或者直接./dist
        filename: 'bundle.js'
    }, // 出口
    resolve: {}, // 配置解析：配置别名、extensions 自动解析确定的扩展等等
    devServer: {}, // 开发服务器：run dev/start 的配置，如端口、proxy等
    module: {}, // 模块配置：配置loader（处理非 JavaScript 文件，比如 less、sass、jsx、图片等等）等
    plugins: [] // 插件的配置：打包优化、资源管理和注入环境变量
}
```

上面我们定义了打包入口 `./src/index.js`，打包出口为 `./dist`, 打包的文件夹名字为`bundle.js`，执行`npm run build`命令后，index.js 文件会被打包为 `bundle.js` 文件。此时随便建立一个 html 文件引用这个`bundle.js`就可以看到你在`index.js` 写的代码了。

[path.resolve([...paths\])](https://link.juejin.im?target=http%3A%2F%2Fnodejs.cn%2Fapi%2Fpath.html%23path_path_resolve_paths) 方法会把一个路径或路径片段的序列解析为一个绝对路径。

### 使用 html-webpack-plugin 创建 html 文件
更多情况下我们不希望打包一次，就新建一次 html 文件来引用打包后的文件，这样显得不智能或者说当你打包的文件名修改后，引用路径就会出错。

这个时候我们就可以使用 html-webpack-plugin 插件来将 HTML 引用路径和我们的构建结果关联起来。
`npm install html-webpack-plugin -D`
创建文件public/index.html 修改 webpack.config.js 文件
``` js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: './public/index.html' // 配置要被编译的html文件
    })
  ]
}
```
复制代码重新执行 npm run build, dist 目录就会多个 index.html 并引入了 bundle.js.

### 抽取 css 到独立文件, 自动添加前缀

`npm i mini-css-extract-plugin postcss-loader autoprefixer -D`

我们在写 css 时不免要考虑到浏览器兼容问题，如 `transform` 属性，需要添加浏览器前缀以适配其他浏览器。故使用到 `postcss-loader` 这个 loader， 下面则是相关的配置

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //...
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```

### 打包 less 文件

开发中通常会用到一门预处理语言，这里以`less`为例，通过`less-loader`可以打包 less 为 css 文件

```
npm install less less-loader -D
```

新建 `src/assets/style/index.less`, 并且在 `src/index.js` 中引入 `import './assets/style/index.less'`

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')] // 添加css中的浏览器前缀
            }
          },
          'less-loader'
        ]
      }
    ]
  }
  //...
}
```

执打包命令后就可以发现 `index.less` 中写的样式会和`color.css`一样被打包进 `main.css`中。

### 配置 babel

#### babel-loader

`Babel` 是一个让我们能够使用 ES 新特性的 JS 编译工具，我们可以在 webpack 中配置 Babel，以便使用 ES6、ES7 标准来编写 JS 代码。

Babel 7 的相关依赖包需要加上 `@babel` scope。一个主要变化是 presets 设置由原来的 `env` 换成了 `@babel/preset-env`, 可以配置 `targets`, `useBuiltIns` 等选项用于编译出兼容目标环境的代码。其中 `useBuiltIns` 如果设为 `"usage"`，Babel 会根据实际代码中使用的 ES6/ES7 代码，以及与你指定的 targets，按需引入对应的 `polyfill`，而无需在代码中直接引入 `import '@babel/polyfill'`，避免输出的包过大，同时又可以放心使用各种新语法特性.

`npm i babel-loader @babel/core @babel/preset-env -D`

* [babel-loader](https://link.juejin.im?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fbabel-loader): 用 babel 转换 ES6 代码需要使用到 `babel-loader`

* [@babel-preset-env](https://link.juejin.im?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40babel%2Fpreset-env)： 默认情况下是等于 ES2015 + ES2016 + ES2017，也就是说它对这三个版本的 ES 语法进行转化。

* [@babel/core](https://link.juejin.im?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40babel%2Fcore)：babel 核心库

根目录下新建 `.babelrc` 文件

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

- presets 是一堆 plugins 的预设，起到方便的作用。
- plugins 是编码转化工具，babel 会根据你配置的插件对代码进行相应的转化。

```js
// 修改 webpack.config.js
module.exports = {
  module: {
    rules: [
      //...
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
```

#### babel/polyfill 

> Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。

- babel-polyfill: 如上述所说，对于新的 API，你可能需要引入 babel-polyfill 来进行兼容
- 关键点
  - babel-polyfill 是为了模拟一个完整的 ES2015+环境，旨在用于应用程序而不是库/工具。
  - babel-polyfill 会污染全局作用域

`npm i @babel/polyfill -D`

修改 `weboack.config.js`

```
module.exports = {
  entry: ['@babel-polyfill', './src/index.js']
}
```

编译之后会很大

因为上面的代码表示将 `@babel-polyfill` 的代码也打包进去了。

当然这不是我们希望的，如何按需编译呢？ 我们可以这么做：

```js
// index.js
import '@babel/polyfill' // 引入

```

还原 `webpack.config.js`

```js
module.exports = {
  entry: './src/index.js'
}
```

修改 `.babelrc`

```json
{
  "presets": [["@babel/preset-env", { "useBuiltIns": "usage" }]]
}
```

`yarn build` 后发现我们的代码体积就变得很小了！

### @babel/runtime 和 @babel/plugin-transform-runtime

babel-runtime 的作用：

- **提取辅助函数**。ES6 转码时，babel 会需要一些辅助函数，例如 _extend。babel 默认会将这些辅助函数内联到每一个 js 文件里， babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块 babel-runtime 中，这样做能减小项目文件的大小。
- **提供 polyfill**：不会污染全局作用域，但是不支持实例方法如 Array.includes

`babel-runtime` 更像是分散的 polyfill 模块，需要在各自的模块里单独引入，借助 `transform-runtime` 插件来自动化处理这一切，也就是说你不要在文件开头 import 相关的 `polyfill`，你只需使用，`transform-runtime` 会帮你引入.

Babel 提供了另外一种方案 `transform-runtime`，它在编译过程中只是将需要 `polyfill` 的代码引入了一个指向 `core-js` 中对应模块的链接(alias)。

首先安装 runtime 相关依赖

```
npm i @babel/plugin-transform-runtime -D
npm i @babel/runtime-corejs2 -S
```

```json
// 修改 .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": [["@babel/plugin-transform-runtime", { "corejs": 2 }]]
}
```

`index.js` 移除 `import '@babel/polyfill'`

### 打包前清理源目录文件 clean-webpack-plugin

每次打包，都会生成项目的静态资源，随着某些文件的增删，我们的 dist 目录下可能产生一些不再使用的静态资源，webpack 并不会自动判断哪些是需要的资源，为了不让这些旧文件也部署到生产环境上占用空间，所以在 webpack 打包前最好能清理 dist 目录。

`npm install clean-webpack-plugin -D`

```js
// 修改 webpack.config.js 文件
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  plugins: [new CleanWebpackPlugin(['dist'])]
}
```

### hash

hash 是干嘛用的？ 我们每次打包出来的结果可能都是同一个文件，那我上线的时候是不是要替换掉上线的 js，那我怎么知道哪是最新的呢，我们一般会清一下缓存。而 hash 就是为了解决这个问题而存在的

我们此时在改一些 webpack.config.js 的配置

```js
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  //...
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css'
    })
  ]
}
```

### 减少 resolve 的解析，配置别名

如果我们可以精简 `resolve` 配置，让 `webpack` 在查询模块路径时尽可能快速地定位到需要的模块，不做额外的查询工作，那么 `webpack` 的构建速度也会快一些

```js
module.exports = {
  resolve: {
    /**
     * alias: 别名的配置
     *
     * extensions: 自动解析确定的扩展,
     *    比如 import 'xxx/theme.css' 可以在extensions 中添加 '.css'， 引入方式则为 import 'xxx/theme'
     *    @default ['.wasm', '.mjs', '.js', '.json']
     *
     * modules 告诉 webpack 解析模块时应该搜索的目录
     *   如果你想要添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
     *   这样配置在某种程度上可以简化模块的查找，提升构建速度 @default node_modules 优先
     */
    alias: {
      '@': path.resolve(__dirname, 'src'),
      tool$: path.resolve(__dirname, 'src/utils/tool.js') // 给定对象的键后的末尾添加 $，以表示精准匹配
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
```

### webpack-dev-serve

`webpack-dev-server` 是 webpack 官方提供的一个工具，可以基于当前的 webpack 构建配置快速启动一个静态服务。当 `mode` 为 `development` 时，会具备 `hot reload` 的功能，即当源码文件变化时，会即时更新当前页面，以便你看到最新的效果

`npm install webpack-dev-server -D`

package.json 中 scripts 中添加

```
"start": "webpack-dev-server --mode development"
```

默认开启一个本地服务的窗口 [http://localhost:8080/](https://link.juejin.im?target=http%3A%2F%2Flocalhost%3A8080%2F) 便于开发

#### 配置开发服务器

我们可以对 `webpack-dev-server` 做针对性的配置

```
module.exports = {
  // 配置开发服务器
  devServer: {
    port: 1234,
    open: true, // 自动打开浏览器
    compress: true // 服务器压缩
    //... proxy、hot
  }
}
复制代码
```

- contentBase: 服务器访问的根目录（可用于访问静态资源）
- port: 端口
- open: 自动打开浏览器

### 模块热替换(hot module replacement)

模块热替换(`HMR - Hot Module Replacement`)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面时丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式。

上面我们 `npm start` 后修改一次文件，页面就会刷新一次。这样就存在很大问题了，比如我们使用 `redux`, `vuex` 等插件，页面一刷新那么存放在 `redux`, `vuex` 中的东西就会丢失，非常不利于我们的开发。

HMR 配合 webpack-dev-server