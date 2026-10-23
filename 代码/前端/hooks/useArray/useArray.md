### 基础

```ts
import { isHaveValue } from '@/hooks/useValidate'

type Callback = () => void

/** 删除对应索引 */
export function useRemoveArrayItem(array: any[], index: number, callback?: Callback) {
  array.splice(index, 1)
  if (typeof callback === 'function') callback()
}

/** 上移 */
export function usePrevArrayItem(array: any[], index: number, callback?: Callback) {
  const ele = array.splice(index, 1)
  array.splice(index - 1, 0, ele[0])
  if (typeof callback === 'function') callback()
}

/** 下移 */
export function useNextArrayItem(array: any[], index: number, callback?: Callback) {
  const ele = array.splice(index, 1)
  array.splice(index + 1, 0, ele[0])
  if (typeof callback === 'function') callback()
}

/** 新增 */
export function useCreateArrayItem(array: any[], index: number, item: any, callback?: Callback) {
  array.splice(index + 1, 0, typeof item === 'object' ? { ...item } : item)
  if (typeof callback === 'function') callback()
}

/** 字符串转数组，需要特定的,切割 */
export function useStringToArray(string: any): string[] {
  if (typeof string !== 'string') return []
  return string.split(',').filter(item => isHaveValue(item))
}

/** 递归删除数组中指定的属性值 */
export function useDeleteArrayKey(arr: any[], key: string) {
  arr.forEach(item => {
    if (item[key] && item[key].length) useDeleteArrayKey(item[key], key)
    else Reflect.deleteProperty(item, key)
  })
}

// 有值更新，无值增加
/**
 * 数组组 Set,约等于 Map.set
 * @param target 目标数组
 * @param key   唯一 key
 * @param value 设置值
 * @returns array
 */
export const useArraySet = <T extends Object>(target: T[], key: keyof T, value: T) => {
  let array = [...target]
  const index = array.findIndex(item => item[key] === value[key])
  if (index === -1) {
    array = [...array, value]
  } else {
    array.splice(index, 1, value)
  }
  return array
}

/**
 * 数组分组
 * @param array 目标数组
 * @param size 分组大小
 * @returns
 */
export const useChunk = <T extends []>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_v: number, i: number) => array.slice(i * size, i * size + size))
```



### 自己新增

