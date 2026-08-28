<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item
        label="表单名称"
        prop="formName">
        <el-input
          v-model="queryParams.formName"
          placeholder="请输入表单名称"
          clearable
          size="default"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="Search"
          size="small"
          @click="handleQuery">
          搜索
        </el-button>
        <el-button
          icon="Refresh"
          size="small"
          @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          @click="handleAdd">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['flowable:form:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="formList"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="表单主键"
        align="center"
        prop="formId" />
      <el-table-column
        label="表单名称"
        align="center"
        prop="formName" />
      <el-table-column
        label="备注"
        align="center"
        prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="small"
            link
            icon="View"
            @click="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button
            size="small"
            link
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['flowable:form:edit']">
            修改
          </el-button>
          <el-button
            size="small"
            link
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['flowable:form:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改流程表单对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body>
      <el-form
        ref="ELForm"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item
          label="表单名称"
          prop="formName">
          <el-input
            v-model="form.formName"
            placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单内容">
          <editor
            v-model="form.formContent"
            :min-height="192" />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark">
          <el-input
            v-model="form.remark"
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

    <!--表单详情-->
    <el-dialog
      :title="formTitle"
      v-model="formRenderOpen"
      width="60%"
      append-to-body>
      <v-form-render
        :form-data="formData"
        ref="vFormRef" />
    </el-dialog>

    <!--表单设计器-->
    <el-dialog
      custom-class="dialogClass"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :fullscreen="true"
      :before-close="handleClose"
      append-to-body>
      <v-form-designer
        ref="vfDesigner"
        :designer-config="designerConfig">
        <!-- 自定义按钮插槽演示 -->
        <template #customSaveButton>
          <el-button
            type="text"
            @click="saveFormJson">
            <i class="el-icon-s-promotion" />
            保存
          </el-button>
        </template>
      </v-form-designer>
    </el-dialog>

    <!--系统表单信息-->
    <el-dialog
      :title="formTitle"
      v-model="formOpen"
      width="500px"
      append-to-body>
      <el-form
        ref="ELForm"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item
          label="表单名称"
          prop="formName">
          <el-input
            v-model="form.formName"
            placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark">
          <el-input
            v-model="form.remark"
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
  import { ref, reactive, nextTick, getCurrentInstance, onActivated } from 'vue'
  import { listForm, getForm, delForm, addForm, updateForm, exportForm } from '@/api/flowable/form'
  import Editor from '@/components/Editor/index.vue'

  defineOptions({ name: 'Form' })

  const { proxy } = getCurrentInstance() as any
  const route = useRoute()

  // 遮罩层
  const loading = ref(true)
  const dialogVisible = ref(false)
  const designerConfig = reactive({
    exportCodeButton: false,  //是否显示导出代码按钮
  })
  // 选中数组
  const ids = ref<any[]>([])
  // 非单个禁用
  const single = ref(true)
  // 非多个禁用
  const multiple = ref(true)
  // 显示搜索条件
  const showSearch = ref(true)
  // 总条数
  const total = ref(0)
  // 流程表单表格数据
  const formList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  const formRenderOpen = ref(false)
  const formTitle = ref('')
  const formOpen = ref(false)
  // 是否显示弹出层
  const open = ref(false)
  // 查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    formName: null as string | null,
    formContent: null as string | null,
  })
  // 表单参数
  const form = ref<any>({
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  })
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})
  const formData = ref<any>({})

  /** 查询流程表单列表 */
  const getList = () => {
    loading.value = true
    listForm(queryParams.value).then((response: any) => {
      formList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  }
  // 表单重置
  const reset = () => {
    form.value = {
      formId: null,
      formName: null,
      formContent: null,
      createTime: null,
      updateTime: null,
      createBy: null,
      updateBy: null,
      remark: null
    }
    proxy.resetForm('ELForm')
  }
  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1
    getList()
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    proxy.resetForm('queryForm')
    handleQuery()
  }
  // 多选框选中数据
  const handleSelectionChange = (selection: any[]) => {
    ids.value = selection.map(item => item.formId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  /** 表单配置信息 */
  const handleDetail = (row: any) => {
    formRenderOpen.value = true
    formTitle.value = '表单详情'
    nextTick(() => {
      // 回显数据
      proxy.$refs['vFormRef'].setFormJson(JSON.parse(row.formContent))
      nextTick(() => {
        // 表单禁用
        proxy.$refs['vFormRef'].disableForm()
      })
    })
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    // this.dialogVisible = true;
    proxy.$router.push({ path: '/flowable/task/flowForm/index' })
  }
  // 保存表单数据
  const saveFormJson = () => {
    const formJson = proxy.$refs['vfDesigner'].getFormJson()
    form.value.formContent = JSON.stringify(formJson)
    formOpen.value = true
  }
  // 取消按钮
  const cancel = () => {
    formOpen.value = false
    reset()
  }
  const handleClose = (done: any) => {
    proxy.$modal.confirm('确定要关闭吗？关闭未保存的修改都会丢失？').then(() => {
      done()
    }).catch(() => {})
  }
  /** 修改按钮操作 */
  const handleUpdate = (row: any) => {
    // this.form = row;
    // this.dialogVisible = true;
    // this.$nextTick(() => {
    //   // 加载表单json数据
    //   this.$refs.vfDesigner.setFormJson(JSON.parse(row.formContent))
    // })
    proxy.$router.push({ path: '/flowable/task/flowForm/index', query: { formId: row.formId } })
  }
  /** 重置表单 */
  const resetFormData = () => {
    proxy.$refs['vFormRef'].resetForm()
  }
  /** 提交按钮 */
  const submitForm = () => {
    proxy.$refs['ELForm'].validate((valid: boolean) => {
      if (valid) {
        if (form.value.formId != null) {
          updateForm(form.value).then((response: any) => {
            proxy.$modal.msgSuccess('修改成功')
            formOpen.value = false
            getList()
          })
        } else {
          addForm(form.value).then((response: any) => {
            proxy.$modal.msgSuccess('新增成功')
            formOpen.value = false
            getList()
          })
        }
        dialogVisible.value = false
      }
    })
  }
  /** 提交按钮 */
  const submitFormData = () => {
    proxy.$refs['vFormRef'].getFormData().then((formData: any) => {
      // Form Validation OK
      console.log(JSON.stringify(formData))
    }).catch((error: any) => {
      // Form Validation failed
      proxy.$modal.msgError(error)
    })
  }
  /** 删除按钮操作 */
  const handleDelete = (row: any) => {
    const formIds = row.formId || ids.value
    proxy.$modal.confirm('是否确认删除表单编号为"' + formIds + '"的数据项?').then(function () {
      return delForm(formIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    }).catch(() => {})
  }

  getList()

  onActivated(() => {
    const time = route.query.t
    if (time != null) {
      getList()
    }
  })
</script>

<style scoped>
  .test-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
  }
  :deep(.dialogClass .el-dialog__header) {
    padding: 0;
  }
  :deep(.dialogClass .el-dialog__body) {
    padding: 0;
  }
</style>
