<template>
  <comp-drawer
    v-model="show"
    :z-index="zIndex"
    :enable-scroll="false"
    :title="title"
    :tip="tip"
    :show-save-button="showDrawerSaveBtn"
    @save="handleSave">
    <div class="app-container">
      <!-- 搜索条件 start -->
      <CompTableSearch
        :model="list.query"
        :loading="list.loading"
        :show-reset-btn="showResetBtn"
        @search="handleSearch"
        @reset="handleReset">
        <template #left>
          <CompCommonSearchItem
            v-model="list.query"
            v-bind="localColumns.search.attr"
            :options="localColumns.search.options">
            <template
              v-for="(_, forward) in $slots"
              :key="forward"
              #[forward]="slotProps">
              <slot
                :name="forward"
                v-bind="slotProps"
                :query />
            </template>
          </CompCommonSearchItem>
        </template>

        <template #right>
          <el-text class="mr10">{{ checkAll.selected.value.length }} / {{ maxLength }}</el-text>
          <template v-if="maxLength > 1">
            <el-button-group>
              <el-button
                size="default"
                type="danger"
                :loading="list.loading"
                @click="handleRemove">
                清除所有
              </el-button>
              <el-button
                v-if="isChecked"
                size="default"
                type="danger"
                :loading="list.loading"
                @click="handleRemovePage">
                清除本页
              </el-button>
              <el-button
                v-else
                size="default"
                :loading="list.loading"
                @click="handleSelectedPage">
                全选本页
              </el-button>
            </el-button-group>
          </template>
        </template>
      </CompTableSearch>
      <!-- 搜索条件 end -->

      <!-- 表格 start -->
      <CompTable
        v-model:list="list"
        :columns="localColumns.table.options"
        :show-table-tool-bar="false"
        :selectable="false"
        v-bind="localColumns.table.attr"
        :loading="list.loading"
        :min-width="120">
        <template
          v-for="(_, forward) in $slots"
          :key="forward"
          #[forward]="slotProps">
          <slot
            :name="forward"
            v-bind="slotProps" />
        </template>

        <template #col-action="{ row }">
          <el-button
            v-if="!includesRow(row)"
            type="primary"
            size="default"
            link
            :disabled="disabledRow(row)"
            @click="handleChecked(row, 1)">
            选择
          </el-button>
          <el-button
            v-else
            size="default"
            type="warning"
            link
            @click="handleChecked(row, 2)">
            取消
          </el-button>
        </template>
      </CompTable>
      <!-- 表格 end -->

      <pagination
        v-if="showPagination"
        v-show="list.total > 0"
        :total="list.total"
        v-model:page="list.query.pageNum"
        v-model:limit="list.query.pageSize"
        @pagination="getList" />
    </div>
  </comp-drawer>
</template>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { TableColumn } from '@/components/CompTable/types'
  import type { CompSelectProps, ListResult } from './types'
  import { AjaxResult } from '@/types'

  import { putSelectedList, useCheckAll } from '@/hooks/useCheckAll'
  import { useSelect } from '@/hooks/useSelect'

  import CompCommonSearchItem from '@/components/CommonSearchItem/index.vue'
  import CompTable from '@/components/CompTable/index.vue'
  import CompDrawer from '@/components/Drawer/index.vue'
  import CompTableSearch from '@/components/TableSearch/index.vue'
  import { compSelectProps } from '.'

  const props = withDefaults(defineProps<CompSelectProps<T, R>>(), compSelectProps<T>())
  const emit = defineEmits<{
    change: [selected: R[]]
  }>()
  const show = defineModel<boolean>({
    default: false,
  })

  const localColumns = computed(() => {
    const tableOptions: TableColumn<R>[] = [
      ...props.columns.table.options,
      { prop: 'action', label: '操作', width: 100, fixed: 'right', slot: true },
    ]
    return {
      ...props.columns,
      table: {
        ...props.columns.table,
        options: tableOptions,
      },
    }
  })

  /** 当前生效的主键字段（支持父组件动态切换，如 id -> dept_id） */
  const checkedKeys = computed(() => props.keys)

  /** 跨页选择 */
  const checkAll = useCheckAll<T, Partial<R>>(checkedKeys.value)
  watch(checkedKeys, value => {
    checkAll.keys.value = value
  }, { immediate: true })

  const { list, getList, resetList } = useListQuery<T, R, ListResult>(
    computed(() => ({ ...props.query })),
    props.queryKey,
    async query => {
      const data = await props.apiFn(query)
      return {
        ...data,
        rows: checkAll.isCheckedItem(data.rows ?? (data as AjaxResult)?.data ?? []) as R[],
      }
    },
    {
      enabled: computed(() => show.value),
    }
  )

  /** 选择弹窗hook */
  const {
    isChecked,
    handleChecked,
    handleRemove,
    handleRemovePage,
    handleSave,
    includesRow,
  } = useSelect<T, Partial<R>>(props, { emit }, checkAll, list, checkedKeys)

  /** 初始化 */
  watch(
    () => show.value,
    async val => {
      if (val) {
        checkAll.selected.value = props.selected
        if (!list.items.length) handleSearch()
      }
    }
  )

  /** 全选本页 */
  const handleSelectedPage = () => {
    checkAll.selected.value = putSelectedList(
      checkAll.selected.value,
      list.items.filter(item => !props.disabledRow(item)),
      props.keys
    )
  }

  /** 搜索 */
  const handleSearch = () => {
    list.query.pageNum = 1
    getList()
  }

  /** 重置 */
  const handleReset = () => {
    resetList()
    handleSearch()
  }
</script>
