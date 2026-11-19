import type { ComputedRef, InjectionKey, PropType, VNodeProps } from 'vue'
import type { CellScope, HeaderScope, TableColumn } from '../types'

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

/**
 * 暴露给消费方的列声明组件类型（运行为上面的 CompTableColumn）。
 * 按内置组件（如 Teleport）的 `new (): { $props; $slots }` 形态声明，
 * Volar 据此在模板中推导 #default / #header 的插槽作用域：
 * row 为列配置对应的行类型 R，column 为 el-table-column 上下文，$index 为 number。
 */
export interface CompTableColumnComponent<R extends Record<string, any>> {
  new (): {
    $props: VNodeProps & { prop: string }
    $slots: ColumnNodeSlots<R>
  }
}
