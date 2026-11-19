import type { PropType } from 'vue'
import type { CheckboxValueType } from 'element-plus'

import { defineComponent, h } from 'vue'
import { ElCheckbox } from 'element-plus'

/** rowKey → 是否勾选；reactive Map 才能按 key 精确订阅 */
export type SelectionState = Map<string, boolean>

/** 行复选框：在自身渲染中读 state，只重渲染当前行 */
export const CompTableRowCheckbox = defineComponent({
  name: 'CompTableRowCheckbox',
  props: {
    /** 树形子行不在 items 中，勾选必须直接拿 row */
    row: { type: Object, required: true },
    rowKey: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    state: { type: Object as PropType<SelectionState>, required: true },
    onToggle: { type: Function as PropType<(row: any, checked: boolean) => void>, required: true }
  },
  setup(props) {
    return () =>
      h(ElCheckbox, {
        modelValue: props.state.get(props.rowKey) === true,
        disabled: props.disabled,
        'onUpdate:modelValue': (checked: CheckboxValueType) => {
          if (typeof checked === 'boolean') props.onToggle(props.row, checked)
        }
      })
  }
})

/** 表头全选：只汇总当前页可勾选行 */
export const CompTableHeaderCheckbox = defineComponent({
  name: 'CompTableHeaderCheckbox',
  props: {
    rowKeys: { type: Array as PropType<string[]>, default: () => [] },
    state: { type: Object as PropType<SelectionState>, required: true },
    onToggleAll: { type: Function as PropType<(checked: boolean) => void>, required: true }
  },
  setup(props) {
    return () => {
      const rowKeys = props.rowKeys
      let checkedCount = 0
      for (const rowKey of rowKeys) {
        if (props.state.get(rowKey)) checkedCount++
      }
      return h(ElCheckbox, {
        modelValue: rowKeys.length > 0 && checkedCount === rowKeys.length,
        indeterminate: checkedCount > 0 && checkedCount < rowKeys.length,
        disabled: rowKeys.length === 0,
        'onUpdate:modelValue': (checked: CheckboxValueType) => {
          if (typeof checked === 'boolean') props.onToggleAll(checked)
        }
      })
    }
  }
})
