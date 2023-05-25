## 微信小程序

```ts
/** 获取canvas */
export function useCanvasElement(id: string): Promise<WechatMiniprogram.Canvas> {
  return new Promise(resolve => {
    wx.createSelectorQuery()
      .select(`#${id}`)
      .fields({
        node: true
      })
      .exec(res => {
        resolve(res[0].node)
      })
  })
}

/** 获取canvas-组件内 */
export function useCanvasElementByComponent(this: any, id: string): Promise<WechatMiniprogram.Canvas> {
  return new Promise(resolve => {
    this.createSelectorQuery()
      .select(`#${id}`)
      .fields({
        node: true
      })
      .exec((res: any) => {
        resolve(res[0].node)
      })
  })
}

/** 循环绘制 */
export function requestAnimationFrame(canvas: WechatMiniprogram.Canvas, draw: any) {
  canvas.requestAnimationFrame(() => {
    draw()
    // requestAnimationFrame(canvas, draw)
  })
}

/** 退出循环绘制 */
export function cancelAnimationFrame(canvas: WechatMiniprogram.Canvas, requestID: number) {
  canvas.cancelAnimationFrame(requestID)
}

/** 圆角绘制 */
export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  return ctx
}

/** 获取两点间距离 */
export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/** 导出 */
export function canvasToTempFilePath(canvas: WechatMiniprogram.Canvas): Promise<WechatMiniprogram.CanvasToTempFilePathSuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    // 导出图片
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      destWidth: canvas.width * 2,
      destHeight: canvas.height * 2,
      canvas,
      success: res => {
        setTimeout(() => {
          resolve(res)
        }, 100)
      },
      fail: () => {
        reject()
      }
    })
  })
}

```

