<template>
  <div>
    <v-form-designer
      ref="vfDesigner"
      :designer-config="designerConfig">
      <!-- 保存按钮 -->
      <template #customSaveButton>
        <el-button
          link
          type="primary"
          icon="Promotion"
          @click="saveFormJson">
          保存
        </el-button>
      </template>
    </v-form-designer>

    <!--系统表单信息-->
    <el-dialog
      :title="formTitle"
      v-model="formOpen"
      width="500px"
      append-to-body>
      <el-form
        ref="ELForm"
        :model="formData"
        :rules="rules"
        label-width="80px">
        <el-form-item
          label="表单名称"
          prop="formName">
          <el-input
            v-model="formData.formName"
            placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm">
            确 定
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, getCurrentInstance, onMounted, nextTick } from 'vue'
  import { addForm, getForm, updateForm } from '@/api/flowable/form'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'flowForm' })

  const { proxy } = getCurrentInstance() as any
  const route = useRoute()

  const formTitle = ref('')
  const formOpen = ref(false)
  // 表单校验
  const rules = reactive<Record<string, any[]>>({
    formName: [
      { required: true, message: '表单名称不能为空', trigger: 'blur' }
    ]
  })
  // 表单参数
  const formData = ref<any>({
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  })
  const designerConfig = reactive<any>({
    generateSFCButton: false,
    formHeader: false,
    externalLink: false,
    languageMenu: false,
    exportCodeButton: false,
    exportJsonButton: false,
    importJsonButton: false,
    toolbarMaxWidth: 300,
    toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）
  })

  onMounted(() => {
    const formId = route.query && route.query.formId
    if (StrUtil.isNotBlank(formId)) {
      getForm(formId).then((res: any) => {
        nextTick(() => {
          // 加载表单json数据
          proxy.$refs['vfDesigner'].setFormJson(JSON.parse(res.data.formContent))
        })
        formData.value = res.data
      })
    } else {
      nextTick(() => {
        // 加载表单json数据
        proxy.$refs['vfDesigner'].setFormJson({"widgetList":[],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","onFormCreated":"","onFormMounted":"","onFormDataChange":"","onFormValidate":""}})
      })
    }
  })

  // 保存表单数据
  const saveFormJson = () => {
    const formJson = proxy.$refs['vfDesigner'].getFormJson()
    formData.value.formContent = JSON.stringify(formJson)
    formOpen.value = true
  }
  /** 提交按钮 */
  const submitForm = () => {
    proxy.$refs['ELForm'].validate((valid: boolean) => {
      if (valid) {
        if (formData.value.formId != null) {
          updateForm(formData.value).then(() => {
            proxy.$modal.msgSuccess('修改成功')
            formOpen.value = false
          })
        } else {
          addForm(formData.value).then(() => {
            proxy.$modal.msgSuccess('新增成功')
            formOpen.value = false
          })
        }
        // 关闭当前标签页并返回上个页面
        const obj = { path: '/flowable/form', query: { t: Date.now() } }
        proxy.$tab.closeOpenPage(obj)
      }
    })
  }
  // 表单重置
  const reset = () => {
    formData.value = {
      formId: null,
      formName: null,
      formContent: null,
      remark: null
    }
    proxy.resetForm('ELForm')
  }
  // 取消按钮
  const cancel = () => {
    formOpen.value = false
    reset()
  }
</script>

<style lang="scss" scoped>
  body {
    margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
  }
  .el-container.main-container{
    background: #fff;
    margin-left: 0 !important;
  }
</style>
