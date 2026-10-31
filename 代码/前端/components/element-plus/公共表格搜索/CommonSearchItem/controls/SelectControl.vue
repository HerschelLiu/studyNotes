<template>
  <el-select
    v-bind="controlProps"
    v-model="model">
    <!-- 转发消费方通过 #select-<prop>-<slot> 传入的插槽（除 default 外，如 #header / #empty / #label） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        v-if="name !== 'default'"
        :name="name"
        v-bind="slotProps" />
    </template>
    <!-- default：消费方提供了 #select-<prop>-default 时覆盖，否则渲染内置选项 -->
    <template v-if="$slots.default" #default="slotProps">
      <slot
        name="default"
        v-bind="slotProps" />
    </template>
    <template v-else #default>
      <el-option
        v-for="option in options"
        :key="option[optionKey]"
        :label="labelOf(option)"
        :value="option[optionKey]" />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  defineOptions({ name: 'CommonSearchSelect' })

  const props = withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
    options: () => [],
    optionKey: 'key',
    optionLabel: 'label',
  })

  const model = defineModel<any>()

  /** 选项显示文本：字段名或自定义函数（el-option 的 label 只接收字符串） */
  const labelOf = (option: Record<string, any>) =>
    typeof props.optionLabel === 'function' ? props.optionLabel(option) : option[props.optionLabel ?? 'label']
</script>
