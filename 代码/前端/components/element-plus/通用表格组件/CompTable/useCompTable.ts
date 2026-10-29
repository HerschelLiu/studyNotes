import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { TableColumn } from './types'

import { computed, getCurrentInstance, inject, provide, toValue } from 'vue'

import { compTableColumnsKey, CompTableColumn } from './CompTableColumn'
import { createBoundCompTable } from './boundCompTable'

/** 每个组件实例自己的注入表，保证同一 setup 多次调用不会互相覆盖 */
const localColumnsMaps = new WeakMap<object, Map<string, ComputedRef<TableColumn<any>[]>>>()

export function useCompTable<R extends Record<string, any>>(columns: MaybeRefOrGetter<TableColumn<R>[]>, key = 'default') {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('[CompTable] useCompTable() 必须在 setup 中调用')

  let columnsMap = localColumnsMaps.get(instance)
  if (!columnsMap) {
    // 继承父级注入，保证子组件里的 CompTable 仍能拿到父级列
    columnsMap = new Map(inject(compTableColumnsKey, null) ?? [])
    provide(compTableColumnsKey, columnsMap)
    localColumnsMaps.set(instance, columnsMap)
  }
  columnsMap.set(
    key,
    computed(() => toValue(columns))
  )

  return { CompTableColumn, CompTable: createBoundCompTable(key) }
}
