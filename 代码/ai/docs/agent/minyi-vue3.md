# minyi_vue3 项目落地手册（L3）

> 由 [`AGENTS.md`](../../AGENTS.md) 引用：**改本项目页面 / 组件 / hook 前必读**。
> 与 L1 冲突时以 L1 为准；通用规范见同目录 [`vue-conventions.md`](./vue-conventions.md)。
> 本文件只放**本项目事实**（路径、组件 API、hooks 签名、样例代码）。迁移到其他项目时整份替换。

## A.1 项目概述

- **项目名**：minyi_vue3（基于若依 RuoYi-Vue 二次开发）
- **业务领域**：医院 HRGP 全面预算 / 会计平台 / 人力资源 等管理系统
- **核对日期**：2026-11（版本号会随依赖升级漂移，以 `package.json` 为准）
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

无独立 typecheck 脚本，直接用 `npx vue-tsc --noEmit`（`vue-tsc` 已随依赖安装）。**修改 `.ts`/`.vue` 后必须保证无 TS 诊断错误**；构建只作兜底，不用来替代类型检查。

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

## A.4 自动导入与路径别名

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

### A.4.1 路径别名

`@` → `src/`（见 `tsconfig.json` 与 `vite.config.ts`）。**统一使用 `@/...`，不要用相对路径 `../`**。

## A.5 环境变量与类型配置

使用 `import.meta.env.VITE_XXX`，**禁止使用 `process.env`**。

- `tsconfig.json` 的 `types` 必须为 `['vite/client', 'vue', 'element-plus/global']`，`include` 不可改动。
- `global.d.ts` 必须用 interface 扩展 Vue / axios，不得完全覆盖（通用约束见 L2 §2）。

## A.6 页面范式与样例

新增/修改页面必须遵循以下骨架。**首选参照模板**：

- 列表页：`src/views/masterBudget/budgetExec/expBudgetExec/index.vue`
- 详情抽屉：`src/views/masterBudget/budgetExec/expBudgetExec/components/details.vue`
- 搜索组件：`src/views/masterBudget/budgetExec/expBudgetExec/components/search.vue`
- 树+表单：`src/views/financialManagement/acctRegime/index.vue`

### A.6.1 列表页 `index.vue`

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

### A.6.2 详情抽屉 `components/details.vue`

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
  import { useAssign, useReactive, useValue } from '@/hooks/useObject'
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

### A.6.3 搜索组件 `components/search.vue`

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

### A.6.4 树+表单页（参考 `acctRegime/index.vue`）

适用场景：左侧树形分类 + 右侧表单（如会计制度）。

- 使用 `TreePanel` 组件，`storage-key` 持久化宽度
- `isEdit` ref 切换浏览/编辑态，编辑态禁用节点切换
- `useReactive` 初始化表单 + 子表数组
- `useAssign` 用详情数据回填（深拷贝子表避免污染缓存）
- `CompTable` 嵌入主表单中，列配置 `computed` 动态追加操作列（仅编辑态）
- 单元格校验：`useRules` + `useTableForm` + `getCellRules('field')`

## A.7 核心组件

### A.7.1 CompTable

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

`<CompTableColumn>` 的规则：

- 只接受一个 `prop`（对应 columns 的 prop）。
- 不需要 `slot` / `headerSlot`：写了 `#header` 就覆盖表头，写了 `#default` 就覆盖单元格。
- 只写 `#header`：表头走自定义，单元格仍走内部实现（price / format）。
- 只写 `#default`：单元格走自定义，表头仍走内部实现。
- 两个都没写：`<CompTableColumn>` 被忽略（dev 告警）。
- 同一列只声明一次，`#header` / `#default` 写在同一个 `<CompTableColumn>` 里。
- `#default` 参数与 `el-table-column` default 插槽一致：`{ row, column, $index }`。
- `#header` 参数与 `el-table-column` #header 插槽一致：`{ column, $index }`。

其余约定：

