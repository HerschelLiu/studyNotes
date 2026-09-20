### `CommonSearchItem/index.vue`

```vue
<template>
  <el-form-item
    v-for="entry in entries"
    :key="entry.item.prop"
    :label="entry.merged ? '' : entry.item.label"
    :label-width="entry.merged ? 0 : entry.item.labelWidth ?? ''">
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
        v-model.trim="query[entry.item.prop]"
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
  import type { CommonSearchItemOptions, CommonSearchItemOptionsType, SelectOptionProps } from './types'
  import type { Component } from 'vue'

  import { toValue, useSlots } from 'vue'
  import { useStyle, useUnit } from '@/hooks/useStyle'

  import { definitionOf } from './controls'

  interface Props {
    options: CommonSearchItemOptions<T>[]
    /** 展示方式：split 拆分为多个输入框；merge 合并为一个输入框 + 字段下拉 */
    type?: 'split' | 'merge'
    /** prepend宽度， type = merge 时生效 */
    prependWidth?: number
    /** 输入框宽度 */
    inputWidth?: number
    /** 默认输入框占位提示 */
    defaultPlaceholder?: string | 'custom'
    /** 是否可筛选， type = merge 时生效 */
    selectFilterable?: boolean
    /** 默认查询字段， type = merge 时生效 */
    defaultQueryProp?: CommonSearchItemOptions<T>['prop']
  }
  const props = withDefaults(defineProps<Props>(), {
    type: 'split',
    prependWidth: 100,
    inputWidth: 200,
    defaultPlaceholder: 'custom',
    selectFilterable: true,
  })

  const query = defineModel<T>({
    default: () => ({})
  })

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
    optionLabel: string
    changeFn?: (val: any) => void
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
    const { changeFn: _changeFn, ...rest } = meta

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
    const definition = definitionOf(item.type)
    const meta = metaOf(item)

    return {
      item,
      merged,
      control: definition.component,
      controlAttrs: {
        controlProps: controlPropsOf(item),
        options: toValue(meta.data ?? []) as Record<string, any>[],
        optionKey: String(meta.key ?? 'key'),
        optionLabel: String(meta.label ?? 'label'),
        changeFn: meta.changeFn,
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
import type { DatePickerPropsPublic, InputPropsPublic, SelectPropsPublic, ElTreeSelect } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'

export type CommonSearchItemOptionsType = 'input' | 'select' | 'date' | 'treeSelect'

export type FieldKeys<T> = T extends string ? T : Extract<keyof T, string>

/** select 选项数据及取值配置，仅用于生成选项，不会透传给控件 */
export interface SelectOptionProps {
  data?: MaybeRefOrGetter<Record<string, any>[]>
  label?: string
  key?: string
  changeFn?: (val: any) => void
}

/** ElSelect 的全部对外属性，并兼容选项字段 */
export type SelectControlProps = SelectPropsPublic & SelectOptionProps

/** ElTreeSelect 的全部对外属性（由组件实例 $props 推导），并兼容 changeFn。data 接受 Ref/getter，由控件内部解包 */
export type TreeSelectControlProps = Omit<InstanceType<typeof ElTreeSelect>['$props'], 'data'> & {
  /** 树形数据，可传 Ref/getter（允许 undefined 占位），由 CommonSearchItem 内部用 toValue 解包后透传 */
  data?: MaybeRefOrGetter<Record<string, any>[] | undefined>
  /** 值变化回调，由 CommonSearchItem 消费，不会透传给控件 */
  changeFn?: (val: any) => void
}

interface CommonSearchItemBaseOptions<T> {
  /** 字段名（表单 key，需为查询对象上已存在的键） */
  prop: FieldKeys<T>
  label: string
  labelWidth?: string | number
  placeholder?: string
  /** 控件区宽度 */
  inputSize?: { width?: number | string }
  /** 当type = merge 时生效，是否单独出来 */
  split?: boolean
  /** 控件区是否由 control-<prop> 插槽接管 */
  slot?: boolean
  /** 是否禁用 */
  disabled?: MaybeRefOrGetter<boolean>
  /** 是否为合并组的默认字段（仅允许一项配置，优先于 defaultQueryProp） */
  isDefault?: MaybeRefOrGetter<boolean>
}

export interface InputSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type?: 'input'
  /** ElInput 的属性，通过 v-bind 透传 */
  props?: InputPropsPublic
}

export interface SelectSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'select'
  /** ElSelect 及选项数据配置，控件属性通过 v-bind 透传 */
  props?: SelectControlProps
}

export interface DatePickerSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'date'
  /** ElDatePicker 的属性，通过 v-bind 透传 */
  props?: DatePickerPropsPublic
}

export interface TreeSelectSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'treeSelect'
  /** ElTreeSelect 的属性（含 data 树形数据），通过 v-bind 透传 */
  props?: TreeSelectControlProps
}

/**
 * 搜索项配置
 * @typeParam T 查询对象类型
 */
export type CommonSearchItemOptions<T = string> =
  | InputSearchItemOptions<T>
  | SelectSearchItemOptions<T>
  | DatePickerSearchItemOptions<T>
  | TreeSelectSearchItemOptions<T>

```



