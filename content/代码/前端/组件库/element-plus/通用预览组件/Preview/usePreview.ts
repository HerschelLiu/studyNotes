import type { MaybeRefOrGetter } from 'vue'
import type { PreviewProps, PreviewSource, PreviewType } from './types'

import { computed, ref, toValue, watch } from 'vue'
import { useAsyncState, useObjectUrl } from '@vueuse/core'
import { DEFAULT_RENDERER_DEFINITIONS, IMAGE_EXTENSIONS } from '@file-viewer/core'
import { MIME_EXT_MAP } from './types'

/**
 * 已装配的 file-viewer renderer，与 vite/plugins/file-viewer.ts 保持一致。
 * 项目只预览 PDF / 图片 / Office，其余扩展名回退浏览器 iframe，
 * 避免引入全量扩展名后进入「需要装配预览能力」的空态。
 */
const FILE_VIEWER_RENDERER_IDS: readonly string[] = [
  'pdf',
  'office-word-openxml',
  'office-word-binary',
  'open-document',
  'spreadsheet-openxml',
  'spreadsheet-dbf',
  'image'
]

/** 已装配 renderer 覆盖的扩展名（file-viewer 渲染） */
const SUPPORTED_EXTS: readonly string[] = DEFAULT_RENDERER_DEFINITIONS.filter(definition => FILE_VIEWER_RENDERER_IDS.includes(definition.id)).flatMap(
  definition => definition.extensions
)
/** 官方声明支持的图片扩展名（Element 渲染分支使用） */
const IMAGE_EXTS: readonly string[] = IMAGE_EXTENSIONS

/** 是否为二进制源（Blob / ArrayBuffer）*/
const isBinary = (value: unknown): value is Blob | ArrayBuffer => value instanceof Blob || value instanceof ArrayBuffer

/** 去掉 MIME 参数并统一小写：application/pdf;charset=UTF-8 → application/pdf */
const normalizeMime = (value?: string) => value?.split(';')[0].trim().toLowerCase() ?? ''

/** 解析文件扩展名：字符串取地址末段；二进制优先用 mime，其次 Blob 类型 */
const resolveExt = (source: PreviewSource | undefined, mime?: string): string => {
  if (typeof source === 'string') {
    const path = source.split('?')[0]
    const idx = path.lastIndexOf('.')
    return idx > -1 ? path.slice(idx + 1).toLowerCase() : ''
  }
  const candidates = [mime, source instanceof Blob ? source.type : undefined]
  const type = candidates.map(normalizeMime).find(value => MIME_EXT_MAP[value])
  return type ? MIME_EXT_MAP[type] : ''
}

/**
 * 按文件头识别真实类型，用于服务端未返回可识别 MIME 的二进制源（空 / octet-stream / 带参数）。
 * Safari 会把 MIME 无法识别的 blob 地址当下载处理，因此必须尽量识别出真实类型。
 * 动态导入 file-type：只在需要嗅探时加载，不影响首屏体积。
 */
const sniffBinaryExt = async (value: Blob | ArrayBuffer): Promise<string> => {
  const { fileTypeFromBlob, fileTypeFromBuffer } = await import('file-type')
  const type = value instanceof Blob ? await fileTypeFromBlob(value) : await fileTypeFromBuffer(value)
  return type ? (MIME_EXT_MAP[type.mime] ?? '') : ''
}

/**
 * NOTE: file-viewer 支持的类型远多于浏览器内嵌能力，统一优先交由 file-viewer 渲染；
 * 仅图片在 imageViewer='element' 时由 Element 渲染，其余不支持的扩展名回退 iframe。
 * props 可省略：直接 usePreview() 即可只读取预览类型。
 */
