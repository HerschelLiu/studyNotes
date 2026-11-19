---
title: "Vue 3 工程规范（通用细则 · L2）"
---

> 由 [`AGENTS.md`](../../AGENTS.md) 头部索引引用，**做任何 Vue 代码任务前必须读**。
> 与 L1 冲突时以 L1 为准。本项目专属内容（组件 API、hooks 签名、样例代码）见同目录 [`minyi-vue3.md`](./minyi-vue3.md)。
> 本文件与具体项目解耦，可整份复制到其他 Vue 3 + TypeScript + Element Plus 项目。

## 1. 目录约定

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

- 以项目实际目录为准；新增文件放入语义最接近的目录，**不随意新增顶层目录**。

## 2. TypeScript 约束

- 不修改 `tsconfig.json` 的 `types` / `include`（除非用户明确要求）。
- 禁止修改任何 `.d.ts`；`global.d.ts` 用 interface 扩展，不得完全覆盖。
- 接口类型从 `@/api/<模块>/index.ts` 派生，禁止自造字段；DTO 缺字段用 `Pick` 派生。
- 枚举是名义类型，不同枚举即使值相同也不可互相赋值。
- 禁止 `as any` / `@ts-ignore` 兜底；确需使用时注释原因并告知用户。
- **禁止基础类型转换**（见 L1 1.4）。

## 3. 自动导入与路径别名

- 若项目配置了 `unplugin-auto-import`：已注册的 API **不要手动 import**，以 `auto-imports.d.ts` 与实际配置为准。
- 未注册的必须显式 import。
- 路径别名统一 `@` → `src/`；统一用 `@/...`，不用 `../`（**页面内私有组件除外**）。

## 4. Import 顺序

`<script setup>` 中的 import 按以下顺序分组，**组与组之间用空行分隔**：

1. `import type` 块（类型导入，永远在最上层）
2. 非组件 import（hooks / api / utils / enum / store）
3. 组件 import：**公共组件在前，本文件相关组件在后**

```ts
import type { XxxOptions } from '@/components/Xxx/types'
import type { RequestListXxx, ResponseListXxx } from '@/api/xxx'

import { deleteXxx, listXxx } from '@/api/xxx'
import { useModal } from '@/hooks/useModal'
import { useCheckAll } from '@/hooks/useCheckAll'

import CompTable from '@/components/CompTable/index.vue'
import TheSearch from './components/search.vue'
import TheDetails from './components/details.vue'
```

## 5. 页面架构范式

以「列表页 + 表单/详情」为主，骨架与项目保持一致；具体组件名与样例见 L3。

- **列表页**：搜索区 + 表格 + 分页 + 详情抽屉/弹窗。
  - 表格 / 搜索区 / 分页优先使用项目封装组件。
  - 列配置优先使用内置格式化（金额、枚举、日期），仅复杂交互用插槽。
  - 操作列固定右侧；批量操作使用项目跨页选择方案。
  - 列表查询使用项目列表 hook，不直接裸用 `useQuery`。
- **表单/详情**：抽屉或对话框 + `el-form`。
  - 校验规则使用项目校验 hook。
  - 提交统一走项目提交 hook（自动校验、loading、成功后失效查询）。
  - 关闭时重置表单；**API 完成后才重置**，不要先重置再提交。
- **树 + 表单**：左侧树、右侧表单；编辑态禁止切换节点。
- 权限按钮使用项目权限指令，权限标识集中在页面同级 `permission.ts`。
- 保存后靠统一失效机制刷新列表，**不要手动调列表方法**（避免与 `invalidateKeys` 双请求）。

## 6. 数据层约定

- Query Key 集中注册（如 `src/constants/queryKeys.ts`），禁止散落字符串。
- 动态 key 用 `computed` 包裹；`enabled` 用 `computed`。
- 同一组件多个查询使用不同 namespace，避免缓存污染。
- 提交成功后通过统一失效机制刷新，不手动调列表方法。
- 请求参数清理使用项目工具函数（移除空值等），不手写。
- 枚举、字典、`el-select` 的 `value` 类型必须一致（见 L1 1.4）。

## 7. 代码风格

