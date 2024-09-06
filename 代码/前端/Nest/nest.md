## 前言

nest 使用 ts 装饰器功能， 此功能还处于实验性功能，需`tsconfig`中开启`emitDecoratorMetadata: true`和`experimentalDecorators: true`。nest 中已经自动开启。



### 起步

[第一步 (nestjs.cn)](https://docs.nestjs.cn/10/firststeps)

```bash
npm i -g @nestjs/cli
nest new project-name
```



### 项目需要安装的包

* nest 配置管理：`@nestjs/config`
* nest类型：`@nestjs/mapped-types`
* JWT：`@nestjs/passport passport passport-local @nestjs/jwt passport-jwt`、-D `@types/passport-local @types/passport-jwt`
* 将一个普通的 JavaScript 对象转换为类的实例： `class-transformer`
* 在类中对参数进行验证：`class-validator`
* 加密算法：`argon2`
* 数据库Prisma: `prisma-binding @prisma/client`、-D `prisma`
* `express`
* 可选：
  * mock数据： -D `mockjs @types/mockjs`
  * 工具函数：`lodash`、-D `@types/lodash`
  * 上传文件处理Multer： `multer`、-D`@types/multer`



```bash
pnpm add @nestjs/mapped-types @nestjs/config prisma-binding @prisma/client @nestjs/passport passport passport-local @nestjs/jwt passport-jwt lodash class-transformer class-validator argon2 multer express
pnpm add -D prisma mockjs @types/mockjs @types/lodash @types/multer
```



## 基础知识

约定上：

控制器`controller`只实现路由，不实现具体功能

服务`service`处理业务逻辑

### 设置别名

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 创建资源

```bash
nest g res name --no-spec
# 选择REST API
#CRUD Y 此项会吧增删改查、dto 等创建出来,并附带基础代码，比如增删改、查全部、根据id查的方法名
```

此命令会统一创建模块、服务和控制器

### 路由简单访问

```ts
// app.module

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 完整写法
    provide: HdService,
    useClass: HdService
  }],
})
export class AppModule {}

```



```ts
// app.service

import { Injectable } from '@nestjs/common';

@Injectable() // 表示将以下类注册成提供者
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```





```ts
// app.controller

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

默认监听3000.当`@Get`中没有字符串时，直接访问端口即可直接调用，当`@Get('a')`则需要访问`localhost：3000/a`，如果此时直接访问，则会显示没有找到的报错信息。

当`@Controller('a')`时，则下面的路由会继承，访问`localhost:3000/a`；此时`@Get('b')`，则访问`localhost:3000/a/b`



### 依赖注入

```ts
// a文件
class A {
  constructor() {}
}

// b文件
class B {
  constructor(private CService) {}
}

// c文件
class C {
  constructor() {}
}
```

当 A 想依赖 B 时

```ts
class A {
  constructor(private B = new B()) {}
}
```

但是这样不行，因为 B 还依赖 C，所以 A 中就要解决这个问题

```ts
class A {
  constructor(private B = new B(new C())) {}
}
```

需要手动一个一个解决依赖问题很麻烦，但是Nestjs 等内部自动解决了依赖问题：

```ts
class A {
  constructor(private BService: B) {}
}
```



### 服务提供者（providers）

将一些功能进行模块划分，比如：登录注册模块、订单管理、商品管理、课程管理等。模块有独立作用域。

服务（Service）一定要放在providers中，否则程序会报错。

----



创建服务可以直接复制代码，也可以使用 nest命令

```
nest [generate|g] s 名称 --no-spec [-d]
```

g表示 generate自动化命令

s 表示 service，即创建服务

-d 表示不是真正执行，只是输出将要创建的信息

--no-spec表示不生成测试文件

此命令执行，会告诉你生成` src/名称/名称.service.ts`文件

如果加上`--flat`则生成的文件不会有子目录,` src/名称.service.ts`

---

例：

创建`src/hd.service.ts`

```ts
// app.module

// ...
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 完整写法
    provide: HdService,
    useClass: HdService
  }],
})
// ...

// app.controller

// ...
export class AppController {
  constructor(private readonly appService: HdService) {}
  // ...
}

```

当把provide的值改掉之后

```ts
// app.module

// ...
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 完整写法
    provide: 'hd',
    useClass: HdService
  }],
})
// ...

// app.controller

// ...
export class AppController {
  constructor(
  	@Inject('hd')
  	private readonly appService: HdService
   ) {}
  // ...
}

```

`appService: HdService`冒号后的东西有两个含义：1.ts 类型；2.会用这个名字取容器例找，直接改成 hd 是不行的，因为只有`HdService`，也不能写 hd，因为这不是类型。所以这么写很麻烦，而且没有类型支持，所以还是同样的名字好。

#### 基本类型的提供者

大多数是类，如果有些时候需要直接使用基础数据类型

```ts
// app.module

