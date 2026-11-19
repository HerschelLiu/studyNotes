---
title: "GitHub Pages 静态站点部署指南"
---

> 本文单独讲 GitHub Pages，不再混在 VitePress 指南里。
>
> 覆盖：VitePress、Astro/Starlight、双栈合并部署、自定义域名与排错。
>
> **本仓库当前使用第 6 节方案 B 的双栈合并 workflow**：根 `/studyNotes/` 是门户，VitePress 在 `/studyNotes/vitepress/`，Astro 在 `/studyNotes/astro/`。第 4、5 节是单站示例。
>
> 适用：GitHub Free 公开仓库、GitHub Actions、静态站点。

## 1. 先理解 Pages 的模型

GitHub Pages 是**静态文件托管**，一个仓库默认只有一个站点根路径：

```text
https://<user>.github.io/<repo>/
```

构建工具只负责生成静态文件，Pages 只负责按路径返回文件。所以：

- VitePress 和 Astro 可以分别构建；
- 但**同一个 Pages 站点**只能有一个根 `index.html`；
- 两个站点同时上线时，必须一个放根、一个放子路径，或者拆到两个仓库/域名。

## 2. 前置条件

1. 仓库已推送到 GitHub；
2. 仓库为 **Public**（免费账户的 Pages 通常要求公开仓库；私有仓库取决于套餐）；
3. 仓库 **Settings → Actions → General** 允许 Actions；
4. 知道默认分支：本仓库是 `master`，新项目常见 `main`，workflow 要一致；
5. 构建产物目录明确（见下表）。

| 项目 | 构建命令 | 产物目录 | base |
| --- | --- | --- | --- |
| 本仓库 VitePress | `npm run build:vp` | `apps/vitepress/.vitepress/dist` | `/studyNotes/vitepress/` |
| 双栈模板 VitePress | `npm run build:vp` | `apps/vitepress/.vitepress/dist` | `/repo/vitepress/` |
| 双栈模板 Astro | `npm run build:astro` | `apps/astro/dist` | `/repo/astro/` |
| 本仓库 Astro | `npm run build:astro` | `apps/astro/dist` | `/studyNotes/astro/` |

## 3. 开启 Pages

### 3.1 先确认在“仓库设置”而不是“账户设置”

`https://github.com/settings/pages` 是**个人账户**的 Pages 设置，只管理已验证域名；这里没有项目的 Source 选项。

仓库 Pages 地址是：

```text
https://github.com/<user>/<repo>/settings/pages
```

本仓库：

```text
https://github.com/HerschelLiu/studyNotes/settings/pages
```

路径：进入仓库主页 → **Settings** → 左侧 **Code and automation** 下的 **Pages**。

### 3.2 设置 Source

在 **Build and deployment → Source** 选择 **GitHub Actions**。

- 不要选 “Deploy from a branch”，否则 workflow 上传的 artifact 不会作为站点内容；
- 如果页面里暂时没有 Source 下拉框：
  - 确认打开的是仓库 Settings，不是账户 Settings；
  - 仓库必须是 public，或账户有 GitHub Pro/Team/Enterprise（private repo 才能用 Pages）；
  - 先把 `.github/workflows/deploy.yml` 提交到默认分支，再刷新 Pages 页面。

当前仓库的 workflow 已包含：

```yaml
- uses: actions/configure-pages@v5
  with:
    enablement: true
```

`enablement: true` 会在第一次运行时尝试自动启用 Pages，但仍建议按上面的仓库地址确认 Source。

> 第一次部署前未开启 Pages，`deploy-pages` 可能报 `Get Pages site failed` 或 `Not Found`。

## 4. VitePress 单站部署（通用示例）

下面是一个单站 VitePress workflow；本仓库当前使用第 6 节方案 B 的双栈合并版本，实际文件是 `.github/workflows/deploy.yml`。

