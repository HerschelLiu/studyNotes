### `CompSelect`

```vue
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

```



### `types.ts`

```ts
import type { CommonSearchItemOptions, CommonSearchItemProps } from '@/components/CommonSearchItem/types'
import type { CompTableProp, TableColumn } from '@/components/CompTable/types'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { QueryKey } from '@tanstack/vue-query'

export interface CompSelectColumn<T, R> {
  search: {
    attr: Partial<CommonSearchItemProps<T>>
    options: CommonSearchItemOptions<T>[]
  }
  table: {
    attr: Partial<CompTableProp<T, R>>
    options: TableColumn<R>[]
  }
}

export type ListResult = AjaxResult | TableDataInfo

export interface CompSelectProps<T, R> {
  /** 抽屉标题 */
  title?: string
  /** 描述标题 */
  tip?: string
  /** 指定弹窗层级 */
  zIndex?: number
  selected?: Partial<R>[]
  /** 最小选择数据 */
  minLength?: number
  /** 最大选择数据 */
  maxLength?: number
  /** 禁用选择行 */
  disabledRow?: (row: Partial<R>) => boolean
  /** 查询条件 */
  query?: T
  /** 跨页选择依据字段 */
  keys?: string
  /** 搜索 + 表格列配置 */
  columns: CompSelectColumn<T, R>
  /** 列表接口（兼容 AjaxResult / TableDataInfo，rows 与 total 均允许为空） */
  apiFn: (query?: T & ListBaseQuery) => Promise<ListResult>
  /** queryKey */
  queryKey: QueryKey | ((query?: T & ListBaseQuery) => QueryKey)
  showPagination?: boolean
  showResetBtn?: boolean
  showDrawerSaveBtn?: boolean
}

```

### `index.ts`

```ts
export const compSelectProps = <T extends Record<string, any>>(omit: string[] = []) => {
  const obj = {
    title: '选择',
    tip: undefined,
    zIndex: 1,
    selected: () => [],
    minLength: 1,
    maxLength: 500,
    disabledRow: () => false,
    query: () => ({} as T),
    keys: 'id',
    showPagination: true,
    showResetBtn: true,
    showDrawerSaveBtn: true
  }

  if (!omit.length) return obj

  return Object.fromEntries(Object.entries(obj).filter(([key]) => !omit.includes(key))) as typeof obj
}

```





### 使用

```vue
<template>
  <!-- 选择核算账簿 -->
  <CompSelect
    v-model="modalList.showAccountingBookSelect"
    title="核算账簿"
    :selected="form.accountingBooksList"
    keys="accountingBooksId"
    :query-key="checkedAccountBookQueryKey"
    :api-fn="listCheckedAccountBook"
    :columns="compSelectColumns"
    @change="handleSelectAccountingBookChange" />
</template>

<script lang="ts" setup>
  const initialQuery: RequestList = {
    userName: '',
    nickName: '',
  }
  const checkedQueryKey = (query?: RequestList & ListBaseQuery) =>
    queryKeys.basicPlatform.user.list(query)
  
  const apiFn = (query?: RequestList & ListBaseQuery) => listCheckedAccountBook(query ?? {})
  
  const compSelectColumns: CompSelectColumn<CheckedAccountBookQueryParams, any> = {
    search: {
      attr: {
        labelWidth: 0,
      },
      options: [
        {
          prop: 'accountingBooksNature',
          label: '核算账簿性质',
          type: 'select',
          props: {
            data: check_accountbook_nature,
          },
        },
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
    table: {
      attr: {
        index: true,
      },
      options: [
        {
          prop: 'accountingBooksNature',
          label: '核算账簿性质',
          format: { type: 'dict', formatStr: check_accountbook_nature },
        },
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
  }
</script>
```