// ...
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 这里导入的可以在 service 或者控制器中使用
    provide: 'appName',
    useValue: 'test' // 这里也可以对象
  }],
})
// ...

// app.controller

// ...
export class AppController {
  constructor(private readonly appService: AppService, @Inject('appName') private appName: string) {}
  // ...

 // 或 app.service

import { Injectable } from '@nestjs/common';

@Injectable() // 表示将以下类注册成提供者
export class AppService {
  constructor(@Inject('appName') private appName: string) {}
  // ...
}

```



#### 根据环境变量动态注册服务提供者

需要安装`dotenv`的 npm插件

新建`.env`

```
NODE_ENV = development
```

```ts
// app.module

// ...
import { config } from 'dotenv'
import { join } from 'path'
config({path: join(__dirname, '../.env')})

/**
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path: path.join(__dirname, '../.env')})
需要在 tsconfig 中增加 esModuleInterop: true，意思是使CommonJS模块也能按照ES 模块那样导入
*/

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 这里导入的可以在 service 或者控制器中使用
    provide: 'appName',
    useValue: process.env.NODE_ENV === 'development' ? '123' : '456'
  }],
})
// ...
```



#### 通过服务动态加载配置项

例：

创建`src/config/development.config.ts`

```ts
// src/config/development.config.ts
export const developmentConfig = {
  url: 'localhost'
}
```



```ts
// src/config/production.config.ts
export const productionConfig = {
  url: '99.99.99'
}
```





```ts
// app.module

// ...
import { developmentConfig } from './config/development.config'
import { productionConfig } from './config/production.config'
import { config } from 'dotenv'
import { join } from 'path'
config({path: join(__dirname, '../.env')})

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, { // 这里导入的可以在 service 或者控制器中使用
    provide: 'ConfigService',
    useValue: process.env.NODE_ENV === 'development' ? developmentConfig : productionConfig
  }],
})
// ...
```



#### 使用工厂函数注册提供者

```ts
// app.module

// ...
const ConfigService = { // 这里导入的可以在 service 或者控制器中使用
    provide: 'ConfigService',
    useValue: process.env.NODE_ENV === 'development' ? {url: 'localhost'} : {url: '999.999.999'}
  }

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConfigService, { // 这里导入的可以在 service 或者控制器中使用
    provide: 'DbService',
    inject: ['ConfigService'],
    useFactory(configService) {
      return new DbService(configService)
    }
  }],
})
// ...

// ./db.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbService {
  constructor(private readonly options: Record<string, any>) {}
  
  public connect() {
    return `<h1 style="background: red">连接数据库 - ${this.options.url}</h1>`
  }
}
```



#### 模块共享服务

命令`nest g mo 名称`, mo即模块服务`名称/名称.module.ts`

`nest g co 名称`创建控制器

分别创建两个文件夹`test`和`hd`，文件夹中都有服务、控制器、模块文件

```ts
// hd/hd.module.ts

// ...
@Module({
  imports: [TestModule],
  // ...
})

// ...

// test/test.module.ts

// ...
@Module({
  providers: [TestService],
  exports: [TestService]
})

// ...
```

增加导入（imports），导出（exports）字段，这样就可以使用 test 模块的内容了



#### 异步服务提供者

可以有异步

```ts
// app.module

// ...
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConfigService, { // 这里导入的可以在 service 或者控制器中使用
    provide: 'DbService',
    inject: ['ConfigService'],
    useFactory: async (configService) => {
      return new Promise((r) => {
        setTimeout(() => {
          r('继续')
        }, 3000)
      })
    }
  }],
})
// ...

// ...
export class AppController {
  constructor(
  	private readonly appService: AppService,
     @Inject('DbService')
     private readonly dbService: string
   ) {}
  
  @Get()
  getHello(): string {
    return this.dbService
  }
}
```



### 模块

#### 初始化配置项模块

```bash
nest g mo config --no-spec
nest g s config --no-spec
```



创建存配置数据的文件

```ts
// ./configure/app.ts

export default () => ({
  app: {
    name: 'test'
  }
})

// ./configure/database.ts

export default () => ({
  database: {
    host: 'localhost'
  }
})
```



```ts
// ./config/config.module.ts
import { Module } from '@nestjs/common';
import { AppController } from 'config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
```



```ts
// ./config/config.service.ts

import { Injectable } from '@nestjs/common';
import path from 'path'
import { readdirSync } from 'fs'

@Injectable() 
export class ConfigService {
  config = {}
  
