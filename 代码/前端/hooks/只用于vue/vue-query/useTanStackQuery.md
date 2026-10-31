`useTansQuery`

```ts
import type { QueryKey } from '@tanstack/vue-query'

import { QueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/constants/queryKeys'

/**
 * 全局 vue-query client 单例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      /**
       * 禁止窗口/标签页重新获得焦点时自动 refetch。
       */
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
})

// #region TanStack Query Devtools
// TanStack Query Devtools 挂载点类型声明
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/vue-query').QueryClient
  }
}

// 仅开发环境暴露给 Devtools，生产环境不挂载
if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient
}
// #endregion

/**
 * list ↔ tree 缓存配对关系
 * list 查询被 invalidate 后，联动失效对应的 tree 查询（按 queryKey 第一段前缀匹配）
 */
const LIST_TREE_PAIRS: ReadonlyArray<readonly [QueryKey, QueryKey]> = [
  // 专项管理-项目类型
  [queryKeys.projMgmt.projType.list(), queryKeys.projMgmt.projType.tree()],
  // 预算单位
  [queryKeys.budgetUnit.list(), queryKeys.budgetUnit.tree()],
  // 预算科室
  [queryKeys.budgetDept.list(), queryKeys.budgetDept.tree()],
  // 预算类别
  [queryKeys.budgetType.list(), queryKeys.budgetType.tree()],
  // 收支项目
  [queryKeys.budgetExpense.list(), queryKeys.budgetExpense.tree()],
  // 支出功能分类
  [queryKeys.basicPlatform.functionalClass.list(), queryKeys.basicPlatform.functionalClass.tree()],
  // 支出经济分类
  [queryKeys.basicPlatform.economicClass.list(), queryKeys.basicPlatform.economicClass.tree()],
  // 资金类型
  [queryKeys.basicPlatform.fundType.list(), queryKeys.basicPlatform.fundType.tree()],
  // 执行科室
  [queryKeys.basicPlatform.execDept.list(), queryKeys.basicPlatform.execDept.tree()],
  // 资产配置方式
  [queryKeys.basicPlatform.assetMode.list(), queryKeys.basicPlatform.assetMode.tree()],
  // 资产配置用途
  [queryKeys.basicPlatform.assetPurpose.list(), queryKeys.basicPlatform.assetPurpose.tree()],
  // 项目论证
  [queryKeys.justify.list(), queryKeys.justify.tree()],
  // 项目库管理
  [queryKeys.projLibMgmt.list(), queryKeys.projLibMgmt.tree()],
  // 岗位信息
  [queryKeys.hr.jobInfo.list(), queryKeys.hr.jobInfo.tree()],
  // 预算科目
  [queryKeys.budgSubject.list(), queryKeys.budgSubject.tree()]
]

/** list 前缀 → tree 查询：把每次事件的线性遍历换成 O(1) 查表 */
const TREE_BY_LIST_PREFIX = new Map(
  LIST_TREE_PAIRS.map(([listKey, treeKey]) => [String(listKey[0]), treeKey] as const)
)

/** 已注册联动的 client，避免重复调用产生多个订阅 */
const linkedClients = new WeakSet<QueryClient>()

/**
 * 注册全局 list↔tree 缓存联动
 * @param client 可选，默认使用模块级单例 queryClient
 * @returns 取消订阅函数（重复注册时为空函数）
 */
export const setupQueryCacheLinks = (client: QueryClient = queryClient) => {
  if (linkedClients.has(client)) return () => {}
  linkedClients.add(client)

  return client.getQueryCache().subscribe(event => {
    if (event.type !== 'updated' || event.action?.type !== 'invalidate') return

    const invalidatedPrefix = String(event.query.queryKey[0])
    const treeKey = TREE_BY_LIST_PREFIX.get(invalidatedPrefix)
    // 未命中的 key，或 tree 自身被失效（避免反向递归触发）都直接跳过
    if (!treeKey || String(treeKey[0]) === invalidatedPrefix) return

    void client.invalidateQueries({ queryKey: treeKey })
  })
}

```



`main.ts`

```ts
import { VueQueryPlugin } from '@tanstack/vue-query'

import { queryClient, setupQueryCacheLinks } from '@/hooks/useTanStackQuery'

/** vue-query 全局 client：注册 list↔tree 缓存联动并通过插件注入组件树 */
setupQueryCacheLinks()
app.use(VueQueryPlugin, { queryClient })
```

