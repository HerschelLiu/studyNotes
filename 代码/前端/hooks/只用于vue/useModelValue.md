## VUE

> vue3.3开始新增**实验特性**不需要此代码，因新增defineModel<T>(‘modelValue’, { default: any, request: boolean })(如果第一个参数是字符串，它将用作 prop 名称;否则，道具名称将默认为“modelValue”。在这两种情况下，您还可以传递一个额外的对象，该对象将用作道具的选项。)和useModel，将自动注册 props 和事件 ，并返回一个 ref：
>
> 子组件（Comp）
>
> ```vue
> <script setup>
> const modelValue = defineModel()
> 
> console.log(modelValue.value)
> </script>
> 
> <template>
>   <input v-model="modelValue">
> </template>
> ```
>
> 父组件
>
> ```vue
> <script setup>
> import { ref } from 'vue'
> import Comp from './Comp.vue'
> 
> const msg = ref('')
> </script>
> <template>
>   <Comp v-model="msg">
> </template>
> ```
>
> 
>
> 此功能是实验性的，需要明确的选择加入。[RFC#503](https://github.com/vuejs/rfcs/discussions/503)
>
> ```ts
> // vite.config
> {
>   ...
>   plugins: [
>     vue({
>       ...
>       script: {
>         defineModel: true
>       }
>       ...
>     })
>   ]
>   ...
> }
>   
> // vue-cli vue-loader@^17.1.1
>  module.exports = {
>     chainWebpack: (config) => {
>       config.module
>         .rule('vue')
>         .use('vue-loader')
>         .tap((options) => {
>           return {
>             ...options,
>             defineModel: true
>           }
>         })
>     }
> }
> ```
>
> 

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