  constructor() {
    const config = {
      path: path.resolve(__dirname, '../configure')
    }
    
    const files = readdirSync(config.path)
    files.map(async (file) => {
      if (file.slice(-2) === 'js') {
        const module = await import(path.resolve(config.path, file))
        this.config = {...this.config,  ...module.default()}
      }
    })
  }
  
  get(path: string): string {
    return path.split('.').reduce((config, name) => {
      return config[name]
    }, this.config)
  }
}
```



```ts
// app.module
// ...
@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
// ...


// app.controller

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  getHello(): any {
    return this.config.get();
  }
}

```



#### 模块间的调用

```bash
nest g mo article --no-spec
nest g co article --no-spec
```



```ts
// ./article/article.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from './../config/config.module'
import { ArticleController } from 'article.controller';

@Module({
  controller: [ArticleController]
})
export class ArticleModule {}
```



```ts
// app.module

// ...
@Module({
  imports: [ConfigModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService]
})
// ...

```



```ts
// ./article/article.controller

import { Controller } from '@nestjs/common';

@Controller()
export class ArticleController {
  constructior(private readonly config: ConfigService) {}
  
  @Get()
  index() {
    return 'index'
  }
}
```



```ts
// ./config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from './../config/config.service'

@Global() // 声明为全局模块
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
```



#### 动态模块注册语法

```ts
// ./config/config.service.ts

import { Injectable } from '@nestjs/common';
import path from 'path'
import { readdirSync } from 'fs'

@Injectable() 
export class ConfigService {
  constructor(
  	@Inject('CONFIG_OPTIONS') private options: { path: string } // 方法二接收 options
  	@Optional() private config = {}) {
    
    const files = readdirSync(options.path)
    files.map(async (file) => {
      if (file.slice(-2) === 'js') {
        const module = await import(path.resolve(options.path, file))
        this.config = {...this.config,  ...module.default()}
      }
    })
  }
  
  get(path: string): string {
    return path.split('.').reduce((config, name) => {
      return config[name]
    }, this.config)
  }
}
```



```ts
// app.module

// ...
@Module({
  imports: [ConfigModule.register({path: path.resolve(__dirname, './configure')}), ArticleModule],
  controllers: [AppController],
  providers: [AppService]
})
// ...

```



```ts
// ./config/config.module.ts
import { Module } from '@nestjs/common';
import { AppController } from 'config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {
  static register(options: {path: string}): DynamicModule {
    return {
      module: ConfigModule, // 必须有
      providers: [{ // 方法一传递 options
        provide: ConfigService, 
        useVFactory() {
          return new ConfigService()
        }
      }, 
      { // 方法二传递 options
        provide: 'CONFIG_OPTIONS',
        useValue: options
      }],
    }
  }
}
```



```ts
// app.controller
// ...
export class AppController {
  constructor(private readonly config: ConfigService) {}
  
  @Get()
  getHello(): any {
    // return this.hd
    return this.config.get('app.name')
  }
}
```



## 数据库（以prisma为例）

### mysql

安装 mysql，进入官网选择下载社区版（[MySQL Community Downloads](https://dev.mysql.com/downloads/)），再选择[MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

安装成功之后（以 macOS 为例）进入`~/.zshrc`

```bash
# mysql start
export PATH=$PATH:/usr/local/mysql/bin
# mysql end
```

然后刷新

#### 错误及解决

无法启动也是这个

`ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`

1. 第一步：找到mysql的安装目录，我的是：/usr/local/mysql，不用去mysql底下的bin目录
2. 第二步：执行 sudo ./support-files/mysql.server start

### prisma

```bash
pnpm add prisma-binding @prisma/client lodash
pnpm add -D prisma mockjs @types/mockjs @types/lodash
```



初始化，自动生成目录结构、配置文件

```bash
npx prisma init

# npx prisma 会有 help
```

修改自动生成的`.env`文件中`DATABASE_URL`的内容：

1. 将开头`postgresql`改成`mysql`，即使用`mysql`数据库
2. `johndoe:randompassword`前者为账号，后者为密码，根据你的数据库账号 密码修改
3. @后/前部分为地址一般为127.0.0.1:3306
4. /后？前为要连接的库
5. 最后的参数可以去掉

```bash
# 之前
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
# 修改后
DATABASE_URL="mysql://root:admin888@localhost:5432/nest-blog" # nest-blog为数据库名称
```

### vscode插件

prisma@Prisma



### 建表

将`datasource db`中的`provider`改为`mysql`

在`./prisma/schema.prisma`

```mysql

model user {
  id        BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  email     String   @db.Char(50)
  password  String
  avatar    String?
  github    String?
  douyin    String?
  weibo     String?
  wakatime  String?
  createdAt DateTime @default(now())
  updateAt  DateTime @updatedAt
}

model category {
  id       BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  title    String
  articles article[]
}

