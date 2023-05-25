## VUE

需要elementPlus

```ts
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import type { ComponentOptions, Ref } from 'vue'
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useConfirm, useLoading } from '@/hooks/useTip'

export interface BaseState {
  /** 死锁 */
  busy: boolean
  /** 加载中 */
  loading: boolean
  /** 死锁请求 */
  request: (config: StateRequestConfig) => Promise<void>
  /** 返回 */
  handleCancel: () => void
}

interface StateRequestConfig {
  /** 请求逻辑函数 */
  function: () => Promise<void>
  /** 是否显示二次确认 */
  showConfirm?: boolean
  /** 是否显示loading动画 */
  showLoading?: boolean
  /** 二次确认的标题内容 */
  confirmTitle?: string
  /** 请求错误的回调 */
  failBack?: (error: any) => void
  /** loading动画时的标题 */
  loadingTitle?: string
  /** 用于检验的表单ref */
  ELForm?: Ref<ComponentOptions | undefined>
  /** 二次确认的图标颜色 */
  type?: 'warning' | 'error' | 'success' | 'info'
  /** 二次确认的标题 */
  title?: string
}

/** state */
export function useState<T = object>(object?: T): BaseState & T {
  const router = useRouter()
  const route = useRoute()
  return reactive({
    /** 死锁 */
    busy: false,
    /** 加载中 */
    loading: true,
    /** 额外数据 */
    ...object,
    /** 死锁请求 */
    request: async function (config: any) {
      if (this.busy) return
      this.busy = true
      let loading: LoadingInstance | null = null
      try {
        if (config.ELForm) await config.ELForm.value.validate()
        if (config.showConfirm) {
          await useConfirm(config.confirmTitle || '是否执行该操作', config.title || '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: config.type || 'warning',
            dangerouslyUseHTMLString: true
          })
        }
        if (config.showLoading) loading = useLoading(config.loadingTitle || '加载中')
        try {
          await config.function()
        } catch (error) {
          typeof config.failBack === 'function' && config.failBack(error)
        } finally {
          loading?.close()
        }
      } catch (error) {
        loading?.close()
      }
      this.busy = false
    },
    /** 返回 */
    handleCancel: function () {
      router.go(-1)
    }
  }) as any
}

```

