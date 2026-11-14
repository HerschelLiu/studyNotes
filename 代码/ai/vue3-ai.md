# vue3-ai

[vuejs-ai/skills](https://github.com/vuejs-ai/skills)

安装

```bash
npx skills add vuejs-ai/skills -g
```

-g全局安装，不带是当前项目

`vuejs-ai/skills` 是一套专门为 **Vue 3 AI 编程**打造的 Skills。

简单来说，就是给 `Codex`、`Claude Code` 等 AI 编程工具补上一套 **Vue 开发最佳实践**。

让 AI 写代码时遵循更加合理的组件设计、响应式和状态管理规范。

目前项目提供 **8 个 Skills**：

| Skill                          | 适合什么任务                                                 |
| ------------------------------ | ------------------------------------------------------------ |
| vue-best-practices             | 用 Vue 3、Composition API 和 TypeScript 开发，涵盖常见坑、SSR 与性能方面的指导。 |
| vue-options-api-best-practices | 维护使用 `data()`、`methods` 的 Options API 项目，处理 `this`、生命周期及 TypeScript 配合使用的问题。 |
| vue-router-best-practices      | 使用 Vue Router 4，处理导航守卫、路由参数，以及路由和组件生命周期的关系。 |
| vue-pinia-best-practices       | 使用 Pinia 管理状态，涉及 Store 的组织、响应式和状态管理写法。 |
| vue-testing-best-practices     | 编写组件测试和端到端测试，覆盖 Vitest、Vue Test Utils 与 Playwright。 |
| vue-jsx-best-practices         | 在 Vue 中写 JSX，注意它与 React JSX 的语法差异。             |
| vue-debug-guides               | 排查 Vue 3 的运行时错误、警告、异步错误，以及服务端渲染后的水合问题。 |
| create-adaptable-composable    | 编写可复用的组合式函数，通过 `MaybeRef`、`MaybeRefOrGetter` 等类型，让参数能接收普通值或响应式输入。 |

验证哪个agent应用了

```bash
ls ~/.trae-cn/skills | grep vue
# 期望 8 个：vue-best-practices、vue-debug-guides、create-adaptable-composable ...

skills list -g | grep -A1 vue
# 每个技能的 "Agents:" 行里应该出现 Trae CN

# 单独查看
skills list [Codex/trae-cn/...] | grep -A1 vue
```

为具体agent安装

```bash
skills add vuejs-ai/skills -g -a trae-cn -y
```

作者建议在提示词前面加上 `use vue skill`。只靠 AI 根据任务描述自行触发，效果可能不稳定，明确说出来更省事。