model article {
  id         BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  title      String
  content    String   @db.Text
  thumb      String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  categoryId BigInt   @db.UnsignedBigInt
  category   category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}

```

* `@id` - 主键
* `@default()` - 默认值
* `@default(autoincrement())` - 表示这个字段的默认值是自增的
* ` @db.UnsignedBigInt` - 表示这个字段在数据库中的数据类型是非负整数
* `@updatedAt` - prisma会自动维护这个字段
* 在`articles article[]`写完后，vscode 安装了`Prisma`会自动出现`categoryId和category`，如果没有自动出现，则运行命令`npx prisma format`

猜测`BifInt、String`都是 js 或者 TS 支持的数据类型，`@db.`这个是数据库中的类型，可以没有。





### 迁移文件

要先运行 mysql

```bash
npx prisma migrate dev
```



### 数据填充

```json
// package.json
{
  ...
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  ...
}
```



```ts
// ./prisma/helper.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function create(count = 1, callback: (prisma: PrismaClient) => void) {
  for (let i = 0; i < count; i++) {
    callback(prisma);
  }
}

```



```ts
// ./prisma/seets/user

import { PrismaClient } from '@prisma/client';
import { create } from '../helper';
import { Random } from 'mockjs';
export async function user() {
  create(30, async (prisma: PrismaClient) => {
    await prisma.user.create({
      data: {
        email: Random.email(),
        password: 'test',
        github: Random.url(),
        avatar: Random.image('300x300'),
      },
    });
  });
}


```



```ts
// ./prisma/seets/category

import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';

const prisma = new PrismaClient();

export async function category() {
  await prisma.category.create({
    data: {
      title: Random.ctitle(), // c表示中文
    },
  });
}

```



```ts
// ./prisma/seet.ts

import { PrismaClient } from '@prisma/client';
import { user } from './seeds/user';
import { category } from './seeds/category';

const prisma = new PrismaClient();

async function run() {
  user();
  category();
}

run();


```



```bash
npx prisma db seed
```

```bash
npx prisma migrate reset
# 会重新生成数据库并执行数据填充
```



## 配置管理

同项目下新建一个模块

ConfigModule

```bash
pnpm add @nestjs/config
```



```ts
// 可以新建配置文件，在src/app.module中引用


```





```ts
// /src/app.module

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import appConfig from './config/app.config'
import uploadConfig from './config/upload.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 定义为全局
      load: [appConfig, uploadConfig] // 还可以加载本地配置文件
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}


```



```ts
// /src/app.controller

import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService
  ) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello()
    /**
     * 需要先创建.env 文件，并加上 APP_NAME=xxx
     * 可以使用.env 也可以加载本地配置文件，更可以同时使用，方式相同
     */
    return this.config.get('APP_NAME') // env
    // 或
    return this.config.get('app.name') // 配置文件
    // 或
    return process.env.APP_NAME
  }
}

```

### 基于命名空间配置

直接使用配置文件或者.env，在获取时因为使用字符串，所以无法获得代码提示

直接使用提供的函数即命名空间方式

```ts
// src/config/databse.config.ts

import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  host: 'localhost',
  port: 3306
}))

```

引用方式一样，仅用法不同

```ts
// /src/app.controller

import { Controller, Get, Inject } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService, ConfigType } from '@nestjs/config'
import databaseConfig from './config/database.config'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
    @Inject(databaseConfig.KEY) private readonly database: ConfigType<typeof databaseConfig>
  ) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello()
    // return this.config.get('APP_NAME')
    return this.database.host
  }
}

```



## [管道 (nestjs.cn)](https://docs.nestjs.cn/10/pipes)与验证

对用户传上来的数据的转换和类型进行验证

### 管道定义方式

做好数据库创建的操作

```bash
# 创建管道
nest g pi name --no-spec
```

运行命令创建管道文件`src/hd/hd.pipe.ts`

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class HdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    throw new BadRequestException('参数错误')
    // 各种判断及处理
    return metadata.metatype === Number ? +value : value;
  }
}

```



```ts
// app.controller

import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { HdPipe } from './hd/hd.pipe'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  // @UsePipes(HdPipe) // 管道使用方式1
  getHello(@Param('id', HdPipe// 管道使用方式2) id: number): string {
    return this.prisma.article.findUnique({
      where: {
        id: id
      }
    })
  }
}

```

管道使用方式3

```ts
// app.module

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HdPipe } from './hd/hd.pipe'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: HdPipe
    }
  ]
})
export class AppModule {}

```

管道使用方式4：全局

缺点：管道中的依赖注入不能用

```ts
// main

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HdPipe } from './hd/hd.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new HdPipe())
  await app.listen(3000)
}
bootstrap()

```



