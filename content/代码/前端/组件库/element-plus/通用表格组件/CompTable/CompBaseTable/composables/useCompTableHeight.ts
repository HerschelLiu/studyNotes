import type { Ref } from 'vue'
import type { BaseCompTableProps } from '../types'

import { computed, onScopeDispose, watch } from 'vue'

import { useTableHeight } from '@/hooks/useTable'

export const useCompTableHeight = <T extends Record<string, any>, R extends Record<string, any>>(
  targetRef: Ref<object | null | undefined>,
  props: BaseCompTableProps<T, R>
) => {
  const { tableHeight, refresh } = useTableHeight(targetRef, props.bottomOffset)

  const resolvedHeight = computed<ID | undefined>(() => {
    if (props.height != null) return props.height
    return props.heightMode === 'fixed' ? tableHeight.value : undefined
  })

  const resolvedMaxHeight = computed<ID | undefined>(() => {
    if (props.height != null || props.heightMode !== 'max') return undefined
    return props.maxHeight ?? tableHeight.value
  })

  let raf = 0
  const schedule = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(refresh)
  }
  watch(() => props.heightMode, schedule)
  // onScopeDispose 而非 onUnmounted：composable 可能运行在 effectScope（测试/独立逻辑）里，
  // 作用域销毁时同样取消待执行的 rAF，避免销毁后回调
  onScopeDispose(() => cancelAnimationFrame(raf))

  return { resolvedHeight, resolvedMaxHeight, refresh }
}
