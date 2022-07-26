## 准备

```bash
# 使用koa的生成器koa-generator建立简单koa2的工程目录
npm i -g koa-generator

# 创建文件夹
koa2 项目名

# 初始化
cd 项目名
pnpm init

# 解决跨域问题
pnpm add koa2-cors

# 安装typescript及热更新koa-generator带有nodemon
pnpm add typescript ts-node
pnpm add -D @types/node

# 输出彩色字（可选）
pnpm add chalk

# 安装koa，因为使用koa-generator，所以koa相关包已经引入；删除koa-onerror
pnnpm add -D @types/koa @types/koa-router @types/debug @types/koa-logger @types/koa
-json @types/koa-bodyparser    

# ESLint + Prettier（可选）
pnpm add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier

# 安装mongodb
pnpm add mongoose

# 前端工程化并行解决方案-concurrently
pnpm add concurrently

# 其他（见其他）
# 使代码支持import引用

tsc --init
```

## 配置



```json
{
  
}
```



### 修改目录结构

koa-generator生成的目录结构

```diff
|-- 
    |-- app.js
    |-- package.json
    |-- pnpm-lock.yaml
    |-- tsconfig.json
    |-- bin
    |   |-- www
    |-- public
    |   |-- images
    |   |-- javascripts
    |   |-- stylesheets
    |       |-- style.css
    |-- routes
    |   |-- index.js
    |   |-- users.js
    |-- src
    |   |-- index.ts
    |-- views
        |-- error.pug
        |-- index.pug
        |-- layout.pug

```

修改后目录结构

```diff
|-- 
+   |-- index.js
-   |-- app.js
    |-- package.json
    |-- pnpm-lock.yaml
    |-- tsconfig.json
    |-- bin
    |   |-- www
-   |-- public
-   |-- routes
    |-- src
-   |   |-- index.js
+   |   |-- config                  # 一些公共的配置，如数据库地址
+   |   |   |-- index.js
+   |   |-- controller              # 控制器层
+   |   |   |-- userController.js
+   |   |-- dbHelper                # 链接mongodb
+   |   |   |-- index.js
+   |   |-- error                   # 实现统一异常处理
+   |   |   |-- apiError.js
+   |   |   |-- apiErrorNames.js
+   |   |-- middleware              # 各种中间件
+   |   |   |-- responseFilter.js
+   |   |   |-- verify.js
+   |   |-- model                   # 实体类
+   |   |   |-- user.js
+   |   |-- router                  # 路由信息（api接口地址）
+   |       |-- index.js
+   |   |-- service
+   |   |-- utils                   # 各种工具类
+   |   |-- views                   # 模板

```

### 代码实现

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "sourceMap": true,
    "baseUrl": ".",
    "resolveJsonModule": false,
    "isolatedModules": false,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}

```



```js
// src/app
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import user from './router/user'
import './dbHelper'
import responseFilter from './middleware/responseFilter'

const app = new Koa()

app.use(bodyParser())
app.use(logger())
app.use(responseFilter())
app.use(user.routes()).use(user.allowedMethods())

export default app

```

```js
// src/config/index
import mongoose from 'mongoose'
import { DB_URL } from '../config/index'

mongoose.Promise = require('bluebird')

/** 连接 */
mongoose.connect(DB_URL, {
  useNewUrlParser: true
})

/** 连接成功 */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${ DB_URL}`)
})

/** 连接异常 */
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`)
})

