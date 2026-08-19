**TODO位置需要根据实际代码修改**

## VUE

```tsx
// vue3.x
import { useRouter } from 'vue-router'
import router from '@/router'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export async function useValidateArgs(args: string, required = true): Promise<string> {
  const route = router.currentRoute.value
  const arg = route.query[args] || route.params[args]
  if (arg && typeof arg === 'string') return Promise.resolve(arg)
  if (required) {
    /** TODO: 错误提示 */
    if (route.matched.filter(item => !item.redirect).length > 1) {
      /** TODO: 返回操作 */
    } else {
      useRouter().push({
        name: /** TODO: 404页面 */,
        replace: true
      })
    }
    return Promise.reject()
  } else return Promise.resolve('')
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

## 若依

```ts
import router from '@/router'
import useTagsViewStore from '@/store/modules/tagsView'
import { useError } from './useTip'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export async function useValidateArgs(args: string, required = true): Promise<string> {
  const route = router.currentRoute.value
  const arg = route.query[args] || route.params[args]
  if (arg && typeof arg === 'string') return Promise.resolve(arg)
  if (required) {
    const msg = `缺少关键参数${args}`
    useError(msg)
    try {
      const { visitedViews } = await useTagsViewStore().delView(route)
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        await router.push(latestView.fullPath)
      } else {
        await router.push('/')
      }
    } catch {
      // 导航重复 / 守卫取消类良性错误吞掉，不影响 rejection 抛出
    }
    return Promise.reject(new Error(msg))
  } else return Promise.resolve('')
}
import router from '@/router'
import useTagsViewStore from '@/store/modules/tagsView'
import { useError } from './useTip'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export async function useValidateArgs(args: string, required = true): Promise<string> {
  const route = router.currentRoute.value
  const arg = route.query[args] || route.params[args]
  if (arg && typeof arg === 'string') return Promise.resolve(arg)
  if (required) {
    const msg = `缺少关键参数${args}`
    useError(msg)
    try {
      const { visitedViews } = await useTagsViewStore().delView(route)
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        await router.push(latestView.fullPath)
      } else {
        await router.push('/')
      }
    } catch {
      // 导航重复 / 守卫取消类良性错误吞掉，不影响 rejection 抛出
    }
    return Promise.reject(new Error(msg))
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

