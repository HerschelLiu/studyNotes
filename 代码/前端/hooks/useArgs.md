**TODO位置需要根据实际代码修改**

`router.currentRoute.value` 拿的是 router 实例的当前路由快照，但 vue-router 4 在路由切换过程中：

1. 新组件的 `setup` 先执行（此时 `currentRoute` 可能还指向旧路由）
2. 然后才 commit 新的 `currentRoute`
3. 最后 `onMounted` 触发 —— 但偶发情况下步骤 2 还没完成

所以在 `onMounted` 里 `await useValidateArgs('type')` 偶现拿不到 `type`，特别是在某些标签页缓存场景、路由中间态、或 keep-alive 复用组件的情况下。

## VUE

`vue3.x`

```tsx
import { computed, ref, watch } from 'vue'

import { useError } from './useTip'

const FALSY = new Set(['', '0', 'false', 'null', 'undefined', 'void 0'])

function toNumber(value: string) {
  const number = Number(value)
  return value && Number.isFinite(number) ? number : undefined
}

const toBoolean = (value: string) => !FALSY.has(value)

function toJson<T>(value: string): T | undefined {
  if (!value) return undefined

  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

/** 获取路由参数并转换：number、boolean、array、json，数组方法逐项处理。 */
export function useValidateArgs<T extends string = string>(args: string, required = true) {
  const route = useRoute()
  const value = ref('' as T)
  let validated = false

  watch(
    () => route.query[args] ?? route.params[args],
    raw => {
      value.value = (Array.isArray(raw) ? raw.join(',') : raw ?? '') as T
      if (raw == null && required && !validated) {
        useError(`缺少关键参数${args}`)
        validated = true
      }
    },
    { immediate: true }
  )

  const getList = () => (value.value ? value.value.split(',').filter(Boolean) : [])
  const setList = (items: string[]) => {
    value.value = (items.join(',') || '') as T
  }

  const mapList = <R>(parse: (item: string) => R | undefined, stringify: (item: R) => string) =>
    computed<R[]>({
      get: () =>
        getList().flatMap(item => {
          const parsed = parse(item)
          return parsed === undefined ? [] : [parsed]
        }),
      set: items => setList(items.map(stringify))
    })

  const array = () =>
    Object.assign(computed<string[]>({ get: getList, set: setList }), {
      number: () => mapList(toNumber, String),
      boolean: () => mapList(toBoolean, String),
      json: <R = unknown>() => mapList(toJson<R>, item => JSON.stringify(item) ?? '')
    })

  return Object.assign(value, {
    number: <R extends number = number>() =>
      computed({
        get: () => toNumber(value.value) as R | undefined,
        set: newValue => {
          value.value = (newValue == null ? '' : String(newValue)) as T
        }
      }),

    boolean: () =>
      computed({
        get: () => toBoolean(value.value),
        set: newValue => {
          value.value = (newValue ? 'true' : 'false') as T
        }
      }),

    json: <R = unknown>() =>
      computed({
        get: () => toJson<R>(value.value),
        set: newValue => {
          value.value = (newValue == null ? '' : JSON.stringify(newValue)) as T
        }
      }),

    array
  })
}

```



`vue2.x`

```ts
/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 * @note await useValidateArgs.call(this, args, required)
 */
export async function useValidateArgs(args: string, required = true): Promise<string> {
  const route = this.$route
  const router = this.$router
  const arg = route.query[args] || route.params[args]
  if (arg && typeof arg === 'string') return Promise.resolve(arg)
  if (required) {
    /** TODO: 错误提示 */
    if (route.matched.filter(item => !item.redirect).length > 1) {
      /** TODO: 返回操作 */
    } else {
      router.push({
        name: /** TODO: 404页面 */,
        replace: true
      })
    }
    return Promise.reject()
  } else return Promise.resolve('')
}
```



## 微信小程序

```ts
import { useShowToast } from './useTip'
import { isHaveValue } from './useValidate'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export function useValidateArgs<T>(options: AnyObject | undefined, args: string, required = true): Promise<T | string> {
  return new Promise((resolve, reject) => {
    if (isHaveValue(options) && required) {
      useShowToast({ title: '页面缺少必要参数', mask: true })

      return reject({
        loading: false,
        fail: true,
        failContent: '页面缺少必要参数',
        failButtonContent: '返回',
        failRouterBack: true
      })
    } else {
      const arg = options![args]
      if (arg && isHaveValue(arg)) return resolve(arg)
      return resolve('')
    }
  })
}

export function useArgsStrToObj(url: string) {
  const obj: AnyObject = {}
  const query = url.split('&')
  query.forEach(item => {
    const [key, value] = item.split('=')
    if (isHaveValue(value)) obj[key] = decodeURIComponent(value)
  })

  return obj
}

/** 获取链接中的参数对象 */
export function useArgsUrl(url: string): AnyObject {
  const [, search] = url.split('?')
  if (!search) return {}
  return useArgsStrToObj(search)
}

/** 获取参数 */
export function useArgsObjToStr(obj: AnyObject): string {
  let url = ''
  for (const key in obj) {
    url += (url ? '&' : '') + `${key}=${obj[key]}`
  }
  return url
}
 
```

