<template>
  <el-drawer
    v-model="value"
    :append-to-body="true"
    :show-close="false"
    :with-header="false"
    :size="drawerSize"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :aria-label="title || undefined"
    role="dialog"
    class="comp-drawer-box"
    @opened="handleOpened"
    @closed="handleClosed">
    <div class="header">
      <h4 class="title">
        {{ title }}
        <span
          v-if="tip"
          class="tip">{{ tip }}</span>
      </h4>

      <div class="btn-group">
        <slot name="header-actions" />

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
      <slot v-if="isContentReady" />

      <div
        v-else
        v-loading="true"
        class="drawer-content-placeholder" />
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'

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
    /**
     * 嵌套层级：> 1 时宽度逐层 ×0.9 收窄，避免遮住下层抽屉。
     * 真实 z-index 由 Element Plus 的 useZIndex 自动递增管理，不由此值决定
     */
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
    /** 是否占满整个视口宽度，优先级高于 size */
    fullscreen?: boolean
    /** 抽屉宽度：数字按 px，字符串按 CSS 长度（如 '40%' / '600px'）；不传按视口自适应 */
    size?: string | number
    /**
     * 内容区延迟到抽屉滑入动画结束后再挂载。
     * 重内容（大表格/复杂表单）开启，避免在动画中同步挂载导致打开卡顿与列宽抖动
     */
    lazyContent?: boolean
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
    closeOnClickModal: true,
    canCancel: true,
    fullscreen: false,
    lazyContent: false
  })

  const emit = defineEmits<{
    save: []
    cancel: []
  }>();

  const value = defineModel<boolean>({ required: true, default: false });

  /** 默认宽度下限：视口足够宽时抽屉不窄于 1152px */
  const BASE_WIDTH = 1152
  /** 宽视口下的宽度占比 */
  const VIEWPORT_RATIO = 0.7
  /** 每嵌套一层的宽度收窄系数 */
  const NESTED_SHRINK = 0.9

  const { width: viewportWidth } = useWindowSize()

  /**
   * 抽屉宽度：fullscreen 时占满视口；否则优先使用 size；
   * 都未指定时取 max(1152, 视口 × 70%)，并兜底不超过视口（小屏不再溢出），嵌套层再逐层 ×0.9
   */
  const drawerSize = computed(() => {
    if (props.fullscreen) return '100%'
    if (props.size != null) return props.size

    const viewport = viewportWidth.value || BASE_WIDTH
    const base = Math.max(BASE_WIDTH, viewport * VIEWPORT_RATIO)
    const depth = Math.max(props.zIndex, 1)
    return Math.min(viewport, base * NESTED_SHRINK ** (depth - 1))
  })

  /**
   * 内容区是否已挂载：lazyContent 时等滑入动画结束（opened）后挂载。
   * 初始即打开时没有滑入动画，不会有 opened 事件，直接挂载避免内容空白
   */
  const contentReady = shallowRef(value.value)
  const isContentReady = computed(() => !props.lazyContent || contentReady.value)

  const handleOpened = () => {
    contentReady.value = true
  }

  /**
   * 关闭动画结束后再卸载内容：
   * 若在 v-model 置 false 的同一任务里同步卸载，大表格会阻塞点击响应（保存后“卡住”）。
   * 与 el-drawer 的 destroy-on-close 销毁时机保持一致。
   */
  const handleClosed = () => {
    // 关闭动画期间可能被重新打开，此时不要卸载内容
    if (!value.value) contentReady.value = false
  }

  /** 保存 */
  const handleSave = () => {
    // lazyContent：内容尚未挂载时忽略，避免跳过表单校验直接关闭
    if (!isContentReady.value) return
    emit('save')
  }

  const handleCancel = () => {
    if (props.canCancel) value.value = false
    emit('cancel')
  }
</script>

<style lang="scss">
  /*
   * 多级弹层：所有弹层遮罩都 teleport 到 body，按打开顺序排列。
   * 只保留第一个可见遮罩的背景色，后续遮罩设为透明：它们依然全屏拦截点击，
   * 但不会因叠加而越来越黑；上层关闭后，下一层会自动恢复为“第一个可见遮罩”。
   */
  body > .el-overlay:not([style*='display: none']) ~ .el-overlay:not([style*='display: none']) {
    background-color: transparent;
  }

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
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      height: 68px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      .title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        color: var(--el-text-color-primary);
        font-size: 16px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tip {
        margin-left: 8px;
        color: var(--el-color-danger);
        font-size: 13px;
        font-weight: normal;
      }

      .btn-group {
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
        align-items: center;

        /* 间距统一由 gap 控制，抵消 el-button 相邻按钮的默认外边距 */
        > .el-button + .el-button {
          margin-left: 0;
        }
      }

      .el-button {
        min-width: 80px;
        height: 32px;
      }
    }

    .el-scrollbar.drawer-content {
      flex: 1;
      min-height: 0;

      > .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }

    /* lazyContent 占位：撑满内容区，避免打开瞬间高度塌陷 */
    .drawer-content-placeholder {
      height: 60vh;
    }
  }
</style>
