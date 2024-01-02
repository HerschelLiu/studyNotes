```ts
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useStyle, useUnit } from './useStyle'

interface LargeScreenOptions {
  width?: number
  height?: number
}

/** 大屏等单屏需要固定UI尺寸，需要一屏完整显示 */
export const useLargeScreen = (options?: LargeScreenOptions) => {
  const defaultOptions = Object.assign({ width: 1920, height: 1080 }, options)

  const windowWidth = ref(Math.max(1140, document.documentElement.clientWidth))
  const windowHeight = ref(Math.max(690, document.documentElement.clientHeight))

  const style = computed(() => {
    const scale = Math.min(windowWidth.value / defaultOptions.width, windowHeight.value / defaultOptions.height)
    return useStyle({
      width: useUnit(defaultOptions.width),
      height: useUnit(defaultOptions.height),
      transform: `scale(${scale})`
    })
  })

  const setWindowSize = () => {
    windowWidth.value = document.documentElement.clientWidth
    windowHeight.value = document.documentElement.clientHeight
  }

  onMounted(() => {
    window.addEventListener('resize', setWindowSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', setWindowSize)
  })

  return {
    style
  }
}

```

