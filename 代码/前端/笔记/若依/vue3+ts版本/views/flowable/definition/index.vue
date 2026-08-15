<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item
        label="名称"
        prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item
        label="开始时间"
        prop="deployTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.deployTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择时间" />
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
          type="success"
          plain
          icon="Plus"
          size="small"
          @click="handleLoadXml">
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
          v-hasPermi="['system:deployment:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList" />
    </el-row>
    <el-alert
      title="流程设计说明"
      type="success">
      <template #title>
        <p>流程设计说明:</p>
        <div>1、XML文件中的流程定义id属性用作流程定义的key参数。</div>
        <div>2、XML文件中的流程定义name属性用作流程定义的name参数。如果未给定name属性，会使用id作为name。</div>
        <div>
          3、当每个唯一key的流程第一次部署时，指定版本为1。对其后所有使用相同key的流程定义，部署时版本会在该key当前已部署的最高版本号基础上加1。key参数用于区分流程定义。
        </div>
        <div>
          4、id参数设置为{processDefinitionKey}:{processDefinitionVersion}:{generated-id}，其中generated-id是一个唯一数字，用以保证在集群环境下，流程定义缓存中，流程id的唯一性。
        </div>
      </template>
    </el-alert>
    <el-table
      v-loading="loading"
      fit
      :data="definitionList"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="流程编号"
        align="center"
        prop="deploymentId"
        :show-overflow-tooltip="true" />
      <el-table-column
        label="流程标识"
        align="center"
        prop="flowKey"
        :show-overflow-tooltip="true" />
      <el-table-column
        label="流程分类"
        align="center"
        prop="category" />
      <el-table-column
        label="流程名称"
        align="center"
        width="120"
        :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleReadImage(scope.row.deploymentId)">
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="业务表单"
        align="center"
        :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button
            v-if="scope.row.formId"
            link
            type="primary"
            @click="handleForm(scope.row.formId)">
            <span>{{ scope.row.formName }}</span>
          </el-button>
          <label v-else>暂无表单</label>
        </template>
      </el-table-column>
      <el-table-column
        label="流程版本"
        align="center">
        <template #default="scope">
          <el-tag size="default">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center">
        <template #default="scope">
          <el-tag
            type="success"
            v-if="scope.row.suspensionState === 1">
            激活
          </el-tag>
          <el-tag
            type="warning"
            v-if="scope.row.suspensionState === 2">
            挂起
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="部署时间"
        align="center"
        prop="deploymentTime"
        width="180" />
      <el-table-column
        label="操作"
        width="250"
        fixed="right"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            @click="handleLoadXml(scope.row)"
            icon="EditPen"
            link
            type="primary"
            size="small">
            设计
          </el-button>
          <el-button
            @click="handleAddForm(scope.row)"
            icon="Promotion"
            link
            type="primary"
            size="small"
            v-if="scope.row.formId == null">
            配置主表单
          </el-button>
          <el-button
            @click="handleUpdateSuspensionState(scope.row)"
            icon="VideoPause"
            link
            type="primary"
            size="small"
            v-if="scope.row.suspensionState === 1">
            挂起
          </el-button>
          <el-button
            @click="handleUpdateSuspensionState(scope.row)"
            icon="VideoPlay"
            link
            type="primary"
            size="small"
            v-if="scope.row.suspensionState === 2">
            激活
          </el-button>
          <el-button
            @click="handleDelete(scope.row)"
            icon="Delete"
            link
            type="primary"
            size="small"
            v-hasPermi="['system:deployment:remove']">
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

    <!-- 添加或修改流程定义对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item
          label="看看"
          prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入看看" />
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

    <!-- bpmn20.xml导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xml"
        :headers="upload.headers"
        :action="upload.url + '?name=' + upload.name+'&category='+ upload.category"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag>
        <el-icon><Upload /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            流程名称：
            <el-input v-model="upload.name" />
            流程分类：
            <div>
              <el-select
                v-model="upload.category"
                placeholder="请选择流程分类">
                <el-option
                  v-for="dict in sys_process_category"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </div>
          </div>
          <div
            class="el-upload__tip"
            style="color:red">
            提示：仅允许导入"bpmn20.xml"格式文件！
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitFileForm">
            确 定
          </el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 流程图 -->
    <el-dialog
      :title="readImage.title"
      v-model="readImage.open"
      width="70%"
      append-to-body>
      <BpmnViewer :flowData="flowData" />
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog
      :title="formTitle"
      v-model="formConfOpen"
      width="50%"
      append-to-body>
      <div class="test-form">
        <v-form-render
          :form-data="formData"
          ref="vFormRef" />
      </div>
    </el-dialog>

    <!--挂载表单-->
    <el-dialog
      :title="formDeployTitle"
      v-model="formDeployOpen"
      width="60%"
      append-to-body>
      <el-row :gutter="24">
        <el-col
          :span="10"
          :xs="24">
          <el-table
            ref="singleTableRef"
            :data="formList"
            border
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              label="表单编号"
              align="center"
              prop="formId" />
            <el-table-column
              label="表单名称"
              align="center"
              prop="formName" />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button
                  size="small"
                  link
                  type="primary"
                  @click="submitFormDeploy(scope.row)">
                  确定
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination
            small
            layout="prev, pager, next"
            v-show="formTotal>0"
            :total="formTotal"
            v-model:page="formQueryParams.pageNum"
            v-model:limit="formQueryParams.pageSize"
            @pagination="ListFormDeploy" />
        </el-col>
        <el-col
          :span="14"
          :xs="24">
          <div class="test-form">
            <v-form-render
              :form-data="formData"
              ref="vFormCurrentRowRef" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, nextTick, onActivated, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    listDefinition,
    updateState,
    delDeployment,
    addDeployment,
    updateDeployment,
    exportDeployment,
    definitionStart,
    flowXmlAndNode
  } from '@/api/flowable/definition'
  import { getToken } from '@/utils/auth'
  import { getForm, addDeployForm, listForm } from '@/api/flowable/form'
  import BpmnViewer from '@/components/Process/viewer/index.vue'
  import { Upload } from '@element-plus/icons-vue'

  defineOptions({ name: 'Definition' })

  const route = useRoute()
  const { proxy } = getCurrentInstance() as any
  const { sys_process_category } = useDict('sys_process_category')

  // 遮罩层
  const loading = ref(true)
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
  // 流程定义表格数据
  const definitionList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  // 是否显示弹出层
  const open = ref(false)
  const formConfOpen = ref(false)
  const formTitle = ref('')
  const formDeployOpen = ref(false)
  const formDeployTitle = ref('')
  const formList = ref<any[]>([])
  const formTotal = ref(0)
  const formData = ref<any>({}) // 默认表单数据
  const readImage = reactive({
    open: false,
    src: '',
    title: '',
  })
  // bpmn.xml 导入
  const upload = reactive({
    open: false,
    title: '',
    isUploading: false,
    name: null as any,
    category: null as any,
    headers: { Authorization: 'Bearer ' + getToken() },
    url: import.meta.env.VITE_APP_BASE_API + '/flowable/definition/import'
  })
  // 查询参数
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    name: null as any,
    category: null as any,
    key: null as any,
    tenantId: null as any,
    deployTime: null as any,
    derivedFrom: null as any,
    derivedFromRoot: null as any,
    parentDeploymentId: null as any,
    engineVersion: null as any
  })
  const formQueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  })
  // 挂载表单到流程实例
  const formDeployParam = reactive({
    formId: null as any,
    deployId: null as any
  })
  const deployId = ref('')
  const currentRow = ref<any>(null)
  // xml
  const flowData = ref<any>({})
  // 表单参数
  const form = ref<any>({})
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})
  // 模板引用
  const queryForm = ref<any>(null)
  const formRef = ref<any>(null)
  const uploadRef = ref<any>(null)
  const vFormRef = ref<any>(null)
  const vFormCurrentRowRef = ref<any>(null)
  const singleTableRef = ref<any>(null)

  /** 查询流程定义列表 */
  const getList = () => {
    loading.value = true
    listDefinition(queryParams).then((response: any) => {
      definitionList.value = response.data.records
      total.value = response.data.total
      loading.value = false
    })
  }
  const handleClose = (done: () => void) => {
    proxy.$modal.confirm('确定要关闭吗？关闭未保存的修改都会丢失？').then(() => {
      done()
    }).catch(() => {})
  }
  // 取消按钮
  const cancel = () => {
    open.value = false
    reset()
  }
  // 表单重置
  const reset = () => {
    form.value = {
      id: null,
      name: null,
      category: null,
      key: null,
      tenantId: null,
      deployTime: null,
      derivedFrom: null,
      derivedFromRoot: null,
      parentDeploymentId: null,
      engineVersion: null
    }
    proxy.resetForm('formRef')
  }
  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNum = 1
    getList()
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    proxy.resetForm('queryForm')
    handleQuery()
  }
  // 多选框选中数据
  const handleSelectionChange = (selection: any[]) => {
    ids.value = selection.map(item => item.deploymentId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset()
    open.value = true
    title.value = '添加流程定义'
  }
  /** 跳转到流程设计页面 */
  const handleLoadXml = (row: any) => {
    proxy.$router.push({ path: '/flowable/definition/model', query: { deployId: row.deploymentId } })
  }
  /** 流程图查看 */
  const handleReadImage = (deployIdVal: any) => {
    readImage.title = '流程图'
    readImage.open = true
    flowXmlAndNode({ deployId: deployIdVal }).then((res: any) => {
      flowData.value = res.data
    })
  }
  /** 表单查看 */
  const handleForm = (formId: any) => {
    getForm(formId).then((res: any) => {
      formTitle.value = '表单详情'
      formConfOpen.value = true
      nextTick(() => {
        vFormRef.value.setFormJson(JSON.parse(res.data.formContent))
        nextTick(() => {
          vFormRef.value.disableForm()
        })
      })
    })
  }
  /** 启动流程 */
  const handleDefinitionStart = (row: any) => {
    definitionStart(row.id).then((res: any) => {
      proxy.$modal.msgSuccess(res.msg)
    })
  }
  /** 挂载表单弹框 */
  const handleAddForm = (row: any) => {
    formDeployParam.deployId = row.deploymentId
    ListFormDeploy()
  }
  /** 挂载表单列表 */
  const ListFormDeploy = () => {
    listForm(formQueryParams).then((res: any) => {
      formList.value = res.rows
      formTotal.value = res.total
      formDeployOpen.value = true
      formDeployTitle.value = '挂载表单'
    })
  }
  /** 挂载表单 */
  const submitFormDeploy = (row: any) => {
    formDeployParam.formId = row.formId
    addDeployForm(formDeployParam).then((res: any) => {
      proxy.$modal.msgSuccess(res.msg)
      formDeployOpen.value = false
      getList()
    })
  }
  const handleCurrentChange = (data: any) => {
    if (data) {
      nextTick(() => {
        vFormCurrentRowRef.value.setFormJson(JSON.parse(data.formContent))
        nextTick(() => {
          vFormCurrentRowRef.value.disableForm()
        })
      })
    }
  }
  /** 挂起/激活流程 */
  const handleUpdateSuspensionState = (row: any) => {
    let state = 1
    if (row.suspensionState === 1) {
      state = 2
    }
    const params = {
      deployId: row.deploymentId,
      state: state
    }
    updateState(params).then((res: any) => {
      proxy.$modal.msgSuccess(res.msg)
      getList()
    })
  }
  /** 提交按钮 */
  const submitForm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        if (form.value.id != null) {
          updateDeployment(form.value).then(() => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addDeployment(form.value).then(() => {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getList()
          })
        }
      }
    })
  }
  /** 删除按钮操作 */
  const handleDelete = (row: any) => {
    const deploymentIds = row.deploymentId || ids.value
    proxy.$modal.confirm('是否确认删除流程定义编号为"' + deploymentIds + '"的数据项?').then(function () {
      return delDeployment(deploymentIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    }).catch(() => {})
  }
  /** 导出按钮操作 */
  const handleExport = () => {
    const exportQueryParams = queryParams
    proxy.$modal.confirm('是否确认导出所有流程定义数据项?').then(function () {
      return exportDeployment(exportQueryParams)
    }).then((response: any) => {
      proxy.download(response.msg)
    }).catch(() => {})
  }
  /** 导入bpmn.xml文件 */
  const handleImport = () => {
    upload.title = 'bpmn20.xml文件导入'
    upload.open = true
  }
  // 文件上传中处理
  const handleFileUploadProgress = () => {
    upload.isUploading = true
  }
  // 文件上传成功处理
  const handleFileSuccess = (response: any) => {
    upload.open = false
    upload.isUploading = false
    uploadRef.value.clearFiles()
    proxy.$message(response.msg)
    getList()
  }
  // 提交上传文件
  const submitFileForm = () => {
    uploadRef.value.submit()
  }

  // created
  getList()

  // activated
  onActivated(() => {
    const time = route.query.t
    if (time != null) {
      getList()
    }
  })
</script>