```yaml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build:vp
        env:
          DOCS_BASE: /studyNotes/
      - run: touch .vitepress/dist/.nojekyll

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

关键点：

- `permissions.pages: write` + `id-token: write` 必须同时存在；
- `DOCS_BASE` 与仓库名一致，首尾都有 `/`；
- `fetch-depth: 0` 让 `lastUpdated` 拿到完整 git 历史；
- `cache: npm` 要求提交 `package-lock.json`；
- `.nojekyll` 防止 Pages 的 Jekyll 处理忽略 `_` 开头资源。

## 5. Astro 单站部署

Astro 7 要求 Node.js **22.23.4+**；workflow 不能用 Node 20。

```yaml
name: Deploy Astro Docs to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: apps/astro/package-lock.json
      - run: npm ci
        working-directory: apps/astro
      - run: npm run build
        working-directory: apps/astro
        env:
          ASTRO_BASE: /repo/
      - run: touch apps/astro/dist/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/astro/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> 如果 Astro 就是仓库根项目，去掉 `working-directory: apps/astro` 和 `cache-dependency-path`，按根目录安装即可。

当前 monorepo 使用共享 `content/`，不需要同步；在仓库根目录执行：

```bash
npm ci
npm run build:astro
```

对应 workflow 步骤：

```yaml
- run: npm ci
- run: npm run build:astro
  env:
    ASTRO_BASE: /repo/astro/
- run: touch apps/astro/dist/.nojekyll
```

注意：

- `ASTRO_BASE` 以 `/` 开头、以 `/` 结尾；
- `site` 与 `base` 决定 canonical / sitemap；
- Astro 的 `dist` 里通常没有 `.nojekyll`，需要手动创建；
- 搜索是 Pagefind，构建时生成，不需要服务端。

## 6. 双栈部署

### 方案 A：两个仓库 / 两个站点（最简单）

- VitePress 留在当前仓库；
- Astro 放到另一个仓库（例如 `docs-astro`）或独立子域名；
- 两套 workflow、两个 Pages 站点，互不影响。

适合两个站点定位不同、不需要统一域名的情况。

### 方案 B：合并到一个 Pages 站点

一个仓库、一个 artifact，页面入口按子路径区分。monorepo 本身不会导致 Pages 冲突，Pages 只认最终上传的 artifact。

当前仓库使用 **根门户 + 两个子路径**：

```text
https://<user>.github.io/<repo>/              # 门户（apps/home/index.html）
https://<user>.github.io/<repo>/vitepress/    # VitePress
https://<user>.github.io/<repo>/astro/        # Astro
```

- 根 `/` 不是任何框架的站点，只是一个选择页；
- VitePress 的文档路径在 `/vitepress/代码/...`、`/vitepress/指南/...`；
- Astro 全部在 `/astro/` 下；
- 两个站点各自有搜索索引，不需要服务端。

步骤：

```bash
# 1. VitePress
DOCS_BASE=/repo/vitepress/ npm run build:vp

# 2. Astro
ASTRO_BASE=/repo/astro/ npm run build:astro

# 3. 组装门户 + 两个子站
npm run pages:build
# 产物在 .pages/
```

`pages:build` 做三件事：

```text
apps/home/index.html
  -> .pages/index.html
apps/vitepress/.vitepress/dist/*
  -> .pages/vitepress/
apps/astro/dist/*
  -> .pages/astro/
```

workflow 片段：

```yaml
- run: npm ci
- run: npm run build:vp
  env:
    DOCS_BASE: /repo/vitepress/
- run: npm run build:astro
  env:
    ASTRO_BASE: /repo/astro/
- run: npm run pages:build
- uses: actions/upload-pages-artifact@v3
  with:
    path: .pages
```

注意：

- 根门户链接用相对路径 `vitepress/`、`astro/`，不要写死域名；
- Astro 内部绝对链接要带 `/repo/astro/`；共享内容里的相对 `.md` 链接由 remark 插件转换；
- VitePress 内部链接由 `DOCS_BASE` 生成；
- 两个站点的搜索索引各自生成；
- 一个 artifact 上传，Pages 只部署一次。

### 方案 C：两个 workflow 都上传根 artifact（不可行）

两个 `deploy-pages` 同时发布同一个 Pages 根会互相覆盖，不要这样做。

## 7. base 规则

