```ts
/** 定义列表数据 */
export function useList<Q = null, R = object>(otherQuery: Partial<Q>) {
  const list = reactive<List<Q, R>>({
    items: [],
    query: {
      pageNum: 1,
      pageSize: 20,
      ...(otherQuery as Q)
    },
    total: 0,
    pageCount: 0,
    loading: false,
    haveMore: true
  })

  return list
}

export function useInitList<Q, R>(list: List<Q, R>) {
  list.items = []
  list.total = 0
  if (list.query) {
    list.query.pageNum = 1
  }
  list.pageCount = 0
  list.loading = false
  list.haveMore = true

  return list
}

/** 请求前处理 */
export function useBeforeList<Q, R>(list: List<Q, R>) {
  if (list.loading || !list.haveMore) return list
  list.loading = true

  return list
}

export function useAfterList<Q, R>(list: List<Q, R>, res: Record<string, unknown>, target = 'records') {
  if (res.data === null) res.data = []
  list.total = typeof res.total === 'number' ? res.total : (res[target] as unknown[])?.length || 0
  list.items = list.items.concat((res[target] as R[]) || res || [])
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveMore = false
  } else {
    if (list.query && list.query.pageNum) {
      if (list.query.pageNum >= list.pageCount) list.haveMore = false
      else list.query.pageNum++
    } else list.haveMore = false
  }

  return list
}

```

