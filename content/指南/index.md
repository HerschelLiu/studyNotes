---
title: "站点指南"
---

这里放文档站的可运行示例，以及示例系统的实现说明。

| 文档 | 内容 |
| --- | --- |
| [交互示例](./交互示例.md) | 可运行示例 + 查看源码的实现方式，以及新增示例的步骤 |

## 这个站点怎么工作

```text
代码/**/*.md  ──►  VitePress 构建  ──►  .vitepress/dist  ──►  GitHub Pages
       ▲                    │
       │                    ├─ sidebar.mjs 启动时扫描目录，生成侧边栏
       └── 新增 / 修改 ─────┘
                            └─ DemoBlock 按需加载 .vitepress/demos/*.vue
```

- **内容零迁移**：VitePress 以仓库根目录为 `srcDir`，`代码/` 下的 Markdown 就是页面。
- **导航零维护**：侧边栏由 [sidebar.mjs](https://github.com/HerschelLiu/studyNotes/blob/master/apps/vitepress/.vitepress/sidebar.mjs) 读取文件系统生成；开发模式检测到新增 / 删除文档会自动重启。
- **示例零复制**：示例组件放在 `apps/vitepress/.vitepress/demos/`，Markdown 里只写一行 `<DemoBlock src="..." />`，源码通过 `?raw` 按需展示。
- **发布零服务器**：推送到 `master` 后 GitHub Actions 自动构建，产物交给 GitHub Pages。

## 本地常用命令

```bash
npm install          # 首次安装
npm run dev:vp        # 本地开发，默认 http://localhost:5173/
npm run build:vp      # 生产构建，产物在 apps/vitepress/.vitepress/dist
npm run preview:vp    # 预览生产构建，默认 http://localhost:4173/
```

> 文档站搭建与部署指南已归入前端工程化：[VitePress 文档站搭建与部署指南](/代码/前端/工程化/vitepress/文档站搭建与部署指南.md)。
