import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { CompTableColumnComponent } from './CompTableColumn'
import type { TableColumn } from './types'

import { computed, getCurrentInstance, inject, provide, toValue } from 'vue'

import { compTableColumnsKey, CompTableColumn } from './CompTableColumn'
import { createBoundCompTable } from './boundCompTable'

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

/**
 * 声明表格列，返回按行类型推导插槽的 CompTableColumn 与绑定 tableKey 的 CompTable。
 *
 * - 必须在组件 setup 内调用（依赖 getCurrentInstance / provide / inject）
 * - R 由 columns（`TableColumn<R>[]`）自动推断，模板中 `<CompTableColumn>` 的
 *   `#default` / `#header` 插槽可直接拿到具体的 row / column / $index 类型
 * - 同一 setup 多次调用需传不同的 key，并配合 `<CompTable table-key="xxx">`
 */
export const useCompTable = <R extends Record<string, any>>(
  columns: MaybeRefOrGetter<TableColumn<R>[]>,
  key = 'default',
) => {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('[CompTable] useCompTable() 必须在 setup 中调用')

  resolveColumnsMap(instance).set(key, computed(() => toValue(columns)))

  return {
    /** 运行时与 CompTableColumn 一致，仅在类型上携带 R 以推导插槽作用域 */
    CompTableColumn: CompTableColumn as unknown as CompTableColumnComponent<R>,
    CompTable: createBoundCompTable(key),
  }
}
