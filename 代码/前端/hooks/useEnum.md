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

/** 从枚举对象中取值 */
export function getEnumValue<T>(value: T, enu: object): string {
  return useEnumValue<T>(value, useEnumArray(enu))
}
```

通用

```ts
/** 反向映射类型：值（as string）→ key 名 */
type Reverse<T extends Record<string, string | number>> = {
  readonly [K in keyof T as `${T[K]}`]: K
}

/** 枚举值联合类型 */
export type EnumValue<T extends Record<string, string | number>> = T[keyof T]

/** 工具方法类型 */
interface EnumMethods<T extends Record<string, string | number>> {
  /** 根据值获取 key 名（反向查找） */
  getLabel(value: T[keyof T]): string
  /** 获取所有 key 名（仅正向） */
  getKeys(): string[]
  /** 获取所有值（仅正向） */
  getValues(): T[keyof T][]
  /** 获取 [key, value] 数组（仅正向） */
  entries(): [string, T[keyof T]][]
}

/** 枚举完整类型：正向 + 反向 + 方法，全部只读 */
type EnumObject<T extends Record<string, string | number>> = Readonly<T & Reverse<T> & EnumMethods<T>>

/**
 * 创建枚举对象（工厂函数）
 *
 * 反向映射和方法通过 Object.defineProperty 设为 enumerable: false，
 * Object.keys() / for...in 只返回正向 key，干净不污染。
 *
 * @example
 * const members = { 未提交: 0, 已提交: 1, 已通过: 5 } as const
 * export const FlowAuditStatus = useEnum(members)
 * export type FlowAuditStatus = EnumValue<typeof members>
 *
 * FlowAuditStatus.未提交       // → 0
 * FlowAuditStatus[0]           // → '未提交'
 * FlowAuditStatus.getLabel(0)  // → '未提交'
 * FlowAuditStatus.getKeys()    // → ['未提交', '已提交', '已通过']
 * FlowAuditStatus.entries()    // → [['未提交', 0], ['已提交', 1], ['已通过', 5]]
 * Object.keys(FlowAuditStatus) // → ['未提交', '已提交', '已通过']（不含反向 key 和方法）
 */
export function useEnum<T extends Record<string, string | number>>(obj: T): EnumObject<T> {
  const data: Record<string, unknown> = {}

  Object.entries(obj).forEach(([key, value]) => {
    // 正向映射（可枚举）
    Object.defineProperty(data, key, {
      value,
      writable: false,
      configurable: false,
      enumerable: true,
    })

    // 反向映射（不可枚举，不影响 Object.keys）
    Object.defineProperty(data, String(value), {
      value: key,
      writable: false,
      configurable: false,
      enumerable: false,
    })
  })

  // 方法（不可枚举）
  const methods: EnumMethods<T> = {
    getLabel: (value: string | number) => data[String(value)] as string,
    getKeys: () => Object.keys(obj),
    getValues: () => Object.values(obj) as T[keyof T][],
    entries: () => Object.entries(obj) as [string, T[keyof T]][],
  }

  Object.entries(methods).forEach(([methodName, fn]) => {
    Object.defineProperty(data, methodName, {
      value: fn,
      writable: false,
      configurable: false,
      enumerable: false,
    })
  })

  return Object.freeze(data) as EnumObject<T>
}

```
