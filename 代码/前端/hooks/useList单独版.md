## vue3(与element-plus配合精简版)

```ts
import { reactive } from 'vue'
import { useStorage } from '@vueuse/core'

/**
 * 定义列表参数
 */
export const defineListProps = <T>() => {
  return {
    /** 数据列表 */
    list: {
      type: Object,
      required: true
    }
  }
}

/** 定义列表emits */
export const defineListEmits = () => {
  return ['update:list']
}

/**
 * 插入分页参数
 * @function
 * @param { boolean } enablePage 是否启用分页
 * @returns { pageNum: number, pageSize: number } 分页参数
 */
const getPage = (enablePage = true): ListBaseQuery => {
  /**
   * 分页参数
   * @type { Ref<number> }
   */
  const pageSize = useStorage('pageSize', 20)
  return enablePage ? { pageNum: 1, pageSize: pageSize.value } : {}
}

/**
 * 列表数据
 * @typedef { Reactive<Object> } List
 * @property { Object } query 查询条件
 * @property { Object[] } items 列表数据
 * @property { boolean } loading 加载状态
 * @property { number } total 总数
 * @property { (callback: () => Promise<any>) => Promise<void>} request 请求方法
 */
export const useList = <Q = null, R = object>(otherQuery: Partial<Q>, enablePage = true) => {
  const list = reactive<List<Q, R>>({
    query: {
      ...getPage(enablePage),
      ...otherQuery
    } as unknown as Q & ListBaseQuery,
    items: [],
    loading: false,
    total: 0,
    request: async function (callback: any) {
      if (this.loading) return
      this.loading = true
      try {
        const data = await callback()
        this.items = Array.isArray(data.rows) ? data.rows : Array.isArray(data) ? data : []
        this.total = typeof data.total === 'number' ? data.total : Array.isArray(data) ? data.length : 0
        this.loading = false
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    }
  })

  return list
}

/**
 * 列表数据组件化
 * @param { any } props
 * @param { { emit: (event: any, ...args: any[]) => void } } context
 */
export const useListRef = <Q = null, R = object>(props, context) => {
  /** 列表数据组件化 */
  const list = computed({
    get() {
      return props.list
    },
    set(value) {
      context.emit('update:list', value)
    }
  })

  return {
    list
  }
}

```

```type
declare global {
  /** 列表请求参数基础数据 */
  interface ListBaseQuery {
    /** 当前页码 */
    pageNum?: number
    /** 分页大小 */
    pageSize?: number
  }

  /** 列表基础数据 */
  interface ResponseList<T> {
    /** 数据列表 */
    records: T[]
    /** 数据总量 */
    total: number
  }

  interface List<Q = null, R = object> {
    /** 数据列表 */
    items: R[]
    /** 请求参数 */
    query: Q & ListBaseQuery
    /** 数据总量 */
    total: number
    /** 是否加载中 */
    loading: boolean
    /** 请求方法 */
    request: (callback: () => Promise<any>) => Promise<void>
  }
}
```

### 配合`@tanstack/vue-query`

`useListQuery`

```ts
import type { TableDataInfo } from '@/types/api/common'

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
  enabled?: boolean
  /** 错误处理，默认 console.error */
  onError?: (err: unknown) => void
}

/**
 * 列表查询 hook（基于 @tanstack/vue-query）
 *
 * @param queryKey   唯一标识（不含动态查询条件，动态部分会自动追加）
 * @param queryFn    请求函数，接收清洗后的查询条件（含分页）
 * @param otherQuery 初始查询条件（不含分页字段，分页字段由内部按 enablePage 自动注入）
 * @param options    其他配置（enablePage / enabled / onError）
 */
export const useListQuery = <Q = Record<string, any>, R = object, TData = TableDataInfo<R>>(
  otherQuery: Partial<Q> = {},
  queryKey: string[],
  queryFn: (query: Q & ListBaseQuery) => Promise<TData>,
  options: UseListQueryOptions = {}
) => {
  const { enablePage = true, enabled = true, onError = err => console.error(`useListQuery[${queryKey[0]}] error:`, err) } = options

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
  const queryResult = useQuery<TData, Error>({
    queryKey: [...queryKey] as any,
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

  const { isPending, isFetching, refetch } = queryResult

  // loading 完全跟随 vue-query 状态：首次加载(isPending) + 后台重取(isFetching)
  watch(
    [isPending, isFetching],
    ([pending, fetching]) => {
      list.loading = pending || fetching
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
>        ['BUDGET_DEPT_FILL_LIST'],
>        listBudgetDeptFill
>   )
> ```
>
> 



