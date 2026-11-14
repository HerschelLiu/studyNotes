# AGENTS.md — 通用项目代理指南

> **使用说明**
>
> 本文件分为两部分，请按顺序阅读：
>
> 1. **第一部分 · 通用规则**：与具体项目解耦，可直接复制到任意 Vue 3 + TypeScript + Element Plus 项目。
> 2. **第二部分 · 附录：本项目示例**：minyi_vue3 的实际路径、组件、hooks 与样例代码，仅作落地参考；迁移到其他项目时整段替换或删除。
>
> 两部分冲突时，**以第一部分为准**。本文件需与各 Agent 的通用配置（`CLAUDE.md` / `.cursor/rules` / `.trae/rules` / MCP 配置等）**联合使用**，不可只依赖其中一份。

---

# 第一部分 · 通用规则

## 1. 最高优先级原则（硬约束）

以下 6 条优先于本文件其余所有约定。

### 1.1 复用优先：hooks / npm / 公共组件

- 生成页面或功能前，**先检索**：项目组件目录、hooks 目录、`package.json` 已有依赖、已有相似页面。
- 已有封装能覆盖需求时**必须复用**，禁止重复实现（自写分页、自写搜索区、自写请求封装、自写弹窗等）。
- 优先级：**项目公共组件 / hooks > 已安装 npm 包 > Element Plus 原生 > 自写**。
- 需要新增依赖时先说明理由，优先使用项目已安装的版本。

### 1.2 组件优先使用项目封装

- 页面使用的组件，优先从项目组件目录（约定 `src/components`，以实际目录为准）导入。
- 禁止用裸 `el-table` / `el-dialog` / `el-drawer` / `el-upload` 重写项目已封装的能力。
- 页面级私有组件放同级 `components/`，可复用能力上提到项目组件目录。

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
  - VueUse → `vueuse-functions`
  - 路由 → `vue-router-best-practices`
  - Pinia → `vue-pinia-best-practices`
  - 测试 → `vue-testing-best-practices`
  - 排错 → `vue-debug-guides`
- 其他领域任务按会话可用 Skill 清单加载（文档、数据、设计等）。
- **任务结束后必须在回复末尾列出本次使用的 Skill 及用途**；未使用则写明「本次未使用 Skill」。
- **显式触发前缀（关键）**：Skill 触发依赖 prompt 与 Skill 描述的关键词匹配，仅靠本文件的「必须」**不保证触发**。所有 Vue 代码任务的标准写法：

  ```text
  Use vue-best-practices skill, <任务描述>
  ```

  需要追加能力时写在括号里（如 `Use vue-best-practices skill (and vueuse-functions if needed), ...`）；完整模板见第 15 节。
- 派发子代理时，**子代理 prompt 同样要以前缀开头**，并在结尾要求其报告使用的 Skill。
- 注：DSH 技能清单中没有名为 `vue` 的条目，实际为 `vue-best-practices` 等；点名具体 Skill 比笼统的 `use vue skill` 更稳。

### 1.6 多 Agent 配置联合使用

各类 Agent（Trae / Codex / Claude Code / Cursor 等）在本仓库工作时，必须**同时**参考：

1. 项目根目录 `AGENTS.md`（本文件）
2. 各家通用 Agent 配置：`CLAUDE.md`、`.cursor/rules`、`.trae/rules`、`~/.codex/AGENTS.md` 等（存在即读）
3. 项目 MCP 配置：`.mcp.json`、`mcp.json`、客户端 MCP 设置等

约定：

- 通用规则以本文件为准；其他配置中的强制项同样生效，不得忽略。
- 配置冲突时**停下来询问用户**，不得自行取舍。
- 优先使用 MCP 提供的工具，不要绕过 MCP 手写等价逻辑。

## 2. 技术前提

- 默认前提：Vue 3 + TypeScript + Vite + Element Plus，以项目 `package.json` 为准。
- 必须使用 **Composition API + `<script setup lang="ts">`**，禁止 Options API（除非项目明确要求）。
- 状态管理用 Pinia，路由用 Vue Router 4，服务端状态推荐 TanStack Query（按项目实际）。
- 命令以 `package.json` 的 scripts 为准；修改 `.ts` / `.vue` 后必须保证无 TS 诊断错误。

## 3. 目录约定

```text
src/
├── api/          # 接口与类型定义
├── components/   # 公共组件
├── hooks/        # 组合式函数
├── utils/        # 工具函数
├── constants/    # 常量（query key 等）
├── enum/         # 枚举
├── store/        # Pinia
├── router/       # 路由
├── types/        # 全局类型
└── views/        # 页面
```

- 以项目实际目录为准；新增文件放入语义最接近的目录，不随意新增顶层目录。

## 4. TypeScript 约束

- 不修改 `tsconfig.json` 的 `types` / `include`（除非用户明确要求）。
- 禁止修改任何 `.d.ts`；`global.d.ts` 用 interface 扩展，不得完全覆盖。
- 接口类型从 `@/api/<模块>/index.ts` 派生，禁止自造字段；DTO 缺字段用 `Pick` 派生。
- 枚举是名义类型，不同枚举即使值相同也不可互相赋值。
- 禁止 `as any` / `@ts-ignore` 兜底；确需使用时注释原因并告知用户。
- **禁止基础类型转换**（见 1.4）。

## 5. 自动导入与路径别名

- 若项目配置了 `unplugin-auto-import`：已注册的 API **不要手动 import**，以 `auto-imports.d.ts` 与实际配置为准。
- 未注册的必须显式 import。
- 路径别名统一 `@` → `src/`；统一用 `@/...`，不用 `../`（页面内私有组件除外）。

## 6. Import 顺序

`<script setup>` 中的 import 按以下顺序分组，组与组之间用空行分隔：

1. `import type` 块
2. 非组件 import（hooks / api / utils / enum / store）
3. 组件 import：**公共组件在前，本文件相关组件在后**

```ts
import type { XxxOptions } from '@/components/Xxx/types'
import type { RequestListXxx, ResponseListXxx } from '@/api/xxx'

import { listXxx } from '@/api/xxx'
import { useModal } from '@/hooks/useModal'

import CompTable from '@/components/CompTable/index.vue'
import TheSearch from './components/search.vue'
```

