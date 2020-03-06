## 解析(resolve)

### mainFields

有一些第三方模块会针对不同环境提供几分代码。 例如分别提供采用 ES5 和 ES6 的2份代码，这2份代码的位置写在 package.json 文件里，如下：

```js
{
  "jsnext:main": "es/index.js",// 采用 ES6 语法的代码入口文件
  "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```

Webpack 会根据 mainFields 的配置去决定优先采用那份代码， mainFields 默认如下：

```js
mainFields: ['browser', 'main']
```

Webpack 会按照数组里的顺序去 package.json 文件里寻找，只会使用找到的第一个。

假如你想优先采用 ES6 的那份代码，可以这样配置：

```js
mainFields: ['jsnext:main', 'browser', 'main']
```

### alias

```js
alias: {
  Utilities: path.resolve(__dirname, 'src/utilities/'),
  Templates: path.resolve(__dirname, 'src/templates/')
}
```

用于配置模块如何解析，及创建 `import` 或 `require` 的别名，如上例子配置后，可以在页面直接`import Utility from 'Utilities/utility';`,而不用`import Utility from '../../utilities/utility';`

**也可以在给定对象的键后的末尾添加 `$`，以表示精准匹配：**

```
alias: {
  xyz$: path.resolve(__dirname, 'path/to/file.js')
}
```

### enforceExtension

若为true，则所有导入语句的文件必须带上扩展名，即`require('./foo.js')`正常,`require('./foo')`报错

### enforceModuleExtension

同上，只不过此字段影响模块，且值影响'/node_modules/'下的模块

### extensions

自动解析确定的扩展

在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。

```js
extensions: [".js", ".json"] // 默认
```

可以在用户引入模块时不带扩展

```js
import File from '../path/to/file'
```

### modules

 resolve.modules 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 node_modules 目录下寻找。 有时你的项目里会有一些模块会大量被其它模块依赖和导入，由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，就像这样 import '../../../components/button' 这时你可以利用 modules 配置项优化，假如那些被大量导入的模块都在 ./src/components 目录下，把 modules 配置成

```
modules:['./src/components','node_modules']
```

后，你可以简单通过 import 'button' 导入。