## vue3uniapp

```ts
import { reactive } from 'vue'

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
    haveMore: true,
    showText: true,
    reGet: false,
    haveAny: true
  })

  return list
}

/** 初始化列表 */
export function useInitList(list: List<any, any>) {
  list.items = []
  list.total = 0
  if (list.query) list.query.pageNum = 1
  list.pageCount = 0
  list.loading = false
  list.haveMore = true
  list.haveAny = true
  list.reGet = false

  return list
}

/** 请求前处理 */
export function useBeforeList<Q, R>(list: List<Q, R>, showToast = false) {
  if (list.loading || !list.haveMore) {
    if (showToast && !list.haveMore) {
      useShowToast({ title: '没有更多数据了' })
    }
    return Promise.reject()
  }
  list.loading = true

  return Promise.resolve(list)
}

/** 请求后处理 */
export function useAfterList(list: List<any, any>, res: any, target = 'items') {
  if (res.data === null) res.data = []
  list.total = typeof res.total === 'number' ? res.total : res[target].length || 0
  list.items = list.items.concat(res[target] || res || [])
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveAny = false
    list.haveMore = false
  } else {
    if (list.query && list.query.pageNum) {
      if (list.query.pageNum >= list.pageCount) list.haveMore = false
      else list.query.pageNum++
    } else list.haveMore = false
  }

  return list
}

/**
 * 数据条数等处理-分组
 * @param list 列表
 * @param Page 页面栈
 * @param res 需要插入的数据
 * @param target 列表key值
 * @param key 分组的字段名
 * @returns 列表
 */
export function useAfterListGroup(list: List<any, any>, res: any, target = 'list', key: string) {
  if (res.data === null) res.data = []
  list.total = typeof res.data.total === 'number' ? res.data.total : res.data.length || 0
  ;(Array.isArray(res.data) ? res.data : res.data.items).forEach((item: any) => {
    const value = item[key]
    let obj = list.items.find((listItem: any) => listItem.key === value)
    if (obj) {
      obj.items.push(item)
    } else {
      obj = {
        key: value,
        items: [item]
      }
      list.items.push(obj)
    }
  })
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveAny = false
    list.haveMore = false
  } else {
    if (list.query && list.query.pageIndex) {
      if (list.query.pageIndex >= list.pageCount) list.haveMore = false
      else list.query.pageIndex++
    } else list.haveMore = false
  }

  return list
}

/**
 * 发生错误时
 * @param list 列表
 * @returns 列表
 */
export function useErrorList(list: List<any, any>) {
  list.loading = false
  list.reGet = !list.haveAny

  return list
}
```

```ts
/** 列表请求参数基础数据 */
declare interface ListBaseQuery {
  /** 当前页码 */
  pageNum?: number
  /** 分页大小 */
  pageSize?: number
}

/** 列表基础数据 */
interface ResponseList<T> {
  /** 数据列表 */
  records: T[]
  /** 数据总量 */
  total: number
}

interface List<Q = null, R = object> {
  /** 数据列表 */
  items: R[];
  /** 请求参数 */
  query: Q & ListBaseQuery,
  /** 数据总量 */
  total: number;
  /** 是否加载中 */
  loading: boolean;
  /** 总页数 */
  pageCount: number;
  /** 是否还有数据未加载 */
  haveMore: boolean;
  /** 是否有数据 */
  haveAny: boolean
  /** comp-list组件使用 - 是否显示提示语 */
  showText: boolean
  /** comp-list组件使用 - 是否显示重新加载数据提示 */
  reGet: boolean
}
```



## 小程序

