<template>
  <div>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col
        :span="6"
        :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="Search"
            style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col
        :span="18"
        :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px">
          <el-form-item
            label="用户名称"
            prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 150px"
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
          v-show="checkType === 'multiple'"
          ref="dataTableRef"
          v-loading="loading"
          :row-key="getRowKey"
          :data="userList"
          @selection-change="handleMultipleUserSelect">
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="50"
            align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible" />
          <el-table-column
            label="登录账号"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="用户姓名"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120" />
        </el-table>
        <el-table
          v-show="checkType === 'single'"
          v-loading="loading"
          :data="userList"
          @current-change="handleSingleUserSelect">
          <el-table-column
            width="55"
            align="center">
            <template #default="scope">
              <el-radio
                v-model="radioSelected"
                :label="scope.row.userId">
                {{ '' }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible" />
          <el-table-column
            label="登录账号"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="用户姓名"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120" />
        </el-table>
        <Pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[5, 10]"
          layout="prev, pager, next"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'

  import { ref, watch, nextTick, getCurrentInstance } from 'vue'
  import { listUser, deptTreeSelect } from '@/api/system/user'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'FlowUser' })

  const props = defineProps({
    selectValues: {
      type: [Number, String, Array] as PropType<number | string | any[]>,
      default: null,
      required: false
    },
    checkType: {
      type: String,
      default: 'multiple',
      required: true
    }
  })

  const emit = defineEmits(['handleUserSelect'])

  const { proxy } = getCurrentInstance() as any

  const treeRef = ref<any>()
  const dataTableRef = ref<any>()

  const loading = ref(true)
  const showSearch = ref(true)
  const total = ref(0)
  const userList = ref<any[]>([])
  const deptOptions = ref<any[]>([])
  const deptName = ref<string | undefined>(undefined)
  const queryParams = ref({
    pageNum: 1,
    pageSize: 5,
    userName: undefined as string | undefined,
    phonenumber: undefined as string | undefined,
    status: undefined as '0' | '1' | undefined,
    deptId: undefined as number | undefined
  })
  const defaultProps = {
    children: 'children',
    label: 'label'
  }
  const columns = ref([
    { key: 0, label: '用户编号', visible: true },
    { key: 1, label: '用户名称', visible: true },
    { key: 2, label: '用户昵称', visible: true },
    { key: 3, label: '部门', visible: true },
    { key: 4, label: '手机号码', visible: true },
    { key: 5, label: '状态', visible: true },
    { key: 6, label: '创建时间', visible: true }
  ])
  const radioSelected = ref<number | string | undefined>(0)
  const selectUserList = ref<any>([])

  const getList = () => {
    loading.value = true
    listUser(queryParams.value).then((response: any) => {
      userList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  }

  const getDeptTree = () => {
    deptTreeSelect().then((response: any) => {
      deptOptions.value = response.data
    })
  }

  const getRowKey = (row: any) => {
    return row.id
  }

  const filterNode = (value: string, data: any) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }

  const handleNodeClick = (data: any) => {
    queryParams.value.deptId = data.id
    handleQuery()
  }

  const handleMultipleUserSelect = (selection: any[]) => {
    emit('handleUserSelect', selection)
  }

  const handleSingleUserSelect = (selection: any) => {
    radioSelected.value = selection.userId
    emit('handleUserSelect', selection)
  }

  const handleQuery = () => {
    queryParams.value.pageNum = 1
    getList()
  }

  const resetQuery = () => {
    proxy.resetForm('queryForm')
    queryParams.value.deptId = undefined
    treeRef.value?.setCurrentKey(null)
    handleQuery()
  }

  watch(
    () => deptName.value,
    (val) => {
      treeRef.value?.filter(val as string)
    }
  )

  watch(
    () => props.selectValues,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal as string | number)) {
        if (newVal instanceof Number) {
          radioSelected.value = newVal as any
        } else {
          selectUserList.value = newVal
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => userList.value,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal) && selectUserList.value?.length > 0) {
        nextTick(() => {
          dataTableRef.value?.clearSelection()
          selectUserList.value?.split(',').forEach((key: string) => {
            dataTableRef.value?.toggleRowSelection(
              newVal.find((item: any) => key == item.userId),
              true
            )
          })
        })
      }
    }
  )

  getList()
  getDeptTree()
</script>
