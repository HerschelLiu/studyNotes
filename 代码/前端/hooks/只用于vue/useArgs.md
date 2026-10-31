## VUE

`vue3.x`

```tsx
import { computed, ref, watch } from 'vue'

import { useError } from './useTip'

/** 数组参数在 URL 中的分隔符 */
const SEPARATOR = ','

/** 布尔参数视为 false 的字符串集合 */
const FALSY = new Set(['', '0', 'false', 'null', 'undefined', 'void 0'])

/** 数字参数：空值/非法数字返回 undefined */
function toNumber(value: string) {
  if (!value.trim()) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

/** 布尔参数：'0' / 'false' / 空串等视为 false */
const toBoolean = (value: string) => !FALSY.has(value)

/** JSON 参数：解析失败返回 undefined（不抛错） */
function toJson<T>(value: string): T | undefined {
  if (!value) return undefined
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

/** 路由参数原始值 → 本地字符串（重复参数按分隔符拼接） */
const normalizeRaw = (raw: unknown) => (Array.isArray(raw) ? raw.join(SEPARATOR) : typeof raw === 'string' ? raw : '')

/**
 * 获取路由参数并转换：number、boolean、array、json，数组方法逐项处理。
 *
 * - 必须在组件 setup 内调用（内部使用 useRoute + watch）
 * - required 只校验参数是否存在，空字符串不报错
 * - 参数缺失或为空串时取 defaultValue；给了默认值即视为可选，不再提示缺少参数
 * - 返回可写 Ref，写值只更新本地参数，不回写 URL
 */
export function useValidateArgs<T extends string = string>(args: string, required = true, defaultValue?: T) {
  const route = useRoute()
  const value = ref('' as T)
  /** 必传参数只提示一次，避免路由再次变化时重复报错 */
  let validated = false

  watch(
    () => route.query[args] ?? route.params[args],
    raw => {
      // 取不到参数（缺失/空串）时回落到默认值
      value.value = (normalizeRaw(raw) || defaultValue || '') as T
      // 有默认值时参数视为可选，不再提示缺少参数
      if (raw == null && required && defaultValue === undefined && !validated) {
        useError(`缺少关键参数${args}`)
        validated = true
      }
    },
    { immediate: true }
  )

  /** 单值可写 computed：get 解析、set 序列化（空值写空串） */
  const scalar = <R>(parse: (raw: string) => R, stringify: (next: R) => string | undefined) =>
    computed<R>({
      get: () => parse(value.value),
      set: next => {
        value.value = (next == null ? '' : stringify(next) ?? '') as T
      },
    })

  const getList = () => (value.value ? value.value.split(SEPARATOR).filter(Boolean) : [])
  const setList = (items: string[]) => {
    value.value = (items.join(SEPARATOR) || '') as T
  }

  /** 数组元素映射：逐项解析/序列化（逗号拼接，元素本身不能含分隔符） */
  const mapList = <R>(parse: (item: string) => R | undefined, stringify: (item: R) => string) =>
    computed<R[]>({
      get: () =>
        getList().flatMap(item => {
          const parsed = parse(item)
          return parsed === undefined ? [] : [parsed]
        }),
      set: items => setList(items.map(stringify)),
    })

  /** 数组参数（逗号分隔），可继续指定元素类型 */
  const array = () =>
    Object.assign(computed<string[]>({ get: getList, set: setList }), {
      number: () => mapList(toNumber, String),
      boolean: () => mapList(toBoolean, String),
      /** JSON 数组整体存一个参数：逐项逗号拼接会被 JSON 内部的逗号破坏 */
      json: <R = unknown>() => scalar<R[]>(raw => toJson<R[]>(raw) ?? [], items => JSON.stringify(items)),
    })

  return Object.assign(value, {
    /** 单值 → 数字 */
    number: <R extends number = number>() =>
      scalar<R | undefined>(raw => toNumber(raw) as R | undefined, next => String(next)),

    /** 单值 → 布尔（写回 'true' / 'false'） */
    boolean: () =>
      computed<boolean>({
        get: () => toBoolean(value.value),
        set: next => {
          value.value = (next ? 'true' : 'false') as T
        },
      }),

    /** 单值 → JSON */
    json: <R = unknown>() => scalar<R | undefined>(raw => toJson<R>(raw), next => JSON.stringify(next)),

    array,
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

