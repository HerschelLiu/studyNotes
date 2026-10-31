```ts
type FilterConfig = Record<string, { field?: string; fuzzy?: boolean }>
/**
 * 根据 query 中各字段的值过滤数组
 * @param data 数据源
 * @param query 查询参数（来自请求）
 * @param config 字段配置：key 为 query 参数名，field 为数据字段名（默认同 key），fuzzy 为模糊匹配
 */
export const filterByQuery = <T extends Record<string, any>>(data: T[], query: Record<string, any>, config: FilterConfig): T[] =>
  data.filter(item =>
    Object.entries(config).every(([queryKey, { field, fuzzy }]) => {
      const queryVal = query[queryKey]
      if (queryVal === undefined || queryVal === '' || queryVal === null) return true
      const itemVal = item[field ?? queryKey]
      return fuzzy ? String(itemVal).includes(String(queryVal)) : itemVal === queryVal
    })
  )

type FilterConfig = Record<string, { field?: string; fuzzy?: boolean }>
/**
 * 根据 query 中各字段的值过滤数组
 * @param data 数据源
 * @param query 查询参数（来自请求）
 * @param config 字段配置：key 为 query 参数名，field 为数据字段名（默认同 key），fuzzy 为模糊匹配
 */
export const filterByQuery = <T extends Record<string, any>>(data: T[], query: Record<string, any>, config: FilterConfig): T[] =>
  data.filter(item =>
    Object.entries(config).every(([queryKey, { field, fuzzy }]) => {
      const queryVal = query[queryKey]
      if (queryVal === undefined || queryVal === '' || queryVal === null) return true
      const itemVal = item[field ?? queryKey]
      return fuzzy ? String(itemVal).includes(String(queryVal)) : itemVal === queryVal
    })
  )

```

