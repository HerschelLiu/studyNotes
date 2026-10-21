<template>
  <!-- 图片 · 抽屉模式：全屏图片查看器（不打开抽屉） -->
  <el-image-viewer
    v-if="mode === 'drawer' && show && previewType === 'image' && resolvedBrowserUrl"
    :url-list="[resolvedBrowserUrl]"
    teleported
    @close="show = false" />

  <!-- 抽屉模式 · 非图片 -->
  <CompDrawer
    v-else-if="mode === 'drawer'"
    v-model="show"
    title="预览"
    :enable-scroll="false"
    :show-save-button="false">
    <template #header-actions>
      <PreviewActions
        :print="canPrint"
        :download="canDownload"
        @print="handlePrint"
        @download="handleDownload" />
    </template>

    <PreviewItem
      ref="previewRef"
      :url="url"
      :min-i-o="minIO"
      :mime="mime"
      mode="drawer" />
  </CompDrawer>

  <!-- 页面模式 -->
  <div
    v-else-if="url"
    class="preview-page">
    <PreviewActions
      v-if="canPrint || canDownload"
      class="preview-page-actions"
      :print="canPrint"
      :download="canDownload"
      @print="handlePrint"
      @download="handleDownload" />

    <PreviewItem
      ref="previewRef"
      :url="url"
      :min-i-o="minIO"
      :mime="mime"
      mode="page" />
  </div>
</template>

<script lang="ts" setup>
  import type { PreviewItemExpose, PreviewProps } from './types'

  import { usePreview } from './usePreview'

  import CompDrawer from '@/components/Drawer/index.vue'
  import PreviewItem from './previewItem.vue'
  import PreviewActions from './previewActions.vue'

  /** 类型别名引用外部接口：defineProps 宏自 Vue 3.3 起支持外部类型引用 */
  type Props = PreviewProps

  const props = withDefaults(defineProps<Props>(), {
    url: undefined,
    minIO: true,
    mime: undefined,
    mode: 'drawer',
    download: false,
    print: false,
  })

  /** 抽屉模式下控制显隐 */
  const show = defineModel<boolean>({ default: false })

  const {
    previewType,
    isPdf,
    resolvedBrowserUrl,
    resolvedOfficeSrc,
    handlePrint: printBrowserUrl,
    handleDownload,
  } = usePreview(props)

  const previewRef = useTemplateRef<PreviewItemExpose>('previewRef')

  /** 有浏览器地址就打印该地址；office 二进制源没有地址，改打印已渲染内容 */
  const handlePrint = () => (resolvedBrowserUrl.value ? printBrowserUrl() : previewRef.value?.printRendered())

  /** pdf 由浏览器自带预览器提供打印/下载，组件内不再重复渲染 */
  const hasSource = computed(() => !!(resolvedBrowserUrl.value || resolvedOfficeSrc.value))
  const canDownload = computed(() => props.download && !isPdf.value && hasSource.value)
  /** 打印需能加载到内容：ppt 等不支持预览的格式渲染为空状态，不作打印入口 */
  const canPrint = computed(
    () => props.print && !isPdf.value && previewType.value !== 'unsupported' && hasSource.value
  )
</script>

<style lang="scss" scoped>
  .preview-page {
    position: relative;
  }

  .preview-page-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  }
</style>
