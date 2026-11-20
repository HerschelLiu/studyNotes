---
title: "让项目同时支持 VitePress 与 Astro"
---

> 目标：一个 npm workspace monorepo，一份共享内容，两个同级文档站，**没有内容副本、没有同步脚本**。
>
> 当前 `studyNotes` 已经按这个结构迁移完成。

## 1. 先回答两个问题

### 1.1 能不能只有 content

可以。关键是利用 **npm workspace 的依赖提升**：

- VitePress 直接以仓库根目录 `content/` 为 `srcDir`；
- Astro 用 `glob` loader 直接读取 `content/`；
- Vue 被提升到根 `node_modules`，VitePress 不再出现 `vue/server-renderer` 解析失败；
- 不需要 `apps/*/content` 副本，也不需要同步脚本。

之前同步副本的唯一原因，是 VitePress 在 app 外部内容目录时找不到 Vue；用 workspace 后这个问题消失。

### 1.2 算不算 monorepo

算，而且是标准形态：

```text
一个仓库
├── apps/vitepress     # workspace 包
├── apps/astro         # workspace 包
├── content/           # 共享内容包（不是 npm 包，但共享资产）
├── package.json       # workspaces + 根命令
└── package-lock.json  # 单一锁文件
```

满足 monorepo 的核心条件：

- 多个可独立构建的应用；
- 一个根命令/锁文件管理依赖；
- 共享内容与公共依赖；
- 各 app 有自己的配置与构建产物。

如果没有 workspace，只是“多个 app 放在一起 + 各自 npm install”，那叫多包仓库，但不是规范的 monorepo。

## 2. 目录结构

```text
studyNotes/
├── content/                    # 唯一内容根
│   ├── index.md                # 共享首页
│   ├── README.md               # 共享全库索引
│   ├── 代码/                   # 共享笔记
│   ├── 指南/                   # 共享示例说明
│   ├── vitepress/              # 仅 VitePress
│   └── astro/                  # 仅 Astro
├── apps/
│   ├── home/                 # 根站点选择页
│   ├── vitepress/
│   │   ├── .vitepress/
│   │   └── package.json
│   └── astro/
│       ├── astro.config.mjs
│       └── package.json
├── scripts/
│   └── normalize-frontmatter.mjs
├── package.json                # workspaces + docs:* / astro:*
└── package-lock.json
```

三个内容区：

| 目录 | 谁渲染 | 用途 |
| --- | --- | --- |
| `content/` 根 | VitePress + Astro | 共享内容 |
| `content/vitepress/` | 仅 VitePress | Vue 组件、DemoBlock 等 |
| `content/astro/` | 仅 Astro | Astro/Starlight 专属页面 |

过滤规则：

```ts
// VitePress
srcExclude: ['astro/**']
```

```ts
// Astro glob loader
pattern: ['**/*.md', '!vitepress/**']
```

## 3. workspace 配置

根 `package.json`：

```json
{
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev:vp": "npm --workspace apps/vitepress run dev --",
    "build:vp": "npm --workspace apps/vitepress run build",
    "dev:astro": "npm --workspace apps/astro run dev --",
    "build:astro": "npm --workspace apps/astro run build"
  }
}
```

根目录一次安装：

```bash
npm install
```

依赖会被提升到根 `node_modules`；两个 app 不需要各自 `npm install`。

## 4. VitePress 直接读取 content

`apps/vitepress/.vitepress/config.mts`：

```ts
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // 从 .vitepress/ 向上一共三级到仓库根
  srcDir: fileURLToPath(new URL('../../../content', import.meta.url)),
  srcExclude: ['astro/**'],
  // ...
})
```

- 部署时 VitePress 在 `/vitepress/` 下，访问路径是 `/vitepress/代码/...`、`/vitepress/指南/...`；
- `content/vitepress/` 会被 VitePress 渲染；
- `content/astro/` 被排除；
- 构建产物在 `apps/vitepress/.vitepress/dist`。

## 5. Astro 直接读取 content

`apps/astro/src/content.config.ts`：

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { fileURLToPath } from 'node:url';

