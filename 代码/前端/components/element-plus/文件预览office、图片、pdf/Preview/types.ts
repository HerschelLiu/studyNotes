/** 预览支持的文件源 */
export type PreviewSource = string | Blob | ArrayBuffer

export type PreviewType = 'image' | 'doc' | 'xls' | 'unsupported' | 'iframe'

export interface PreviewProps {
  /** 文件地址 */
  url?: PreviewSource
  minIO?: boolean
  /**
   * ArrayBuffer 自身不含类型信息
   */
  mime?: string
  /** 展示方式：drawer 抽屉；page 直接页面内联 */
  mode?: 'drawer' | 'page'
  /** 是否显示下载按钮（pdf 由浏览器自带预览器提供，组件内自动隐藏） */
  download?: boolean
  /** 是否显示打印按钮（pdf 由浏览器自带预览器提供，组件内自动隐藏） */
  print?: boolean
}

/** Blob MIME 类型 → 扩展名映射 */
export const MIME_EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
}

/** 浏览器可直接渲染的图片扩展名 */
export const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']

/** previewItem 暴露给父组件的方法 */
export interface PreviewItemExpose {
  /** 打印已渲染的预览内容（office 二进制源无浏览器地址时使用） */
  printRendered: () => void
}
