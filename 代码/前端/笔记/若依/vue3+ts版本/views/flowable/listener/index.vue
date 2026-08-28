<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="default"
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
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item
        label="监听类型"
        prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择监听类型"
          clearable>
          <el-option
            v-for="dict in sys_listener_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value" />
        </el-select>
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
          v-hasPermi="['system:listener:add']">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:listener:edit']">
          修改
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
          v-hasPermi="['system:listener:remove']">
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:listener:export']">
          导出
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="listenerList"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="名称"
        align="center"
        prop="name" />
      <el-table-column
        label="监听类型"
        align="center"
        prop="type">
        <template #default="scope">
          <dict-tag
            :options="sys_listener_type"
            :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column
        label="事件类型"
        align="center"
        prop="eventType" />
      <el-table-column
        label="值类型"
        align="center"
        prop="valueType">
        <template #default="scope">
          <dict-tag
            :options="sys_listener_value_type"
            :value="scope.row.valueType" />
        </template>
      </el-table-column>
      <el-table-column
        label="执行内容"
        align="center"
        prop="value" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="small"
            link
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:listener:edit']">
            修改
          </el-button>
          <el-button
            size="small"
            link
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:listener:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改流程监听对话框 -->
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
          label="名称"
          prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称" />
        </el-form-item>
        <el-form-item
          label="监听类型"
          prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择监听类型">
            <el-option
              v-for="dict in sys_listener_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="事件类型"
          prop="eventType"
          v-if="form.type === '1'">
          <el-select
            v-model="form.eventType"
            placeholder="请选择事件类型">
            <el-option
              v-for="dict in taskListenerEventList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="事件类型"
          prop="eventType"
          v-else>
          <el-select
            v-model="form.eventType"
            placeholder="请选择事件类型">
            <el-option
              v-for="dict in executionListenerEventList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="值类型"
          prop="valueType">
          <el-radio-group v-model="form.valueType">
            <el-radio
              v-for="dict in sys_listener_value_type"
              :key="dict.value"
              :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="执行内容"
          prop="value">
          <el-input
            v-model="form.value"
            placeholder="请输入执行内容" />
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
  import { ref, reactive, getCurrentInstance } from 'vue'
  import { listListener, getListener, delListener, addListener, updateListener } from '@/api/flowable/listener'

  defineOptions({ name: 'Listener' })

  const { proxy } = getCurrentInstance() as any
  const { sys_listener_value_type, sys_listener_type } = useDict('sys_listener_value_type', 'sys_listener_type', 'common_status', 'sys_listener_event_type')

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
  // 流程监听表格数据
  const listenerList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  // 是否显示弹出层
  const open = ref(false)
  // 查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    type: null as string | null,
    eventType: null as string | null,
    valueType: null as string | null,
    value: null as string | null,
    status: null as string | null
  })
  // 表单参数
  const form = ref<any>({})
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})
  const taskListenerEventList = ref<any[]>([
    { label: 'create', value: 'create' },
    { label: 'assignment', value: 'assignment' },
    { label: 'complete', value: 'complete' },
    { label: 'delete', value: 'delete' }
  ])
  const executionListenerEventList = ref<any[]>([
    { label: 'start', value: 'start' },
    { label: 'end', value: 'end' },
    { label: 'take', value: 'take' }
  ])

  /** 查询流程监听列表 */
  const getList = () => {
    loading.value = true
    listListener(queryParams.value).then((response: any) => {
      listenerList.value = response.rows
      total.value = response.total
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
      type: null,
      eventType: null,
      valueType: null,
      value: null,
      createTime: null,
      updateTime: null,
      createBy: null,
      updateBy: null,
      status: null,
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
    ids.value = selection.map(item => item.id)
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset()
    open.value = true
    title.value = '添加流程监听'
  }
  /** 修改按钮操作 */
  const handleUpdate = (row: any) => {
    reset()
    const id = row.id || ids.value
    getListener(id).then((response: any) => {
      form.value = response.data
      open.value = true
      title.value = '修改流程监听'
    })
  }
  /** 提交按钮 */
  const submitForm = () => {
    proxy.$refs['ELForm'].validate((valid: boolean) => {
      if (valid) {
        if (form.value.id != null) {
          updateListener(form.value).then(() => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addListener(form.value).then(() => {
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
    const delIds = row.id || ids.value
    proxy.$modal.confirm('是否确认删除流程监听编号为"' + delIds + '"的数据项？').then(function () {
      return delListener(delIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    }).catch(() => {})
  }
  /** 导出按钮操作 */
  const handleExport = () => {
    proxy.download('system/listener/export', {
      ...queryParams.value
    }, `listener_${new Date().getTime()}.xlsx`)
  }

  getList()
</script>