- `renderHeader: true` + `:required="isEdit"` 自动渲染必填星号
- **展开列**：提供 `#expand` 插槽即自动渲染，无需额外 prop
- **高度**：`height-mode`（`fixed` 默认 / `max` / `auto`）；显式高度用 `height`，上限用 `maxHeight`（仅 `max` 模式）
- `el-table` 的 `:max-height` 用 `||` 不用 `??`
- 表格内嵌表单的 `el-form-item` `prop` 必须是 `` `list.${$index}.field` ``

### A.7.2 CommonSearchItem

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

### A.7.3 金额输入与金额展示

- **金额编辑统一用 `CompInputPrice`**（`@/components/InputPrice/index.vue`），**金额展示统一用 `CompPrice`**（`@/components/Price/index.vue`）。
- **禁止手写分/元换算**（如 `value / 100`、`String(useDivide(value, 100))`、`toFixed(2)` 拼金额文本），单位换算由上述组件负责。
- 只读/不可编辑的金额单元格用 `<CompPrice :price="row.amount" />`，不要用 `CompInputPrice` + `disabled` 代替展示。
- `CompPrice`：默认 `priceUnit="fen"`、空值显示 `--`、带 `￥`，千分位用 `is-thousand`。
- `CompInputPrice`：`v-model` 绑定「分」，内部按 `ratio`（默认 100）换算，只负责输入。

## A.8 Hooks 速查

### A.8.1 数据查询

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

### A.8.2 表单提交

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

### A.8.3 校验

```ts
useRules<T>(options: { key; type?: 'text'|'upload'|'checked'; label?; message?; required?; trigger? }[], haveRules?)
```

- 默认 `required: true`，`message` 自动拼 `${label}必填/必传/必选`
- 表格内嵌校验：`useTableForm(cellRules)` → `getCellRules(field)` + `renderRequiredHeader(label, field)`

### A.8.4 对象工具（`@/hooks/useObject`）

> 实现位于 `src/hooks/useObject/`，按功能拆分（`useClone.ts` / `useReactive.ts` ...），统一由 `index.ts` 导出；调用方仍从 `@/hooks/useObject` 导入。

- `useReactive<T>(initial): [state, reset]` — 内部保存初始值快照（不修改入参），`reset()` 还原并删除多余 key
- `useAssign(target, source)` — 原地按同名字段赋值，保持引用（只赋值 target 已有字段）
- `useClone(val)` — 深拷贝普通对象 / 数组（只复制自有属性，Date / Map 等按引用保留）
- `useValue(obj)` — 递归移除无效值（用于请求参数清理，`false` / `0` 保留）
- `useDeleteObjectKey(obj, keys)` — 递归删除指定 key
- `useCleanObject(obj, match?)` — 递归删除值为 match 的 key（match 对嵌套对象 / 数组生效）

### A.8.5 弹窗 `useModal`

```ts
useModal<T extends Record<string, boolean>>(list: T)
// 返回 { showModal, modalList, handleShowModal, handleCloseModal }
```

- **`handleShowModal(target)` 必须传 target**，不支持"打开全部"
- `handleCloseModal()` 关全部，`handleCloseModal(target)` 关指定

### A.8.6 跨页选择 `useCheckAll`

```ts
useCheckAll<Q, R>(keys: string)  // keys 例 'id' 或 'id-type' 复合主键
// 返回 { selected, isCheckAll, isCheckedItem, cannelSelected, ... }
```

### A.8.7 表单 ref `useTempRefs`

```ts
const { ELForm } = useTempRefs('ELForm')      // 字符串
const { ELForm, ELTable } = useTempRefs(['ELForm', 'ELTable'])  // 数组
const { treeRef } = useTempRefs({ treeRef: 'categoryTreeRef' }) // 自定义
```

