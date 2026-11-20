---
title: "monorepo"
---

## 0. 先说清楚：monorepo 不绑定 pnpm

monorepo 是仓库组织方式，不是包管理器。npm、pnpm、yarn、bun 都能做 monorepo。

本仓库当前使用 **npm workspaces**：

```bash
npm install
npm run dev:vp      # 等价于 npm --workspace apps/vitepress run dev --
npm run build:astro   # 等价于 npm --workspace apps/astro run build
```

本文第 2～11 节保留的是 **pnpm 通用教程**，所以会出现：

```bash
pnpm -F portal dev
```

- 这是 pnpm 的 filter 语法，`portal` 是示例包名；
- 本仓库没有名为 `portal` 的 pnpm 示例包；实际是 `apps/home` 静态门户（包名 `study-notes-home`）和文档 app `study-notes-vitepress`、`study-notes-astro`；
- 当前仓库不要执行 `pnpm -F portal dev`，用第 12 节的 npm 命令。

### 0.1 npm 配置

根 `package.json`：

```json
{
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev:vp": "npm --workspace apps/vitepress run dev --",
    "build:vp": "npm --workspace apps/vitepress run build",
    "dev:astro": "npm --workspace apps/astro run dev --",
    "build:astro": "npm --workspace apps/astro run build",
    "pages:build": "node scripts/pages.mjs build",
    "pages:serve": "node scripts/pages.mjs serve",
    "pages:preview": "node scripts/pages.mjs preview"
  }
}
```

```bash
npm install
npm ci                 # CI
npm run dev:vp
npm run build:vp
npm run build:astro
npm run pages:build
```

npm 会把公共依赖提升到根 `node_modules`，所以 VitePress 的外部 `srcDir` 可以解析到 Vue。

### 0.2 pnpm 配置（含 Vue 兼容方案）

`pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*

# 关键：VitePress 的 srcDir 在仓库根 content/，
# 需要从 content/ 向上找到 vue/server-renderer。
# pnpm 默认 isolated，Vue 不会出现在根 node_modules；
# 使用 hoisted 让根 node_modules 可解析 Vue。
nodeLinker: hoisted
```

```bash
pnpm install
pnpm --filter study-notes-vitepress dev
pnpm --filter study-notes-vitepress build
pnpm --filter study-notes-astro build
```

如果使用较老的 pnpm，也可在 `.npmrc` 写：

```ini
node-linker=hoisted
```

或临时：

```bash
pnpm install --node-linker=hoisted
```

**已验证**（pnpm 12.21.0）：使用 `nodeLinker: hoisted` 后，根 `node_modules/vue` 存在，`build:vp` 成功渲染 402 页。  
不要只依赖 `public-hoist-pattern`；不同 pnpm 版本行为不一致，`nodeLinker: hoisted` 更直接。

> 交换代价：hoisted 接近 npm 的扁平结构，牺牲 pnpm 的严格隔离，但能兼容 VitePress 的外部内容目录。

### 0.3 yarn 配置

Yarn Classic（1.x）直接使用根 `package.json` 的 `workspaces`：

```json
{
  "private": true,
  "workspaces": ["apps/*"]
}
```

```bash
yarn install
yarn workspace study-notes-vitepress dev
yarn workspace study-notes-vitepress build
yarn workspace study-notes-astro build
```

Yarn Berry（2+）需要把 linker 设为 `node-modules`，不要用 PnP：

```yaml
# .yarnrc.yml
nodeLinker: node-modules
```

```bash
yarn install
yarn workspace study-notes-vitepress dev
```

Yarn 的 `node-modules` linker 会提升依赖，VitePress 外部 `srcDir` 可以找到 Vue。

### 0.4 bun 配置

根 `package.json` 同样使用 `workspaces`：

```json
{
  "private": true,
  "workspaces": ["apps/*"]
}
```

```bash
bun install
bun --cwd apps/vitepress run dev
bun --cwd apps/vitepress run build
bun --cwd apps/astro run build
```

bun 默认生成接近 npm 的根 `node_modules`，VitePress 外部 `srcDir` 可以解析 Vue。

