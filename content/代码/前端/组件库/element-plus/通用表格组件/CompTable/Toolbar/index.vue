<template>
  <TableToolbar
    :columns="columns"
    :show-search="showSearch"
    :show-tool-bar-search="showToolBarSearch"
    :show-right-toolbar="showRightToolbar"
    @update:show-search="emit('update:showSearch', $event)"
    @query-table="emit('queryTable')">
    <slot />
  </TableToolbar>
</template>

<script setup lang="ts">
  import type { ColumnVisibilityItem } from '../ColumnVisibility'

  import TableToolbar from '@/components/TableToolbar/index.vue'

  defineOptions({ name: 'CompTableToolbar' })

  withDefaults(
    defineProps<{
      columns: ColumnVisibilityItem[]
      showSearch?: boolean
      showToolBarSearch?: boolean
      showRightToolbar?: boolean
    }>(),
    {
      showSearch: true,
      showToolBarSearch: true,
      showRightToolbar: true
    }
  )

  const emit = defineEmits<{
    'update:showSearch': [value: boolean]
    queryTable: []
  }>()
</script>
