# 学习笔记 · VitePress + Astro 双栈文档站

> 站点选择：<https://herschelliu.github.io/studyNotes/>
>
> VitePress 版：<https://herschelliu.github.io/studyNotes/vitepress/>
>
> Astro 版：<https://herschelliu.github.io/studyNotes/astro/>

一个 npm workspace monorepo：一份共享内容，两个同级文档站，**没有内容副本，也没有同步脚本**。

```text
content/                     # 唯一内容根
├── README.md                # 共享全库索引
├── 代码/                    # 共享笔记
├── 指南/                    # 共享示例说明
├── public/brand-logo.svg           # VitePress 公共资源
├── vitepress/
│   └── index.md             # VitePress 首页
└── astro/
    └── index.md             # Astro 首页
apps/
├── home/                  # 根站点选择页
├── vitepress/               # VitePress 站点（直接读 ../../content）
└── astro/                   # Astro 站点（直接读 ../../content）
scripts/
└── normalize-frontmatter.mjs
package.json                 # workspaces + *:vp / astro:*
```

- `content/` 根目录：两个站点都渲染共享笔记；
- `content/vitepress/`：只被 VitePress 渲染，含 VitePress 首页；
- `content/astro/`：只被 Astro 渲染，含 Astro 首页；
- 两个 app 都直接读取 `content/`，不存在 `apps/*/content` 副本。

## 命令

```bash
npm install             # 根目录一次安装所有 workspace 依赖

npm run dev:vp          # VitePress，5173
npm run build:vp        # 产物 apps/vitepress/.vitepress/dist
npm run preview:vp

npm run dev:astro       # Astro，4321
npm run build:astro     # 产物 apps/astro/dist
npm run preview:astro

npm run pages:build     # 构建两站并组装 .pages（home + VitePress + Astro）
npm run pages:preview   # 一键构建并本地预览 Pages：http://localhost:4173/studyNotes/
npm run pages:serve     # 直接预览已有的 .pages（不重新构建）

npm run normalize       # 规范化 content/ 的 frontmatter
```

> `pages:preview` 会按 CI 的 base 构建两个站点再托管，适合验证子路径；写文档时仍用 `dev:vp` / `dev:astro` 获得热更新。
>
> Pages 的站点根就是 workflow 里 `upload-pages-artifact` 的 `path: .pages`；根主页是 `.pages/index.html`（来自 `apps/home/index.html`）。

## 内容规范

- 每篇文档必须有 frontmatter `title`；
- 正文从 `##` 开始，不写一级标题；
- 站内链接使用相对 `.md` 路径；
- 共享内容不使用只属于 VitePress 或 Astro 的语法；框架专属页面放 `content/vitepress/` 或 `content/astro/`。

VitePress 侧由 `AppLayout.vue` 把 `frontmatter.title` 注入为一级标题；Astro 使用 Starlight 页面标题。

## 文档

- [全库索引](content/README.md)
- [VitePress 文档站搭建与部署指南](<content/代码/前端/工程化/vitepress/文档站搭建与部署指南.md>)
- [Astro 文档站搭建与部署指南](<content/代码/前端/工程化/astro/Astro文档站搭建与部署.md>)
- [让项目同时支持 VitePress 与 Astro](<content/代码/前端/工程化/dual-docs/让项目同时支持 VitePress 与 Astro.md>)
- [monorepo](content/代码/前端/工程化/monorepo/monorepo.md)
- [.pages 构建机制与排查](content/代码/前端/工程化/monorepo/pages构建机制与排查.md)
- [根脚本清理验证报告](content/代码/前端/工程化/monorepo/根脚本清理验证报告.md)
- [GitHub Pages 静态站点部署指南](<content/代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)

## 两个站点怎么选

部署后根地址是纯静态门户，页面提供「VitePress 版 / Astro 版」两个入口：

- VitePress：`/studyNotes/vitepress/`，文档路径为 `/vitepress/代码/...`、`/vitepress/指南/...`；
- Astro：`/studyNotes/astro/`；
- 两个站点共用一个 GitHub Pages artifact，不是两个仓库。

本地开发时分别运行 `npm run dev:vp`（5173）和 `npm run dev:astro`（4321）；根 home 只在合并产物 `.pages/` 或部署后可见。

## 部署

推送到 `master` 后，GitHub Actions 会：

1. `npm ci` 安装 workspace；
2. `npm run pages:build`：按 `PAGES_BASE` 构建 VitePress 与 Astro，并把 home 一起组装、校验到 `.pages`；
3. 上传并发布 `.pages` 到 GitHub Pages。
