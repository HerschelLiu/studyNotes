import type { MaybeRefOrGetter } from 'vue'
import type { PreviewProps, PreviewSource, PreviewType } from './types'

import { computed, ref, toValue, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
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

  /** 是否需要浏览器渲染 */
  const needBrowserUrl = computed(() => previewType.value === 'image' || previewType.value === 'iframe')

  /**
   * image/iframe 二进制源的 object URL：
   * - mainSource 为 Blob → 直接包装
   * - mainSource 为 ArrayBuffer → 用 mime 类型构造 Blob
   * - 其他（非二进制 / 非浏览器渲染场景）→ undefined，useObjectUrl 自动释放
   */
  const objectBlob = computed<Blob | undefined>(() => {
    const source = mainSource.value
    if (!needBrowserUrl.value || !isBinary(source)) return undefined
    return source instanceof ArrayBuffer ? new Blob([source], { type: mime.value ?? '' }) : source
  })
  const binaryObjectUrl = useObjectUrl(objectBlob)

  /** image/iframe/office：通过 readProfileUpload 获取文件地址 */
  const { data: fetchedBrowserUrl, isLoading: isIframeLoading } = useQuery({
    queryKey: ['PREVIEW_BROWSER_URL', typeof mainSource.value === 'string' ? mainSource.value : ''],
    queryFn: async () => {
      const { url } = await readProfileUpload(mainSource.value as string)
      return url
    },
    enabled: computed(
      () =>
        !isBinarySource.value &&
        !!mainSource.value &&
        minIO.value !== false &&
        (needBrowserUrl.value || previewType.value === 'doc' || previewType.value === 'xls')
    )
  })

  /** office 预览源 */
  const resolvedOfficeSrc = computed<PreviewSource | undefined>(() => {
    if (isBinarySource.value) return mainSource.value
    if (minIO.value === false) return typeof mainSource.value === 'string' ? mainSource.value : undefined
    return fetchedBrowserUrl.value
  })

  /** office 加载状态：src 变化时重置为 true,组件渲染完成/出错时置 false */
  const isOfficeLoading = ref(true)
  /** office 加载错误提示：src 变化时清空,出错时填充友好文案 */
  const officeErrorMsg = ref('')
  const handleOfficeRendered = () => {
    isOfficeLoading.value = false
    officeErrorMsg.value = ''
  }
  const handleOfficeError = () => {
    isOfficeLoading.value = false
    officeErrorMsg.value = '预览失败，请下载后查看'
  }
  watch(resolvedOfficeSrc, () => {
    isOfficeLoading.value = true
    officeErrorMsg.value = ''
  })

  /** Excel 渲染选项：旧版 .xls（非 .xlsx）需显式开启 xls */
  const excelOptions = computed(() => ({
    xls: ext.value === 'xls',
    /**
     * WPS 生成的 xlsx 含 =DISPIMG(...) 公式（嵌入式图片），x-spreadsheet 公式求值器
     * 无法识别该函数会抛 TypeError，触发 vue-office-excel 的 catch 分支加载空数据导致空白。
     * 渲染前剥离以 = 开头的未知公式文本（正常公式 result 为数值不会以 = 开头）。
     */
    transformData: (workbookData: any[]) => {
      workbookData.forEach(sheet => {
        if (!sheet?.rows) return
        Object.values(sheet.rows).forEach((row: any) => {
          if (!row?.cells) return
          Object.values(row.cells).forEach((cell: any) => {
            if (typeof cell?.text === 'string' && cell.text.startsWith('=')) cell.text = ''
          })
        })
      })
      return workbookData
    }
  }))

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
    /** office 加载错误提示文案 */
    officeErrorMsg,
    /** vue-office-excel 渲染选项 */
    excelOptions,
    /** office 组件渲染完成事件 */
    handleOfficeRendered,
    /** office 组件渲染出错事件 */
    handleOfficeError
  }
}
