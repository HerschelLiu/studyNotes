import type { ComputedRef, InjectionKey, PropType } from 'vue'
import type { CellScope, HeaderScope, TableColumn } from './types'

export const compTableColumnsKey: InjectionKey<Map<string, ComputedRef<TableColumn<any>[]>>> = Symbol('CompTableColumns')

/** 列插槽声明组件上的 #header / #default 插槽（参数与 el-table-column 原生插槽一致） */
export interface ColumnNodeSlots<R extends Record<string, any>> {
  /** 与 el-table-column #header 一致：{ column, $index } */
  header?: (props: HeaderScope<R>) => any
  /** 与 el-table-column default 一致：{ row, column, $index } */
  default?: (props: CellScope<R>) => any
}

/**
 * 列插槽声明组件：只作为 CompTable 默认插槽里的标记，
 * CompTable 会读取它的 prop 与 #header/#default 插槽，本身不渲染任何内容。
 */
export const CompTableColumn = defineComponent({
  name: 'CompTableColumn',
  props: {
    /** 对应 columns 中的 prop，必填 */
    prop: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup: () => () => null
})
