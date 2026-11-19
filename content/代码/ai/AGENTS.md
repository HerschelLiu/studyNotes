---
title: "AGENTS.md — Vue 3 项目代理规范（唯一入口）"
---

> 本规范分三层，按需读取（路径均相对本文件所在目录）：
>
> | 层   | 文件                             | 何时读                                                          |
> | ---- | -------------------------------- | --------------------------------------------------------------- |
> | L1   | `AGENTS.md`（本文件）            | 每次会话自动加载，必须遵守                                      |
> | L2   | `docs/agent/vue-conventions.md`  | **做任何 Vue 代码任务前必读**：通用细则 + 陷阱全表              |
> | L3   | `docs/agent/minyi-vue3.md`       | **改本项目页面 / 组件 / hook 前必读**：组件 API、hooks 速查、样例 |
>
> 跳过 L2 或 L3 直接写代码，视为违反第 1 节。只读文件、不写代码的任务不受此约束。
>
> 本文件需与各 Agent 通用配置（`CLAUDE.md` / `.cursor/rules` / `.trae/rules` / MCP 配置等）**联合使用**，不可只依赖其中一份。

---

## 0. 冲突时的优先级

1. 用户当轮的明确指令
2. 第 1 节硬约束
3. 本文件其余条款
4. L2 / L3 细则
5. 其他 Agent 配置里的样式性建议

- 用户指令与第 1 节冲突：**按用户执行**，并在回复中说明偏离了哪一条。
- 第 1 节与其他 Agent 配置的强制项冲突：**停下来问用户**，不自行取舍。
- 其他配置里的强制项同样生效，不得以「本文件没写」为由忽略。
- 拿不准属于哪一级时，按更高一级（更严格）处理。

## 1. 硬约束（6 条，优先于其余一切）

### 1.1 复用优先：hooks / npm / 公共组件

- 生成页面或功能前，**先检索**：项目组件目录、hooks 目录、`package.json` 已有依赖、已有相似页面。
- 已有封装能覆盖需求时**必须复用**，禁止重复实现（自写分页、自写搜索区、自写请求封装、自写弹窗等）。
- 优先级：**项目公共组件 / hooks > 已安装 npm 包 > Element Plus 原生 > 自写**。
- 需要新增依赖时先说明理由并征得同意，优先使用项目已安装的版本。

### 1.2 组件优先使用项目封装

- 页面使用的组件，优先从项目组件目录（约定 `src/components`，以实际目录为准）导入。
- 禁止用裸 `el-table` / `el-dialog` / `el-drawer` / `el-upload` 重写项目已封装的能力。
- 页面级私有组件放同级 `components/`；可复用能力是否上提到项目组件目录，按以下判据（满足 2 条即可上提）：
  1. 已被或即将被 **≥2 处** 使用；
  2. 组件内部有状态（显隐、分页、选中、校验）；
  3. 需要统一交互或样式（否则各处会写得不一致）。

### 1.3 相似封装必须先询问

- 同一能力存在**多个相似封装**时（表格封装、搜索区封装、弹窗封装、上传封装、金额输入封装等），**必须先列出候选并询问用户使用哪一个**。
- 禁止自行挑选、禁止同时保留两套逻辑、禁止另写新封装。
- 询问时给出：候选名称、适用场景、差异点，并标注推荐项。

### 1.4 禁止基础类型转换

- **禁止**用 `String(x) === String(y)`、`Number(x) === Number(y)`、`!!x`、`as any` 等方式强行对齐类型。
- 类型应由 TypeScript 约束：接口类型从 API 定义派生；枚举保持声明值类型，`'1'` 与 `1` 不互相转换。
- 典型后果：`el-select` 的 `v-model` 与 `el-option` 的 `value` 类型不一致（一边 `string` 一边 `number`），**回显时匹配不到选项，界面不显示所选 label**。
- 正确做法：在**数据源层**统一类型（API、枚举、字典），模板与比较处不做转换；确需归一化时集中到请求/响应适配层并注释原因。

```ts
// ❌ 禁止：比较时强转
String(item._value) === String(props.sourceData?.yearId)

// ✅ 正确：类型本身一致（统一为 number 或统一为 string）
item._value === props.sourceData?.yearId
```

### 1.5 必须使用 Skill

- 所有 Vue 代码生成任务**必须加载并使用对应 Skill**，至少包括 `vue-best-practices`；按场景追加：

  | 场景          | Skill                        |
  | ------------- | ---------------------------- |
  | VueUse / 组合式工具 | `vueuse-functions`     |
  | 路由          | `vue-router-best-practices`  |
  | Pinia         | `vue-pinia-best-practices`   |
  | 测试          | `vue-testing-best-practices` |
  | 排错          | `vue-debug-guides`           |

