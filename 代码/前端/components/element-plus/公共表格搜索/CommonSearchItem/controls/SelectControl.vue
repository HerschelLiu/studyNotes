<template>
  <el-select
    v-bind="controlProps"
    v-model="model"
    @change="changeFn">
    <el-option
      v-for="option in options"
      :key="option[optionKey]"
      :label="option[optionLabel]"
      :value="option[optionKey]" />
  </el-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchSelect' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
    options: () => [],
    optionKey: 'key',
    optionLabel: 'label',
  })

  const model = defineModel<any>()
</script>
