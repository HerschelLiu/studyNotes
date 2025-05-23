```vue
<template>
  <view class="component" :class="{ 'safe-bottom': safeBottom }">
    <!-- gropu start -->
    <slot name="group" />
    <!-- gropu end -->

    <!--list start -->
    <slot name="list" />
    <!--list end -->

    <!--loading start -->
    <comp-loading v-if="list.loading" class="loading" />
    <!--loading end -->

    <!--text start -->
    <view v-if="!list.haveAny" class="list-tip">
      <!-- <comp-empty :width="noneWidth" :height="noneHeight" /> -->
      <image v-if="noneImage" :src="noneImage" class="none" :style="noneStyle" />
      {{ list.noneText || '暂无数据' }}
    </view>

    <template v-if="list.showText">
      <view v-if="list.haveAny && !list.haveMore && list.pageCount >= 1" class="list-tip">没有更多数据了~</view>
    </template>
    <view v-if="list.reGet" class="list-tip" @click="handleReGetList">
			<slot v-if="$slots.reget" name="reget" />
      <template v-else>点击重新加载数据</template>
		</view>
    <!--text end -->

    <!--list start -->
    <slot v-if="!list.loading && !list.items.length" name="button" />
    <!--list end -->
  </view>
</template>

<script lang="ts" setup>
import { useStyle, useUnit } from '@/hooks/useStyle';
import { computed } from 'vue';

interface Props {
  list: List;
  /** 无数据的占位图 */
  noneImage?: string;
  /** 占位图宽度 */
  noneWidth?: number;
  /** 占位图高度 */
  noneHeight?: number;
  /** 占位图边距 */
  noneMargin?: string;
  /** 是否使用安全底部边距 */
  safeBottom?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  list: () => ({
    total: 0,
    pageCount: 0,
    haveAny: true,
    loading: false,
    haveMore: true,
    reGet: false,
    showText: true
  } as List),
  noneImage: '',
  noneWidth: 400,
  noneHeight: 364,
  noneMargin: '',
  safeBottom: true,
});
const emit = defineEmits<{ getlist: [] }>();

const noneStyle = computed(() => {
  return useStyle({
    width: useUnit(props.noneWidth),
    height: useUnit(props.noneHeight),
    margin: props.noneMargin,
  });
});

/** 重新获取列表 */
const handleReGetList = () => {
  emit('getlist');
};
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';

.component {
  display: template;

  &.safe-bottom {
    @include safe(padding-bottom, 40rpx);
  }

  .list-tip {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    min-height: 100rpx;
    margin-top: 10rpx;
    padding: 30rpx 0;
    color: #666;
    font-size: 24rpx;
  }

  .loading {
    box-sizing: border-box;
    height: 140rpx;
    padding: 50rpx 0;
  }

  .none {
    display: template;
    width: 400rpx;
    height: 364rpx;
    margin: 60rpx 0 50rpx -20rpx;
  }
}
</style>

```

