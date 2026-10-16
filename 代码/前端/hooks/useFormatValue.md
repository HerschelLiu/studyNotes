`useFormatValue`

```ts
import moment from 'moment'
import type { MaybeRef } from 'vue'
import { isHaveValue } from '@/hooks/useValidate'
import { getEnumValue } from './useEnum'

export type FormatValueType = 'boolean' | 'date' | 'enum' | 'dict'
export type EnumValue = string | number
export type EnumObject = Record<PropertyKey, EnumValue>
/** 字典列表（useDict 返回的单个字典 ref，或直接传数组） */
export type DictList = MaybeRef<Record<string, any>[]>
export type FormatFmt = string | EnumObject | DictList
export type FormatRow = EnumValue | Date | null | undefined

/** 空值占位配置 */
export interface FormatValueOptions {
  /** 空值占位符，默认 '--' */
  placeholder?: string
}

const useFormatValueFormatters = {
  boolean: (row: EnumValue, fmt = '是:否') => {
    const [t, f] = (fmt as string).split(':')
    return row == 0 ? f : t
  },
  date: (row: EnumValue | Date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    const m = moment(row)
    return m.isValid() ? m.format(fmt as string) : '--'
  },
  enum: (row: EnumValue, fmt: EnumObject) => getEnumValue(row, fmt) || row,
  dict: (row: EnumValue, fmt: DictList) => selectDictLabel(unref(fmt), row)
} as const

export function useFormatValue(row: FormatRow, options?: FormatValueOptions): EnumValue
export function useFormatValue(
  row: FormatRow,
  type: 'boolean' | 'date',
  formatStr?: string | FormatValueOptions,
  options?: FormatValueOptions
): EnumValue
export function useFormatValue(row: FormatRow, type: 'enum', formatStr: EnumObject, options?: FormatValueOptions): EnumValue
export function useFormatValue(row: FormatRow, type: 'dict', formatStr: DictList, options?: FormatValueOptions): EnumValue
export function useFormatValue(
  row: FormatRow,
  type?: FormatValueType | FormatValueOptions,
  formatStr?: string | EnumObject | DictList | FormatValueOptions,
  options?: FormatValueOptions
): EnumValue {
  if (type && typeof type === 'object') {
    options = type as FormatValueOptions
    type = undefined
  }
  if ((type === 'boolean' || type === 'date') && typeof formatStr === 'object' && formatStr !== null) {
    options = formatStr as FormatValueOptions
    formatStr = undefined
  }
  const placeholder = options?.placeholder ?? '--'
  if (!isHaveValue(row)) return placeholder
  if (!type) return row as EnumValue
  return useFormatValueFormatters[type](row as never, formatStr as never)
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
