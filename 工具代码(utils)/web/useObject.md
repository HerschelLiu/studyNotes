```tsx
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

