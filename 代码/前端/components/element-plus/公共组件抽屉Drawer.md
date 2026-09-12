`无el-scrollbar美化滚动条`

```vue
<template>
  <el-drawer
    v-model="value"
    :append-to-body="true"
    :show-close="false"
    :size="size"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :with-header="false"
    class="comp-drawer-box">
    <div class="header">
      <h4 class="title">
        {{ title }}
        <span class="red">{{ tip }}</span>
      </h4>

      <div class="btn-group">
        <el-button
          size="default"
          @click="handleCancel">
          取消
        </el-button>

        <el-button
          v-if="showSaveButton"
          size="default"
          type="primary"
          :loading="loading"
          @click="handleSave">
          {{ buttonName }}
        </el-button>
      </div>
    </div>

    <el-scrollbar class="drawer-content">
      <slot />
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';

  defineOptions({
    name: 'Drawer',
  });

  interface Props {
    /** 标题 */
    title?: string
    /** 提示 */
    tip?: string
    /** 是否显示保存按钮 */
    showSaveButton?: boolean
    /** 嵌套层级 */
    zIndex?: number
    /**
     * 已废弃：内容区统一由 .drawer-content 滚动（header 固定）。
     * 保留仅为兼容既有调用，传入任何值都不再影响布局
     */
    enableScroll?: boolean
    /** 控制是否在关闭 Drawer 之后将子元素全部销毁 */
    destroyOnClose?: boolean
    /** 保存按钮名称 */
    buttonName?: string
    /** 加载中 */
    loading?: boolean
    /** 点击遮罩层是否关闭抽屉 */
    closeOnClickModal?: boolean
    /** 是否阻止取消操作 */
    canCancel?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    tip: '',
    showSaveButton: true,
    zIndex: 1,
    enableScroll: true,
    destroyOnClose: true,
    buttonName: '保存',
    loading: false,
    closeOnClickModal: false,
    canCancel: true
  })

  const emit = defineEmits<{
    save: []
    cancel: []
  }>();

  const value = defineModel<boolean>({ required: true, default: false });

  /** 保存 */
  const handleSave = () => {
    emit('save');
  };

  const handleCancel = () => {
    if (props.canCancel) value.value = false;
    emit('cancel');
  };

  /** 弹窗尺寸 */
  const size = ref(1152);

  /** 生命周期 */
  onBeforeMount(() => {
    const clientWidth = document.documentElement.clientWidth * 0.7;
    if (clientWidth > size.value) size.value = clientWidth;
    if (props.zIndex > 1) {
      for (let i = 0; i < props.zIndex - 1; i++) {
        size.value *= 0.9;
      }
    }
  });
</script>

<style lang="scss">
  .comp-drawer-box {
    color: #54585e;

    .el-drawer__header {
      display: none;
    }

    .el-drawer__body {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }

    .header {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: space-between;
      height: 68px;
      padding: 10px 20px;
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

    .el-scrollbar.drawer-content {
      flex: 1;
      min-height: 0;
    }

    .el-scrollbar.drawer-content > .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-scrollbar.drawer-content > .el-scrollbar__wrap > .el-scrollbar__view {
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
  }
</style>

```



`有el-scrollbar美化滚动条`

```vue
<template>
  <el-drawer
    v-model="value"
    :append-to-body="true"
    :show-close="false"
    :size="size"
    :destroy-on-close="destroyOnClose"
    :with-header="false"
    class="comp-drawer-box">
    <div class="header">
      <h4 class="title">
        {{ title }}
        <span class="red">{{ tip }}</span>
      </h4>

      <div class="btn-group">
        <el-button
          size="default"
          @click="value = false">
          取消
        </el-button>

        <el-button
          v-if="showSaveButton"
          size="default"
          type="primary"
          :loading="loading"
          @click="handleSave">
          {{ buttonName }}
        </el-button>
      </div>
    </div>

    <el-scrollbar class="drawer-content">
      <slot />
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';

  defineOptions({
    name: 'Drawer',
  });

  interface Props {
    /** 标题 */
    title?: string
    /** 提示 */
    tip?: string
    /** 是否显示保存按钮 */
    showSaveButton?: boolean
    /** 嵌套层级 */
    zIndex?: number
    /** 控制是否在关闭 Drawer 之后将子元素全部销毁 */
    destroyOnClose?: boolean
    /** 保存按钮名称 */
    buttonName?: string
    /** 加载中 */
    loading?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    tip: '',
    showSaveButton: true,
    zIndex: 1,
    destroyOnClose: true,
    buttonName: '保存',
    loading: false
  })

  const emit = defineEmits<{
    save: []
  }>();

  const value = defineModel<boolean>({ required: true, default: false });

  /** 保存 */
  const handleSave = () => {
    emit('save');
  };

  /** 弹窗尺寸 */
  const size = ref(1152);

  /** 生命周期 */
  onBeforeMount(() => {
    const clientWidth = document.documentElement.clientWidth * 0.7;
    if (clientWidth > size.value) size.value = clientWidth;
    if (props.zIndex > 1) {
      for (let i = 0; i < props.zIndex - 1; i++) {
        size.value *= 0.9;
      }
    }
  });
</script>

<style lang="scss">
  .comp-drawer-box {
    color: #54585e;

    .el-drawer__header {
      display: none;
    }

    .el-drawer__body {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }

    .header {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: space-between;
      height: 68px;
      padding: 10px 20px;
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

    .el-scrollbar.drawer-content {
      flex: 1;
      min-height: 0;
    }

    .el-scrollbar.drawer-content > .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-scrollbar.drawer-content > .el-scrollbar__wrap > .el-scrollbar__view {
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
  }
</style>

```

