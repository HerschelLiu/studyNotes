<template>
  <div>
    <el-form :model="bpmnFormData" label-width="80px" :rules="rules" size="small">
      <el-form-item :label="bpmnFormData.$type === 'bpmn:Process'? '流程标识': '节点ID'" prop="id">
        <el-input v-model="bpmnFormData.id" @change="updateElementTask('id')" />
      </el-form-item>
      <el-form-item :label="bpmnFormData.$type === 'bpmn:Process'? '流程名称': '节点名称'" prop="name">
        <el-input v-model="bpmnFormData.name" @change="updateElementTask('name')" />
      </el-form-item>

      <!--流程的基础属性-->
      <template v-if="bpmnFormData.$type === 'bpmn:Process'">
        <el-form-item label="流程分类" prop="processCategory">
          <el-select v-model="bpmnFormData.processCategory" placeholder="请选择流程分类" @change="updateElementTask('processCategory')">
            <el-option
              v-for="dict in sys_process_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item v-if="bpmnFormData.$type === 'bpmn:SubProcess'" label="状态">
        <el-switch v-model="bpmnFormData.isExpanded" active-text="展开" inactive-text="折叠" @change="updateElementTask('isExpanded')" />
      </el-form-item>
      <el-form-item label="节点描述">
        <el-input
          :rows="2"
          type="textarea"
          v-model="bpmnFormData.documentationValue"
          @change="updateDocumentation" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'CommonPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const emit = defineEmits(['save'])

  const { proxy } = getCurrentInstance() as any
  const { sys_process_category } = useDict('sys_process_category')

  const rules = reactive<Record<string, any[]>>({
    id: [
      { required: true, message: '节点Id 不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '节点名称不能为空', trigger: 'blur' },
    ],
  })
  const bpmnFormData = ref<any>({})

  const resetTaskForm = () => {
    bpmnFormData.value = Object.assign({}, proxy.modelerStore.element.businessObject)
    bpmnFormData.value.documentationValue = proxy.modelerStore.element.businessObject.documentation?.[0]?.text || ''
  }

  const updateElementTask = (key: string) => {
    const taskAttr = Object.create(null)
    taskAttr[key] = bpmnFormData.value[key] || null
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, taskAttr)
  }

  const updateDocumentation = () => {
    const modeler = proxy.modelerStore.modeler
    const moddle = modeler.get('moddle')
    const modeling = modeler.get('modeling')

    const documentation = moddle.create('bpmn:Documentation', {
      text: bpmnFormData.value.documentationValue
    })

    let extensionElements = proxy.modelerStore.element.businessObject.extensionElements

    if (!extensionElements) {
      extensionElements = moddle.create('bpmn:ExtensionElements', {
        values: []
      })
    }

    modeling.updateProperties(proxy.modelerStore.element, {
      documentation: [documentation],
      extensionElements: extensionElements
    })

    proxy.modelerStore.modeler.get('commandStack').execute('element.updateProperties', {
      element: proxy.modelerStore.element,
      properties: {
        documentation: [documentation]
      }
    })

    emit('save')
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
