```ts
import moment from 'moment'
import { isHaveValue } from '@/hooks/useValidate'
import { getEnumValue } from './useEnum'

export type FormatValueType = 'boolean' | 'date' | 'enum'
export type EnumValue = string | number
export type EnumObject = Record<PropertyKey, EnumValue>
/** 允许入参：字符串/数字、Date，以及接口字段常见的 null/undefined（空值统一展示 --） */
export type FormatRow = EnumValue | Date | null | undefined

const useFormatValueFormatters = {
  boolean: (row: EnumValue, fmt = '是:否') => {
    const [t, f] = (fmt as string).split(':')
    return row == 0 ? f : t
  },
  date: (row: EnumValue | Date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    const m = moment(row)
    return m.isValid() ? m.format(fmt as string) : '--'
  },
  enum: (row: EnumValue, fmt: EnumObject) => getEnumValue(row, fmt) || row
} as const

export function useFormatValue(row: FormatRow): EnumValue
export function useFormatValue(row: FormatRow, type: 'boolean', formatStr?: string): EnumValue
export function useFormatValue(row: FormatRow, type: 'date', formatStr?: string): EnumValue
export function useFormatValue(row: FormatRow, type: 'enum', formatStr: EnumObject): EnumValue
export function useFormatValue(row: FormatRow, type?: FormatValueType, formatStr?: string | EnumObject): EnumValue {
  if (!isHaveValue(row)) return '--'
  if (!type) return row as EnumValue
  return useFormatValueFormatters[type](row as never, formatStr as never)
}

```

