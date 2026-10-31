# 公共表格搜索子项 CommonSearchItem

> 通用表格搜索区（`CompTableSearch`）的子项组件：用一份 `options` 配置声明式渲染一排搜索控件，支持「拆分为多个输入框」和「合并为一个输入框 + 字段下拉」两种展示方式。

## 目录

- [概述](#概述)
- [目录结构](#目录结构)
- [展示模式](#展示模式)
- [组件 Props](#组件-props)
- [options 项配置](#options-项配置)
- [插槽](#插槽)
- [核心机制](#核心机制)
  - [entries 计算属性](#entries-计算属性)
  - [查询对象注入 SEARCH_QUERY](#查询对象注入-search_query)
  - [BindableProps 与 WithoutModel](#bindableprops-与-withoutmodel)
- [源码](#源码)
- [使用示例](#使用示例)

## 概述

- 基于 Element Plus，嵌入 `CompTableSearch` 的 `#left` 插槽使用。
- `query` 通过 `v-model` 绑定，组件按 `prop` 直接读写 `query[prop]`。
- 内置四种控件类型（`type`）：`input` / `select` / `date` / `treeSelect`，由控件注册表（`controls/index.ts`）自动推导，**新增控件无需改动 `index.vue`**。
- 控件区有三种插槽注入方式：`#control-<prop>`（整块控件交给插槽）、`#append`（末尾追加）、`#<type>-<prop>-<slotName>`（穿透到控件内部插槽）。

## 目录结构

```
CommonSearchItem/
├── index.vue                # 主组件：渲染、merge 分组、插槽转发、provide 查询对象
├── types.ts                 # 对外类型（CommonSearchItemOptions / Props）
└── controls/
    ├── context.ts           # 查询对象注入键 SEARCH_QUERY
    ├── types.ts             # 控件通用类型（ControlProps / BindableProps / WithoutModel 等）
    ├── index.ts             # 控件注册表 controls + 类型推导（ControlPropsMap）
    ├── InputControl.vue
    ├── SelectControl.vue
    ├── DatePickerControl.vue
    └── TreeSelectControl.vue
```

## 展示模式

`type: 'split' | 'merge'`：

- **split（拆分）**：`options` 每一项渲染成一个独立的 `el-form-item`。
- **merge（合并）**：未标 `split: true` 的项收进「字段下拉 + 输入框」合并组；`split: true` 的项仍独立成表单项。

```text
options 有 4 项配置：编码、名称、状态、项目(项目标了 split:true)

界面只画 2 个表单项：
  ┌──────────┬──────────────┐   ┌──────┬────────┐
  │  编码 ▾  │  [输入框]     │   │ 项目 │ [输入框]│
  └──────────┴──────────────┘   └──────┴────────┘
     ← 合并组（1个）              ← 独立项（1个）
```

## 组件 Props

`CommonSearchItemProps<T>`：

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `CommonSearchItemOptions<T>[]` | — | 搜索项配置数组 |
| `type` | `'split' \| 'merge'` | `'split'` | 展示方式 |
| `prependWidth` | `number` | `100` | merge 时字段下拉区宽度 |
| `inputWidth` | `number` | `200` | 输入框宽度 |
| `labelWidth` | `string \| number` | — | 全局 label 宽度（单项 `labelWidth` 优先） |
| `defaultPlaceholder` | `string \| 'custom'` | `'custom'` | 默认占位符；`'custom'` 时依次取 `item.placeholder → props.placeholder → item.label` |
| `selectFilterable` | `boolean` | `true` | merge 时字段下拉是否可筛选 |
| `defaultQueryProp` | `CommonSearchItemOptions<T>['prop']` | — | merge 默认查询字段（`isDefault` 优先于它） |

## options 项配置

`CommonSearchItemOptions<T>`（基础配置 + 按 `type` 推导的 `props`）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `prop` | `FieldKeys<T>` | 字段名（查询对象上已存在的键） |
| `label` | `string` | 标签文本 |
| `labelWidth` | `string \| number` | 单项 label 宽度（优先于全局） |
| `placeholder` | `string` | 占位符 |
| `inputSize` | `{ width?: ID }` | 控件区宽度 |
| `split` | `boolean` | merge 时该项是否独立出来 |
| `slot` | `boolean` | 控件区是否交给 `#control-<prop>` 插槽 |
| `disabled` | `MaybeRefOrGetter<boolean>` | 是否禁用 |
| `isDefault` | `MaybeRefOrGetter<boolean>` | merge 默认字段（仅允许一项，优先于 `defaultQueryProp`） |
| `rules` | `FormItemRule \| FormItemRule[]` | 校验规则；未配置回落到 TableSearch 上按 prop 的 rules |
| `type` | `'input' \| 'select' \| 'date' \| 'treeSelect'` | 控件类型（省略即 `input`） |
| `props` | `ControlPropsOf<type>` | 透传给控件的属性（含 emits 的 onXxx） |

各控件 `props` 对应类型（由 `ControlPropsMap` 推导）：

- `input`：`BindableProps<typeof ElInput>`
- `select`：`BindableProps<typeof ElSelect> & SelectOptionProps`，其中 `SelectOptionProps = { data?, label?, key? }`，`label` 可为函数
- `date`：`BindableProps<typeof ElDatePicker> & DateRangeProps`，其中 `DateRangeProps = { start?, end? }`（daterange 拆两字段）
- `treeSelect`：`Omit<BindableProps<typeof ElTreeSelect>, 'data'> & { data? }`

> `v-model` 由 CommonSearchItem 接管，`options.props` 中不允许再传 `modelValue` / `onUpdate:modelValue`（类型上已通过 `WithoutModel` 剔除）。

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `#control-<prop>` | `slot: true` 的项，整块控件区交给该插槽，如 `#control-startDate` |
| `#append` | 与 `type` 无关，始终渲染在所有表单项之后 |
| `#<type>-<prop>-<slotName>` | 穿透到控件内部 `<slotName>` 插槽，如 `#treeSelect-parentId-default` |

## 核心机制

### entries 计算属性

```text
options 有 4 项配置：
  编码、名称、状态、项目(项目标了 split:true)

界面只画 2 个表单项：
  ┌──────────┬──────────────┐   ┌──────┬────────┐
  │  编码 ▾  │  [输入框]     │   │ 项目 │ [输入框]│
  └──────────┴──────────────┘   └──────┴────────┘
     ← 合并组（1个）              ← 独立项（1个）
```

- `flatMap` 把三次返回的 `[entry]`、`[]`、`[]` 拍平拼接，最终得到只含 1 个 entry 的数组。`flatMap` 是唯一能一步表达「跳过」的数组方法：用 `map` 每一项都要输出，跳过的要输出 `undefined` 再 `filter`，麻烦。
- 结果中 `merged` 区分合并组还是独立项。
- **关键**：整个数组里 `merged: true` 最多只有一个（就是那个带下拉的组合）。

```ts
mergedOptions   // 能进下拉的配置（排除 split 的、disabled 的）
selectProp      // 下拉当前选中哪个 prop，比如 'classCode'
activeItem      // selectProp 对应的那条完整配置对象
```

`const mergedItem = activeItem.value` 先把「下拉当前选中的那条配置」存下来。

`if (mergedInserted || !mergedItem) return []` —— 不是独立项，那要不要渲染？

- `mergedInserted` 为 `true`：合并组已经占好位置了 → 后面所有非独立项统统丢弃（它们已经在字段下拉的列表里了，界面上不需要再出现）。
- `!mergedItem` 为 `true`：压根没有有效的选中字段 → 丢弃（防止画出一个空壳）。

### 查询对象注入 SEARCH_QUERY

需要读写查询对象的控件（如 daterange 拆两字段）自行 `inject`，主组件不逐个透传：

```ts
// controls/context.ts
export const SEARCH_QUERY: InjectionKey<Ref<Record<string, any>>> = Symbol('CommonSearchItemQuery')
```

```ts
// index.vue 提供
provide(SEARCH_QUERY, query)

// DatePickerControl.vue 消费
const query = inject(SEARCH_QUERY)
```

对比旧实现：以前是把 `query` 塞进 `controlProps` 再透传给 date 控件；现在改为 `provide/inject`，控件按需取用，主组件不再关心哪个控件需要 `query`。

### BindableProps 与 WithoutModel

#### BindableProps

输入一个**组件类型**（即 `typeof ElInput` 这种“类/构造函数”类型），输出该组件的 `$props` 类型，也就是 `v-bind` 可以展开到该组件上的全部属性集合。

| 片段 | 含义 |
| --- | --- |
| `type BindableProps<C ...>` | 泛型类型别名，`C` 是类型参数 |
| `C extends abstract new (...args: any[]) => any` | 约束 `C` 必须是**构造签名**：能 `new`、参数任意、返回任意实例。`abstract new` 表示同时接受抽象构造签名 |
| `InstanceType<C>` | TS 内置工具类型：从构造函数类型中取出**实例类型**。`C = typeof ElInput` → 得到 ElInput 的组件实例类型 |
| `InstanceType<C>['$props']` | **索引访问类型**（`T['K']`），取实例上 `$props` 属性的类型 |

之所以要 `C extends abstract new ...`，是因为 `InstanceType` 自身的约束就是 `abstract new (...args: any) => any`。**约束写成这个形状，任何能传给 `InstanceType` 的类型都能传给 `BindableProps`**；如果只写 `new (...args: any[]) => any`，那么带抽象构造签名的组件类型会被拒绝并报“不满足约束”。

##### 为什么是 `$props` 而不是 `props`

这是这段代码存在的**核心理由**。Vue 3 的类型定义（`node_modules/@vue/runtime-core/dist/runtime-core.d.ts`）中：

```ts
$props: Prettify<P> & PublicProps
// PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps
```

`$props` 比 `props` 多出：

1. **emits 对应的事件属性**：`EmitsToProps<E>` 会把 `emits` 展开成 `onXxx`（如 `onChange`、`'onUpdate:modelValue'`），并且先合并进 `P`，再拼上 `PublicProps`；
2. **`v-bind` 才允许的通用属性**：`class`、`style`（`AllowedComponentProps`），以及 `key` / `ref` / `onVnodeBeforeMount` 等 `VNodeProps`；
3. **有默认值的 props 变为可选**：`DefineComponent` 的 `MakeDefaultsOptional = true`，所以 Element Plus 那些带 default 的 prop 在这里都是可选的。

正因如此，注释才写：**“包含组件自身 props 与 emits 对应的 onXxx 事件属性，即 v-bind 可绑定的完整属性集合”**。如果把 `'$props'` 换成 `'props'`，就会丢掉 `onXxx` 事件和 `class` / `style`，导致 `v-bind` 展开时报错。

#### WithoutModel

`v-model` 由 CommonSearchItem 的 `defineModel` 统一接管，所以 `options.props` 的类型里剔除与 v-model 相关的属性：

```ts
export type WithoutModel<P> = Omit<P, 'modelValue' | 'onUpdate:modelValue' | 'modelModifiers'>
```

## 源码

### `CommonSearchItem/index.vue`

```vue
<template>
  <el-form-item
    v-for="entry in entries"
    :key="entry.item.prop"
    :prop="entry.item.prop"
    :rules="entry.item.rules"
    :label="entry.merged || (entry.item.labelWidth ?? labelWidth) === 0 ? '' : entry.item.label"
    :label-width="entry.merged ? 0 : entry.item.labelWidth ?? labelWidth ?? ''">
    <div :class="['search-control', { 'merge-group': entry.merged }]">
      <div
        v-if="entry.merged"
        class="merge-group__prepend"
        :style="prependStyle">
        <el-select
          v-model="selectProp"
          :filterable="selectFilterable">
          <el-option
            v-for="option in mergedOptions"
            :key="option.prop"
            :label="option.label"
            :value="option.prop" />
        </el-select>
      </div>

      <!-- 标记 slot 的项，控件区交给 control-<prop> 插槽，其余项使用内置控件 -->
      <slot
        v-if="entry.item.slot"
        :name="`control-${entry.item.prop}`"
        :query />

      <component
        v-else
        :is="entry.control"
        v-model="query[entry.item.prop]"
        v-bind="entry.controlAttrs"
        :class="{ 'merge-group__control': entry.merged }"
        :style="entry.style">
        <!-- 把消费方 `${type}-${prop}-${slotName}` 命名的插槽转发给控件内部 `<slotName>` 插槽 -->
        <template
          v-for="forward in forwardSlotsOf(entry.item.type, entry.item.prop)"
          :key="forward.name"
          #[forward.slotName]="slotProps">
          <slot
            :name="forward.name"
            v-bind="slotProps"
            :query />
        </template>
      </component>
    </div>
  </el-form-item>

  <!-- 与 type 无关，始终独立渲染 -->
  <slot
    name="append"
    :query />
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
  import type { CommonSearchItemOptions, CommonSearchItemOptionsType, CommonSearchItemProps, SelectOptionProps } from './types'
  import type { Component } from 'vue'

  import { toValue, useSlots } from 'vue'
  import { useStyle, useUnit } from '@/hooks/useStyle'

  import { controlOf } from './controls'
  import { SEARCH_QUERY } from './controls/context'

  const props = withDefaults(defineProps<CommonSearchItemProps<T>>(), {
    type: 'split',
    prependWidth: 100,
    inputWidth: 200,
    defaultPlaceholder: 'custom',
    selectFilterable: true,
  })

  const query = defineModel<T>({
    default: () => ({})
  })

  /** 需要读写查询对象的控件（如 daterange 拆两字段）自行 inject，父组件不逐个透传 */
  provide(SEARCH_QUERY, query)

  defineSlots<{
    /** options 中标记 slot 的项的控件区，按 prop 命名，如 #control-status */
    [key: `control-${string}`]: ((props: { query: T }) => any) | undefined
    /** 与 type 无关，始终渲染在所有表单项之后 */
    append?: (props: { query: T }) => any
    /**
     * 控件内部插槽转发，按 `${type}-${prop}-${slotName}` 命名，转发给控件的 `<slotName>` 插槽
     * 如 #treeSelect-parentId-default 转发给 el-tree-select 的 #default 插槽
     */
    [key: string]: ((props: any) => any) | undefined
  }>()

  /** 当前组件接收到的所有插槽（用于动态转发给控件内部） */
  const slots = useSlots()

  /** 收集以 `${type}-${prop}-` 为前缀的插槽，返回原插槽名与去掉前缀后的目标插槽名 */
  const forwardSlotsOf = (type: CommonSearchItemOptionsType | undefined, prop: string) => {
    const prefix = `${type ?? 'input'}-${prop}-`
    return Object.keys(slots)
      .filter(name => name.startsWith(prefix))
      .map(name => ({ name, slotName: name.slice(prefix.length) }))
  }

  /** 是否为拆分模式 */
  const isSplit = computed(() => props.type === 'split')

  /** 参与合并（字段下拉）的配置项 */
  const mergedOptions = computed(() => props.options.filter((item) => !item.split && !toValue(item.disabled)))

  /** 标记为默认项的配置项（仅允许一项配置） */
  const defaultItem = computed(() => mergedOptions.value.find((item) => toValue(item.isDefault)))

  /** 合并模式下取默认字段：isDefault 优先，其次 defaultQueryProp 指定，最后回落第一个合并项 */
  const resolveSelectProp = () =>
    defaultItem.value?.prop ??
    mergedOptions.value.find((item) => item.prop === props.defaultQueryProp)?.prop ??
    mergedOptions.value[0]?.prop

  /** 合并模式下当前选中的字段 */
  const selectProp = shallowRef(resolveSelectProp())

  /** 合并模式下当前选中的配置项 */
  const activeItem = computed(() => mergedOptions.value.find((item) => item.prop === selectProp.value))

  /** options 动态变化时同步：DEV 下校验 isDefault 唯一，当前字段失效时重算 */
  watchEffect(() => {
    if (import.meta.env.DEV) {
      const defaults = mergedOptions.value.filter((item) => toValue(item.isDefault))
      if (defaults.length > 1) {
        console.warn(`[CommonSearchItem] options 中只能有一项配置 isDefault，已使用「${defaults[0].label}」`)
      }
    }

    if (!mergedOptions.value.some((item) => item.prop === selectProp.value)) {
      selectProp.value = resolveSelectProp()
    }
  })

  interface ControlAttrs {
    /** 控件透传属性 */
    controlProps: Record<string, any>
    /** 选项数据，select 类控件使用 */
    options: Record<string, any>[]
    optionKey: string
    optionLabel: string | ((option: Record<string, any>) => string)
  }

  interface DisplayEntry {
    item: CommonSearchItemOptions<T>
    /** 是否为合并组的字段（带字段下拉） */
    merged: boolean
    /** 控件组件（由控件注册表决定） */
    control: Component
    /** 统一透传给控件的属性 */
    controlAttrs: ControlAttrs
    style: string
  }

  /** ElementPlus 等控件的选项配置 */
  const metaOf = (item: CommonSearchItemOptions<T>) => (item.props ?? {}) as unknown as SelectOptionProps

  /** ElementPlus 等已注册控件的透传自有属性 */
  const controlPropsOf = (item: CommonSearchItemOptions<T>) => {
    const meta = metaOf(item) as Record<string, any>
    const { ...rest } = meta

    // select 类控件的选项字段（data/label/key）由 options/optionKey/optionLabel 消费，不透传
    // tree-select 的 data 是树形数据，应直接透传给 el-tree-select；data 可能是 Ref/getter，这里解包
    if (item.type === 'treeSelect') {
      return {
        ...rest,
        data: toValue(rest.data) ?? [],
        placeholder:
          props.defaultPlaceholder === 'custom'
            ? item.placeholder ?? rest.placeholder ?? item.label
            : props.defaultPlaceholder,
        /** 同一设置所有可清空clearable为true */
        clearable: rest.clearable ?? true,
      }
    }

    const { data: _data, label: _label, key: _key, ...controlProps } = rest
    return {
      ...controlProps,
      placeholder:
        props.defaultPlaceholder === 'custom'
          ? item.placeholder ?? controlProps.placeholder ?? item.label
          : props.defaultPlaceholder,
      /** 同一设置所有可清空clearable为true */
      clearable: controlProps.clearable ?? true,
    }
  }

  /** 组装单个渲染项 */
  const toEntry = (item: CommonSearchItemOptions<T>, merged: boolean): DisplayEntry => {
    const meta = metaOf(item)

    return {
      item,
      merged,
      control: controlOf(item.type),
      controlAttrs: {
        controlProps: controlPropsOf(item),
        options: toValue(meta.data ?? []) as Record<string, any>[],
        optionKey: meta.key ?? 'key',
        optionLabel: meta.label ?? 'label'
      },
      style: useStyle({ width: useUnit(item.inputSize?.width ?? props.inputWidth) }),
    }
  }

  /** 需要渲染的表单项：merge 时独立项各自成项，合并组占据首个合并字段的位置 */
  const entries = computed<DisplayEntry[]>(() => {
    /** 合并组是否已插入，避免重复插入 */
    let mergedInserted = false
    const mergedItem = activeItem.value

    return props.options.flatMap((item) => {
      if (isSplit.value || item.split) return [toEntry(item, false)]
      if (mergedInserted || !mergedItem) return []

      mergedInserted = true
      return [toEntry(mergedItem, true)]
    })
  })

  /** 字段选择区宽度 */
  const prependStyle = computed(() => useStyle({ width: useUnit(props.prependWidth) }))
</script>

<style scoped lang="scss">
  .search-control {
    display: inline-flex;
    align-items: center;
  }

  .merge-group {
    align-items: stretch;
  }

  .merge-group__prepend {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    background-color: var(--el-fill-color-light);
    border-top-left-radius: var(--el-input-border-radius);
    border-bottom-left-radius: var(--el-input-border-radius);
    box-shadow: 1px 0 0 0 var(--el-input-border-color) inset, 0 1px 0 0 var(--el-input-border-color) inset,
      0 -1px 0 0 var(--el-input-border-color) inset;
  }

  /* 下拉铺满字段区，去掉自身底色，让字段区的底色透出来 */
  .merge-group__prepend :deep(.el-select) {
    flex: 1;
  }

  .merge-group__prepend :deep(.el-select__wrapper) {
    background-color: transparent;
    color: inherit;
    box-shadow: 1px 0 0 0 var(--el-input-border-color) inset, 0 1px 0 0 var(--el-input-border-color) inset,
      0 -1px 0 0 var(--el-input-border-color) inset;
  }

  /* 控件区去掉左侧圆角，与字段区拼接（按控件类型分别覆盖其包裹层） */
  .merge-group__control {
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper),
    :deep(.el-date-editor) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
```

### `CommonSearchItem/types.ts`

```ts
import type { CommonSearchItemOptionsType, ControlPropsOf } from './controls'
import type { FormItemRule } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'

export type { CommonSearchItemOptionsType, ControlPropsMap, ControlPropsOf, ControlType } from './controls'
export type { BindableProps, DateRangeProps, SelectOptionProps } from './controls/types'

export type FieldKeys<T> = T extends string ? T : Extract<keyof T, string>

/** 基础搜索项配置，所有控件共享 */
interface CommonSearchItemBaseOptions<T> {
  /** 字段名（表单 key，需为查询对象上已存在的键） */
  prop: FieldKeys<T>
  label: string
  labelWidth?: string | number
  placeholder?: string
  /** 控件区宽度 */
  inputSize?: { width?: ID }
  /** 当 type = merge 时生效，是否单独出来 */
  split?: boolean
  /** 控件区是否由 control-<prop> 插槽接管 */
  slot?: boolean
  /** 是否禁用 */
  disabled?: MaybeRefOrGetter<boolean>
  /** 是否为合并组的默认字段（仅允许一项配置，优先于 defaultQueryProp） */
  isDefault?: MaybeRefOrGetter<boolean>
  /** 该项的校验规则；未配置时可回落到 TableSearch 上按 prop 配置的 rules */
  rules?: FormItemRule | FormItemRule[]
}

/** 单个搜索项配置：type 与 props 由控件表推导 */
type SearchItemOptionsOf<K extends CommonSearchItemOptionsType, T> = CommonSearchItemBaseOptions<T> &
  (K extends 'input' ? { type?: 'input'; props?: ControlPropsOf<K> } : { type: K; props?: ControlPropsOf<K> })

/**
 * 搜索项配置（联合类型自动覆盖控件表中的全部控件）
 * @typeParam T 查询对象类型
 */
export type CommonSearchItemOptions<T = string> = {
  [K in CommonSearchItemOptionsType]: SearchItemOptionsOf<K, T>
}[CommonSearchItemOptionsType]

export interface CommonSearchItemProps<T> {
  options: CommonSearchItemOptions<T>[]
  /** 展示方式：split 拆分为多个输入框；merge 合并为一个输入框 + 字段下拉 */
  type?: 'split' | 'merge'
  /** prepend宽度， type = merge 时生效 */
  prependWidth?: number
  /** 输入框宽度 */
  inputWidth?: number
  /** 全局 label 宽度（单项 options.labelWidth 优先） */
  labelWidth?: string | number
  /** 默认输入框占位提示 */
  defaultPlaceholder?: string | 'custom'
  /** 是否可筛选， type = merge 时生效 */
  selectFilterable?: boolean
  /** 默认查询字段， type = merge 时生效 */
  defaultQueryProp?: CommonSearchItemOptions<T>['prop']
}
```

### `CommonSearchItem/controls/context.ts`

```ts
import type { InjectionKey, Ref } from 'vue'

/**
 * 查询对象注入键
 *
 * 需要读写查询对象的控件（如 daterange 拆两字段）自行 inject，
 * CommonSearchItem 不负责逐个控件透传。
 */
export const SEARCH_QUERY: InjectionKey<Ref<Record<string, any>>> = Symbol('CommonSearchItemQuery')
```

### `CommonSearchItem/controls/types.ts`

```ts
import type { MaybeRefOrGetter } from 'vue'

/** 所有搜索控件统一接收的属性（v-model 由 defineModel 接管） */
export interface ControlProps {
  /** 由 CommonSearchItem 解析好的透传属性 */
  controlProps?: Record<string, any>
  /** 选项数据，select 类控件使用 */
  options?: Record<string, any>[]
  /** 选项取值字段 */
  optionKey?: string
  /** 选项显示字段名，或取显示文本的函数 */
  optionLabel?: string | ((option: Record<string, any>) => string)
}

/** 组件实例的 $props（含 emits 对应的 onXxx），即 v-bind 能绑定的全部属性 */
export type BindableProps<C extends abstract new (...args: any[]) => any> = InstanceType<C>['$props']

/** v-model 由 CommonSearchItem 接管，options.props 中不允许再传 */
export type WithoutModel<P> = Omit<P, 'modelValue' | 'onUpdate:modelValue' | 'modelModifiers'>

/** select 控件的选项取值配置（options 中的写法） */
export interface SelectOptionProps<R = any> {
  /** 选项数据，支持传入 Ref / getter */
  data?: MaybeRefOrGetter<R[] | undefined>
  /** 选项显示字段名，或取显示文本的函数（el-option 的 label 只接收字符串，函数在控件内求值） */
  label?: string | ((item: R) => string)
  /** 选项取值字段名 */
  key?: string
}

/** daterange 时把查询对象上的两个字段合成一个数组 */
export interface DateRangeProps {
  /** 开始字段名（daterange 时生效，对应 query 上的键） */
  start?: string
  /** 结束字段名（daterange 时生效，对应 query 上的键） */
  end?: string
}
```

### `CommonSearchItem/controls/index.ts`

```ts
import type { Component } from 'vue'
import type { ElDatePicker, ElInput, ElSelect, ElTreeSelect } from 'element-plus'
import type { BindableProps, DateRangeProps, SelectOptionProps, WithoutModel } from './types'

import DatePickerControl from './DatePickerControl.vue'
import InputControl from './InputControl.vue'
import SelectControl from './SelectControl.vue'
import TreeSelectControl from './TreeSelectControl.vue'

/**
 * 控件表：key 即 options 中的 `type`
 *
 * 新增控件只需两步：
 * 1. 新建 `XxxControl.vue`（接收统一的 `ControlProps`）；
 * 2. 在下面 `controls` 里加一行。
 *
 * 想在 options.props 上获得补全与校验，再在 `ControlPropsMap` 里补一行；不补也能用，props 退化为宽松类型。
 * `index.vue` 与 `CommonSearchItem/types.ts` 无需改动（type 联合由控件表自动推导）。
 */
export const controls = {
  input: InputControl,
  select: SelectControl,
  date: DatePickerControl,
  treeSelect: TreeSelectControl
}

/** 控件类型，由控件表自动推导 */
export type ControlType = keyof typeof controls

/** 控件类型（旧命名，保留兼容） */
export type CommonSearchItemOptionsType = ControlType

/**
 * 控件对外 props 类型表（可选）
 *
 * 键与 `controls` 对应；未登记的 type 在 options.props 上退化为 `Record<string, any>`
 */
export interface ControlPropsMap {
  input: BindableProps<typeof ElInput>
  select: BindableProps<typeof ElSelect> & SelectOptionProps
  date: BindableProps<typeof ElDatePicker> & DateRangeProps
  treeSelect: Omit<BindableProps<typeof ElTreeSelect>, 'data'> & Pick<SelectOptionProps, 'data'>
}

/** 按 type 取控件 props 类型，未登记的控件退化为宽松类型 */
export type ControlPropsOf<K extends ControlType> = K extends keyof ControlPropsMap
  ? WithoutModel<ControlPropsMap[K]>
  : Record<string, any>

/** 按 type 取控件组件，未匹配时回落到 input */
export const controlOf = (type?: ControlType): Component => controls[type ?? 'input'] ?? controls.input
```

### `CommonSearchItem/controls/InputControl.vue`

```vue
<template>
  <el-input
    v-bind="controlProps"
    v-model.trim="model">
    <!-- 转发消费方通过 #input-<prop>-<slot> 传入的插槽（如 #prefix / #suffix / #append） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-input>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchInput' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>
```

### `CommonSearchItem/controls/SelectControl.vue`

```vue
<template>
  <el-select
    v-bind="controlProps"
    v-model="model">
    <!-- 转发消费方通过 #select-<prop>-<slot> 传入的插槽（除 default 外，如 #header / #empty / #label） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        v-if="name !== 'default'"
        :name="name"
        v-bind="slotProps" />
    </template>
    <!-- default：消费方提供了 #select-<prop>-default 时覆盖，否则渲染内置选项 -->
    <template v-if="$slots.default" #default="slotProps">
      <slot
        name="default"
        v-bind="slotProps" />
    </template>
    <template v-else #default>
      <el-option
        v-for="option in options"
        :key="option[optionKey]"
        :label="labelOf(option)"
        :value="option[optionKey]" />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchSelect' })

  const props = withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
    options: () => [],
    optionKey: 'key',
    optionLabel: 'label',
  })

  const model = defineModel<any>()

  /** 选项显示文本：字段名或自定义函数（el-option 的 label 只接收字符串） */
  const labelOf = (option: Record<string, any>) =>
    typeof props.optionLabel === 'function' ? props.optionLabel(option) : option[props.optionLabel ?? 'label']
</script>
```

### `CommonSearchItem/controls/DatePickerControl.vue`

```vue
<template>
  <el-date-picker
    v-bind="pickerProps"
    v-model="pickerModel">
    <!-- 转发消费方通过 #date-<prop>-<slot> 传入的插槽（如 #default / #range-separator） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-date-picker>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  import { SEARCH_QUERY } from './context'

  defineOptions({ name: 'CommonSearchDatePicker' })

  const props = withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()

  /** 查询对象由 CommonSearchItem 注入（daterange 拆两字段时读写） */
  const query = inject(SEARCH_QUERY)

  /** daterange 且配置了 start/end 时，改用 query 上的两个字段组合/拆分 */
  const range = computed(() => {
    const { type, start, end } = props.controlProps ?? {}
    if (type !== 'daterange' || !start || !end || !query) return null
    return { query: query.value, start: String(start), end: String(end) }
  })

  /** 透传给 el-date-picker 的属性，剔除内部使用的 start / end */
  const pickerProps = computed(() => {
    const { start: _start, end: _end, ...rest } = props.controlProps ?? {}
    return rest
  })

  /**
   * 日期值：配置 start/end 时把两个字段组合成 [start, end]，选择后反向拆回两个字段；
   * 未配置时沿用默认 v-model
   */
  const pickerModel = computed<any>({
    get: () => {
      if (!range.value) return model.value
      const { query, start, end } = range.value
      const startValue = query[start]
      const endValue = query[end]
      // 两个字段都为空时返回 null，交给 el-date-picker 明确清空（返回 [undefined, undefined] 会被当成有值）
      return startValue || endValue ? [startValue, endValue] : null
    },
    set: (value: unknown) => {
      if (!range.value) {
        model.value = value
        return
      }
      const { query, start, end } = range.value
      const [startValue, endValue] = Array.isArray(value) ? value : []
      query[start] = startValue ?? undefined
      query[end] = endValue ?? undefined
    },
  })
</script>
```

### `CommonSearchItem/controls/TreeSelectControl.vue`

```vue
<template>
  <el-tree-select
    v-bind="controlProps"
    v-model="model">
    <!-- 把父级透传过来的插槽（如 #default / #label）原样转发给 el-tree-select -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-tree-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchTreeSelect' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>
```

## 使用示例

```vue
<template>
  <CompTableSearch
    :model="query"
    :loading="loading"
    @search="handleSearch"
    @reset="handleReset">
    <!-- ① merge：一个输入框 + 字段下拉 + 独立项 + 自定义控件 + append -->
    <template #left>
      <CompCommonSearchItem
        v-model="query"
        type="merge"
        default-query-prop="status"
        :prepend-width="120"
        :input-width="260"
        select-filterable
        :options="mergeOptions">
        <!-- 自定义控件：options 中 slot: true 的项，插槽名为 control-<prop> -->
        <template #control-startDate="{ query }">
          <el-date-picker
            v-model="query.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"
            clearable
            style="width: 260px" />
        </template>

        <!-- 与 type 无关，始终渲染在所有表单项之后 -->
        <template #append="{ query }">
          <el-button
            icon="Filter"
            @click="handleToggleAdvanced(query)">
            高级筛选
          </el-button>
        </template>

        <!-- 以下两个插槽会按 `${type}-${prop}-${slotName}` 规则穿透到 el-tree-select 内部 -->
        <!-- 转发至 el-tree-select 的 #label 插槽：自定义选中项展示 -->
        <template #treeSelect-parentId-label="{ label, value }">
          <span>{{ treeSelectLabel(label, value, functionalClassTree) }}</span>
        </template>
        <!-- 转发至 el-tree-select 的 #default 插槽：自定义树节点展示 -->
        <template #treeSelect-parentId-default="{ node, data }">
          <span>{{ data.classCode }} {{ node.label }}</span>
        </template>
      </CompCommonSearchItem>
    </template>

    <template #right>
      <slot />
    </template>
  </CompTableSearch>

  <!-- ② split：每项一个独立输入框，共用同一个固定 placeholder -->
  <CompTableSearch
    :model="splitQuery"
    :loading="loading"
    @search="handleSearch"
    @reset="handleReset">
    <template #left>
      <CompCommonSearchItem
        v-model="splitQuery"
        type="split"
        default-placeholder="请输入搜索内容"
        :input-width="180"
        :options="splitOptions" />
    </template>
  </CompTableSearch>
</template>

<script lang="ts" setup>
  import type { RequestList } from '../index.vue'
  import type { CommonSearchItemOptions } from '@/components/CommonSearchItem/types'

  import { defineSearchEmits, defineSearchProps, useSearch } from '@/hooks/useSearch'
  import { useEnumArray } from '@/hooks/useEnum'
  import { EnableStatus } from '@/enum/index'

  import CompTableSearch from '@/components/TableSearch/index.vue'
  import CompCommonSearchItem from '@/components/CommonSearchItem/index.vue'

  const props = defineProps({
    ...defineSearchProps<RequestList>(),
  })

  const emit = defineEmits([...defineSearchEmits()])

  /** 搜索基础数据 */
  const { query, handleReset, handleSearch } = useSearch<RequestList>(props, { emit })

  /** 下拉数据源，key/label 默认取 data 上的 key/label 字段 */
  const typeList = [
    { code: '1', name: '采购' },
    { code: '2', name: '销售' },
  ]

  /** merge 模式：参与字段下拉的项 */
  const mergeOptions: CommonSearchItemOptions<RequestList>[] = [
    {
      prop: 'classCode',
      label: '编码',
      // type 省略即为 input；placeholder 省略时取 label
      inputSize: { width: 300 },
    },
    {
      prop: 'className',
      label: '名称',
      props: {
        placeholder: '请输入名称',
        // clearable 默认 true，这里演示置 false
        clearable: false,
      },
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      props: {
        data: useEnumArray(EnableStatus, { key: 'key', value: 'label' }),
        // 下拉选中后立即触发查询（el-select 的 change 事件，经 BindableProps 透传）
        onChange: handleSearch,
      },
    },
    {
      prop: 'type',
      label: '类型',
      type: 'select',
      // 覆盖 data 的取值字段，并开启可筛选
      props: { data: typeList, key: 'code', label: 'name', filterable: true },
    },
    // split: true —— 不进字段下拉，独立成一个带 label 的表单项
    {
      prop: 'projectName',
      label: '项目',
      split: true,
      labelWidth: '60px',
      inputSize: { width: 220 },
    },
    // slot: true —— 控件区交给 #control-startDate 插槽（date 类型未内置，需自定义）
    {
      prop: 'startDate',
      label: '开始日期',
      type: 'date',
      slot: true,
      split: true,
    },
    {
      prop: 'beginPeriod',
      label: '开始期间',
      type: 'date',
      props: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        start: 'beginPeriod',
        end: 'endPeriod',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
    {
      prop: 'parentId',
      label: '上级分类',
      type: 'treeSelect',
      props: {
        data: functionalClassTree,
        nodeKey: 'id',
        checkStrictly: true,
        filterable: true,
        renderAfterExpand: false,
        props: { label: 'className', children: 'children' },
        onChange: handleSearch,
      },
    },
  ]

  /** split 模式：每项一个独立输入框 */
  const splitQuery = reactive<RequestList>({ ...props.modelValue })

  const splitOptions: CommonSearchItemOptions<RequestList>[] = [
    { prop: 'classCode', label: '编码' },
    { prop: 'className', label: '名称', inputSize: { width: 240 } },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      props: {
        data: useEnumArray(EnableStatus, { key: 'key', value: 'label' }),
        onChange: handleSearch,
      },
    },
  ]

  const handleToggleAdvanced = (query: RequestList) => {
    void query
  }
</script>
```
