import type { InjectionKey, Ref } from 'vue'

/**
 * 查询对象注入键
 *
 * 需要读写查询对象的控件（如 daterange 拆两字段）自行 inject，
 * CommonSearchItem 不负责逐个控件透传。
 */
export const SEARCH_QUERY: InjectionKey<Ref<Record<string, any>>> = Symbol('CommonSearchItemQuery')
