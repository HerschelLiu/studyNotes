```ts
/* eslint-disable prefer-rest-params */

import computedBehavior from '../module/computed.js'
import { globalData } from '../settings'
import { useArgsUrl } from './useArgs'
import { useBase } from './useBase'
import { useDynamicData } from './useData'
import { useTimeStamp } from './useDate'
import { getPageName, getTheFullPath, getThePage, isTabBar } from './useRouter'
import { isArray } from './useValidate'
import { zd } from './zd'

/** 代理方法 */
function initPageProxy() {
  const _Page = Page
  Page = function (this: WechatMiniprogram.Page.Constructor, options: Record<string, Function | any[]>) {
    try {
      if (!options) options = {}
      Object.keys(proxyPageFunction).forEach(key => {
        const _function = options[key]
        options[key] = function () {
          if (typeof _function === 'function') {
            _function.apply(this, arguments)
          }
          proxyPageFunction[key].apply(this, arguments)
        }
      })
      if (!options.closeProxyBehaviors) {
        if (!isArray(options.behaviors)) {
          options.behaviors = []
        }
        options.behaviors = [...options.behaviors.filter(item => item !== computedBehavior), computedBehavior]
      }
      _Page.apply(this, arguments as any)
    } catch (error) {
      _Page.apply(this, arguments as any)
    }
  }
}

/** 需要代理的Page事件 */
const proxyPageFunction: Record<string, any> = {
  onLoad: async function (options: AnyObject) {
    // 额外追加的参数, switchTab
    if (getApp().__jumpOptions && isTabBar(this.route)) {
      Object.assign(options, useArgsUrl('?' + getApp().__jumpOptions))
      this.options = options
      getApp().__jumpOptions = ''
    }

    if (this.data.loginConfig) {
      // 自定义前置事件
      this.beforeLoad && this.beforeLoad(options)
    }

    // 埋点-设置页面名称
    this.__SetPageName()

    if (this.data.loginConfig) {
      let setData: AnyObject = {}
      // 页面重用的初始化变量
      setData = { ...useDynamicData() }
      // 是否来自朋友圈
      const { scene } = zd.getEnterOptionsSync()
      if (scene === 1154) {
        setData.fromTimeLine = true
      }
      this.setData(setData)
      // 全局信息配置
      useBase.init(this.data.loginConfig)
    }
  },
  onShow: function () {
    this.data.hasOnShow = true

    // 额外追加的参数, switchTab
    if (getApp().__jumpOptions && isTabBar(this.route)) {
      const data = Object.assign(this.options, useArgsUrl('?' + getApp().__jumpOptions))
      if (Object.entries(data).length) {
        const setData: AnyObject = {}
        for (const key in data) {
          setData[key] = data[key]
        }
        this.setData(setData)
      }
      getApp().__jumpOptions = ''
    }
    // 完成任务
    this.___StartActivityTask()
    // 埋点-推送浏览页面
    this.__ViewPage()
  },
  onHide: function () {
    // 上报并销毁任务
    this.___DestroyActivityTask(getThePage())
  },
  onUnload: function () {
    // 上报并销毁任务
    this.___DestroyActivityTask(getThePage())
  },

  /** 启动任务 */
  ___StartActivityTask() {
    this.data.__browseStartTime = useTimeStamp()
  },
  /** 上报并销毁任务 */
  async ___DestroyActivityTask(page: WxPage) {
    if (!page) return
    this.data.__browseEndTime = useTimeStamp()
    const pagePath = getTheFullPath(page)

    if (globalData.login) {
      if (globalData.viewPages.some(item => pagePath.replace(/^\//, '').startsWith(item.replace(/^\//, '')))) {
        // noting
      }
    }
  },
  /** 埋点-设置页面名称 */
  async __SetPageName() {
    // 设置页面名称
    if (!this.data.pageName) {
      const pageName = await getPageName()
      if (!this.data.pageName) {
        this.setData({
          pageName
        })
      }
    }
  },
  /** 埋点-推送浏览页面 */
  async __ViewPage() {
    // const Pages = getCurrentPagesList()
    // const prevPage = getThePage(-1)
  }
}

/** 全局Page代理 */
export const useProxyPage = function () {
  initPageProxy()
}

```

```ts
// app.ts

// 引入useProxyPage
/** 代理Page */
useProxyPage()

App({...})
```

