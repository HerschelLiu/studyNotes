```ts
declare module '*.js' {
  export const js: any
  export default js
}

declare type Key = string | number

type WxPage = WechatMiniprogram.Page.Instance<Record<string, any>, Record<string, any>>
type WxComponent = WechatMiniprogram.Component.Instance<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>

declare const __wxConfig: {
  page: Record<string, any>
}

interface InitOptions {
  /** 当前页面是否需要登录 */
  needLogin: boolean
}
```

