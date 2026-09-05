```ts
import type { Ref } from 'vue'

import moment from 'moment'
import { isHaveValue } from '@/hooks/useValidate'

/**
 * 根据 cellRules 中 required 项自动渲染带红色星号的表头
 * @param cellRules 单元格校验规则对象（
 * @returns renderRequiredHeader 渲染函数、getCellRules 获取规则函数
 */
export const useTableForm = <T extends Record<string, any>>(cellRules: T) => {
  /** 获取指定字段的校验规则 */
  const getCellRules = (fieldName: keyof T) => {
    return cellRules[fieldName]
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

export function useFormatTable(row: string | number): string | number
export function useFormatTable(row: string | number, type: string, formatStr?: string): string | number
export function useFormatTable(row: string | number, type?: string, formatStr?: string) {
  if (!isHaveValue(row)) return '--'
  if (!type) return row

  const formatters: Record<string, (value: string | number, fmt?: string) => string | number> = {
    boolean: (row, fmt = '是:否') => {
      const [t, f] = fmt.split(':')
      return row == 0 ? f : t
    },
    date: (row, fmt = 'YYYY-MM-DD HH:mm:ss') => {
      const m = moment(row)
      return m.isValid() ? m.format(fmt) : '--'
    }
  }

  return formatters[type]?.(row, formatStr) ?? row
}

/**
 * 根据视口高度自动计算表格 max-height
 * @param targetRef el-table 组件 ref 或表格容器元素 ref
 * @param bottomOffset 底部预留高度兜底值（分页/按钮/间距），DOM 实测失败或分页器 v-show 隐藏时使用
 * @returns tableHeight 绑定到 el-table 的 max-height；refresh 手动重算（筛选展开/收起后调用）
 */
export const useTableHeight = (targetRef: Ref<object | null | undefined>, bottomOffset = 20 + 20 + 32) => {
  const MIN_TABLE_HEIGHT = 140

  const tableHeight = ref<number>()

  /** 解析 ref 对应的真实 DOM（组件实例取 $el） */
  const getEl = (): HTMLElement | undefined => {
    const instance = unref(targetRef)
    return (instance as any)?.$el ?? (instance as HTMLElement | undefined)
  }

  /**
   * 表格下方的流式布局占位：分页器等后续兄弟元素（高度 + 垂直 margin）+ 父容器底部 padding。
   */
  const calcFlowGap = (el: HTMLElement) => {
    let gap = 0
    const parent = el.parentElement
    if (parent) {
      let node: Element | null = el.nextElementSibling
      while (node) {
        const style = getComputedStyle(node)
        if (style.display !== 'none' && style.position !== 'fixed' && style.position !== 'absolute') {
          const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom)
          gap += (node as HTMLElement).offsetHeight + (Number.isNaN(margin) ? 0 : margin)
        }
        node = node.nextElementSibling
      }
      gap += parseFloat(getComputedStyle(parent).paddingBottom) || 0
    }
    return Math.max(gap, bottomOffset)
  }

  /**
   * 视口底部固定底栏（copyright 页脚）高度。
   * 表格自身位于抽屉/弹窗内时（.el-overlay 遮罩覆盖页脚）不计入；页面表格始终计入
   */
  const getFixedFooterHeight = (el: HTMLElement) => {
    if (el.closest('.el-overlay')) return 0
    const footer = document.querySelector('.copyright') as HTMLElement | null
    return footer && getComputedStyle(footer).display !== 'none' ? footer.offsetHeight : 0
  }

  const calcHeight = () => {
    const el = getEl()
    if (!el) return
    const { top } = el.getBoundingClientRect()
    tableHeight.value = Math.max(window.innerHeight - top - getFixedFooterHeight(el) - calcFlowGap(el), MIN_TABLE_HEIGHT)
  }

  const onResize = () => requestAnimationFrame(calcHeight)

  /**
   * 监听 ref 变化：表格在抽屉/弹窗中懒渲染（destroy-on-close）时，
   * el-table 会在容器打开后才挂载，ref 赋值后需重新计算高度
   */
  watch(
    targetRef,
    () => {
      requestAnimationFrame(calcHeight)
      observePagination()
    },
    { flush: 'post' }
  )

  /** 分页器随数据加载由 v-show 切换显隐，占位出现/消失后自动重算 */
  let resizeObserver: ResizeObserver | undefined
  const observePagination = () => {
    if (resizeObserver) return
    const pagination = getEl()?.parentElement?.querySelector('.pagination-container')
    if (!pagination) return
    resizeObserver = new ResizeObserver(() => requestAnimationFrame(calcHeight))
    resizeObserver.observe(pagination)
  }

  onMounted(() => {
    nextTick(() => {
      calcHeight()
      observePagination()
    })
    window.addEventListener('resize', onResize)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    resizeObserver?.disconnect()
  })

  return { tableHeight, refresh: calcHeight }
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