> nest提供了几个管道[管道 (nestjs.cn)](https://docs.nestjs.cn/10/pipes?id=内置管道)

```ts
// 默认值
// app.controller

import { Controller, Get, ParseIntPipe, DefaultValuePipe } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Param('id', new DefaultValuePipe(1), ParseIntPipe) id: number): string {
    return this.prisma.article.findUnique({
      where: {
        id: id
      }
    })
  }
}

```

如果是自定义的 Pipe 文件，需要接收默认值（construct）



### 验证

#### 使用管道进行验证

```ts
// app.controller

import { Controller, Post, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { HdPipe } from './hd/hd.pipe'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('add')
  add(@Body(HdPipe) dto: Record<string, any>) {
    return dto
  }
}

```



#### 使用 DTO 进行验证

```ts
// src/dto/create.article.dto

import { IsNotEmpty } from 'class-validator'

export default class CreateArticleDto {
  @IsNotEmpty({
    message: '标题不能为空'
  })
  title: string
  content: string
}


```

> 要使用类对数据类型进行限定，因为 如果使用typescript，打包后转成 js 还是没有类型限定



```ts
// src/hd/hd.pipe

import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class HdPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value)
    const errors = await validate(object)
    if (errors.length) {
      const message = errors.map(error => ({
        name: error.property,
        message: Object.values(error.constraints).map(v => v)
      }))

      throw new HttpException(message, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}

```





```ts
// app.controller

import { Controller, Post, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { HdPipe } from './hd/hd.pipe'
import CreateArticleDto from './dto/create.article.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('add')
  add(@Body(HdPipe) dto: CreateArticleDto) {
    return dto
  }
}

```

在管道代码中输出`metadata.metatype`为`[class CreateArticleDto]`，但是接到的 value 并没有类型，所以需要按照这个类把数据实例化为对象



#### 使用系统验证管道

不需要自己写类似`HdPipe`，以全局写法为例

```ts
// main

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()

```

可以使用 `class extends ValidationPipe`来增加处理，例如：

```ts
import { ValidationError, ValidationPipe } from '@nestjs/common'

export class Validate extends ValidationPipe {
  protected mapChildrenToValidationErrors(error: ValidationError, parentPath?: string): ValidationError[] {
    const errors = super.mapChildrenToValidationErrors(error, parentPath)

    errors.map(error => {
      for (const key in error.constraints) {
        error.constraints[key] = `${error.property}-${error.constraints[key]}`
      }
    })

    return errors
  }
}

```



```ts
// main
// ...
 // main

app.useGlobalPipes(new Validate())

// ...
```

##### 使用过滤器管理验证异常

创建过滤器

```bash
nest g f validate-exception # validate-exception为名称
```

这个过滤器可以按照上述几个方式进行绑定，以 main 为例

```ts
// main
// ...
 // main

app.useGlobalPipes(new Validate())

// ...
```



```ts
// src/validate-exception/validate-exception.filter

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'

@Catch()
export class ValidateExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    if (exception instanceof BadRequestException) {
      const responseObject = exception.getResponse() as any
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: responseObject.message.map(error => {
          const info = error.split('-')

          return { field: info[0], message: info[1] }
        })
      })
    }

    return response
  }
}

```



#### 使用`class-validator`自定义验证规则（以密码为例）

[class-validator - npm (npmjs.com)](https://www.npmjs.com/package/class-validator)

##### 使用类的方式

```bash
# 先增加个模块
nest g mo auth --no-spec # src/auth/auth.module.ts

# 再创建个控制器
nest g co auth --no-spec # src/auth/auth.controller.ts
```

新模块会自动注册到根模块中



```ts
// src/rules/is-confirmed.rule
// 需要去class-validator文档中复制class 方式基础代码

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint()
export class isConfirmed implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    return false
  }

  defaultMessage(args?: ValidationArguments) {
    return '比对失败'
  }
}

```



```ts
// 新建 src/dto/register.dto.ts

import { IsNotEmpty, Validate } from 'class-validator'
import { isConfirmed } from 'src/rules/is-confirmed.rule'

export default class RegisterDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  @Validate(isConfirmed, { message: '确认密码输入错误' })
  password: string
}

```



```ts
// src/auth/auth.controller.ts

import { Body, Controller, Post } from '@nestjs/common'
import RegisterDto from 'src/dto/register.dto'

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return dto
  }
}

```

##### 使用装饰器的方式

```ts
// src/rule/is-not-exists.rule.ts 创建一个校验表中字段是否唯一的规则
// 需要去class-validator文档中复制装饰器方式基础代码

import { PrismaClient } from '@prisma/client'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

// table是自己加的，表示表，如果不需要传入参数，则直接传入选项即可
export function IsNotExistsRule(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotExistsRule',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const user = await prisma[table].findFirst({
            where: {
              [propertyName]: args.value
            }
          })

          return !Boolean(user)
        }
      }
    })
  }
}

```

```ts
// 新建 src/dto/register.dto.ts

import { IsNotEmpty, Validate } from 'class-validator'
import { isConfirmed } from 'src/rules/is-confirmed.rule'
import { IsNotExistsRule } from 'src/rules/is-not-exists.rule'

export default class RegisterDto {
  @IsNotEmpty()
+ @IsNotExistsRule('user', { message: '用户已经存在' })
  name: string
  @IsNotEmpty()
  @Validate(isConfirmed)
  password: string
}

```



## JWT

以[极简登录注册文件为基准](# 极简登录注册)



```
# .env

DATABASE_URL="mysql://root:Lsh.4730215@localhost:3306/nest-blog"

#token 密钥
TOKEN_SECRET="herschel"
```

```ts
// src/app.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
+   ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}

```



```ts
// /src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
+ import { JwtModule } from '@nestjs/jwt';
+ import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
+ imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('TOKEN_SECRET'),
          signOptions: {
            expiresIn: '100d', // 密钥过期时间100天
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

```

```ts
// src/auth/auth.service

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { hash, verify } from 'argon2';
import LoginDto from './dto/login.dto';
import { user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const password = await hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        password,
      },
    });

    delete user.password;

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (!(await verify(user.password, dto.password))) {
      throw new BadRequestException('密码错误');
    }

    return this.token(user);
  }

  async token(user: user) {
    return {
      token: await this.jwt.signAsync({
        name: user.name,
        sub: user.id,
      }),
    };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}

```

```ts
// src/auth/jwt.strategy.ts
// 需要注册providers

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // 解析用户提交的 Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 加密的secret
      secretOrKey: configService.get('TOKEN_SECRET'),
    });
  }

  // 验证通过后结果 用户资料
  async validate({ sub: id }) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}

```



```ts
// src/auth/auth.controller

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt')) // 与jwt.strategy文件中设置的名称一致
  all(@Req() req: Request) {
    return req.user;
  }
}

```

##### 使用装饰器简化操作`@UseGuards(AuthGuard('jwt'))`

nest提供了聚合装饰器的写法

```ts
// src/auth/decorator/auth.decorator

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard('jwt')));
}

```

```ts
// src/auth/auth.controller

import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
- // import { AuthGuard } from '@nestjs/passport';
+ import { Auth } from './decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('all')
  + @Auth()
  all(@Req() req: Request) {
    return req.user;
  }
}

```

## 文件上传

新建项目，命令生成 upload 的模块、服务和控制器

```ts
// src/upload/upload.module.ts

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          // 文件存储位置
          destination: './uploads',
          // 文件名定制
          filename: (req, file, callback) => {
            const path = `${Date.now()}-${Math.round(Math.random() * 1e10)}${extname(file.originalname)}`;

            callback(null, path);
          },
        }),
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

```

```ts
// 拦截器
// src/TransformInterceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    console.log('拦截器前');
    const request = context.switchToHttp().getRequest() as Request;
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const endTime = Date.now();
        new Logger().log(
          `TIME: ${endTime - startTime}\tURL:${request.path}\tMETHOD:${request.method}`,
        );

        return { data };
      }),
    );
  }
}

```

```ts
// src/upload/decorator/upload.decorator

import {
  applyDecorators,
  MethodNotAllowedException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function fileFilter(type: string) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.includes(type)) {
      callback(new MethodNotAllowedException('文件类型错误'), false); // true/fale表示上传允许/不允许
    } else {
      callback(null, true);
    }
  };
}

export function Upload(field = 'file', options: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)));
}

export function ImageUpload(field = 'file') {
  return Upload(field, {
    limits: {
      fileSize: Math.pow(1024, 2) * 3,
    },
    fileFilter: fileFilter('image'),
  });
}

export function DocumentUpload(field = 'file') {
  return Upload(field, {
    fileFilter: fileFilter('pdf'),
  });
}

```



```ts
// src/upload/upload.controller
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/TransformInterceptor';
import { DocumentUpload, ImageUpload } from './decorator/upload.decorator';

@Controller('upload')
@UseInterceptors(new TransformInterceptor()) // 拦截器
export class UploadController {
  @Post('image')
  @ImageUpload()
  image(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('document')
  @DocumentUpload()
  document(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}

```

### 通过 URL 访问文件

```ts
// src/main

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
+ import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
+ app.useStaticAssets('uploads', { prefix: '/uploads' });
  await app.listen(3000);
}
bootstrap();

```



## 例子

### 极简登录注册

```bash
# 初始化prisma
npx prisma init

#修改数据库地址DATABASE_URL="mysql://root:Lsh.4730215@localhost:3306/nest-blog"

# 增加表后
 npx prisma migrate dev   
```

可以删掉controller和service，并删除 module 文件中相关代码，则为干净的项目

```bash
# 创建auth 的模块、控制器和服务
nest g mo auth --no-spec
nest g co auth --no-spec
nest g s auth --no-spec 

# prisma 的模块和服务,设置为全局，这样到处可以直接使用 this.prisma，而不用再创建 prisma
```

> 如果使用argon2的verify报错`$argon2id$v=19$m=65536,t=3,p=4$PZKxiY8Cfo27I8HqqTi8Iw$2mtI1yzCUhRAPcVkgqyGz5vW/5/2Ah1Az5+/cm2wPWM`，name 一定是第一个参数有问题，第一个参数必须为hash 值

```
.
├── README.md
├── nest-cli.json
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── dto
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── main.ts
│   └── prisma
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```



##### `/prisma/schema.prisma`

```mysql
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model user {
  id       Int    @id @default(autoincrement()) @db.UnsignedInt
  name     String
  password String
}

```

##### `/src/prisma/prisma.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {}

```

##### `/src/prisma/prisma.module.ts`

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

```

##### `/src/auth/dto/register.dto.ts`

```ts
import { IsNotEmpty } from 'class-validator';

export default class RegisterDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}

```

##### `/src/auth/dto/login.dto.ts`

```ts
import { PartialType } from '@nestjs/mapped-types';
import RegisterDto from './register.dto';

export default class LoginDto extends PartialType(RegisterDto) {}

```

##### `/src/auth/auth.service.ts`

```ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { hash, verify } from 'argon2';
import LoginDto from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const password = await hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        password,
      },
    });

    delete user.password;

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (!(await verify(user.password, dto.password))) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }
}

```

##### `/src/auth/auth.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
})
export class AuthModule {}

```

##### `/src/auth/auth.controller.ts`

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}

```

##### `/src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
+ app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

```



### 博客

#### 开发

##### prisma

1. 初始化 prisma`npx prisma init`

2. 修改`.env`中的数据库链接`DATABASE_URL="mysql://root:Lsh.4730215@localhost:3306/nest-blog"

3. prisma 文件`src/prisma/schema.prisma`中修改`provider = "mysql"`

4. 表的代码完成后，执行`npx prisma migrate dev  `

5. 增加数据填充命令，需要事先在相应位置建好文件

   ```json
   // package.json
   
   {
     "scripts": {...},
     "prisma": {
       "seed": "ts-node prisma/seed.ts"
     },
   }
   ```

   ```ts
   // prisma/seed.ts
   
   import { PrismaClient } from '@prisma/client';
   import { hash } from 'argon2';
   import { Random } from 'mockjs';
   
   const prisma = new PrismaClient();
   
   async function run() {
     await prisma.user.create({
       data: {
         name: 'admin',
         password: await hash('admin888'),
       },
     });
   
     for (let i = 0; i < 50; i++) {
       await prisma.article.create({
         data: {
           title: Random.ctitle(10, 30),
           content: Random.cparagraph(30, 50),
         },
       });
     }
   }
   
   run();
   
   ```

   ```bash
   # 然后使用命令重新跑
   ❯ npx prisma migrate reset
   ```

##### app

###### `main`

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import Validate from './common/validate'
import { TransformInterceptor } from './transform.interceptor'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(new Validate())
  app.useGlobalInterceptors(new TransformInterceptor())
  // 前缀 所有接口需要有 api 前缀
  app.setGlobalPrefix('api')
  await app.listen(3000)
}
bootstrap()

