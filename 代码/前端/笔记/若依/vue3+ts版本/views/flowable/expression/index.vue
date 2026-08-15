<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px">
      <el-form-item
        label="名称"
        prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入表达式名称"
          clearable
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable>
          <el-option
            v-for="dict in sys_common_status"
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
          v-hasPermi="['system:expression:add']">
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
          v-hasPermi="['system:expression:edit']">
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
          v-hasPermi="['system:expression:remove']">
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
          v-hasPermi="['system:expression:export']">
          导出
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="expressionList"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center" />
      <el-table-column
        label="主键"
        align="center"
        prop="id" />
      <el-table-column
        label="名称"
        align="center"
        prop="name" />
      <el-table-column
        label="表达式内容"
        align="center"
        prop="expression" />
      <el-table-column
        label="指定类型"
        align="center"
        prop="dataType">
        <template #default="scope">
          <dict-tag
            :options="exp_data_type"
            :value="scope.row.dataType" />
        </template>
      </el-table-column>
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
            v-hasPermi="['system:expression:edit']">
            修改
          </el-button>
          <el-button
            size="small"
            link
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:expression:remove']">
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

    <!-- 添加或修改流程达式对话框 -->
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
            placeholder="请输入表达式名称" />
        </el-form-item>
        <el-form-item
          label="内容"
          prop="expression">
          <el-input
            v-model="form.expression"
            placeholder="请输入表达式内容" />
        </el-form-item>
        <el-form-item
          label="指定类型"
          prop="dataType">
          <el-radio-group v-model="form.dataType">
            <el-radio
              v-for="dict in exp_data_type"
              :key="dict.value"
              :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="parseInt(dict.value)">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
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
  import { ref, reactive, getCurrentInstance } from 'vue'
  import { listExpression, getExpression, delExpression, addExpression, updateExpression } from '@/api/flowable/expression'

  defineOptions({ name: 'FlowExp' })

  const { proxy } = getCurrentInstance() as any
  const { sys_common_status, exp_data_type } = useDict('sys_common_status', 'exp_data_type')

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
  // 流程达式表格数据
  const expressionList = ref<any[]>([])
  // 弹出层标题
  const title = ref('')
  // 是否显示弹出层
  const open = ref(false)
  // 查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    expression: null as string | null,
    status: null as string | null
  })
  // 表单参数
  const form = ref<any>({
    dataType: 'fixed'
  })
  // 表单校验
  const rules = reactive<Record<string, any[]>>({})

  /** 查询流程达式列表 */
  const getList = () => {
    loading.value = true
    listExpression(queryParams.value).then((response: any) => {
      expressionList.value = response.rows
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
      expression: null,
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
    title.value = '添加流程达式'
  }
  /** 修改按钮操作 */
  const handleUpdate = (row: any) => {
    reset()
    const id = row.id || ids.value
    getExpression(id).then((response: any) => {
      form.value = response.data
      open.value = true
      title.value = '修改流程达式'
    })
  }
  /** 提交按钮 */
  const submitForm = () => {
    proxy.$refs['ELForm'].validate((valid: boolean) => {
      if (valid) {
        if (form.value.id != null) {
          updateExpression(form.value).then(() => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addExpression(form.value).then(() => {
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
    proxy.$modal.confirm('是否确认删除流程达式编号为"' + delIds + '"的数据项？').then(function () {
      return delExpression(delIds)
    }).then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    }).catch(() => {})
  }
  /** 导出按钮操作 */
  const handleExport = () => {
    proxy.download('system/expression/export', {
      ...queryParams.value
    }, `expression_${new Date().getTime()}.xlsx`)
  }

  getList()
</script>