## 7. 页面/功能实现流程

新增或修改页面时按序执行：

1. **检索**：项目组件目录、hooks、`package.json`、已有相似页面。
2. **判重**：存在多个相似封装 → 先询问用户（见 1.3）。
3. **缺口**：确实不存在时，说明「项目没有 X，建议新增/引入 Y」，得到确认后再写。
4. **实现**：优先复用；遵循项目页面范式（见第 8 节）。
5. **校验**：无 TS 错误，必要时构建验证。
6. **报告**：说明复用了哪些组件 / hooks / npm 包，以及使用的 Skill 清单。

## 8. 页面架构范式

以「列表页 + 表单/详情」为主，骨架与项目保持一致；具体组件名见附录。

- **列表页**：搜索区 + 表格 + 分页 + 详情抽屉/弹窗。
  - 表格 / 搜索区 / 分页优先使用项目封装组件。
  - 列配置优先使用内置格式化（金额、枚举、日期），仅复杂交互用插槽。
  - 操作列固定右侧；批量操作使用项目跨页选择方案。
  - 列表查询使用项目列表 hook，不直接裸用 `useQuery`。
- **表单/详情**：抽屉或对话框 + `el-form`。
  - 校验规则使用项目校验 hook。
  - 提交统一走项目提交 hook（自动校验、loading、成功后失效查询）。
  - 关闭时重置表单；API 完成后才重置。
- **树 + 表单**：左侧树、右侧表单；编辑态禁止切换节点。
- 权限按钮使用项目权限指令，权限标识集中在页面同级 `permission.ts`。

## 9. 数据层约定

- Query Key 集中注册（如 `src/constants/queryKeys.ts`），禁止散落字符串。
- 动态 key 用 `computed` 包裹；`enabled` 用 `computed`。
- 同一组件多个查询使用不同 namespace，避免缓存污染。
- 提交成功后通过统一失效机制刷新，不手动调列表方法。
- 请求参数清理使用项目工具函数（移除空值等），不手写。
- 枚举、字典、`el-select` 的 `value` 类型必须一致（见 1.4）。

## 10. 代码风格

- 事件处理函数 `handleXxx` 前缀。
- 函数定义 `const fn = () => {}`。
- 解构 props：`const { x } = props`。
- 优先可选链、数组方法、模板字符串、提前返回。
- `interface` 定义对象类型，`type` 定义别名。
- `v-model` 禁用可选链 `?.`，改用 `:model-value` 单向绑定。
- 遵循项目既有命名与目录风格，不引入新的风格约定。

## 11. Git 提交规范

格式：`<type>: [<模块名>]<描述>`，描述不以句号结尾。

| type     | 说明            |
| -------- | --------------- |
| feat     | 新功能          |
| fix      | 修补 bug        |
| docs     | 文档            |
| style    | 格式            |
| refactor | 重构            |
| test     | 测试            |
| chore    | 构建/辅助       |

如项目无模块概念，可省略 `[模块名]`。

## 12. 常见陷阱（通用）

- `v-model` 禁用 `?.`；禁用态组件用 `:model-value`。
- `el-table` 的 `:max-height` 用 `||` 不用 `??`。
- `v-loading` 只能挂原生元素或带根元素的 EP 组件，不可挂 Teleport / Fragment。
- `el-drawer` 样式放非 scoped 全局块，用唯一 class 定位 Teleport 元素。
- `el-drawer` 结构：`flex column > header(fixed) + content(flex:1, overflow-y:auto)`。
- `el-scrollbar` 在 flex 布局用 `flex:1; min-height:0`。
- 存入响应式数组的组件用 `shallowRef`。
- 弹窗状态不动态加 key，初始化时声明。
- `confirmTitle` 引用响应式状态时使用函数形式。
- API 必须 `await` 完成后再重置表单。
- Vue 默认 slot 用函数形式（`() => text`）。
- `ElButton.type` 使用 `ButtonType`（from `element-plus`）。
- 枚举 / 字典绑定保持类型一致（见 1.4）。

## 13. 第三方组件能力与兼容

**内置能力优先**：npm 组件已实现的能力（下载 / 导出 / 打印工具栏、排序、分页等）直接使用，不重复实现。

若项目中已有与内置能力重叠的自实现，**先询问用户**（删除 / 保留 / 改造）。

**兼容问题处理顺序**：

1. 官方方案：文档配置项、升级版本、官方 issue。
2. 流行方案：成熟 npm 包或社区方案。
3. AI 补丁：前两者都不存在时才写，并在注释中说明原因。

## 14. 交付检查清单

- [ ] 已检索并复用项目组件 / hooks / npm 包
- [ ] 相似封装已询问用户并确认
- [ ] 无基础类型转换（`String()` / `Number()` / `as any`）
- [ ] 无 TS 诊断错误
- [ ] 已使用对应 Skill，并在回复末尾列出
- [ ] 任务以 `Use vue-best-practices skill, ...` 前缀开头
- [ ] 已参考项目 AGENTS.md 与各 Agent / MCP 配置

## 15. 任务模板（提示词前缀）

