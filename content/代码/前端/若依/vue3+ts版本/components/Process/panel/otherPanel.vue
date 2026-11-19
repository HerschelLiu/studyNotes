<template>
  <div>
    <el-form label-width="80px" size="small" @submit.prevent>
      <el-form-item label="跳过表达式">
        <el-input v-model="bpmnFormData.skipExpression" @change="updateElementTask('skipExpression')" />
      </el-form-item>
      <el-form-item label="是否为补偿">
        <el-input v-model="bpmnFormData.isForCompensation" @change="updateElementTask('isForCompensation')" />
      </el-form-item>
      <el-form-item label="服务任务可触发">
        <el-input v-model="bpmnFormData.triggerable" @change="updateElementTask('triggerable')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'OtherPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const bpmnFormData = ref<any>({})

  const resetTaskForm = () => {
    bpmnFormData.value = JSON.parse(JSON.stringify(proxy.modelerStore.element.businessObject))
  }

  const updateElementTask = (key: string) => {
    const taskAttr = Object.create(null)
    taskAttr[key] = bpmnFormData.value[key] || null
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, taskAttr)
  }

  /** 传值监听 */
  watch(
    () => props.id,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        resetTaskForm()
      }
    },
    { immediate: true }
  )
</script>
