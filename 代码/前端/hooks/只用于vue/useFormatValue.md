`useFormatValue`

```ts
import type { MaybeRef } from 'vue'

import moment from 'moment'
import { isHaveValue } from '@/hooks/useValidate'
import { getEnumValue } from './useEnum'

export type FormatValueType = 'boolean' | 'date' | 'enum' | 'dict'
export type EnumValue = string | number
export type EnumObject = Record<PropertyKey, EnumValue>
/** 字典列表（useDict 返回的单个字典 ref，或直接传数组） */
export type DictList = MaybeRef<Record<string, any>[]>
export type FormatFmt = string | EnumObject | DictList
export type FormatRaw = EnumValue | Date | null | undefined

/** 空值占位配置 */
export interface FormatValueOptions {
  /** 空值占位符，默认 '--' */
  placeholder?: string
}

/** 各格式化器的入参类型（支持日期对象，其余为枚举/字典值） */
interface FormatSourceMap {
  boolean: EnumValue
  date: FormatRaw
  enum: EnumValue
  dict: EnumValue
}

/** 各格式化器的 formatStr 类型 */
interface FormatFmtMap {
  boolean: string | undefined
  date: string | undefined
  enum: EnumObject
  dict: DictList
}

/**
 * 格式化器映射（映射类型）：每个 key 精确约束自己的 raw / formatStr。
 * 新增 `FormatValueType` 时必须同步补齐上面两个 Map，否则这里编译报错。
 */
type FormatterMap = {
  [T in FormatValueType]: (raw: FormatSourceMap[T], formatStr: FormatFmtMap[T], placeholder: string) => EnumValue
}

const formatters: FormatterMap = {
  boolean: (raw, formatStr) => {
    const [trueText, falseText] = (formatStr || '是:否').split(':')
    return raw == 0 ? falseText : trueText
  },
  date: (raw, formatStr, placeholder) => {
    const date = moment(raw)
    return date.isValid() ? date.format(formatStr || 'YYYY-MM-DD HH:mm:ss') : placeholder
  },
  enum: (raw, formatStr) => getEnumValue(raw, formatStr) || raw,
  dict: (raw, formatStr) => selectDictLabel(unref(formatStr), raw)
}

/**
 * 独立分派：type 与参数类型的对应关系由公共重载 / CompTable 的 TableColumnFormat 保证。
 * 通过泛型 + 映射类型取到具体格式化器，内部无需 `as never`。
 */
const dispatchFormat = <T extends FormatValueType>(raw: FormatSourceMap[T], type: T, formatStr: FormatFmtMap[T], placeholder: string): EnumValue =>
  formatters[type](raw, formatStr, placeholder)

/**
 * 格式化展示值
 * @param raw 原始值
 * @param type 格式化类型；也可直接传 `{ placeholder }`
 * @param formatStr 格式化传参，根据类型不同而不同
 * @param options 空值占位配置
 */
export function useFormatValue(raw: FormatRaw, options?: FormatValueOptions): EnumValue
export function useFormatValue(
  raw: FormatRaw,
  type: 'boolean' | 'date',
  formatStr?: string | FormatValueOptions,
  options?: FormatValueOptions
): EnumValue
export function useFormatValue(raw: FormatRaw, type: 'enum', formatStr: EnumObject, options?: FormatValueOptions): EnumValue
export function useFormatValue(raw: FormatRaw, type: 'dict', formatStr: DictList, options?: FormatValueOptions): EnumValue
export function useFormatValue(
  raw: FormatRaw,
  type?: FormatValueType | FormatValueOptions,
  formatStr?: FormatFmt | FormatValueOptions,
  options?: FormatValueOptions
): EnumValue {
  // 参数归一：第 2 参直接传 options，或 boolean/date 的第 3 参传 options
  if (typeof type === 'object') {
    options = type
    type = undefined
  } else if ((type === 'boolean' || type === 'date') && typeof formatStr === 'object' && formatStr !== null) {
    options = formatStr as FormatValueOptions
    formatStr = undefined
  }
  const placeholder = options?.placeholder ?? '--'
  if (!isHaveValue(raw)) return placeholder
  if (!type) return raw as EnumValue
  return dispatchFormat(raw, type, formatStr as FormatFmt | undefined, placeholder)
}

```



> ```ts
> // 1. 不传 options（向后兼容，placeholder 默认 '--'）
> useFormatValue(row, 'boolean', '是:否')
> useFormatValue(row, 'date')
> 
> // 2. formatStr + options
> useFormatValue(row, 'boolean', '是:否', { placeholder: '-' })
> useFormatValue(row, 'date', 'YYYY-MM-DD', { placeholder: '/' })
> 
> // 3. 省略 formatStr，直接传 options（仅 boolean/date，formatStr 本就可选）
> useFormatValue(row, 'boolean', { placeholder: '/' })
> useFormatValue(row, 'date', { placeholder: '/' })
> 
> // enum/dict 的 formatStr 是必传的，options 作为第四参数
> useFormatValue(row, 'enum', enumObj, { placeholder: '/' })
> 
> // 不传 type，只传 options（budgetExpense/index.vue 的用法）
> useFormatValue(row.deptCode, { placeholder: '' })
> 
> // 不传 type，不传 options（向后兼容）
> useFormatValue(row.code)
> ```
>
> 