```

###### `.env`

```
DATABASE_URL="mysql://root:Lsh.4730215@localhost:3306/nest-blog"

TOKEN_SECRET="nest"
```

###### 拦截器`transform.interceptor.ts

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => {
        return data?.meta ? data : { data }
      })
    )
  }
}

```

###### `app.moudle`

```ts
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { ArticleModule } from './article/article.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ArticleModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

```



##### prisma

###### `prisma/prisma.module.ts`

```ts
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}

```

###### `prisma/prisma.service.ts`

```ts
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query']
    })
  }
}

```



##### common

###### `src/common/validate.ts`

```ts
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'

export default class Validate extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    const messages = {}
    validationErrors.forEach(error => {
      messages[error.property] = Object.values(error.constraints)[0]
    })

    throw new HttpException(
      {
        code: 422,
        messages
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}

```

###### `src/common/rules/is-not-exists.rule.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

// table是自己加的，表示表，如果不需要传入参数，则直接传入选项即可
export function IsNotExistsRule(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotExistsRule',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const res = await prisma[table].findFirst({
            where: {
              [args.property]: value
            }
          })

          return !Boolean(res)
        }
      }
    })
  }
}

```

###### `rules/is-confirm.rule.ts`

```ts
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
export function IsConfirm(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsConfirm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          return Boolean(value === args.object[`${args.property}_confirm`])
        }
      }
    })
  }
}