### `CommonSearchItem/controls/types.ts`

```ts
import type { Component } from 'vue'

/** 所有搜索控件统一接收的属性（v-model 由 defineModel 接管） */
export interface ControlProps {
  /** 由 CommonSearchItem 解析好的透传属性 */
  controlProps?: Record<string, any>
  /** 选项数据，select 类控件使用 */
  options?: Record<string, any>[]
  optionKey?: string
  optionLabel?: string
  changeFn?: (val: any) => void
}

/** 控件注册表条目 */
export interface ControlDefinition {
  component: Component
}

```



### `CommonSearchItem/controls/index.ts`

```ts
import type { CommonSearchItemOptionsType } from '../types'
import type { ControlDefinition } from './types'

import DatePickerControl from './DatePickerControl.vue'
import InputControl from './InputControl.vue'
import SelectControl from './SelectControl.vue'
import TreeSelectControl from './TreeSelectControl.vue'

/**
 * 控件注册表
 */
export const controlRegistry: Record<string, ControlDefinition> = {
  input: { component: InputControl },
  select: { component: SelectControl },
  date: { component: DatePickerControl },
  treeSelect: { component: TreeSelectControl }
}

/** 按 type 取控件注册表中的控件，默认 input */
export const definitionOf = (type?: CommonSearchItemOptionsType) => controlRegistry[type ?? 'input'] ?? controlRegistry.input

```



### `CommonSearchItem/controls/InputControl.vue`

```vue
<template>
  <el-input
    v-bind="controlProps"
    v-model="model" />
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
    v-model="model"
    @change="changeFn">
    <el-option
      v-for="option in options"
      :key="option[optionKey]"
      :label="option[optionLabel]"
      :value="option[optionKey]" />
  </el-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchSelect' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
    options: () => [],
    optionKey: 'key',
    optionLabel: 'label',
  })

  const model = defineModel<any>()
</script>

```



### `CommonSearchItem/controls/DatePickerControl.vue`

```vue
<template>
  <el-date-picker
    v-bind="controlProps"
    v-model="model" />
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchDatePicker' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>

```



### `CommonSearchItem/controls/TreeSelectControl.vue`

```vue
<template>
  <el-tree-select
    v-bind="controlProps"
    v-model="model"
    @change="changeFn">
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



### 说明

核心： `entries计算属性`

```
options 有 4 项配置：
  编码、名称、状态、项目(项目标了 split:true)

界面只画 2 个表单项：
  ┌──────────┬──────────────┐   ┌──────┬────────┐
  │  编码 ▾  │  [输入框]     │   │ 项目 │ [输入框]│
  └──────────┴──────────────┘   └──────┴────────┘
     ← 合并组（1个）              ← 独立项（1个）
```

* `flatMap` 把三次返回的`[entry]` 、`[]` 、`[]` 拍平拼接，最终得到只含 1 个 entry 的数组；`flatMap` 是唯一能一步表达「跳过」的数组方法。。使用map：每一项都要输出，若没有要输出undefined，最后再用filter，麻烦

result中`merged`区分合并组还是合并项

**关键**： 整个数组里`merged: true` 最多只有一个 （就是那个带下拉的组合）。

```ts
mergedOptions   // 能进下拉的配置（排除 split 的、disabled 的）
selectProp      // 下拉当前选中哪个 prop，比如 'classCode'
activeItem      // selectProp 对应的那条完整配置对象
```

`const mergedItem = activeItem.value`先把「下拉当前选中的那条配置」存下来

`if (mergedInserted || !mergedItem) continue`不是独立项，那要不要渲染？:

- `mergedInserted` 为`true` ：合并组已经占好位置了 → 后面所有非独立项统统丢弃（它们已经在字段下拉的列表里了，界面上不需要再出现）
- `!mergedItem` 为`true` ：压根没有有效的选中字段 → 丢弃（防止画出一个空壳）



### 使用示例

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
      placeholder: '请输入名称',
      // clearable 默认 true，这里演示置 false
      clearable: false,
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      props: {
        data: useEnumArray(EnableStatus, { key: 'key', value: 'label' }),
        // 下拉选中后立即触发查询
        changeFn: handleSearch,
      },
    },
    {
      prop: 'type',
      label: '类型',
      type: 'select',
      // 覆盖 data 的取值字段
      filterable: true,
      props: { data: typeList, key: 'code', label: 'name' },
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
        changeFn: handleSearch,
      },
    }
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
        changeFn: handleSearch,
      },
    },
  ]

  const handleToggleAdvanced = (query: RequestList) => {
    void query
  }
</script>
```

