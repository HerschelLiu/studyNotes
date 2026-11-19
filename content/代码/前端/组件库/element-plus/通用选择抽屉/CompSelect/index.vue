<template>
  <comp-drawer
    v-model="show"
    :z-index="zIndex"
    :enable-scroll="false"
    :title="title"
    :tip="tip"
    :show-save-button="selectable && showDrawerSaveBtn"
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

        <template
          v-if="selectable"
          #right>
          <el-text class="mr10">{{ selectedText }}</el-text>
          <!-- maxLength = 1 时选择即自动保存，不需要批量操作 -->
          <el-button-group v-if="maxLength !== 1">
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
      </CompTableSearch>
      <!-- 搜索条件 end -->

      <!-- 表格 start -->
      <CompTable
        v-model:list="list"
        :show-table-tool-bar="false"
        :selectable="false"
        column-slot-mode="merge"
        v-bind="localColumns.table.attr"
        :loading="list.loading"
        :min-width="120">
        <template
          v-for="forward in forwardedSlots"
          :key="forward"
          #[forward]="slotProps">
          <slot
            :name="forward"
            v-bind="slotProps" />
        </template>

        <!-- 内置选择操作列：写在自定义列之前，与消费方 action 列合并时选择/取消按钮在前 -->
        <CompTableColumn
          v-if="selectable"
          prop="action">
          <template #default="{ row }">
            <span v-if="treeSelection === 'leaf' && isTreeParent(row)">-</span>
            <el-button
              v-else-if="!includesRow(row)"
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
        </CompTableColumn>

        <!-- 默认插槽：消费者自定义列（<CompTableColumn>）与内置操作列并列渲染，避免与 #default 模板冲突 -->
        <slot name="default" />
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
  import type { UseSelectTreeOptions } from '@/hooks/useSelect'
  import type { CompSelectProps } from './types'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useSelect } from '@/hooks/useSelect'

  import CompCommonSearchItem from '@/components/CommonSearchItem/index.vue'
  import CompTable, { useCompTable } from '@/components/CompTable/index.vue'
  import CompDrawer from '@/components/Drawer/index.vue'
  import CompTableSearch from '@/components/TableSearch/index.vue'
  import { compSelectProps } from '.'

  defineOptions({ name: 'CompSelect' })

  const props = withDefaults(defineProps<CompSelectProps<T, R>>(), compSelectProps<T>())
  const emit = defineEmits<{
    change: [selected: R[]]
  }>()
  const show = defineModel<boolean>({
    default: false,
  })

  const slots = useSlots()
  /** 转发给 CompTable 的具名插槽名（default 通过 <slot name="default"> 直接渲染，避免与内置操作列冲突） */
  const forwardedSlots = computed(() => Object.keys(slots).filter(name => name !== 'default'))

  /** 列配置：消费方已声明操作列时复用其配置（单元格内容与内置按钮合并），否则追加内置操作列 */
  const localColumns = computed(() => {
    const consumerOptions = props.columns.table.options
    const hasAction = consumerOptions.some(col => col.prop === 'action')
    const tableOptions: TableColumn<R>[] =
      props.selectable && !hasAction
        ? [...consumerOptions, { prop: 'action', label: '操作', width: 100, fixed: 'right' }]
        : consumerOptions
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

  /**
   * 跨页已选数据
   * - 行主键比较统一由 useSelect 负责（支持动态主键），此处仅复用 useCheckAll 作为已选数据容器
   * - 表格不展示勾选列，因此无需回写行的 checked 状态
   */
  const checkAll = useCheckAll<T, Partial<R>>(props.keys)

  /**
   * 列表请求
   * - 仅在抽屉打开时启用，避免组件挂载即空跑一次请求
   * - 行数据直接使用接口原始对象：选择状态由 useSelect 的 Set 维护，无需给每行回写 checked
   */
  const { list, getList, resetList } = useListQuery<T, R>(
    computed(() => ({ ...props.query })),
    props.queryKey,
    props.apiFn,
    {
      enabled: computed(() => show.value),
    }
  )

  /** 树形子节点字段：优先取 columns.table.attr.treeProps.children */
  const treeChildrenField = computed(() => props.columns.table.attr?.treeProps?.children ?? 'children')

  /** 树形选择配置：透传给 useSelect 处理 leaf / cascade */
  const treeOptions = computed<UseSelectTreeOptions<Partial<R>>>(() => ({
    mode: props.treeSelection,
    childrenField: treeChildrenField.value,
    includeChildren: props.includeChildren
  }))

  /** 选择弹窗 hook：禁用行过滤、最大/最小数量校验、树形联动均在此处理 */
  const {
    isChecked,
    handleChecked,
    handleRemove,
    handleRemovePage,
    handleSelectedPage,
    handleSave,
    includesRow,
    isTreeParent,
    normalizeTreeSelected,
  } = useSelect<T, Partial<R>>(props, { emit }, checkAll, list, checkedKeys, undefined, treeOptions)

  /** 已选数量文案：maxLength = 0 表示不限数量，只展示已选数量 */
  const selectedText = computed(() =>
    props.maxLength > 0
      ? `${checkAll.selected.value.length} / ${props.maxLength}`
      : `${checkAll.selected.value.length}`
  )

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

  /** 打开抽屉：选择模式下回填父组件的已选数据；列表尚未加载过时触发首次查询 */
  const handleOpen = () => {
    if (props.selectable) checkAll.selected.value = props.selected.slice()
    if (!list.items.length) handleSearch()
  }

  /** 初始化 */
  watch(show, val => {
    if (val) handleOpen()
  })

  /**
   * 树形回显归一化：
   * - leaf：去掉已选中的父级
   * - cascade：用当前树补齐后代 / 父级
   * 需等列表加载完成后执行，每次打开只处理一次
   */
  const treeEchoed = ref(false)
  watch([show, () => list.items], ([visible]) => {
    if (!visible) {
      treeEchoed.value = false
      return
    }
    if (props.treeSelection === 'all' || treeEchoed.value || !list.items.length) return
    checkAll.selected.value = normalizeTreeSelected(checkAll.selected.value)
    treeEchoed.value = true
  })

  const { CompTableColumn } = useCompTable(computed(() => localColumns.value.table.options))
</script>
