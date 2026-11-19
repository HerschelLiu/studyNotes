import { computed, nextTick, watch } from 'vue'

import { putSelectedList, rowKeyOf, splitKeys } from '@/utils/selectionKey'

export interface NativeSelectionTable<R> {
  toggleRowSelection: (row: R, selected?: boolean) => void
}

interface Options<R extends Record<string, any>> {
  getKeys: () => string
  getSelected: () => R[]
  getRows: () => R[]
  getTable: () => NativeSelectionTable<R> | null | undefined
  onSelectedChange: (rows: R[]) => void
}

export const useNativeSelection = <R extends Record<string, any>>({
  getKeys,
  getSelected,
  getRows,
  getTable,
  onSelectedChange
}: Options<R>) => {
  const fields = computed(() => splitKeys(getKeys()))
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

  let syncing = false
  let lastEmitted: R[] | null = null
  let lastRows: R[] | null = null

  const sameSelection = (a: R[], b: R[]) => {
    if (a.length !== b.length) return false
    const bKeys = new Set(b.map(row => keyOf(row)))
    return a.every(row => bKeys.has(keyOf(row)))
  }

  const handleSelectionChange = (rowsSelected: R[]) => {
    if (syncing) return
    const rows = getRows()
    const pageKeys = new Set(rows.map(row => keyOf(row)))
    const kept = getSelected().filter(row => !pageKeys.has(keyOf(row)))
    const next = putSelectedList(kept, rowsSelected, getKeys())
    if (sameSelection(next, getSelected())) return
    lastEmitted = next
    onSelectedChange(next)
  }

  const syncTableSelection = async () => {
    const rows = getRows()
    const selected = getSelected()
    const rowsChanged = rows !== lastRows
    lastRows = rows
    if (!rowsChanged && lastEmitted && sameSelection(selected, lastEmitted)) return
    syncing = true
    try {
      await nextTick()
      const table = getTable()
      if (!table) return
      const selectedKeys = new Set(selected.map(row => keyOf(row)))
      rows.forEach(row => {
        const should = selectedKeys.has(keyOf(row))
        if (rowsChanged && !should) return
        table.toggleRowSelection(row, should)
      })
    } finally {
      syncing = false
    }
  }

  watch([() => getRows(), () => getSelected()], syncTableSelection, { immediate: true })

  return { keyOf, handleSelectionChange }
}
