<script setup lang="ts">
  import type { Ref } from 'vue'

  import { useTempRefs } from '@/hooks/useTempRefs'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(defineProps<{
    /** 是否编辑态：true = 编辑（展示输入控件），false = 浏览（展示 #view 插槽文本） */
    edit?: boolean
  }>(), {
    edit: true,
  })

  const edit = computed(() => props.edit)
  provide<Ref<boolean>>('compFormEdit', edit)

  const { formRef } = useTempRefs('formRef')

  defineExpose({
    validate: (...args: any[]) => formRef.value?.validate(...args),
    validateField: (...args: any[]) => formRef.value?.validateField(...args),
    resetFields: (...args: any[]) => formRef.value?.resetFields(...args),
    clearValidate: (...args: any[]) => formRef.value?.clearValidate(...args),
    scrollToField: (...args: any[]) => formRef.value?.scrollToField(...args),
  })
</script>

<template>
  <el-form
    ref="formRef"
    :hide-required-asterisk="!edit"
    v-bind="$attrs">
    <slot />
  </el-form>
</template>
