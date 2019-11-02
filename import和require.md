 ES6标准发布后，module成为标准，标准的使用是以export指令导出接口，以import引入模块，但是在我们一贯的node模块中，我们采用的是CommonJS规范，使用require引入模块，使module.exports导出接口。 

**使用方式**

require

```js
// 引用
const http = require('http')

// 对应js文件写法
exports.http = http
module.exports = http
```

import

```js
// 引用
import http from 'http'
import { default as http } from 'http'
import * as from 'http' // as关键字用于取别名，export中可以用，import中也可以用
import { get } from 'http' // import后面跟上花括号的形式是最基本的用法，花括号里面的变量与export后面的变量一一对应
import { getList as get } from 'http'
import http, { getList } from 'fs'

// 对应js文件写法
export default http
export const http
export function getList
export { getList, get }
export * from 'http'


// default关键字，其实是别名的语法糖
// js
export default function(){}
// 等效于
function a() {}
export { a as default }

// import
import a from './d'
// 等效于
import { default as a } from './d'
```



区别：

|  命令   |      规范      |    调用    |   本质   |                             特点                             |
| :-----: | :------------: | :--------: | :------: | :----------------------------------------------------------: |
| require |  CommonJS规范  | 运行时调用 | 赋值过程 | 非语言层面的标准。 社区方案，提供了服务器/浏览器的模块加载方案。只能在运行时确定模块的依赖关系及输入/输出的变量，无法进行静态优化。 |
| import  | es6+的语法标准 | 编译时调用 | 解构过程 | 语言规格层面支持模块功能。支持编译时静态分析，便于JS引入宏和类型检验。动态绑定 |

#### 关于调用

1. require的引用可以在代码的任何地方, 可以不赋值给一个变量直接用，module.exports后面是啥，require的结果就是啥，相当于跨界面赋值。
2.  import的语法跟require不同，而且import必须放在文件的最开始，且前面不允许有其他逻辑代码，这和其他所有编程语言风格一致。 因为他是编译时式的

目前所有引擎都还没有实现import，在node中使用是因为babel把import编译为require。 如果现在仍然在代码中部署require，那么等到ES6被引擎支持时，你必须升级你的代码，而如果现在开始部署import，那么未来可能只需要做很少的改动。