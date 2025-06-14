```vue
<template>
  <up-input
    ref="InputRef"
    v-model="value"
    :type="type"
    border="none"
    :placeholder="placeholder"
    :placeholder-style="placeholderStyle"
    :placeholder-class="placeholderClass"
    :custom-style="customStyle"
    :input-align="inputAlign"
    :font-size="fontSize"
    :color="color"
    :maxlength="maxlength"
    :readonly="readonly"
    :disabled="disabled"
    class="block w-full"
  >
    <template #suffix>
      <slot name="suffix" />
    </template>
  </up-input>
</template>

<script lang="ts" setup>
interface Props {
  type?: 'number' | 'text' | 'idcard' | 'digit' | 'password' | 'nickname'
  placeholder?: string
  placeholderStyle?: string
  placeholderClass?: string
  customStyle?: string
  inputAlign?: 'left' | 'center' | 'right'
  format?: boolean
  formatType?: 'money' | 'number' | 'digit'
  /** 小数点位数，formatType为digit时有效 */
  digitNum?: number
  fontSize?: string
  color?: string
  maxlength?: Key
  readonly?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '请输入',
  format: true,
  fontSize: '28rpx',
  color: '#333',
  digitNum: 2,
  maxlength: 140,
  readonly: false,
  disabled: false
})

const value = defineModel<string | number>({ required: true })

const InputRef = ref()

const handleFormatter = (val: string | number) => {
  let func: (val: string, decimalPlaces?: number) => string = useInputNumberFormat
  switch (props.formatType) {
    case 'number':
    default:
      func = useInputNumberFormat
      break
    case 'money':
      func = useInputMoneyFormat
      break
    case 'digit':
      func = useInputDigitFormat
      break
  }

  return func(val.toString(), props.digitNum)
}

watch(
  () => [props.type, InputRef.value],
  () => {
    if ((props.type === 'number' || props.type === 'digit') && props.format) {
      InputRef.value?.setFormatter(handleFormatter)
    }
  },
  {
    immediate: true
  }
)
</script>

```