- 普通 key 返回 `TemplateRef<T>`（`.value` 为 `T | null`，挂载前是 `null`）；`ELList` 返回 `Ref<(T | null)[]>`；`ELTempList` 返回 VueUse 的模板 ref 列表
- 显式传 `T` 时 `K` 不会继续推断，`ELList` / `ELTempList` 有专用重载（如 `useTempRefs<InstanceType<typeof TheList>>('ELList')`）；其余自定义 key 建议不显式传 `T` 以获得精确 key
- 对象入参的 key 会精确推导，未定义的 key 会直接报错

### A.8.8 工作流 `useFlowable`

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

### A.8.9 附件 `useFormAttachment`

```ts
useFormAttachment({ bizType, bizId?, uuid?, visible? })
// 返回 { list, handleUploadSuccess, handleDelete, setList, save, clear }
```

约定：

- 新建态：先保存主表拿到 id，再调 `save(bizId)`
- `save` 内部对空列表短路（避免"请求参数列表不能为空"错误）
- `uuid` 由 `CompUploadTemp` 内部用 `nanoid()` 生成，hook 不传
- 详情页**不要**调 `listAttachment`，列表由 `CompUploadTemp` 通过 `@change` 回传

### A.8.10 提示 `useTip`

- `useSuccess(msg)` / `useError(msg)` / `useInfo(msg)` / `useConfirm(msg, title, options?)` / `useLoading(title)`

### A.8.11 路由参数 `useValidateArgs`

```ts
const type = useValidateArgs<BudgetType>('type')   // 必传校验
const type = useValidateArgs<BudgetType>('type', false, BudgetType.支出预算)  // 取不到时用默认值
const list = useValidateArgs('ids').array().number()  // 数组+数字转换
```

- **必须在组件 `setup` 内调用**，不可用于路由守卫
- 用 `useRoute()` + `watch({ immediate: true })` 订阅变化
- 只校验字段**存在性**（`arg !== undefined`），空字符串不报错
- 第三个参数为默认值：参数缺失或为空串时使用；给了默认值即视为可选，不再提示缺少参数

## A.9 queryKeys 约定

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

## A.10 枚举约定

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

## A.11 权限指令

```vue
<el-button v-hasPermi="[permission.add]">新增</el-button>
```

- 权限标识集中在页面同级 `permission.ts` 文件
- `useFlowable` 的 `permission` 参数为空数组或 undefined 时自动跳过指令（避免 `请设置操作权限标签值` 错误）

## A.12 截图还原页面规则

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

## A.13 项目专属陷阱

通用陷阱见 L2 §9，本表只列本项目特有的 8 条：

- `useListQuery` 的 `enabled` 不得引用返回的 `list` 对象（TDZ，运行时报未初始化）。
- 附件 `uuid` 用 `nanoid()` 生成，由 `CompUploadTemp` 内部处理，hook 不传。
- `BizKey.项目论证` 而非 `BizKey.项目立项`。
- `bizKey='projectInit'` 为项目立项审批标识，与「项目论证」是两个流程。
- `useFormAttachment.save` 对空列表短路，避免「请求参数列表不能为空」。
- `CompUploadTemp` 接受 `active` prop 预加载，`enabled` 逻辑为 `(show || active) && ...`。
- `useFlowable.permission` 用 `params.permission?.length` 非空检查，空数组 / undefined 都跳过指令。
- `src/components/Preview/msDocColors.ts` 是「官方无方案、无流行方案」的补丁，属已知例外，勿按风格规则清理。

## A.14 文件预览 CompPreview

- 不内置地址换取：`CompPreview` 通过可选的 `resolveUrl` 由消费方提供 MinIO / OSS / COS 等地址解析（不传则原样使用 `url`）。
- 展示附件 / 图片 / 文档时优先用它，不要各页面自写预览逻辑。

## A.15 扩展本手册

- 新增通用规则 → 写进 `vue-conventions.md`，不要把细则堆进 L1。
- 新增本项目事实（新组件、新 hook、新约定）→ 写进本文件对应小节，并保持「签名 + 约定」两段式。
