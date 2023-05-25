**TODO位置需要根据实际代码修改**

## VUE

```tsx
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

```

## 微信小程序

```ts
interface AnyObject {
  [x: string]: any
}
/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export function useValidateArgs(this: WxPage, args: string, required = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const arg = this.options[args]
    if (arg && typeof arg === 'string') return resolve(arg)
    if (required) {
      this.setData({
        loading: false,
        /** TODO: 错误处理
        fail: true,
        failContent: '页面缺少必要参数',
        failButtonContent: '返回',
        failRouterBack: true */
      })
      return reject()
    } else return resolve('')
  })
}

/** 获取链接中的参数对象 */
export function useArgsUrl(url: string): AnyObject {
  const [, search] = url.split('?')
  if (!search) return {}
  const obj: AnyObject = {}
  const query = search.split('&')
  query.forEach(item => {
    const [key, value] = item.split('=')
    obj[key] = decodeURIComponent(value)
  })
  return obj
}

/** 获取参数 */
export function useArgsObj(obj: AnyObject): string {
  let url = ''
  for (const key in obj) {
    url += (url ? '&' : '') + `${key}=${obj[key]}`
  }
  return url
}

```

