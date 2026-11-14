<template>
  <!-- 图片 · Element 渲染：抽屉模式直接全屏查看，不打开抽屉 -->
  <el-image-viewer
    v-if="mode === 'drawer' && show && previewType === 'image' && browserUrl"
    :url-list="[browserUrl]"
    teleported
    @close="show = false" />

  <!-- 抽屉模式 · 图片以外的类型 -->
  <CompDrawer
    v-else-if="mode === 'drawer'"
    v-model="show"
    title="预览"
    :enable-scroll="false"
    :show-save-button="false">
    <PreviewItem
      :url="url"
      :resolve-url="resolveUrl"
      :mime="mime"
      :file-name="fileName"
      :image-viewer="imageViewer"
      :toolbar="toolbar"
      :show-print="showPrint"
      :use-builtin-print="useBuiltinPrint" />
  </CompDrawer>

  <!-- 页面模式 -->
  <PreviewItem
    v-else-if="url"
    :url="url"
    :resolve-url="resolveUrl"
    :mime="mime"
    :file-name="fileName"
    :image-viewer="imageViewer"
    :toolbar="toolbar"
    :show-print="showPrint"
    :use-builtin-print="useBuiltinPrint" />
</template>

<script lang="ts" setup>
  import type { PreviewProps } from './types'

  import { usePreview } from './usePreview'

  import CompDrawer from '@/components/Drawer/index.vue'
  import PreviewItem from './previewItem.vue'

  /** 类型别名引用外部接口：defineProps 宏自 Vue 3.3 起支持外部类型引用 */
  type Props = PreviewProps

  const props = withDefaults(defineProps<Props>(), {
    url: undefined,
    resolveUrl: undefined,
    mime: undefined,
    mode: 'drawer',
    imageViewer: 'element',
    toolbar: () => ({}),
    showPrint: true,
    useBuiltinPrint: false,
  })

  /** 抽屉模式下控制显隐 */
  const show = defineModel<boolean>({ default: false })

  const { previewType, browserUrl } = usePreview(props)
</script>
