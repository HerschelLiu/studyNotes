## 使用插件 babel-runtime 与 babel-plugin-tranform-runtime

抽离了公共模块, 避免了重复引入, 从一个叫`core.js`的库中引入所需polyfill(一个国外大神用ES3写的ES5+ polyfill)

使用方法 

-  `package.json`中添加依赖`babel-plugin-tranform-runtime`以及 `babel-runtime` 
-  `.babelrc`中配置插件:`"plugins": ["transform-runtime"]` 
- 接下来, 代码中可以直接使用ES6+的新特性,无需`import/require`额外东西, `webpack`也不需要做额外配置

优点 

- 无全局污染
- 依赖统一按需引入(polyfill是各个模块共享的), 无重复引入, 无多余引入
- 适合用来编写lib(第三方库)类型的代码

缺点 

- 被`polyfill`的对象是临时构造并被`import/require`的,并不是真正挂载到全局
- 由于不是全局生效, 对于实例化对象的方法,如`[].include(x)`, 依赖于`Array.prototype.include`仍无法使用

## 全局babel-polyfill(不使用useBuiltIns)

- 使用方法 

  1.  (浏览器环境)单独在html的`<head>`标签中引入`babel-polyfill.js`(CDN或本地文件均可)

  2. 在`package.json`中添加`babel-polyfill`依赖, 在`webpack`配置文件增加入口: 如`entry: ["babel-polyfill",'./src/app.js']`, polyfill将会被打包进这个入口文件中, 而且是放在文件最开始的地方

  3. 在`package.json`中添加`babel-polyfill`依赖, 在`webpack`入口文件顶部使用`import/require`引入,如`import 'babel-polyfill'``

- 优点 

  - 一次性解决所有兼容性问题,而且是全局的,浏览器的`console`也可以使用

- 缺点 

  - 一次性引入了ES6+的所有polyfill, 打包后的js文件体积会偏大
  - 对于现代的浏览器,有些不需要polyfill,造成流量浪费
  - 污染了全局对象
  - 不适合框架或库的开发

## 按需加载，全局babel-polyfill（最好）

使用方法

* `npm install babel-polyfill --save`

* `npm install babel-preset-env --save-dev`

* `.babelrc`中配置

  ```json
  {
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage"
      }]
    ]
  }
  ```
  
1. browsers设置使用场景，例子包含了支持每个浏览器最后两个版本和大于IE8的浏览器
  
2. useBuiltIns默认值为false，它的值有三种：
  
   * false: 不对polyfills做任何操作
     * entry: 根据target中浏览器版本的支持，将polyfills拆分引入，仅引入有浏览器不支持的polyfill
     * usage(新)：检测代码中ES6/7/8等的使用情况，仅仅加载代码中用到的polyfills
3. 在`webpack`入口文件（main.js）中使用`import/require`引入`polyfill`, 如`import 'babel-polyfill'`

优点 

- 按需(按照**指定的浏览器环境**所需)引入`polyfill`, 一定程度上减少了不必要`polyfill`的引入
- 配置简单, 无需对`webpack`做额外的配置
- 注意:
  - 不可与上个方法混用,否则会引起冲突
  - 全局方式要保证`polyfill`在所有其它脚本之前被执行(首行`import`或者设置为html的第一个`<head>`标签)

## polyfill.io

一个`CDN`方式提供的`polyfill`, 可根据浏览器`UserAgent`自动返回合适的`polyfill`,

Polyfill 可以为旧浏览器提供和标准 API 一样的功能。比如你想要 IE 浏览器实现 Promise 和 fetch 功能，你需要手动引入 [es6-promise](https://github.com/stefanpenner/es6-promise)、[whatwg-fetch](https://github.com/github/fetch)。而通过 [Polyfill.io](https://polyfill.io/)，你只需要引入一个 JS 文件。

`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>`

Polyfill.io 有一份[默认功能列表](https://polyfill.io/v2/docs/features/#default-sets)，包括了最常见的 polyfills：`document.querySelector`、`Element.classList`、ES5 新增的 `Array` 方法、`Date.now`、ES6 中的 `Object.assign`、`Promise` 等。

你也可以通过传递 `features` 参数来自定义功能列表：

```html
<!-- 加载 Promise&fetch -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,fetch"></script>
<!-- 加载所有 ES5&ES6 新特性 -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es5,es6"></script>
```

Polyfill.io 还提供了其他 API，具体请查阅[官方文档](https://polyfill.io/v2/docs/api)：

```html
<!-- 异步加载 -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?callback=main" async defer></script>
<!-- 无视 UA，始终加载 -->
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=modernizr:es5array|always"></script>
```

[cdn.polyfill.io](http://cdn.polyfill.io/) 使用 Fastly 提供的 CDN 服务，虽然没有中国节点，但测试下来速度也不慢，感兴趣的不妨试试这个服务～