```ts
 // 以下代码为js，还未ts化
 /** 多级对象数组展平 */
export const useFlat = (list, name = 'children') => {
  let arr = []
  list.forEach((item) => {
    arr = [...arr, item]
    if (item[name] && Array.isArray(item[name]))
      arr = [...arr, ...useFlat(item[name])]
  })

  return arr
}

type DeepestDataAndParent<T> = {
  item: T
  parent: T | null
  depth: number
}

/**
 * 获取多级数组每个元素最深层级数据及其父级数据
 * @param {Array<Object>} arr 数组
 * @param {Object} parent 最深层级数据的直属父级数据
 * @param {Number} depth 层级
 * @returns Array<{ item: Object;parent: Object | null;depth: Number; }>
 */
export const useDeepestDataAndParent = <T extends object>(
  arr: T[],
  parent: T | null = null,
  depth = 1,
  key = 'children'
): DeepestDataAndParent<T>[] => {
  let deepestItems: DeepestDataAndParent<T>[] = []
  for (let item of arr) {
    if (Reflect.has(item, key)) {
      const results = useDeepestDataAndParent(Reflect.get(item, key) as T[], item, depth + 1, key)
      if (results.length > 0) {
        deepestItems.push(...results)
      }
    } else {
      deepestItems.push({
        item,
        parent,
        depth
      })
    }
  }
  return deepestItems
}

/** 获取对应id的数据项 */
export function useFindNode<T extends object>(data: T[], id: string, idKey = 'id', key = 'children'): T | null {
  for (let i = 0; i < data.length; i++) {
    if (Reflect.get(data[i], idKey) === id) {
      return data[i]
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNode(Reflect.get(data[i], key) as T[], id, idKey, key)
      if (result) {
        return result
      }
    }
  }
  return null
}

/** 查找选项 */
interface SearchOptions {
  /** 是否启用模糊查询（字段值包含关键词即匹配），默认 true */
  fuzzy?: boolean
  /** 子节点字段名，默认 'children' */
  childrenKey?: string
  /** 是否忽略大小写，默认 true */
  ignoreCase?: boolean
}
/**
 * 递归查找树形数据中匹配的节点
 *
 * @param data 树形数据数组
 * @param keyword 要查找的值
 * @param fields 需要联合查找的字段（任一字段匹配即返回），支持单个字段名或字段名数组
 * @param options 查找选项
 * @returns 所有匹配的节点数组（保持原始结构，包含 children）
 */
export function useFindNodes<T extends object>(data: T[], keyword: string, fields: string | string[], options: SearchOptions = {}): T[] {
  const { fuzzy = true, childrenKey = 'children', ignoreCase = true } = options
  const fieldList = Array.isArray(fields) ? fields : [fields]

  /** 大小写归一化 */
  const normalize = (str: string): string => (ignoreCase ? str.toLowerCase() : str)
  const target = normalize(String(keyword))

  /** 判断节点是否匹配：任一字段包含关键词即匹配 */
  const isMatch = (item: T): boolean => {
    return fieldList.some(field => {
      const fieldValue = Reflect.get(item, field)
      if (fieldValue == null) return false
      const strValue = normalize(String(fieldValue))
      return fuzzy ? strValue.includes(target) : strValue === target
    })
  }

  /** 递归遍历收集所有匹配项 */
  const results: T[] = []
  const traverse = (nodes: T[]) => {
    nodes.forEach(item => {
      if (isMatch(item)) {
        results.push(item)
      }
      if (Reflect.has(item, childrenKey)) {
        const children = Reflect.get(item, childrenKey) as T[]
        if (children?.length) {
          traverse(children)
        }
      }
    })
  }

  traverse(data)
  return results
}

/**
 * 获取对象的最深层级数
 * @param obj 要计算深度的对象
 * @param key 子对象的键名，默认为 'children'
 * @returns 对象的最深层级
 */
export const useGetObjMaxDepth = <T extends object>(obj: T, key = 'children'): number => {
  if (!Reflect.has(obj, key)) {
    return 1
  }

  const children = Reflect.get(obj, key) as T[]
  if (!Array.isArray(children) || children.length === 0) {
    return 1
  }

  return 1 + Math.max(...children.map(child => useGetObjMaxDepth(child, key)))
}

/**
 * 截取树形数组到指定层级(根数组为1级)
 * @param {Array} arr 待处理的树形数组
 * @param {string} childrenKey 子节点的键名
 * @param {number} level 目标层级
 * @returns {Array} 处理后的树形数组
 */
export function useTruncateTreeToLevel(arr, childrenKey = 'children', level) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  // 获取数组的最大深度
  const maxDepth = useGetArrayMaxDepth(arr, childrenKey);
  // 如果目标层级大于等于最大深度，返回原数组
  if (level >= maxDepth || !level) {
    return arr;
  }

  // 递归截取函数
  const truncateNode = (node, currentDepth) => {
    // 复制节点对象，避免修改原数据
    const newNode = { ...node };

    // 如果当前深度已达到目标层级的下一个层级，移除children
    if (currentDepth === level) {
      if (childrenKey in newNode) {
        delete newNode[childrenKey];
      }
      return newNode;
    }

    // 处理子节点
    if (Array.isArray(node[childrenKey])) {
      newNode[childrenKey] = node[childrenKey].map((child) => truncateNode(child, currentDepth + 1));
    }

    return newNode;
  };

  // 从第一层开始处理数组中的每个节点
  return arr.map((node) => truncateNode(node, 1));
}

/**
 * 获取对象数组中最深层级数
 * @param arr 对象数组
 * @param key 子对象的键名，默认为 'children'
 * @returns 数组中最深层级
 */
export const useGetArrayMaxDepth = <T extends object>(arr: T[], key = 'children'): number => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0
  }

  return Math.max(...arr.map(item => useGetObjMaxDepth(item, key)))
}

/**
 * 返回目标节点的所有祖先节点数组
 * @returns { node: T | null; ancestors: T[] } node - 目标节点，ancestors - 所有祖先节点数组
 */
export function useFindNodeWithAncestors<T extends object>(
  data: T[],
  id: string,
  idKey = 'id',
  key = 'children',
  ancestors: T[] = []
): { node: T | null; ancestors: T[] } {
  for (let i = 0; i < data.length; i++) {
    const currentAncestors = [...ancestors, data[i]]
    if (Reflect.get(data[i], idKey) === id) {
      return { node: data[i], ancestors }
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNodeWithAncestors(Reflect.get(data[i], key) as T[], id, idKey, key, currentAncestors)
      if (result.node) {
        return result
      }
    }
  }
  return { node: null, ancestors: [] }
}

/** 判断两个数组中的值是否相等（不校验顺序）equality = true 校验顺序 */
export const useArraysEqual = (arr1, arr2, equality = false) => {
  if (equality) return JSON.stringify(arr1) === JSON.stringify(arr2)
  if (arr1.length !== arr2.length) return false
  const arr = []
  arr2.forEach(item => {
    const obj = arr1.find(it => JSON.stringify(it) === JSON.stringify(item))
    arr.push(!!obj)
  })

  return arr.every(item => item)
}

/** 数组排序 */
export function useSort<T extends Record<K, Key>, K extends keyof T>(originalArray: T[], fieldKey: K, sortOrder?: T[K][]): T[] {
  // 创建数组副本避免修改原数组
  const sortedArray = [...originalArray]

  // 当有自定义排序顺序时
  if (sortOrder && sortOrder.length) {
    const orderMap = new Map(sortOrder.map((value, index) => [value, index]))
    return sortedArray.sort((a, b) => {
      const aIndex = orderMap.get(a[fieldKey]) ?? Infinity
      const bIndex = orderMap.get(b[fieldKey]) ?? Infinity
      return aIndex - bIndex
    })
  }

  // 自然排序逻辑（数字优先 -> 字符串）
  return sortedArray.sort((a, b) => {
    const aVal = a[fieldKey]
    const bVal = b[fieldKey]

    // 处理数字类型比较
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal
    }

    // 处理混合类型和字符串类型比较
    return String(aVal).localeCompare(String(bVal), undefined, {
      numeric: true,
      sensitivity: 'variant'
    })
  })
}
```



