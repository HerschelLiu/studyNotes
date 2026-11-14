# useArgs

> URL query ↔ 响应式参数（类型转换/校验），提示依赖 `useTip` + `## 微信小程序` 段

## VUE

`vue3.x`

```tsx
import { computed, nextTick, shallowRef, watch } from 'vue'

import { useError } from './useTip'

/** 数组参数在 URL 中的分隔符 */
const SEPARATOR = ','

/** 布尔参数视为 false 的字符串集合 */
const FALSY = new Set(['', '0', 'false', 'null', 'undefined', 'void 0'])

/** 数字参数：空值/非法数字返回 undefined */
const toNumber = (value: string) => {
  if (!value.trim()) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

/** 布尔参数：'0' / 'false' / 空串等视为 false */
const toBoolean = (value: string) => !FALSY.has(value)

/** JSON 参数：解析失败返回 undefined（不抛错） */
const toJson = <T>(value: string): T | undefined => {
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
 * - setup 内同步读取当前路由参数，消费方可在 setup 中直接使用返回值
 * - required 只校验参数是否存在，空字符串不报错
 * - 参数缺失或为空串时取 defaultValue；给了默认值即视为可选，不再提示缺少参数
 * - 参数缺失提示会等路由稳定后再次确认，参数已补齐或已切到其他页面时不提示
 * - 返回可写 Ref，写值只更新本地参数，不回写 URL
 */
export function useValidateArgs<T extends string = string>(args: string, required = true, defaultValue?: T) {
  const route = useRoute()
  /**
   * 本组件所属路由的匹配路径：打开其他页面时全局 route 也会变化
   * （keep-alive 缓存的页面同样会收到），用路径字符串比较不受路由记录重建影响。
   */
  const ownMatchedPath = route.matched[route.matched.length - 1]?.path
  const isOwnRoute = () => route.matched[route.matched.length - 1]?.path === ownMatchedPath

  const readRaw = () => route.query[args] ?? route.params[args]
  /** 原始值 → 本地值（缺失/空串时回落到默认值） */
  const parseRaw = (raw: unknown) => (normalizeRaw(raw) || defaultValue || '') as T

  const value = shallowRef(parseRaw(readRaw()))
  /** 必传参数只提示一次，避免路由再次变化时重复报错 */
  let validated = false

  /** 必传校验：等路由稳定（下一帧）后参数仍缺失才提示，避免参数刚落位时误报 */
  const warnMissing = () => {
    if (validated || !required || defaultValue !== undefined) return
    validated = true
    nextTick(() => {
      // 期间已切到其他页面或参数已补齐：不再提示
      if (!isOwnRoute() || readRaw() != null) return
      useError(`缺少关键参数${args}`)
    })
  }

  const applyRaw = (raw: unknown) => {
    // 已打开其他页面：不再读取参数、不再提示缺少参数
    if (!isOwnRoute()) return
    value.value = parseRaw(raw)
    // 取到参数即视为校验通过
    if (raw != null) {
      validated = true
      return
    }
    warnMissing()
  }

  watch(readRaw, applyRaw, { immediate: true })

  /** 可写 computed：读取时解析，写入时序列化（空值写空串） */
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

  /** 数组元素逐项解析/序列化（元素本身不能含分隔符） */
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
    number: <R extends number = number>() => scalar<R | undefined>(raw => toNumber(raw) as R | undefined, next => String(next)),
    boolean: () => scalar<boolean>(toBoolean, next => String(next)),
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
