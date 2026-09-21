**rAF** 是 **`requestAnimationFrame`** 的缩写，它是浏览器提供的一个原生 API，用于在**下一次浏览器重绘之前**执行你指定的回调函数。

简单说，rAF 就是告诉浏览器：“我要执行一段动画逻辑，请你在**下一帧渲染前**调用我这个函数。”

### **vueUse**

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import { useRafFn, useResizeObserver, useWindowSize } from '@vueuse/core'

/** CSS 长度值类型：数字（按 px）或字符串（'200px' / '30vh' / '50%' / '2rem'） */
export type CSSLength = number | string

export interface ViewportHeightOptions {
  /** 底部兜底间隙：DOM 测不到下方兄弟时使用，或作为额外预留 */
  bottomOffset?: number
  /** 最小高度，支持 px/vh/%/rem，calc 时按当前视口换算 */
  minHeight?: CSSLength
  /** 是否计算； */
  enabled?: MaybeRefOrGetter<boolean>
  /** 页脚选择器，默认 '.footer' */
  footerSelector?: string
  /** overlay 内是否跳过页脚，默认 true（抽屉/弹窗覆盖页脚时 footer 不计入） */
  skipFooterInOverlay?: boolean
  /** 是否累加下方兄弟元素间隙，默认 true（表格需要，纯容器可设 false） */
  observeGap?: boolean
  /** 父级选择器 */
  containerSelector?: string
}

/** 将 CSS 长度值转为像素数（calc 时调用，vh/% 随视口变化；em 不支持，因无父元素上下文） */
const toPx = (value: CSSLength | undefined): number => {
  if (value == null) return 0
  if (typeof value === 'number') return value
  const match = /^(-?\d+(?:\.\d+)?)\s*(px|vh|rem|%)?$/.exec(value.trim())
  if (!match) return 0
  const num = parseFloat(match[1])
  const unit = match[2] || 'px'
  switch (unit) {
    case 'vh':
    case '%':
      return (num * window.innerHeight) / 100
    case 'rem':
      return num * parseFloat(getComputedStyle(document.documentElement).fontSize)
    default:
      return num
  }
}

/**
 * 从 targetRef 元素顶部到视口底部的剩余高度
 * @param targetRef 目标元素 ref（组件实例或 HTMLElement）
 * @param options 配置项
 * @returns height 绑定到元素 max-height；refresh 手动重算
 */
export const useCalcHeight = <T extends HTMLElement | object | null | undefined>(targetRef: Ref<T>, options: ViewportHeightOptions = {}) => {
  const {
    bottomOffset = 0,
    minHeight = 0,
    enabled = true,
    footerSelector = '.footer',
    skipFooterInOverlay = true,
    observeGap = true,
    containerSelector = '.comp-table'
  } = options

  const height = ref<number>()

  /** 解析 ref 对应的真实 DOM（组件实例取 $el） */
  const getEl = (): HTMLElement | undefined => {
    const instance = unref(targetRef)
    return (instance as any)?.$el ?? (instance as HTMLElement | undefined)
  }

  /** 累加容器下方兄弟元素高度 + 父容器 paddingBottom */
  const calcFlowGap = (el: HTMLElement) => {
    if (!observeGap) return bottomOffset
    let gap = 0
    const container = el.closest(containerSelector) || el.parentElement
    if (container) {
      let node: Element | null = container.nextElementSibling
      while (node) {
        const style = getComputedStyle(node)
        if (style.display !== 'none' && style.position !== 'fixed' && style.position !== 'absolute') {
          const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom)
          gap += (node as HTMLElement).offsetHeight + (Number.isNaN(margin) ? 0 : margin)
        }
        node = node.nextElementSibling
      }
      const parentPadding = container.parentElement ? parseFloat(getComputedStyle(container.parentElement).paddingBottom) || 0 : 0
      gap += parentPadding
    }
    return Math.max(gap, bottomOffset)
  }

  /**
   * 视口底部固定底栏（footer 页脚）高度。
   * 元素位于抽屉/弹窗内时（.el-overlay 遮罩覆盖页脚）不计入
   */
  const getFixedFooterHeight = (el: HTMLElement) => {
    if (skipFooterInOverlay && el.closest('.el-overlay')) return 0
    const footer = document.querySelector(footerSelector) as HTMLElement | null
    return footer && getComputedStyle(footer).display !== 'none' ? footer.offsetHeight : 0
  }

  /** 视口尺寸：内部自动监听 resize 并在卸载时清理 */
  const { height: winHeight } = useWindowSize()

  /**
   * 计算剩余高度
   * @returns 元素已布局且计算完成返回 true；未挂载/未布局返回 false，调度器会重试
   */
  const calcHeight = (): boolean => {
    if (!toValue(enabled)) return false
    const el = getEl()
    if (!el) return false
    const rect = el.getBoundingClientRect()
    if (rect.top === 0 && rect.height === 0) return false
    height.value = Math.max(winHeight.value - rect.top - getFixedFooterHeight(el) - calcFlowGap(el), toPx(minHeight))
    return true
  }

  /**
   * useRafFn 回调返回 false 即终止循环
   */
  const MAX_RETRIES = 10
  let retries = 0
  const raf = useRafFn(
    () => {
      // 元素未布局时逐帧重试
      if (calcHeight() || ++retries >= MAX_RETRIES) {
        retries = 0
        return false
      }
    },
    { immediate: false }
  )
  /** 延迟到下一帧执行高度计算 */
  const scheduleCalc = raf.resume

  /** ref 绑定/解绑（v-if 重挂）：post  flush 确保 DOM 已更新 */
  watch(targetRef, scheduleCalc, { flush: 'post', immediate: true })

  /** enabled 切换为 true 时重算（抽屉打开/页面激活） */
  watch(
    () => toValue(enabled),
    v => {
      if (v) scheduleCalc()
    }
  )

  /** 视口高度变化（useWindowSize 已含 resize 监听） */
  watch(winHeight, scheduleCalc)

  /**
   * 监听元素自身及父容器尺寸：
   * 搜索区展开/收起、分页器显隐、字体/图片加载等引起的 top 变化自动重算
   */
  const elRef = computed(() => getEl() ?? null)
  useResizeObserver(elRef, scheduleCalc)
  useResizeObserver(
    computed(() => elRef.value?.parentElement ?? null),
    scheduleCalc
  )

  onActivated(scheduleCalc)

  return { height, refresh: calcHeight }
}

