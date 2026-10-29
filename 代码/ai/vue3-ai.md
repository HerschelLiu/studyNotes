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

* `vue-best-practices`：Vue 3 最佳实践
* `vue-router-best-practices`：路由开发规范
* `vue-pinia-best-practices`：Pinia 状态管理
* `vue-testing-best-practices`：组件与 E2E 测试
* `vue-jsx-best-practices`：JSX 开发
* `vue-options-api-best-practices`：Options API 开发
* `vue-debug-guides`：Vue 问题排查
* `create-adaptable-composable`：可复用 Composable 开发

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

