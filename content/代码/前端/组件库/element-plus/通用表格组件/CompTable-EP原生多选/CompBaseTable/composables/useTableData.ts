import type { BaseCompTableProps } from '../types'

import { computed } from 'vue'

export const useTableData = <T extends Record<string, any>, R extends Record<string, any>>(
  props: BaseCompTableProps<T, R>
) => {
  const rows = computed<R[]>(() => (Array.isArray(props.list) ? props.list : props.list.items))

  const resolvedLoading = computed(() => {
    if (props.loading != null) return props.loading
    return Array.isArray(props.list) ? false : props.list.loading === true
  })

  const treeChildrenKey = computed(() => props.treeProps?.children ?? 'children')

  const flattenRows = (list: R[]): R[] =>
    list.flatMap(row => {
      const children = (row as Record<string, unknown>)[treeChildrenKey.value]
      return Array.isArray(children) ? [row, ...flattenRows(children as R[])] : [row]
    })

  return { rows, resolvedLoading, allRows: computed(() => flattenRows(rows.value)) }
}
