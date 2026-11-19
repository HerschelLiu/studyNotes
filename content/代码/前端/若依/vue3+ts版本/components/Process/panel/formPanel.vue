<template>
  <div>
    <el-form label-width="80px" size="small" @submit.prevent>
      <el-form-item label="流程表单">
        <el-select v-model="bpmnFormData.formKey" clearable class="m-2" placeholder="挂载节点表单" @change="updateElementFormKey">
          <el-option
            v-for="item in formList"
            :key="item.value"
            :label="item.formName"
            :value="item.formId" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, getCurrentInstance } from 'vue'
  import { listAllForm } from '@/api/flowable/form'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'FormPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const formList = ref<any[]>([])
  const bpmnFormData = reactive<{ formKey: any }>({
    formKey: ''
  })

  const resetFlowForm = () => {
    bpmnFormData.formKey = proxy.modelerStore.element.businessObject.formKey
  }

  const updateElementFormKey = (val: any) => {
    if (StrUtil.isBlank(val)) {
      delete proxy.modelerStore.element.businessObject['formKey']
    } else {
      proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, { formKey: val })
    }
  }

  const getListForm = () => {
    listAllForm().then((res: any) => {
      res.data.forEach((item: any) => {
        item.formId = item.formId.toString()
      })
      formList.value = res.data
    })
  }

  /** 传值监听 */
  watch(
    () => props.id,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        getListForm()
        resetFlowForm()
      }
    },
    { immediate: true }
  )
</script>
