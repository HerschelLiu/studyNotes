import type { DatePickerPropsPublic, InputPropsPublic, SelectPropsPublic, ElTreeSelect } from 'element-plus'
import type { MaybeRefOrGetter } from 'vue'

export type CommonSearchItemOptionsType = 'input' | 'select' | 'date' | 'treeSelect'

export type FieldKeys<T> = T extends string ? T : Extract<keyof T, string>

/** select 选项数据及取值配置，仅用于生成选项，不会透传给控件 */
export interface SelectOptionProps {
  data?: MaybeRefOrGetter<Record<string, any>[]>
  label?: string
  key?: string
  changeFn?: (val: any) => void
}

/** ElSelect 的全部对外属性，并兼容选项字段 */
export type SelectControlProps = SelectPropsPublic & SelectOptionProps

/** ElTreeSelect 的全部对外属性（由组件实例 $props 推导），并兼容 changeFn。data 接受 Ref/getter，由控件内部解包 */
export type TreeSelectControlProps = Omit<InstanceType<typeof ElTreeSelect>['$props'], 'data'> & {
  /** 树形数据，可传 Ref/getter（允许 undefined 占位），由 CommonSearchItem 内部用 toValue 解包后透传 */
  data?: MaybeRefOrGetter<Record<string, any>[] | undefined>
  /** 值变化回调，由 CommonSearchItem 消费，不会透传给控件 */
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

export interface SelectSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'select'
  /** ElSelect 及选项数据配置，控件属性通过 v-bind 透传 */
  props?: SelectControlProps
}

export interface DatePickerSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'date'
  /** ElDatePicker 的属性，通过 v-bind 透传 */
  props?: DatePickerPropsPublic
}

export interface TreeSelectSearchItemOptions<T> extends CommonSearchItemBaseOptions<T> {
  type: 'treeSelect'
  /** ElTreeSelect 的属性（含 data 树形数据），通过 v-bind 透传 */
  props?: TreeSelectControlProps
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
