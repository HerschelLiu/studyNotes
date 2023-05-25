## 微信小程序

```ts
import { useStyle, useUnit } from '../hooks/useStyle'
import { isLogin } from './useUserStatus'

/** 默认全局变量， 无需处理,单独放在文件settings.ts，此处仅作为定义示例 */
const settings = {
  systemInfo: wx.getSystemInfoSync(),
  menuButton: wx.getMenuButtonBoundingClientRect()
}
/** globalData 全局自定义属性,单独放在文件settings.ts，此处仅作为定义示例 */
const globalData = {
  navigationStyle: 'default', // 类型 'default' | 'custom'
  /** 标题栏高度，含statusBarHeight，单位px */
  titleBarHeight: Math.max(44, (settings.menuButton.top - settings.systemInfo.statusBarHeight) * 2 + settings.menuButton.height) +
    settings.systemInfo.statusBarHeight,
  login: false
}

/** 顶部的距离，区别于系统titlebar和自定义titlebar */
export const topPosition = globalData.navigationStyle === 'default' ? 0 : globalData.titleBarHeight

/** 页面主样式，position */
export function useStyleTop({ top } = { top: '0rpx' }) {
  return useStyle({
    top: `calc(${top} + ${useUnit(topPosition, 'px')})`
  })
}

/** 页面主样式，padding */
export interface IStylePadding {
  /** 上填充，默认已经包含了titlebar */
  top?: string
  /** 下填充 */
  bottom?: string
  /** 是否携带底部安全区 */
  hasSafeArea?: boolean
  /** 高度模式，height or min-height */
  heightMode?: string
  /** 是否需要padding-top样式 */
  hasPaddingTop?: boolean
}
export function useStylePadding(options: IStylePadding = {}) {
  const { top, bottom, hasSafeArea, heightMode, hasPaddingTop } = Object.assign(
    {
      top: '0rpx',
      bottom: '0rpx',
      hasSafeArea: true,
      heightMode: 'minHeight',
      hasPaddingTop: true
    },
    options
  )
  return useStyle({
    paddingTop: hasPaddingTop ? `calc(${top} + ${useUnit(topPosition, 'px')})` : '',
    [`${heightMode}`]: [`calc(100vh - ${top} - ${bottom} - ${useUnit(topPosition, 'px')})`]
      .concat(
        hasSafeArea
          ? [
              `calc(100vh - ${top} - ${bottom} - ${useUnit(topPosition, 'px')} - constant(safe-area-inset-bottom))`,
              `calc(100vh - ${top} - ${bottom} - ${useUnit(topPosition, 'px')} - env(safe-area-inset-bottom))`
            ]
          : []
      )
      .join('; min-height: ')
  })
}

/** 页页初始化的固定参数 */
export const useStaticData = {
  /** titlebar是否透明 */
  opacity: 1,
  /** titlebar是否需要背景颜色 */
  background: true,
  /** 是否加载中 */
  loading: true,
  /** 是否接口报错 */
  fail: false,
  /** 死锁 */
  busy: false,
  /** 是否显示弹窗 */
  showModal: false,
  /** 弹窗列表 */
  modalList: {},
  /** 内容窗口的上定位，让出titlebar的高度 */
  styleTop: useStyleTop(),
  /** 内容窗口的上填充，让出titlebar的高度 */
  stylePadding: useStylePadding(),
  /** 是否已登录 */
  login: globalData.login || isLogin(),
  /** 资源不存在 */
  notfound: false,
  /** 是否首次进入页面的标识 */
  hasOnShow: false,
  /** 首页地址 */
  homePath: globalData.homePath,
  /** 是否全屏展示授权弹窗 */
  authFullScreen: false,
  /** 404标题 */
  notFoundTitle: '信息已经找不到啦~',
  /** 默认客服类型 */
  contact: globalData.contact,
  /** 404页面的样式类型 */
  notFoundType: 'normal',
  /** 页面名称-会被mixins填充，店铺装修会被二次覆盖 */
  pageName: '',
  /** 小程序名称 */
  appName: globalData.appName
}

/** 页面重用的初始化参数，防止初始化编译成字面量 */
export function useDynamicData() {
  return {
    /** 登录标记 */
    login: globalData.login || isLogin()
  }
}

/** 获取用户头像与昵称 */
export function useUserInfo() {
  if (globalData.login) {
    return {
      avatarUrl: zdmallInfo.userInfo.avatarUrl,
      nickName: zdmallInfo.userInfo.nickName
    }
  }
  return {
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickName: '游客'
  }
}

```

