## VUE

`npm i element-plus`

```tsx
import type { ElMessageBoxOptions, MessageHandle } from 'element-plus'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
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
export function useSuccess(message: string, needClose = true) {
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
export function useError(message: string, needClose = true) {
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
export function useWarning(message: string, needClose = true) {
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
export function useInfo(message: string, needClose = true) {
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

## 微信小程序

```ts
import { useStorage } from './useStorage'

/** 显示消息提示框 */
export function useShowToast(options: WechatMiniprogram.ShowToastOption) {
  const opt = Object.assign(
    {
      icon: 'none',
      duration: 2000
    },
    options
  )
  if (useStorage.showLoading || false) {
    useHideLoading({} as WechatMiniprogram.HideLoadingOption, () => {
      wx.showToast(opt)
    })
    return
  }
  wx.showToast(opt)
}

/** 隐藏消息提示框 */
export function useHideToast() {
  wx.hideToast()
}

/** 显示loading提示框 */
export function useShowLoading(options: WechatMiniprogram.ShowLoadingOption) {
  const opt = Object.assign(
    {
      mask: true
    },
    options
  )
  if (useStorage.showLoading || false) {
    useHideLoading({} as WechatMiniprogram.HideLoadingOption, () => {
      useStorage.showLoading = true
      wx.showLoading(opt)
    })
    return
  }
  useStorage.showLoading = true
  wx.showLoading(opt)
}

/** 显示loading提示框 */
export function useHideLoading(options = {} as WechatMiniprogram.HideLoadingOption, callback?: Function) {
  if (!(useStorage.showLoading || false)) return
  useStorage.showLoading = false
  if (callback) {
    options.complete = () => {
      callback()
    }
  }
  wx.hideLoading(options)
}

/** 显示模态对话框 */
export function useShowModal(options: WechatMiniprogram.ShowModalOption) {
  wx.showModal(options)
}

/** 显示操作菜单 */
export function useShowActionSheet(options: WechatMiniprogram.ShowActionSheetOption) {
  wx.showActionSheet(options)
}

```

