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
          value-format="yyyy-MM-dd"
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
      :data="todoList"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="任务编号"
        align="center"
        prop="taskId"
        :show-overflow-tooltip="true" />
      <el-table-column
        label="流程名称"
        align="center"
        prop="procDefName" />
      <el-table-column
        label="当前节点"
        align="center"
        prop="taskName" />
      <el-table-column
        label="流程版本"
        align="center">
        <template #default="scope">
          <el-tag size="medium">v{{scope.row.procDefVersion}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="流程发起人"
        align="center">
        <template #default="scope">
          <label>
            {{scope.row.startUserName}}
            <el-tag
              type="info"
              size="small">
              {{scope.row.startDeptName}}
            </el-tag>
          </label>
        </template>
      </el-table-column>
      <el-table-column
        label="接收时间"
        align="center"
        prop="createTime"
        width="180" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="small"
            link
            icon="EditPen"
            @click="handleProcess(scope.row)">
            处理
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, getCurrentInstance } from 'vue'
  import {
    todoList as todoListApi,
    complete,
    returnList,
    returnTask,
    rejectTask,
    getDeployment,
    delDeployment,
    exportDeployment
  } from '@/api/flowable/todo'

  defineOptions({ name: 'Deploy' })

  const { proxy } = getCurrentInstance() as any

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
  // 流程待办任务表格数据
  const todoList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  // 是否显示弹出层
  const open = ref(false)
  // 查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    category: null as string | null
  })
  // 表单参数
  const form = ref<any>({})
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})

  /** 查询流程定义列表 */
  const getList = () => {
    loading.value = true
    todoListApi(queryParams.value).then((response: any) => {
      todoList.value = response.data.records
      total.value = response.data.total
      loading.value = false
    })
  }
  // 跳转到处理页面
  const handleProcess = (row: any) => {
    proxy.$router.push({
      path: '/flowable/task/todo/detail/index',
      query: {
        procInsId: row.procInsId,
        executionId: row.executionId,
        deployId: row.deployId,
        taskId: row.taskId,
        taskName: row.taskName,
        startUser: row.startUserName + '-' + row.startDeptName
      }
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
    proxy.resetForm('form')
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
    ids.value = selection.map(item => item.taskId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  /** 删除按钮操作 */
  const handleDelete = (row: any) => {
    const delIds = row.taskId || ids.value
    proxy.$modal.confirm('是否确认删除流程定义编号为"' + delIds + '"的数据项?').then(function () {
      return delDeployment(delIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    }).catch(() => {})
  }

  getList()
</script>
