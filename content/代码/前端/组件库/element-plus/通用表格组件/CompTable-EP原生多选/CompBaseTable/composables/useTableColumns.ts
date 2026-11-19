import type { BaseCompTableProps, TableColumn } from '../types'

import { computed, inject, watchEffect } from 'vue'

import { compTableColumnsKey } from '../columns/CompTableColumn'

const filterRenderable = <R>(cols: TableColumn<R>[]): TableColumn<R>[] =>
  cols.flatMap(col => {
    if (col.disabled) return []
    if (col.children?.length) {
      const children = filterRenderable(col.children)
      return children.length ? [{ ...col, children }] : []
    }
    return col.prop === 'index' || col.prop === 'expand' ? [] : [col]
  })

const findLeaf = <R>(cols: TableColumn<R>[], prop: string): TableColumn<R> | undefined => {
  for (const col of cols) {
    if (col.children?.length) {
      const hit = findLeaf(col.children, prop)
      if (hit) return hit
    } else if (col.prop === prop) {
      return col
    }
  }
}

export const useTableColumns = <R extends Record<string, any>>(props: BaseCompTableProps<any, R>) => {
  const tableKey = computed(() => props.tableKey ?? 'default')
  const columnsMap = inject(compTableColumnsKey, null)
  const injectedColumns = computed<TableColumn<R>[]>(
    () => (columnsMap?.get(tableKey.value)?.value ?? []) as TableColumn<R>[]
  )
  const sourceColumns = computed<TableColumn<R>[]>(() => props.columns ?? injectedColumns.value)

  const warned = new Set<string>()
  watchEffect(() => {
    if (!import.meta.env.DEV || props.columns || !columnsMap || columnsMap.has(tableKey.value) || warned.has(tableKey.value)) return
    warned.add(tableKey.value)
    console.warn(
      `[CompTable] table-key "${tableKey.value}" 未在 useCompTable 中注册，已注册：${[...columnsMap.keys()].join(', ') || '(无)'}`
    )
  })

  return {
    sourceColumns,
    dataColumns: computed(() => filterRenderable(sourceColumns.value)),
    indexColumnConfig: computed(() => props.indexColumnConfig ?? findLeaf(sourceColumns.value, 'index')),
    expandColumnConfig: computed(() => props.expandColumnConfig ?? findLeaf(sourceColumns.value, 'expand'))
  }
}
