```ts
/** 获取枚举的不重复数组 */
export function useEnumArray<T = number>(object: object): EnumArray<T>[] {
  return Object.entries(object)
    .filter(item => /^[A-Za-z0-9-_]+$/.test(item[1]) || item[1] === '')
    .map(item => {
      return {
        key: item[1] === '' ? '' : isNaN(Number(item[1])) ? item[1] : Number(item[1]),
        value: item[0]
      }
    }) as any
}
export interface EnumArray<T> {
  key: T
  value: string
}

/** 直接从枚举改造对象中取值 */
export function useEnumValue<T = Key>(key: T, obj: EnumArray<T>[]): string {
  for (const forkey in obj) {
    if (key === obj[forkey].key) return obj[forkey].value
  }
  return ''
}

```

