<template>
  <el-input
    v-bind="controlProps"
    v-model="model" />
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchInput' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>