### 递归设置统一树路径的名称

```ts
interface TreeNodeBase {
  [key: string]: any;
}

interface TreeNodeWithFullLabel<T extends TreeNodeBase> extends TreeNodeBase {
  fullLabel: string;
  [childrenKey: string]: TreeNodeWithFullLabel<T>[] | any; // 动态子节点字段
}

/**
 * 为树形结构节点添加 fullLabel 字段（单函数递归）
 * @param node 当前节点
 * @param parentFullLabel 父级路径（内部递归使用）
 * @param options 配置选项
 * @returns 添加 fullLabel 后的新节点
 */
function useAddFullLabel<T extends TreeNodeBase>(
  node: T,
  parentFullLabel: string = '',
  options: {
    labelKey: keyof T;
    childrenKey: keyof T;
    separator?: string;
  }
): TreeNodeWithFullLabel<T> {
  const { labelKey, childrenKey, separator = '/' } = options;
  
  // 1. 计算当前节点全路径
  const currentLabel = String(node[labelKey]);
  const fullLabel = parentFullLabel 
    ? `${parentFullLabel}${separator}${currentLabel}`
    : currentLabel;

  // 2. 创建新节点（保留原始属性）
  const newNode: any = {
    ...node,
    fullLabel
  };

  // 3. 递归处理子节点
  const children = node[childrenKey];
  if (Array.isArray(children)) {
    newNode[childrenKey] = children.map(child => 
      useAddFullLabel(child, fullLabel, options)  // 关键：递归调用同一函数
    );
  }

  return newNode as TreeNodeWithFullLabel<T>;
}
```

使用方式

```ts

areaList.value = res.data.map(item =>
    addFullLabel(item, '', {
      labelKey: 'areaName',
      childrenKey: 'areaList'
    })
  )
```



### 按 key 去重合并数组（编辑/生成场景）

