<!-- components/ConfigurableDataTable.vue -->
<template>
  <div>
    <div>
      <slot name="tableTop" />
    </div>
    <el-table
      :data="displayData"
      :columns="visibleColumns"
      :selectable="selectable"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      border
    >
      <!-- 复选框列 -->
      <el-table-column v-if="selectable" type="selection" width="55" fixed />

      <!-- 动态列 -->
      <el-table-column
        v-for="col in visibleColumns"
        :key="col.key"
        :prop="col.key"
        :label="col.title"
        :width="col.width"
        :fixed="col.fixed"
        :align="col.align || 'left'"
      >
        <div v-if="col.type === 'operation'">
          <el-button
            v-for="button in col.buttons"
            :key="button.label"
            :type="button.type"
            :icon="button.icon"
            @click="() => button.click(row)"
          >
            {{ button.label }}
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import type { TableColumn } from "./types";

const props = defineProps<{
  data?: any[];
  tableData?: any[];
  columns: TableColumn[];
  selectable?: boolean;
}>();

const displayData = computed(() => props.data ?? props.tableData ?? []);
const visibleColumns = computed(
  () => props.columns?.filter((c) => c.hidden !== true) ?? [],
);
const emit = defineEmits<{
  (e: "selectionChange", selection: any[]): void;
}>();
const handleSelectionChange = (selection: any[]) => {
  emit("selectionChange", selection);
};
</script>
