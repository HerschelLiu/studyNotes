<template>
  <!-- 图片 · Element 渲染 -->
  <el-image
    v-if="previewType === 'image'"
    :src="browserUrl"
    fit="contain"
    class="preview-image">
    <template #error>
      <el-empty
        :image-size="80"
        description="图片加载失败" />
    </template>
  </el-image>

  <!-- file-viewer：下载 / 导出 / 打印使用组件自带工具栏 -->
  <div
    v-else-if="previewType === 'file'"
    ref="viewerRef"
    class="preview-content"
    :style="contentStyle">
    <FileViewer
      :key="viewerKey"
      :file="sourceFile"
      :url="remoteUrl"
      :filename="fileName"
      :options="viewerOptions"
      class="preview-viewer"
      @load-complete="handleLoadComplete"
      @error="handleViewerError">
      <template #toolbar-end="{ api, availability }">
        <button
          v-if="showPrint && !useBuiltinPrint && availability.print"
          type="button"
          style="
            min-width: var(--_file-viewer-toolbar-button-min-width, 34px);
            height: var(--_file-viewer-toolbar-button-height, 30px);
            padding: var(--_file-viewer-toolbar-button-padding, 0 10px);
            border: 0;
            border-radius: var(--_file-viewer-toolbar-button-radius, 6px);
            background: transparent;
            color: inherit;
            font: inherit;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
          "
          @click="handlePrint(api)"
          @mouseenter="handlePrintHover($event, true)"
          @mouseleave="handlePrintHover($event, false)">
          打印
        </button>
      </template>
    </FileViewer>
  </div>

  <!-- 其余类型：浏览器 iframe -->
  <div
    v-else-if="browserUrl"
    ref="viewerRef"
    v-loading="isLoading"
    class="preview-content"
    :style="contentStyle">
    <iframe
      :src="browserUrl"
      frameborder="no"
      class="preview-iframe" />
  </div>
</template>

<script lang="ts" setup>
  /**
   * 文件预览：@file-viewer/vue3 3.3.3（Apache-2.0，Copyright 2026 Flyfish Viewer）
   * 来源：https://github.com/flyfish-dev/file-viewer
   * 按需 renderer（PDF / Word / Excel / 图片）由 vite/plugins/file-viewer.ts 装配。
   */
  import type { FileViewerOptions, FileViewerPublicApi } from '@file-viewer/core'
  import type { PreviewProps } from './types'

  import { usePreview } from './usePreview'
  import { repairMsDocColors } from './msDocColors'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { useCalcHeight } from '@/hooks/useCalcHeight'
  import { useError } from '@/hooks/useTip'
  import '@file-viewer/vue3/dist/vue3.css'

  import { FileViewer } from '@file-viewer/vue3'

  /** 类型别名引用外部接口：defineProps 宏自 Vue 3.3 起支持外部类型引用 */
  type Props = PreviewProps

  const props = withDefaults(defineProps<Props>(), {
    url: undefined,
    resolveUrl: undefined,
    mime: undefined,
    imageViewer: 'element',
    toolbar: () => ({}),
    showPrint: true,
    useBuiltinPrint: false,
  })

  const { ext, previewType, remoteUrl, browserUrl, sourceFile, isLoading, fileName } = usePreview(props)

  /** 预览容器 ref：file / iframe 分支互斥，同一 ref 名 */
  const { viewerRef } = useTempRefs<HTMLElement>('viewerRef')

  const { height } = useCalcHeight(viewerRef, {
    enabled: computed(() => previewType.value !== 'image'),
    observeGap: false,
    bottomOffset: 16,
    minHeight: '60vh',
    footerSelector: '.copyright',
  })

  const contentStyle = computed(() => (height.value ? { height: `${height.value}px` } : {}))

  /**
   * file-viewer 工具栏配置：透传消费方传入的全部工具栏配置项。
   * 默认 download / zoom 开启，search / theme / exportHtml 关闭；
   * print 由 useBuiltinPrint 决定，false 时使用下方自定义的直接打印按钮。
   */
  const viewerOptions = computed<FileViewerOptions>(() => ({
    toolbar: {
      download: true,
      zoom: true,
      search: false,
      theme: false,
      exportHtml: false,
      ...props.toolbar,
      print: props.useBuiltinPrint,
    },
  }))

  /** 打印目标：常驻隐藏 iframe，避免 window.open 打开新页面或被弹窗拦截 */
  let printFrame: HTMLIFrameElement | null = null

  const ensurePrintWindow = () => {
    if (printFrame?.isConnected) return printFrame.contentWindow
    const frame = document.createElement('iframe')
    frame.tabIndex = -1
    frame.setAttribute('aria-hidden', 'true')
    // 不能用 display:none，否则部分浏览器不渲染 iframe 内容，print() 会失效
    frame.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0'
    document.body.appendChild(frame)
    printFrame = frame
    // 同步写入标准模式空文档，跳过库内对 about:blank 的修复，避免初始化超时
    const frameDocument = frame.contentDocument
    frameDocument?.open()
    frameDocument?.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
    frameDocument?.close()
    return frame.contentWindow
  }

  const isPrinting = ref(false)

  const handlePrint = async (api: FileViewerPublicApi) => {
    if (isPrinting.value) return
    const printWindow = ensurePrintWindow()
    if (!printWindow) {
      useError('打印失败：无法初始化打印窗口')
      return
    }
    isPrinting.value = true
    try {
      await api.printRenderedHtml({ printWindow })
    } finally {
      isPrinting.value = false
    }
  }

  const handlePrintHover = (event: MouseEvent, hover: boolean) => {
    const button = event.currentTarget as HTMLElement
    button.style.background = hover ? 'var(--file-viewer-button-hover-bg, rgba(33, 163, 102, 0.1))' : 'transparent'
  }

  /**
   * 打印失败时组件会把预览切换为错误态；这里重新挂载预览并只在顶部提示，
   * 非打印错误保持组件默认的错误展示。
   */
  const viewerKey = ref(0)
  const handleViewerError = (message: string) => {
    if (!isPrinting.value) return
    useError(message)
    viewerKey.value += 1
  }

  onBeforeUnmount(() => {
    printFrame?.remove()
    printFrame = null
  })

  /** 旧版 .doc 的自定义字体颜色在渲染器中会退化成灰色，渲染完成后回填 */
  const handleLoadComplete = () => {
    const container = viewerRef.value
    const file = sourceFile.value ?? remoteUrl.value
    if (ext.value !== 'doc' || !container || !file) return
    repairMsDocColors(container, file).catch(() => {})
  }
</script>

<style lang="scss" scoped>
  .preview-image {
    max-width: 100%;
    max-height: 70vh;
  }

  .preview-content {
    overflow: auto;
  }

  .preview-viewer {
    width: 100%;
    height: 100%;
  }

  .preview-iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
