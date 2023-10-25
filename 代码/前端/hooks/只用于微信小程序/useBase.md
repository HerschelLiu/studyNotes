```ts
import { login, readUserInfo } from '../api/account'
import { getWxcodeValue } from '../api/common'
import { globalData } from '../settings'
import { useArgsUrl } from './useArgs'
import { useTimeStamp } from './useDate'
import { useLog } from './useLog'
import { useClone, useValue } from './useObject'
import { getCurrentPagesList, getThePage } from './useRouter'
import { zdmallInfo } from './useStorage'
import { isLogin } from './useUserStatus'
import { isCode, isHaveValue } from './useValidate'
import { zd } from './zd'

/** 网络状态 */
zd.onNetworkStatusChange(res => {
  if (res.isConnected) {
    const Page = getThePage()
    if (Page.data.fail || Page.data.notfound) {
      Page.setData({
        notfound: false,
        fail: false,
        loading: true
      })
      Page.reLoad && Page.reLoad()
    }
  }
})

/** 冷启动-核心处理 */
export async function useLaunch() {
  useLog(`版本号`, `${globalData.version}`)
}

/** 热启动-核心处理 */
export async function useShow(options: WechatMiniprogram.App.LaunchShowOption) {
  const { scene, query } = options

  // 清空本地缓存
  globalData.config = {}

  // 分享者信息处理
  if (query.shareid) zdmallInfo.shareid = query.shareid

  // 分享者渠道处理
  if (query.channel) {
    zdmallInfo.channel = query.channel as unknown as undefined
    // 只有渠道值时可能需要清空分享者
    zdmallInfo.shareid = query.shareid || ''
  }

  // 赋值第三方小程序信息
  globalData.thirdApp = options

  zdmallInfo.scene = scene

  useLog(`分享人`, `${zdmallInfo.shareid || '无'}`)
  useLog(`分享渠道`, `${zdmallInfo.channel || '无'}`)
  useLog(`当前场景值`, `${zdmallInfo.scene}`)
  useLog(`渠道值`, `${zdmallInfo.registerSource || '无'}`)
}

/** 页面流程-核心处理 */
export const useBase: Base = {
  /** 初始化 */
  async init(loginConfig: InitOptions) {
    const Pages = getCurrentPagesList()
    const Page = getThePage()

    const res = zd.getEnterOptionsSync()
    const { query, referrerInfo } = res

    // 小程序码解码
    if (query.scene && isCode(query.scene)) {
      const { data: parameter } = await getWxcodeValue(query.scene)
      const obj = useArgsUrl('?' + parameter)
      Reflect.deleteProperty(query, 'scene')
      Reflect.set(res, 'query', obj)
      Object.assign(query, obj)
      Reflect.deleteProperty(Page.options, 'scene')
      Page.options = Object.assign(Page.options, query)
    }

    // 小程序码参数转化
    if (query.scene && !isCode(query.scene)) {
      // 小程序码
      const scene = decodeURIComponent(query.scene)
      const obj = useArgsUrl('?' + scene)
      Reflect.deleteProperty(query, 'scene')
      Reflect.set(res, 'query', obj)
      Object.assign(query, obj)
      Reflect.deleteProperty(Page.options, 'scene')
      Page.options = Object.assign(Page.options, obj)
    }

    // 渠道值处理
    if (isHaveValue(Page.options.RegisterSource)) {
      const registerSource = Page.options.RegisterSource
      if (zdmallInfo.registerSource !== registerSource) {
        zdmallInfo.registerSource = registerSource
        useLog(`新的渠道值`, `${registerSource || '无'}`)
      }
    }
    if (!isHaveValue(zdmallInfo.registerSource)) zdmallInfo.registerSource = ''

    // 来源应用
    if (referrerInfo && referrerInfo.appId) {
      globalData.referrerInfo = referrerInfo
    }

    // 动态更新登录态
    globalData.login = isLogin()
    Pages.forEach(item => {
      item.data.login = globalData.login
    })

    if (loginConfig.needLogin) {
      // 需要登录时
      if (globalData.login) {
        Page.reLoad && Page.reLoad(loginConfig)
        return
      }

      try {
        await this.login(true)
        Page.reLoad && Page.reLoad(loginConfig)
      } catch (error) {
        Page.setData({
          loading: false,
          fail: true,
          failContent: '当前页面需要登录，请授权登录！',
          failButtonContent: '前往登录'
        })
      }
    } else {
      // 不需要登录时
      if (!globalData.login && !Page.data.fromTimeLine) await this.login(false)
      Page.reLoad && Page.reLoad(loginConfig)
    }
  },

  /** 就绪后的逻辑 */
  initPage(loginConfig: InitOptions, event?: WechatMiniprogram.BaseEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      const that = this as unknown as WxPage
      const setData: AnyObject = {}
      Object.assign(setData, {
        failContent: '',
        failButtonContent: ''
      })
      // 如果是通过重新加载进入的
      if (event) {
        Object.assign(setData, {
          loading: true,
          fail: false
        })
      }
      that.setData(setData)

      // 初始登录状态
      if (loginConfig.needLogin && !that.data.login) {
        globalData.callback = () => {}
        useBase.init(loginConfig)
        that.setData({
          loading: false,
          fail: true
        })
        reject()
      } else resolve()
    })
  },

  /** 登录 */
  login(must, registerSource?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await getThePage()
          .selectComponent('#auth')
          .auth(must, registerSource || '')
        // 全局数据处理
        if (isLogin()) {
          globalData.login = true
          getCurrentPagesList().forEach(item =>
            item.setData({
              login: globalData.login
            })
          )
          if (globalData.callback) {
            globalData.callback()
            globalData.callback = () => {}
          }
        }
        resolve()
      } catch (error) {
        if (must) reject(Error('登录失败'))
        else resolve()
      }
    })
  }
}

/** 微信登录 */
let busy = false
export function wxLogin(force = false): Promise<void> {
  return new Promise((resolve, reject) => {
    zd.login({
      success: async res => {
        if (busy && !force) return reject()
        busy = true
        try {
          const { data } = await login({ jsCode: res.code })
          const userInfo = useClone(zdmallInfo.userInfo)
          Object.assign(zdmallInfo, useValue(data))
          Object.assign(zdmallInfo.userInfo, userInfo, useValue(data.userInfo))
          if (zdmallInfo.accessToken) {
            zdmallInfo.loginTimestamp = useTimeStamp()
            useLog(`用户登录态`, `已登录`)
          } else {
            useLog(`用户登录态`, `未登录`)
          }
          resolve()
        } catch (error) {
          reject()
        }
        busy = false
      },
      fail() {
        reject()
      }
    })
  })
}

/** 热登录 */
export function reLogin(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      useLog(`用户登录态`, `已登录`)
      const [{ data: userInfo }] = await Promise.all([readUserInfo()])
      zdmallInfo.userInfo = userInfo
      if (!zdmallInfo.userInfo.mobile) {
        throw Error('用户缺少手机号码')
      }
      resolve()
    } catch (error) {
      reject()
    }
  })
}

/** 获取openid的执行状态 */
export function isComplete(): Promise<boolean> {
  const time1 = useTimeStamp()
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const time2 = useTimeStamp()
      if (time2 - time1 > 1000 * 5) {
        clearInterval(interval)
        return resolve(false)
      }
    }, 5)
  })
}

```

```ts
// app.ts

import { useLaunch, useShow } from './hooks/useBase'
App({
  onLaunch() {
    // 冷启动-核心处理
    useLaunch()
  },
  onShow(options) {
    // 热启动-核心处理
    useShow(options)
  },
})
```

```ts
// 其他page页面

import { useBase } from '../../hooks/useBase'

interface InitOptions {
  /** 当前页面是否需要登录 */
  needLogin: boolean
}

Page({
  /** 页面的初始数据 */
  data: {
    /** 页面登录处理方式 */
    loginConfig: <InitOptions>{
      needLogin: false
    },
    ...useStaticData, // 一些每个页面固定字段，比如页面名称pageName
  },
  
  
  /** 自定义前置事件 */
  beforeLoad() {},

  /** 页面初始化 */
  async reLoad(event?: WechatMiniprogram.BaseEvent) {
    await useBase.initPage.call(this, this.data.loginConfig, event)
  },
})
```

