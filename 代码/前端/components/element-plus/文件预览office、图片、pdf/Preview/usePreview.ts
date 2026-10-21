import type { MaybeRefOrGetter } from 'vue'
import type { PreviewProps, PreviewSource, PreviewType } from './types'

import { computed, ref, toValue, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { readProfileUpload } from '@/api/basic/common'
import { useDownloadFile } from '@/hooks/useDownload'
import { IMAGE_EXTS, MIME_EXT_MAP } from './types'

/** 是否为二进制源（Blob / ArrayBuffer）*/
const isBinary = (value: unknown): value is Blob | ArrayBuffer => value instanceof Blob || value instanceof ArrayBuffer

/** 解析文件扩展名：字符串取地址末段；二进制取 Blob 类型或 mime */
const resolveExt = (source: PreviewSource | undefined, mime?: string): string => {
  if (typeof source === 'string') {
    const path = source.split('?')[0]
    const idx = path.lastIndexOf('.')
    return idx > -1 ? path.slice(idx + 1).toLowerCase() : ''
  }
  const type = source instanceof Blob ? source.type || mime : mime
  return MIME_EXT_MAP[type ?? ''] ?? ''
}

/** 源转为浏览器可加载地址：二进制用 mime 构造 object URL，并返回释放函数 */
const resolveBrowserSrc = (source: PreviewSource, mime?: string): { url: string; revoke?: () => void } => {
  if (!isBinary(source)) return { url: source as string }
  const blob = source instanceof ArrayBuffer ? new Blob([source], { type: mime ?? '' }) : source
  const url = URL.createObjectURL(blob)
  return { url, revoke: () => URL.revokeObjectURL(url) }
}

/** 打印浏览器可加载地址：图片走内联文档（srcdoc 与主页面同源），跨域受限时兜底新窗口打开 */
const printUrl = (url: string, image = false, revoke?: () => void) => {
  const frame = document.createElement('iframe')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'
  frame.onload = () => {
    let fallback = false
    try {
      frame.contentWindow?.focus()
      frame.contentWindow?.print()
    } catch {
      fallback = true
      window.open(url, '_blank')
    } finally {
      setTimeout(() => {
        frame.remove()
        if (!fallback) revoke?.()
      }, 1000)
    }
  }
  if (image) frame.srcdoc = `<img src="${url}" alt="" style="max-width:100%" />`
  else frame.src = url
  document.body.appendChild(frame)
}

/**
 * NOTE: image/iframe：浏览器组件只认 URL，二进制源需转 object URL
 * props 可省略：只想用 handlePrint/handleDownload 时直接 usePreview()，调用时把文件源传进去
 */
export const usePreview = (props: MaybeRefOrGetter<PreviewProps> = {}) => {
  const get = <K extends keyof PreviewProps>(key: K) => computed(() => toValue(props)[key])

  const mainSource = get('url')
  const minIO = get('minIO')
  const mime = get('mime')

  /** 源是否为二进制 */
  const isBinarySource = computed(() => isBinary(mainSource.value))

  /** 获取文件扩展名 */
  const ext = computed(() => resolveExt(mainSource.value, mime.value))

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

  /** 是否 pdf：浏览器自带预览器已提供打印/下载，组件内不再重复渲染按钮 */
  const isPdf = computed(() => ext.value === 'pdf')

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

  /** 下载文件名：优先取源地址末段文件名，兜底按扩展名生成 */
  const fileName = computed(() => {
    const source = mainSource.value
    if (typeof source === 'string') {
      const name = source.split('?')[0].split('/').pop()
      if (name?.includes('.')) return decodeURIComponent(name)
    }
    return ext.value ? `预览文件.${ext.value}` : '预览文件'
  })

  /**
   * 打印：默认打印当前预览源，也可直接传入文件源（如接口返回的 Blob）
   * - 二进制源无浏览器地址，回退到预览源并转 object URL
   * - 图片走内联文档（srcdoc 与主页面同源），规避跨域 iframe 无法调用 print 的限制
   */
  const handlePrint = (source?: PreviewSource) => {
    const target = source ?? resolvedBrowserUrl.value ?? resolvedOfficeSrc.value
    if (!target) return
    const { url, revoke } = resolveBrowserSrc(target, mime.value)
    const image = IMAGE_EXTS.includes(resolveExt(target, mime.value) || ext.value)
    printUrl(url, image, revoke)
  }

  /**
   * 下载：优先取浏览器渲染地址，office 二进制源无地址时取预览源；
   * 二进制直接下载；字符串先 fetch 保留文件名，跨域或请求失败时兜底直链下载
   */
  const handleDownload = async () => {
    const source = resolvedBrowserUrl.value ?? resolvedOfficeSrc.value
    if (!source) return
    const name = fileName.value
    if (isBinary(source)) {
      useDownloadFile(source instanceof ArrayBuffer ? new Blob([source], { type: mime.value ?? '' }) : source, name)
      return
    }
    try {
      const res = await fetch(source)
      if (!res.ok) throw new Error('下载失败')
      useDownloadFile(await res.blob(), name)
    } catch {
      useDownloadFile(source, name, 'link')
    }
  }

  return {
    /** 文件扩展名 */
    ext,
    /** 预览类型 */
    previewType,
    /** 是否 pdf（自带打印/下载，组件内隐藏按钮） */
    isPdf,
    /** 浏览器渲染地址（image/iframe） */
    resolvedBrowserUrl,
    /** 下载文件名 */
    fileName,
    /** 打印：可传文件源，缺省打印当前预览源 */
    handlePrint,
    /** 下载浏览器渲染地址 */
    handleDownload,
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
