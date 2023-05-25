Webpack打包生成的.map后缀文件，使得我们的开发调试更加方便，它能帮助我们链接到断点对应的源代码的位置进行调试（`//# souceURL`），而devtool就是用来指定source-maps的配置方式的。

*你可以直接使用* `SourceMapDevToolPlugin`*/*`EvalSourceMapDevToolPlugin` *来替代使用* `devtool` *选项，因为它有更多的选项。切勿同时使用* `devtool` *选项和* `SourceMapDevToolPlugin`*/*`EvalSourceMapDevToolPlugin` *插件。*`devtool` *选项在内部添加过这些插件，所以你最终将应用两次插件。*

| **devtool**                    | **构建速度** | **重新构建速度** | **生产环境** |   **品质(quality)**    |
| ------------------------------ | ------------ | ---------------- | ------------ | :--------------------: |
| (none)                         | +++          | +++              | yes          |      打包后的代码      |
| eval                           | +++          | +++              | no           |      生成后的代码      |
| cheap-eval-source-map          | +            | ++               | no           | 转换过的代码（仅限行） |
| cheap-module-eval-source-map   | o            | ++               | no           |  原始源代码（仅限行）  |
| eval-source-map                | --           | +                | no           |       原始源代码       |
| cheap-source-map               | +            | o                | no           | 转换过的代码（仅限行） |
| cheap-module-source-map        | o            | -                | no           |  原始源代码（仅限行）  |
| inline-cheap-source-map        | +            | o                | no           | 转换过的代码（仅限行） |
| inline-cheap-module-source-map | o            | -                | no           |  原始源代码（仅限行）  |
| source-map                     | --           | --               | yes          |       原始源代码       |
| inline-source-map              | --           | --               | no           |       原始源代码       |
| hidden-source-map              | --           | --               | yes          |       原始源代码       |
| nosources-source-map           | --           | --               | yes          |      无源代码内容      |

`+++` *非常快速,* `++` *快速,* `+` *比较快,* `o` *中等,* `-` *比较慢,* `--` *慢*

其中一些值适用于开发环境，一些适用于生产环境。对于开发环境，通常希望更快速的 source map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 source map，需要从 bundle 中分离并独立存在。

**注意：`cheap-module-eval-source-map`方法构建速度更快，但是不利于调试，推荐在大型项目考虑时间成本时使用。**

## 推荐方式

开发环境推荐：
`cheap-module-eval-source-map`
生产环境推荐：
`cheap-module-source-map`
然而vue-cli脚手架搭建的工程，开发环境使用的是`eval-source-map`，生产环境用的是`source-map`。不管怎么说的，其实用起来感觉都差不多。但是，直接将sourceMap放入打包后的文件，会明显增大文件的大小，不利于静态文件的快速加载；而**外联.map**时，.map文件只会在F12开启时进行下载（sourceMap主要服务于调试），故**推荐使用外联.map的形式**。