### 0.5 四种包管理器命令对照

| 动作 | npm | pnpm | yarn | bun |
| --- | --- | --- | --- | --- |
| 安装 | `npm install` | `pnpm install` | `yarn install` | `bun install` |
| 开发 VitePress | `npm run dev:vp` | `pnpm --filter study-notes-vitepress dev` | `yarn workspace study-notes-vitepress dev` | `bun --cwd apps/vitepress run dev` |
| 构建 VitePress | `npm run build:vp` | `pnpm --filter study-notes-vitepress build` | `yarn workspace study-notes-vitepress build` | `bun --cwd apps/vitepress run build` |
| 开发 Astro | `npm run dev:astro` | `pnpm --filter study-notes-astro dev` | `yarn workspace study-notes-astro dev` | `bun --cwd apps/astro run dev` |
| 构建 Astro | `npm run build:astro` | `pnpm --filter study-notes-astro build` | `yarn workspace study-notes-astro build` | `bun --cwd apps/astro run build` |

根 scripts 只是编排，不绑定包管理器；可以把 `dev:vp` 等命令改成对应包管理器的写法。

### 0.6 兼容性问题汇总

VitePress 的 `srcDir` 在仓库根 `content/`，Vite 需要从 Markdown 文件位置向上解析 `vue/server-renderer`：

| 包管理器 | 默认是否提升 Vue | 处理 |
| --- | --- | --- |
| npm | 是 | 直接可用 |
| pnpm | 否（isolated） | `nodeLinker: hoisted` |
| yarn classic | 是 | 直接可用 |
| yarn berry | PnP 不可用 | `nodeLinker: node-modules` |
| bun | 是 | 直接可用 |

如果不想使用 hoisted，也可以把 `content/` 做成 workspace 包或软链接；但当前项目的标准方案是“根 `content/` + 根 `node_modules` 可解析 Vue”。


---

## 目录

