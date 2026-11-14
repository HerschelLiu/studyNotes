import type { TableColumn } from './types'

/**
 * 列层级路径：`/prop`（根列）、`/parent/child`（子列）
 * - 列显隐面板与 vnode key 共用同一套标识，保证两处始终指向同一列
 * - 优先取列自身 key（prop 重复时由使用方指定），否则取 prop
 */
export const resolveColPath = <R>(col: TableColumn<R>, parent = ''): string => `${parent}/${col.key ?? String(col.prop)}`
