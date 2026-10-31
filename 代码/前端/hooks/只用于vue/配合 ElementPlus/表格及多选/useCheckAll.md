```ts
/** 跨页选择行需要的最小字段 */
type SelectableRow = { checked?: boolean; disabled?: boolean }

/** 拆分复合主键：'id' / 'id-type' → ['id', 'type'] */
export const splitKeys = (keys: string) => keys.split('-').filter(Boolean)

/**
 * 行主键：按主键字段顺序序列化，保留类型（1 与 '1' 不相等）。
 * 用 JSON 而不是字符串拼接，字段值里含分隔符时也不会产生歧义。
 */
export const rowKeyOf = (row: object, fields: string[]) => JSON.stringify(fields.map(field => Reflect.get(row, field)))

/** 跨页选择-初始数据是否选中 */
export function isChecked<T extends object>(arr: T[], keys: string, item: T) {
  const fields = splitKeys(keys)
  const itemKey = rowKeyOf(item, fields)
  return arr.some(row => rowKeyOf(row, fields) === itemKey)
}

/** 跨页选择-获取指定字段值的数据 */
export function getArrayBySelectedList<T extends object>(arr: T[], keys: string, value: (ID | boolean)[], getKey: string): string[] {
  const fields = splitKeys(keys)
  const array: string[] = []
  arr.forEach(item => {
    if (fields.every(field => value.includes(Reflect.get(item, field) as any))) array.push(Reflect.get(item, getKey) as any)
  })
  return array
}

/** 跨页选择-插入数据（按主键去重，返回新数组，不修改入参） */
export function putSelectedList<T extends object>(arr: T[], putArr: T[], keys: string): T[] {
  const fields = splitKeys(keys)
  const merged = arr.slice()
  const existing = new Set(merged.map(row => rowKeyOf(row, fields)))
  putArr.forEach(row => {
    const key = rowKeyOf(row, fields)
    if (existing.has(key)) return
    existing.add(key)
    merged.push(row)
  })
  return merged
}

/** 跨页选择-删除数据（按主键过滤，返回新数组，不修改入参） */
export function deleteSelectedList<T extends object>(arr: T[], delArr: T[], keys: string): T[] {
  const fields = splitKeys(keys)
  const removed = new Set(delArr.map(row => rowKeyOf(row, fields)))
  return arr.filter(row => !removed.has(rowKeyOf(row, fields)))
}

/** 定义跨页选择参数 */
export function defineCheckAllProps<R = object>() {
  return {
    /** 跨页选择数据 */
    selected: {
      type: Array as PropType<R[]>,
      default: () => []
    },
    /** 跨页选择主key */
    keys: {
      type: String,
      default: ''
    }
  }
}
export interface DefineCheckAllProps<R = object> {
  /** 跨页选择数据 */
  selected?: R[]
  /** 跨页选择主key */
  keys?: string
}

/** 定义跨页选择emit */
export function defineCheckAllEmits() {
  return ['update:selected', 'getPageList']
}
export interface DefineCheckAllEmits<R = object> {
  'update:selected': [value: R[]]
  getPageList: []
}

/**
 * 跨页选择
 * @param id 唯一主键，复合主键用 '-' 连接（如 'id'、'id-type'）
 * @param list 数据列表（全选 / 取消全选需要）
 * @param props 组件 props（组件内使用时传入，选择结果通过 update:selected 交给父组件）
 * @param context 组件上下文（提供 emit）
 */
export function useCheckAll<Q, R extends object & SelectableRow>(
  id: string,
  list?: WritableComputedRef<List<Q, R>>,
  props?: DefineCheckAllProps<R>,
  context?: { emit: (event: any, ...args: any[]) => void }
) {
  /** 跨页选择主Key（支持运行时切换，如动态主键） */
  const keys = ref(id)

  /** 跨页选择数据：组件内为本地 ref；组件外由父组件 v-model:selected 提供 */
  const localSelected: Ref<R[]> = ref([])
  const selected: Ref<R[]> = props ? computed(() => props.selected ?? []) : localSelected

  /** 写入选择结果：组件内直接赋值，组件外通过 v-model 同步给父组件 */
  const commit = (rows: R[]) => {
    if (context) {
      context.emit('update:selected', rows)
      return
    }
    localSelected.value = rows
  }

  /** 初始化是否选中（选中集合按主键建 Set，避免逐行扫描已选列表） */
  const isCheckedItem = (items: R[]): R[] => {
    const fields = splitKeys(keys.value)
    const selectedKeys = new Set(selected.value.map(row => rowKeyOf(row, fields)))
    items.forEach(item => {
      item.checked = selectedKeys.has(rowKeyOf(item, fields))
    })
    return items
  }

  /** 是否全选（仅基于可勾选行判断，全部禁用或无数据时不算全选） */
  const isCheckAll = computed({
    get() {
      const checkable = (list?.value.items ?? []).filter(item => !item.disabled)
      return checkable.length > 0 && checkable.every(item => item.checked)
    },
    set(value: boolean) {
      handleCheckAll(value)
    }
  })

  /** 全选或取消全选（仅作用于当前页可勾选行） */
  const handleCheckAll = (value: boolean) => {
    if (!list) return
    const rows = list.value.items.filter(item => !item.disabled)
    rows.forEach(item => {
      item.checked = value
    })
    commit(value ? putSelectedList(selected.value, rows, keys.value) : deleteSelectedList(selected.value, rows, keys.value))
  }

  /** 行选择变化（row.checked 已由表格上的 v-model 先行更新） */
  const handleChecked = (row: R) => {
    commit(row.checked ? putSelectedList(selected.value, [row], keys.value) : deleteSelectedList(selected.value, [row], keys.value))
  }

  /** 取消所有：清空当前页勾选状态，并清空跨页选择 */
  const cannelSelected = () => {
    list?.value.items.forEach(item => {
      if (!item.disabled) item.checked = false
    })
    commit([])
  }

  /** 获取列表（保留给外部触发列表刷新） */
  const getPageList = () => {
    if (context) context.emit('getPageList')
  }

  return {
    /** 跨页选择主Key */
    keys,
    /** 跨页选择数据 */
    selected,
    /** 是否全选 */
    isCheckAll,
    /** 初始化是否选中 */
    isCheckedItem,
    /** 全选或取消全选 */
    handleCheckAll,
    /** 选择 */
    handleChecked,
    /** 取消所有 */
    cannelSelected,
    /** 获取列表 */
    getPageList
  }
}

```

