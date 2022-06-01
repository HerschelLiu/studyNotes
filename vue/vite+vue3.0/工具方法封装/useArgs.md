```ts
import { useRouter } from 'vue-router'

import { useError } from '@/hooks/useTip'
import router from '@/router'
import { useRoutesName } from '@/router/name'
import { useTagsViewStore } from '@/store/tagsview'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export async function useValidateArgs(args: string, required = true): Promise<string> {
  const route = router.currentRoute.value
  const tagsViewStore = useTagsViewStore()
  const arg = route.query[args] || route.params[args]
  if (arg && typeof arg === 'string') return Promise.resolve(arg)
  if (required) {
    useError('缺少必要的参数')
    if (route.matched.filter(item => !item.redirect).length > 1) {
      tagsViewStore.delView(route) // 页面显示的路由tag，没有相应样式可以删掉
      useRouter().go(-1)
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

