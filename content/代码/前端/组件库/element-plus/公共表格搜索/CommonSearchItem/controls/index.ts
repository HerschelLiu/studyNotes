import type { Component } from 'vue'
import type { ElDatePicker, ElInput, ElSelect, ElTreeSelect } from 'element-plus'
import type { BindableProps, DateRangeProps, SelectOptionProps, WithoutModel } from './types'

import DatePickerControl from './DatePickerControl.vue'
import InputControl from './InputControl.vue'
import SelectControl from './SelectControl.vue'
import TreeSelectControl from './TreeSelectControl.vue'

/**
 * 控件表：key 即 options 中的 `type`
 *
 * 新增控件只需两步：
 * 1. 新建 `XxxControl.vue`（接收统一的 `ControlProps`）；
 * 2. 在下面 `controls` 里加一行。
 *
 * 想在 options.props 上获得补全与校验，再在 `ControlPropsMap` 里补一行；不补也能用，props 退化为宽松类型。
 * `index.vue` 与 `CommonSearchItem/types.ts` 无需改动（type 联合由控件表自动推导）。
 */
export const controls = {
  input: InputControl,
  select: SelectControl,
  date: DatePickerControl,
  treeSelect: TreeSelectControl
}

/** 控件类型，由控件表自动推导 */
export type ControlType = keyof typeof controls

/** 控件类型（旧命名，保留兼容） */
export type CommonSearchItemOptionsType = ControlType

/**
 * 控件对外 props 类型表（可选）
 *
 * 键与 `controls` 对应；未登记的 type 在 options.props 上退化为 `Record<string, any>`
 */
export interface ControlPropsMap {
  input: BindableProps<typeof ElInput>
  select: BindableProps<typeof ElSelect> & SelectOptionProps
  date: BindableProps<typeof ElDatePicker> & DateRangeProps
  treeSelect: Omit<BindableProps<typeof ElTreeSelect>, 'data'> & Pick<SelectOptionProps, 'data'>
}

/** 按 type 取控件 props 类型，未登记的控件退化为宽松类型 */
export type ControlPropsOf<K extends ControlType> = K extends keyof ControlPropsMap
  ? WithoutModel<ControlPropsMap[K]>
  : Record<string, any>

/** 按 type 取控件组件，未匹配时回落到 input */
export const controlOf = (type?: ControlType): Component => controls[type ?? 'input'] ?? controls.input