```ts
import type { MaybeRefOrGetter } from 'vue'

import { toValue } from 'vue'

/**
 * 按 key 去重合并数组（编辑/生成场景）
 * - 原数组中仍存在于新增数组的项保留（kept，已编辑的内容不丢失）
 * - 新增数组中新出现的项追加（added）
 * - 原数组中不存在于新增数组的项移除
 *
 * @param original  原数组（数组 / ref / reactive / getter）
 * @param incoming  新增数组（数组 / ref / reactive / getter）
 * @param keys      去重依据，支持三种形式：
 *                  - 单字段：'id'
 *                  - 多字段组合：['salaryYear', 'salaryPeriod']
 *                  - 对比函数：(item) => `${item.salaryYear}-${item.salaryPeriod}`
 * @param delimiter 多字段组合 key 的分隔符，默认 SOH 控制字符（避免值拼接碰撞）
 * @returns 组合后的数组 [...kept, ...added]
 */
export const useMergeArrayByKey = <T extends Record<string, any>>(
  original: MaybeRefOrGetter<T[]>,
  incoming: MaybeRefOrGetter<T[]>,
  keys: keyof T | (keyof T)[] | ((item: T) => string | number),
  delimiter: string = String.fromCharCode(1)
): T[] => {
  const keyOf = typeof keys === 'function' ? keys : (item: T) => (Array.isArray(keys) ? keys : [keys]).map(k => String(item[k] ?? '')).join(delimiter)

  const originalArr = toValue(original)
  const incomingArr = toValue(incoming)

  const incomingKeys = new Set(incomingArr.map(keyOf))
  const existingKeys = new Set(originalArr.map(keyOf))

  return [...originalArr.filter(item => incomingKeys.has(keyOf(item))), ...incomingArr.filter(item => !existingKeys.has(keyOf(item)))]
}
```

使用

```ts
// 方式1
const handleGenerateChange = (arr: RequestUpdateHrSalaryPeriodDetailList[]) => {
    form.detailList = useMergeArrayByKey(form.detailList, arr, ['salaryYear', 'salaryPeriod'])
  }

// 方式2
const createAccess = (item: ResponseListAuxAcctInfo): DetailRow => ({
  id: '',
  itemCode: item.code,
  itemName: item.name,
  pkEntityId: item.id,
  isBalanceControl: YesOrNo.否,
  isUmprint: YesOrNo.否,
  isEmpty: YesOrNo.否,
  isNonleafUsed: YesOrNo.否,
  createBy: '',
  updateBy: ''
})

const handleSelectAuxAcctInfoChange = (arr: ResponseListAuxAcctInfo[]) => {
  list.value = useMergeArrayByKey(list.value, arr.map(createAccess), 'pkEntityId')
}
```



### 为树增加若干属性

```ts
/**
 *  为树增加若干属性
 *
 * @param tree   原始树数组
 * @param mapper 转换函数，接收当前节点，返回要合并到节点上的额外字段
 * @param children  子节点名
 * @returns 转换后的新树
 */
export const useMapTree = <T extends Record<string, any>>(tree: T[], mapper: (node: T) => Record<string, any>, children = 'children'): T[] => {
  return tree.map(node => {
    const childrenArr = Array.isArray(node[children]) ? { [children]: useMapTree(node[children], mapper, children) } : {}
    return { ...node, ...mapper(node), ...childrenArr }
  })
}
```



#### 使用

```ts
// 为每个节点增加 level / expanded
useMapTree(tree, () => ({ level: 0, expanded: true }))

// 基于节点值计算
useMapTree(tree, node => ({ hasChildren: node.children?.length > 0 }))

// 自定义 children key
useMapTree(tree, node => ({ checked: false }), 'subNodes')
```



### 层级异字段归一树

