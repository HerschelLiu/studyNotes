---
title: ".pages 构建机制与排查"
---

> 本文专项说明根目录 `.pages/` 的作用、唯一生成路径、`pages:build` 的设计原因、验证方法与常见问题。
>
> 适用：当前 `studyNotes` monorepo。

## 1. `.pages/` 是什么

`.pages/` 不是源码，也不是任何框架的默认输出，而是**准备上传到 GitHub Pages 的最终静态站点目录**。

部署后的目录与 URL 对应关系：

```text
.pages/
├── index.html          -> https://<user>.github.io/studyNotes/
├── 404.html            -> 旧 /studyNotes/xxx 兼容到 /vitepress/xxx
├── .nojekyll           -> 关闭 GitHub Pages 的 Jekyll 处理
├── vitepress/          -> https://<user>.github.io/studyNotes/vitepress/
│   ├── index.html
│   ├── assets/
│   └── ...
└── astro/              -> https://<user>.github.io/studyNotes/astro/
    ├── index.html
    ├── _astro/
    └── ...
```

核心特征：

- 根 `/` 是纯静态 `apps/home/index.html`，不是 VitePress，也不是 Astro；
- VitePress 在 `/vitepress/` 下；
- Astro 在 `/astro/` 下；
- GitHub Pages 只上传一个 artifact：`.pages/`；
- `.pages/` 在 `.gitignore` 中，不提交。

**Pages 怎么知道要用 `.pages/`？** 它不读 `package.json`，也不认识 VitePress / Astro，只看 workflow 里这一段：

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: .pages
```

`path` 指向哪个目录，Pages 就把哪个目录当作站点根。仓库 Settings → Pages 里只需要把 Source 设为 **GitHub Actions**，不需要填写任何目录。

同理，主页也不是“配置”出来的，而是文件位置决定的：

```text
artifact 根/index.html          -> /studyNotes/           （apps/home/index.html）
artifact 根/vitepress/index.html -> /studyNotes/vitepress/ （VitePress 首页）
artifact 根/astro/index.html     -> /studyNotes/astro/     （Astro 首页）
```

## 2. 唯一生成来源

### 2.1 唯一命令

`.pages/` **只由根目录的 `pages:build` 生成**：

```bash
npm run pages:build
```

根 `package.json` 中的定义：

```json
{
  "scripts": {
    "pages:build": "node scripts/pages.mjs build",
    "pages:serve": "node scripts/pages.mjs serve",
    "pages:preview": "node scripts/pages.mjs preview"
  }
}
```

脚本拆成两份：

| 文件 | 职责 |
| --- | --- |
| `scripts/pages.config.mjs` | 唯一配置源：`PAGES_BASE`、两个子站 base、dist 路径、端口 |
| `scripts/pages.mjs` | `build`（构建 + 组装 + 校验）、`serve`（本地模拟 Pages）、`preview`（两者串联） |

### 2.2 排查结论

已检查：

- `apps/vitepress`：构建只写 `apps/vitepress/.vitepress/dist`，不会写 `.pages/`；
- `apps/astro`：构建只写 `apps/astro/dist`，不会写 `.pages/`；
- `apps/home`：只有静态 `index.html`，没有构建脚本；
- `.github/workflows/deploy.yml`：执行一次 `npm run pages:build`（内部完成两个 app 的构建），最后上传 `.pages/`；
- 没有其他脚本、插件、hook 或 CI 步骤向 `.pages/` 写入。

因此可以确认：

```text
.pages/ 的唯一写入入口 = npm run pages:build
```

直接修 `.pages/` 是无效的，因为下一次构建会先清空 `.pages/`。

### 2.3 触发条件

| 场景 | 是否生成 `.pages/` |
| --- | --- |
| `npm run dev:vp` | 否 |
| `npm run build:vp` | 否，只生成 VitePress dist |
| `npm run dev:astro` | 否 |
| `npm run build:astro` | 否，只生成 Astro dist |
| `npm run pages:build` | 是，构建两个 app 并组装（唯一入口） |
| GitHub Actions | 是，调用 `pages:build` |
| 推送代码但 workflow 未运行 | 否 |

## 3. `pages:build` 完整执行流程

### 3.1 前置条件

`pages:build` 自己会执行两个构建并注入 base，不需要提前手动构建。唯一的前提是依赖已安装：

```bash
npm install
```

需要模拟其他部署路径时传 `PAGES_BASE`（默认 `/studyNotes/`）：

```bash
PAGES_BASE=/demo/ npm run pages:build
```

### 3.2 脚本内部步骤

`scripts/pages.mjs build` 依次执行：

```text
1. fs.rm('.pages')                          清空旧产物
2. npm run build:vp   (DOCS_BASE=.../vitepress/)   构建 VitePress
3. npm run build:astro (ASTRO_BASE=.../astro/)    构建 Astro
4. fs.cp(dist → .pages/vitepress | .pages/astro) 复制产物（含点文件）
5. copy apps/home/index.html → .pages/index.html
   copy apps/home/404.html   → .pages/404.html
