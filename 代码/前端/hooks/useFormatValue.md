```ts
import moment from 'moment'
import { isHaveValue } from '@/hooks/useValidate'
import { getEnumValue } from './useEnum'

export type FormatValueType = 'boolean' | 'date' | 'enum'
export type EnumValue = string | number
export type EnumObject = Record<PropertyKey, EnumValue>

const useFormatValueFormatters = {
  boolean: (row: EnumValue, fmt = '是:否') => {
    const [t, f] = (fmt as string).split(':')
    return row == 0 ? f : t
  },
  date: (row: EnumValue, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    const m = moment(row)
    return m.isValid() ? m.format(fmt as string) : '--'
  },
  enum: (row: EnumValue, fmt: EnumObject) => getEnumValue(row, fmt) || row
} as const

export function useFormatValue(row: EnumValue): EnumValue
export function useFormatValue(row: EnumValue, type: 'boolean' | 'date', formatStr?: string): EnumValue
export function useFormatValue(row: EnumValue, type: 'enum', formatStr: EnumObject): EnumValue
export function useFormatValue(row: EnumValue, type?: FormatValueType, formatStr?: string | EnumObject): EnumValue {
  if (!isHaveValue(row)) return '--'
  if (!type) return row
  return useFormatValueFormatters[type](row, formatStr as never)
}

```

