import type { CharState, MsDocBlock, TableCellBlock } from '@file-viewer/doc'

/** 二进制 .doc 的自定义字符颜色属性（sprmCCv），字节序为 [R, G, B, flag] */
const CUSTOM_COLOR_SPRM = 'sprm_6870'

/** 模型与 DOM 对不齐时，最多向后跳过多少个文本片段再放弃匹配 */
const LOOKAHEAD = 16

/** 渲染顺序上的文本片段及其自定义颜色 */
interface ColoredText {
  text: string
  color?: string
}

/** 读取 run 的自定义颜色；flag 非 0 表示自动色，交给内置调色板 */
const readCustomColor = (style: CharState): string | undefined => {
  const raw = style[CUSTOM_COLOR_SPRM]
  if (!raw || typeof raw !== 'object') return undefined
  const bytes = raw as Record<number, number>
  if (bytes[3] !== 0) return undefined
  const toHex = (value = 0) => value.toString(16).padStart(2, '0')
  return `#${toHex(bytes[0])}${toHex(bytes[1])}${toHex(bytes[2])}`
}

/** 按渲染顺序收集文本片段及其自定义颜色 */
const collectColoredTexts = (blocks: MsDocBlock[]): ColoredText[] => {
  const result: ColoredText[] = []
  const walkCell = (cell: TableCellBlock) => {
    if (cell.hidden) return
    walkBlocks(cell.blocks ?? cell.paragraphs)
  }
  const walkBlocks = (list: MsDocBlock[]) =>
    list.forEach(block => {
      if (block.type === 'table') {
        block.rows.forEach(row => row.cells.forEach(walkCell))
        return
      }
      if (block.type !== 'paragraph') return
      block.inlines.forEach(inline => {
        if (inline.type !== 'text' || !inline.text) return
        result.push({ text: inline.text, color: readCustomColor(inline.style) })
      })
    })
  walkBlocks(blocks)
  return result
}

/** 把 #rrggbb 转成 style.color 的规范化写法，便于和浏览器读回的值比较 */
const toRgb = (hex: string) => {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16))
  return `rgb(${channels.join(', ')})`
}

/** 未显式设置颜色时，黑色会跟随主题，不需要也不应该回填 */
const isRendered = (element: HTMLElement, color: string) =>
  element.style.color ? element.style.color === toRgb(color) : color === '#000000'

/** 收集渲染出的每一页排版根节点：渲染器默认挂到 Shadow DOM，需要递归穿透 */
const findRoots = (container: HTMLElement): HTMLElement[] => {
  const roots: HTMLElement[] = []
  const walk = (node: ParentNode) => {
    node.querySelectorAll<HTMLElement>('.msdoc-root').forEach(root => roots.push(root))
    node.querySelectorAll<HTMLElement>('*').forEach(element => {
      if (element.shadowRoot) walk(element.shadowRoot)
    })
  }
  walk(container)
  return roots
}

/** 按文本内容顺序把颜色回填到渲染结果上 */
const paintColors = (container: HTMLElement, texts: ColoredText[]) => {
  let cursor = 0
  findRoots(container).forEach(root => {
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const textNode = node as Text
      const value = textNode.textContent ?? ''
      const matched = value
        ? texts.findIndex((item, index) => index >= cursor && index < cursor + LOOKAHEAD && item.text === value)
        : -1
      if (matched >= 0) {
        const { color } = texts[matched]
        const element = textNode.parentElement
        cursor = matched + 1
        if (color && element && !isRendered(element, color)) element.style.color = color
      }
      node = walker.nextNode()
    }
  })
}

/**
 * NOTE: 修复二进制 .doc 的字体颜色。
 * file-viewer 的 msdoc 渲染只支持 16 色调色板：解析层虽然把 sprmCCv（自定义 RGB）
 * 原样放进了字符样式（sprm_6870），但渲染层只读取 colorIndex，自定义颜色会退化成灰色；
 * 这里重新解析文件，按文本顺序把颜色回填到 DOM。
 *
 * 颜色问题调研结论（@file-viewer/doc 3.3.3，当前最新版本）：
 * 1. 官方方案：无。MsDocRenderOptions 只有 css / reviewMode / externalLinkPolicy /
 *    externalResourcePolicy，没有颜色映射或调色板扩展配置，也无相关修复版本。
 * 2. 可直接使用的流行方案：无。浏览器端没有其他能渲染二进制 .doc 的流行 npm 包
 *    （mammoth、docx-preview 等只支持 .docx）；服务端 LibreOffice 转 PDF/HTML 属于
 *    架构改造，不是可直接使用的补丁。
 * 因此保留此补丁。
 */
export const repairMsDocColors = async (container: HTMLElement, source: File | string) => {
  const { parseMsDoc } = await import('@file-viewer/doc')
  const buffer = typeof source === 'string' ? await (await fetch(source)).arrayBuffer() : await source.arrayBuffer()
  const model = await parseMsDoc(buffer)
  paintColors(container, collectColoredTexts(model.blocks))
}
