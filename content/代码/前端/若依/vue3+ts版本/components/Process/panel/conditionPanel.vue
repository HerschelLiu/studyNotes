<template>
  <div>
    <el-form label-width="100px" size="small" @submit.prevent>
      <el-form-item>
        <template #label>
          <span>
            流转类型
            <el-tooltip placement="top">
              <template #content>
                <div>
                  普通流转路径：流程执行过程中，一个元素被访问后，会沿着其所有出口顺序流继续执行。
                  <br />默认流转路径：只有当没有其他顺序流可以选择时，才会选择默认顺序流作为活动的出口顺序流。流程会忽略默认顺序流上的条件。
                  <br />条件流转路径：是计算其每个出口顺序流上的条件。当条件计算为true时，选择该出口顺序流。如果该方法选择了多条顺序流，则会生成多个执行，流程会以并行方式继续。
                </div>
              </template>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <el-select v-model="bpmnFormData.type" @change="updateFlowType">
          <el-option label="普通流转路径" value="normal" />
          <el-option label="默认流转路径" value="default" />
          <el-option label="条件流转路径" value="condition" />
        </el-select>
      </el-form-item>
      <el-form-item label="条件格式" v-if="bpmnFormData.type === 'condition'" key="condition">
        <el-select v-model="bpmnFormData.conditionType">
          <el-option label="表达式" value="expression" />
          <el-option label="脚本" value="script" />
        </el-select>
      </el-form-item>
      <el-form-item label="表达式" v-if="bpmnFormData.conditionType && bpmnFormData.conditionType === 'expression'" key="express">
        <el-input v-model="bpmnFormData.body" clearable @change="updateFlowCondition" />
      </el-form-item>
      <template v-if="bpmnFormData.conditionType && bpmnFormData.conditionType === 'script'">
        <el-form-item label="脚本语言" key="language">
          <el-input v-model="bpmnFormData.language" clearable @change="updateFlowCondition" />
        </el-form-item>
        <el-form-item label="脚本类型" key="scriptType">
          <el-select v-model="bpmnFormData.scriptType">
            <el-option label="内联脚本" value="inlineScript" />
            <el-option label="外部脚本" value="externalScript" />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本" v-if="bpmnFormData.scriptType === 'inlineScript'" key="body">
          <el-input v-model="bpmnFormData.body" type="textarea" clearable @change="updateFlowCondition" />
        </el-form-item>
        <el-form-item label="资源地址" v-if="bpmnFormData.scriptType === 'externalScript'" key="resource">
          <el-input v-model="bpmnFormData.resource" clearable @change="updateFlowCondition" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'
  import { QuestionFilled } from '@element-plus/icons-vue'

  defineOptions({ name: 'BpmnModel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const bpmnElementSource = ref<any>({})
  const bpmnElementSourceRef = ref<any>({})
  const bpmnFormData = ref<any>({})

  const resetFlowCondition = () => {
    bpmnFormData.value = {
      body: null
    }
    bpmnElementSource.value = proxy.modelerStore.element.source
    bpmnElementSourceRef.value = proxy.modelerStore.element.businessObject.sourceRef
    if (bpmnElementSourceRef.value && bpmnElementSourceRef.value.default && bpmnElementSourceRef.value.default.id === proxy.modelerStore.element.id) {
      bpmnFormData.value.type = 'default'
    } else if (!proxy.modelerStore.element.businessObject.conditionExpression) {
      bpmnFormData.value.type = 'normal'
    } else {
      const conditionExpression = proxy.modelerStore.element.businessObject.conditionExpression
      bpmnFormData.value = { ...conditionExpression, type: 'condition' }
      if (bpmnFormData.value.resource) {
        bpmnFormData.value.conditionType = 'script'
        bpmnFormData.value.scriptType = 'externalScript'
        return
      }
      if (conditionExpression.language) {
        bpmnFormData.value.conditionType = 'script'
        bpmnFormData.value.scriptType = 'inlineScript'
        return
      }
      bpmnFormData.value.conditionType = 'expression'
    }
  }

  const updateFlowType = (flowType: string) => {
    if (flowType === 'condition') {
      const flowConditionRef = proxy.modelerStore.moddle.create('bpmn:FormalExpression')
      proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
        conditionExpression: flowConditionRef
      })
      return
    }
    if (flowType === 'default') {
      proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
        conditionExpression: null
      })
      proxy.modelerStore.modeling.updateProperties(bpmnElementSource.value, {
        default: proxy.modelerStore.element
      })
      bpmnFormData.value.conditionType = null
      return
    }
    bpmnFormData.value.conditionType = null
    if (bpmnElementSourceRef.value.default && bpmnElementSourceRef.value.default.id === proxy.modelerStore.element.id) {
      proxy.modelerStore.modeling.updateProperties(bpmnElementSource.value, {
        default: null
      })
    }
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
      conditionExpression: null
    })
  }

  const updateFlowCondition = () => {
    const { conditionType, scriptType, body, resource, language } = bpmnFormData.value
    let condition
    if (conditionType === 'expression') {
      condition = proxy.modelerStore.moddle.create('bpmn:FormalExpression', { body })
    } else {
      if (scriptType === 'inlineScript') {
        condition = proxy.modelerStore.moddle.create('bpmn:FormalExpression', { body, language })
        bpmnFormData.value.resource = ''
      } else {
        bpmnFormData.value.body = ''
        condition = proxy.modelerStore.moddle.create('bpmn:FormalExpression', { resource, language })
      }
    }
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, { conditionExpression: condition })
  }

  /** 传值监听 */
  watch(
    () => props.id,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        resetFlowCondition()
      }
    },
    { immediate: true }
  )
</script>
