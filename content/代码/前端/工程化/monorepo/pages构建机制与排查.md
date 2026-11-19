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
    "pages:build": "rm -rf .pages && mkdir -p .pages/vitepress .pages/astro && cp apps/home/index.html .pages/index.html && cp -R apps/vitepress/.vitepress/dist/* .pages/vitepress/ && cp -R apps/astro/dist/* .pages/astro/ && touch .pages/.nojekyll"
  }
}
```

### 2.2 排查结论

已检查：

- `apps/vitepress`：构建只写 `apps/vitepress/.vitepress/dist`，不会写 `.pages/`；
- `apps/astro`：构建只写 `apps/astro/dist`，不会写 `.pages/`；
- `apps/home`：只有静态 `index.html`，没有构建脚本；
- `.github/workflows/deploy.yml`：先构建两个 app，再执行 `npm run pages:build`，最后上传 `.pages/`；
- 没有其他脚本、插件、hook 或 CI 步骤向 `.pages/` 写入。

因此可以确认：

```text
.pages/ 的唯一写入入口 = npm run pages:build
```

直接修 `.pages/` 是无效的，因为下一次构建会先 `rm -rf .pages`。

### 2.3 触发条件

| 场景 | 是否生成 `.pages/` |
| --- | --- |
| `npm run dev:vp` | 否 |
| `npm run build:vp` | 否，只生成 VitePress dist |
| `npm run astro:dev` | 否 |
| `npm run astro:build` | 否，只生成 Astro dist |
| `npm run pages:build` | 是，唯一入口 |
| GitHub Actions | 是，在两个 app 构建完成后调用 `pages:build` |
| 推送代码但 workflow 未运行 | 否 |

## 3. `pages:build` 完整执行流程

### 3.1 前置条件

先分别完成两个构建：

```bash
DOCS_BASE=/studyNotes/vitepress/ npm run build:vp
ASTRO_BASE=/studyNotes/astro/ npm run astro:build
```

本地开发默认 base 是 `/`；只有模拟 Pages 子路径时才传 `DOCS_BASE` / `ASTRO_BASE`。

### 3.2 逐步拆解

```bash
# 1. 清空旧产物，避免残留旧页面
rm -rf .pages

# 2. 创建两个子站目录
mkdir -p .pages/vitepress .pages/astro

# 3. 根首页：纯静态 home
cp apps/home/index.html .pages/index.html

# 4. VitePress 产物整体拷贝到 /vitepress/
cp -R apps/vitepress/.vitepress/dist/* .pages/vitepress/

# 5. Astro 产物整体拷贝到 /astro/
cp -R apps/astro/dist/* .pages/astro/

# 6. 关闭 GitHub Pages 的 Jekyll
touch .pages/.nojekyll
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
.pages 约 184M
VitePress 403 个 HTML
Astro 403 个 HTML
```

### 3.4 关键依赖

- `apps/home/index.html` 必须存在；
- `apps/vitepress/.vitepress/dist/index.html` 必须存在；
- `apps/astro/dist/index.html` 必须存在；
- `apps/home/index.html` 里的链接必须是相对路径 `vitepress/`、`astro/`；
- VitePress 构建必须带 `DOCS_BASE=/studyNotes/vitepress/`；
- Astro 构建必须带 `ASTRO_BASE=/studyNotes/astro/`。

## 4. 为什么 `pages:build` 看起来复杂

复杂度不来自业务代码，而来自“一个 Pages 站点承载三个入口”：

1. **三个产物**：home、VitePress、Astro 由不同构建器生成；
2. **三个路径**：根、`/vitepress/`、`/astro/`；
3. **两个 base**：VitePress 和 Astro 的 base 不同；
4. **一个 artifact**：Pages 只能上传一个根目录；
5. **原子性**：每次必须清空 `.pages`，否则旧文件会残留；
6. **Jekyll**：需要 `.nojekyll`，否则 `_astro` 等目录可能被忽略；
7. **零框架耦合**：home 是纯 HTML，不引入第三个框架。

命令选择 shell 而不是 Node 脚本，是因为它只做目录复制，不引入额外依赖；CI 与本地行为一致。

## 5. 使用示例

### 5.1 本地完整构建

```bash
npm ci

DOCS_BASE=/studyNotes/vitepress/ npm run build:vp
ASTRO_BASE=/studyNotes/astro/ npm run astro:build
npm run pages:build

find .pages -maxdepth 2 -name index.html
```

### 5.2 CI

```yaml
- run: npm ci
- run: npm run build:vp
  env:
    DOCS_BASE: /studyNotes/vitepress/
- run: npm run build:astro
  env:
    ASTRO_BASE: /studyNotes/astro/
- run: npm run pages:build
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

## 6. 常见问题排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `.pages` 不存在 | 没运行 `pages:build` | 先构建两个 app，再运行 |
| `.pages/vitepress` 不存在 | VitePress 构建失败或没执行 | 检查 `build:vp` 日志与 dist |
| `.pages/astro` 不存在 | Astro 构建失败或没执行 | 检查 `build:astro` 日志与 dist |
| 根 `/` 是 VitePress | home 未拷贝或文件名不对 | 确认 `apps/home/index.html` 覆盖 `.pages/index.html` |
| `/vitepress/` 白屏、资源 404 | `DOCS_BASE` 不是 `/studyNotes/vitepress/` | 重新构建 VitePress |
| `/astro/` 资源 404 | `ASTRO_BASE` 不是 `/studyNotes/astro/` | 重新构建 Astro |
| `_astro` 目录 404 | 缺 `.nojekyll` 或被 Jekyll 忽略 | 确认 `touch .pages/.nojekyll` |
| 旧页面还在 | 没有先 `rm -rf .pages` | 检查 `pages:build` 是否被改动 |
| CI 上传后 404 | Pages Source 不是 GitHub Actions | 仓库 Settings → Pages → Source |
| 只有根页，没有子站 | 只上传了 `.pages` 的一部分 | 检查 artifact 路径是否为 `.pages` |
| Windows 本地失败 | `rm/mkdir/cp/touch` 是 Unix 命令 | 用 Git Bash/WSL，或改用 CI |

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
