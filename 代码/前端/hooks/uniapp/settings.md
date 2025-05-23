## uniapp

```ts
import { reactive } from 'vue'

import { useStyle, useUnit } from '@/hooks/useStyle'

/** 页面主样式，padding */
interface IStylePadding {
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

const systemInfo = uni.getSystemInfoSync()
const menuButton = uni.getMenuButtonBoundingClientRect()

/** 标题栏高度，含statusBarHeight，单位px */
const titleBarHeight = () =>
  computed(() => {
    let titleBarHeight = 44

    // #ifdef MP-ALIPAY
    titleBarHeight = systemInfo.titleBarHeight!
    // #endif

    // #ifndef MP-ALIPAY
    titleBarHeight = Math.max(44, (menuButton.top - systemInfo.statusBarHeight!) * 2 + menuButton.height) + systemInfo.statusBarHeight!
    // #endif

    return titleBarHeight
  })

export function useStyleTop({ top } = { top: '0px' }): string {
  const _titleBarHeight = titleBarHeight()
  return useStyle({
    top: `calc(${top} + ${useUnit(_titleBarHeight.value, 'px')})`
  })
}

export const useStylePadding = (options: IStylePadding = {}): string => {
  const { top, bottom, hasSafeArea, heightMode, hasPaddingTop } = Object.assign(
    {
      top: '0px',
      bottom: '0px',
      hasSafeArea: true,
      heightMode: 'minHeight',
      hasPaddingTop: true
    },
    options
  )

  const _titleBarHeight = titleBarHeight()

  return useStyle({
    paddingTop: hasPaddingTop ? `calc(${top} + ${useUnit(_titleBarHeight.value, 'px')})` : '',
    [`${heightMode}`]: [`calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(_titleBarHeight.value, 'px') : '0px'})`]
      .concat(
        hasSafeArea
          ? [
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(_titleBarHeight.value, 'px') : '0px'} - constant(safe-area-inset-bottom))`,
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(_titleBarHeight.value, 'px') : '0px'} - env(safe-area-inset-bottom))`
            ]
          : []
      )
      .join(`; ${heightMode}: `)
  })
}

export interface UseTabbarHeightOptions {
  /** 自定义tabbar */
  customTabbar?: boolean
}
const useTabbarHeight = (options: UseTabbarHeightOptions) =>
  computed(() => {
    const { customTabbar = false } = options
    const _titleBarHeight = titleBarHeight()
    return customTabbar ? 54 + (systemInfo.safeAreaInsets?.bottom ?? 0) : systemInfo.screenHeight - systemInfo.windowHeight - _titleBarHeight.value
  })

const settings = reactive({
  systemInfo,
  menuButton,
  titleBarHeight: titleBarHeight(),
  /** 本地存储前缀 */
  storagePrefix: 'HMKF_',
  imgSrc: 'https://hmkfo.oss-cn-beijing.aliyuncs.com/wx/merchant/',
  grayUrl: 'https://gray.hmkf688.com/brand/sysConfig/getAppServerAddr',
  /** 内容窗口的上定位，让出titlebar的高度 */
  styleTop: useStyleTop(),
  /** 内容窗口的上填充，让出titlebar的高度 */
  stylePadding: useStylePadding(),
  tabbar: <Tabs[]>[
    {
      pagePath: '/pages/home/index',
      name: '首页'
    },
    {
      pagePath: '/pages/tabbar1/index',
      name: '商铺'
    },
    {
      pagePath: '/pages/tabbar2/index',
      name: '订单'
    },
    {
      pagePath: '/pages/my/index',
      name: '我的'
    }
  ],
  tabbarHeight: useTabbarHeight({ customTabbar: false }),
  homePath: 'pages/home/index',
  env: uni.getAccountInfoSync().miniProgram.envVersion
})

export default settings

```



## 微信小程序

```ts
import { reactive } from 'vue'

import { useStyle, useUnit } from '@/hooks/useStyle'

/** 页面主样式，padding */
interface IStylePadding {
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

const systemInfo = uni.getSystemInfoSync()
const menuButton = uni.getMenuButtonBoundingClientRect()

/** 标题栏高度，含statusBarHeight，单位px */
const titleBarHeight = Math.max(44, (menuButton.top - systemInfo.statusBarHeight!) * 2 + menuButton.height) + systemInfo.statusBarHeight!

export function useStyleTop({ top } = { top: '0px' }): string {
  return useStyle({
    top: `calc(${top} + ${useUnit(titleBarHeight, 'px')})`
  })
}

export const useStylePadding = (options: IStylePadding = {}): string => {
  const { top, bottom, hasSafeArea, heightMode, hasPaddingTop } = Object.assign(
    {
      top: '0px',
      bottom: '0px',
      hasSafeArea: true,
      heightMode: 'minHeight',
      hasPaddingTop: true
    },
    options
  )

  return useStyle({
    paddingTop: hasPaddingTop ? `calc(${top} + ${useUnit(titleBarHeight, 'px')})` : '',
    [`${heightMode}`]: [`calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'})`]
      .concat(
        hasSafeArea
          ? [
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'} - constant(safe-area-inset-bottom))`,
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'} - env(safe-area-inset-bottom))`
            ]
          : []
      )
      .join(`; ${heightMode}: `)
  })
}

export interface UseTabbarHeightOptions {
  /** 自定义tabbar */
  customTabbar?: boolean
}
const useTabbarHeight = (options: UseTabbarHeightOptions) =>
  computed(() => {
    const { customTabbar = false } = options
    console.log('sysInfo.screenHeight', systemInfo.screenHeight)
    console.log('systemInfo.windowHeight', systemInfo.windowHeight)
    return customTabbar ? 54 + (systemInfo.safeAreaInsets?.bottom ?? 0) : systemInfo.screenHeight - systemInfo.windowHeight - titleBarHeight
  })

const settings = reactive({
  systemInfo,
  menuButton,
  titleBarHeight,
  /** 本地存储前缀 */
  storagePrefix: 'HMKF_',
  imgSrc: 'https://hmkfo.oss-cn-beijing.aliyuncs.com/wx/merchant/',
  grayUrl: 'https://gray.hmkf688.com/brand/sysConfig/getAppServerAddr',
  /** 内容窗口的上定位，让出titlebar的高度 */
  styleTop: useStyleTop(),
  /** 内容窗口的上填充，让出titlebar的高度 */
  stylePadding: useStylePadding(),
  tabbar: <Tabs[]>[
    {
      pagePath: '/pages/home/index',
      name: '首页'
    },
    {
      pagePath: '/pages/tabbar1/index',
      name: '商铺'
    },
    {
      pagePath: '/pages/tabbar2/index',
      name: '订单'
    },
    {
      pagePath: '/pages/my/index',
      name: '我的'
    }
  ],
  tabbarHeight: useTabbarHeight({ customTabbar: false }),
  homePath: 'pages/home/index',
  env: uni.getAccountInfoSync().miniProgram.envVersion
})

export default settings

```

