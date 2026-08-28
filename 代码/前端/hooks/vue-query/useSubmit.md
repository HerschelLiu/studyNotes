`useSubmit`

```ts
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import type { ComponentOptions, Ref } from 'vue'
import type { MutationOptions, QueryKey } from '@tanstack/vue-query'

import { reactive } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useConfirm, useError, useLoading } from '@/hooks/useTip'

/** useSubmit 配置项（含 useMutation 原生选项） */
export interface UseSubmitOptions<TData, TError, TVariables extends any[], TContext>
  extends Omit<MutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  /** 用于校验的表单 ref */
  ELForm?: Ref<ComponentOptions | undefined>
  /** 是否显示二次确认，默认 false */
  showConfirm?: boolean
  /** 二次确认的标题内容（接收与 apiFn 相同的多参数） */
  confirmTitle?: string | ((...variables: TVariables) => string)
  /** 二次确认的标题 */
  title?: string
  /** 二次确认的图标颜色 */
  type?: 'warning' | 'error' | 'success' | 'info'
  /** 是否显示 loading 动画，默认 false */
  showLoading?: boolean
  /** loading 动画时的标题 */
  loadingTitle?: string
  /** 提交成功后需要失效的 queryKey 列表（每个 key 做前缀匹配，自动刷新对应列表） */
  invalidateKeys?: QueryKey[]
}

/**
 * 表单提交 hook（基于 @tanstack/vue-query useMutation）
 *
 * @param apiFn  业务接口函数（支持多参数，参数将以 spread 形式传入）
 * @param options 配置项（预处理 + useMutation 原生选项）
 * @returns submit 为触发函数，支持多参数透传
 */
export const useSubmit = <TData = unknown, TError = Error, TVariables extends any[] = [], TContext = unknown>(
  apiFn: (...variables: TVariables) => Promise<TData>,
  options: UseSubmitOptions<TData, TError, TVariables, TContext> = {}
) => {
  const { ELForm, showConfirm, confirmTitle, title, type, showLoading, loadingTitle, invalidateKeys, onSuccess, ...mutationOptions } = options

  const queryClient = useQueryClient()

  const state = reactive({
    busy: false
  })

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      if (ELForm) {
        try {
          await ELForm.value?.validate().catch(error => {
            useError('请完善表单')
            throw error
          })
        } catch (error) {
          throw error
        }
      }
      if (showConfirm) {
        const resolvedConfirmTitle = typeof confirmTitle === 'function' ? confirmTitle(...variables) : confirmTitle ?? '是否执行该操作'
        await useConfirm(resolvedConfirmTitle, title || '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: type || 'warning',
          dangerouslyUseHTMLString: true
        })
      }
      let loading: LoadingInstance | null = null
      if (showLoading) loading = useLoading(loadingTitle || '加载中')
      try {
        return await apiFn(...variables)
      } catch (error) {
        throw error
      } finally {
        loading?.close()
      }
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (invalidateKeys?.length) {
        await Promise.all(invalidateKeys.map(key => queryClient.invalidateQueries({ queryKey: [key[0]] })))
      }
      await onSuccess?.(data, variables, onMutateResult, context)
    }
  })

  const { mutateAsync } = mutation

  const submit = (...variables: TVariables) => {
    if (state.busy) return
    state.busy = true

    return mutateAsync(variables).finally(() => {
      state.busy = false
    })
  }

  return {
    state,
    /** vue-query 完整返回对象 */
    mutation,
    /** 触发提交（带死锁） */
    submit,
    ...mutation
  }
}

```

