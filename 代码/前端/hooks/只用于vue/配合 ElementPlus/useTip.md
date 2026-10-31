## VUE

`npm i element-plus`

```tsx
import type { ElMessageBoxOptions, LoadingInstance, LoadingOptions, MessageHandler, MessageOptions, MessageType } from 'element-plus'

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

/** 当前正在显示的提示，用于新提示到来时关闭旧提示 */
let currentMessage: { key: number; handler: MessageHandler } | null = null
/** 自增 key：异步触发 onClose 时用于判断是否是当前提示，避免误关新提示 */
let messageKey = 0

/**
 * 关闭当前提示
 * @param key 指定 key 时，仅当该提示仍在显示才关闭
 */
function closeMessage(key?: number) {
  const message = currentMessage
  if (!message || (key !== undefined && message.key !== key)) return
  // 先置空再 close：close 会触发 onClose，避免重复关闭
  currentMessage = null
  message.handler.close()
}

/**
 * 统一的提示实现
 * @param type 提示类型
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示
 * @param options ElMessage 原生配置（duration / showClose / grouping ...）
 */
function showMessage(type: MessageType, message: string, needClose = true, options?: MessageOptions): MessageHandler {
  if (needClose) closeMessage()
  const key = ++messageKey
  const { onClose, ...rest } = options ?? {}
  const handler = ElMessage({
    duration: 1500,
    ...rest,
    message,
    type,
    onClose: () => {
      closeMessage(key)
      onClose?.()
    }
  })
  currentMessage = { key, handler }
  return handler
}

/**
 * 指令式加载动画
 * @param title 文本
 * @param options ElLoading 原生配置
 */
export const useLoading = (title = '加载中', options?: LoadingOptions): LoadingInstance =>
  ElLoading.service({
    lock: true,
    text: title,
    spinner: '<circle class="path" cx="50" cy="50" r="20" fill="none"></circle>',
    background: 'rgba(255, 255, 255, 0.9)',
    ...options
  })

/**
 * 成功提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 * @param options ElMessage 原生配置
 */
export const useSuccess = (message: string, needClose = true, options?: MessageOptions) => showMessage('success', message, needClose, options)

/**
 * 错误提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 * @param options ElMessage 原生配置
 */
export const useError = (message: string, needClose = true, options?: MessageOptions) => showMessage('error', message, needClose, options)

/**
 * 警告提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 * @param options ElMessage 原生配置
 */
export const useWarning = (message: string, needClose = true, options?: MessageOptions) => showMessage('warning', message, needClose, options)

/**
 * 信息提示
 * @param message 内容
 * @param needClose 是否需要关闭其他当前正在显示的提示，默认是
 * @param options ElMessage 原生配置
 */
export const useInfo = (message: string, needClose = true, options?: MessageOptions) => showMessage('info', message, needClose, options)

/**
 * 主动关闭当前提示（如 message 设置了较长的 duration 或 showClose）
 */
export const useCloseTip = () => closeMessage()

/**
 * 二次确认
 * @param message 内容
 * @param title 标题
 * @param options 其他参数
 */
export const useConfirm = (message: string, title = '操作提示', options?: ElMessageBoxOptions) =>
  ElMessageBox.confirm(message, title, options)

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

