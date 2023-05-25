## VUE

使用`useModelValue(props, { emit })`

```ts
import type { PropType, WritableComputedRef } from 'vue'
import { computed } from 'vue'

/** modelValue-props定义 */
export function defineModelValueProps<T>(types: any, defaultValue?: T) {
  return {
    /** model值 */
    modelValue: {
      type: types as PropType<T>,
      required: true,
      default: () => defaultValue || []
    }
  }
}

/** modelValue */
export function useModelValue<T>(props: any, context: { emit: (event: any, ...args: any[]) => void }): WritableComputedRef<T> {
  const value = computed({
    get() {
      return props.modelValue
    },
    set(value: T) {
      context.emit('update:modelValue', value)
    }
  })

  return value
}

```

