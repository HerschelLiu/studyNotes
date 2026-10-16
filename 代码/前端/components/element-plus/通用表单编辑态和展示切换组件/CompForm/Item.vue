<script setup lang="ts">
  import type { Ref, VNode } from 'vue'

  import { useFormatValue } from '@/hooks/useFormatValue'

  defineOptions({ inheritAttrs: false })

  const edit = inject<Ref<boolean>>('compFormEdit', ref(true))
  const slots = useSlots()

  const displayValue = computed(() => {
    const vnode = slots.default?.()[0] as VNode | undefined
    return vnode?.props?.modelValue
  })
</script>

<template>
  <el-form-item v-bind="$attrs">
    <slot v-if="edit" />
    <template v-else>
      <slot
        name="view"
        :value="displayValue">
        {{ useFormatValue(displayValue) }}
      </slot>
    </template>
  </el-form-item>
</template>
