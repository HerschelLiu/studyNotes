---
title: "共享内容与 Frontmatter 规范"
---

> 适用于 `content/` 下的所有 Markdown，同时被 VitePress 和 Astro/Starlight 渲染。
>
> 目标：一份内容不改代码就能通过两个框架的构建。

## 1. 最小可用示例

```md
---
title: 快速开始
description: 安装并启动两个文档站。
---

## 安装

正文从二级标题开始。

- 站内链接：[写作规范](./writing.md)
- 图片：![示意图](./images/example.png)
```

对应目录：

```text
content/
├── index.md
├── guide/
│   ├── getting-started.md
│   └── writing.md
└── reference/
    └── frontmatter.md
```

## 2. Frontmatter 字段

| 字段 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `title` | 是 | string | 页面标题；VitePress 用它注入 H1，Starlight 用它渲染标题 |
| `description` | 建议 | string | SEO/搜索摘要 |
| `sidebar` | 否 | boolean / object | VitePress 单页侧边栏；Astro 不识别，建议不要放共享内容 |
| `layout` | 否 | string | VitePress 专属，Astro 不识别 |
| `template` | 否 | string | Starlight 专属（如 `splash`），VitePress 不识别 |
| `draft` | 否 | boolean | 两边的行为不同，共享内容不要用 |

共享内容只保留 `title` 和 `description` 最稳。

## 3. 标题规则

### 3.1 不在正文写 H1

```md
---
title: 快速开始
---

## 安装
```

原因：

- Starlight 已经用 frontmatter 标题渲染页面标题；
- 如果正文再写 `# 快速开始`，Astro 页面会出现两个 H1；
- VitePress 侧由 `AppLayout.vue` 把 `frontmatter.title` 插入为唯一 H1。

### 3.2 标题层级

- 正文从 `##` 开始；
- 不跳级：`##` → `###`；
- 标题文字与锚点会进入两侧的目录/TOC。

## 4. 链接规则

### 4.1 用相对 `.md` 路径

```md
[快速开始](./getting-started.md)
[Frontmatter](../reference/frontmatter.md)
```

- VitePress 自动把 `.md` 转成 `.html`（或 clean URL）；
- Astro 侧由 `apps/astro/src/plugins/remark-md-links.mjs` 转成 Starlight 路由：

  ```text
  ./getting-started.md  ->  /guide/getting-started/
  ../reference/x.md     ->  /reference/x/
  ```

- 不要写 `/guide/getting-started/` 这类固定尾斜杠路径，部署到子路径时容易 404；
- 不要写 `file://`、绝对文件系统路径。

### 4.2 锚点

```md
[安装步骤](#安装)
```

两侧都保留锚点；Astro 的 remark 插件会保留 `#hash`。

### 4.3 外部链接

```md
[GitHub](https://github.com/...)
```

正常写完整 URL；不要用相对路径绕。

## 5. 图片与静态资源

### 5.1 内容图片

```md
![示意图](./images/example.png)
```

放在 `content/` 内，跟着 Markdown 一起同步：

```text
content/guide/
├── writing.md
└── images/
    └── example.png
```

两个框架都按 Markdown 相对路径处理。

### 5.2 公共图标 / favicon

放各自 app：

```text
apps/vitepress/public/
apps/astro/public/
```

用 `/favicon.svg` 这类站点根路径引用，不要放进共享 Markdown 的相对路径里。

### 5.3 大文件

不要放 `public/` 或内容目录；Pages 有体积限制，放对象存储/CDN。

## 6. 代码块

### 6.1 语言 ID

优先使用两边都支持、且 Shiki/Expressive Code 都认识的 ID：

```text
ts  js  tsx  jsx  vue  html  css  json  yaml  bash  text
```

- 不要写 `html+javascript`、`typescript‘`、`undefined`、`dash` 这类非标准 ID；
- 遇到 “language is not loaded” 警告，改成合法 ID 或 `text`；
- Astro 的 Expressive Code 与 VitePress 的 Shiki 语言集合不完全相同，拿不准就用 `text`。

### 6.2 不要放框架组件

共享内容里不要出现：

- VitePress 的 `<DemoBlock>` 等 Vue 组件；
- Astro/Starlight 的 `<Card>` 等组件；
- MDX 的 `import` / JSX。

需要交互组件时，在对应 app 里单独写页面，不要放进 `content/`。

## 7. 不兼容语法清单

| 语法 | VitePress | Astro/Starlight | 建议 |
| --- | --- | --- | --- |
| `::: tip` 容器 | 支持 | 不一定支持 | 用普通引用块 |
| `{{ interpolation }}` | 当 Vue 模板编译 | 普通文本 | 用反引号包起来或改写 |
| Vue 组件 | 支持 | 不识别 | 放到 VitePress app |
| Astro/Starlight 组件 | 不识别 | 支持 | 放到 Astro app |
| MDX `import` / JSX | 不处理 | 支持 | 共享内容只用 `.md` |
| `layout: home` | 首页布局 | 不识别 | 不要把首页做成共享内容 |
| `template: splash` | 不识别 | 首页布局 | 同上 |

## 8. 侧边栏

共享内容本身不包含侧边栏配置，两个 app 各自维护：

- VitePress：`apps/vitepress/.vitepress/sidebar.mjs` 扫描同步目录自动生成；
- Astro：`astro.config.mjs` 的 `sidebar` 使用 `autogenerate` 按目录生成。

新增顶级目录时：

- VitePress 自动扫描；
- Astro 需要在 `sidebar` 里增加一个 `autogenerate` 分组（或改用根级自动生成）。

## 9. 规范化旧文档

模板自带：

```bash
node scripts/normalize-frontmatter.mjs ./content --dry
node scripts/normalize-frontmatter.mjs ./content
```

行为：

1. 没有 frontmatter：从第一个 `#` 取标题，写入 frontmatter，删除 H1；
2. 有 frontmatter 无 `title`：补 `title`，删除 H1；
3. 有 `title`：保留，删除正文 H1。

执行前提交/备份；脚本会直接改写文件。

## 10. 兼容性自检

每次改共享内容后：

```bash
npm run build:vp
npm run build:astro
```

检查：

- 两边页面数是否一致；
- 侧边栏是否有新页面；
- 链接是否 404；
- 标题是否重复；
- 代码块语言是否报警告。

## 11. 迁移检查表

- [ ] 所有文档有 `title`
- [ ] 正文没有 H1
- [ ] 链接是相对 `.md`
- [ ] 图片在内容目录内
- [ ] 没有 VitePress/Astro 专属组件
- [ ] 代码块语言合法
- [ ] 两个构建都通过
- [ ] 两个站点链接抽查通过
