```ts
<template>
  <el-drawer
    v-model="value"
    :append-to-body="true"
    :show-close="false"
    :size="size"
    :destroy-on-close="destroyOnClose"
		:with-header="false"
    class="comp-drawer-box"
  >
    <div class="header">
      <h4 class="title">
        {{ title }}
        <span class="red">{{ tip }}</span>
      </h4>

      <div class="btn-group">
        <el-button size="default" @click="value = false">取消</el-button>
        <el-button v-if="showSaveButton" size="default" :icon="useIcon('EditPen')" type="primary" @click="handleSave">{{ buttonName }}</el-button>
      </div>
    </div>

    <el-scrollbar v-if="enableScroll" height="calc(100vh - 68px)">
      <slot />
    </el-scrollbar>

    <div v-else class="main-box">
      <slot />
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'

import { useIcon } from '@/hooks/useIcon'

defineOptions({
  name: 'Drawer'
})

const props = defineProps({
  /** 标题 */
  title: {
    type: String,
    default: ''
  },
  /** 提示 */
  tip: {
    type: String,
    default: ''
  },
  /** 是否显示保存按钮 */
  showSaveButton: {
    type: Boolean,
    default: true
  },
  /** 嵌套层级 */
  zIndex: {
    type: Number,
    default: 1
  },
  /** 是否开始滚动 */
  enableScroll: {
    type: Boolean,
    default: true
  },
  /** 控制是否在关闭 Drawer 之后将子元素全部销毁 */
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  /** 保存按钮名称 */
  buttonName: {
    type: String,
    default: '保存'
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

/** model值
 * @type { boolean }
 */
const value = defineModel({ required: true, defalut: false })

/** 保存 */
const handleSave = () => {
  emit('save')
}

/** 弹窗尺寸 */
const size = ref(1152)

/** 生命周期 */
onBeforeMount(() => {
  const clientWidth = document.documentElement.clientWidth * 0.7
  if (clientWidth > size.value) size.value = clientWidth
  if (props.zIndex > 1) {
    for (let i = 0; i < props.zIndex - 1; i++) {
      size.value *= 0.9
    }
  }
})
</script>

<style lang="scss" scoped>
.comp-drawer-box {
  color: #54585e;

  .el-drawer__header {
    display: none;
  }

  .header {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    .title {
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: bold;
    }

    .el-button {
      min-width: 80px;
    }
  }

  .main-box {
    padding: 20px;

    .select-form {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }

    .flex-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;

      .text {
        margin-right: 10px;
      }
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      min-height: 62px;
      margin-left: -14px;
      font-size: 14px;
      line-height: 32px;
    }
  }

  :deep(.el-scrollbar) {
    position: relative;
    height: auto;
    overflow: hidden;
  }

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}
</style>
```

