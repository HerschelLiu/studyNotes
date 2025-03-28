## 什么是monorepo

**核心概念**：将多个相关项目存放在同一个代码仓库中的代码管理策略
**优势**：

* 代码共享更便捷（组件/工具函数复用）
* 依赖管理更统一（避免版本碎片化）
* 跨项目修改更安全（原子提交）
* CI/CD 流程更高效（统一构建部署）

---



以下引用自[Monorepo：让你的项目脱胎换骨，既能代码复用，又能独立部署！](https://segmentfault.com/a/1190000045216948)

## 现有工程改造成 Monorepo 的步骤

基础目录结构

```
├── package.json
├── pnpm-workspace.yaml  # 工作区配置文件
├── packages/    # 子包目录
│   ├── core/    # 核心工具库(子包)
│   ├── web-app/ # 前端应用(子包)
|   └── ...
└── apps/        # 应用层目录（可选）
```



假如我们已经有了一个 Vite + Vue3 工程，可以通过 npm run dev 本地启动，npm run build 进行构建。

**基本步骤：**

1. 增加 packages 目录用于存放子包，增加 portal 子包
2. 把现有工程的 src / public / package.json / vite.config.ts / tsconfig.xx.json / index.html / README.md 等项目启动和构建相关的目录和文件全部剪切到 packages/portal 目录中
3. 增加 pnpm-workspace.yaml 文件配置多包路径
4. 根目录增加 package.json 文件
5. 执行 pnpm i 安装依赖，执行 pnpm -F portal dev 本地启动
6. 将本地启动命令放到根目录的 packages.json scripts中，方便启动

### 2.1 创建子包

第一步就是在根目录创建 packages 目录，增加项目子包，比如项目叫：portal

```
root
├── packages
|  └── portal
|     ├── ... // 项目文件和目录
```

### 2.2 现有项目文件放进子包里

把现有工程的 src 、 public 、 package.json 、 vite.config.ts 、 tsconfig.xx.json 、 index.html 、README.md 等项目启动和构建相关的目录和文件全部剪切到 packages/portal 目录中（即整个项目变成一个分包）

```
root
├── packages
|  └── portal
|     ├── index.html
|     ├── package-lock.json
|     ├── package.json
|     ├── public
|     ├── README.md
|     ├── src
|     ├── tsconfig.app.json
|     ├── tsconfig.json
|     ├── tsconfig.node.json
|     └── vite.config.ts
```

### 2.3 配置 pnpm-workspace.yaml

根目录创建 `pnpm-workspace.yaml` 文件。

```yaml
packages:
  - packages/**
```

### 2.4 配置 package.json

项目原来的 package.json 属于子包，需要放到 portal 子包中。

项目根目录需要创建一个新的 package.json 文件。

```json
{
  "name": "root",
  "private": true
}
```

### 2.5 改造前后目录结构对比

![]( https://segmentfault.com/img/bVddS9R )

### 2.6 验证本地启动和构建命令

执行 `pnpm i `安装依赖

执行 `pnpm -F portal dev` 本地启动

执行 `pnpm -F portal build` 项目构建

如果以上命令都正常，说明本次 Monorepo 改造成功！

> -F即–filter，指定过滤
>
> -r 或 --recursive 对所有子包递归执行命令，例如 pnpm -r build 会构建所有子包。

### 2.7 增加便捷命令

将本地启动命令放到根目录的 packages.json scripts 中，方便启动。

```diff
{
  "name": "root",
  "private": true,
+  "scripts": {
+    "dev": "pnpm -F portal dev",
+    "build": "pnpm -F portal build",
+    "preview": "pnpm -F portal preview"
+  }
}
```

后续启动项目：pnpm dev

构建项目：pnpm build

### 3 增加一个新项目 admin

在 packages 目录下执行 npm create vite admin，选择 React 框架。

执行 pnpm i 安装依赖

执行 pnpm -F admin dev 本地启动 admin 新项目

执行 pnpm -F admin build 构建 admin 新项目

两个项目同时启动了。

实现了 portal / admin 两个项目`分开启动`、`分开构建`、`分开管理依赖`、`分开测试`，互不影响，而且 portal 是 Vue 技术栈，admin 是 React 技术栈。

可以在根目录的 package.json scripts 增加对应的便捷命令。

```diff
{
  "name": "root",
  "private": true,
  "scripts": {
    "dev": "pnpm -F portal dev",
    "build": "pnpm -F portal build",
    "preview": "pnpm -F portal preview",
+    "dev:admin": "pnpm -F portal dev",
+    "build:admin": "pnpm -F portal build",
+    "preview:admin": "pnpm -F portal preview"
  }
}
```

改造后的 Monorepo 项目目录结构，看起来和原来差异不大，就是包了一层 packages，其实整个项目已经脱胎换骨，变成了一个更加让人“省心”的项目，项目之间的代码复用更加方便，后续维护和扩展也是非常轻松。

```lua
root
├── package.json
├── packages
|  ├── admin
|  |  ├── eslint.config.js
|  |  ├── index.html
|  |  ├── package.json
|  |  ├── public
|  |  ├── README.md
|  |  ├── src
|  |  ├── tsconfig.app.json
|  |  ├── tsconfig.json
|  |  ├── tsconfig.node.json
|  |  └── vite.config.ts
|  └── portal
|     ├── index.html
|     ├── package-lock.json
|     ├── package.json
|     ├── public
|     ├── README.md
|     ├── src
|     ├── tsconfig.app.json
|     ├── tsconfig.json
|     ├── tsconfig.node.json
|     └── vite.config.ts
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

如果有些逻辑 portal / admin 都用到了，我们可以新加一个子包：common

然后在 portal / admin 中引入 common。

```bash
pnpm -F portal i common
pnpm -F admin i common
```

## 命令

```bash
--filter 参数：精准控制操作目标子包
workspace:*：表示使用本地工作区最新版本
-w：强制安装在根目录（公共开发依赖）
-r：递归执行所有子包中的命令

# 安装公共依赖（所有子包共享）
# 在根目录操作
pnpm add typescript -D -w  # -w 表示安装在根目录（公共依赖）

# 安装子包专属依赖
# 为 portal 安装专属依赖
pnpm add vite react react-dom --filter @demo/web-app(package.json中的name)

# 为 admin 安装专属依赖
pnpm add lodash @types/lodash --filter @demo/core

# 子包之间相互引用
# 让 portal 使用 admin 包
pnpm add admin --filter portal --workspace
```

## 使用[Lerna](https://www.lernajs.cn/)

```bash
# 初始化 lerna 项目
lerna init 

# 创建一个新的由 lerna 管理的包。
lerna create <name>

# 安装所有·依赖项并连接所有的交叉依赖
# lerna bootstrop --hoist 会将 packages 目录下的公共模块包抽离到最顶层,但是这种方式会有一个问题，不同版本号只会保留使用最多的版本，这种配置不太好，当项目中有些功能需要依赖老版本时，就会出现问题。 yarn workspaces ，可以解决前面说的当不同的项目依赖不同的版本号问题， yarn workspaces会检查每个子项目里面依赖及其版本，如果版本不一致都会保留到自己的 node_modules 中，只有依赖版本号一致的时候才会提升到顶层。注意：这种需要在 lerna.json 中增加配置:
# "npmClient": "yarn",  // 指定 npmClent 为 yarn
# "useWorkspaces": true // 将 useWorkspaces 设置为 true
# 并且在顶层的 package.json 中增加配置

# // 顶层的 package.json
# {
#     "workspaces":[
#         "packages/*"
#     ]
# }
# 增加了这个配置后 不再需要 lerna bootstrap 来安装依赖了，可以直接使用 yarn install 进行依赖的安装。注意：yarn install 无论在顶层运行还是在任意一个子项目运行效果都是可以。
lerna bootstrap

# 增加模块包到最外层的公共 node_modules中
lerna add axios

# 增加模块包到 packages 中指定项目 下面是将 ui-web 模块增加到 example-web 项目中
# --dev devDependencies 替代 dependencies
# --exact 安装准确版本，就是安装的包版本前面不带^, Eg: "^2.20.0" ➜ "2.20.0"
lerna add ui-web --scope=example-web
# 或
lerna add ui-web packages/module-1

# 在 packages 中对应包下的执行任意命令 下面的命令，是对 packages 下的 example-web 项目执行 yarn start 命令 ，比较常用，可以把它配置到最外层的 package.json 中,并且在顶层 lerna.json 中增加配置"npmClient": "true"
lerna exec --scope example-web -- yarn start

# 显示所有的安装的包
lerna list // 等同于 lerna ls

# 通过json的方式查看 lerna 安装了哪些包,json 中还包括包的路径
lerna list --json

# 从所有包中删除 node_modules 目录,不会删除项目最外层的根 node_modules
lerna clean

# 在当前项目中发布包
lerna publish

# 项目包建立软链，类似 npm link。
lerna link

# 导入本地已经存在的包。
lerna import [npm 包所在路径]

# 更新版本。
lerna version

# 列出自上次更改后已更改的本地包。
lerna changed

# 区分自上次发布以来的所有包或单个包
lerna diff

# 打印有关本地环境的调试信息。
lerna info

# 在包含该脚本的每个包中运行 npm 脚本。
 lerna run
# 在包含该脚本的指定包中运行 npm 脚本。
lerna run dev --scope=packageA
```

```json
// lerna.json

"version": "independent",// 不同模块不同版本

如果想要发布的模块统一，使用相同的版本号，需要修改lerna.json ,将 "version": "independent", 改为固定版本号,修改后尝试重新使用 lerna publish进行发布，
```

## 二者组合

### 使用 Lerna 命令的核心场景

#### 1. 版本管理与发布自动化

场景 ：需要统一或独立管理子包版本号，自动生成 CHANGELOG 和发布到 npm 仓库。 

命令示例 ： 

```bash
lerna version --conventional-commits  # 基于提交记录生成版本号
lerna publish from-package           # 发布所有变更的子包
```

优势 ：Lerna 支持拓扑排序和语义化版本控制，适合多包联动发布（如 Babel 的组件生态）

#### 2. 批量执行跨包任务

场景 ：同时构建、测试或执行多个子包的任务。

```bash
lerna run build --parallel   # 并行执行所有子包的 build 脚本
lerna run test --stream      # 按依赖顺序执行测试并实时输出日志
```

优势 ： --parallel 和 --stream 参数优化多任务执行效率，适合 CI/CD 流水线

#### 3. 依赖提升与符号链接管理

场景 ：解决跨包依赖的符号链接问题（尤其是旧项目迁移时）。

```bash
lerna bootstrap --hoist      # 将公共依赖提升至根目录 node_modules
lerna clean                  # 清理所有子包的 node_modules
```

### 使用 pnpm 命令的核心场景

#### 1. 依赖安装与存储优化

场景 ：安装子包依赖、管理全局共享依赖（如 TypeScript、ESLint）。

```bash
pnpm add -wD typescript       # 根目录安装开发依赖
pnpm install --filter @project/app  # 仅安装指定子包依赖
```

优势 ：pnpm 的硬链接机制节省 40%+ 磁盘空间，避免重复安装相同依赖

#### 2. 精准过滤子包操作

场景 ：仅针对特定子包执行安装、启动或构建。

```bash
pnpm --filter @project/app dev     # 仅启动 app 子包的开发服务
pnpm update lodash --filter @project/utils  # 更新子包依赖
```

优势 ： --filter 参数支持正则表达式和通配符，操作粒度更细

#### 3. 解决幽灵依赖与隔离性

场景 ：严格限制子包只能访问声明过的依赖。

```bash
# .npmrc 中启用严格模式
strict-peer-dependencies = true
```

优势 ：pnpm 的 node_modules 结构扁平但隔离性强，避免非法依赖访问

> 实际来说这俩没什么必要组合，用pnpm的话不用lerna