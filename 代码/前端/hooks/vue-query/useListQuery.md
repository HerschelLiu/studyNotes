`useListQuery`

```ts
import type { QueryKey } from '@tanstack/vue-query'
import type { TableDataInfo } from '@/types/api/common'
import type { MaybeRef } from 'vue'

import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useQuery } from '@tanstack/vue-query'
import { useValue } from '@/hooks/useObject'

/** 分页参数默认值 */
const getPage = (enablePage = true): ListBaseQuery => {
  const pageSize = useStorage('pageSize', 20)
  return enablePage ? { pageNum: 1, pageSize: pageSize.value } : {}
}

/** useListQuery 配置项 */
export interface UseListQueryOptions {
  /** 是否启用分页，默认 true */
  enablePage?: boolean
  /** 是否在挂载时自动请求，默认 true */
  enabled?: MaybeRef<boolean>
  /** 错误处理，默认 console.error */
  onError?: (err: unknown) => void
}

/**
 * 列表查询 hook（基于 @tanstack/vue-query）
 *
 * @param queryKey   唯一标识前缀
 * @param queryFn    请求函数
 * @param otherQuery 初始查询条件（不含分页字段，分页字段由内部按 enablePage 自动注入）
 * @param options    其他配置（enablePage / enabled / onError）
 */
export const useListQuery = <Q = Record<string, any>, R = object, TData = TableDataInfo<R>>(
  otherQuery: Partial<Q> = {},
  queryKey: QueryKey | ((query: Q & ListBaseQuery) => QueryKey),
  queryFn: (query: Q & ListBaseQuery) => Promise<TData>,
  options: UseListQueryOptions = {}
) => {
  const queryKeyResolver = typeof queryKey === 'function' ? (queryKey as (query: Q & ListBaseQuery) => QueryKey) : undefined

  const queryKeyPrefix = ref<QueryKey[number] | 'dynamic'>(queryKeyResolver ? 'dynamic' : (queryKey as QueryKey)[0])

  const {
    enablePage = true,
    enabled = true,
    onError = err => console.error(`useListQuery[${JSON.stringify(queryKeyPrefix.value)}] error:`, err)
  } = options

  const list = reactive<List<Q, R>>({
    query: {
      ...getPage(enablePage),
      ...otherQuery
    } as unknown as Q & ListBaseQuery,
    items: [],
    loading: false,
    total: 0,
    // 保留与 useList 相同签名，内部委托给 refetch，兼容旧调用方
    request: async function (_callback: () => Promise<any>) {
      await refetch()
    }
  })

  const queryParams = computed(() => useValue(list.query) as Q & ListBaseQuery)

  const queryKeyRef = computed<QueryKey>(() => {
    if (queryKeyResolver) {
      const key = queryKeyResolver(queryParams.value)
      queryKeyPrefix.value = Array.isArray(key) ? key[0] : key
      return key
    }
    return [...(queryKey as QueryKey)]
  })

  const queryResult = useQuery<TData, Error>({
    queryKey: queryKeyRef,
    queryFn: async () => {
      try {
        const res = await queryFn(queryParams.value)
        const body = res as unknown as TableDataInfo<R>
        list.items = (body.rows ?? (Array.isArray(res) ? res : [])) as any
        list.total = typeof body.total === 'number' ? body.total : Array.isArray(res) ? res.length : 0
        return res
      } catch (err) {
        onError(err)
        throw err
      }
    },
    enabled
  })

  const { isLoading, refetch } = queryResult

  // loading 完全跟随 vue-query 状态
  watch(
    isLoading,
    loading => {
      list.loading = loading
    },
    { immediate: true }
  )

  const getList = () => refetch()

  return {
    list,
    getList,
    queryResult,
    ...queryResult
  }
}

```

> ```ts
>     {},
>     ['BUDGET_DEPT_FILL_LIST'],
>     listBudgetDeptFill
>   )
> ```
>
> 

