import type { Component } from 'vue'

import { defineComponent, h } from 'vue'

import CompBaseTable from '../index.vue'

export const createBoundCompBaseTable = (tableKey: string) =>
  defineComponent({
    name: 'CompBaseTableBound',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(CompBaseTable as Component, { ...attrs, tableKey }, slots)
    }
  })
