import { fileViewerRenderers } from '@file-viewer/vite-plugin'

/**
 * 项目只预览 PDF / 图片 / Office（Word、Excel），只装配对应 renderer。
 * 使用 @file-viewer/vue3-full / preset-all 会把 30+ 条渲染链路和 200MB+ 资源一起装进来，
 * 导致开发启动变慢、构建产物膨胀，因此这里改为标准包 + 按需 renderer。
 * PPT（.ppt / .pot / .pptx）已确认不需要预览，不再装配 presentation renderer。
 * 新增预览类型时，同时补充本数组与 package.json 中对应的 renderer / assets 包。
 */
const FILE_VIEWER_RENDERERS: readonly string[] = ['pdf', 'word', 'spreadsheet', 'image']

/**
 * file-viewer 渲染器资源：只把所有已装配 renderer 的 Worker / WASM / 字体复制到
 * public/file-viewer（构建后为 dist/file-viewer），与运行时默认资源基址 `/file-viewer/` 一致。
 */
export default function createFileViewer() {
  return fileViewerRenderers({
    renderers: FILE_VIEWER_RENDERERS,
    copyAssets: { baseDir: 'file-viewer' }
  })
}
