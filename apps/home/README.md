# apps/home

根门户（默认主页）。

- 纯静态 `index.html`，不依赖 VitePress/Astro；
- 链接使用相对路径 `vitepress/`、`astro/`；
- `npm run pages:build` 会把它复制为 `.pages/index.html`；
- `404.html` 负责把旧的 `/studyNotes/代码/...` 兼容到 `/studyNotes/vitepress/代码/...`。

## 它不是自动路由

只新增 `apps/home/` 并不会自动成为默认主页。当前机制是：

1. `pages:build` 显式执行：
   `cp apps/home/index.html .pages/index.html`
   `cp apps/home/404.html .pages/404.html`
2. 根 `/` 才会显示这个页面。

所以“默认主页”由两部分组成：

- 约定目录：`apps/home/index.html`；
- 显式组装：根 `package.json` 的 `pages:build`。

新增框架时，需要同时：

- 在 `apps/home/index.html` 增加入口；
- 在 `pages:build` 把该框架产物复制到 `.pages/<framework>/`；
- 在 workflow 构建该框架。

## 本地

根门户只有在 `pages:build` 或部署后可见。本地文档开发：

```bash
npm run dev:vp
npm run dev:astro
```

完整机制见[.pages 构建机制与排查](../../content/代码/前端/工程化/monorepo/pages构建机制与排查.md)。
