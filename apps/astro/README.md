# study-notes-astro

学习笔记的 Astro + Starlight 站点，与 `apps/vitepress` 同级，直接读取仓库根目录的 `content/`，没有内容副本。

## 命令

在仓库根目录执行：

```bash
npm install
npm run dev:astro      # http://localhost:4321/
npm run build:astro    # 产物 apps/astro/dist
npm run preview:astro
```

## 内容

Astro 直接读取根目录 `content/`：

- `content/` 根目录：共享内容；
- `content/astro/`：Astro 专属；
- `content/vitepress/`：被 glob 负 pattern 排除。

修改请直接编辑根目录 `content/` 对应文件，不需要同步。

Astro 7 要求 Node.js 22.23.4+。部署说明见
[GitHub Pages 静态站点部署指南](<../../content/代码/系统与运维/github-pages/GitHub Pages 静态站点部署指南.md>)。
