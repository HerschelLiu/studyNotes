components下的全局组件会打包进主包，为了减少主包占用资源，可以将组件单独放在一个分包并开启分包加载

**分包独立性**：微信小程序的分包是独立的，默认情况下：

- 主包不能直接引用分包中的组件/资源
- 分包也不能直接引用其他分包中的组件/资源

所以如果想要在主包使用分包的组件，需在主包或使用页面的配置中使用 componentPlaceholder 占位符（跨分包引用）。即在 page.json 里的 style 里增加如下配置：

```text
"usingComponents": {
    "tki-qrcode": "/libs/tki-qrcode/tki-qrcode"
  },
"componentPlaceholder": {
  "tki-qrcode": "view"  // 用 view 组件临时占位
}
```

**uniapp pages.json**

```json
"pages": [
  {
    "path": "pages/index/index",
    "componentPlaceholder": {
      "sync-comp": "view"
    },
    "usingComponents": {
      "sync-comp": "/packageA/components/test"
    }
  }
]
```



这样的话就可以在主包内正常使用分包组件了



**在主包内使用的 js 代码最终都会被打进**vender**里，不管是不是放在分包，即增加主包的体积**

* 未开启分包的情况下，主包页面引用的组件和 js 资源，静态资源都会被打包进入主包

* 开启分包未开启分包优化的情况下，主包页面引用来自分包的组件和 js 资源仍然会被打包进入主包，而静态资源则被打入对应分包。**

* 开启主包并开启分包优化的情况下，主包页面引用来自分包的组件会被打进主包，而引用的分包 js 资源仍被打进主包。**

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1931005175516070355
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



可以使用插件`zion-uniapp-mp-load-package`，实现我们上述的功能，在主包内使用分包的 js 资源，同时 js 资源被打包进入分包。

```bash
npm i zion-uniapp-mp-load-package -D
```

**vue.config(vue2)**

```js
const {
  zionUniMpLoadPackagePlugin
} = require('zion-uniapp-mp-load-package/webpack')
module.exports = {
  configureWebpack: {
    plugins: [new zionUniMpLoadPackagePlugin()],
    optimization: {
      moduleIds: 'named'
    }
  }
}

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1931005175516070355
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

**vite.config(vue3)**

```js
import { defineConfig } from 'vite';  
import uni from '@dcloudio/vite-plugin-uni';  
import { zionUniMpLoadPackagePlugin } from './script/zionUniMpLoadPackagePlugin/vite'  

export default defineConfig({  
  plugins: [  
    uni(),  
    zionUniMpLoadPackagePlugin()  
  ],  
});
```



**使用方式**

```js
// 这里的packageA对应的就是分包目录  
loadMpPackage("packageA", () => {  
    // ...  
    console.log('加载成功')  
    // 这里就可以直接引入分包中对应位置的js，调用其方法  
    console.log(loadMpPackageModule('/packageA/sdk/index.js'))  
    console.log(loadMpPackageModule('/packageA/sdk/index.js').a())  
}, ({mod, errMsg}) => {  
    // ...  
    console.log('加载出错', mod, errMsg)  
})
```



因为模块加载方法是异步的，所以在app.vue页面是无法使用的，app.vue 的挂载完成先于模块加载完成，此时找不到方法。

如果不想全局挂载也不想回调使用，也可将此插件封装为公共模块，具体实现如下：

```js
export function loadSDK(fileName) {
  if (!fileName) {
    return Promise.reject(new Error('fileName is required'))
  }
  return new Promise((resolve, reject) => {
    loadMpPackage(
      'libs',
      () => {
        const sdk = loadMpPackageModule(`/libs/${fileName}.js`)
        resolve(sdk)
      },
      ({ mod, errMsg }) => {
        console.log('加载出错', mod, errMsg)
      }
    )
  })
}

// 使用
import { loadSDK } from '@/utils/index.js'
export default {
onLoad() {
  loadSDK('md5').then(({md5}) => {
    console.log('md5:', md5('11111111'))
  })
},
 // 或
  const { default: NIM } = await loadSDK("im")
  nim = NIM.getInstance(
    {
      appkey,
      debugLevel: 'info',
      apiVersion: 'v2',
      enableV2CloudConversation: true
    }
  )

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1931005175516070355
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1931005175516070355
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者：前端充电站
链接：https://zhuanlan.zhihu.com/p/1931005175516070355
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