```

###### `rules/is-exists.rule.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

// table是自己加的，表示表，如果不需要传入参数，则直接传入选项即可
export function IsExistsRule(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsExistsRule',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const res = await prisma[table].findFirst({
            where: {
              [args.property]: value
            }
          })

          return Boolean(res)
        }
      }
    })
  }
}

```



##### auth

###### `auth.module.ts`

```ts
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('TOKEN_SECRET'),
          signOptions: {
            expiresIn: '100d'
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

```

###### `auth.controller`

```ts
import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import LoginDto from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }
}

```

###### `auth.service`

```ts
import { BadRequestException, Injectable } from '@nestjs/common'
import RegisterDto from './dto/register.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash, verify } from 'argon2'
import { user } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import LoginDto from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  private async token({ name, id }: user) {
    return {
      token: await this.jwt.signAsync({ name, sub: id })
    }
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        password: await hash(dto.password)
      }
    })

    return this.token(user)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        name: dto.name
      }
    })

    if (!(await verify(user.password, dto.password))) {
      throw new BadRequestException('密码输入错误')
    }

    return this.token(user)
  }
}

```

###### `dto/login.dto.ts`

```ts
import { IsNotEmpty } from 'class-validator'
import { IsExistsRule } from 'src/common/rules/is-exists.rule'