```ts
/** 每层字段名配置 */
export interface TreeLevelConfig {
  /** 原节点中充当 id 的字段名 */
  idField: string
  /** 原节点中充当 name 的字段名 */
  nameField: string
  /** 原节点中子节点数组的字段名，默认 'children' */
  childrenField?: string
}

/** treeId 生成策略 */
export type TreeIdStrategy =
  /** 全局顺序编号 '1', '2', ... */
  | 'sequential'
  /** 层级+原id 组合：`${depth}-${node[idField]}` */
  | 'levelId'
  /** 自定义生成器 */
  | ((ctx: { node: any; depth: number; index: number; parent?: any; originalId: string | number | undefined }) => string)

/**
 * 归一化后的节点
 */
export interface NormalizedTreeNode<T> {
  [key: string]: any
  /** 原始节点引用，keepRaw=false 时不存在 */
  raw?: T
}

/** useTreeNormalize 选项 */
export interface UseTreeNormalizeOptions {
  /**
   * 每层配置数组 或 动态函数
   *
   * 数组模式下的匹配规则由 matchMode 决定：
   * - 'depth' ：levels中下标对应层级
   * - 'auto'  ：levels不对应层级，存在就有用
   *
   * 函数形式：(node, depth) => LevelConfig | null（返回 null 视为叶子，不再下探）
   */
  levels: TreeLevelConfig[] | ((node: any, depth: number) => TreeLevelConfig | null | undefined)
  matchMode?: 'depth' | 'auto'
  /** treeId 生成策略，默认 'levelId' */
  treeIdStrategy?: TreeIdStrategy
  /** 是否保留 raw 原始节点引用，默认 true */
  keepRaw?: boolean
  /** 输出中 id 字段名，默认 'treeId' */
  outputIdField?: string
  /** 输出中 name 字段名，默认 'treeName' */
  outputNameField?: string
  /** 输出中子节点数组的字段名，默认 'children' */
  outputChildrenField?: string
}

export const useTreeNormalize = <T extends Record<string, any>>(
  input: T[] | undefined | null,
  options: UseTreeNormalizeOptions
): NormalizedTreeNode<T>[] => {
  if (!Array.isArray(input) || !input.length) return []

  const {
    levels,
    matchMode = 'auto',
    treeIdStrategy = 'levelId',
    keepRaw = true,
    outputIdField = 'treeId',
    outputNameField = 'treeName',
    outputChildrenField = 'children'
  } = options

  let sequentialCounter = 0

  const resolveLevel = (node: any, depth: number): TreeLevelConfig | null | undefined => {
    if (typeof levels === 'function') return levels(node, depth)
    if (matchMode === 'auto') {
      return levels.find(cfg => [cfg.idField, cfg.nameField, cfg.childrenField].some(field => !!field && Reflect.has(node, field)))
    }
    return levels[depth] ?? levels[levels.length - 1]
  }

  const genTreeId = (node: any, depth: number, index: number, parent: any | undefined, originalId: string | number | undefined): string => {
    if (treeIdStrategy === 'sequential') return String(++sequentialCounter)
    if (treeIdStrategy === 'levelId') return `${depth}-${String(originalId ?? index)}`
    return treeIdStrategy({ node, depth, index, parent, originalId })
  }

  const walk = (nodes: T[], depth: number, parent: any | undefined): NormalizedTreeNode<T>[] =>
    nodes.map((node, index) => {
      const level = resolveLevel(node, depth)
      const childrenField = level?.childrenField ?? 'children'

      const originalId = level?.idField ? (Reflect.get(node, level.idField) as string | number | undefined) : undefined
      const treeId = genTreeId(node, depth, index, parent, originalId)

      const treeName = level?.nameField ? String(Reflect.get(node, level.nameField) ?? '') : ''

      // 是否下探：节点上存在 childrenField 字段 且 值为非空数组 → 否则视为叶子
      let children: NormalizedTreeNode<T>[] | undefined
      if (Reflect.has(node, childrenField)) {
        const rawChildren = Reflect.get(node, childrenField)
        if (Array.isArray(rawChildren) && rawChildren.length) {
          children = walk(rawChildren as T[], depth + 1, node)
        }
      }

      const out = {
        [outputIdField]: treeId,
        [outputNameField]: treeName,
        ...(keepRaw ? { raw: node as T } : null),
        ...(children?.length ? { [outputChildrenField]: children } : null)
      } as NormalizedTreeNode<T>
      return out
    })

  return walk(input, 0, undefined)
}
```



### 获取对应 id 的数据项及其父级信息

```ts
// #region 获取对应 id 的数据项及其父级信息
export interface FindNodeWithParentResult<T> {
  /** 命中的节点 */
  node: T
  /** 命中节点的父级，根级命中时为 undefined */
  parent: T | undefined
  /** 命中节点在其所在层级数组中的索引 */
  index: number
  /** 从根到命中节点的索引链 */
  path: number[]
}

/**
 * 获取对应 id 的数据项及其父级信息
 *
 * @param data
 * @param matcher 匹配依据）
 * @param idKey   id 字段名，支持点号路径（如 'raw.accountingPeriodId'），matcher 为函数时忽略
 * @param childrenKey     子节点数组字段名，默认 'children'
 * @returns 命中返回 { node, parent, index, path }；未命中返回 null
 */
export function useFindNodeWithParent<T extends object>(
  data: T[],
  matcher: string | number | ((node: T) => boolean),
  idKey = 'id',
  childrenKey = 'children'
): FindNodeWithParentResult<T> | null {
  /** 按点号路径逐层取值 */
  const resolveId = (node: any): any => idKey.split('.').reduce<any>((acc, k) => (acc == null ? acc : Reflect.get(acc, k)), node)

  const match = typeof matcher === 'function' ? matcher : (node: T) => resolveId(node) === matcher

  const find = (nodes: T[], parent: T | undefined, parentPath: number[]): FindNodeWithParentResult<T> | null => {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (match(node)) return { node, parent, index, path: [...parentPath, index] }

      const children = Reflect.get(node, childrenKey)
      if (Array.isArray(children)) {
        const result = find(children as T[], node, [...parentPath, index])
        if (result) return result
      }
    }
    return null
  }

  return find(data, undefined, [])
}
// #endregion

```