- 事件处理函数 `handleXxx` 前缀。
- 函数定义 `const fn = () => {}`，优先于 `function fn()`。
- 解构 props：`const { x } = props`，而非 `const x = props.x`。
- 优先可选链、数组方法（`map` / `filter` / `forEach`）、模板字符串、提前返回。
- `interface` 定义对象类型，`type` 定义别名。
- `v-model` 禁用可选链 `?.`，改用 `:model-value` 单向绑定。
- 遵循项目既有命名与目录风格，不引入新的风格约定。

## 8. Git 提交规范

格式：`<type>: [<模块名>]<描述>`，描述不以句号结尾。

| type     | 说明            |
| -------- | --------------- |
| feat     | 新功能          |
| fix      | 修补 bug        |
| docs     | 文档 / 提审日志 |
| style    | 格式            |
| refactor | 重构            |
| test     | 测试            |
| chore    | 构建 / 辅助     |

- 模块名用方括号 `[]`，跨模块用 `/`，如 `feat: [会计平台/总预算]新增 CompTable 组件`；提审类统一 `[提审]`。
- 项目无模块概念时可省略 `[模块名]`。
- 一个提交只做一件事，不要混入无关格式化。

## 9. 陷阱全表

按主题分组；L1 第 7 节只列高频 13 条，本表是全集。

### 9.1 模板与指令

- `v-model` 禁用 `?.`，禁用态组件用 `:model-value` 单向绑定。
- Vue 默认 slot 用函数形式 `() => text`，不用字符串。
- `ElButton.type` 使用 `ButtonType`（from `element-plus`）。
- `v-loading` 只能挂原生元素或带根元素的 EP 组件，不可挂 Teleport / Fragment。
- `ElMessageBox.beforeClose` 的 confirm / cancel / close 三种动作都必须调 `done()`，否则弹窗关不掉。

### 9.2 布局与滚动

- `el-table` 的 `:max-height` 用 `||` 不用 `??`（`0` 需被当作无效值）。
- `el-drawer` 结构：`flex column > header(fixed) + content(flex:1, overflow-y:auto)`。
- `el-drawer` 样式必须放**非 scoped 全局块**，用唯一 class 定位 Teleport 元素（scoped 样式打不到 Teleport 出去的 DOM）。
- `el-scrollbar` 在 flex 布局中用 `flex:1; min-height:0`，子选择器直接定位。
- `el-descriptions` 内联 `el-checkbox` 需 `vertical-align: middle`。

### 9.3 响应式与状态

- 存入响应式数组的组件用 `shallowRef`，避免深响应式警告。
- 弹窗状态**初始化时声明**（`{ showXxx: false }`），不动态加 key。
- `useSubmit.confirmTitle` 类型为 `string | ((...vars) => string)`；**仅当引用响应式状态时**才用函数形式，确保点击时求值。

### 9.4 请求与缓存

- API 必须 `await` 完成后再重置表单，避免数据丢失。
- query key 含动态值时必须 `computed` 包裹；`enabled` 必须 `computed`。
- 同一组件多个 query 必须用不同 namespace，防止缓存污染。
- 依赖 `enabled: false` 的查询用 `isFetching` 而非 `isLoading` 跟踪加载。

### 9.5 类型

- 枚举 / 字典 / `el-select` 的 `value` 类型保持一致，**不做 `String()` / `Number()` 对齐**。
- `global.d.ts` 不得完全覆盖 Vue / axios 类型，必须用 interface 扩展。
- `tsconfig.json` 的 `types` / `include` 不可改动（除非用户明确要求）。

## 10. 第三方组件能力与兼容

**内置能力优先**：npm 组件已实现的能力（下载 / 导出 / 打印工具栏、排序、分页等）直接使用，不重复实现。

若项目中已有与内置能力重叠的自实现，**先询问用户**（删除 / 保留 / 改造），不得擅自保留两套逻辑。

**兼容问题处理顺序**：

1. **官方方案**：查官方文档配置项、升级版本、官方 issue 给出的方案。
2. **流行方案**：官方无解时，找流行的 npm 包或社区成熟方案。
3. **AI 补丁**：前两者都不存在时才写，并在代码注释中说明「官方无方案、无流行方案」及补丁原因。
