# ai

> Agent 协作规范与 AI 辅助开发笔记。本目录下的 `AGENTS.md` 会被 Agent 按路径自动加载，**不要改名或移动**。

## 目录

| 文件 | 内容 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | L1 入口：硬约束 6 条、必须停下询问的 6 种情况、Skill 前缀模板、交付检查清单 |
| [docs/agent/vue-conventions.md](docs/agent/vue-conventions.md) | L2 通用 Vue 规范：目录约定、TS 约束、自动导入、页面范式、数据层、Git 规范、陷阱全表 |
| [docs/agent/minyi-vue3.md](docs/agent/minyi-vue3.md) | L3 项目落地手册：技术栈、目录结构、组件 API、hooks 速查、queryKeys、权限 |
| [agent.md](agent.md) | Agent / LLM 原理笔记：提示词、工具调用、上下文管理 |
| [vue3-ai.md](vue3-ai.md) | Vue3 项目里接 AI 的实践 |
| [dsh可安装的插件.md](dsh可安装的插件.md) | DeepSeek Harness（DSH）插件清单与安装方式 |
| [_backup/](_backup/) | 重构前的 AGENTS.md 备份，仅留档，不再维护 |

## 约定

- 三层规范按需读取：L1 必读，做 Vue 代码前读 L2，改本项目页面/组件/hook 前读 L3。
- 新增规则放进对应层，L1 只放「硬约束」级条目。
- 冲突优先级：用户当轮指令 > 第 1 节硬约束 > 本文件其余条款 > L2 / L3。
