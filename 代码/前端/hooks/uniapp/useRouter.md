```ts
/** 获取页面栈，解决直播的页面栈为null */
export function getCurrentPagesList(): IUniPage[] {
  return getCurrentPages().filter(item => Boolean(item))
}

/**
 * 获取指定页面路由对象
 * index 0为当前页，-1为上一页
 */
export function getThePage(): IUniPage
export function getThePage(index: number): IUniPage | undefined
export function getThePage(index = 0): IUniPage | undefined {
  const Pages = getCurrentPagesList()
  const target = Pages.length - 1 + index
  if (Pages.length > target) {
    return Pages[Pages.length - 1 + index]
  }
  return undefined
}

/** 判断是否是tabBar页面 */
export function isTabBar(url?: string | string.PageURIString): boolean {
  if (!url && getThePage()) url = getThePage().route
  if (!url) return false
  url = url.split('?')[0]
  if (url.startsWith('/')) {
    url = url.substring(1)
  }

  return settings.tabbar.findIndex(item => item.pagePath.includes(url as string)) > -1
}

/** 获取指定页面路由对象 */
export function getThePageByPath(route: string) {
  const Pages = getCurrentPagesList()
  return Pages.find(item => item.route === route)
}

/** url的不合规处理 */
export function getRightUrl(url: string | string.PageURIString) {
  url = url.trim()
  if (!url.startsWith('/')) url = `/${url}`
  return url
}

/** 关闭当前页面，返回上一页面或多级页面 */
export function navigateBack(options?: UniApp.NavigateBackOptions, url?: string) {
  if (!options || !options.delta) {
    const Pages = getCurrentPagesList()
    if (url) {
      // 返回指定页
      let urlPath = url
      if (urlPath.startsWith('/')) urlPath = urlPath.substring(1, urlPath.length)
      const index = Pages.findIndex(item => item.route === urlPath)
      if (index > -1) {
        options = {
          delta: Pages.length - index - 1
        }
      } else {
        redirectTo({
          url: `/${url}`
        })
        return
      }
    } else if (Pages.length === 1) {
      // 没有任务路由，返回首页
      if (isTabBar()) {
        navigateTo({
          url: settings.homePath
        })
      } else {
        reLaunch({
          url: settings.homePath
        })
      }
      return
    }
  }
  upp.navigateBack(options)
}

/** 保留当前页面，跳转到应用内的某个页面 */
export function navigateTo(options: UniApp.NavigateToOptions & UniApp.SwitchTabOptions) {
  options.url = getRightUrl(options.url)

  if (isTabBar(options.url)) {
    options.url = options.url.split('?')[0]
    upp.switchTab(options)
  } else upp.navigateTo(options)
}

/** 关闭所有页面，打开到应用内的某个页面 */
export function reLaunch(options: UniApp.ReLaunchOptions) {
  options.url = getRightUrl(options.url)
  upp.reLaunch(options)
}

/** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 */
export function redirectTo(options: UniApp.RedirectToOptions) {
  options.url = getRightUrl(options.url)
  if (isTabBar(options.url)) {
    reLaunch(options)
    return
  }
  upp.redirectTo(options)
}

```

