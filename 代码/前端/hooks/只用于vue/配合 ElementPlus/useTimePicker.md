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

`date-picker`

```vue
<template>
  <el-date-picker
    v-if="isArea"
    v-model="value"
    :shortcuts="showOptions ? defineDatePickerShortcuts(isFuture) : []"
    :type="type || 'datetimerange'"
    :start-placeholder="`${label}开始日期`"
    range-separator="-"
    :end-placeholder="`${label}结束日期`"
    :disabled="disabled"
  >
    <template v-if="slots.rangeSeparator" #range-separator>
      <slot name="range-separator" />
    </template>
  </el-date-picker>

  <el-date-picker
    v-else
    v-model="value"
    :shortcuts="showOptions ? defineDatePickerShortcut(isFuture) : []"
    :type="type || 'datetime'"
    :placeholder="label || '选择日期'"
    :disabled="disabled"
  >
    <template v-if="slots.rangeSeparator" #range-separator>
      <slot name="range-separator" />
    </template>
  </el-date-picker>
</template>

<script lang="ts">
export default {
  name: 'DatePicker'
}
</script>

<script lang="ts" setup>
import type { IDatePickerType } from 'element-plus/es/components/date-picker/src/date-picker.type'
import type { PropType } from 'vue'
import { computed, onBeforeMount, ref, useSlots, watch } from 'vue'

import { useDateFormat } from '@/hooks/useDate'
import { defineDatePickerShortcut, defineDatePickerShortcuts } from '@/hooks/useDatePicker'
import { defineModelValueProps } from '@/hooks/useModelValue'
import { isArray } from '@/hooks/useValidate'

type Element = Key | Date

const props = defineProps({
  /** 定义model值参数 */
  ...defineModelValueProps<Element | Element[]>([String, Array, Number]),
  /** 是否选择将来的时间 */
  isFuture: {
    type: Boolean,
    default: false
  },
  /** 显示类型 */
  type: {
    type: String as PropType<IDatePickerType>,
    default: ''
  },
  /** 日期格式 */
  format: {
    type: String,
    default: 'Y-M-D h:m:s'
  },
  /** 返回数据指定为时间戳 */
  isTimeStamp: {
    type: Boolean,
    default: true
  },
  /** 是否显示快捷选项 */
  showOptions: {
    type: Boolean,
    default: true
  },
  /** 项目名称 */
  label: {
    type: String,
    default: ''
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

/** value */
const value = ref<Key | Date | (Key | Date)[] | undefined>()

onBeforeMount(() => {
  if (isArray(props.modelValue)) value.value = props.modelValue.map(item => _getDate(item))
  else value.value = _getDate(props.modelValue)
})

const _getDate = (val: Element) => {
  if (typeof val === 'string') return val
  else if (val === null) return ''
  else return new Date(val)
}

const isArea = computed(() => {
  return isArray(props.modelValue)
})

watch(
  () => props.modelValue,
  () => {
    if (isArray(props.modelValue)) value.value = props.modelValue.map(item => _getDate(item))
    else value.value = _getDate(props.modelValue)
  }
)

const getTimeStamp = (val: Element) => {
  if (val === null || val === '') return ''
  else return +new Date(val)
}

watch(
  () => value.value,
  () => {
    if (isArray(value.value)) {
      emit(
        'update:modelValue',
        value.value.map(item => (item ? (props.isTimeStamp ? getTimeStamp(item) : useDateFormat(item, props.format)) : ''))
      )
    } else emit('update:modelValue', value.value ? (props.isTimeStamp ? getTimeStamp(value.value) : useDateFormat(value.value, props.format)) : '')
  }
)
</script>

```

