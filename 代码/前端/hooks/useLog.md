## JS
```ts
/* eslint-disable no-console */

/** 有样式的打印 */
export function useLog(title: string, info: string | undefined) {
  if (import.meta.env.DEV) {
    console.log(
      `%c${title}%c${info || ''}`,
      'background-color: #43bb88; color: #ffffff; padding: .2em 0.5em; border-radius: 3px 0 0 3px;',
      'background-color: #f47920; color: #ffffff; padding: .2em 0.5em; border-radius: 0 3px 3px 0;'
    )
  }
}

```



## 微信小程序

```ts
/* eslint-disable no-console */
// 全局变量
import { globalData } from '../settings'

/** 打印，生产环境时会将日志推送志小程序后台 */
export function useLog(title: string, info: string) {
  if (wx.getSystemInfoSync().platform === 'devtools') {
    console.log(
      `%c${title}%c${info}`,
      'background-color: #43bb88; color: #ffffff; padding: .2em 0.5em; border-radius: 3px 0 0 3px;',
      'background-color: #f47920; color: #ffffff; padding: .2em 0.5em; border-radius: 0 3px 3px 0;'
    )
  } else console.log(`${title}: ${info}`)

  if (globalData.env === 'prod') {
    if (!globalData.RealtimeLogManager) globalData.RealtimeLogManager = wx.getRealtimeLogManager()
    globalData.RealtimeLogManager.info(`${title}: ${info}`)
  }
}

```

