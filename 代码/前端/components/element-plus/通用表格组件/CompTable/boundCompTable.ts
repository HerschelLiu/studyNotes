import type { Component } from 'vue'

import { defineComponent, h } from 'vue'

import CompTable from './index.vue'

/**
 * 生成绑定好 `tableKey` 的 CompTable 组件：
 * - `useCompTable(columns, 'b')` 返回的 `CompTable` 已写死 `tableKey: 'b'`
 * - 模板里无需再写 `table-key`，从根本上避免 key 拼错
 *
 * 不声明 props，所有 props / v-model / 事件经 attrs 透传，插槽原样转发
 */
export const createBoundCompTable = (tableKey: string) =>
  defineComponent({
    name: 'CompTableBound',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(CompTable as Component, { ...attrs, tableKey }, slots)
    }
  })
