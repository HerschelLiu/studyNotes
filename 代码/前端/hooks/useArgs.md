**TODO位置需要根据实际代码修改**

`router.currentRoute.value` 拿的是 router 实例的当前路由快照，但 vue-router 4 在路由切换过程中：

1. 新组件的 `setup` 先执行（此时 `currentRoute` 可能还指向旧路由）
2. 然后才 commit 新的 `currentRoute`
3. 最后 `onMounted` 触发 —— 但偶发情况下步骤 2 还没完成

所以在 `onMounted` 里 `await useValidateArgs('type')` 偶现拿不到 `type`，特别是在某些标签页缓存场景、路由中间态、或 keep-alive 复用组件的情况下。

## VUE

```tsx
// vue3.x
import type { Ref } from 'vue'

import { useError } from './useTip'

/**
 * 验证参数是否存在（从当前路由 query / params 中按优先级取值）
 *
 * @param args 参数名
 * @param required 是否必填，默认 true：缺参数时提示并返回空串；false 时缺参返回空串、不提示
 * @returns 响应式参数值（Ref<string>）
 */
export function useValidateArgs(args: string, required = true): Ref<string> {
  const route = useRoute()
  const value = ref('')
  let validated = false

  watch(
    () => route.query[args] ?? route.params[args],
    arg => {
      const str = typeof arg === 'string' ? arg : ''
      if (str) {
        value.value = str
      } else if (required && !validated) {
        // 仅在首次（immediate）且 required 时校验，避免后续路由切换反复报错
        useError(`缺少关键参数${args}`)
      }
      validated = true
    },
    { immediate: true }
  )

  return value
}


// vue2.x
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