export default class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsExistsRule('user', { message: '用户不存在' })
  name: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

```

###### `dto/register.dto.ts`

```ts
import { IsNotEmpty } from 'class-validator'
import { IsConfirm } from 'src/common/rules/is-confirm.rule'
import { IsNotExistsRule } from 'src/common/rules/is-not-exists.rule'

export default class RegisterDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsNotExistsRule('user', { message: '用户名已存在' })
  name: string

  @IsNotEmpty({ message: '密码不能为空' })
  @IsConfirm({ message: '两次密码不一致' })
  password: string

  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirm: string
}

```

##### article

###### `.env`

```.env
# 每页文章数
ARTICLE_PAGE_ROW=10
```



###### `dto/create-article.dto`

```ts
import { IsNotEmpty } from 'class-validator'

export class CreateArticleDto {
  @IsNotEmpty({ message: '标题不能为空' })
  title: string
  @IsNotEmpty({ message: '内容不能为空' })
  content: string
}

```

###### `article.controller`

都是自动生成好的

###### `article.service`

```ts
import { Injectable } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content
      }
    })
  }

  async findAll(page = 1) {
    const row = +this.config.get('ARTICLE_PAGE_ROW')
    const articles = await this.prisma.article.findMany({
      skip: (page - 1) * row,
      take: row
    })

    const total = await this.prisma.article.count()

    return {
      meta: {
        total,
        page,
        row,
        total_page: Math.ceil(total / row)
      },
      data: articles
    }
  }

  async findOne(id: number) {
    return await this.prisma.article.findFirst({
      where: {
        id
      }
    })
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: {
        id
      },
      data: updateArticleDto
    })
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: {
        id
      }
    })
  }
}

```





#### 上线

##### 编译

##### 创建站点并配置 ssl（使用宝塔）

网站->添加站点：FTP 随意、数据库 MySQL->点击此站点的设置，点击 ssl，点击《Let’s Encrypt》，点击全选，点击申请，关闭再打开，打开强制 https

##### 上传 vue 项目

1. 网站->点击连接-> 删除所有带.的文件 ->上传目录，选择dist vue 项目，成功后重命名

##### 上传 nest 项目

1. 上传除了`node_modules`的所有文件，即整个项目
2. 进入 nest文件中，点击终端，
   1. 修改.env 文件中的数据库链接：账户、密码、数据库名（创建站点成功后会有各种信息）
   2. `pnpm install`
   3. `npx prisma migrate reset`


##### 使用 pm2运行 nest 项目

1. 软件商店->pm2 
2. 打开 pm2管理器
3. 添加项目
   1. 启动文件：即 nest 项目 dist/src/main.js
   2. 运行目录：nest 项目根目录
   3. 改名字
   4. 提交
4. 网站，点击设置 -> 反向代理(必须先设置 ssl),目标 url 就是 localhost:3000（有前缀要加前缀）,发送url 就是网址，代理目录`/api/``(前缀)

##### 使用域名访问项目

1. 网站->设置
2. ->网站目录：网站目录选择 vue 项目，点击保存
3. ->伪静态->选择 laraval5：把 php 后缀改为 html，点击保存
