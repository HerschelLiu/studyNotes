### `CompForm`

```vue
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

```



### `CompFormItem`

```vue
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

```



### `index.ts`

```ts
import type { App, Plugin } from 'vue'

import CompForm from './CompForm.vue'
import CompFormItem from './Item.vue'

// 让 CompForm 兼具 Vue 插件能力：既能 import 局部用，又能 app.use() 全局注册
;(CompForm as Plugin & typeof CompForm).install = (app: App) => {
  app.component('CompForm', CompForm)
  app.component('CompFormItem', CompFormItem)
}

export { CompForm, CompFormItem }
export default CompForm

```

