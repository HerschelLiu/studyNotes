```ts
import { isHaveValue } from './useValidate'

/** 商品描述转化为图片数组 */
export function getImgsByDescribe(str: string): string[] {
  if (!str) return []
  try {
    // 获取所有img标签
    const patt1 = /(<img|< img)[^>]*src[="'\s]+[^.]*\/([^.]+)\.[^"']+["']?[^>]*>/g
    // 获取所有src属性
    const patt2 = /\bsrc\b\s*=\s*['"]?([^'"]*)['"]?/g
    // 获取所有src属性中的url
    const patt3 = /(https|http|\/uploadfile)(.*)(jpg|png|jpeg|gif)(.*)(?=")/g
    const newarr0 = str.match(patt1)
    if (newarr0 === null) return []
    const newarr: string[] = []
    newarr0.forEach(item => {
      const arr = item.match(patt2)
      if (arr) newarr.push(arr[0])
    })
    const newarr2: string[] = []
    newarr.forEach(item => {
      const arr = item.match(patt3)
      if (arr) newarr2.push(arr[0])
    })
    return newarr2
  } catch (error) {
    return []
  }
}

/** 获取富文本数组 */
export function getNodesArray(content: string) {
  const imgarr = getImgsByDescribe(content)
  content = content
    .replace(
      /< ?\/?[a|abbr|address|article|aside|b|bdi|bdo|big|blockquote|br|caption|center|cite|code|col|colgroup|dd|del|div|dl|dt|em|fieldse|font|footer|h1|h2|h3|h4|h5|h6|header|hr|i|ins|img|label|legend|li|mark|nav|ol|p|pre|q|rt|ruby|s|section|small|span|strong|sub|sup|table|tbody|td|tfoot|th|thead|tr|tt|u|ul].*?>|\n/g,
      $1 => {
        return $1.startsWith('<img') || $1.startsWith('< img') ? '$$img$$' : '$$div$$'
      }
    )
    .replace(/\$\$div\$\$/g, '<div>')
  const nodesArray = content
    .split('$$img')
    .filter(item => isHaveValue(item))
    .flatMap(item => item.split('$$'))
    .filter(item => item !== '<div>')
    .map((item, index) => {
      return {
        nodes: item.startsWith('<img') || item === '' ? item : `<div style="padding: 12px; line-height: 1.5; font-size: 14px;">${item}</div>`,
        index: index
      }
    })
  imgarr.forEach((img, index) => {
    const $index = nodesArray.findIndex(item => item.nodes === '')
    nodesArray[$index].nodes = `<img style="max-width: 100%; height: auto; display: block; margin: 0;" src="${img}">`
    nodesArray[$index].index = index
  })
  return nodesArray
}

/** 大数字处理 */
export function getStringByBigNumber(number: number, unit = 'w'): string {
  if (number > 10000) return (number / 10000).toFixed(1) + unit
  return number.toString()
}

/** 格式化手机号码 */
export function getPhoneNumberStyle(mobilePhone: string, split = ' ') {
  const reg = /(?=(\B)(\d{4})+$)/g
  return mobilePhone.replace(reg, split)
}

/** 数字转中文 */
export function useNumberToChinese(number: number) {
  if (typeof number === 'object' || typeof number === 'undefined') {
    return ''
  }
  const [int, decimal] = (+number || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{4})+$)/g, ','))
    .split('.')
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const groupUnit = ['', '万', '亿']
  const unit = ['', '十', '百', '千']
  let list: string[] = []
  int.split(',').forEach(item => {
    list.push(
      item
        .split('')
        .reverse()
        .map((i, index) => changeNum[Number(i)] + unit[index])
        .reverse()
        .join('')
    )
  })
  list = list.reverse().map((item, index) => {
    return item.replace(/零千/, '零').replace(/零百/, '零').replace(/零十/, '零').replace(/零+/, '零') + groupUnit[index]
  })
  let front = list.reverse().join('')
  if (front[front.length - 1] === '零') {
    front = front.substring(0, front.length - 1)
  }
  if (front === '') {
    front = '零'
  }
  if (front.startsWith('一十')) {
    front = front.substring(1, front.length)
  }
  const arr = [front]
  if (decimal) {
    arr.push('点')
    arr.push(
      decimal
        .split('')
        .map(i => changeNum[Number(i)])
        .join('')
    )
  }
  return arr.join('')
}

export const useSleep = (ms: number) => new Promise<Date>(resolve => setTimeout(() => resolve(new Date()), ms))

```

