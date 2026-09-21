import type { MaybeRefOrGetter } from 'vue'
import type { PreviewProps, PreviewSource, PreviewType } from './types'

import { computed, ref, toValue, watch } from 'vue'
import { commonDownloadResource } from '@/api/common'
import { readProfileUpload } from '@/api/basic/common'
import { IMAGE_EXTS, MIME_EXT_MAP } from './types'

/**
 * NOTE: image/iframe：浏览器组件只认 URL，二进制源需转 object URL
 */
export const usePreview = (props: MaybeRefOrGetter<PreviewProps>) => {
  const get = <K extends keyof PreviewProps>(key: K) => computed(() => toValue(props)[key])

  const mainSource = get('url')
  const minIO = get('minIO')
  const mime = get('mime')

  /** 是否为二进制源（Blob / ArrayBuffer）*/
  const isBinary = (value: unknown): value is Blob | ArrayBuffer => value instanceof Blob || value instanceof ArrayBuffer

  /** 源是否为二进制 */
  const isBinarySource = computed(() => isBinary(mainSource.value))

  /** 获取文件扩展名 */
  const ext = computed(() => {
    const source = mainSource.value
    if (typeof source === 'string') {
      const path = source.split('?')[0]
      const idx = path.lastIndexOf('.')
      return idx > -1 ? path.slice(idx + 1).toLowerCase() : ''
    }
    const type = source instanceof Blob ? source.type || mime.value : mime.value
    return MIME_EXT_MAP[type ?? ''] ?? ''
  })

  /** 预览类型 */
  const previewType = computed<PreviewType>(() => {
    const e = ext.value
    if (IMAGE_EXTS.includes(e)) return 'image'
    if (['docx', 'doc'].includes(e)) return 'doc'
    if (['xls', 'xlsx'].includes(e)) return 'xls'
    if (['ppt', 'pptx'].includes(e)) return 'unsupported'
    return 'iframe'
  })

  const needBrowserUrl = computed(() => previewType.value === 'image' || previewType.value === 'iframe')

  /**
   * image/iframe 二进制源的 object URL：
   */
  const binaryObjectUrl = ref<string>()
  watch(
    [mainSource, mime],
    ([source, mimeType], _old, onCleanup) => {
      binaryObjectUrl.value = undefined
      if (!needBrowserUrl.value || !isBinary(source)) return

      const blob = source instanceof ArrayBuffer ? new Blob([source], { type: mimeType ?? '' }) : source
      const url = URL.createObjectURL(blob)
      binaryObjectUrl.value = url
      onCleanup(() => URL.revokeObjectURL(url))
    },
    { immediate: true }
  )

  const { data: officeBuffer, isLoading: isOfficeLoading } = useQuery({
    queryKey: ['PREVIEW_OFFICE_BUFFER', typeof mainSource.value === 'string' ? mainSource.value : ''],
    queryFn: async () => commonDownloadResource(mainSource.value as string),
    enabled: computed(
      () => !isBinarySource.value && !!mainSource.value && minIO.value !== false && (previewType.value === 'doc' || previewType.value === 'xls')
    )
  })

  /** office 预览源 */
  const resolvedOfficeSrc = computed<PreviewSource | undefined>(() => (isBinarySource.value ? mainSource.value : officeBuffer.value))

  /** Excel 渲染选项：旧版 .xls（非 .xlsx）需显式开启 xls */
  const excelOptions = computed(() => ({ xls: ext.value === 'xls' }))

  /** image/iframe */
  const { data: fetchedBrowserUrl, isLoading: isIframeLoading } = useQuery({
    queryKey: ['PREVIEW_BROWSER_URL', typeof mainSource.value === 'string' ? mainSource.value : ''],
    queryFn: async () => {
      const { url } = await readProfileUpload(mainSource.value as string)
      return url
    },
    enabled: computed(() => !isBinarySource.value && !!mainSource.value && minIO.value !== false && needBrowserUrl.value)
  })

  /** 浏览器渲染地址：二进制用 object URL；字符串优先接口换取，兜底原地址 */
  const resolvedBrowserUrl = computed(() => {
    if (isBinarySource.value) return binaryObjectUrl.value
    return fetchedBrowserUrl.value || (typeof mainSource.value === 'string' ? mainSource.value : undefined)
  })

  return {
    /** 文件扩展名 */
    ext,
    /** 预览类型 */
    previewType,
    /** 浏览器渲染地址（image/iframe） */
    resolvedBrowserUrl,
    /** iframe 加载中 */
    isIframeLoading,
    /** office（doc/xls）预览源：string / Blob / ArrayBuffer */
    resolvedOfficeSrc,
    /** office 加载中 */
    isOfficeLoading,
    /** vue-office-excel 渲染选项 */
    excelOptions
  }
}
