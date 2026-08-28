### 场景

在实际场景中，某个编辑抽屉使用的是其主列表的数据但是格式不同（如主列表为表格，编辑中下拉选项用的是树），此时主列表数据有变更，详情中的树数据无法更新。**因为**，他们是不同接口，queryKey不同，vue-query 看到的是**两条独立缓存记录**，不知道 list 和 tree 业务上是"同一份数据的不同形态"，所以 invalidate list 时 tree 不动，这层"业务关联"必须由代码去关联；

### 代码

修改方案：

1. 在每个触发主列表更新的接口增加树的queryKey（x）
2. tree接口的queryKey设置成list接口的queryKey（x）:同 key + 不同 queryFn = 缓存冲突:1.**数据格式不同**;2.**同 key 缓存只有一份**
3. 在如下拉数据的同一的地方，对二者进行关联

```ts
import type { xxx } from '@/api/masterBudget/budgetInfo'

import { xxx } from '@/api/masterBudget/budgetInfo'
import { EnableStatus, YesOrNo } from '@/enum'
import { isHaveValue } from '@/hooks/useValidate'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { queryKeys } from '@/constants/queryKeys'
import { useValue } from '@/hooks/useObject'

export interface SelectDefaultItems {
  _label: string
  _value: string | number
  _code?: string
}

/**
 * list ↔ tree 配对关系：list 失效时自动失效 tree，避免每个页面单独配置 invalidateKeys。
 * 只匹配 queryKey 第 0 项（如 'BUDGET_LIST_PROJ_TYPE'），兼容 list(isRoll) 这类带参 key。
 */
const LIST_TREE_PAIRS: Array<[readonly unknown[], readonly unknown[]]> = [
  [queryKeys.projMgmt.projType.list(), queryKeys.projMgmt.projType.tree()],
]

const matchKeyFirst = (target: readonly unknown[], prefix: readonly unknown[]): boolean => target[0] === prefix[0]

/** 获取基础数据无分页列表或树 */
export const useBudgetStore = defineStore('budget', () => {
  const queryClient = useQueryClient()

  /** 订阅 queryCache：list 被 invalidate 时自动级联失效对应 tree */
  queryClient.getQueryCache().subscribe(event => {
    if (event.type !== 'updated') return
    if (event.action?.type !== 'invalidate') return
    const invalidatedKey = event.query.queryKey
    for (const [listKey, treeKey] of LIST_TREE_PAIRS) {
      if (matchKeyFirst(invalidatedKey, listKey)) {
        queryClient.invalidateQueries({ queryKey: treeKey })
        break
      }
    }
  })

  /** 专项管理-项目类型 */
  const useGetListProjType = () => {
    return useQuery<(ResponseListProjType & SelectDefaultItems)[], Error>({
      queryKey: queryKeys.projMgmt.projType.list(),
      queryFn: async () => {
        const { rows } = await listProjType({})
        return rows.map(item => ({
          _label: item.name,
          _value: item.id,
          _code: item.code,
          ...item
        }))
      }
    })
  }

  /** 专项管理-项目类型树 */
  const useGetTreeProjType = () => {
    return useQuery<ResponseListProjTypeTree[], Error>({
      queryKey: queryKeys.projMgmt.projType.tree(),
      queryFn: async () => {
        const { data } = await getParentProjTypeTree()
        return data as ResponseListProjTypeTree[]
      }
    })
  }

  return {
    useGetListProjType,
    useGetTreeProjType,
  }
})

```

> **`subscribe(event => { ... })`**
>
> - 在 queryCache 上注册一个**全局监听器**，每当任意 query 的状态变化时（加载、成功、失败、被 invalidate、被 remove 等），回调都会被触发
> - 返回一个 unsubscribe 函数（这里没保存，因为 store 跟 app 同生命周期，不需要取消）
> - `event` 参数包含：`type`（事件类型）、`query`（受影响的 query 对象）、`action`（触发变化的具体动作）
>
>  **`if (event.type !== 'updated') return` **
>
> * `queryCache.subscribe(event: QueryCacheNotifyEvent) => void)`
>
> - queryCache 的 subscribe 支持几种事件类型：`'added'`（新 query 注册）、`'removed'`（query 被清理）、`'updated'`（query 状态变化）
> - 我们只关心"已存在的 query 状态变化"，所以只处理 `'updated'`
> - 其他情况（比如首次创建 query）直接 return，不做任何级联操作
>
> **`if (event.action?.type !== 'invalidate') return`**
>
> - `'updated'` 事件下还细分多种 action：`'fetch'`（发起请求）、`'success'`（请求成功）、`'error'`（请求失败）、`'invalidate'`（被手动标记失效）等
> - 我们只关心**主动 invalidate** —— 也就是页面调用 `useMutation` 的 `invalidateKeys: [queryKeys.projMgmt.projType.list()]` 这种场景
> - `?.` 是防御性写法，万一 `event.action` 是 undefined（理论上不会）也不报错
> - 其他 action（比如请求成功）不级联，避免误触发
>
> **`const invalidatedKey = event.query.queryKey`**
>
> - `event.query` 是被 invalidate 的 query 对象（比如 list query）
> - `queryKey` 是它的 key，比如 `['BUDGET_LIST_PROJ_TYPE']` 或 `['BUDGET_LIST_DEPT', '是']`（带参）
>
> **`refetchType: 'active'`**
>
> - **只 refetch 当前有 active observer 的 query**
>   - active observer = 当前有组件在 `useQuery()` 监听这条数据（比如抽屉打开期间 details.vue 的 `useGetTreeProjType()`）
>   - inactive 的 query（比如抽屉关了，组件卸载）只标记为 stale，不立即发请求
> - `refetchType` 的默认值就是 `'active'`。`refetchType` 的两个可选值：
>   - `'active'`（默认）：只 refetch 当前有 active observer 的 query（组件还挂着 `useQuery`）
>   - 'all'： 不管有没有 observer，都强制 refetch 所有匹配的 query（包括 inactive 的缓存记录）

