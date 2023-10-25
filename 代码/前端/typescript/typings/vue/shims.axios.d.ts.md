```ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 当前接口异常时，是否显示toast打印错误信息，默认值true */
    showToast?: boolean
    /** 是否导出文件 */
    download?: boolean
    /** 模块 */
    module?: 'saas' | 'cxp' | 'oauth2'
  }

  export interface AxiosResponse {
    /** 文件名称 */
    filename: string
  }
}

```

