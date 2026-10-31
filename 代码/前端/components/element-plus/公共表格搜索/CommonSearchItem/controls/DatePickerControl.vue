<template>
  <el-date-picker
    v-bind="pickerProps"
    v-model="pickerModel">
    <!-- 转发消费方通过 #date-<prop>-<slot> 传入的插槽（如 #default / #range-separator） -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps">
      <slot
        :name="name"
        v-bind="slotProps" />
    </template>
  </el-date-picker>
</template>

<script lang="ts" setup>
  import type { ControlProps } from './types'

  import { SEARCH_QUERY } from './context'

  defineOptions({ name: 'CommonSearchDatePicker' })

  const props = withDefaults(defineProps<ControlProps>(), {
    controlProps: () => ({}),
  })

  const model = defineModel<any>()

  /** 查询对象由 CommonSearchItem 注入（daterange 拆两字段时读写） */
  const query = inject(SEARCH_QUERY)

  /** daterange 且配置了 start/end 时，改用 query 上的两个字段组合/拆分 */
  const range = computed(() => {
    const { type, start, end } = props.controlProps ?? {}
    if (type !== 'daterange' || !start || !end || !query) return null
    return { query: query.value, start: String(start), end: String(end) }
  })

  /** 透传给 el-date-picker 的属性，剔除内部使用的 start / end */
  const pickerProps = computed(() => {
    const { start: _start, end: _end, ...rest } = props.controlProps ?? {}
    return rest
  })

  /**
   * 日期值：配置 start/end 时把两个字段组合成 [start, end]，选择后反向拆回两个字段；
   * 未配置时沿用默认 v-model
   */
  const pickerModel = computed<any>({
    get: () => {
      if (!range.value) return model.value
      const { query, start, end } = range.value
      const startValue = query[start]
      const endValue = query[end]
      // 两个字段都为空时返回 null，交给 el-date-picker 明确清空（返回 [undefined, undefined] 会被当成有值）
      return startValue || endValue ? [startValue, endValue] : null
    },
    set: (value: unknown) => {
      if (!range.value) {
        model.value = value
        return
      }
      const { query, start, end } = range.value
      const [startValue, endValue] = Array.isArray(value) ? value : []
      query[start] = startValue ?? undefined
      query[end] = endValue ?? undefined
    },
  })
</script>