const contentDir = fileURLToPath(new URL('../../../content', import.meta.url));

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: contentDir,
      pattern: ['**/*.md', '!vitepress/**'],
      generateId: ({ entry }) => {
        const id = entry.replace(/\.mdx?$/, '');
        if (id === 'README') return 'README';
        if (id.endsWith('/README')) return id.slice(0, -'/README'.length);
        return id;
      },
    }),
    schema: docsSchema(),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
```

要点：

- `pattern` 的负 pattern 排除 VitePress 专属目录；
- `generateId` 保留大小写/空格，并把 `README.md` 映射为目录首页，保证共享链接和 VitePress 语义一致；
- Astro 仍使用 Starlight 的 `docsSchema`，所以 frontmatter `title` 必填。

`astro.config.mjs` 里的链接插件 `contentDir` 同样指向根 `content/`：

```js
const contentDir = fileURLToPath(new URL('../../content', import.meta.url));
```

## 6. 从零开始

### 6.1 手工搭建

> 仓库内脚手架已移除。需要快速复用请使用外部模板仓库，或按下面步骤手工搭建。

1. 建 `content/`、`apps/home`、`apps/vitepress`、`apps/astro`；
2. 根 `package.json` 加 `workspaces: ["apps/*"]`；
3. home 放一个静态 `index.html`，链接 `vitepress/`、`astro/`；
4. 两个 app 各自 `package.json`；
5. VitePress 配外部 `srcDir` + `srcExclude: ['astro/**']`；
6. Astro 配 `glob` loader + 负 pattern；
7. `npm install` 一次安装；
8. 分别启动两个 app；
9. `pages:build` 组装 `.pages`。

## 7. 现有项目迁移

当前仓库的迁移步骤：

1. 把 `代码/`、`指南/`、`index.md`、`README.md` 移入 `content/`；
2. 原 VitePress 配置/主题迁入 `apps/vitepress/`，Astro app 放 `apps/astro/`；
3. 根 `package.json` 加 `workspaces`；
4. VitePress `srcDir` 指向根 `content/`；
5. Astro 改用 `glob` 读取根 `content/`，排除 `vitepress/**`；
6. `normalize-frontmatter.mjs` 给 400 篇文档补 `title`、删 H1；
7. `npm install`，两个 app 分别构建；
8. 删除所有同步副本和同步脚本；
9. GitHub Actions 改为根 `npm ci` + 两个 workspace 构建。

## 8. 当前迁移结果

- `content/` 根：400+ 篇共享 Markdown；
- `content/vitepress/`：2 篇 VitePress 专属（含 VitePress 首页）；
- `content/astro/`：2 篇 Astro 专属（含 Astro 首页）；
- VitePress：423 个 HTML；
- Astro：423 个 HTML；
- 磁盘上只有一份 `content/`，没有 `apps/*/content`；
- 根 `npm-lock` 单一锁文件；
- 两个站点可同时启动，源内容修改直接生效。

## 9. 命令

```bash
npm install
npm run dev:vp
npm run build:vp
npm run preview:vp

npm run dev:astro
npm run build:astro
npm run preview:astro

npm run normalize
```

## 10. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| VitePress 报 `vue/server-renderer` | 没有用 workspace，Vue 不在根 node_modules | 根 `npm install`，确认 `workspaces` |
| Astro 出现 VitePress 专属页 | glob 负 pattern 没生效 | `pattern: ['**/*.md', '!vitepress/**']` |
| VitePress 出现 Astro 专属页 | `srcExclude` 没写 | 加 `astro/**` |
| Astro 链接 404 | README 映射/大小写不一致 | 用本文的 `generateId` 与链接插件 |
| 修改内容站点不更新 | 没启动对应 app | 直接运行 `dev:vp` / `dev:astro` |
| `config.mts` 报 `Plugin` 不能赋给 `PluginOption` | 根目录 Vite 与 `vitepress` 内置 Vite 版本不同 | 在 `apps/vitepress` 安装 `vite@^5.4.14`，重新 `npm install` |

## 11. 相关文档

- [共享内容与 Frontmatter 规范](<./共享内容与 Frontmatter 规范.md>)
- [monorepo](</代码/前端/工程化/monorepo/monorepo.md>)
- [GitHub Pages 静态站点部署指南](</代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)
