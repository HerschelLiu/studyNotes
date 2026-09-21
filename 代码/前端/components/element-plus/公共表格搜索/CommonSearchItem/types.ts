import type { DatePickerPropsPublic, InputPropsPublic, SelectPropsPublic, ElTreeSelect } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'

export type CommonSearchItemOptionsType = 'input' | 'select' | 'date' | 'treeSelect'

export type FieldKeys<T> = T extends string ? T : Extract<keyof T, string>

/** select 选项数据及取值配置 */
export interface SelectOptionProps<R = any> {
  data?: MaybeRefOrGetter<R[] | undefined>
  label?: string
  key?: string
  changeFn?: (val: any) => void
}

export type SelectControlProps<R = any> = SelectPropsPublic & SelectOptionProps<R>

export type TreeSelectControlProps<R = any> = Omit<InstanceType<typeof ElTreeSelect>['$props'], 'data'> & {
  data?: MaybeRefOrGetter<R[] | undefined>
  changeFn?: (val: any) => void
}

interface CommonSearchItemBaseOptions<T> {
  /** 字段名（表单 key，需为查询对象上已存在的键） */
  prop: FieldKeys<T>
  label: string
  labelWidth?: string | number
  placeholder?: string
  /** 控件区宽度 */
  inputSize?: { width?: number | string }
  /** 当type = merge 时生效，是否单独出来 */
  split?: boolean
  /** 控件区是否由 control-<prop> 插槽接管 */
  slot?: boolean
  /** 是否禁用 */
  disabled?: MaybeRefOrGetter<boolean>
  /** 是否为合并组的默认字段（仅允许一项配置，优先于 defaultQueryProp） */
  isDefault?: MaybeRefOrGetter<boolean>
}

export interface InputSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type?: 'input'
  /** ElInput 的属性，通过 v-bind 透传 */
  props?: InputPropsPublic
}

export interface SelectSearchItemOptions<T, R = any> extends CommonSearchItemBaseOptions<T> {
  type: 'select'
  props?: SelectControlProps<R>
}

export interface DatePickerSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'date'
  props?: DatePickerPropsPublic
}

export interface TreeSelectSearchItemOptions<T, R = any> extends CommonSearchItemBaseOptions<T> {
  type: 'treeSelect'
  props?: TreeSelectControlProps<R>
}

/**
 * 搜索项配置
 * @typeParam T 查询对象类型
 */
export type CommonSearchItemOptions<T = string> =
  | InputSearchItemOptions<T>
  | SelectSearchItemOptions<T>
  | DatePickerSearchItemOptions<T>
  | TreeSelectSearchItemOptions<T>
