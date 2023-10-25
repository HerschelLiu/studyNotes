```ts
/** request补充 */
declare namespace WechatMiniprogram {
  interface RequestOption {
    /** 当前接口是否需要登录，若未登录时会先弹出授权登录，默认值false */
    needLogin?: boolean
    /** 当前接口异常时，是否显示toast打印错误信息，默认值true */
    showToast?: boolean
    /** 模块 */
    module?: 'saas' | 'oauth2'
  }
}

/** 接口返回Promise */
type AxiosPromise<T> = Promise<RequestResponse<T>>

/** 接口返回数据类型  */
interface RequestResponse<T> {
  /** 接口响应状态 */
  status: boolean
  /** 接口响应状态 */
  success: boolean
  /** 错误信息 */
  error: RequestResponseError
  /** 接口响应内容 */
  data: T
}
interface RequestResponseError {
  /** 错误码 */
  code: number
  /** 错误原因 */
  msg: string
}

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

