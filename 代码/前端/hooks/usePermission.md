## VUE

```ts
import { ref } from 'vue'
import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router'

import { useError } from '@/hooks/useTip'
import { isArray } from '@/hooks/useValidate'
import router from '@/router'

/** 用户类型 */
export enum UserType {
  '普通用户' = 0,
  '超级用户' = 1
}

/** 以下内容只做示例 */
const useUserStore = {
  userInfo: {
    userType: 1
  }
}

/**
 * 路由权限hooks
 * @param value 权限名称
 * @param routeName 路由名称
 * @returns 是否有权限
 */
export function usePermission(value: string | string[], routeName?: Cap): boolean {
  const userStore = useUserStore()
  if (UserType['超级用户'] === userStore.userInfo.userType) return true
  const route = ref<RouteRecordNormalized | RouteLocationNormalizedLoaded | undefined>()
  if (routeName) {
    route.value = router.getRoutes().find(item => item.name === routeName)
  } else route.value = router.currentRoute.value
  const actionKeys = route.value?.meta.actionKeys as string[] | undefined
  if (typeof value === 'string') {
    if (actionKeys && !actionKeys.includes(value)) {
      return false
    }
  } else if (isArray(value)) {
    if (value.some(item => typeof item !== 'string')) {
      throw new Error()
    }
    if (actionKeys && !value.every(item => actionKeys.includes(item))) {
      return false
    }
  }
  return true
}

/**
 * 路由权限hooks
 * @param value 权限名称
 * @param routeName 路由名称
 * @returns 是否有权限
 */
export function usePermissionError(value: string | string[], routeName?: Cap): boolean {
  if (!usePermission(value, routeName)) {
    useError('抱歉！您没有权限进行此操作！')
    return true
  }
  return false
}

```

```ts
type Words =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

/** 限定首字母大写 */
type Cap = `${Capitalize<Words>}${string}`
```

