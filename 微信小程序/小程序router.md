```typescript
/** tabbar页面路径列表 */
export const tabBar = () => {
  return [
    'pages/find/find',
    'pages/shop/shop',
    'pages/my/my'
  ]
}

/**
 * 判断是否是tabBar页面
 */
export function isTabBar(url ? : string): boolean {
  if (!url && getThePage()) {
    url = getThePage().route
  }
  if (!url) {
    return false
  }
  url = url.split('?')[0]
  url.startsWith('/') && (url = url.substring(1))
  return tabBar().includes(url)
}

/**
 * 获取页面栈
 */
export function getCurrentPagesList(): WechatMiniprogram.Page.Instance < Record < string, any >, Record < string, any >> [] {
  return getCurrentPages().filter(item => Boolean(item))
}

/**
 * 获取指定页面路由对象
 * index 0为当前页，-1为上一页
 */
export function getThePage(index = 0) {
  const Pages = getCurrentPagesList()
  return Pages[Pages.length - 1 + index]
}

/**
 * 获取指定页面路由对象
 */
export function getThePageByPath(route: string) {
  const Pages = getCurrentPagesList()
  return Pages.find(item => item.route === route)
}

/**
 * 封装路由
 */
export default {
  /**
   * 关闭当前页面，返回上一页面或多级页面
   */
  navigateBack(options ? : WechatMiniprogram.NavigateBackOption, url ? : string) {
    if (!options || !options.delta) {
      const Pages = getCurrentPagesList()
      if (url) {
        // 返回指定页
        if (url.startsWith('/')) {
          url = url.substring(1, url.length)
        }
        const index = Pages.findIndex(item => item.route === url)
        options = {
          delta: Pages.length - index - 1
        }
      } else if (Pages.length === 1) {
        // 没有任务路由，返回首页
        this.navigateTo({
          url: globalData.homePath
        })
        return
      }
    }
    wx.navigateBack(options)
  },

  /**
   * 保留当前页面，跳转到应用内的某个页面
   */
  navigateTo(options: WechatMiniprogram.NavigateToOption & WechatMiniprogram.SwitchTabOption) {
    if (isTabBar(options.url)) {
      wx.switchTab(options)
    } else {
      wx.navigateTo(options)
    }
  },

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch(options: WechatMiniprogram.ReLaunchOption) {
    wx.reLaunch(options)
  },

  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
   */
  redirectTo(options: WechatMiniprogram.RedirectToOption) {
    if (isTabBar(options.url)) {
      throw new Error('不允许跳转到 tabbar 页面，请使用navigateTo')
    }
    wx.redirectTo(options)
  },
}

```

