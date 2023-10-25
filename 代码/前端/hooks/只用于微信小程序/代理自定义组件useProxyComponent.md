```ts
/* eslint-disable prefer-rest-params */

import computedBehavior from '../module/computed.js'
import { isArray } from './useValidate'

/** 代理方法 */
function initComponentProxy() {
  const _Component = Component
  Component = function (this: WechatMiniprogram.Component.Constructor, options: Record<string, Function | any[]>) {
    try {
      if (!options.closeProxyBehaviors) {
        if (!options) options = {}
        if (!isArray(options.behaviors)) {
          options.behaviors = []
        }
        options.behaviors = [...options.behaviors.filter(item => item !== computedBehavior), computedBehavior]
      }
      _Component.apply(this, arguments as any)
    } catch (error) {
      _Component.apply(this, arguments as any)
    }
  } as any
}

/** 全局Component代理 */
export const useProxyComponent = function () {
  initComponentProxy()
}

```

```ts
// app.ts

// 引入useProxyComponent

// useProxyPage()
/** 代理Component */
useProxyComponent()

App({...})
```

