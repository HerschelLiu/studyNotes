```ts
import type { PropType } from 'vue'
import { nextTick, reactive, toRefs, watch } from 'vue'

import { useClone } from '@/hooks/useObject'

/** props定义 */
export const defineSearchProps = <T>() => {
  return {
    /** 请求参数 */
    modelValue: {
      type: Object as PropType<T>,
      required: true
    },
    /** 是否搜索中 */
    loading: {
      type: Boolean,
      default: false
    },
    /** 跨页选择 */
    selected: {
      type: Array,
      default: () => []
    }
  }
}

/** 定义emits */
export const defineSearchEmits = () => {
  return ['update:modelValue', 'search', 'reset', 'update:selected']
}

/** 参数类型 */
type DefineProps<T> = ListBaseQuery & T

/**
 * 搜索，用于页面搜索框区域功能
 * notReset 重置时，不还原的key
 */
export function useSearch<T>(props: any, context: { emit: (event: any, ...args: any[]) => void }, notReset: string[] = []) {
  /** 复制一个初始值 */
  const stateModelValue = useClone(props.modelValue as DefineProps<T>)

  /** model */
  const query = reactive<DefineProps<T>>({
    ...props.modelValue
  })

  watch(
    () => props.modelValue,
    () => {
      for (const key in props.modelValue) {
        Reflect.set(query, key, props.modelValue[key])
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  /** 更新数据 */
  const emitModalValue = () => {
    context.emit('update:modelValue', query)
  }

  /** 搜索 */
  const handleSearch = () => {
    try {
      typeof query.pageIndex === 'number' && (query.pageIndex = 1)
      emitModalValue()
      context.emit('update:selected', [])
      nextTick(() => {
        context.emit('search')
      })
    } catch (error) {
      // nothing
    }
  }

  /** 重置 */
  const handleReset = () => {
    for (const key in stateModelValue) {
      if (!notReset.includes(key)) {
        ;(query as any)[key] = (stateModelValue as any)[key]
      }
    }
    emitModalValue()
    context.emit('update:selected', [])
    nextTick(() => {
      context.emit('search')
    })
  }

  return {
    /** 搜索 */
    handleSearch,
    /** 重置 */
    handleReset,
    /** model */
    query,
    ...toRefs(query)
  }
}

```

> ```vue
> <template>
>   <comp-fixed-header :model="query" @search="handleSearch">
>     <template #left>
>       <el-form-item>
>         <el-input v-model.trim="query.typeName" placeholder="分类名称" size="default" clearable class="width-240" />
>       </el-form-item>
>       <el-form-item>
>         <el-button v-busy.Search="loading" plain size="default" native-type="submit">查询</el-button>
>         <el-button plain size="default" @click="handleReset">重置</el-button>
>       </el-form-item>
>     </template>
>     <template #right>
>       <el-button v-permission="'create'" type="primary" size="default" :icon="useIcon('Plus')" @click="handleCreate">新建分类</el-button>
>     </template>
>   </comp-fixed-header>
> </template>
> 
> <script lang="ts" setup>
> import { defineCheckAllEmits } from '@/hooks/useCheckAll'
> import { useIcon } from '@/hooks/useIcon'
> import { defineSearchEmits, defineSearchProps, useSearch } from '@/hooks/useSearch'
> 
> import type { RequestList } from '../index.vue'
> 
> const props = defineProps({
>   /** 定义搜索的基础参数 */
>   ...defineSearchProps<RequestList>()
> })
> 
> const emit = defineEmits([
>   /** 定义搜索的基础emits */
>   ...defineSearchEmits(),
>   /** 定义跨页选择基础emits */
>   ...defineCheckAllEmits(),
>   'create'
> ])
> 
> /** 搜索基础数据 */
> const { query, handleSearch, handleReset } = useSearch<RequestList>(props, { emit })
> 
> /** 新增 */
> const handleCreate = () => {
>   emit('create')
> }
> </script>
> 
> ```
>
> 