```ts
import { isArray } from './useValidate'

/** 获取wxml节点 */
export function useElement(id: string): Promise<Rect> {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(`#${id}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res && isArray(res) && res.length) resolve(res[0])
      else reject()
    })
  })
}

/** 获取组件类wxml节点 */
export function useElementByComponent(this: WxComponent, id: string): Promise<Rect> {
  return new Promise((resolve, reject) => {
    const query = this.createSelectorQuery()
    query.select(`#${id}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res: Rect[]) {
      if (res && isArray(res) && res.length) resolve(res[0])
      else reject()
    })
  })
}

```