> `const resolveId = (node: any): any => idKey.split('.').reduce<any>((acc, k) => (acc == null ? acc : Reflect.get(acc, k)), node)`**把 `idKey` 当成一条属性路径，从 `node` 上顺着走下去取到最终的值**。它等价于一个手写的 `node?.raw?.accountingPeriodId`。
>
> 1. **`idKey.split('.')`** 把字符串按点号切成路径数组：`['raw', 'accountingPeriodId']`
>
> 2. **`reduce<any>(回调, node)`** `reduce` 的第二个参数 `node` 是**初始累加值**（所以 `acc` 第一次进来就是 `node` 本身，不是 `node.raw`）。
>
> 3. **回调 `(acc, k) => (acc == null ? acc : Reflect.get(acc, k))`** 对路径上每一段 `k` 做一次取值，逐层推进：
>
>    | 轮次 | `k`                    | 进入时 `acc` | 返回                          |
>    | ---- | ---------------------- | ------------ | ----------------------------- |
>    | 1    | `'raw'`                | `node`       | `node.raw`                    |
>    | 2    | `'accountingPeriodId'` | `node.raw`   | `node.raw.accountingPeriodId` |
>
> 4. **`acc == null ? acc : ...` 这个短路防止中途断链报错：
>
>    - `== null` 是故意用非严格相等，**同时命中 `null` 和 `undefined`**（只判 `=== null` 会漏掉 `undefined`）；
>    - 一旦某一层是 `null/undefined`，直接原样返回，后续轮次继续返回它，最后得到 `undefined` —— 相当于可选链 `?.` 的效果，而不是抛 `Cannot read properties of undefined`。



### 笛卡尔积

```ts
// #region 笛卡尔积
/** 具名维度：name 为输出字段名，data 为该字段的候选值 */
export interface CartesianField<V = any> {
  name: string
  data: V[]
}

export type CartesianRow = Record<string, any>

/** 行工厂：形参按维度顺序对应各维度当前项，返回值即输出数组的每一项（返回数组时展开） */
export type CartesianRowFactory<Row = CartesianRow> = (...items: any[]) => Row | Row[]

/** 维度取值器：接收上一维度当前项，返回本维度数组（用于数组嵌套场景） */
export type CartesianResolver = (prevItem: any) => any[] | undefined

/** 单个维度：值数组 / 具名维度 / 取值器 */
export type CartesianDimension = any[] | CartesianField | CartesianResolver

const isCartesianField = (dim: CartesianDimension): dim is CartesianField =>
  !!dim && !Array.isArray(dim) && typeof dim === 'object' && typeof dim.name === 'string' && Array.isArray(dim.data)

/**
 * 通用笛卡尔积
 * @param dimensions 纬度列表: [['红色', '黑色'], ['16G', '32G'], ['移动版', '联通版']]/[arr1, (item) => []]
 * 
 */
export const useCartesianArray = <Row = CartesianRow>(
  dimensions: CartesianDimension[],
  newRow?: CartesianRowFactory<Row>,
  base?: CartesianRow
): Row[] => {
  if (!dimensions?.length) return []

  const combos = dimensions.reduce<{ items: any[]; prev?: any }[]>(
    (rows, dim) =>
      rows.flatMap(({ items, prev }) => {
        const data = typeof dim === 'function' ? dim(prev) : isCartesianField(dim) ? dim.data : dim
        
        return (data ?? []).map(value => ({ items: [...items, value], prev: value }))
      }),
    [{ items: [] }]
  )

  const hasBase = !!base && Object.keys(base).length > 0
  const isTuple = !newRow && !hasBase && !dimensions.some(isCartesianField)

  return combos.flatMap(({ items }): any => {
    if (newRow) {
      const result = newRow(...items)
      return (Array.isArray(result) ? result : [result]).map(row =>
        hasBase && row && typeof row === 'object' && !Array.isArray(row) ? { ...base, ...(row as CartesianRow) } : row
      )
    }

    if (isTuple) return [items]

    const row: CartesianRow = { ...base }
    dimensions.forEach((dim, index) => {
      const value = items[index]
      if (isCartesianField(dim)) row[dim.name] = value
      else if (value && typeof value === 'object') Object.assign(row, value)
    })
    return [row]
  }) as Row[]
}
// #endregion
```



