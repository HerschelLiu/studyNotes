```vue
<template>
  <div ref="ELElement">
    <el-tooltip :disabled="!previewSrcList.length" placement="bottom" effect="dark" content="点击预览大图" class="item">
      <el-image
        :key="imgSrc"
        :src="imgSrc"
        :preview-src-list="previewSrcList"
        :fit="fit !== 'none' ? fit : ''"
        :lazy="lazy"
        :alt="alt"
        referrer-policy="origin"
        :style="style"
        :z-index="5000"
        preview-teleported
        :initial-index="initialIndex"
        :show-progress="showProgress"
        :hide-on-click-modal="hideOnClickModal"
      >
        <template #placeholder>
          <div class="image-box">
            <comp-svg-icon name="Loading" class="loading" :color="color" />
          </div>
        </template>
      </el-image>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, onMounted, onUnmounted } from 'vue'

import { useRefs } from '@/hooks/useRefs'
import { useStyle, useUnit } from '@/hooks/useStyle'
  
defineOptions({
  name: 'Image'
})

const props = defineProps({
  /** 图片地址 */
  src: {
    type: String,
    required: true
  },
  /** 图片裁剪模式 */
  fit: {
    type: String as PropType<ImageFit>,
    default: 'cover'
  },
  /** 图片alt */
  alt: {
    type: String,
    default: ''
  },
  /** 是否懒加载 */
  lazy: {
    type: Boolean,
    default: false
  },
  /** 图片加载时的loading动画图标颜色 */
  color: {
    type: String,
    default: '#3498db'
  },
  /** cos缩略图的尺寸 */
  size: {
    type: [String, Number],
    default: ''
  },
  /** 是否图片需要垂直居中 */
  center: {
    type: Boolean,
    default: false
  },
  /** 预览图片数组 */
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  /** 圆角大小 */
  borderRadius: {
    type: String,
    default: '0'
  },
  /** 缺少时的占位图 */
  placeholder: {
    type: String,
    default: 'https://yshop-cos.yili.com/assets/template/none.png'
  },
  /** 宽度 */
  width: {
    type: [String, Number],
    default: ''
  },
  /** 高度 */
  height: {
    type: [String, Number],
    default: ''
  },
  /** 初始化预览图片的位置 */
  initialIndex: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  /** 当开启 preview 功能时，是否可以通过点击遮罩层关闭 preview */
  hideOnClickModal: {
    type: Boolean,
    default: true
  },
})

/** 图片地址 */
const imgSrc = computed(() => {
  return props.src || props.placeholder
})

/** 图片样式 */
const style = computed(() => {
  return useStyle({
    display: props.center ? 'flex' : '',
    alignItems: props.center ? 'center' : '',
    borderRadius: props.borderRadius,
    width: props.size ? useUnit(props.size) : useUnit(props.width),
    height: props.size ? useUnit(props.size) : useUnit(props.height)
  })
})

/** 不记名的Ref */
const { ELElement } = useRefs<HTMLElement>()

/** 定时器 */
let interval: NodeJS.Timer | undefined

/** 清理定时器 */
function clearTimer() {
  if (typeof interval !== 'undefined') clearInterval(interval)
}

/** 生命周期 */
onMounted(() => {
  if (ELElement) {
    interval = setInterval(() => {
      const img = ELElement.value!.getElementsByTagName('img')[0]
      if (img) {
        clearTimer()
        img.addEventListener('click', () => {
          document.body.style.overflow = ''
        })
      }
    }, 100)
  }
})
onUnmounted(() => {
  clearTimer()
})
</script>

<style lang="scss" scoped>
.image-box {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .loading {
    width: 1em;
    height: 1em;
    animation: rotate 3s linear infinite;
  }
}

:deep(.el-image) {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>

```

