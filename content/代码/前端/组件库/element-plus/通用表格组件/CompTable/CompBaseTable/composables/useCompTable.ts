import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { CompTableColumnComponent } from '../columns/CompTableColumn'
import type { TableColumn } from '../types'

import { computed, getCurrentInstance, inject, provide, toValue } from 'vue'

import { compTableColumnsKey, CompTableColumn } from '../columns/CompTableColumn'
import { createBoundCompBaseTable } from './boundCompTable'

/** 每个组件实例自己的注入表，保证同一 setup 多次调用不会互相覆盖 */
const localColumnsMaps = new WeakMap<object, Map<string, ComputedRef<TableColumn<any>[]>>>()

/**
 * 取当前组件的注入表
 * - 首次调用才继承父级注入（inject 只读父级 provides），保证子组件里的 CompTable 仍能拿到父级列
 * - 后续调用直接复用，避免被空表覆盖
 */
const resolveColumnsMap = (instance: object) => {
  const cached = localColumnsMaps.get(instance)
  if (cached) return cached

  const columnsMap = new Map(inject(compTableColumnsKey, null) ?? [])
  provide(compTableColumnsKey, columnsMap)
  localColumnsMaps.set(instance, columnsMap)
  return columnsMap
}

/** 注册列，返回带行类型插槽推导的 CompTableColumn 与绑定 tableKey 的 CompBaseTable */
export const useCompTable = <R extends Record<string, any>>(
  columns: MaybeRefOrGetter<TableColumn<R>[]>,
  key = 'default',
) => {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('[CompTable] useCompTable() 必须在 setup 中调用')

  resolveColumnsMap(instance).set(key, computed(() => toValue(columns)))

  return {
    CompTableColumn: CompTableColumn as unknown as CompTableColumnComponent<R>,
    CompBaseTable: createBoundCompBaseTable(key),
  }
}
