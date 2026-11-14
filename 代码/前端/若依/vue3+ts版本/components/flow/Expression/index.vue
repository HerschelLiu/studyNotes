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

    <el-table
      v-loading="loading"
      :data="expressionList"
      @current-change="handleSingleExpSelect">
      <el-table-column
        width="55"
        align="center">
        <template #default="scope">
          <el-radio
            v-model="radioSelected"
            :label="scope.row.id">
            {{ '' }}
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name" />
      <el-table-column
        label="表达式内容"
        align="center"
        prop="expression" />
      <el-table-column
        label="表达式类型"
        align="center"
        prop="dataType">
        <template #default="scope">
          <DictTag
            :options="exp_data_type"
            :value="scope.row.dataType" />
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[5, 10]"
      layout="prev, pager, next"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import { listExpression } from '@/api/flowable/expression'
  import { StrUtil } from '@/utils/StrUtil'
  import { useDict } from '@/utils/dict'

  defineOptions({ name: 'Expression' })

  const { proxy } = getCurrentInstance()!
  const { exp_data_type } = useDict('exp_data_type')

  const props = defineProps({
    selectValues: {
      type: [Number, String] as PropType<number | string>,
      default: null,
      required: false,
    },
  })

  const emit = defineEmits(['handleSingleExpSelect'])

  const loading = ref(true)
  const showSearch = ref(true)
  const total = ref(0)
  const expressionList = ref<any[]>([])
  const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    name: null as string | null,
    expression: null as string | null,
    status: null as string | null,
  })
  const radioSelected = ref<string | number | undefined>(undefined)

  const getList = () => {
    loading.value = true
    listExpression(queryParams.value).then((response: any) => {
      expressionList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  }

  const handleQuery = () => {
    queryParams.value.pageNum = 1
    getList()
  }

  const resetQuery = () => {
    // @ts-ignore resetForm 是全局挂载方法
    proxy?.resetForm('queryForm')
    handleQuery()
  }

  const handleSingleExpSelect = (selection: any) => {
    radioSelected.value = selection.id
    emit('handleSingleExpSelect', selection)
  }

  watch(
    () => props.selectValues,
    newVal => {
      if (StrUtil.isNotBlank(newVal as string | number)) {
        radioSelected.value = newVal
      }
    },
    { immediate: true }
  )

  getList()
</script>
