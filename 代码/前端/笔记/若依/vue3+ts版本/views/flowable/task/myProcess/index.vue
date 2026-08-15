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
          placeholder="选择时间"></el-date-picker>
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
          @click="handleAdd"
          v-hasPermi="['system:deployment:add']">
          新增流程
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
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="myProcessList"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="流程编号"
        align="center"
        prop="procInsId"
        :show-overflow-tooltip="true" />
      <el-table-column
        label="流程名称"
        align="center"
        prop="procDefName"
        :show-overflow-tooltip="true" />
      <el-table-column
        label="流程类别"
        align="center"
        prop="category"
        width="100px" />
      <el-table-column
        label="流程版本"
        align="center"
        width="80px">
        <template #default="scope">
          <el-tag size="medium">v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        width="180" />
      <el-table-column
        label="流程状态"
        align="center"
        width="100">
        <template #default="scope">
          <el-tag
            v-if="scope.row.finishTime == null"
            size="small">
            进行中
          </el-tag>
          <el-tag
            type="success"
            v-if="scope.row.finishTime != null"
            size="small">
            已完成
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="180" />
      <el-table-column
        label="当前节点"
        align="center"
        prop="taskName" />
      <el-table-column
        label="办理人"
        align="center">
        <template #default="scope">
          <label v-if="scope.row.assigneeName">
            {{scope.row.assigneeName}}
            <el-tag
              type="info"
              size="small">
              {{scope.row.assigneeDeptName}}
            </el-tag>
          </label>
          <!--          <label v-if="scope.row.candidate">{{scope.row.candidate}}</label>-->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            @click="handleFlowRecord(scope.row)"
            link
            size="small">
            详情
          </el-button>
          <el-button
            @click="handleStop(scope.row)"
            link
            size="small">
            取消申请
          </el-button>
          <el-button
            @click="handleDelete(scope.row)"
            link
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

    <!-- 发起流程 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="60%"
      append-to-body>
      <el-form
        :model="queryProcessParams"
        ref="queryProcessForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px">
        <el-form-item
          label="名称"
          prop="name">
          <el-input
            v-model="queryProcessParams.name"
            placeholder="请输入名称"
            clearable
            size="small"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="Search"
            size="small"
            @click="handleProcessQuery">
            搜索
          </el-button>
          <el-button
            icon="Refresh"
            size="small"
            @click="resetProcessQuery">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="processLoading"
        fit
        :data="definitionList"
        border>
        <el-table-column
          label="流程名称"
          align="center"
          prop="name" />
        <el-table-column
          label="流程版本"
          align="center">
          <template #default="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="流程分类"
          align="center"
          prop="category" />
        <el-table-column
          label="操作"
          align="center"
          width="300"
          class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              size="small"
              link
              icon="EditPen"
              @click="handleStartProcess(scope.row)">
              发起流程
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="processTotal>0"
        :total="processTotal"
        v-model:page="queryProcessParams.pageNum"
        v-model:limit="queryProcessParams.pageSize"
        @pagination="listDefinition" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, getCurrentInstance } from 'vue'
  import {
    getDeployment,
    delDeployment,
    addDeployment,
    updateDeployment,
    exportDeployment,
    flowRecord
  } from '@/api/flowable/finished'
  import { myProcessList as myProcessListApi, stopProcess } from '@/api/flowable/process'
  import { listDefinition as listDefinitionApi } from '@/api/flowable/definition'

  defineOptions({ name: 'Deploy' })

  const { proxy } = getCurrentInstance() as any

  // 遮罩层
  const loading = ref(true)
  const processLoading = ref(true)
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
  const processTotal = ref(0)
  // 我发起的流程列表数据
  const myProcessList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  // 是否显示弹出层
  const open = ref(false)
  const src = ref('')
  const definitionList = ref<any[]>([])
  // 查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    category: null as string | null,
    key: null as string | null,
    tenantId: null as string | null,
    deployTime: null as string | null,
    derivedFrom: null as string | null,
    derivedFromRoot: null as string | null,
    parentDeploymentId: null as string | null,
    engineVersion: null as string | null
  })
  // 查询参数
  const queryProcessParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    category: null as string | null,
    key: null as string | null,
    tenantId: null as string | null,
    deployTime: null as string | null,
    derivedFrom: null as string | null,
    derivedFromRoot: null as string | null,
    parentDeploymentId: null as string | null,
    engineVersion: null as string | null
  })
  // 表单参数
  const form = ref<any>({})
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})

  /** 查询流程定义列表 */
  const getList = () => {
    loading.value = true
    myProcessListApi(queryParams.value).then((response: any) => {
      myProcessList.value = response.data.records
      total.value = response.data.total
      loading.value = false
    })
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
  /** 搜索按钮操作 */
  const handleProcessQuery = () => {
    queryProcessParams.value.pageNum = 1
    listDefinition()
  }
  /** 重置按钮操作 */
  const resetProcessQuery = () => {
    proxy.resetForm('queryProcessForm')
    handleProcessQuery()
  }
  // 多选框选中数据
  const handleSelectionChange = (selection: any[]) => {
    ids.value = selection.map(item => item.procInsId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    open.value = true
    title.value = '发起流程'
    listDefinition()
  }
  const listDefinition = () => {
    listDefinitionApi(queryProcessParams.value).then((response: any) => {
      definitionList.value = response.data.records
      processTotal.value = response.data.total
      processLoading.value = false
    })
  }
  /**  发起流程申请 */
  const handleStartProcess = (row: any) => {
    proxy.$router.push({ path: '/flowable/task/myProcess/send/index',
      query: {
        deployId: row.deploymentId,
        procDefId: row.id
      }
    })
  }
  /**  取消流程申请 */
  const handleStop = (row: any) => {
    const params = {
      instanceId: row.procInsId
    }
    stopProcess(params).then((res: any) => {
      proxy.$modal.msgSuccess(res.msg)
      getList()
    })
  }
  /** 流程流转记录 */
  const handleFlowRecord = (row: any) => {
    proxy.$router.push({ path: '/flowable/task/myProcess/detail/index',
      query: {
        procInsId: row.procInsId,
        deployId: row.deployId,
        taskId: row.taskId
      }
    })
  }
  /** 修改按钮操作 */
  const handleUpdate = (row: any) => {
    reset()
    const id = row.id || ids.value
    getDeployment(id).then((response: any) => {
      form.value = response.data
      open.value = true
      title.value = '修改流程定义'
    })
  }
  /** 提交按钮 */
  const submitForm = () => {
    proxy.$refs['ELForm'].validate((valid: boolean) => {
      if (valid) {
        if (form.value.id != null) {
          updateDeployment(form.value).then((response: any) => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addDeployment(form.value).then((response: any) => {
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
    const delIds = row.procInsId || ids.value// 暂不支持删除多个流程
    proxy.$modal.confirm('是否确认删除流程定义编号为"' + delIds + '"的数据项?').then(() => {
      return delDeployment(delIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
  }
  /** 导出按钮操作 */
  const handleExport = () => {
    proxy.$modal.confirm('是否确认导出所有流程定义数据项?').then(() => {
      return exportDeployment(queryParams.value)
    }).then((response: any) => {
      proxy.download(response.msg)
    })
  }

  getList()
</script>
