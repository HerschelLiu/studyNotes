<template>
  <el-input
    v-bind="controlProps"
    v-model.trim="model">
    <!-- 转发消费方通过 #input-<prop>-<slot> 传入的插槽（如 #prefix / #suffix / #append） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-input>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchInput' })

  withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()
</script>
