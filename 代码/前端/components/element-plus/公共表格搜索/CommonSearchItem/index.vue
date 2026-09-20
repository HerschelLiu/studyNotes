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
