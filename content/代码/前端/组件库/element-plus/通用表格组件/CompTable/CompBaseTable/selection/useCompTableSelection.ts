import type { ComputedRef } from 'vue'

import { reactive, computed, watch } from 'vue'

import { deleteSelectedList, putSelectedList, rowKeyOf, splitKeys } from '@/utils/selectionKey'

interface Options<R extends Record<string, any>> {
  getKeys: () => string
  getSelected: () => R[]
  /** 含树形子行，用于同步勾选态 */
  getRows: () => R[]
  /** 全选范围：树形表只选顶层行 */
  getCheckableRows: () => R[]
  onSelectedChange: (rows: R[]) => void
}

/**
 * 勾选态不写 row.checked：el-table 对 data 深监听，写行数据会整表重渲染。
 * 主键去重 / 差集复用 @/utils/selectionKey。
 */
export const useCompTableSelection = <R extends Record<string, any>>({
  getKeys,
  getSelected,
  getRows,
  getCheckableRows,
  onSelectedChange
}: Options<R>) => {
  const fields = computed(() => splitKeys(getKeys()))

  /** 未传 keys 时用行对象身份生成 key，保证各行独立 */
  const fallbackKeys = new WeakMap<object, string>()
  let fallbackSeed = 0

  const keyOf = (row: R) => {
    if (fields.value.length) return rowKeyOf(row, fields.value)
    let key = fallbackKeys.get(row)
    if (!key) {
      key = `row-${++fallbackSeed}`
      fallbackKeys.set(row, key)
    }
    return key
  }

  const state = reactive(new Map<string, boolean>())

  const checkableRows = computed(() => getCheckableRows().filter(row => !row.disabled))
  const checkableKeys: ComputedRef<string[]> = computed(() => checkableRows.value.map(row => keyOf(row)))

  /** 外部清空 selected / 跨页返回 / 数据刷新时同步当前页勾选态 */
  const syncFromSelected = () => {
    const rows = getRows()
    const selectedKeys = new Set(getSelected().map(row => keyOf(row)))
    rows.forEach(row => {
      const key = keyOf(row)
      const checked = selectedKeys.has(key)
      if (state.get(key) !== checked) state.set(key, checked)
    })
    // 已离开当前页的 key 不再保留，避免跨页访问后状态无限累积
    const pageKeys = new Set(rows.map(row => keyOf(row)))
    for (const key of [...state.keys()]) {
      if (!pageKeys.has(key)) state.delete(key)
    }
  }

  watch([fields, () => getRows(), () => getSelected()], syncFromSelected, { immediate: true })

  const commit = (rows: R[]) => onSelectedChange(rows)

  const toggle = (row: R, checked: boolean) => {
    const rowKey = keyOf(row)
    state.set(rowKey, checked)
    commit(checked ? putSelectedList(getSelected(), [row], getKeys()) : deleteSelectedList(getSelected(), [row], getKeys()))
  }

  const toggleAll = (checked: boolean) => {
    const rows = checkableRows.value
    rows.forEach(row => state.set(keyOf(row), checked))
    commit(checked ? putSelectedList(getSelected(), rows, getKeys()) : deleteSelectedList(getSelected(), rows, getKeys()))
  }

  return { state, keyOf, checkableKeys, toggle, toggleAll }
}
