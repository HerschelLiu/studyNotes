<template>
  <div class="panel-tab__content">
    <el-table
      :data="elementPropertyList"
      size="small"
      max-height="240"
      border
      fit>
      <el-table-column
        label="序号"
        width="50px"
        type="index" />
      <el-table-column
        label="属性名"
        prop="name"
        min-width="100px"
        show-overflow-tooltip />
      <el-table-column
        label="属性值"
        prop="value"
        min-width="100px"
        show-overflow-tooltip />
      <el-table-column
        label="操作"
        width="90px">
        <template #default="{ row, $index }">
          <el-button
            size="small"
            link
            type="primary"
            @click="openAttributesForm(row, $index)">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            size="small"
            link
            type="danger"
            @click="removeAttributes(row, $index)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button
        size="small"
        type="primary"
        icon="Plus"
        @click="openAttributesForm(null, -1)">
        添加属性
      </el-button>
    </div>

    <el-dialog
      v-model="propertyFormModelVisible"
      title="属性配置"
      width="600px"
      append-to-body
      destroy-on-close>
      <el-form
        :model="propertyForm"
        label-width="80px"
        size="small"
        ref="attributeFormRef"
        @submit.prevent>
        <el-form-item
          label="属性名："
          prop="name">
          <el-input
            v-model="propertyForm.name"
            clearable />
        </el-form-item>
        <el-form-item
          label="属性值："
          prop="value">
          <el-input
            v-model="propertyForm.value"
            clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          size="small"
          @click="propertyFormModelVisible = false">
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveAttribute">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, nextTick, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'PropertiesPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const elementPropertyList = ref<any[]>([])
  const otherExtensionList = ref<any[]>([])
  const propertyForm = ref<any>({})
  const editingPropertyIndex = ref(-1)
  const propertyFormModelVisible = ref(false)
  const attributeFormRef = ref<any>(null)

  let bpmnElement: any
  let bpmnElementProperties: any[] = []
  let bpmnElementPropertyList: any[] = []

  const updateElementExtensions = (properties: any) => {
    const extensions = proxy.modelerStore.moddle.create('bpmn:ExtensionElements', {
      values: otherExtensionList.value.concat([properties])
    })
    proxy.modelerStore.modeling.updateProperties(bpmnElement, {
      extensionElements: extensions
    })
  }

  const resetAttributesList = () => {
    bpmnElement = proxy.modelerStore.element
    otherExtensionList.value = []
    bpmnElementProperties =
      bpmnElement.businessObject?.extensionElements?.values?.filter((ex: any) => {
        if (ex.$type !== `flowable:Properties`) {
          otherExtensionList.value.push(ex)
        }
        return ex.$type === `flowable:Properties`
      }) ?? []

    bpmnElementPropertyList = bpmnElementProperties.reduce((pre: any[], current: any) => pre.concat(current.values), [])
    elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList ?? []))
  }

  const openAttributesForm = (attr: any, index: number) => {
    editingPropertyIndex.value = index
    propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
    propertyFormModelVisible.value = true
    nextTick(() => {
      if (attributeFormRef.value) attributeFormRef.value.clearValidate()
    })
  }

  const removeAttributes = (_attr: any, index: number) => {
    proxy.$modal.confirm('确认移除该属性吗？', '提示').then(() => {
      elementPropertyList.value.splice(index, 1)
      bpmnElementPropertyList.splice(index, 1)
      const propertiesObject = proxy.modelerStore.moddle.create(`flowable:Properties`, {
        values: bpmnElementPropertyList
      })
      updateElementExtensions(propertiesObject)
      resetAttributesList()
    }).catch(() => console.info('操作取消'))
  }

  const saveAttribute = () => {
    const { name, value } = propertyForm.value
    console.log(bpmnElementPropertyList)
    if (editingPropertyIndex.value !== -1) {
      proxy.modelerStore.modeling.updateModdleProperties(bpmnElement, bpmnElementPropertyList[editingPropertyIndex.value], {
        name,
        value
      })
    } else {
      const newPropertyObject = proxy.modelerStore.moddle.create(`flowable:Property`, { name, value })
      const propertiesObject = proxy.modelerStore.moddle.create(`flowable:Properties`, {
        values: bpmnElementPropertyList.concat([newPropertyObject])
      })
      updateElementExtensions(propertiesObject)
    }
    propertyFormModelVisible.value = false
    resetAttributesList()
  }

  watch(
    () => props.id,
    (val) => {
      if (StrUtil.isNotBlank(val)) {
        resetAttributesList()
      }
    },
    { immediate: true }
  )
</script>
