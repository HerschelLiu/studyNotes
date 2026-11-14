<!-- components/CommonTable/index.vue -->
<template>
  <div>
    <div>
      <slot name="tableTop" />
    </div>
    <el-table
      :data="displayData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange">
      <!-- 复选框列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        fixed />

      <!-- 动态列 -->
      <el-table-column
        v-for="col in visibleColumns"
        :key="col.key"
        :prop="col.key"
        :label="col.title"
        :width="col.width"
        :fixed="col.fixed"
        :align="col.align || 'left'">
        <template #default="{ row }">
          <div v-if="col.type === 'operation'">
            <el-button
              v-for="button in col.buttons"
              :key="button.label"
              :type="button.type"
              :icon="button.icon"
              @click="button.click(row)">
              {{ button.label }}
            </el-button>
          </div>
          <template v-else>
            {{ col.formatter ? col.formatter(row) : row[col.key] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumn } from './types'

  import { computed } from 'vue'

  interface Props {
    /** 表格数据源，优先使用 */
    data?: any[]
    /** 备用数据源，data 未传时使用 */
    tableData?: any[]
    /** 列配置，必传 */
    columns: TableColumn[]
    /** 是否显示多选列，默认 false */
    selectable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    data: undefined,
    tableData: () => [],
    selectable: false,
  })

  const emit = defineEmits<{
    (e: 'selectionChange', selection: any[]): void
  }>()

  /** 数据源：优先 data，其次 tableData */
  const displayData = computed(() => props.data ?? props.tableData ?? [])

  /** 可见列：过滤 hidden === true */
  const visibleColumns = computed(() => props.columns?.filter(c => c.hidden !== true) ?? [])

  const handleSelectionChange = (selection: any[]) => {
    emit('selectionChange', selection)
  }
</script>
