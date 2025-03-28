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

## vue

```ts
import { useRemoveHtmlTag } from '@/utils/useString' 
import { useSub, useDivide } from '@/utils/useCalc'

/**
 * 获取px数值
 * @param {string | number} num
 */
function getPx(num, upx2px = true, isRatio = true) {
  const ratio = isRatio ? (uni.getSystemInfoSync().devicePixelRatio || uni.getSystemInfoSync().pixelRatio) : 1
  if (typeof num === 'number') {
    return (upx2px ? uni.upx2px(num) : num) * ratio
  } else if (typeof num === 'string') {
    return getPx(parseFloat(num || 0), upx2px, isRatio)
  } else {
    return 0
  }
}

/**
 * 获取图片地址
 * @param {string} url
 * @param {string} defaultUrl - 应为本地图片
 * @return {Promise<string>}
 */
async function getImaUrl(url, defaultUrl = '') {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.setAttribute("crossOrigin", "anonymous")
    image.onload = () => {
      resolve(image)
    }
    image.onerror = async () => {
      try {
        if (defaultUrl) {
          const defaultImage = await getImaUrl(defaultUrl)
          resolve(defaultImage || image)
        } else {
          reject()
        }
      } catch (error) {
        reject(error)
      }
    }
  })
}

/** 处理背景相关 */
async function processBackground(background, borderRadius, size, position = { left: 0, top: 0 }, ctx) {
  if (background && size && Object.keys(background).length && Object.keys(size).length) {
    const [x, y] = [getPx(position['left']),getPx(position['top'])]
    if (background['url']) {
      /** 规定裁切的宽高 */
      const [w, h] = [getPx(size['w']),getPx(size['h'])]
      try {
        ctx.save()
        const img = await getImaUrl(background['url'], background['defaultUrl'])
        await processBorderRadio(borderRadius, size, position, ctx)
        /** 图片宽高比 */
        const [dw, dh] = [useDivide(w, img.width), useDivide(h, img.height)]
        const [imgW, imgH] = [isNaN(img.width) ? w : img.width, isNaN(img.height) ? h : img.height]

        if ((imgW > w && imgH > h) || (imgW < w && imgH < h)) {
          if (dw > dh) {
            ctx.drawImage(img, 0, useDivide(useSub(imgH, useDivide(h, dw)), 2), imgW, useDivide(h, dw), x, y, w, h)
          } else {
            ctx.drawImage(img, useDivide(useSub(imgW, useDivide(w, dh)), 2), 0, useDivide(w, dh), imgH, x, y, w, h)
          }
        } else {
          if (imgW < w) {
            ctx.drawImage(img, 0, useDivide(useSub(imgH, useDivide(h, dw)), 2), imgW, useDivide(h, dw), x, y, w, h)
          } else {
            ctx.drawImage(img, useDivide(useSub(imgW, useDivide(w, dh)), 2), 0, useDivide(w, dh), imgH, x, y, w, h)
          }
        }

        ctx.restore()
      } catch (error) {
        console.log(`图片获取失败: ${JSON.stringify(error)}`);
      }
    }
    
    if (background['color']) {
      ctx.save()
      const [w, h] = [getPx(size['w']), getPx(size['h'])]
      await processBorderRadio(borderRadius, size, position)
      ctx.beginPath()
      ctx.fillStyle = background['color']
      ctx.globalAlpha = background['opacity']
      ctx.closePath()
      ctx.fillRect(x, y, w, h)
      ctx.restore()
    }
  }
  return Promise.resolve()
}

/** 处理圆角相关 */
function processBorderRadio(borderRadius, size, position = { left: 0, top: 0 }, ctx) {
  if (borderRadius && size && Object.keys(size).length) {
    const [w, h] = [getPx(size['w']), getPx(size['h'])]
    const [x, y] = [getPx(position['left']), getPx(position['top'])]
    ctx.beginPath()
    ctx.fillStyle = 'transparent'
    if (Object.keys(borderRadius).length) {
      const [tl, tr, bl, br] = [getPx(borderRadius['topLeft']), getPx(borderRadius['topRight']), getPx(borderRadius['bottomLeft']), getPx(borderRadius['bottomRight'])]
      /** 左上角 */
      ctx.arc(x + tl, y + tl, tl, Math.PI, 1.5 * Math.PI)
      
      /** 上边 */
      ctx.lineTo(x + tl, y)
      ctx.lineTo(x + w - tl, y)
      
      /** 右上角 */
      ctx.arc(x + w - tr, y + tr, tr, 1.5 * Math.PI, 2 * Math.PI)
      
      /** 右边 */
      ctx.lineTo(x + w, y + tr)
      ctx.lineTo(x + w, y + h - tr)
      
      /** 右下角 */
      ctx.arc(x + w - br, y + h - br, br, 0, 0.5 * Math.PI)
      
      /** 下边 */
      ctx.lineTo(x + br, y + h)
      ctx.lineTo(x + w - br, y + h)
      
      /** 左下角 */
      ctx.arc(x + bl, y + h - bl, bl, 0.5 * Math.PI, Math.PI)
      
      /** 左边 */
      ctx.lineTo(x, y + bl)
      ctx.lineTo(x, y + h - bl)
    } else if (typeof borderRadius === 'string' || typeof borderRadius === 'number') {
      const r = getPx(borderRadius)
      ctx.arc(x + r, y + r, r, 0, 2 * Math.PI)
    }
    
    ctx.closePath()
    ctx.clip()
    ctx.fill()
  }
  return Promise.resolve()
}

/** 处理文字相关 */
function processFont(font, size, position = { left: 0, top: 0 }, ctx) {
  if (font && size && font['text'].length && Object.keys(size).length) {
    const words = dealWords(font, size, position, ctx)
    ctx.save()
    ctx.beginPath()
    if (font['color']) ctx.fillStyle = font['color']
    ctx.font = `${font['fontWeight'] || 'normal'} ${getPx(font['size'])}px sans-serif`
    ctx.closePath()
    ctx.textBaseline = 'top'
    words.forEach(item => {
      ctx.fillText(item.text, item.pos[0], item.pos[1])
    })
    ctx.restore()
  }
  return Promise.resolve()
}

/** 
 * 处理多行文字
 * @return {{
    text: string,
    pos: number[]
  }[]}
  */
function dealWords(font, size, position, ctx) {
  const [w, h] = [getPx(size['w']), getPx(size['h'])]
  const [x, y] = [getPx(position['left']), getPx(position['top'])]
  const text = useRemoveHtmlTag(font['text'])
  const allRow = Math.ceil(useDivide(getPx(ctx.measureText(text).width, false), w)) //实际总共能分多少行
  const maxRow = font['row'] || 1
  const count = allRow >= maxRow ? maxRow : allRow //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
  let endPos = 0 //当前字符串的截断点
  const lineHeight = useDivide(h, count)
  const words = []
  
  for (let i = 0; i < count; i++) {
    const nowStr = text.slice(endPos) //当前剩余的字符串
    let rowWid = 0 //每一行当前宽度
    if (getPx(ctx.measureText(nowStr).width, false) > w) {
      for (let j = 0; j < nowStr.length; j++) {
        rowWid += getPx(ctx.measureText(nowStr[j]).width, false); //当前字符串总宽度
        if (rowWid > w) {
          if (i === count - 1) {
            //如果是最后一行
            words.push({
              text: `${nowStr.slice(0, j - 2)}...`,
              pos: [x, y + i * lineHeight]
            })
          } else {
            words.push({
              text: nowStr.slice(0, j),
              pos: [x, y + i * lineHeight]
            })
          }
          endPos += j //下次截断点
          break
        }
      }
    } else {
      words.push({
        text: nowStr.slice(0),
        pos: [x, y + i * lineHeight]
      })
    }
  }
  return words
}

/**
 * 绘画
 * @param {object[]} options 
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
export default function useDraw(options, width, height) {
  const canvasW = getPx(width) || uni.getSystemInfoSync().windowWidth
  const canvasH = getPx(height) || uni.getSystemInfoSync().windowHeight

  return new Promise(async (resolve, reject) => {
    uni.showLoading({
      title: '生成中'
    })
    const canvas = document.createElement('canvas')
    canvas.width = canvasW
    canvas.height = canvasH
    const ctx = canvas.getContext('2d')

    try {
      for (let i = 0; i < options.length; i++) {
        const item = options[i]
        const base = [item['size'], item['position'], ctx]
        await processBackground(item['background'], item['borderRadius'], ...base)
        await processFont(item['font'], ...base)
      }
      resolve(canvas.toDataURL('image/png'))
    } catch (error) {
      reject()
    }
    uni.hideLoading()
  })
}

```

> 适当简写
>
> ```ts
> const lineList = [...title].reduce<string[][]>(
>         (prev, curr) => {
>           const last = prev[prev.length - 1]
>           if (last.length === 0) {
>             last.push(curr)
>           } else if (ctx.measureText(last.join('')).width >= 420) {
>             prev.push([curr])
>           } else {
>             last.push(curr)
>           }
>           return prev
>         },
>         [[]]
>       )
> ```
>
> 

## uniapp

唯一不同点为不能使用`this`（vue中this没有），而是使用`getCurrentInstance`

```ts
// import { getCurrentInstance } from 'vue';
// const instance = getCurrentInstance();

/** 获取canvas-组件内 */
export function useCanvasElementByComponent(instance: ComponentInternalInstance, id: string): Promise<UniApp.CanvasContext> {
  return new Promise(resolve => {
    uni.createSelectorQuery()
      .in(instance.proxy)
      .select(`#${id}`)
      .node()
      .exec((res: any) => {
        resolve(res[0].node)
      })
  })
}
```

