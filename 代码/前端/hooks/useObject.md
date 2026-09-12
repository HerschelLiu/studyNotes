```ts
import { isArray, isHaveValue } from '@/hooks/useValidate'

/** 深拷贝 */
export function useClone<T>(val: T): T {
  if (Object.prototype.toString.call(val) === '[object Object]') {
    const obj: any = {}
    for (const key in val) {
      obj[key] = useClone(val[key])
    }
    return obj
  } else if (Array.isArray(val)) return val.map(item => useClone(item)) as unknown as T
  else return val
}

/** 移除对象的无效值 */
export function useValue<T>(object: T): T {
  if (Object.prototype.toString.call(object) === '[object Object]') {
    const obj: any = {}
    for (const key in object) {
      const value = useValue(object[key])
      if (isHaveValue(value)) obj[key] = value
    }
    return obj
  } else if (Array.isArray(object)) return object.map(item => useValue(item)) as unknown as T
  else return object
}

/** 递归删除对象的指定key */
export function useDeleteObjectKey<T>(arg: T, deleteKey: string[]): T {
  if (Object.prototype.toString.call(arg) === '[object Object]') {
    const obj: any = {}
    for (const key in arg) {
      if (!deleteKey.includes(key)) obj[key] = useDeleteObjectKey(arg[key], deleteKey)
    }
    return obj
  } else if (isArray(arg)) return arg.map(item => useDeleteObjectKey(item, deleteKey)) as any
  else return arg
}

/**
 * 递归删除对象指定 value 的 key
 * @param target 对象
 * @param match 匹配值，默认 null | undefined
 */
export function useCleanObject<T extends object>(target: T, match: any[] = [undefined, null]): T {
  return Object.entries(target).reduce((acc, [key, value]) => {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      return { ...acc, [key]: useCleanObject(value) }
    }
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return {
        ...acc,
        [key]: value.map((item: any) => {
          return Object.prototype.toString.call(item) === '[object Object]' ? useCleanObject(item) : item
        })
      }
    }
    if (match.includes(value)) {
      Reflect.deleteProperty(acc, key)
      return acc
    } else {
      return { ...acc, [key]: value }
    }
  }, {} as T)
}

```



新增

```ts
/**
 * 创建带初始值记忆的响应式对象
 * 创建时自动冻结初始值并保存深拷贝，调用 reset 可将对象恢复到初始状态（含删除多余 key）。
 * @param initial 初始值对象（会被深冻结，后续修改无效）
 * @returns [state, reset] 元组：state 为响应式对象，reset 为重置函数
 */
export function useReactive<T extends object>(initial: T): [T, () => void] {
  // 递归冻结初始值对象（深冻结）
  ;(function freeze(obj: object) {
    Object.freeze(obj)
    Object.getOwnPropertyNames(obj).forEach(key => {
      const val = obj[key as keyof typeof obj]
      if (val && typeof val === 'object' && !Object.isFrozen(val)) {
        freeze(val)
      }
    })
  })(initial)

  // 创建响应式对象（深拷贝，避免引用冻结对象）
  const state = reactive(useClone(initial)) as T
  // 重置函数：先删除所有自有属性，再赋初始值的深拷贝
  const reset = () => {
    Object.keys(state).forEach(key => Reflect.deleteProperty(state, key))
    Object.assign(state, useClone(initial))
  }
  return [state, reset]
}
```



```ts
import type { MaybeRefOrGetter, Ref, UnwrapRef } from 'vue'

import { isRef, toValue } from 'vue'

/**
 * 以原对象字段为准，从赋值对象中按同名字段递归取值并原地写回（保持引用）
 * @param target 原对象 / ref（会被原地修改）
 * @param source 赋值对象 / ref / getter
 * @returns 传入的 target 本身（ref 原样返回该 ref）
 */
export function useAssign<T extends object>(target: T, source?: MaybeRefOrGetter<Record<string, any> | null | undefined>): T {
  const src = toValue(source)
  if (src == null) return target

  // 普通对象（排除数组、Date、File、Map 等）
  const isPlainObject = (val: unknown): val is Record<string, any> => Object.prototype.toString.call(val) === '[object Object]'

  const targetRef = isRef(target) ? (target as Ref) : undefined
  const targetObj: unknown = targetRef ? targetRef.value : target

  if (!isPlainObject(targetObj) || !isPlainObject(src)) {
    if (targetRef) targetRef.value = src
    return target
  }

  for (const key of Object.keys(targetObj)) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue
    const targetVal = targetObj[key]
    const sourceVal = src[key]

    if (isPlainObject(targetVal) && isPlainObject(sourceVal)) useAssign(targetVal, sourceVal)
    else targetObj[key] = sourceVal
  }

  return target
}
```



```ts
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

    const match = entries.filter(([, value]) => isHaveValue(value))
    return mode === 'every' ? match.length === entries.length : match.length > 0
  })
}
```

