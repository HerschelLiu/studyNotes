<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch">
      <el-form-item
        label="角色名称"
        prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
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
      :data="roleList"
      @selection-change="handleMultipleRoleSelect">
      <el-table-column
        type="selection"
        width="50"
        align="center" />
      <el-table-column
        label="角色编号"
        prop="roleId"
        width="120" />
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150" />
      <el-table-column
        label="权限字符"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150" />
      <el-table-column
        label="显示顺序"
        prop="roleSort"
        width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-show="checkType === 'single'"
      v-loading="loading"
      :data="roleList"
      @current-change="handleSingleRoleSelect">
      <el-table-column
        width="55"
        align="center">
        <template #default="scope">
          <el-radio
            v-model="radioSelected"
            :label="scope.row.roleId">
            {{ '' }}
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        label="角色编号"
        prop="roleId"
        width="120" />
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150" />
      <el-table-column
        label="权限字符"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150" />
      <el-table-column
        label="显示顺序"
        prop="roleSort"
        width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
  import type { PropType } from 'vue'

  import { ref, watch, nextTick } from 'vue'
  import { listRole } from '@/api/system/role'
  import { StrUtil } from '@/utils/StrUtil'
  import { parseTime } from '@/utils/ruoyi'

  defineOptions({ name: 'FlowRole' })

  const props = defineProps({
    selectValues: {
      type: [Number, String, Array] as PropType<number | string | any[]>,
      default: null,
      required: false
    },
    checkType: {
      type: String,
      default: 'multiple',
      required: false
    }
  })

  const emit = defineEmits(['handleRoleSelect'])

  const loading = ref(true)
  const showSearch = ref(true)
  const total = ref(0)
  const roleList = ref<any[]>([])
  const queryParams = ref({
    pageNum: 1,
    pageSize: 5,
    roleName: undefined as string | undefined,
    roleKey: undefined as string | undefined,
    status: undefined as string | undefined
  })
  const radioSelected = ref<number | string | undefined>(0)
  const selectRoleList = ref<any>([])
  const dataTableRef = ref<any>()

  const getList = () => {
    loading.value = true
    listRole(queryParams.value).then((response: any) => {
      roleList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  }

  const handleMultipleRoleSelect = (selection: any[]) => {
    const idList = selection.map((item) => item.roleId)
    const nameList = selection.map((item) => item.roleName)
    emit('handleRoleSelect', idList.join(','), nameList.join(','))
  }

  const handleSingleRoleSelect = (selection: any) => {
    radioSelected.value = selection.roleId
    const roleName = selection.roleName
    emit('handleRoleSelect', String(radioSelected.value), roleName)
  }

  const handleQuery = () => {
    queryParams.value.pageNum = 1
    getList()
  }

  const resetQuery = () => {
    handleQuery()
  }

  watch(
    () => props.selectValues,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal as string | number)) {
        if (newVal instanceof Number || newVal instanceof String) {
          radioSelected.value = newVal as any
        } else {
          selectRoleList.value = newVal
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => roleList.value,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal) && selectRoleList.value?.length > 0) {
        nextTick(() => {
          dataTableRef.value?.clearSelection()
          selectRoleList.value?.split(',').forEach((key: string) => {
            dataTableRef.value?.toggleRowSelection(
              newVal.find((item: any) => key == item.roleId),
              true
            )
          })
        })
      }
    }
  )

  getList()
</script>