> **为什么固化**：Skill 的加载由模型按 prompt 与 Skill 描述的关键词匹配决定，`AGENTS.md` 的「必须」只是要求，不是触发器。参考 [vuejs-ai/skills](https://github.com/vuejs-ai/skills)：*Without the prefix, skill triggering may be inconsistent depending on how closely your prompt matches the skill's description keywords*。因此所有 Vue 代码任务统一用下列模板开头。

**统一前缀**：`Use vue skill, <任务描述>`。按需追加：`vueuse-functions` / `vue-router-best-practices` / `vue-pinia-best-practices` / `vue-testing-best-practices` / `vue-debug-guides`。

### 15.1 新增页面

```text
Use vue-best-practices skill (and vueuse-functions if needed), 按 AGENTS.md 约定新增 <模块>/<页面> 页面：<布局类型：列表 / 详情 / 树+表单>。先检索项目已有组件、hooks 与 npm 包；存在相似封装时先询问用哪个；字段类型从 @/api/<模块> 派生，不引入基础类型转换。
```

### 15.2 修改 / 迭代页面

```text
Use vue-best-practices skill, 修改 <文件路径>：<需求>。先检索并复用项目已有组件与 hooks，相似封装先询问；不要引入基础类型转换。
```

### 15.3 编写组件 / Hook

```text
Use vue-best-practices skill (and vueuse-functions if needed), 新增 <组件|hook 名>，放在 <目录>。优先复用现有封装与 npm 包；若与已有封装重叠，先说明并询问。
```

### 15.4 排查问题

```text
Use vue-debug-guides skill, 排查 <现象>。复现路径：<步骤>。先读 <相关文件>，给出根因与最小修复方案。
```

### 15.5 派发子代理

```text
Use vue-best-practices skill, <子任务>。<背景与约束>。完成后报告使用的 Skill。
```

**使用约定**：

- 前缀只在**任务开头**写一次；同一任务的追问无需重复。
- 新会话、上下文被压缩后、派发子代理时，必须重新带上。
- 结尾要求代理报告 Skill 清单（与 1.5 呼应）。
- 只做文档 / 配置、不写 Vue 代码时可省略前缀。

---

# 第二部分 · 附录：本项目示例（minyi_vue3）

> 以下为 minyi_vue3 的实际实现细节（路径、组件名、hooks 签名、样例代码），仅作落地参考。
> 迁移到其他项目时，整段替换或删除；与第一部分冲突时，以第一部分为准。

## A.1 项目概述

- **项目名**：minyi_vue3（基于若依 RuoYi-Vue 二次开发）
- **业务领域**：医院 HRGP 全面预算 / 会计平台 / 人力资源 等管理系统
- **技术栈**：
  - Vue 3.5.26 + TypeScript 5.6.3 + Vite 6.4.1
  - Element Plus 2.13.1 + `@element-plus/icons-vue`
  - Pinia 2.2.8 + Vue Router 4.4.5
  - `@tanstack/vue-query` 5.x（列表/详情/缓存核心）
  - `unplugin-auto-import` 0.18.6（自动导入）
  - `@vueuse/core` 14.x、`nanoid`、`validing`、`vform3-builds`、`echarts`、`bpmn-js`
  - Sass 样式

## A.2 常用命令

```bash
npm run dev          # 开发环境启动
npm run build:prod   # 生产环境构建（--max-old-space-size=4096）
npm run build:stage # 预发布构建
npm run preview      # 预览构建产物
```

类型检查无独立脚本，构建时由 `vue-tsc` 隐式校验。**修改 `.ts`/`.vue` 后必须保证无 TS 诊断错误**。

## A.3 目录结构

```
src/
├── api/                # 接口定义（按业务模块组织，含类型与请求函数）
├── assets/             # 静态资源
├── components/         # 通用组件（CompTable / CommonSearchItem / Drawer / Price ...）
├── constants/          # 常量（queryKeys 统一管理 TanStack Query key）
├── directive/          # 自定义指令（hasPermi 权限指令）
├── enum/                # 枚举（acct.ts / budget.ts / flowable.ts ...）
├── hooks/              # 组合式函数（useList / useSubmit / useRules / useTable ...）
├── plugins/            # 插件注册（auth 权限校验）
├── router/             # 路由配置
├── store/              # Pinia store
├── types/              # 全局类型声明
├── utils/              # 工具函数（request axios 封装 / dict / ruoyi）
├── views/              # 业务页面
│   ├── masterBudget/   # 总预算模块
│   ├── financialManagement/  # 财务管理（会计制度等）
│   ├── acctPlatform/   # 会计平台
│   └── humanResource/  # 人力资源
└── permission.ts       # 路由守卫（token + 动态路由）
```

## A.4 核心约定

### A.4.1 自动导入（关键）

`vite/plugins/auto-import.ts` 已配置以下自动导入，**不要手动 `import`**：

- `vue`（`ref` / `computed` / `watch` / `reactive` / `defineComponent` / `h` / `nextTick` / `unref` / `toValue` / `useTemplateRef` ...）
- `vue-router`（`useRoute` / `useRouter`）
- `pinia`
- `@tanstack/vue-query`：`useQuery` / `useMutation` / `useQueryClient` / `useQueries`
- `@/utils/dict`：`useDict`
- `@/utils/ruoyi`：`selectDictLabel`
- `@/hooks/useList`：`useListQuery` / `useListAdaptor`
- `@/hooks/useSubmit`：`useSubmit`
- `@/store/modules/budget`：`useBudgetStore`
- `@/store/modules/basicPlatform`：`useBasicPlatformStore`
- `@/store/modules/project`：`useProjectStore`
- `@/store/modules/flowable`：`useFlowableStore`
- `@/constants/queryKeys`：`queryKeys`

其他函数需手动导入（如 `useRules` / `useTableForm` / `useCheckAll` / `useModal` / `useFlowable` / `useFormAttachment` / `useTempRefs` / `useObject` 工具集 / `useTip` 等）。

### A.4.2 路径别名

`@` → `src/`（见 `tsconfig.json` 与 `vite.config.ts`）。**统一使用 `@/...`，不要用相对路径 `../`**。

### A.4.3 TypeScript 约束

- `tsconfig.json` 的 `types` 必须为 `['vite/client', 'vue', 'element-plus/global']`
- **禁止修改任何 `.d.ts` 文件**
- `global.d.ts` 必须用 interface 扩展 Vue/axios，不得完全覆盖
- 接口类型从 `@/api/<模块>/index.ts` 派生，**禁止自造字段**；后端 DTO 缺字段则 `Pick` 派生
- 枚举是名义类型，不同枚举即使值相同也不可互相赋值

### A.4.4 环境变量

使用 `import.meta.env.VITE_XXX`，**禁止使用 `process.env`**。

### A.4.5 Import 顺序约定

`<script setup>` 中的 import 必须按以下顺序分组，**组与组之间用空行分隔**：

1. **`import type` 块**（类型导入，永远在最上层）
2. **其他 import 块**（hooks / api / utils / enum 等非组件导入）
3. **组件 import 块**（最下层）：
   - **公共通用组件在前**（如 `@/components/CompTable/index.vue`、`@/components/Drawer/index.vue`）
   - **本文件相关组件在后**（如 `./components/search.vue`、`./components/details.vue`）

示例：

```ts
import type { TableColumn } from '@/components/CompTable/types'
import type { RequestListXxx, ResponseListXxx } from '@/api/xxx'

import { deleteXxx, listXxx } from '@/api/xxx'
import { useModal } from '@/hooks/useModal'
import { useCheckAll } from '@/hooks/useCheckAll'

import CompTable from '@/components/CompTable/index.vue'
import TheSearch from './components/search.vue'
import TheDetails from './components/details.vue'
```

参考实现：[src/components/CompForm/CompForm.vue#L2-4](file:///Users/herschel/Work/上海敏译/minyi_vue3/src/components/CompForm/CompForm.vue#L2-4)。

## A.5 页面架构模式

新增/修改页面必须遵循以下骨架。**首选参照模板**：

- 列表页：`src/views/masterBudget/budgetExec/expBudgetExec/index.vue`
- 详情抽屉：`src/views/masterBudget/budgetExec/expBudgetExec/components/details.vue`
- 搜索组件：`src/views/masterBudget/budgetExec/expBudgetExec/components/search.vue`
- 树+表单：`src/views/financialManagement/acctRegime/index.vue`

### A.5.1 列表页 `index.vue`

```vue
<template>
  <div class="app-container">
    <TheSearch
      v-if="showSearch"
      v-model="list.query"
      :loading="list.loading"
      @search="getList" />

    <CompTable
      v-model:list="list"
      v-model:selected="selected"
      v-model:show-search="showSearch"
      :keys="keys"
      storage-key="masterBudget:xxx:columns"
      @query-table="getList">
      <template #toolbar>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button size="small" type="danger" :disabled="!selected.length" @click="handleDelete">删除</el-button>
          </el-col>
        </el-row>
      </template>
      <CompTableColumn prop="code">
        <template #default="{ row }">
          <el-button size="small" type="primary" text @click="handleDetails(row)">
            {{ useFormatValue(row.code) }}
          </el-button>
        </template>
      </CompTableColumn>
    </CompTable>

    <pagination
      v-show="list.total > 0"
      :total="list.total"
      v-model:page="list.query.pageNum"
      v-model:limit="list.query.pageSize"
      @pagination="getList" />

    <TheDetails v-model="modalList.showDetails" :data="selectedDetails" />
  </div>
</template>

<script lang="ts" setup>
  import type { RequestListXxx, ResponseListXxx } from '@/api/xxx'

  import { deleteXxx, listXxx } from '@/api/xxx'
  import { useModal } from '@/hooks/useModal'
  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useFormatValue } from '@/hooks/useFormatValue'
  import { useInfo, useSuccess } from '@/hooks/useTip'

  import CompTable, { useCompTable } from '@/components/CompTable/index.vue'
  import TheSearch from './components/search.vue'
  import TheDetails from './components/details.vue'

  export type RequestList = RequestListXxx
  export type ResponseList = ResponseListXxx
  const keys = 'id'

  const showSearch = ref(true)

  const { list, getList } = useListQuery<RequestList, ResponseList>(
    { code: undefined },
    queryKeys.xxx.list(),
    async query => (await listXxx(query)),
  )

  const { selected, cannelSelected } = useCheckAll<RequestList, ResponseList>(keys)

  const { modalList, handleShowModal } = useModal({ showDetails: false })
  const selectedDetails = ref({} as ResponseList)

  const handleDetails = (row: ResponseList) => {
    selectedDetails.value = row
    handleShowModal('showDetails')
  }
  const handleAdd = () => {
    selectedDetails.value = {} as ResponseList
    handleShowModal('showDetails')
  }

  const { submit: handleDelete } = useSubmit(async () => {
    if (!selected.value.length) { useInfo('请先选择'); return }
    const ids = selected.value.map((item: ResponseList) => item.id)
    await deleteXxx(ids.join(','))
    useSuccess('删除成功')
    getList()
    cannelSelected()
  }, {
    invalidateKeys: [queryKeys.xxx.list()],
    showConfirm: true,
    confirmTitle: () => `是否删除选中的${selected.value.length}条数据？`,
  })

  const { CompTableColumn } = useCompTable<ResponseList>([
    { prop: 'code', label: '编码', minWidth: 200 },
    { prop: 'name', label: '名称', minWidth: 120 },
    { prop: 'amount', label: '金额', minWidth: 120, price: true },
    { prop: 'billDate', label: '日期', minWidth: 120, format: { type: 'date', formatStr: 'YYYY-MM-DD' } },
  ])
</script>
```

要点：

- **`v-model:list="list"`** 双向绑定 List 对象（含 `items/loading/total/query`）
- **`v-model:selected="selected"`** 跨页选择
- **`@query-table="getList"`** 工具栏刷新触发查询
- **`storage-key`** 列显隐持久化，命名 `模块:页面:columns`
- 列表查询用 `useListQuery`，**不要直接用 `useQuery`**
- 删除/批量操作用 `useSubmit` + `invalidateKeys` 自动刷新

### A.5.2 详情抽屉 `components/details.vue`

```vue
<template>
  <comp-drawer v-model="show" title="xxx" @save="handleSave">
    <el-main v-loading="isLoading">
      <el-form
        ref="ELForm"
        :rules="rules"
        :model="form"
        :validate-on-rule-change="false"
        :disabled="isLoading"
        label-width="9em">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编码" prop="code">
              <el-input v-model.trim="form.code" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <!-- ... -->
        </el-row>
      </el-form>
    </el-main>
  </comp-drawer>
</template>

<script lang="ts" setup>
  import type { ResponseList } from '../index.vue'
  import type { RequestAddXxx } from '@/api/xxx'

  import { useRules } from '@/hooks/useRules'
  import { useReactive, useValue } from '@/hooks/useObject'
  import { useSuccess } from '@/hooks/useTip'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { readXxxDetail, updateXxx } from '@/api/xxx'

  import CompDrawer from '@/components/Drawer/index.vue'

  interface Props { data?: ResponseList }
  const props = defineProps<Props>()

  const show = defineModel<boolean>({ default: false })
  const { ELForm } = useTempRefs('ELForm')

  const [form, resetForm] = useReactive<RequestAddXxx>({
    id: undefined, code: '', name: '',
  })
  const rules = useRules<RequestAddXxx>([
    { key: 'code', label: '编码' },
    { key: 'name', label: '名称' },
  ])

  watch(() => show.value, v => { if (!v) resetForm() })

  const { isLoading } = useQuery({
    queryKey: queryKeys.xxx.detail(props.data?.id),
    queryFn: async () => {
      const { data } = await readXxxDetail(props.data!.id!)
      useAssign(form, data)
      return form
    },
    enabled: computed(() => show.value && !!props.data?.id),
  })

  const { submit: handleSave } = useSubmit(async () => {
    const request = useValue<RequestAddXxx>({ id: props.data?.id, ...form })
    await updateXxx(request, !!request.id)  // 第二参 true=POST新增，false=PUT修改
    useSuccess('提交成功')
    show.value = false
  }, {
    showLoading: true,
    loadingTitle: '正在提交...',
    ELForm,
    invalidateKeys: [queryKeys.xxx.list()],
  })
</script>
```

要点：

- `comp-drawer` 的 `@save` 触发 `handleSave`，由 `useSubmit` 校验 `ELForm` 并提交
- `useReactive` 持久化初始值，`resetForm()` 在抽屉关闭时还原
- `useTempRefs('ELForm')` 取代 `ref()` 绑定表单 ref
- 详情 `useQuery` 的 `enabled` 必须是 `computed`，`queryKey` 必须含 `id`
- 保存用 `useSubmit` + `invalidateKeys` 自动刷新列表，**不要手动调 `getList`**

### A.5.3 搜索组件 `components/search.vue`

```vue
<template>
  <CompTableSearch :model="query" :loading="loading" @search="handleSearch" @reset="handleReset">
    <template #left>
      <CompCommonSearchItem v-model="query" :options="searchOptions">
        <!-- slot 命名必须是 #control-{prop} -->
        <template #control-deptId>
          <el-select v-model="query.deptId" filterable clearable>
            <el-option v-for="opt in deptList" :key="opt._value" :label="opt._label" :value="opt._value" />
          </el-select>
        </template>
      </CompCommonSearchItem>
    </template>
    <template #right><slot /></template>
  </CompTableSearch>
</template>

<script lang="ts" setup>
  import type { CommonSearchItemOptions } from '@/components/CommonSearchItem/types'
  import type { RequestList } from '../index.vue'

  import { defineSearchEmits, defineSearchProps, useSearch } from '@/hooks/useSearch'

  import CompTableSearch from '@/components/TableSearch/index.vue'
  import CompCommonSearchItem from '@/components/CommonSearchItem/index.vue'

  const props = defineProps({ ...defineSearchProps<RequestList>() })
  const emit = defineEmits([...defineSearchEmits()])

  const { query, handleReset, handleSearch } = useSearch<RequestList>(props, { emit })

  const searchOptions = computed<CommonSearchItemOptions<RequestList>[]>(() => [
    { prop: 'code', label: '编码' },
    { prop: 'deptId', label: '科室', type: 'select', slot: true },
    {
      prop: 'yearId',
      label: '年度',
      type: 'select',
      props: {
        filterable: true,
        data: yearList,
        key: '_value',
        label: 'year',
        changeFn: handleSearch,
      },
    },
  ])
</script>
```

要点：

- **slot 命名必须是 `#control-{prop}`**（不是 `#{prop}`）
- `prop` 必须是 `RequestList` 上已存在的键
- 内置 select 控件可用 `data/key/label/changeFn` 配置；自定义则用 `slot: true` + `#control-xxx`

### A.5.4 树+表单页（参考 `acctRegime/index.vue`）

适用场景：左侧树形分类 + 右侧表单（如会计制度）。

- 使用 `TreePanel` 组件，`storage-key` 持久化宽度
- `isEdit` ref 切换浏览/编辑态，编辑态禁用节点切换
- `useReactive` 初始化表单 + 子表数组
- `useAssign` 用详情数据回填（深拷贝子表避免污染缓存）
- `CompTable` 嵌入主表单中，列配置 `computed` 动态追加操作列（仅编辑态）
- 单元格校验：`useRules` + `useTableForm` + `getCellRules('field')`

## A.6 核心组件

### A.6.1 CompTable

```ts
// 列配置类型见 src/components/CompTable/types.ts
interface TableColumn<R> {
  prop: keyof R | 'action' | 'index' | 'expand'
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  renderHeader?: ((scope) => VNode) | true  // true=自动渲染必填红星
  format?: { type: FormatValueType; formatStr?: FormatFmt }  // 内置格式化
  price?: boolean             // 金额列，自动用 CompPrice
  priceConfig?: PriceConfig
  visible?: boolean           // 默认是否显示
  disabled?: boolean
}
```

约定：

- **序号列**：`:index="true"`，**不要** `prop: 'index'` 配置
- **价格列**：`price: true`，**不要** `<CompTableColumn>`
- **枚举列**：`format: { type: 'enum', formatStr }`，**不要** `<CompTableColumn>`
- **操作列**：`prop: 'action'` + `fixed: 'right'`，单元格内容用 `<CompTableColumn prop="action">` 声明
- 单元格/表头自定义统一用 `<CompTableColumn>`，不再提供 `#col-{prop}` / `#header-{prop}` 或 `slot` / `headerSlot`
- `<CompTableColumn>#default` 参数：`{ row, column, $index }`
- `<CompTableColumn>#header` 参数：`{ column, $index }`
- `useCompTable(columns)` 接收数组 / ref / computed / getter，内部用 `toValue` 解包并通过 `provide` 注入最近的 `<CompTable>`，因此 `<CompTable>` 不需要再传 `:columns`
- 同一页面有多个列结构不同的 `<CompTable>` 时，给 `useCompTable` 传 key，并在表格上写 `table-key`：
  ```ts
  const { CompTableColumn: ColA } = useCompTable(columnsA)
  const { CompTableColumn: ColB } = useCompTable(columnsB, 'b')
  ```
  ```vue
  <CompTable>...</CompTable>
  <CompTable table-key="b">...</CompTable>
  ```
  不传 key 默认 `'default'`；同一 setup 重复使用同一 key 时后者覆盖前者。
- **列插槽声明组件**（唯一写法）：

```ts
import { useCompTable } from '@/components/CompTable/index.vue'

const { CompTableColumn } = useCompTable<Row>([
  { prop: 'name', label: '名称' },
  { prop: 'action', label: '操作' },
])
```

```vue
<CompTable>
  <CompTableColumn prop="action">
    <template #header>表头内容</template>
    <template #default="{ row, $index }">单元格内容</template>
  </CompTableColumn>
</CompTable>
```

  - `<CompTableColumn>` 只接受一个 `prop`（对应 columns 的 prop）
  - 不需要 `slot` / `headerSlot`：写了 `#header` 就覆盖表头，写了 `#default` 就覆盖单元格
  - 只写 `#header`：表头走自定义，单元格仍走内部实现（price / format）
  - 只写 `#default`：单元格走自定义，表头仍走内部实现
  - 两个都没写：`<CompTableColumn>` 被忽略（dev 告警）
  - 同一列只声明一次，`#header` / `#default` 写在同一个 `<CompTableColumn>` 里
  - `#default` 参数与 `el-table-column` default 插槽一致：`{ row, column, $index }`
  - `#header` 参数与 `el-table-column` #header 插槽一致：`{ column, $index }`
- `renderHeader: true` + `:required="isEdit"` 自动渲染必填星号
- **展开列**：提供 `#expand` 插槽即自动渲染，无需额外 prop
- **高度**：`height-mode`（`fixed` 默认 / `max` / `auto`）；显式高度用 `height`，上限用 `maxHeight`（仅 `max` 模式）
- `el-table` 的 `:max-height` 用 `||` 不用 `??`
- 表格内嵌表单的 `el-form-item` `prop` 必须是 `` `list.${$index}.field` ``

### A.6.2 CommonSearchItem

```ts
type CommonSearchItemOptions<T> =
  | { type?: 'input'; prop; label; props?: InputPropsPublic; slot?: boolean }
  | { type: 'select'; prop; label; props?: SelectControlProps; slot?: boolean }
  | { type: 'date'; prop; label; props?: DatePickerPropsPublic }
  | { type: 'treeSelect'; prop; label; props?: TreeSelectControlProps }
```

约定：

- **自定义控件 slot 命名 `#control-{prop}`**（关键）
- `prop` 必须是查询对象上已存在的键

### A.6.3 金额输入与金额展示

- **金额编辑统一用 `CompInputPrice`**（`@/components/InputPrice/index.vue`），**金额展示统一用 `CompPrice`**（`@/components/Price/index.vue`）。
- **禁止手写分/元换算**（如 `value / 100`、`String(useDivide(value, 100))`、`toFixed(2)` 拼金额文本），单位换算由上述组件负责。
- 只读/不可编辑的金额单元格用 `<CompPrice :price="row.amount" />`，不要用 `CompInputPrice` + `disabled` 代替展示。
- `CompPrice`：默认 `priceUnit="fen"`、空值显示 `--`、带 `￥`，千分位用 `is-thousand`。
- `CompInputPrice`：`v-model` 绑定「分」，内部按 `ratio`（默认 100）换算，只负责输入。

## A.7 Hooks 速查

### A.7.1 数据查询

| Hook                                                         | 签名要点                                         | 用途                                                             |
| ------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| `useListQuery<Q,R>(otherQuery, queryKey, queryFn, options?)` | 返回 `{ list, getList, resetList, queryResult }` | 搜索列表页主查询，自动注入分页                                   |
| `useListAdaptor<R>(items, loading?)`                         | 返回 `List` 对象                                 | 静态数组/弹窗表格适配                                            |
| `useList<Q,R>(otherQuery, enablePage?)`                      | 返回 reactive `List`                             | 传统 callback 模式（少用）                                       |
| `useQuery` (auto-imported)                                   | 详情查询                                         | `queryKey` 含动态值时用 `computed` 包裹；`enabled` 用 `computed` |
| `useMutation` (auto-imported)                                | 变更                                             | 一般通过 `useSubmit` 间接使用                                    |

注意：

- `useQuery` 的 `queryKey` 含动态值时必须用 `computed<QueryKey>(() => [...])`
- `enabled` 必须用 `computed(() => ...)`
- `useQuery` with `enabled: false` 用 `isFetching` 而非 `isLoading` 跟踪加载
- 文件预览不内置地址换取：`CompPreview` 通用组件通过可选的 `resolveUrl` 由消费方提供 MinIO / OSS / COS 等地址解析（不传则原样使用 `url`）

### A.7.2 表单提交

```ts
useSubmit<TData, TError, TVariables>(
  apiFn: (...vars) => Promise<TData>,
  options?: {
    ELForm?: Ref<ComponentOptions>      // 自动 validate
    showConfirm?: boolean                // 二次确认
    confirmTitle?: string | ((...vars) => string)  // 纯字符串或函数；引用响应式状态时用函数
    showLoading?: boolean
    loadingTitle?: string
    invalidateKeys?: QueryKey[]          // 成功后失效（只取每个 key[0] 做前缀匹配）
    onSuccess?: (data, vars, ctx) => Promise<void>
    ...useMutationOptions
  }
)
// 返回 { submit, isPending, state, mutation, ...mutation }
```

约定：

- `confirmTitle` 可传纯字符串或函数；**仅当引用响应式状态时**才用函数（getter）形式，确保点击时求值
- `invalidateKeys` 每项是完整 QueryKey 数组，内部只取 `key[0]` 做前缀失效
- 保存参数用 `useValue<RequestSaveXxx>({ id, ...form })` 移除空值
- `updateXxx(request, !!request.id)` 第二参控制 POST/PUT

### A.7.3 校验

```ts
useRules<T>(options: { key; type?: 'text'|'upload'|'checked'; label?; message?; required?; trigger? }[], haveRules?)
```

- 默认 `required: true`，`message` 自动拼 `${label}必填/必传/必选`
- 表格内嵌校验：`useTableForm(cellRules)` → `getCellRules(field)` + `renderRequiredHeader(label, field)`

### A.7.4 对象工具（`@/hooks/useObject`）

> 实现位于 `src/hooks/useObject/`，按功能拆分（`useClone.ts` / `useReactive.ts` ...），统一由 `index.ts` 导出；调用方仍从 `@/hooks/useObject` 导入。

- `useReactive<T>(initial): [state, reset]` — 内部保存初始值快照（不修改入参），`reset()` 还原并删除多余 key
- `useAssign(target, source)` — 原地按同名字段赋值，保持引用（只赋值 target 已有字段）
- `useClone(val)` — 深拷贝普通对象 / 数组（只复制自有属性，Date / Map 等按引用保留）
- `useValue(obj)` — 递归移除无效值（用于请求参数清理，`false` / `0` 保留）
- `useDeleteObjectKey(obj, keys)` — 递归删除指定 key
- `useCleanObject(obj, match?)` — 递归删除值为 match 的 key（match 对嵌套对象 / 数组生效）

### A.7.5 弹窗 `useModal`

```ts
useModal<T extends Record<string, boolean>>(list: T)
// 返回 { showModal, modalList, handleShowModal, handleCloseModal }
```

- **`handleShowModal(target)` 必须传 target**，不支持"打开全部"
- `handleCloseModal()` 关全部，`handleCloseModal(target)` 关指定

### A.7.6 跨页选择 `useCheckAll`

```ts
useCheckAll<Q, R>(keys: string)  // keys 例 'id' 或 'id-type' 复合主键
// 返回 { selected, isCheckAll, isCheckedItem, cannelSelected, ... }
```

### A.7.7 表单 ref `useTempRefs`

```ts
const { ELForm } = useTempRefs('ELForm')      // 字符串
const { ELForm, ELTable } = useTempRefs(['ELForm', 'ELTable'])  // 数组
const { treeRef } = useTempRefs({ treeRef: 'categoryTreeRef' }) // 自定义
```

- 普通 key 返回 `TemplateRef<T>`（`.value` 为 `T | null`，挂载前是 `null`）；`ELList` 返回 `Ref<(T | null)[]>`；`ELTempList` 返回 VueUse 的模板 ref 列表
- 显式传 `T` 时 `K` 不会继续推断，`ELList` / `ELTempList` 有专用重载（如 `useTempRefs<InstanceType<typeof TheList>>('ELList')`）；其余自定义 key 建议不显式传 `T` 以获得精确 key
- 对象入参的 key 会精确推导，未定义的 key 会直接报错

### A.7.8 工作流 `useFlowable`

位于 `src/views/masterBudget/hooks/flowable.ts`：

```ts
useFlowable<T extends { id: string|number; auditStatus: number }>({
  bizKey: BizKey.项目论证,        // 见 @/enum/flowable
  invalidateKeys: QueryKey[],
  permission?: string[],          // 空数组/undefined 都跳过指令
})
// 返回 { handleSubmit, handleWithdraw, isFlowableLoading, FlowableButtons }
```

- `<FlowableButtons :row="row" />` 自动按 `auditStatus` 渲染"提交/收回"
- **`handleSubmit` 接收 `bizId` 而非 row 对象**
- loading 用 `isFlowableLoading`，不要自建 `isPending`

### A.7.9 附件 `useFormAttachment`

```ts
useFormAttachment({ bizType, bizId?, uuid?, visible? })
// 返回 { list, handleUploadSuccess, handleDelete, setList, save, clear }
```

约定：

- 新建态：先保存主表拿到 id，再调 `save(bizId)`
- `save` 内部对空列表短路（避免"请求参数列表不能为空"错误）
- `uuid` 由 `CompUploadTemp` 内部用 `nanoid()` 生成，hook 不传
- 详情页**不要**调 `listAttachment`，列表由 `CompUploadTemp` 通过 `@change` 回传

### A.7.10 提示 `useTip`

- `useSuccess(msg)` / `useError(msg)` / `useInfo(msg)` / `useConfirm(msg, title, options?)` / `useLoading(title)`

### A.7.11 路由参数 `useValidateArgs`

```ts
const type = useValidateArgs<BudgetType>('type')   // 必传校验
const type = useValidateArgs<BudgetType>('type', false, BudgetType.支出预算)  // 取不到时用默认值
const list = useValidateArgs('ids').array().number()  // 数组+数字转换
```

- **必须在组件 `setup` 内调用**，不可用于路由守卫
- 用 `useRoute()` + `watch({ immediate: true })` 订阅变化
- 只校验字段**存在性**（`arg !== undefined`），空字符串不报错
- 第三个参数为默认值：参数缺失或为空串时使用；给了默认值即视为可选，不再提示缺少参数

## A.8 queryKeys 约定

所有 QueryKey 必须在 `src/constants/queryKeys.ts` 注册，**禁止散落字符串**：

```ts
queryKeys.budgetExec.listExec()                    // 列表
queryKeys.budgetExec.detail(id)                    // 详情
queryKeys.finance.acctRegime.tree()                // 树
```

约定：

- 列表 key 函数返回 `[PREFIX]` 或 `[PREFIX, query]`
- 详情 key 函数返回 `[PREFIX, id]`
- 同一组件多个 query 必须用不同 namespace 防止缓存污染
- `useListQuery` 的 `queryKey` 参数可传数组或工厂函数

## A.9 枚举约定

- 枚举位于 `src/enum/`，按业务域分文件（`acct.ts` / `budget.ts` / `flowable.ts`）
- 中文键枚举：`enum BalanceDirection { '借' = 1, '贷' = 2 }`
- **el-select/el-checkbox 绑定枚举值**：

```vue
<!-- el-select 选项 -->
<el-option v-for="item in balanceDirectionOptions" :key="item.key" :label="item.value" :value="item.key" />
<!-- 浏览态显示 -->
<span>{{ BalanceDirection[row.balanceDirection] }}</span>
<!-- el-checkbox 双向绑定枚举 -->
<el-checkbox v-model="row.balangroup" :true-value="YesOrNo.是" :false-value="YesOrNo.否" />
```

- `useEnumArray(EnumObj)` → `[{ key, value }]`（`key` 为枚举值，`value` 为中文键名）
  - **保留枚举声明值类型**，不做数字转换：`'10'` 仍是 `'10'`，`1` 仍是 `1`
  - 自动剔除数字枚举的反向映射，中文 / 带符号的枚举值不会被误过滤
  - 支持 `as const` 常量对象，以及自定义字段名 `useEnumArray(EnumObj, { key: 'key', value: 'label' })`
- `getEnumValue(value, EnumObj)` 直接按枚举值取枚举名；`useEnumValue(value, useEnumArray(...))` 用于选项数组

## A.10 权限指令

```vue
<el-button v-hasPermi="[permission.add]">新增</el-button>
```

- 权限标识集中在页面同级 `permission.ts` 文件
- `useFlowable` 的 `permission` 参数为空数组或 undefined 时自动跳过指令（避免 `请设置操作权限标签值` 错误）

## A.11 代码风格

- **事件处理函数**：`handleXxx` 前缀（`handleClick` / `handleAdd` / `handleSave`）
- **函数定义**：`const fn = () => {}`，优先于 `function fn()`
- **解构**：`const { x } = props` 而非 `const x = props.x`
- **可选链**：`user?.name` 优先于 `if (user && user.name)`
- **数组方法**：`array.forEach` / `map` / `filter` 优先于 `for` 循环
- **模板字符串**：`` `Hello ${name}` `` 优先于字符串拼接
- **提前返回**：优先 early return
- **类型定义**：`interface` 定义类型，`type` 定义别名
- **v-model**：禁用可选链 `?.`（编译目标非法），改用 `:model-value` 单向绑定

## A.12 Git 提交规范

格式：`<type>: [<模块名>]<描述>`，描述不以句号结尾。

| type     | 说明            |
| -------- | --------------- |
| feat     | 新功能          |
| fix      | 修补 bug        |
| docs     | 文档 / 提审日志 |
| style    | 格式            |
| refactor | 重构            |
| test     | 测试            |
| chore    | 构建/辅助       |

模块名用方括号 `[]`，跨模块用 `/`，如 `feat: [会计平台/总预算]新增 CompTable 组件`。提审类统一 `[提审]`。

## A.13 常见陷阱（Hard Constraints）

- `global.d.ts` 不得完全覆盖 Vue/axios 类型，必须用 interface 扩展
- `tsconfig.json` 的 `types` / `include` 不可改动
- `@tanstack/vue-query` 的 query key 含动态值时必须 `computed` 包裹
- 同一组件多个 query 必须用不同 namespace
- `useListQuery` 的 `enabled` 不得引用返回的 `list` 对象（TDZ）
- `ElMessageBox.beforeClose` 三种动作都必须调 `done()`
- API 操作必须 `await` 完成后再重置表单，避免数据丢失
- `v-model` 禁用 `?.`，禁用组件用 `:model-value`
- `el-table :max-height` 用 `||` 不用 `??`
- `el-descriptions` 内联 `el-checkbox` 需 `vertical-align: middle`
- `v-loading` 只能挂原生元素或带根元素的 EP 组件，不可挂 Teleport/Fragment
- `el-drawer` 结构：`flex column > header(fixed) + content(flex:1, overflow-y:auto)`
- `el-drawer` 样式必须放非 scoped 全局块，用唯一 class（如 `.comp-drawer-box`）定位 Teleport 元素
- `el-scrollbar` 在 flex 布局用 `flex:1; min-height:0`，子选择器直接定位
- 存入响应式数组的组件用 `shallowRef` 防止深响应式警告
- `useModal` 不得动态加 key，必须初始化时声明
- `useSubmit.confirmTitle` 非必须 getter；类型为 `string | ((...vars) => string)`，引用响应式状态时才用函数
- `attachmentUuid` 用 `nanoid()` 生成
- `BizKey.项目论证` 而非 `BizKey.项目立项`
- `bizKey='projectInit'` 为项目立项审批标识
- `useFormAttachment.save` 空列表短路
- `CompUploadTemp` 接受 `active` prop 预加载，`enabled` 逻辑 `(show || active) && ...`
- `useFlowable.permission` 用 `params.permission?.length` 非空检查
- Vue 默认 slot 用 `() => text` 函数形式，不用字符串
- `ElButton.type` 用 `ButtonType`（from 'element-plus'）

## A.14 截图还原页面规则

当用户提供截图要求还原页面时：

1. **优先识别布局类型**：列表页 / 详情抽屉 / 树+表单 / 主从表 / 表单页
2. **严格使用项目既有组件**：`CompTable` / `CommonSearchItem` / `TreePanel` / `comp-drawer` / `CompInputPrice` / `CompUploadTemp` 等，**不要用裸 `el-table` / `el-dialog` 重写**
3. **严格使用既有 hooks**：`useListQuery` / `useSubmit` / `useRules` / `useCheckAll` / `useModal` / `useFlowable` / `useFormAttachment` / `useTempRefs`
4. **列配置优先用内置格式**（`price` / `format.enum` / `format.date`），仅复杂交互用 slot
5. **字段类型严格从 `@/api/<模块>/index.ts` 派生**，不自造字段；缺字段时 `Pick<DTO, ...>` 派生
6. **样式遵循 Element Plus 主题变量**（`var(--el-color-xxx)`），不引入额外 UI 库
7. **权限按钮加 `v-hasPermi`**，权限标识放同级 `permission.ts`
8. **QueryKey 必须在 `queryKeys` 注册**
9. 搜索区 slot 命名 `#control-{prop}`
10. 表格自定义列统一用 `<CompTableColumn>`

## A.15 第三方组件能力与兼容问题

### A.15.1 内置能力优先

引入的 npm 组件已实现的功能（如 `@file-viewer/vue3-full` 的下载 / 导出 / 打印工具栏、`el-table` 的排序 / 分页等），**直接使用组件内置能力，不要重复实现**。

若项目中已存在与组件内置能力重叠的自实现代码，**必须先询问用户如何处理**（删除 / 保留 / 改造），不得擅自保留两套逻辑。

### A.15.2 兼容问题处理顺序

遇到需要兼容的问题（颜色 / 字体 / 格式差异、浏览器差异等），按以下顺序处理：

1. **官方方案**：查官方文档配置项、升级版本、官方 issue 给出的方案。
2. **流行方案**：官方无解时，寻找流行的 npm 包或社区成熟方案。
3. **AI 补丁**：前两者都不存在时，才由 AI 编写补丁代码，并在代码注释中说明「官方无方案、无流行方案」及补丁原因。

> 参考案例：`src/components/Preview/msDocColors.ts`（颜色问题：`@file-viewer/doc` 官方无颜色配置项、也无可直接使用的流行方案，故采用补丁）。
