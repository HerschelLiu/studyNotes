<template>
  <!-- 图片 -->
  <el-image
    v-if="mode === 'page' && previewType === 'image'"
    :src="resolvedBrowserUrl"
    fit="contain"
    class="preview-page-image">
    <template #error>
      <el-empty
        :image-size="80"
        description="图片加载失败" />
    </template>
  </el-image>

  <!-- Word 预览（.docx/.doc） -->
  <div
    v-else-if="previewType === 'doc'"
    ref="officeRef"
    v-loading="isOfficeLoading"
    class="office-preview">
    <vue-office-docx
      v-if="resolvedOfficeSrc && officeHeight"
      :src="resolvedOfficeSrc"
      :style="officeStyle" />
  </div>

  <!-- Excel 预览（.xlsx/.xls）：旧版 .xls 需在 options 开启 xls -->
  <div
    v-else-if="previewType === 'xls'"
    ref="officeRef"
    v-loading="isOfficeLoading"
    class="office-preview">
    <vue-office-excel
      v-if="resolvedOfficeSrc && officeHeight"
      :src="resolvedOfficeSrc"
      :options="excelOptions"
      :style="officeStyle" />
  </div>

  <!-- 不支持在线预览的格式（.ppt/.pptx 等） -->
  <div
    v-else-if="previewType === 'unsupported'"
    ref="officeRef"
    class="office-preview"
    :style="officeStyle">
    <el-empty :description="`暂不支持 .${ext} 格式在线预览，请下载后查看`" />
  </div>

  <!-- PDF / 文本 / 视频等浏览器可渲染的格式 -->
  <div
    v-else-if="resolvedBrowserUrl"
    ref="officeRef"
    v-loading="isIframeLoading"
    class="office-preview"
    :style="officeStyle">
    <iframe
      :src="resolvedBrowserUrl"
      frameborder="no"
      class="office-iframe" />
  </div>
</template>

<script lang="ts" setup>
  import type { PreviewProps } from './types'

  import { usePreview } from './usePreview'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { useCalcHeight } from '@/hooks/useCalcHeight'
  import '@vue-office/docx/lib/index.css'
  import '@vue-office/excel/lib/index.css'

  import VueOfficeDocx from '@vue-office/docx'
  import VueOfficeExcel from '@vue-office/excel'

  /** 类型别名引用外部接口：defineProps 宏自 Vue 3.3 起支持外部类型引用 */
  type Props = PreviewProps

  const props = withDefaults(defineProps<Props>(), {
    url: undefined,
    minIO: true,
    mime: undefined,
    mode: 'drawer',
  })

  const {
    ext,
    previewType,
    resolvedBrowserUrl,
    isIframeLoading,
    resolvedOfficeSrc,
    isOfficeLoading,
    excelOptions,
  } = usePreview(props)

  /** 预览容器 ref：doc/xls/unsupported/iframe 四分支互斥，同一 ref 名 */
  const { officeRef } = useTempRefs<HTMLElement>('officeRef')

  const { height: officeHeight } = useCalcHeight(officeRef, {
    enabled: computed(() => ['doc', 'xls', 'unsupported', 'iframe'].includes(previewType.value)),
    observeGap: false,
    bottomOffset: props.mode === 'drawer' ? 20 : 16,
    minHeight: '60vh',
    footerSelector: '.copyright',
  })

  const officeStyle = computed(() => (officeHeight.value ? { height: `${officeHeight.value}px` } : {}))
</script>

<style lang="scss" scoped>
  .office-preview {
    overflow: auto;
  }

  .office-iframe {
    display: block;
    width: 100%;
    height: 100%;
  }

  .preview-page-image {
    max-width: 100%;
    max-height: 70vh;
  }
</style>
