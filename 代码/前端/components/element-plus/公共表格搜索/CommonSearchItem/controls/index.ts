import type { CommonSearchItemOptionsType } from '../types'
import type { ControlDefinition } from './types'

import DatePickerControl from './DatePickerControl.vue'
import InputControl from './InputControl.vue'
import SelectControl from './SelectControl.vue'
import TreeSelectControl from './TreeSelectControl.vue'

/**
 * 控件注册表
 */
export const controlRegistry: Record<string, ControlDefinition> = {
  input: { component: InputControl },
  select: { component: SelectControl },
  date: { component: DatePickerControl },
  treeSelect: { component: TreeSelectControl }
}

/** 按 type 取控件注册表中的控件，默认 input */
export const definitionOf = (type?: CommonSearchItemOptionsType) => controlRegistry[type ?? 'input'] ?? controlRegistry.input
