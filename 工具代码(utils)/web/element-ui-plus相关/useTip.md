```tsx
import { ElLoading, ElMessage, ElMessageBox, ElMessageBoxOptions, MessageHandle } from 'element-plus'
import { ref } from 'vue'

import { useRandomString } from '@/hooks/useString'

type MessageRef = {
  key: string
  value: MessageHandle
}

const messageRef = ref<MessageRef | null>(null)

/** 关闭之前的message */
function closeMessage(key = '') {
  const message = messageRef.value
  if (message && (!key || message.key === key)) message.value.close()
}

/**
 * 指令式加载动画
 * @param title 文本
 */
export const useLoading = (title: string) =>
  ElLoading.service({
    lock: true,
    text: title,
    spinner: '<circle class="path" cx="50" cy="50" r="20" fill="none"></circle>',
    background: 'rgba(255, 255, 255, 0.9)'
  })

/**
 * 成功提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 */
export function useSuccess(message: string, needClose: boolean = true) {
  needClose && closeMessage()
  const key = useRandomString()
  messageRef.value = {
    key,
    value: ElMessage({
      message,
      type: 'success',
      duration: 1500,
      onClose: () => closeMessage(key)
    })
  }
}

/**
 * 错误提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 */
export function useError(message: string, needClose: boolean = true) {
  needClose && closeMessage()
  const key = useRandomString()
  messageRef.value = {
    key,
    value: ElMessage({
      message,
      type: 'error',
      duration: 1500,
      onClose: () => closeMessage(key)
    })
  }
}

/**
 * 警告提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 */
export function useWarning(message: string, needClose: boolean = true) {
  needClose && closeMessage()
  const key = useRandomString()
  messageRef.value = {
    key,
    value: ElMessage({
      message,
      type: 'warning',
      duration: 1500,
      onClose: () => closeMessage(key)
    })
  }
}

/**
 * 信息提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 */
export function useInfo(message: string, needClose: boolean = true) {
  needClose && closeMessage()
  const key = useRandomString()
  messageRef.value = {
    key,
    value: ElMessage({
      message,
      type: 'info',
      duration: 1500,
      onClose: () => closeMessage(key)
    })
  }
}

/**
 * 二次确认
 * @param message 内容
 * @param title 标题
 * @param options 其他参数
 */
export const useConfirm = (message: string, title: string, options?: ElMessageBoxOptions) => ElMessageBox.confirm(message, title, options)

```