6. write .pages/.nojekyll                   关闭 Jekyll
7. 校验 4 个 index.html 存在，缺失则非 0 退出
```

两个构建默认串行；加 `--parallel` 可并行：

```bash
npm run pages:build -- --parallel
```

### 3.3 产物示例

```text
$ find .pages -maxdepth 2 -name index.html
.pages/index.html
.pages/vitepress/index.html
.pages/astro/index.html
```

当前规模：

```text
.pages 约 185M
VitePress 404 个 HTML
Astro 404 个 HTML
```

### 3.4 关键依赖

- `apps/home/index.html` 必须存在；
- `apps/home/404.html` 必须存在，用于旧 VitePress 链接重定向；
- `apps/vitepress/.vitepress/dist/index.html` 必须存在；
- `apps/astro/dist/index.html` 必须存在；
- `apps/home/index.html` 里的链接必须是相对路径 `vitepress/`、`astro/`；
- VitePress / Astro 的 base 由 `scripts/pages.config.mjs` 根据 `PAGES_BASE` 计算并注入，不再手写；
- 三个 `index.html` 缺失时脚本直接失败，避免部署后才发现 404。

## 4. 为什么 `pages:build` 看起来复杂

复杂度不来自业务代码，而来自“一个 Pages 站点承载三个入口”：

1. **三个产物**：home、VitePress、Astro 由不同构建器生成；
2. **三个路径**：根、`/vitepress/`、`/astro/`；
3. **两个 base**：VitePress 和 Astro 的 base 不同；
4. **一个 artifact**：Pages 只能上传一个根目录；
5. **原子性**：每次必须清空 `.pages`，否则旧文件会残留；
6. **旧链接兼容**：根 `404.html` 把旧 `/代码/...` 重定向到 `/vitepress/代码/...`；
7. **Jekyll**：需要 `.nojekyll`，否则 `_astro` 等目录可能被忽略；
8. **零框架耦合**：home 是纯 HTML，不引入第三个框架。

早期版本用一条 shell 链（`rm/mkdir/cp/touch`）实现，在 Windows 下不可用，且复制完不做校验。现在改为 Node 脚本：

- `fs.rm` / `fs.cp` 跨平台，且 `fs.cp` 默认包含点文件；
- base 只在 `pages.config.mjs` 维护一处；
- 构建失败或产物缺失会立即非 0 退出；
- 不需要新增依赖，CI 与本地行为一致。

## 5. 使用示例

### 5.1 本地完整构建

```bash
npm ci
npm run pages:build

find .pages -maxdepth 2 -name index.html
```

需要换部署路径时只传一个变量：

```bash
PAGES_BASE=/demo/ npm run pages:build
```

### 5.2 CI

```yaml
- run: npm ci
- run: npm run pages:build
  env:
    PAGES_BASE: /studyNotes/
- uses: actions/upload-pages-artifact@v3
  with:
    path: .pages
```

### 5.3 本地检查产物

```bash
# 三个入口是否都有 index.html
test -f .pages/index.html
test -f .pages/vitepress/index.html
test -f .pages/astro/index.html