export const usePreview = (props: MaybeRefOrGetter<PreviewProps> = {}) => {
  const source = computed(() => toValue(props).url)
  const resolveUrl = computed(() => toValue(props).resolveUrl)
  const mime = computed(() => toValue(props).mime)
  const imageViewer = computed(() => toValue(props).imageViewer ?? 'element')

  /** 源是否为二进制 */
  const isBinarySource = computed(() => isBinary(source.value))

  /** MIME 可直接识别的扩展名 */
  const mimeExt = computed(() => resolveExt(source.value, mime.value))

  /** 文件头嗅探出的扩展名（MIME 不可用时兜底） */
  const sniffedExt = ref('')

  /** 嗅探中：期间不创建 blob 地址，避免 Safari 把未知类型的 blob 直接下载 */
  const isInspecting = ref(false)

  /** 嗅探任务序号：源切换后丢弃过期结果 */
  let inspectId = 0

  watch(
    [source, mime],
    async ([value]) => {
      const id = ++inspectId
      sniffedExt.value = ''

      if (!isBinary(value) || mimeExt.value) {
        isInspecting.value = false
        return
      }

      isInspecting.value = true
      try {
        const next = await sniffBinaryExt(value)
        if (id === inspectId) sniffedExt.value = next
      } finally {
        if (id === inspectId) isInspecting.value = false
      }
    },
    { immediate: true }
  )

  /** 获取文件扩展名 */
  const ext = computed(() => mimeExt.value || sniffedExt.value)

  /** 文件名：优先业务传入的 fileName，其次源地址末段，兜底按扩展名生成（file-viewer 依赖文件名识别类型） */
  const fileName = computed(() => {
    const explicit = toValue(props).fileName
    // 未带扩展名时补上识别出的扩展名，避免下载文件无后缀
    if (explicit) return ext.value && !explicit.toLowerCase().endsWith(`.${ext.value}`) ? `${explicit}.${ext.value}` : explicit
    const value = source.value
    if (typeof value === 'string') {
      const name = value.split('?')[0].split('/').pop()
      if (name?.includes('.')) return decodeURIComponent(name)
    }
    return ext.value ? `预览文件.${ext.value}` : '预览文件'
  })

  /** 预览类型 */
  const previewType = computed<PreviewType>(() => {
    const value = ext.value
    if (imageViewer.value === 'element' && IMAGE_EXTS.includes(value)) return 'image'
    if (SUPPORTED_EXTS.includes(value)) return 'file'
    return 'iframe'
  })

  /** 字符串源地址（二进制源无地址） */
  const sourceUrl = computed(() => (typeof source.value === 'string' ? source.value : ''))

  /** 地址解析：未传 resolveUrl 时原样返回，解析失败回退原始地址 */
  const loadResolvedUrl = async () => {
    const value = sourceUrl.value
    if (!value) return ''
    const resolver = resolveUrl.value
    if (!resolver) return value
    try {
      return (await resolver(value)) || value
    } catch {
      /** 解析失败回退原始地址，由浏览器 / 预览器自行提示 */
      return value
    }
  }

  /**
   * useAsyncState 内部按执行序号丢弃过期结果，无需手写竞态标记；
   * resetOnExecute 保证每次解析前先清空旧地址。
   */
  const { state: resolvedUrl, isLoading, execute: resolveSourceUrl } = useAsyncState(loadResolvedUrl, '', { immediate: false, resetOnExecute: true })

  watch(
    [sourceUrl, resolveUrl],
    ([value]) => {
      if (!value) {
        resolvedUrl.value = ''
        return
      }
      resolveSourceUrl()
    },
    { immediate: true }
  )

  /** 远程地址：字符串源经解析器换取，二进制源无地址 */
  const remoteUrl = computed(() => {
    if (typeof source.value !== 'string') return undefined
    return resolvedUrl.value || undefined
  })

  /** file-viewer 二进制源：补上文件名与类型 */
  const sourceFile = computed<File | undefined>(() => {
    const value = source.value
    if (!isBinary(value) || previewType.value !== 'file') return undefined
    const type = mime.value || (value instanceof Blob ? value.type : '')
    const blob = value instanceof ArrayBuffer ? new Blob([value], { type }) : value
    return new File([blob], fileName.value, { type: type || blob.type })
  })

  /** image / iframe 二进制源的 object URL（useObjectUrl 自动释放） */
  const objectBlob = computed<Blob | undefined>(() => {
    const value = source.value
    if (!isBinary(value) || previewType.value === 'file' || isInspecting.value) return undefined
    return value instanceof ArrayBuffer ? new Blob([value], { type: mime.value ?? '' }) : value
  })
  const objectUrl = useObjectUrl(objectBlob)

  /** 浏览器渲染地址（image / iframe）：解析中先用原始地址占位 */
  const browserUrl = computed(() => {
    if (isBinarySource.value) return objectUrl.value
    return resolvedUrl.value || (typeof source.value === 'string' ? source.value : undefined)
  })

  return {
    /** 文件扩展名 */
    ext,
    /** 下载文件名 */
    fileName,
    /** 预览类型 */
    previewType,
    /** file-viewer 远程地址 */
    remoteUrl,
    /** image / iframe 浏览器地址 */
    browserUrl,
    /** file-viewer 二进制源 */
    sourceFile,
    /** 远程地址解析中 */
    isLoading
  }
}
