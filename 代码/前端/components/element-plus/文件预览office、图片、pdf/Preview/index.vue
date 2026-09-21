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
    <PreviewItem
      :url="url"
      :min-i-o="minIO"
      :mime="mime"
      mode="drawer" />
  </CompDrawer>

  <!-- 页面模式 -->
  <PreviewItem
    v-else-if="url"
    :url="url"
    :min-i-o="minIO"
    :mime="mime"
    mode="page" />
</template>

<script lang="ts" setup>
  import type { PreviewProps } from './types'

  import CompDrawer from '@/components/Drawer/index.vue'
  import PreviewItem from './previewItem.vue'

  import { usePreview } from './usePreview'

  /** 类型别名引用外部接口：defineProps 宏自 Vue 3.3 起支持外部类型引用 */
  type Props = PreviewProps

  const props = withDefaults(defineProps<Props>(), {
    url: undefined,
    minIO: true,
    mime: undefined,
    mode: 'drawer',
  })

  /** 抽屉模式下控制显隐 */
  const show = defineModel<boolean>({ default: false })

  const { previewType, resolvedBrowserUrl } = usePreview(props)
</script>