- [什么是monorepo](#什么是monorepo)
- [现有工程改造成 Monorepo 的步骤](#现有工程改造成-monorepo-的步骤)
  - [2.1 创建子包](#21-创建子包)
  - [2.2 现有项目文件放进子包里](#22-现有项目文件放进子包里)
  - [2.3 配置 pnpm-workspace.yaml](#23-配置-pnpm-workspaceyaml)
  - [2.4 配置 package.json](#24-配置-packagejson)
  - [2.5 改造前后目录结构对比](#25-改造前后目录结构对比)
  - [2.6 验证本地启动和构建命令](#26-验证本地启动和构建命令)
  - [2.7 增加便捷命令](#27-增加便捷命令)
  - [3 增加一个新项目 admin](#3-增加一个新项目-admin)
- [从0创建](#从0创建)
  - [快速开始](#快速开始)
  - [工具子包](#工具子包)
  - [全局依赖](#全局依赖)
  - [启动与开发](#启动与开发)
- [命令](#命令)
- [使用Lerna](#使用lerna)
- [二者组合](#二者组合)
  - [使用 Lerna 命令的核心场景](#使用-lerna-命令的核心场景)
  - [使用 pnpm 命令的核心场景](#使用-pnpm-命令的核心场景)
- [注意](#注意)
  - [子package之间的引用要引用其打包后的产物](#子package之间的引用要引用其打包后的产物)

> **阅读提示**：下面第 2～11 节是 pnpm 通用教程，里面的 `portal`、`admin` 是虚构示例包名，**不是本仓库的 `apps/home`**。当前项目实现看第 12 节；本仓库使用 npm workspaces，四种包管理器配置见 0.1～0.6。

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
5. 执行 pnpm i 安装依赖，执行 pnpm -F portal dev 本地启动（这是 pnpm 示例；本仓库对应 `npm run dev:vp`）
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

![](https://segmentfault.com/img/bVddS9R)

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

## 从0创建

### 快速开始

创建`package.json`

```bash
pnpm init
```

加入 `"private": true`,package.json的name改为`%NAMESPACE%`，子包的package.json的name为`%NAMESPACE%/name`

创建工作区`pnpm-workspace.yaml`[pnpm 说明](https://pnpm.io/zh/pnpm-workspace_yaml)

```yaml
packages:
  # 指定根目录直接子目录中的包
  - 'my-app'
  # packages/ 直接子目录中的所有包 - 所有前端项目存储的目录
  - 'packages/*'
  # components/ 子目录中的所有包 - 给所有项目使用的公共组件
  - 'components/**'
  # utils/ 子目录中的所有包 - 给所有项目使用的公共工具库
  - 'utils/**'
  # 排除测试目录中的包
  - '!**/test/**'
```

上面这段配置的意思就是通过 glob 语法将`packages`下的所有文件夹都当做一个package，添加到 monorepo 中进行管理。

根目录下创建 **.npmrc**，用于确保后续下载依赖时，优先从本地查找，而非远程npm。

```bash
# 解决pnpm add时优先在本地查找依赖
link-workspace-packages=true
```

### 工具子包

在 **utils目录** 下，执行`pnpm init`，此时出现 **package.json**，修改name为 **@xxx/utils** 格式，并加入 `"private": true`

**utils目录**下创建 **index.js**，**`注意：`** 文件名要与 package.json 中的 main 字段一致，默认为 index.js

ndex.js 中整合所有方法并导出

### 全局依赖

类似于`TypeScript`或`lodash`这样通用的依赖，我们通常可以把他们安装到根目录，：

```bash
pnpm install typescript -D -w
```

* `-D`把依赖作为`devDependencies`安装
* `-w`把依赖安装到根目录的`node_modules`当中

```lua
├── node_modules
│   ├── @types
│   └── typescript -> .pnpm/typescript@4.4.4/node_modules/typescript
├── package.json
├── packages
│   ├── server
│   ├── tools
│   └── web
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

### 启动与开发

一个 monorepo 往往是一个整体的项目，所以我们需要同时执行多个指令，在 pnpm 中，可以通过`-C`进行配置：

```json
"scripts": {
    "start": "pnpm -C ./packages/server start:server & pnpm -C ./packages/web dev",
  }
```

这条命令的含义就是同时运行服务端和前端代码。

而`start:server`和`dev`都是我们在子项目的`scripts`中自己配置的。

如果经过了 git 合码后，项目的依赖变化比较大，可以配置一条 clean 指令：

```json
  "scripts": {
    "clean": "rm -rf node_modules **/*/node_modules",
  }
```

这样根目录和子应用下的`node_modules`都会被删除。再次执行`pnpm install`也会同时为根目录和所有 package 安装需要的依赖。

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

实际上pnpm天然具备 monorepo 能力，支持全局依赖管理，所有子包之间共享依赖

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

## 注意

### 子package之间的引用要引用其打包后的产物

---

## 12. 本项目：npm workspace + VitePress/Astro 双栈

这一节是当前 `studyNotes` 的实现，也是「共享内容 + 多文档站」的最佳实践。

### 12.1 结构

```text
studyNotes/
├── content/                    # 唯一内容根，42M
│   ├── 代码/                   # 共享
│   ├── 指南/                   # 共享
│   ├── public/brand-logo.svg         # VitePress 公共资源
│   ├── vitepress/              # 仅 VitePress
│   └── astro/                  # 仅 Astro
├── apps/
│   ├── home/                   # 根站点选择页（静态）
│   ├── vitepress/              # 直接读 ../../content
│   └── astro/                  # 直接读 ../../content
├── package.json                # workspaces
└── package-lock.json           # 单一锁文件
```

没有 `apps/*/content` 副本，没有同步脚本。

### 12.2 为什么能只用一份 content

VitePress 的 `srcDir` 直接指向仓库根 `content/`：

```ts
srcDir: fileURLToPath(new URL('../../../content', import.meta.url))
```

Astro 用 `glob` 直接读取：

```ts
glob({
  base: fileURLToPath(new URL('../../../content', import.meta.url)),
  pattern: ['**/*.md', '!vitepress/**'],
})
```

根 `package.json` 声明：

```json
{
  "workspaces": ["apps/*"]
}
```

`npm install` 把 Vue 等公共依赖提升到根 `node_modules`，VitePress 从 app 外部内容目录也能解析 `vue/server-renderer`。这是之前同步副本的唯一原因，workspace 后不再需要。

### 12.3 三份内容各自归谁

| 目录 | 谁渲染 | 放什么 |
| --- | --- | --- |
| `content/` 根 | 两个站点 | 共享笔记 |
| `content/vitepress/` | 仅 VitePress | Vue 组件、DemoBlock |
| `content/astro/` | 仅 Astro | Astro 岛屿、Starlight 页面 |

过滤规则：

```ts
// VitePress
srcExclude: ['astro/**']
```

```ts
// Astro
pattern: ['**/*.md', '!vitepress/**']
```

### 12.4 以后新增一个框架怎么做

假设新增 `apps/docusaurus`：

1. 在 `apps/docusaurus` 建独立 app，自己的 `package.json`；
2. 根 `workspaces` 已匹配 `apps/*`，`npm install` 自动纳入；
3. 共享内容仍读根 `content/`；框架专属内容放 `content/docusaurus/`；
4. 该框架需要排除其他专属目录：例如 VitePress 加 `srcExclude: ['astro/**','docusaurus/**']`，新框架也排除 `vitepress/**`、`astro/**`；
5. 根 `package.json` 增加 `docusaurus:dev/build/preview`；
6. `apps/home/index.html` 增加链接；
7. GitHub Pages 增加子路径，例如 `/docusaurus/`；
8. 如果有独立构建产物，在合并 artifact 时复制到对应子目录；
9. 补充该框架的独立搭建文档。

新增框架不需要改 `content/` 的共享内容，也不需要同步脚本。

### 12.5 GitHub Pages 选择哪个框架

一个仓库只能有一个 Pages 站点，但可以放多个子站：

```text
https://<user>.github.io/<repo>/              # 纯静态 portal
https://<user>.github.io/<repo>/vitepress/    # VitePress
https://<user>.github.io/<repo>/astro/        # Astro
```

当前做法：

- 根 `/` 是 `apps/home/index.html`，不是任何框架；
- VitePress 在 `/vitepress/`，文档路径变成 `/vitepress/代码/...`、`/vitepress/指南/...`；
- Astro 在 `/astro/`；
- `npm run pages:build` 构建两个站点，并把 home、VitePress、Astro 组装到 `.pages`；
- 以后新增框架时，只需在 `apps/home/index.html` 加链接、在 `.pages/<framework>/` 放产物。

本地开发时分别运行 `npm run dev:vp`（5173）和 `npm run dev:astro`（4321）；根 home 只在合并产物/部署后生效。

### 12.6 VSCode 不再报错：两套 Vite 的类型冲突

monorepo 里 Astro 7 依赖 Vite 8，VitePress 1.6 依赖 Vite 5。npm 会把两套装在不同层级，TypeScript 于是认为它们不是同一个类型：

```text
Cannot assign 'Plugin' to type 'PluginOption'
  Type 'import("node_modules/vite").Plugin' is not assignable to
       'import("node_modules/vitepress/node_modules/vite").Plugin'
```

解决办法是让 VitePress 应用内能解析到与 vitepress 一致的 Vite：

```bash
npm install -w apps/vitepress -D "vite@^5.4.14"
```

`content-watch.ts` 里 `import type { Plugin } from 'vite'` 就会命中 Vite 5 的类型，`plugins: [docsWatch()]` 不再报错。

类型检查命令：

```bash
npx tsc -p apps/vitepress/.vitepress
npx tsc -p apps/astro
```

### 12.7 相关文档

- [.pages 构建机制与排查](<./pages构建机制与排查.md>)
- [根脚本清理验证报告](<./根脚本清理验证报告.md>)
- [VitePress 文档站搭建与部署](</代码/前端/工程化/vitepress/文档站搭建与部署指南.md>)
- [Astro 文档站搭建与部署](</代码/前端/工程化/astro/Astro文档站搭建与部署.md>)
- [GitHub Pages 静态站点部署指南](</代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)
