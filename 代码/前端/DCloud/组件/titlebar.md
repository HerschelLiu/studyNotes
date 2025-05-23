```ts
<template>
  <!-- titlebar start -->
  <view v-if="showTitleBar" class="component" :style="style" @touchmove.stop="">
    <!-- 背景色彩 start -->
    <view class="background" :style="backgroundStyle" />
    <!-- 背景色彩 end -->

    <!--标题 start -->
    <view v-if="title" class="title" :style="titleStyle">{{ title }}</view>
    <!--标题 end -->

    <!--返回按钮 start -->
    <view v-if="showBackButton && canBack" class="button" :style="buttonStyle" @click="handleBack">
      <up-icon name="arrow-left" :color="backBtnColor" size="20" />
    </view>
    <view v-else-if="showBackButton && !canBack" class="button" :style="buttonStyle" @click="handleBackHome">
      <up-icon name="home-fill" :color="backBtnColor" size="20" />
    </view>
    <!--返回按钮 end -->
  </view>
  <!-- titlebar end -->

  <!--slot start -->
  <slot />
  <!--slot end -->
</template>

<script lang="ts" setup>
import { getThePage } from '@/hooks/useRouter';
import { useStyle, useUnit } from '@/hooks/useStyle';
import { useSettingsStore } from '@/store/useSettings';
import { computed, ref } from 'vue';

interface Props {
  /** 整体是否展示 */
  show?: boolean;
  title?: string;
  background?: string;
  opacity?: number;
  backBtnColor?: string;
  titleColor?: string;
  titleOpacity?: number;
  showBackButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  background: 'transparent',
  opacity: 1,
  backBtnColor: '#000',
  titleColor: '#333',
  titleOpacity: -1,
  showBackButton: true,
});

const globalData = useSettingsStore();

const showTitleBar = ref(true);

const style = computed(() => {
  return useStyle({
    paddingTop: useUnit(globalData.systemInfo.statusBarHeight!, 'px'),
    height: useUnit(globalData.titleBarHeight, 'px'),
  });
});

const titleStyle = computed(() => {
  return useStyle({
    color: props.titleColor,
    height: useUnit(globalData.titleBarHeight - globalData.systemInfo.statusBarHeight!, 'px'),
    opacity: `${props.titleOpacity}`,
  });
});

const backgroundStyle = computed(() => {
  return useStyle({
    background: props.background || '',
    opacity: `${props.opacity}`,
  });
});

const buttonStyle = computed(() => {
  const menuButton = globalData.menuButton;

  return useStyle({
    width: useUnit(menuButton.height, 'px'),
    height: useUnit(menuButton.height, 'px'),
    top: useUnit(menuButton.top, 'px'),
  });
});

const canBack = computed(() => {
  const prevPage = getThePage(-1);
  return !!prevPage;
});

const handleBack = () => {
  const Page = getThePage();
  if (Page.$vm.handleBack) {
    Page.$vm.handleBack();
    return;
  }
  uni.navigateBack();
};

const handleBackHome = () => {
  const { homePath } = useSettingsStore();
  uni.reLaunch({
    url: `/${homePath}` || '',
  });
};
</script>

<style lang="scss" scoped>
// titlebar
.component {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: auto;
  z-index: 111;
  box-sizing: border-box;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: #fff;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 26rpx;
  }

  .button {
    display: flex;
    position: absolute;
    left: 10rpx;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #333;
    width: 44rpx;
    height: 44rpx;
  }
}
</style>

```

```ts
import { onPageScroll } from "@dcloudio/uni-app";

/** titlebar透明背景操作 */
export const useTitleBarOpacity = () => {
  const titleOpacity = ref(0)
  
  const getOpacity = (scrollTop: number): number => {
    if (scrollTop >= 50) return 1
    return Number((scrollTop / 50).toFixed(2))
  }
  
  // !必须在页面中使用了onPageScroll， 否造成hooks的onPageScroll无法调用
  onPageScroll(e => {
    const opacity = getOpacity(e.scrollTop)
    if (opacity === titleOpacity.value) return
    titleOpacity.value = opacity
  })
  
  return titleOpacity
}
```



```vue
<comp-title-bar 
    title="首页" 
    :opacity="titleOpacity" 
    :title-opacity="titleOpacity" 
    background="#fff" 
    :show-back-button="false"
  />

const titleOpacity = useTitleBarOpacity()
```

