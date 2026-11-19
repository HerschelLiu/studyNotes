import type { FileViewerToolbarOptions } from '@file-viewer/core'

/** 预览支持的文件源 */
export type PreviewSource = string | Blob | ArrayBuffer

/** 预览渲染方式：image Element 图片；file 文件预览器；iframe 浏览器内嵌 */
export type PreviewType = 'image' | 'file' | 'iframe'

export interface PreviewProps {
  /** 文件地址 */
  url?: PreviewSource
  /**
   * 下载文件名（建议含扩展名）。
   * file-viewer 默认取地址末段作为文件名，MinIO / OSS 等地址多为 UUID 英文名，
   * 传入业务文件名后下载即使用该名称。
   */
  fileName?: string
  /**
   * 字符串地址解析器：用于 MinIO / 阿里 OSS / 腾讯 COS 等对象存储换取可访问地址。
   * 支持同步返回或异步请求接口；不传则原样使用 url（地址本身可直接访问）。
   * 解析失败时回退使用原始地址。
   */
  resolveUrl?: (url: string) => string | Promise<string>
  /**
   * ArrayBuffer 自身不含类型信息
   */
  mime?: string
  /** 展示方式：drawer 抽屉；page 直接页面内联 */
  mode?: 'drawer' | 'page'
  /** 图片渲染方式：element 用 el-image / el-image-viewer（默认）；file-viewer 交给文件预览器 */
  imageViewer?: 'element' | 'file-viewer'
  /**
   * file-viewer 工具栏配置，支持其全部配置项（download / print / exportHtml / zoom /
   * search / theme / order / items / permissions / position / before*）。
   * 默认 download / zoom 为 true，search / theme / exportHtml 为 false；
   * print 由 showPrint / useBuiltinPrint 控制，传入无效。
   */
  toolbar?: FileViewerToolbarOptions
  /** 是否显示自定义打印按钮（直接打印，不新开页面），默认 true */
  showPrint?: boolean
  /** 是否改用 file-viewer 内置打印菜单（支持遮盖后再打印等），开启后隐藏自定义打印按钮 */
  useBuiltinPrint?: boolean
}

/** Blob MIME 类型 → 扩展名映射（二进制源无文件名时用于识别类型） */
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
