---
title: "公共组件抽屉 CompDrawer"
---

> 统一封装的 `el-drawer`：**header 固定、内容区滚动**；宽度随视口自适应（`max(1152, 70vw)`，且不超过视口），嵌套层级逐层 ×0.9；支持自定义宽度、`lazyContent` 延迟挂载重内容、`header-actions` 扩展按钮。`v-model` 控制显隐，`save` / `cancel` 交由业务处理。
>
> 现行实现：`src/components/Drawer/index.vue`。同项目的 `CommonEditDrawer` 是「表单 + 空状态 + footer」的另一套封装，选择见 [与 CommonEditDrawer 的选择](#与-commoneditdrawer-的选择)。

## 目录

- [概述](#概述)
- [Props](#props)
- [事件](#事件)
- [插槽](#插槽)
- [尺寸与层级](#尺寸与层级)
- [延迟挂载 lazyContent](#延迟挂载-lazycontent)
- [源码（当前实现）](#源码当前实现)
- [使用示例](#使用示例)
- [与 CommonEditDrawer 的选择](#与-commoneditdrawer-的选择)
- [注意事项](#注意事项)
- [变更记录](#变更记录)

## 概述

- 结构：`el-drawer`（`with-header=false`）→ 自定义 `.header`（标题 + 提示 + 扩展按钮 + 取消/保存）+ `el-scrollbar.drawer-content`（业务内容）。
- 层级：`append-to-body`；真实 z-index 由 Element Plus 的 `useZIndex` 自动递增管理，嵌套宽度靠 `zIndex` 收窄。
- 显隐：`defineModel<boolean>`，父组件用 `v-model`。
- 保存：只 `emit('save')`，是否关闭由父组件决定（通常保存成功后 `show = false`）。
- 宽度：`fullscreen` 占满视口；否则 `size` 显式指定，未指定按视口计算；窗口缩放会实时更新。
- 内容：默认随抽屉打开即挂载；重内容用 `lazyContent` 等滑入动画结束再挂载，并显示占位 loading。
- 可访问性：`role="dialog"` + `aria-label` 取标题；`title` 为空时不设 `aria-label`，沿用 Element Plus 默认的 `aria-labelledby`（无 header 时该引用可能不存在，建议始终传 `title`）。

## Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `boolean` | `false` | 抽屉显隐（必传） |
| `title` | `string` | `''` | 标题；同时作为 `aria-label` |
| `tip` | `string` | `''` | 标题后的红字提示，空串不渲染 |
| `showSaveButton` | `boolean` | `true` | 是否显示保存按钮 |
| `buttonName` | `string` | `'保存'` | 保存按钮文案 |
| `loading` | `boolean` | `false` | 保存按钮 loading |
| `zIndex` | `number` | `1` | 嵌套层级，`> 1` 时宽度 × `0.9^(n-1)`；**不用于设置 z-index** |
| `fullscreen` | `boolean` | `false` | 是否占满整个视口宽度，优先级高于 `size` |
| `size` | `string \| number` | — | 显式宽度：数字按 px，字符串按 CSS 长度（需带单位，如 `'40%'` / `'600px'`）；不传则按视口自适应 |
| `destroyOnClose` | `boolean` | `true` | 关闭后销毁内容 |
| `closeOnClickModal` | `boolean` | `true` | 点遮罩是否关闭（以代码默认值为准，旧文档写的 `false` 已过时） |
| `canCancel` | `boolean` | `true` | 为 `false` 时点「取消」不会关闭（仍会 emit `cancel`） |
| `lazyContent` | `boolean` | `false` | 内容延迟到 `opened`（滑入动画结束）再挂载，见下节 |
| `enableScroll` | `boolean` | `true` | **已废弃**：内容区统一由 `.drawer-content` 滚动，传值不再影响布局 |

## 事件

| 事件 | 说明 |
| --- | --- |
| `save` | 点「保存」触发，业务在这里校验并提交；`lazyContent` 且内容尚未挂载时不会触发 |
| `cancel` | 点「取消」触发（先按 `canCancel` 决定是否关闭，再 emit） |

`el-drawer` 的其他事件（`open` / `opened` / `close` / `closed` 等）未在组件内声明，会通过 attrs 透传到 `el-drawer`；其中 `opened` / `closed` 被内部用于 `lazyContent`，外部监听会与内部处理合并，不影响使用。

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 抽屉内容，外层已带 `el-scrollbar`，内部不要再套滚动容器；`lazyContent` 时仅在打开后挂载 |
| `header-actions` | 标题右侧、「取消」之前的扩展操作（导出、修改等），按钮间距由容器统一控制 |

## 尺寸与层级

```ts
const BASE_WIDTH = 1152
const VIEWPORT_RATIO = 0.7
const NESTED_SHRINK = 0.9

const { width: viewportWidth } = useWindowSize()

const drawerSize = computed(() => {
  if (props.fullscreen) return '100%'
  if (props.size != null) return props.size

  const viewport = viewportWidth.value || BASE_WIDTH
  const base = Math.max(BASE_WIDTH, viewport * VIEWPORT_RATIO)
  const depth = Math.max(props.zIndex, 1)
  return Math.min(viewport, base * NESTED_SHRINK ** (depth - 1))
})
```

- `fullscreen` 时直接返回 `'100%'`，忽略 `size` 与嵌套收窄；
- 否则先取 `max(1152, 视口 × 70%)`：视口 ≥ 1646px 时按 70% 铺开，否则固定 1152px。
- 再用 `Math.min(视口, …)` 兜底：**小屏不再横向溢出**（如 1024 视口 → 1024px）。
- 嵌套第 n 层：再乘 `0.9^(n-1)`，视觉上层层内缩。
- 传入 `size` 时直接覆盖上述计算（两种写法：`:size="500"`、`size="40%"`）。
- 宽度是 `computed`，窗口缩放会实时更新；旧实现只在 `onBeforeMount` 算一次，缩放后不自适应。

| 视口 | 单层宽度 | 第 2 层宽度 |
| --- | --- | --- |
| 1024 | 1024 | 921.6 |
| 1440 | 1152 | 1036.8 |
| 1920 | 1344 | 1209.6 |
| 2560 | 1792 | 1612.8 |

## 延迟挂载 lazyContent

```ts
/** 初始即打开时没有 opened 事件，直接视为可挂载 */
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
```

- 默认 `false`：内容随抽屉打开立即挂载，适合普通表单。
- 设 `lazy-content`：先用 `.drawer-content-placeholder`（`height: 60vh` + `v-loading`）占位，等 `opened` 后再挂载插槽，避免重内容在滑入动画中同步挂载导致掉帧、表格列宽抖动。
- 关闭动画结束后（`@closed`）才把 `contentReady` 复位，避免保存/关闭时同步卸载大表格阻塞点击；关闭动画期间被重新打开则不卸载。下一次打开重新走延迟挂载；初始即打开（无 `opened` 动画）时直接挂载，避免空白。
- 内容未挂载时点「保存」会被忽略（`isContentReady` 守卫），避免跳过表单校验直接关抽屉。
- 适用：大表格、复杂表单、图表、按 id 拉详情；简单静态内容不要开。

## 源码（当前实现）

> 对应文件：`Drawer/index.vue`。

```vue
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
```

## 使用示例

### 基础：详情 / 编辑

```vue
<template>
  <CompDrawer
    v-model="show"
    title="编辑预算科目"
    tip="带 * 项必填"
    :loading="saving"
    @save="handleSave"
    @cancel="handleCancel">
    <el-form ref="ELForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="科目编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
    </el-form>
  </CompDrawer>
</template>

<script lang="ts" setup>
  import CompDrawer from '@/components/Drawer/index.vue'
  import { useTempRefs } from '@/hooks/useTempRefs'

  const show = defineModel<boolean>({ default: false })
  const { ELForm } = useTempRefs('ELForm')
  const form = reactive({ code: '' })
  const rules = {
    code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
  }
  const saving = ref(false)

  /** 替换成真实保存接口 */
  const saveApi = (data: typeof form) => Promise.resolve(data)

  const { submit: handleSave } = useSubmit(async () => {
    await saveApi(form)
    show.value = false
  }, {
    showLoading: true,
    loadingTitle: '正在提交...',
    ELForm,
    invalidateKeys: [queryKeys.xxx.list()],
  })

  const handleCancel = () => {
    // 需要二次确认时在这里拦；canCancel=false 时可用
  }
</script>
```

### 扩展 header 按钮 + 延迟挂载 + 自定义宽度

```vue
<comp-drawer
  v-model="show"
  title="科目物品明细"
  :z-index="2"
  :size="900"
  lazy-content
  :loading="saving"
  @save="handleSave"
  @closed="resetForm">
  <template #header-actions>
    <el-button type="primary" icon="Download" @click="handleExport">导出</el-button>
  </template>

  <CompTable v-model:list="items" :columns="columns" />
</comp-drawer>
```

### 嵌套抽屉

```vue
<!-- 外层 -->
<comp-drawer v-model="outerShow" title="预算编制">
  <el-button @click="innerShow = true">选择部门</el-button>

  <!-- 内层：z-index=2，宽度自动 ×0.9，避免完全遮住外层 -->
  <comp-drawer v-model="innerShow" title="选择部门" :z-index="2" :show-save-button="false">
    <DeptPicker @confirm="onDeptConfirm" />
  </comp-drawer>
</comp-drawer>
```

> `z-index` 属性在这里只是「嵌套层级」标记，Element Plus 会为新打开的抽屉自动分配更高的真实 z-index；不要再手写 `z-index` 样式。

## 与 CommonEditDrawer 的选择

项目里同时存在两套 `el-drawer` 封装，**新页面按场景选，不要再写第三套**：

| 场景 | 选择 | 依据 |
| --- | --- | --- |
| 详情、选择器、预览、需要自定义 header 按钮 | `CompDrawer`（本文） | header 固定 + 内容滚动，按钮和内容完全自定义 |
| 标准编辑表单：字段用 `el-form`、底部「取消/保存」、需要空状态 | `CommonEditDrawer`（`src/components/CommonEditDrawer/index.vue`） | 内置 `el-form` + rules + footer + `el-empty`，字段布局固定 |

`CommonEditDrawer` 的保存/取消/空状态语义与 `CompDrawer` 不同（footer 而非 header），迁移前先确认交互稿，不要为了统一而混用。

## 注意事项

1. **header 固定、内容滚动**：`.el-drawer__body` 是 `flex column`，`.header` 不滚动，`.drawer-content` 用 `flex: 1; min-height: 0`；不要在内容里再写 `height: 100%` 的滚动容器。
2. **样式必须写在非 scoped 块**：抽屉被 `append-to-body` 传送到 `body`，`scoped` 样式作用不到，靠 `.comp-drawer-box` 唯一 class 定位（该 class 最终落在 `.el-drawer` 上）。
3. **`enableScroll` 已废弃**：不要再用它控制滚动，传了也不生效。
4. **保存不自动关闭**：`save` 只是事件，提交成功后要自己 `show = false`；`cancel` 在 `canCancel = false` 时也不关闭（用于「有未保存修改」拦截）。
5. **嵌套宽度**：用 `zIndex` 递增收窄宽度；真实层级交给 Element Plus，不要写死 z-index。
6. **`size` 字符串要带单位**：`size="500"` 是无效 CSS（不会生效），应写 `:size="500"` 或 `size="500px"`。旧调用里的 `size="500"` 已改为 `:size="500"`。
7. **`tip` 颜色**：旧实现用 `.red` 类，但项目没定义该类，提示实际不是红色；现在改为 `.tip` + `var(--el-color-danger)`。
8. **小屏兜底**：旧实现固定 `1152` 下限，窄屏会溢出；现在宽度不会超过视口。
9. **内容区默认无内边距**：需要留白时给内容套 `app-container` 或自己的容器，不要期望组件再补 `padding`。
10. **`destroyOnClose` 默认 `true`**：内容会被销毁，表单状态需在父组件 `watch(show)` 关闭时重置；需要保留状态时显式传 `:destroy-on-close="false"`。
11. **长标题**：标题单行省略，提示紧随其后；标题极长时提示会被裁掉，重要提示请放内容区。
12. **可访问性**：组件已设 `role="dialog"` 与 `aria-label`（取 `title`，建议始终传标题）；自定义 header 不再有 Element Plus 的关闭按钮，键盘 `Esc` 仍可关闭。

## 多层遮罩

所有抽屉/弹层都 `teleport` 到 `body`，按打开顺序叠加。全局样式只保留第一个可见遮罩的背景色：

```scss
body > .el-overlay:not([style*='display: none']) ~ .el-overlay:not([style*='display: none']) {
  background-color: transparent;
}
```

- 后续遮罩透明，但仍全屏拦截点击；
- 上层关闭后，下一层自动成为“第一个可见遮罩”，恢复背景色；
- 避免多层抽屉叠加越来越黑。

## 变更记录

### 2026-11-17 优化

- 宽度改为 `computed` + `useWindowSize`：窗口缩放实时自适应，旧实现只在挂载时计算一次。
- 新增小屏兜底 `Math.min(视口, …)`：窄屏不再横向溢出。
- 新增 `size` 属性：按场景指定宽度（数字 px / 带单位的字符串），优先级高于自适应计算。
- 新增 `fullscreen` 属性：占满视口，优先级高于 `size`；多级遮罩只保留第一层背景色，避免叠加变黑。
- 修复 `tip` 不红：`.red` 在项目里没有定义，改用 `.tip` + `var(--el-color-danger)`，且 `tip` 为空时不再渲染空 `span`。
- header 布局：`title` 单行省略、`btn-group` 用 `gap` 统一间距（去掉内联 `margin-left` 与 `:disabled="false"` 噪音）。
- `lazyContent` 状态整理：`shallowRef` + `isContentReady` 派生，「保存」守卫与占位逻辑共用同一状态；初始即打开时直接挂载，避免没有 `opened` 事件导致空白。
- `lazyContent` 卸载时机改为 `@closed` 动画结束后：保存后关闭大表格不再在同一任务里同步卸载阻塞点击；关闭动画中被重新打开时不卸载。
- 可访问性：补充 `role="dialog"` / `aria-label`。
- 清理死样式：`.select-form` / `.flex-right` / `.flex-row` 由旧版内容区继承而来，项目内已无使用方。
- 调用方修正：`justify/components/opinion.vue` 的 `size="500"` → `:size="500"`。

> 历史版本（`enableScroll` + `main-box` + scoped 样式）仅留档：[element-plus组件/drawer.md](../../vue/vite+vue3.0/element-plus组件/drawer.md)。
