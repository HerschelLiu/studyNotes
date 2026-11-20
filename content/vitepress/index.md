---
layout: home
title: 学习笔记

hero:
  name: 学习笔记
  text: 把踩过的坑，变成可检索的文档
  tagline: 前端、后端、AI、工具与系统运维笔记。全文搜索、可交互示例、一键查看源码，推送到 master 自动发布。

features:
  - icon: 🧩
    title: 前端
    details: Vue / React / CSS / TS、工程化、组件库、hooks、小程序、Flutter、鸿蒙与 Electron。
    link: /代码/前端/README
    linkText: 进入前端
  - icon: 🛠️
    title: 后端
    details: Java、PHP、Node / Nest 的框架用法、接口设计与踩坑记录。
    link: /代码/后端/README
    linkText: 进入后端
  - icon: 🤖
    title: AI
    details: Agent 协作规范、Vue3 + AI、DSH 插件与项目级 AGENTS.md 实践。
    link: /代码/ai/README
    linkText: 进入 AI
  - icon: 🧰
    title: 工具
    details: Git、VSCode、终端、Markdown、自动化测试与效率工具。
    link: /代码/工具/README
    linkText: 进入工具
  - icon: 🖥️
    title: 系统与运维
    details: Linux、macOS、Windows、Docker、云服务器、虚拟机与装机。
    link: /代码/系统与运维/README
    linkText: 进入系统与运维
  - icon: 🎨
    title: 资源
    details: 字体、SVG、好用应用与开源协议速查。
    link: /代码/资源/README
    linkText: 进入资源
---

<a class="vp-raw" href="../">← 返回站点选择</a>

## 快速入口

[开始阅读](./代码/README.md) · [交互示例](./指南/交互示例.md) · [搭建与部署](./代码/前端/工程化/vitepress/文档站搭建与部署指南.md) · <a class="vp-raw" href="../astro/">Astro 版</a>

## 为什么用文档站

<div class="home-points">

**🔍 全文搜索**
构建时生成本地索引，不依赖第三方服务；搜索框直接定位到标题与段落。

**⚡ 交互示例**
像 Element Plus 文档一样，示例是真实运行的 Vue 组件，点「查看源码」即可核对实现。

**🧭 自动侧边栏**
侧边栏按 `代码/` 目录实时生成；新增、删除、移动 Markdown 后无需手写导航。

**🚀 一次推送，自动发布**
`master` 分支更新后由 GitHub Actions 构建，静态托管到 GitHub Pages，零服务器成本。

</div>

## 内容怎么组织

站点内容全部来自仓库里的 Markdown，不做二次搬运：

| 目录 | 说明 |
| --- | --- |
| `代码/前端` | 浏览器、客户端 App、小程序与前端工程化 |
| `代码/后端` | 服务端进程、数据库与接口 |
| `代码/ai` | Agent 规范与 AI 工具链 |
| `代码/工具` | 开发机上的工具与命令行 |
| `代码/系统与运维` | 服务器、系统、容器与部署 |
| `代码/资源` | 字体、图标、协议等素材 |

> 新增文档时，在对应分类目录下创建 `.md` 文件并加一级标题即可；提交后站点会自动收录。完整流程见[搭建与部署指南](/代码/前端/工程化/vitepress/文档站搭建与部署指南)。

需要按目录树浏览全部文件？打开[全库索引](/README.md)。


<a class="vp-raw" href="../">← 返回站点选择</a>