/** 断开连接 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

export default mongoose

```

```js
// src/router/index
import Router from 'koa-router'
import UserController from '../controller/userController'
import verify from '../middleware/verify'

const router = new Router()

router.prefix('/user')

router
  .get('/', async (ctx, next) => {
    ctx.body = 'Hello Koa'
  })
  .get('/getAll', verify, UserController.getAllUser)
  .post('/saveUser', verify, UserController.saveUser)
  .get('/getUserById', verify, UserController.getUserById)

export default router

```

```js
// src/controller/userController
import User from '../model/user'
import ApiError from '../error/apiError'
import ApiErrorNames from '../error/apiErrorNames'

class UserController {
  static async getAllUser(ctx) {
    ctx.body = await User.find({})
  }

  static async getUserById(ctx) {
    let id = ctx.query.id
    let user = await User.findOne({ id })

    if (user) {
      ctx.body = user
    } else {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
  }

  static async saveUser(ctx) {
    let request = ctx.request.body

    if (!request.userName) {
      throw new ApiError(ApiErrorNames.USER_NAME_NOT_NULL)
    }

    let user = new User({
      userName: request.userName,
      age: request.age,
      tags: request.tags
    })

    user = await user.save()
    ctx.body = user
  }
}

export default UserController

```

```js
// src/model/user
import mongoose from "../dbHelper"
import { defaultSchemaExtend, defaultSchemaOptions } from "../config/index"

const Schema = mongoose.Schema

const UserSchema = new Schema(Object.assign({
  userName: String,
  age: {
    type: NUmber,
    min: 18,
    max: 99
  },
  phone: String,
  tags: {
    type: Array
  }
}, defaultSchemaExtend), defaultSchemaOptions)

const User = mongoose.model("User", UserSchema, 'Users') // Users是mongodb中Collection的名称

export default User

```

```js
// src/config/index
export const DB_URL = 'mongodb://'

export const defaultSchemaExtend = {
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
}

export const defaultSchemaOptions = {
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
}

export const jwtConfig = {
  secret: 'secret'
}

```

**统一异常处理**

```js
// src/error/apiErrorNames定义异常code码
const ApiErrorNames = {
  UNKNOWN_ERROR: {
    code: -1,
    msg: '未知错误'
  },
  USER_NOT_EXIST: {
    code: 1001,
    msg: '用户不存在'
  },
  USER_NAME_NOT_NULL: {
    code: 1002,
    msg: '用户名不能为空'
  }
}

ApiErrorNames.getErrorInfo = errorInfo => {
  if (!errorInfo) {
    errorInfo = ApiErrorNames.UNKNOWN_ERROR
  }

  return errorInfo
}

export default ApiErrorNames

```

```js
// src/error/apiError
import ApiErrorNames from "./apiErrorNames";

/** 自定义api异常处理 */
// class ApiError extends Error {
//   constructor(name) {
//     super()

//     let errorInfo = ApiErrorNames.getErrorInfo(name)

//     this.code = errorInfo.code
//     this.msg = errorInfo.msg
//   }
// }

/**
 * 如果babel将class编译为es5，导致instanceof没用的话用function
 * @param name 
 */
function ApiError(name) {
  Error.call(this)

  let errorInfo = ApiErrorNames.getErrorInfo(name)
  this.code = errorInfo.code
  this.msg = errorInfo.msg
}

ApiError.prototype = Object.create(Error.prototype)

export default ApiError

```

```js
// 自己实现一个jwt校验中间件 （也可以直接使用koa-jwt）,在需要校验的接口上加上verify就行了
import * as jwt from 'jsonwebtoken'

import { jwtConfig } from '../config/index'

export default async (ctx, next) => {
  const token = ctx.get('token')

  if (token === '') {
    ctx.throw(401, 'no token detected in http header \'token\'')
  }

  try {
    await jwt.verify(token, jwtConfig.secret)
  } catch (err) {
    ctx.throw(401, 'invalid token')
  }

  await next()
}

```

##  其他

### 使用import

使用babel。随着每年新的es语法的出现，有要对新的语法做适配。后面就出现babel-preset-es2016、babel-preset-es2017、babel-preset-es2018...，所以后面，把这些包做成了一个集合**babel-preset-env**

```
  // .babelrc
  {
    "parsets": ["@babel/preset-env"]
  }
```

```bash
pnpm add @babel/cli @babel/core @babel/node @babel/preset-env
```

并在根目录下创建一个.babelrc的文件

## 引用

> [hello-koa2-mongodb](https://github.com/chenyucai/hello-koa2-mongodb)](https://github.com/chenyucai/hello-koa2-mongodb)