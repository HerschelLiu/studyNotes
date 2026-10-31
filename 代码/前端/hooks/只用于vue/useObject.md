#### 通用文件`common.ts`

```ts
/** 普通对象（排除数组、Date、Map、ref 等） */
export const isPlainObject = (value: unknown): value is Record<string, any> =>
  Object.prototype.toString.call(value) === '[object Object]'

```



#### 深拷贝`useClone.ts`

```ts
import { isPlainObject } from './common'

/** 深拷贝（仅普通对象与数组；Date、Map 等其余值按引用保留） */
export function useClone<T>(val: T): T {
  if (isPlainObject(val)) {
    const clone: Record<string, any> = {}
    Object.keys(val).forEach(key => {
      clone[key] = useClone(val[key])
    })
    return clone as unknown as T
  }
  if (Array.isArray(val)) return val.map(item => useClone(item)) as unknown as T
  return val
}

```



#### 对象字段合并`useAssign.ts`

```ts
import type { MaybeRefOrGetter } from 'vue'

import { isPlainObject } from './common'

/**
 * 以原对象字段为准，从赋值对象中按同名字段递归取值并原地写回（保持引用）
 * @param target 原对象 / reactive / ref（ref 的值需为普通对象，否则整体替换 ref.value）
 * @param source 赋值对象 / ref / getter
 * @returns 传入的 target 本身（ref 原样返回该 ref）
 */
export function useAssign<T extends object>(target: T, source?: MaybeRefOrGetter<Record<string, any> | null | undefined>): T {
  const src = toValue(source)
  if (src == null) return target

  const isTargetRef = isRef(target)
  const targetObj: unknown = isTargetRef ? target.value : target

  if (!isPlainObject(targetObj) || !isPlainObject(src)) {
    // 目标或来源不是普通对象，无法按字段合并：ref 可整体替换，普通对象没有可替换的容器，保持原样
    if (isTargetRef) target.value = src
    return target
  }

  Object.keys(targetObj).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(src, key)) return
    const targetValue = targetObj[key]
    const sourceValue = src[key]
    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) useAssign(targetValue, sourceValue)
    else targetObj[key] = sourceValue
  })

  return target
}

```



#### 递归删除对象中的某些属性`useCleanObject.ts`

```ts
import { isPlainObject } from './common'

/**
 * 递归删除对象中值为 match 的 key（返回新对象；数组项递归清理但不删除）
 * @param target 对象
 * @param match 匹配值，默认 null | undefined
 */
export function useCleanObject<T extends object>(target: T, match: unknown[] = [undefined, null]): T {
  const clean = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(item => clean(item))
    if (!isPlainObject(value)) return value

    const result: Record<string, unknown> = {}
    Object.keys(value).forEach(key => {
      const cleaned = clean(value[key])
      if (!match.includes(cleaned)) result[key] = cleaned
    })
    return result
  }
  return clean(target) as T
}

```



#### 判断对象字段是否有值`useHasValue.ts`

```ts
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import { isHaveValue } from '@/hooks/useValidate'

/**
 * 判断对象字段是否有值（响应式）
 * @param source 待判断对象（reactive / ref / getter）
 * @param excludeKeys 需排除的 key（必须为 source 自身的 key，支持 ref / getter，默认不排除）
 * @param mode 匹配模式：'some'（默认）至少一个字段有值；'every' 所有字段都有值
 * @returns ComputedRef<boolean>
 */
export function useHasValue<T extends object>(
  source: MaybeRefOrGetter<T | null | undefined>,
  excludeKeys: MaybeRefOrGetter<(keyof T)[]> = [],
  mode: 'some' | 'every' = 'some'
): ComputedRef<boolean> {
  return computed(() => {
    const obj = toValue(source)
    if (!obj) return false

    const excludes = toValue(excludeKeys) as (keyof T)[]
    const entries = Object.entries(obj).filter(([key]) => !excludes.includes(key as keyof T))
    if (!entries.length) return false

    return mode === 'every'
      ? entries.every(([, value]) => isHaveValue(value))
      : entries.some(([, value]) => isHaveValue(value))
  })
}

```



#### 清理对象中空值属性（`null` / `undefined` / 自定义值）按照值删除）空的 `{}` / `[]` 会保留`useCleanObject.ts`

```ts
import { isPlainObject } from './common'

/**
 * 递归删除对象中值为 match 的 key（返回新对象；数组项递归清理但不删除）
 * @param target 对象
 * @param match 匹配值，默认 null | undefined
 */
export function useCleanObject<T extends object>(target: T, match: unknown[] = [undefined, null]): T {
  const clean = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(item => clean(item))
    if (!isPlainObject(value)) return value

    const result: Record<string, unknown> = {}
    Object.keys(value).forEach(key => {
      const cleaned = clean(value[key])
      if (!match.includes(cleaned)) result[key] = cleaned
    })
    return result
  }
  return clean(target) as T
}

```



#### 批量清理对象中的属性（按照key删除）`useDeleteObjectKey.ts`

```ts
import { isPlainObject } from './common'

/** 递归删除对象的指定 key（返回新对象） */
export function useDeleteObjectKey<T>(arg: T, deleteKeys: string[]): T {
  if (isPlainObject(arg)) {
    const result: Record<string, any> = {}
    Object.keys(arg).forEach(key => {
      if (!deleteKeys.includes(key)) result[key] = useDeleteObjectKey(arg[key], deleteKeys)
    })
    return result as unknown as T
  }
  if (Array.isArray(arg)) return arg.map(item => useDeleteObjectKey(item, deleteKeys)) as unknown as T
  return arg
}

```



#### 清理对象中无效值的属性（**按有效性**（`isHaveValue`），会清掉 `''`、`null`、`undefined`、空数组、空对象，保留 `0` 和 `false`）`useValue.ts`

```ts
import { isHaveValue } from '@/hooks/useValidate'
import { isPlainObject } from './common'

/** 请求参数是否保留：false 是合法布尔值，需要保留 */
const keepValue = (value: unknown) => value === false || isHaveValue(value)

/** 移除对象的无效值（递归，返回新对象；false 保留） */
export function useValue<T>(object: T): T {
  if (isPlainObject(object)) {
    const result: Record<string, any> = {}
    Object.keys(object).forEach(key => {
      const value = useValue(object[key])
      if (keepValue(value)) result[key] = value
    })
    return result as unknown as T
  }
  if (Array.isArray(object)) return object.map(item => useValue(item)) as unknown as T
  return object
}

```



#### 创建响应对象和清除功能`useReactive.ts`

```ts
import { useClone } from './useClone'

/**
 * 创建带初始值记忆的响应式对象
 * 创建时保存初始值快照（不修改入参），调用 reset 可恢复到初始状态（含删除多余 key）。
 * @param initial 初始值
 * @returns [state, reset] 元组：state 为响应式对象，reset 为重置函数
 */
export function useReactive<T extends object>(initial: T): [T, () => void] {
  // state 与 reset 各用一份拷贝，外部修改 initial 不影响重置结果
  const snapshot = useClone(initial)
  const state = reactive(useClone(snapshot)) as T
  const reset = () => {
    Object.keys(state).forEach(key => Reflect.deleteProperty(state, key))
    Object.assign(state, useClone(snapshot))
  }
  return [state, reset]
}

```



#### `index.ts`

```ts
/**
 * 对象工具统一出口
 * 调用方保持 `import { useXxx } from '@/hooks/useObject'` 不变
 */
export * from './useClone'
export * from './useReactive'
export * from './useValue'
export * from './useHasValue'
export * from './useAssign'
export * from './useDeleteObjectKey'
export * from './useCleanObject'

```

