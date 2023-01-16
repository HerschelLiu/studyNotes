```tsx
import { useLineString } from '@/hooks/useString'

/** 组合样式 */
export function useStyle(obj: Partial<CSSStyleDeclaration>) {
  const array: string[] = []
  for (const key in obj) {
    if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
      let keys = useLineString(key)
      if (keys.startsWith('webkit')) keys = `-${keys}`
      array.push(`${keys}: ${obj[key]}`)
    }
  }
  return array.join(';')
}

/** 增加单位 */
export function useUnit(value: string | number, unit = 'px') {
  if (typeof value === 'undefined' || !value.toString) return ''
  return /^-?\d+(\.\d+)?$/.test(value.toString()) ? value + unit : value.toString()
}

```