# 关键资源是否存在
test -d .pages/vitepress/assets
test -d .pages/astro/_astro
```

### 5.4 本地预览：为什么需要 `pages.mjs serve`

两个站点构建时已经写死了子路径：

- VitePress：`DOCS_BASE=/studyNotes/vitepress/`
- Astro：`ASTRO_BASE=/studyNotes/astro/`

因此本地不能直接：

```bash
npx serve .pages     # 打开 / 时是门户，但站内资源请求 /studyNotes/... 会 404
npm run preview:vp   # 只认识 VitePress，挂在 /，没有门户和 Astro
npm run preview:astro
```

`scripts/pages.mjs serve` 做的事情，就是在本机模拟 GitHub Pages：

1. 固定以 `.pages/` 为站点根；
2. 把所有请求挂在 `/studyNotes/` 前缀下，与构建时的 base 对齐；
3. `/`、`/vitepress/`、`/astro/` 自动补 `index.html`；
4. 找不到文件时返回 `.pages/404.html`，和 Pages 一致；
5. 打印三个入口地址。

```bash
npm run pages:preview   # 构建两站 + 组装 + 启动，默认 4173
npm run pages:serve     # 只托管已有的 .pages，不重新构建
```

可调参数：

```bash
PAGES_PORT=4174 npm run pages:serve
PAGES_BASE=/demo/ npm run pages:serve   # 仅当构建时也用了同一个 base
```

前缀、端口、dist 路径都由 `scripts/pages.config.mjs` 统一读取，构建与预览不会各写一份。

> 它只是静态预览，没有热更新；写文档用 `dev:vp` / `dev:astro`，验证子路径、跨站跳转和 404 时用 `pages:preview`。

## 6. 常见问题排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `.pages` 不存在 | 没运行 `pages:build` | 运行 `npm run pages:build`（会同时构建两个 app） |
| `.pages/vitepress` 不存在 | VitePress 构建失败或没执行 | 检查 `build:vp` 日志与 dist |
| `.pages/astro` 不存在 | Astro 构建失败或没执行 | 检查 `build:astro` 日志与 dist |
| 根 `/` 是 VitePress | home 未拷贝或文件名不对 | 确认 `apps/home/index.html` 覆盖 `.pages/index.html` |
| `/vitepress/` 白屏、资源 404 | `DOCS_BASE` 不是 `/studyNotes/vitepress/` | 重新构建 VitePress |
| `/astro/` 资源 404 | `ASTRO_BASE` 不是 `/studyNotes/astro/` | 重新构建 Astro |
| `_astro` 目录 404 | 缺 `.nojekyll` 或被 Jekyll 忽略 | 确认 `touch .pages/.nojekyll` |
| 旧页面还在 | `.pages` 没有被清空 | 脚本每次构建都会清空；确认没用其他命令覆盖 `.pages` |
| CI 上传后 404 | Pages Source 不是 GitHub Actions | 仓库 Settings → Pages → Source |
| 只有根页，没有子站 | 只上传了 `.pages` 的一部分 | 检查 artifact 路径是否为 `.pages` |
| 本地 `npx serve .pages` 打开白屏 | 请求缺少 `/studyNotes/` 前缀，与构建 base 不一致 | 改用 `npm run pages:preview` |
| 直接让根路径显示 VitePress/Astro | 根 `index.html` 被换掉，但子站资源仍带子路径 | 同时把对应 `base` 改成 `/`，或保持门户方案 |
| `pages:preview` 端口被占用 | 4173 已被其他进程使用 | `PAGES_PORT=4174 npm run pages:preview` |
| 仓库改名 / 自定义域名后全部 404 | `PAGES_BASE` 仍是 `studyNotes` | 用 `PAGES_BASE=/` 或新仓库名重新 `pages:build` |

### 6.1 检查是不是唯一来源

```bash
grep -RIn "pages:build" package.json .github README.md content
grep -RIn "\.pages" apps .github package.json
```

预期：

- 只有 `package.json` 的 `pages:build`、workflow、文档引用；
- app 内部不写 `.pages`。

### 6.2 检查产物完整性

```bash
find .pages -maxdepth 2 -name index.html | sort
du -sh .pages
```

## 7. 相关文档

- [根脚本清理验证报告](<./根脚本清理验证报告.md>)
- [monorepo](<./monorepo.md>)
- [GitHub Pages 静态站点部署指南](</代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)
