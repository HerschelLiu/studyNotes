```ts
import { useConfirm } from '@/hooks/useTip'

import { useTimeStamp } from './useDate'

let htmlText = ''

/** 打包模式下的提示刷新 */
export async function useHotUpdate() {
  htmlText = await getHtmlText()
  const timer = setInterval(async () => {
    const _htmlText = await getHtmlText()
    if (_htmlText === '') return
    if (htmlText === '') {
      htmlText = _htmlText
      return
    }
    if (htmlText !== _htmlText) {
      clearInterval(timer)
      await useConfirm(
        '站点功能已更新，为了避免资源加载失败需要刷新后方可正常访问本站。如若刷新后仍无法访问，可尝试使用强制刷新。强制刷新方法：Windows： ctrl + F5；Mac： command + shift + R',
        '更新提示',
        {
          confirmButtonText: '马上刷新',
          cancelButtonText: '暂不刷新',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      )
      window.location.reload()
    }
  }, 10 * 1000)
}

async function getHtmlText() {
  try {
    const regrex = /(?<=src="|href=").*?(?=".*?>)/gm
    let htmlText = await fetch(`/?_t=${useTimeStamp()}`).then(res => res.text())
    htmlText = htmlText.replace(/\n/g, '')
    const result: string[] = []
    let match
    while ((match = regrex.exec(htmlText))) {
      result.push(match[0])
    }
    return result.join('')
  } catch (error) {
    return ''
  }
}

```

