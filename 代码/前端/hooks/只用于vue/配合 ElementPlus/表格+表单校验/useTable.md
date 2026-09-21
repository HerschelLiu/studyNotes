### `useTableHeight有vueUse`

```ts
import type { Ref } from 'vue'

import { useResizeObserver } from '@vueuse/core'

import { useCalcHeight } from './useCalcHeight'

/**
 * 根据视口高度自动计算表格 max-height
 * @param targetRef el-table 组件 ref 或表格容器元素 ref
 * @param bottomOffset 底部预留高度兜底值（分页/按钮/间距），DOM 实测失败或分页器 v-show 隐藏时使用
 * @returns tableHeight 绑定到 el-table 的 max-height；refresh 手动重算（筛选展开/收起后调用）
 * .comp-table与分页器同级
 */
export const useTableHeight = (targetRef: Ref<object | null | undefined>, bottomOffset = 20 + 20 + 32) => {
  const MIN_TABLE_HEIGHT = 140

  const { height: tableHeight, refresh } = useCalcHeight(targetRef, {
    bottomOffset,
    minHeight: MIN_TABLE_HEIGHT,
    observeGap: true,
    containerSelector: '.comp-table'
  })

  /** 获取真实 DOM */
  const getEl = (): HTMLElement | undefined => {
    const instance = unref(targetRef)
    return (instance as any)?.$el ?? (instance as HTMLElement | undefined)
  }

  /**
   * 分页器随数据加载由 v-show 切换显隐，占位出现/消失后自动重算。
   */
  const paginationRef = computed<HTMLElement | null>(() => {
    const el = getEl()
    if (!el) return null
    const container = el.closest('.comp-table') || el.parentElement
    return (container?.parentElement?.querySelector('.pagination-container') as HTMLElement | null) ?? null
  })
  useResizeObserver(paginationRef, () => requestAnimationFrame(refresh))

  return { tableHeight, refresh }
}
```



### `useTableHeight无vueUse`
```ts
import type { Ref } from 'vue'

import { useCalcHeight } from './useCalcHeight'

/**
 * 根据视口高度自动计算表格 max-height
 * @param targetRef el-table 组件 ref 或表格容器元素 ref
 * @param bottomOffset 底部预留高度兜底值（分页/按钮/间距），DOM 实测失败或分页器 v-show 隐藏时使用
 * @returns tableHeight 绑定到 el-table 的 max-height；refresh 手动重算（筛选展开/收起后调用）
 * .comp-table与分页器同级
 */
export const useTableHeight = (targetRef: Ref<object | null | undefined>, bottomOffset = 20 + 20 + 32) => {
  const MIN_TABLE_HEIGHT = 140

  const { height: tableHeight, refresh } = useCalcHeight(targetRef, {
    bottomOffset,
    minHeight: MIN_TABLE_HEIGHT,
    observeGap: true,
    containerSelector: '.comp-table'
  })

  /** 获取真实 DOM */
  const getEl = (): HTMLElement | undefined => {
    const instance = unref(targetRef)
    return (instance as any)?.$el ?? (instance as HTMLElement | undefined)
  }

  /**
   * 分页器随数据加载由 v-show 切换显隐，占位出现/消失后自动重算。
   */
  let resizeObserver: ResizeObserver | undefined
  const observePagination = () => {
    if (resizeObserver) return
    const el = getEl()
    const container = el?.closest('.comp-table') || el?.parentElement
    const pagination = container?.parentElement?.querySelector('.pagination-container')
    if (!pagination) return
    resizeObserver = new ResizeObserver(() => requestAnimationFrame(refresh))
    resizeObserver.observe(pagination)
  }

  watch(
    targetRef,
    () => {
      observePagination()
    },
    { flush: 'post', immediate: true }
  )

  onMounted(() => {
    observePagination()
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return { tableHeight, refresh }
}

/**
 * 表格内嵌表单校验
 */
export const useTableForm = <T extends Record<string, any>>(cellRules: T) => {
  /** 获取指定字段的校验规则 */
  const getCellRules = (fieldName: keyof T) => {
    return cellRules[fieldName] ?? ''
  }

  /**
   * 渲染表头：根据该字段 rules 中是否存在 required: true 自动显示红色星号
   * @param label 列标题
   * @param fieldName 对应 cellRules 中的 key
   * @returns el-table-column 的 render-header 函数
   */
  const renderRequiredHeader = (label: string, fieldName: keyof T) => {
    return () => {
      const fieldRules = (cellRules[fieldName] as any[]) || []
      const isRequired = fieldRules.some((r: any) => r.required)
      return isRequired
        ? h('span', [
            h(
              'span',
              {
                style: {
                  color: 'var(--el-color-danger)',
                  marginRight: '4px'
                }
              },
              '*'
            ),
            label
          ])
        : h('span', label)
    }
  }

  return {
    /** 获取指定字段的校验规则 */
    getCellRules,
    /** 渲染带必填星号的表头 */
    renderRequiredHeader
  }
}

```

> `flush` 是 Vue `watch` / `watchEffect` 的回调**触发时机**选项，控制回调相对于组件 DOM 更新（重新渲染）在微任务队列中的执行顺序。它有三个值：
>
> | flush 值        | 回调执行时机               | 此时 DOM 状态                    |
> | :-------------- | :------------------------- | :------------------------------- |
> | `'pre'`（默认） | 组件重新渲染**之前**       | DOM 还是旧的（更新未应用）       |
> | `'post'`        | 组件重新渲染**之后**       | DOM 已更新完成，可读取真实布局   |
> | `'sync'`        | 依赖一变就**同步**立即执行 | 不确定，同一次更新中可能触发多次 |
>
> 这里 watch 的是 `useTempRefs('ELTable')` 返回的模板 ref，它的值变化发生在**组件挂载/补丁的过程中**（模板 ref 是在 DOM patch 阶段被赋值的）。
>
> 这也是 Vue 官方文档推荐的写法——**watch 模板 ref 等待子组件/元素挂载时，用 `{ flush: 'post' }`**（ref 赋值发生在渲染期间，只有 post 能确保拿到挂载后的状态）。
>
> 补充：普通页面里表格随页面一起挂载，走的是 `onMounted(() => nextTick(calcHeight))` 这条路径；`watch + post` 专门覆盖抽屉/弹窗 `destroy-on-close` 懒渲染、表格晚于宿主组件挂载的场景，两者互补。
