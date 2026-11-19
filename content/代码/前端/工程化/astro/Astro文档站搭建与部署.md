---
title: "Astro 文档站搭建与部署"
---

> 本文只讲 Astro + Starlight。示例是独立的 Astro 项目，不依赖其他文档框架。

## 1. 适用场景

Astro + Starlight 适合：

- 内容型文档、博客、多语言站点；
- 需要极少的客户端 JavaScript；
- 需要在同一站点里使用 Vue / React / Svelte 等岛屿组件；
- 构建为纯静态文件，托管 GitHub Pages、Netlify、Vercel。

Astro 7 要求 **Node.js 22.23.4+**。

## 2. 初始化

```bash
npm create astro@latest my-docs -- --template starlight
cd my-docs
npm install
npm run dev
```

生成后目录大致：

```text
my-docs/
├── astro.config.mjs
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx
│   │       └── guides/
│   └── styles/
│       └── custom.css
├── public/
└── package.json
```

Starlight 的正文放在 `src/content/docs/`，不是项目根目录。

## 3. 站点配置

`astro.config.mjs`：

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://example.com',
  base: '/',
  integrations: [
    starlight({
      title: '我的文档',
      description: 'Astro + Starlight 文档站',
      favicon: '/favicon.svg',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: '指南',
          items: [{ autogenerate: { directory: 'guides' } }],
        },
      ],
    }),
  ],
});
```

部署到 GitHub Pages 项目站点时：

```bash
ASTRO_BASE=/my-repo/ npm run build
```

`base` 同时影响链接、静态资源和页面路由。

## 4. 内容集合

`src/content.config.ts`：

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { i18nLoader } from '@astrojs/starlight/loaders';

export const collections = {
  docs: defineCollection({
    loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
    schema: docsSchema(),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
```

`docsSchema` 要求每篇有 `title`。Starlight 会用它生成侧边栏、搜索与页面标题。

## 5. 写文档

```md
---
title: "快速开始"
---

## 安装

正文从二级标题开始。
```

- 正文不写 H1，Starlight 渲染 frontmatter 标题；
- 链接用相对 `.md`：

```md
[写作规范](./writing.md)
```

Astro 的 Markdown 处理器会把 `.md` 链接转成站点路由。

## 6. 侧边栏

手写：

```js
sidebar: [
  {
    label: '指南',
    items: [
      { label: '快速开始', slug: 'guides/getting-started' },
      { label: '写作规范', slug: 'guides/writing' },
    ],
  },
]
```

自动扫描：

```js
sidebar: [
  {
    label: '指南',
    items: [{ autogenerate: { directory: 'guides' } }],
  },
]
```

`slug` 是相对于 `src/content/docs/` 的路径，不带 `.md`。

## 7. 自定义样式

`src/styles/custom.css`：

```css
:root {
  --sl-color-accent-low: #e8f0ff;
  --sl-color-accent: #2563eb;
  --sl-color-accent-high: #1e40af;
}
```

在 `starlight({ customCss: ['./src/styles/custom.css'] })` 注册。

## 8. 岛屿与交互组件

Astro 默认输出静态 HTML。需要交互时，添加对应框架集成：

```bash
npx astro add vue
```

创建 `src/components/Counter.vue`：

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
</template>
```

在 `.mdx` 中使用：

```mdx
import Counter from '../../components/Counter.vue'

<Counter client:load />
```

`client:load`、`client:idle`、`client:visible` 决定水合时机；不写指令就只是静态 HTML。

## 9. 本地与构建

```bash
npm run dev        # http://localhost:4321/
npm run build      # dist/
npm run preview
```

模拟子路径：

```bash
ASTRO_BASE=/my-repo/ npm run build
ASTRO_BASE=/my-repo/ npm run preview
```

## 10. 部署到 GitHub Pages

```yaml
name: Deploy Astro

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
      - run: npm ci
      - run: npm run build
        env:
          ASTRO_BASE: /<repo>/
      - run: touch dist/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

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

仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 11. 常见问题

| 现象 | 处理 |
| --- | --- |
| 页面 404 | 检查 `base` 是否以 `/` 开头结尾 |
| 侧边栏空 | `directory` / `slug` 相对 `src/content/docs/` 写对 |
| 构建找不到内容 | `content.config.ts` 的 `base` 与 `pattern` 不一致 |
| 中文 UI 不生效 | 配置 `locales` 并提供 `i18n` 集合 |
| 交互组件不响应 | 忘记写 `client:load` 等水合指令 |
| 搜索 URL 错 | 构建时 `base` 与部署路径不一致 |

GitHub Pages 的 base、自定义域名与排错详见
[GitHub Pages 静态站点部署指南](</代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)。