```ts
/**
 *
 // ① 模板模式：基本类型也能用（值作为参数传给 newRow）
useCartesianArray([['红', '黑']], color => ({ 颜色: color, mainId: 1 }))
// => [{ 颜色:'红', mainId:1 }, { 颜色:'黑', mainId:1 }]

// ② 合并模式：对象数组，字段自动合并
useCartesianArray([[{ a: 1 }, { a: 2 }], [{ b: 'x' }]])
// => [{ a:1, b:'x' }, { a:2, b:'x' }]

// ③ 合并模式：具名维度，值写到指定字段
useCartesianArray([{ name: '颜色', data: ['红', '黑'] }])
// => [{ 颜色:'红' }, { 颜色:'黑' }]
*/
```

> * `is` 的作用：运行时判断 + 编译时收窄：**编译时**：当这个函数返回 `true` 时，TypeScript 会把参数 `dim` 的类型从 `CartesianDimension` **收窄**为 `CartesianField`。（只是**声明**“返回 true 时类型是什么）
>
> * `as` 的作用：纯编译时的类型断言
>
> `is` 是“**我检查了，返回 true 就说明是**”，`as` 是“**我保证它是，别检查了**”

>  combos = dimensions.reduce说明
>
> ```ts
> const dimensions = [
>   ['红', '黑'],                                    // 维度 0：值数组
>   color => (color === '红' ? ['S', 'L'] : ['M']),  // 维度 1：取值器
> ]
> ```
>
> 初始累积器：`partials = [[]]`（只有一条空组合）。
>
> 第 1 轮：`dim = ['红','黑']`
>
> | #    | `values`（输入组合） | `values.at(-1)` | `resolveDimension(dim, prev)` 返回值  | `.map(value => [...values, value])` |
> | ---- | -------------------- | --------------- | ------------------------------------- | ----------------------------------- |
> | 1    | `[]`                 | `undefined`     | `['红','黑']`（数组维度直接返回自身） | `[['红'], ['黑']]`                  |
>
> `flatMap` 把每条的 `.map` 结果拼起来 → `partials = [['红'], ['黑']]`
>
> 第 2 轮：`dim = color => ...`（取值器）
>
> | #    | `values`（输入组合） | `values.at(-1)` | `resolveDimension(dim, prev)` 返回值           | `.map(value => [...values, value])` |
> | ---- | -------------------- | --------------- | ---------------------------------------------- | ----------------------------------- |
> | 1    | `['红']`             | `'红'`          | `['S','L']`（`dim('红')`，`'红'==='红'` 成立） | `[['红','S'], ['红','L']]`          |
> | 2    | `['黑']`             | `'黑'`          | `['M']`（`dim('黑')`，走 else 分支）           | `[['黑','M']]`                      |
>
> `flatMap` 拼接两行结果 → `partials = [['红','S'], ['红','L'], ['黑','M']]`
>
> 最终结果
>
> ```ts
> tuples = [['红','S'], ['红','L'], ['黑','M']]
> ```



### 数组去重



```ts
// #region 数组去重
// 通用代码
export function uniqueByKey<T extends object, K extends keyof T, R = T>(rows: readonly T[], key: K, template?: (item: T) => R): R[] {
  const seen = new Set<unknown>()
  const result: R[] = []
  const toItem = template ?? ((item: T) => item as unknown as R)

  for (const row of rows) {
    const id = row[key]
    if (seen.has(id)) continue // 该字段值已出现过
    seen.add(id)
    result.push(toItem(row)) // 保留第一条
  }

  return result
}

// vue3使用
export function useUniqueByKey<T extends object, K extends keyof T, R = T>(
  rows: MaybeRefOrGetter<readonly T[]>,
  key: MaybeRefOrGetter<K>,
  template?: (item: T) => R
) {
  return uniqueByKey(toValue(rows), toValue(key), template)
}
// #endregion
```


