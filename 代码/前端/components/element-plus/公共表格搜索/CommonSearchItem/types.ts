import type { CommonSearchItemOptionsType, ControlPropsOf } from './controls'
import type { FormItemRule } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'

export type { CommonSearchItemOptionsType, ControlPropsMap, ControlPropsOf, ControlType } from './controls'
export type { BindableProps, DateRangeProps, SelectOptionProps } from './controls/types'

export type FieldKeys<T> = T extends string ? T : Extract<keyof T, string>

/** 基础搜索项配置，所有控件共享 */
interface CommonSearchItemBaseOptions<T> {
  /** 字段名（表单 key，需为查询对象上已存在的键） */
  prop: FieldKeys<T>
  label: string
  labelWidth?: string | number
  placeholder?: string
  /** 控件区宽度 */
  inputSize?: { width?: ID }
  /** 当 type = merge 时生效，是否单独出来 */
  split?: boolean
  /** 控件区是否由 control-<prop> 插槽接管 */
  slot?: boolean
  /** 是否禁用 */
  disabled?: MaybeRefOrGetter<boolean>
  /** 是否为合并组的默认字段（仅允许一项配置，优先于 defaultQueryProp） */
  isDefault?: MaybeRefOrGetter<boolean>
  /** 该项的校验规则；未配置时可回落到 TableSearch 上按 prop 配置的 rules */
  rules?: FormItemRule | FormItemRule[]
}

/** 单个搜索项配置：type 与 props 由控件表推导 */
type SearchItemOptionsOf<K extends CommonSearchItemOptionsType, T> = CommonSearchItemBaseOptions<T> &
  (K extends 'input' ? { type?: 'input'; props?: ControlPropsOf<K> } : { type: K; props?: ControlPropsOf<K> })

/**
 * 搜索项配置（联合类型自动覆盖控件表中的全部控件）
 * @typeParam T 查询对象类型
 */
export type CommonSearchItemOptions<T = string> = {
  [K in CommonSearchItemOptionsType]: SearchItemOptionsOf<K, T>
}[CommonSearchItemOptionsType]

export interface CommonSearchItemProps<T> {
  options: CommonSearchItemOptions<T>[]
  /** 展示方式：split 拆分为多个输入框；merge 合并为一个输入框 + 字段下拉 */
  type?: 'split' | 'merge'
  /** prepend宽度， type = merge 时生效 */
  prependWidth?: number
  /** 输入框宽度 */
  inputWidth?: number
  /** 全局 label 宽度（单项 options.labelWidth 优先） */
  labelWidth?: string | number
  /** 默认输入框占位提示 */
  defaultPlaceholder?: string | 'custom'
  /** 是否可筛选， type = merge 时生效 */
  selectFilterable?: boolean
  /** 默认查询字段， type = merge 时生效 */
  defaultQueryProp?: CommonSearchItemOptions<T>['prop']
}
