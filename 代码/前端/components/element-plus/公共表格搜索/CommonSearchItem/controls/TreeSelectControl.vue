<template>
  <el-tree-select
    v-bind="controlProps"
    v-model="model"
    @change="changeFn">
    <!-- 把父级透传过来的插槽（如 #default / #label）原样转发给 el-tree-select -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-tree-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchTreeSelect' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>
