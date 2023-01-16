```ts
/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 * 使用：await useValidateArgs.call(this, 参数名, false)
 */
export function useValidateArgs(this: WxPage, args: string, required = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const arg = this.options[args]
    if (arg && typeof arg === 'string') return resolve(arg)
    if (required) {
      this.setData({
        loading: false,
        fail: true,
        failContent: '页面缺少必要参数',
        failButtonContent: '返回',
        failRouterBack: true
      })
      return reject()
    } else return resolve('')
  })
}
```

```ts
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
```

```ts
/** 获取参数 */
export function useArgsObj(obj: AnyObject): string {
  let url = ''
  for (const key in obj) {
    url += (url ? '&' : '') + `${key}=${obj[key]}`
  }
  return url
}
```