- 其他领域任务按会话可用 Skill 清单加载（文档、数据、设计等）。
- **回复末尾必须用一行列出本次使用的 Skill 及用途**；未使用则写「本次未使用 Skill」。
- Skill 触发依赖 prompt 与 Skill 描述的关键词匹配，仅靠本文件的「必须」**不保证触发**，因此任务开头必须带前缀（模板见第 6 节）。
- 派发子代理时，**子代理 prompt 同样要以前缀开头**，并在结尾要求其回报使用的 Skill。
- 注意：Skill 清单里**没有**名为 `vue` 的条目，实际为 `vue-best-practices` 等；点名具体 Skill 比笼统的 `use vue skill` 更可靠。

### 1.6 多 Agent 配置联合使用

各类 Agent（Trae / Codex / Claude Code / Cursor 等）在本仓库工作时，必须**同时**参考：

1. 本文件（L1）与 L2 / L3
2. 各家通用配置：`CLAUDE.md`、`.cursor/rules`、`.trae/rules`、`~/.codex/AGENTS.md` 等（存在即读）
3. 项目 MCP 配置：`.mcp.json`、`mcp.json`、客户端 MCP 设置等

约定：

- 通用规则以本文件为准；其他配置中的强制项同样生效，不得忽略。
- 配置冲突时**停下来询问用户**，不得自行取舍。
- 优先使用 MCP 提供的工具，不要绕过 MCP 手写等价逻辑。

## 2. 必须停下来问用户的 6 种情况

| # | 情况                                        | 依据  | 怎么问                                                   |
| - | ------------------------------------------- | ----- | -------------------------------------------------------- |
| 1 | 同一能力有多个相似封装                       | 1.3   | 列候选 + 适用场景 + 差异 + 推荐项                        |
| 2 | 需要新增 npm 依赖                            | 1.1   | 说明为何现有依赖不够、体积/维护成本、替代方案            |
| 3 | 项目已有自实现与第三方内置能力重叠           | L2 §10 | 删除 / 保留 / 改造，三选一并说明影响                    |
| 4 | 需要偏离硬约束（`as any`、`@ts-ignore`、改 `tsconfig`、改 `.d.ts`、绕过 MCP） | 1.4 / 1.6 / L2 §2 | 说明原因与范围，等确认后再写 |
| 5 | 本文件与用户指令 / 其他 Agent 配置冲突       | 第 0 节 | 列出冲突条目，让用户裁决                                |
| 6 | 功能确实没有可用封装，需要新写                | 第 4 节第 4 步 | 「项目没有 X，建议新增/引入 Y」+ 落点目录        |

- 一次问清，不要边做边问；问完再动手，不要先写完再补问。
- 用户明确说「你决定」时，按第 0 节优先级自行裁决，并在回复中说明依据。

## 3. 技术前提

- 默认前提：Vue 3 + TypeScript + Vite + Element Plus，**以项目 `package.json` 为准**（本项目版本见 L3）。
- 必须使用 **Composition API + `<script setup lang="ts">`**，禁止 Options API（除非项目明确要求）。
- 状态管理用 Pinia，路由用 Vue Router 4，服务端状态推荐 TanStack Query（按项目实际）。
- 包管理器统一 **npm**，不混用 pnpm / yarn；命令以 `package.json` 的 scripts 为准。

## 4. 实现流程

新增或修改页面时按序执行，顺序不可跳过：

1. **读文档**：L2 必读；改本项目代码再读 L3。
2. **检索**：项目组件目录、hooks、`package.json`、已有相似页面。
3. **判重**：存在多个相似封装 → 先询问用户（第 2 节 #1）。
4. **补缺口**：确实不存在时，说明「项目没有 X，建议新增/引入 Y」，得到确认后再写（第 2 节 #2 / #6）。
5. **实现**：优先复用；遵循 L2 页面范式与 L3 项目骨架。
6. **校验**：零 TS 诊断（见第 5 节），必要时构建验证。
7. **报告**：说明复用了哪些组件 / hooks / npm 包，以及使用的 Skill 清单。

## 5. 验证与提交前自检

- **类型检查**：`npx vue-tsc --noEmit`（项目无独立 typecheck 脚本，`vue-tsc` 已随依赖安装）。改完 `.ts` / `.vue` 必须零诊断错误。
- **不要用 `npm run build:prod` 代替类型检查**：构建慢且会掩盖首个诊断的上下文。
- **自检顺序**：typecheck → 手验关键交互（回显、分页、校验、权限按钮）→ 必要时构建。
- **提交信息**：`<type>: [<模块名>]<描述>`，规则与 type 表见 L2 §8。
- **交付前**：过一遍第 8 节检查清单。

## 6. Skill 前缀与任务模板

