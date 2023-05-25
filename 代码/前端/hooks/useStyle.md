```ts
import { useLineString } from '@/hooks/useString'

type CSSVar = Record<`--${string}`, string | undefined>

/** 组合样式 */
export function useStyle(obj: Partial<CSSStyleDeclaration & { backdropFilter: string } & CSSVar>) {
  const array: string[] = []
  for (const key in obj) {
    if (typeof obj[key as any] === 'string' || typeof obj[key as any] === 'number') {
      let keys = useLineString(key)
      if (keys.startsWith('webkit')) keys = `-${keys}`
      array.push(`${keys}: ${obj[key as any]}`)
    }
  }
  return array.join(';')
}

/** 增加单位 */
export function useUnit(value: Key, unit = 'px') {
  if (typeof value === 'undefined' || !value.toString) return ''
  return /^-?\d+(\.\d+)?$/.test(value.toString()) ? value + unit : value.toString()
}

/** 小程序专用 */
/** 换算尺寸 */
export function rpxToPx(rpx: number): number {
  return Math.floor((globalData.systemInfo.screenWidth * rpx) / 750)
}
```

