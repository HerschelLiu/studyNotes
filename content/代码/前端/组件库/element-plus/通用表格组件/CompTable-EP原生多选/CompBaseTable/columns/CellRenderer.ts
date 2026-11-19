import type { PropType, ShallowRef } from 'vue'
import type { CellScope } from '../types'

import { defineComponent } from 'vue'

export interface CellColumnRef<R extends Record<string, any>> {
  value: CellScope<R>['column'] | undefined
}

/** 单元格内容渲染器：把 row 字段读取限制在自身 render effect 内 */
export const CompTableCell = defineComponent({
  name: 'CompTableCell',
  props: {
    render: { type: Function as PropType<(scope: CellScope<any>) => any>, required: true },
    row: { type: Object as PropType<Record<string, any>>, required: true },
    columnRef: { type: Object as PropType<CellColumnRef<any>>, required: true },
    indexRef: { type: Object as PropType<ShallowRef<number>>, required: true }
  },
  setup(props) {
    return () => {
      const column = props.columnRef.value
      if (!column) return null
      // getter 只在插槽读取 $index 时才建立依赖，未读取的单元格不会因序号变化重渲染
      return props.render({
        row: props.row,
        column,
        get $index() {
          return props.indexRef.value
        }
      })
    }
  }
})
