```ts
import type { ComputedRef, Ref } from 'vue'

import { computed, unref } from 'vue'

import { deleteSelectedList, putSelectedList, rowKeyOf, splitKeys } from '@/hooks/useCheckAll'
import { useError } from '@/hooks/useTip'

/** 选择操作 */
export const SelectAction = {
  /** 选择 */
  Select: 1,
  /** 取消 */
  Remove: 2
} as const
export type SelectAction = (typeof SelectAction)[keyof typeof SelectAction]

/** useSelect 依赖的组件 props */
export interface UseSelectProps {
  /** 最大选择数量，0 表示不限制 */
  maxLength?: number
  /** 最小选择数量，默认 1 */
  minLength?: number
}

/** useSelect 依赖的列表对象 */
interface UseSelectList<Q, R> {
  /** 请求参数 */
  query: Q
  /** 当前页数据 */
  items: R[]
}

/** useSelect 依赖的跨页选择对象 */
interface UseSelectCheckAll<R> {
  /** 跨页已选数据 */
  selected: Ref<R[]>
}

/** 主键字段：'id' / 'id-type'（复合主键） */
type SelectKeys = Ref<string> | ComputedRef<string> | string

/**
 * 选择弹窗，用于抽屉中的选择组件
 *
 * - 主键比较统一复用 useCheckAll 的 `rowKeyOf`，与全选/清除本页保持一致的复合主键语义
 * - 已选主键用 computed Set 缓存，`includesRow` 从 O(n) 降为 O(1)
 * - `maxLength = 0` 表示不限制数量
 */
export function useSelect<Q, R extends object>(
  props: UseSelectProps,
  context: { emit: (event: any, ...args: any[]) => void },
  checkAll: UseSelectCheckAll<R>,
  list: UseSelectList<Q, R>,
  keys: SelectKeys,
  callback?: () => void
) {
  /** 主键字段列表（支持运行时切换，如 id -> dept_id） */
  const fields = computed(() => splitKeys(unref(keys)))

  /** 已选主键集合：选择或主键变化时重建，避免逐行解析主键 */
  const selectedKeySet = computed(() => new Set(checkAll.selected.value.map(row => rowKeyOf(row, fields.value))))

  /** 最大选择数量，0 表示不限制 */
  const getMaxLength = () => props.maxLength ?? 0

  /** 最小选择数量，默认 1 */
  const getMinLength = () => props.minLength ?? 1

  /** 保存 */
  const handleSave = () => {
    const selected = checkAll.selected.value
    const maxLength = getMaxLength()
    const minLength = getMinLength()

    if (selected.length < minLength) {
      useError(`至少需要选择${minLength}条数据`)
      return
    }
    if (maxLength > 0 && selected.length > maxLength) {
      useError(`最多只能选择${maxLength}条数据`)
      return
    }

    // 当前页存在的行用最新对象回填，跨页行保留原对象；按主键建 Map 避免逐个 find
    const currentItems = new Map<string, R>()
    list.items.forEach(item => currentItems.set(rowKeyOf(item, fields.value), item))
    const rows = selected.map(item => currentItems.get(rowKeyOf(item, fields.value)) ?? item)

    context.emit('update:modelValue', false)
    context.emit('change', rows)
    callback?.()
  }

  /** 选择 / 取消 */
  const handleChecked = (row: R, action: SelectAction = SelectAction.Select) => {
    const selected = checkAll.selected.value
    const rowKey = rowKeyOf(row, fields.value)

    if (action === SelectAction.Remove) {
      checkAll.selected.value = selected.filter(item => rowKeyOf(item, fields.value) !== rowKey)
      return
    }

    // 先按主键去重，避免同一行重复入列
    const rest = selected.filter(item => rowKeyOf(item, fields.value) !== rowKey)
    const maxLength = getMaxLength()

    let next: R[]
    if (maxLength === 1) {
      next = [row]
    } else if (maxLength === 0) {
      next = [...rest, row]
    } else {
      // 超出上限时移除末位，为新选择腾出名额（保持原有交互）
      next = [...rest.slice(0, maxLength - 1), row]
    }

    checkAll.selected.value = next

    // 达到上限自动保存（赋值后即可判定，无需 nextTick）
    if (maxLength > 0 && next.length >= maxLength) handleSave()
  }

  /** 清除所有 */
  const handleRemove = () => {
    checkAll.selected.value = []
  }

  /** 全选本页 */
  const handleSelectedPage = () => {
    checkAll.selected.value = putSelectedList(checkAll.selected.value, list.items, unref(keys))
  }

  /** 清除本页 */
  const handleRemovePage = () => {
    checkAll.selected.value = deleteSelectedList(checkAll.selected.value, list.items, unref(keys))
  }

  /** 是否已选择 */
  const includesRow = (row: R) => selectedKeySet.value.has(rowKeyOf(row, fields.value))

  /** 是否已有选择 */
  const isChecked = computed(() => list.items.some(includesRow))

  return {
    /** 选择 */
    handleChecked,
    /** 保存 */
    handleSave,
    /** 清除所有 */
    handleRemove,
    /** 全选本页 */
    handleSelectedPage,
    /** 清除本页 */
    handleRemovePage,
    /** 是否已选择 */
    includesRow,
    /** 是否已有选择 */
    isChecked
  }
}

```

