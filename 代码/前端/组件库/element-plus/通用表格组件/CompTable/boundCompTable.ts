import type { Component } from 'vue'

import { defineComponent, h } from 'vue'

import CompTable from './index.vue'

export const createBoundCompTable = (tableKey: string) =>
  defineComponent({
    name: 'CompTableBound',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(CompTable as Component, { ...attrs, tableKey }, slots)
    }
  })