> **为什么固化**：Skill 的加载由模型按 prompt 与 Skill 描述的关键词匹配决定，本文件的「必须」只是要求，不是触发器。参考 [vuejs-ai/skills](https://github.com/vuejs-ai/skills)：*Without the prefix, skill triggering may be inconsistent depending on how closely your prompt matches the skill's description keywords*。因此所有 Vue 代码任务统一用下列模板开头。

**统一前缀**：`Use vue-best-practices skill, <任务描述>`。按需在括号内追加：`vueuse-functions` / `vue-router-best-practices` / `vue-pinia-best-practices` / `vue-testing-best-practices` / `vue-debug-guides`。

### 6.1 新增页面

```text
Use vue-best-practices skill (and vueuse-functions if needed), 按 AGENTS.md 约定新增 <模块>/<页面> 页面：<布局类型：列表 / 详情 / 树+表单>。先读 docs/agent/vue-conventions.md 与 docs/agent/minyi-vue3.md；先检索项目已有组件、hooks 与 npm 包；存在相似封装时先询问用哪个；字段类型从 @/api/<模块> 派生，不引入基础类型转换。
```

### 6.2 修改 / 迭代页面

```text
Use vue-best-practices skill, 修改 <文件路径>：<需求>。先读 docs/agent/vue-conventions.md 与 docs/agent/minyi-vue3.md；先检索并复用项目已有组件与 hooks，相似封装先询问；不要引入基础类型转换。
```

### 6.3 编写组件 / Hook

```text
Use vue-best-practices skill (and vueuse-functions if needed), 新增 <组件|hook 名>，放在 <目录>。优先复用现有封装与 npm 包；若与已有封装重叠，先说明并询问。
```

### 6.4 排查问题

```text
Use vue-debug-guides skill, 排查 <现象>。复现路径：<步骤>。先读 <相关文件>，给出根因与最小修复方案。
```

### 6.5 派发子代理

```text
Use vue-best-practices skill, <子任务>。<背景与约束>。完成后报告使用的 Skill。
```

**使用约定**：

- 前缀只在**任务开头**写一次；同一任务的追问无需重复。
- 新会话、上下文被压缩后、派发子代理时，必须重新带上。
- 结尾要求代理回报 Skill 清单（与 1.5 呼应）。
- 只做文档 / 配置、不写 Vue 代码时可省略前缀。

## 7. 高频陷阱（先看这 13 条，全集见 L2 §9）

- `v-model` 禁用 `?.`；禁用态组件用 `:model-value`。
- `el-table` 的 `:max-height` 用 `||` 不用 `??`。
- `v-loading` 只能挂原生元素或带根元素的 EP 组件，不可挂 Teleport / Fragment。
- `el-drawer` 结构：`flex column > header(fixed) + content(flex:1, overflow-y:auto)`。
- `el-drawer` 样式必须放非 scoped 全局块，用唯一 class 定位 Teleport 元素。
- `el-scrollbar` 在 flex 布局用 `flex:1; min-height:0`。
- 存入响应式数组的组件用 `shallowRef`。
- 弹窗状态初始化时声明，不动态加 key。
- API 必须 `await` 完成后再重置表单。
- query key 含动态值必须 `computed` 包裹；`enabled` 必须 `computed`。
- Vue 默认 slot 用函数形式（`() => text`）。
- `ElButton.type` 使用 `ButtonType`（from `element-plus`）。
- 枚举 / 字典 / `el-select` 的 `value` 类型保持一致，不做 `String()` / `Number()` 对齐（见 1.4）。

## 8. 交付检查清单

- [ ] 已读 L2（Vue 任务）／已读 L3（本项目任务）
- [ ] 已检索并复用项目组件 / hooks / npm 包
- [ ] 相似封装已询问用户并确认
- [ ] 无基础类型转换，无 `as any` / `@ts-ignore`
- [ ] 零 TS 诊断（`npx vue-tsc --noEmit`）
- [ ] 已使用对应 Skill，并在回复末尾列出
- [ ] QueryKey 已注册，接口类型从 `@/api` 派生
- [ ] 已参考其他 Agent / MCP 配置，无未裁决的冲突

## 9. 文档索引

| 文件                            | 内容                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `docs/agent/vue-conventions.md` | 目录约定、TypeScript 约束、自动导入与别名、Import 顺序、页面架构范式、数据层、代码风格、Git 规范、陷阱全表（20 条）、第三方组件兼容 |
| `docs/agent/minyi-vue3.md`      | 技术栈与命令、目录结构、自动导入清单、页面样例代码、组件 API、hooks 速查、queryKeys、枚举、权限、截图还原规则、项目专属陷阱 |

- 新增规则时放进对应层，不要在 L1 里堆细则；L1 只增删「硬约束」级的条目。
- 三层内容冲突时以 L1 为准；L2 / L3 之间冲突时以 L2 为准（通用约束优先于项目便利）。