```

> **为什么不能直接调`calcHeight()`**
>
> `calcHeight()` 内部要读`el.getBoundingClientRect().top` ，这个值只有在浏览器完成布局后才准确。而当前代码里的几个触发源，触发时 DOM 都还没布局完：
>
> | 触发源                                   | 触发时的 DOM 状态                                            |
> | ---------------------------------------- | ------------------------------------------------------------ |
> | watch(targetRef, ..., { flush: 'post' }) | v-if 刚把元素挂上去，ref 有值了，但元素自身尺寸/位置可能还没完成 layout |
> | `watch(enabled)` 抽屉打开                | el-drawer 的打开动画刚开始，`rect.top` 还在变化              |
> | `watch(winHeight)` resize                | 上一帧布局已失效，新布局未生成                               |
> | `useResizeObserver` 回调                 | 观察到尺寸变化的瞬间， 同一帧内 读取兄弟元素可能拿到旧值     |
> | `onActivated` keep-alive 切回            | DOM 刚从缓存恢复，布局待重算                                 |
>
> **为什么用`useRafFn` 而不是直接`requestAnimationFrame(calcHeight)`**
>
> 1. 自动重试（最关键）
>
> v-if 异步组件（比如 vue-office-excel）挂载时，第一帧元素可能仍未布局（`rect.top === 0 && rect.height === 0` ），`calcHeight()` 返回 false。此时不是放弃，而是下一帧继续重试，最多 10 帧：
>
> 2. 多源触发不叠加
>
> 同一个 tick 内 ResizeObserver、watch、onActivated 可能连续触发多次。直接`requestAnimationFrame` 会排多个回调。`raf.resume()` 在循环运行中是 no-op，保证 一帧最多一次计算 。
>
> 3. 自动清理
>
> 组件卸载时 VueUse 自动 cancelAnimationFrame，不用手写 onBeforeUnmount。



### **无vueUse**

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'

/** CSS 长度值类型：数字（按 px）或字符串（'200px' / '30vh' / '50%' / '2rem'） */
export type CSSLength = number | string

export interface ViewportHeightOptions {
  /** 底部兜底间隙：DOM 测不到下方兄弟时使用，或作为额外预留 */
  bottomOffset?: number
  /** 最小高度，支持 px/vh/%/rem，calc 时按当前视口换算 */
  minHeight?: CSSLength
  /** 是否计算； */
  enabled?: MaybeRefOrGetter<boolean>
  /** 页脚选择器，默认 '.footer' */
  footerSelector?: string
  /** overlay 内是否跳过页脚，默认 true（抽屉/弹窗覆盖页脚时 footer 不计入） */
  skipFooterInOverlay?: boolean
  /** 是否累加下方兄弟元素间隙，默认 true（表格需要，纯容器可设 false） */
  observeGap?: boolean
  /** 父级选择器 */
  containerSelector?: string
}

/** 将 CSS 长度值转为像素数（calc 时调用，vh/% 随视口变化；em 不支持，因无父元素上下文） */
const toPx = (value: CSSLength | undefined): number => {
  if (value == null) return 0
  if (typeof value === 'number') return value
  const match = /^(-?\d+(?:\.\d+)?)\s*(px|vh|rem|%)?$/.exec(value.trim())
  if (!match) return 0
  const num = parseFloat(match[1])
  const unit = match[2] || 'px'
  switch (unit) {
    case 'vh':
    case '%':
      return (num * window.innerHeight) / 100
    case 'rem':
      return num * parseFloat(getComputedStyle(document.documentElement).fontSize)
    default:
      return num
  }
}

/**
 * 从 targetRef 元素顶部到视口底部的剩余高度
 * @param targetRef 目标元素 ref（组件实例或 HTMLElement）
 * @param options 配置项
 * @returns height 绑定到元素 max-height；refresh 手动重算
 */
export const useCalcHeight = <T extends HTMLElement | object | null | undefined>(
  targetRef: Ref<T>,
  options: ViewportHeightOptions = {}
) => {
  const {
    bottomOffset = 0,
    minHeight = 0,
    enabled = true,
    footerSelector = '.footer',
    skipFooterInOverlay = true,
    observeGap = true,
    containerSelector = '.comp-table'
  } = options

  const height = ref<number>()

  /** 解析 ref 对应的真实 DOM（组件实例取 $el） */
  const getEl = (): HTMLElement | undefined => {
    const instance = unref(targetRef)
    return (instance as any)?.$el ?? (instance as HTMLElement | undefined)
  }

  /** 累加容器下方兄弟元素高度 + 父容器 paddingBottom */
  const calcFlowGap = (el: HTMLElement) => {
    if (!observeGap) return bottomOffset
    let gap = 0
    const container = el.closest(containerSelector) || el.parentElement
    if (container) {
      let node: Element | null = container.nextElementSibling
      while (node) {
        const style = getComputedStyle(node)
        if (style.display !== 'none' && style.position !== 'fixed' && style.position !== 'absolute') {
          const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom)
          gap += (node as HTMLElement).offsetHeight + (Number.isNaN(margin) ? 0 : margin)
        }
        node = node.nextElementSibling
      }
      const containerParent = container.parentElement
      if (containerParent) {
        gap += parseFloat(getComputedStyle(containerParent).paddingBottom) || 0
      }
    }
    return Math.max(gap, bottomOffset)
  }

  /**
   * 视口底部固定底栏（footer 页脚）高度。
   * 元素位于抽屉/弹窗内时（.el-overlay 遮罩覆盖页脚）不计入
   */
  const getFixedFooterHeight = (el: HTMLElement) => {
    if (skipFooterInOverlay && el.closest('.el-overlay')) return 0
    const footer = document.querySelector(footerSelector) as HTMLElement | null
    return footer && getComputedStyle(footer).display !== 'none' ? footer.offsetHeight : 0
  }

  /**
   * 计算剩余高度
   */
  const calcHeight = (): boolean => {
    if (!toValue(enabled)) return false
    const el = getEl()
    if (!el) return false
    const rect = el.getBoundingClientRect()
    // 防御：元素已从 DOM 分离或尚未布局，跳过本次等待重试
    if (rect.top === 0 && rect.height === 0) return false
    height.value = Math.max(window.innerHeight - rect.top - getFixedFooterHeight(el) - calcFlowGap(el), toPx(minHeight))
    return true
  }

  let calcTimer: ReturnType<typeof setTimeout> | undefined
  const scheduleCalc = () => {
    if (calcTimer) clearTimeout(calcTimer)
    requestAnimationFrame(() => {
      if (calcHeight()) {
        requestAnimationFrame(calcHeight)
      } else {
        requestAnimationFrame(() => {
          if (calcHeight()) requestAnimationFrame(calcHeight)
        })
      }
      // HMR 后额外兜底
      calcTimer = setTimeout(calcHeight, 200)
    })
  }

  const onResize = () => requestAnimationFrame(calcHeight)

  // 必须在 watch(immediate: true) 之前定义，否则 TDZ
  watch(
    targetRef,
    () => {
      scheduleCalc()
    },
    { flush: 'post', immediate: true }
  )

  // enabled 切换为 true 时重算（抽屉打开/页面激活）
  watch(
    () => toValue(enabled),
    v => {
      if (v) scheduleCalc()
    }
  )

  onMounted(() => {
    scheduleCalc()
    window.addEventListener('resize', onResize)
  })

  onActivated(() => {
    scheduleCalc()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    if (calcTimer) clearTimeout(calcTimer)
  })

  return { height, refresh: calcHeight }
}

```