| 部署形态 | 访问地址 | base |
| --- | --- | --- |
| 项目站点 | `https://<user>.github.io/<repo>/` | `/<repo>/` |
| 用户/组织站点 | `https://<user>.github.io/` | `/` |
| 自定义域名 | `https://docs.example.com/` | `/` |
| 双栈门户 | `https://<user>.github.io/<repo>/` | 纯静态，无 base |
| 双栈子路径 | `https://<user>.github.io/<repo>/vitepress/` 或 `/astro/` | `/<repo>/vitepress/`、`/<repo>/astro/` |

base 配错是白屏和 CSS/JS 404 的第一原因：

- 首尾都要有 `/`；
- 本地开发默认 `/`，CI 才注入子路径；
- 自定义域名要改回 `/`；
- 仓库改名后同步改 `base`、`site`、`editLink`。

## 8. 自定义域名

1. **Settings → Pages → Custom domain** 填域名并保存；
2. 域名服务商配置：
   - 子域名：`CNAME docs.example.com → <user>.github.io`；
   - 根域名：按 GitHub 文档配置 A 记录；
3. 等待 DNS 生效，勾选 **Enforce HTTPS**；
4. 把构建时的 base 改为 `/`；
5. 重新运行 workflow。

> 自定义域名下仍用 `/<repo>/` 会导致资源 404。

## 9. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面能开但 CSS/JS 404 | base 与部署路径不一致 | 项目站点用 `/<repo>/`，自定义域名用 `/` |
| 首页 404 | Pages Source 仍是 Deploy from a branch | 改为 GitHub Actions，重跑 |
| `deploy-pages` 报 `Get Pages site failed` | 未开启 Pages 或权限不足 | Settings → Pages 选 GitHub Actions；检查 permissions |
| `npm ci` 失败 | 锁文件缺失/不同步 | 本地安装后提交 `package-lock.json` |
| 首次部署一直 404 | DNS/Pages 传播未完成 | 等 1～2 分钟；确认 Pages 显示 live |
| `lastUpdated` 全是当前时间 | 浅克隆 | `actions/checkout` 的 `fetch-depth: 0` |
| Astro 构建失败 | Node 版本低于 22.23.4 | workflow 用 Node 22 或 24 |
| Astro 子路径资源 404 | `ASTRO_BASE` 未设置或格式错误 | `/repo/astro/`，首尾 `/` |
| 双栈后 Astro 页面在 `/astro/` 404 | 没有把 Astro dist 复制进 VitePress dist | 见方案 B 的 cp 步骤 |
| 中文 URL 变成 `%E5...` | 浏览器正常编码 | 无需处理；避免频繁改文件名 |
| 构建内存不足 | 页面很多 + 高亮 | `NODE_OPTIONS=--max-old-space-size=4096` |
| 附件 `.rar` / `.zip` 404 | 非 Markdown 引用文件不会进 dist | 放 `public/files/` 并用 `/files/...` |

## 10. 安全与限制

- 不要把密钥、token、私钥提交到仓库；Pages 是公开静态站点；
- Pages 站点有体积限制，大文件放对象存储/CDN，不要塞进 `public/`；
- Actions artifact 默认保留时间有限，不要把它当长期存储；
- 自定义域名记得开 HTTPS；
- 私有仓库的 Pages 取决于 GitHub 套餐，免费账户优先使用公开仓库。

## 11. 验收清单

- [ ] Pages Source = GitHub Actions
- [ ] workflow 的 `build` / `deploy` 均成功
- [ ] 首页、内页、刷新内页均 200
- [ ] CSS / JS / 字体 / 图片无 404
- [ ] 搜索可用
- [ ] 自定义域名（如有）HTTPS 正常
- [ ] 双栈部署时 `/repo/`（门户）、`/repo/vitepress/`、`/repo/astro/` 都能访问

## 12. 相关文档

- [VitePress 文档站搭建与部署指南](/代码/前端/工程化/vitepress/文档站搭建与部署指南.md)
- [Astro 文档站搭建与 VitePress 共存指南](/代码/前端/工程化/astro/Astro文档站搭建与部署.md)
- [让项目同时支持 VitePress 与 Astro](</代码/前端/工程化/dual-docs/让项目同时支持 VitePress 与 Astro.md>)
- [monorepo 与脚手架](/代码/前端/工程化/monorepo/monorepo.md)
