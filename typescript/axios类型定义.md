```ts
// shims.axios.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'axios'

declare module 'axios' {
  // 自定义类型
  export interface AxiosRequestConfig {
    /** 当前接口异常时，是否显示toast打印错误信息，默认值true */
    showToast?: boolean
    /** 接口的base类型 */
    base?: 'component'
  }
}

```

