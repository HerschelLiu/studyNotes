VitePress 是 VuePress 的兄弟，它建立在 Vite 之上

> ```
> vuePress=webpack+vue2`,`vitePress=vite+vue3
> ```

 VuePress v1，但是由于构建在 Webpack 之上，对于一个只有几个页面的简单文档站点来说，启动开发服务器所花费的时间简直令人难以忍受。而且 HMR 更新也可能需要数秒才能反映到浏览器中

从根本上说，这是因为 VuePress v1 在本质上是一个 Webpack 应用程序。即使只有两个页面，它也是一个完整的正在编译的 Webpack 项目(包括所有主题源文件)。更糟糕的是，当项目有很多页面时，服务器必须首先完全编译每个页面，然后才能显示任何内容

顺便说一句，Vite 很好地解决了这些问题:服务器几乎立即启动，按需编译只编译所服务的页面，以及快速的 HMR。

### 它使用 Vite 之下的优势

- 更快的开发服务器启动
- 更快的热更新
- 更快的构建(内部使用 Rollup)

### 更轻的页面

- Vue 3 摇树 + Rollup 代码拆分(摇掉代码中未引用部分（dead-code),production 模式下会自动使用 tree-shaking 打包时除去未引用的代码。作用是优化项目代码)
- 不为每个请求的每个页面提供元数据。这样可以将页面权重从总页面数中分离出来。只发送当前页的元数据。客户端导航同时获取新页面的组件和元数据
- 不使用 vue-router，因为 VitePress 的需求非常简单和具体-使用一个简单的自定义路由器(低于 200 LOC)代替。
- (WIP) i18n 区域设置数据也应该按需获取。

## 入门

本节将帮助您从头开始构建一个基本的 VitePress 文档站点。如果您已经有了一个现有的项目，并且希望将文档保存在项目中，那么从步骤 3 开始。

步骤 1:创建并更改到一个新目录。

```
mkdir vitepress-starter && cd vitepress-starter
```

步骤 2:用首选`yarn`包管理器初始化。

```
yarn init
```

步骤 3:本地安装 VitePress

```
yarn add --dev vitepress
```

步骤 4:创建您的第一个文档

```
mkdir docs && echo '# Hello VitePress' > docs/index.md
```

步骤 5:向 package.json 中添加一些脚本。

```
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```

步骤 6:在本地服务器上提供文档站点。

```
$ yarn run docs:dev
```

到目前为止，您应该已经有了一个基本但功能强大的 VitePress 文档站点。

当您的文档站点开始形成时，[请务必阅读部署指南](https://link.juejin.cn?target=https%3A%2F%2Fvitepress.vuejs.org%2Fguide%2Fdeploy.html)。

## 结构

没有任何配置，页面非常小，用户无法在站点周围导航。为了定制你的站点，让我们首先在 docs 目录中创建一个。vitepress 目录。

这是所有特定于 vitepress 的文件将被放置的地方。您的项目结构可能是这样的

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  └─ index.md
└─ package.json
```

## 配置

如果没有任何配置，这个站点将会是非常局限的，用户也无法在你的网站上自由导航。为了更好地自定义你的网站，首先，你需要在你的文档目录下创建一个 `.vuepress` 目录。所有 VuePress 相关的文件都将会被放在这里。你的项目结构可能是这样：

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  └─ index.md
└─ package.json
```

一个 VuePress 站点必要的配置文件是 `.vuepress/config.js`，它应当导出一个 JavaScript 对象：

```
module.exports = {
  title: 'Hello VitePress',
  description: 'Just playing around.'
}
```

参见[Config Reference](https://vitejs.cn/config/basics.html) 查看所有选项的完整列表。