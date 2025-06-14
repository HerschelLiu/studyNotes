```vue
<template>
  <up-overlay :show="show" :mask-click-able="maskClickAble" @click="handleMaskClick">
    <view class="box" @click.stop.prevent>
      <view class="modal">
        <view class="header">
          <view class="title">{{ title }}</view>
        </view>

        <view class="content">
          <slot v-if="slots.default" />
          <view v-else class="text-content">{{ content }}</view>
        </view>

        <view class="bottom">
          <comp-button hollow :custom-style="btnStyle" @click="handleCancel">{{ cancelText }}</comp-button>

          <comp-button :custom-style="btnStyle" @click="handleConfirm">
            {{ confirmText }}
          </comp-button>
        </view>
      </view>
    </view>
  </up-overlay>
</template>

<script lang="ts" setup>
import type { Slots } from 'vue'

import { useSlots } from 'vue'


import { useStyle, useUnit } from '@/hooks/useStyle'

interface Props {
  title?: string
  confirmText: string
  cancelText: string
  maskClickAble: boolean
  canMaskClose: boolean
  content: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确定',
  cancelText: '取消',
  maskClickAble: true,
  canMaskClose: true,
  content: ''
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const show = defineModel<boolean>()

const slots: Slots = useSlots()

// 按钮样式
const btnStyle = useStyle({
  width: useUnit(270),
  height: useUnit(80),
  borderRadius: useUnit(40)
})

// 提交
const handleConfirm = () => {
  emit('confirm')
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

// 点击遮罩层
const handleMaskClick = () => {
  if (!props.maskClickAble) return
  if (props.canMaskClose) show.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.modal {
  box-sizing: border-box;
  width: 622rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #fff;

  .header {
    padding: 48rpx 0;

    .title {
      color: #000;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 1;
      text-align: center;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48rpx 0 28rpx;
  }
}

.input {
  box-sizing: border-box;
  width: 100%;
  height: 84rpx;
  padding: 0 28rpx;
  border: 1px solid #979797;
  border-radius: 12rpx;
  font-size: 28rpx;

  + .input {
    margin-top: 32rpx;
  }
}

.text-content {
  display: flex;

  // min-height: 172rpx;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 38rpx;
  color: #666;
  font-size: 36rpx;
  line-height: 50rpx;
  text-align: justify;
}
</style>

```

