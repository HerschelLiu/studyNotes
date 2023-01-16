```ts
import { useRouter } from 'vue-router' // vue3路由方法

import { useState } from '@/hooks/useState' // 数据的封装
import { useError } from '@/hooks/useTip'
import router from '@/router' // 项目的路由设置
import { useRoutesName } from '@/router/name' // 页面名字和相应路由名封装

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
    useError('缺少必要的参数')
    if (route.matched.filter(item => !item.redirect).length > 1) {
      useState().handleCancel() // 删除面包屑导航记录以及返回到上一页
    } else {
      useRouter().push({
        name: useRoutesName('404页面'),
        replace: true
      })
    }
    return Promise.reject()
  } else return Promise.resolve('')
}

```