### `queryCache.subscribe(event: QueryCacheNotifyEvent) => void)`event字段说明

##### `event.typ`

`event.type` 是 **QueryCache 缓存层面的事件类型**，只有三种：

| 值          | 含义                            |
| :---------- | :------------------------------ |
| `'added'`   | 一个新的 Query 被加入缓存       |
| `'updated'` | 一个已存在的 Query 状态发生变化 |
| `'removed'` | 一个 Query 被从缓存中移除       |

## `event.action?.type` 的取值

`event.action` 是 **导致这次更新的具体动作**，更细粒度，通常出现在 `'updated'` 事件中。`event.action?.type` 可能的值大致如下：

| 值             | 发生场景                                                     |
| :------------- | :----------------------------------------------------------- |
| `'fetch'`      | 查询开始请求数据，比如首次加载或重新拉取                     |
| `'success'`    | 请求成功，数据已写入缓存                                     |
| `'error'`      | 请求失败，错误已写入缓存                                     |
| `'setData'`    | 手动调用 `setQueryData` 直接设置缓存数据                     |
| `'update'`     | 查询配置或数据被更新（例如 `setQueryData` 之后内部标记）     |
| `'invalidate'` | 查询被标记为失效，会触发重新拉取                             |
| `'reset'`      | 查询被重置，回到初始状态                                     |
| `'remove'`     | 查询被主动移除                                               |
| `'revert'`     | 查询状态被回退/恢复                                          |
| `undefined`    | 某些通知没有携带 action，比如 `'added'` / `'removed'` 或者某些手动更新 |

# gcTime 和 staleTime

| 配置        | 控制什么   | 默认值                  | 一句话解释                                                   |
| ----------- | ---------- | ----------------------- | ------------------------------------------------------------ |
| `staleTime` | 数据新鲜度 | `0`                     | 数据多久后算"过期"，过期后组件挂载会后台刷新，0代表每次都是新鲜的数据 |
| `gcTime`    | 缓存存活期 | `5 * 60 * 1000` (5分钟) | 组件卸载后，缓存数据在内存里保留多久                         |

`staleTime` 影响的是**还在用的时候**（组件挂载了，要不要刷新）； `gcTime` 影响的是**不用之后**（组件卸载了，要不要留着）。

### isLoading vs isFetching

| 属性         | 含义                           | 什么时候为 `true`                    |
| ------------ | ------------------------------ | ------------------------------------ |
| `isLoading`  | **首次加载中，且没有缓存数据** | 这个 `queryKey` 从来没成功获取过数据 |
| `isFetching` | **请求正在进行中**             | 只要有网络请求在跑，不管有没有缓存   |

| 场景                           | `isLoading` | `isFetching` | 用户看到什么                              |
| ------------------------------ | ----------- | ------------ | ----------------------------------------- |
| 第一次进入页面（缓存为空）     | `true`      | `true`       | 全屏 loading                              |
| 离开再回来，后台刷新（有缓存） | `false`     | `true`       | **旧数据还在**，表格右上角可能有个小 spin |
| 分页切换（新 `queryKey`）      | `true`      | `true`       | 全屏 loading                              |
| 空闲状态                       | `false`     | `false`      | 稳定展示                                  |

Vue Query v4 里 `isLoading` 的定义是 `isFetching && !data`，v5 改成了 `status === 'pending'`。这个变动导致很多从 v4 迁移过来的项目踩坑——以为 `isLoading` 会在每次 refetch 时变为 `true`，实际上不会了。