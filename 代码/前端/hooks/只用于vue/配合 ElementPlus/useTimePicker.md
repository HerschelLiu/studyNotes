```ts
import type { Ref } from 'vue'
import { computed } from 'vue'

import { isArray } from '@/hooks/useValidate'

/** 时间区间-search */
export function useTimePicker(startTime: Ref<Key>, endTime: Ref<Key>) {
  const rangeTime = computed({
    get() {
      return [startTime.value, endTime.value]
    },
    set(value: Key[]) {
      if (!isArray(value) || value.length !== 2) {
        startTime.value = ''
        endTime.value = ''
      } else {
        startTime.value = value[0]
        endTime.value = value[1]
      }
    }
  })

  return {
    rangeTime
  }
}

/** 时间区间-form */
export function useTimePickerByForm(form: Record<string, any>, startKey: string, endKey: string) {
  const rangeTime = computed({
    get() {
      return [form[startKey], form[endKey]]
    },
    set(value: Key[]) {
      if (!isArray(value) || value.length !== 2) {
        form[startKey] = ''
        form[endKey] = ''
      } else {
        form[startKey] = value[0]
        form[endKey] = value[1]
      }
    }
  })

  return {
    rangeTime
  }
}

```

> ```vue
> <template>
>   <comp-fixed-header :model="query" @search="handleSearch">
>     <template #left>
>       <el-form-item>
>         <el-input v-model="query.title" clearable placeholder="活动名称" class="width-240" />
>       </el-form-item>
> 
>       <el-form-item>
>         <el-select v-model="query.status" clearable placeholder="选择活动状态" class="width-240" @change="handleSearch">
>           <el-option v-for="item in EventStatusList" :key="item.key" :value="item.key" :label="item.value" />
>         </el-select>
>       </el-form-item>
> 
>       <el-form-item>
>         <comp-date-picker v-model="rangeTime" label="活动" size="default" @change="handleSearch" />
>       </el-form-item>
> 
>       <el-form-item>
>         <el-button v-busy.Search="loading" plain size="default" native-type="submit">查询</el-button>
>         <el-button plain size="default" @click="handleReset">重置</el-button>
>       </el-form-item>
>     </template>
>     <template #right>
>       <el-button v-permission="'export'" size="default" :icon="useIcon('Download')" @click="emit('export')">导出</el-button>
>       <el-button v-permission="'create'" type="primary" size="default" :icon="useIcon('Plus')" @click="$emit('create')">新建活动</el-button>
>     </template>
>   </comp-fixed-header>
> </template>
> 
> <script lang="ts" setup>
> import { EventStatus } from '@/enum/choose'
> import { useEnumArray } from '@/hooks/useEnum'
> import { useIcon } from '@/hooks/useIcon'
> import { defineSearchEmits, defineSearchProps, useSearch } from '@/hooks/useSearch'
> import { useTimePicker } from '@/hooks/useTimePicker'
> 
> import type { RequestList } from '../index.vue'
> 
> const props = defineProps({
>   /** 定义搜索的基础参数 */
>   ...defineSearchProps<RequestList>()
> })
> const emit = defineEmits([
>   /** 定义搜索的基础emits */
>   ...defineSearchEmits(),
>   'create',
>   'export'
> ])
> 
> /** 搜索基础数据 */
> const { query, startTime, endTime, handleReset, handleSearch } = useSearch<Required<RequestList>>(props, { emit })
> 
> /** 定义日期选择器 */
> const { rangeTime } = useTimePicker(startTime, endTime)
> 
> const EventStatusList = useEnumArray(EventStatus)
> </script>
> 
> ```
>
> ```vue
> <template>
>  <!-- 表单主体 start -->
>     <el-form
>       ref="ELForm"
>       size="large"
>       :model="form"
>       :validate-on-rule-change="false"
>       label-width="11em"
>     >
>       <el-form-item v-if="form.mode === 1" label="生效日期：" prop="startTime">
>         <comp-date-picker v-model="rangeDate" is-future />
>       </el-form-item>
>     </el-form>
>     <!-- 表单主体 end -->
> </template>
> 
> <script lang="ts" setup>
> /** form的Ref */
> const { ELForm } = useRefs()
> 
> /** 静态数据 */
> const assetsData = {
>   startTime: '',
>   endTime: '',
> }
> 
> /** 表单 */
> const form = reactive<TypeTemplateList>(useClone(assetsData))
> 
> /** 定义日期选择器 */
> const { rangeDate } = useDatePickerByForm(form, 'startTime', 'endTime')
> </script>
> 
> ```
>
> 