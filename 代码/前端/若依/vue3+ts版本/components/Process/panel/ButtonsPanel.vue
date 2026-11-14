<template>
  <div class="panel-tab__content">
    <el-divider content-position="center">按钮设置</el-divider>
    <el-table
      :data="elementButtonList"
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
    <div class="element-drawer__button_save">
      <el-button
        size="small"
        type="primary"
        icon="Plus"
        @click="openAttributesForm(null, -1)">
        添加按钮
      </el-button>
    </div>

    <el-dialog
      v-model="buttonFormModelVisible"
      title="按钮配置"
      width="600px"
      append-to-body
      destroy-on-close>
      <el-form
        :model="buttonForm"
        label-width="80px"
        size="small"
        ref="attributeFormRef"
        @submit.prevent>
        <el-form-item
          label="属性名："
          prop="label">
          <el-input
            v-model="buttonForm.label"
            clearable />
        </el-form-item>
        <el-form-item
          label="属性值："
          prop="value">
          <el-input
            v-model="buttonForm.value"
            clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          size="small"
          @click="buttonFormModelVisible = false">
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
  import { ref, watch, nextTick, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'ButtonsPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const elementButtonList = ref<any[]>([])
  const otherExtensionList = ref<any[]>([])
  const buttonForm = ref<any>({})
  const editingPropertyIndex = ref(-1)
  const buttonFormModelVisible = ref(false)
  const attributeFormRef = ref<any>(null)

  let bpmnElement: any
  let bpmnElementProperties: any[] = []
  let bpmnElementButtonList: any[] = []

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
        if (ex.$type !== `flowable:Buttons`) {
          otherExtensionList.value.push(ex)
        }
        return ex.$type === `flowable:Buttons`
      }) ?? []

    bpmnElementButtonList = bpmnElementProperties.reduce((pre: any[], current: any) => pre.concat(current.values), [])
    elementButtonList.value = JSON.parse(JSON.stringify(bpmnElementButtonList ?? []))
  }

  const openAttributesForm = (attr: any, index: number) => {
    editingPropertyIndex.value = index
    buttonForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
    buttonFormModelVisible.value = true
    nextTick(() => {
      if (attributeFormRef.value) attributeFormRef.value.clearValidate()
    })
  }

  const removeAttributes = (_attr: any, index: number) => {
    proxy.$modal.confirm('确认移除该属性吗？', '提示').then(() => {
      elementButtonList.value.splice(index, 1)
      bpmnElementButtonList.splice(index, 1)
      const propertiesObject = proxy.modelerStore.moddle.create(`flowable:Properties`, {
        values: bpmnElementButtonList
      })
      updateElementExtensions(propertiesObject)
      resetAttributesList()
    }).catch(() => console.info('操作取消'))
  }

  const saveAttribute = () => {
    const { name, value } = buttonForm.value
    console.log(bpmnElementButtonList)
    if (editingPropertyIndex.value !== -1) {
      proxy.modelerStore.modeling.updateModdleProperties(bpmnElement, bpmnElementButtonList[editingPropertyIndex.value], {
        name,
        value
      })
    } else {
      const newPropertyObject = proxy.modelerStore.moddle.create(`flowable:Button`, { name, value })
      const propertiesObject = proxy.modelerStore.moddle.create(`flowable:Buttons`, {
        values: bpmnElementButtonList.concat([newPropertyObject])
      })
      updateElementExtensions(propertiesObject)
    }
    buttonFormModelVisible.value = false
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
