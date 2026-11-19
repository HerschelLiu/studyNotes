---
title: "vite命令"
---

> 常用 Vite 命令（不需要装全局，`npx` 直接用项目里的版本）。

| 命令 | 作用 |
| --- | --- |
| `npx vite` | 启动开发服务器 |
| `npx vite --host` | 监听 `0.0.0.0`，局域网 / 手机可访问 |
| `npx vite --port 3000` | 指定端口 |
| `npx vite build` | 生产构建（产物默认在 `dist`） |
| `npx vite preview` | 本地预览构建产物 |
| `npx vite --debug` | 输出调试信息 |

## 查看详细构建报告

```bash
npx vite-bundle-visualizer
```

会生成模块体积分析图，用来定位包体积问题。

## 说明

- 项目里一般封装成 `package.json` 的 `scripts`（`dev` / `build` / `preview`），用 `npm run dev` 等即可。
- 构建配置见同目录 [vite插件](vite插件/)。