```ts
import { isArray } from './useValidate'

/**
 * 加载前预置
 * @param list 列表
 * @param Page 页面栈
 * @param target 列表key值
 * @returns 列表
 */
export function usePreList(list: List<any, any>, Page: WxPage | WxComponent, target = 'list') {
  list.loading = true
  list.reGet = false
  Page.setData({
    [`${target}.loading`]: list.loading,
    [`${target}.reGet`]: list.reGet
  })
  Page.data.busy = true
  return list
}

/**
 * 数据条数等处理
 * @param list 列表
 * @param Page 页面栈
 * @param res 需要插入的数据
 * @param target 列表key值
 * @returns 列表
 */
export function useAfterList(list: List<any, any>, Page: WxPage | WxComponent, res: any, target = 'list') {
  if (res.data === null) res.data = []
  list.total = typeof res.data.total === 'number' ? res.data.total : res.data.length || 0
  list.items = list.items.concat(res.data.items || res.data || [])
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveAny = false
    list.haveMore = false
  } else {
    if (list.query && list.query.pageIndex) {
      if (list.query.pageIndex >= list.pageCount) list.haveMore = false
      else list.query.pageIndex++
    } else list.haveMore = false
  }
  Page.setData({
    [target]: list,
    loading: false
  })
  Page.data.busy = false

  return list
}

/**
 * 数据条数等处理-分组
 * @param list 列表
 * @param Page 页面栈
 * @param res 需要插入的数据
 * @param target 列表key值
 * @param key 分组的字段名
 * @returns 列表
 */
export function useAfterListGroup(list: List<any, any>, Page: WxPage | WxComponent, res: any, target = 'list', key: string) {
  if (res.data === null) res.data = []
  list.total = typeof res.data.total === 'number' ? res.data.total : res.data.length || 0
  ;(isArray(res.data) ? res.data : res.data.items).forEach((item: any) => {
    const value = item[key]
    let obj = list.items.find((listItem: any) => listItem.key === value)
    if (obj) {
      obj.items.push(item)
    } else {
      obj = {
        key: value,
        items: [item]
      }
      list.items.push(obj)
    }
  })
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveAny = false
    list.haveMore = false
  } else {
    if (list.query && list.query.pageIndex) {
      if (list.query.pageIndex >= list.pageCount) list.haveMore = false
      else list.query.pageIndex++
    } else list.haveMore = false
  }
  Page.setData({
    [target]: list,
    loading: false
  })
  Page.data.busy = false

  return list
}

/**
 * 发生错误时
 * @param list 列表
 * @param Page 页面栈
 * @param target 列表key值
 * @returns 列表
 */
export function useErrorList(list: List<any, any>, Page: WxPage | WxComponent, target = 'list') {
  list.loading = false
  list.reGet = true
  Page.setData({
    [`${target}.loading`]: list.loading,
    [`${target}.reGet`]: list.reGet,
    loading: false
  })
  Page.data.busy = false
  return list
}

/**
 * 初始化数据
 * @param list 列表
 * @param Page 页面栈
 * @param target 列表key值
 * @param setData 是否需要setData，onShow页面时不需要显示加载动画
 * @returns 列表
 */
export function useInitList(list: List<any, any>, Page: WxPage | WxComponent, target = 'list', setData = false) {
  list.items = []
  list.total = 0
  list.query && (list.query.pageIndex = 1)
  list.pageCount = 0
  list.loading = false
  list.haveMore = true
  list.haveAny = true
  list.reGet = false
  if (setData) {
    Page.setData({
      [target]: list
    })
  }
  return list
}


```

```ts
type WxPage = WechatMiniprogram.Page.Instance<Record<string, any>, Record<string, any>>
type WxComponent = WechatMiniprogram.Component.Instance<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>

/** 请求参数基础数据 */
interface ListBaseQuery {
  /** 当前页码 */
  pageIndex: number
  /** 分页大小 */
  pageSize: number
}

/** 列表 */
interface List<Q, R> {
  /** 数据列表 */
  items: R[]
  /** 数据总量 */
  total: number
  /** 请求参数 */
  query: Q
  /** 总页数 */
  pageCount: number
  /** 是否加载中 */
  loading: boolean
  /** 是否还有数据未加载 */
  haveMore: boolean
  /** 是否至少有一条数据 */
  haveAny: boolean
  /** 是否显示重新加载数据按钮 */
  reGet: boolean
  /** 是否显示没有更多数据时的文本 */
  showText: boolean
  /** 无数据时的文本 */
  noneText?: string
}

/** 列表基础数据 */
interface ResponseList<T> {
  /** 数据列表 */
  items: T[]
  /** 数据总量 */
  total: number
}
```

