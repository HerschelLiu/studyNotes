import type { MaybeRefOrGetter } from 'vue'

/** 所有搜索控件统一接收的属性（v-model 由 defineModel 接管） */
export interface ControlProps {
  /** 由 CommonSearchItem 解析好的透传属性 */
  controlProps?: Record<string, any>
  /** 选项数据，select 类控件使用 */
  options?: Record<string, any>[]
  /** 选项取值字段 */
  optionKey?: string
  /** 选项显示字段名，或取显示文本的函数 */
  optionLabel?: string | ((option: Record<string, any>) => string)
}

/** 组件实例的 $props（含 emits 对应的 onXxx），即 v-bind 能绑定的全部属性 */
export type BindableProps<C extends abstract new (...args: any[]) => any> = InstanceType<C>['$props']

/** v-model 由 CommonSearchItem 接管，options.props 中不允许再传 */
export type WithoutModel<P> = Omit<P, 'modelValue' | 'onUpdate:modelValue' | 'modelModifiers'>

/** select 控件的选项取值配置（options 中的写法） */
export interface SelectOptionProps<R = any> {
  /** 选项数据，支持传入 Ref / getter */
  data?: MaybeRefOrGetter<R[] | undefined>
  /** 选项显示字段名，或取显示文本的函数（el-option 的 label 只接收字符串，函数在控件内求值） */
  label?: string | ((item: R) => string)
  /** 选项取值字段名 */
  key?: string
}

/** daterange 时把查询对象上的两个字段合成一个数组 */
export interface DateRangeProps {
  /** 开始字段名（daterange 时生效，对应 query 上的键） */
  start?: string
  /** 结束字段名（daterange 时生效，对应 query 上的键） */
  end?: string
}
