# 公共组件抽屉 CompDrawer

> 统一封装的 `el-drawer`：**header 固定、内容区滚动**，宽度按「视口 70% 与 1152 取大」自适应，嵌套时每层 ×0.9 递减；`v-model` 控制显隐，`save` / `cancel` 交由业务处理。

## 目录

- [概述](#概述)
- [Props](#props)
- [事件](#事件)
- [插槽](#插槽)
- [尺寸与层级](#尺寸与层级)
- [源码（当前实现）](#源码当前实现)
- [历史简化版](#历史简化版)
- [使用示例](#使用示例)
- [注意事项](#注意事项)

## 概述

- 结构：`el-drawer`（`with-header=false`）→ 自定义 `.header`（标题 + 提示 + 取消/保存）+ `el-scrollbar.drawer-content`（业务内容）。
- 层级：`append-to-body`，嵌套抽屉时靠 `zIndex` 控制并自动收窄宽度。
- 显隐：`defineModel<boolean>`，父组件用 `v-model`。
- 保存：只 `emit('save')`，是否关闭由父组件决定（通常保存成功后 `show = false`）。

## Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `boolean` | `false` | 抽屉显隐（必传） |
| `title` | `string` | `''` | 标题 |
| `tip` | `string` | `''` | 标题后的红字提示 |
| `showSaveButton` | `boolean` | `true` | 是否显示保存按钮 |
| `buttonName` | `string` | `'保存'` | 保存按钮文案 |
| `loading` | `boolean` | `false` | 保存按钮 loading |
| `zIndex` | `number` | `1` | 嵌套层级，> 1 时宽度按 0.9 递减 |
| `destroyOnClose` | `boolean` | `true` | 关闭后销毁内容 |
| `closeOnClickModal` | `boolean` | `false` | 点遮罩是否关闭 |
| `canCancel` | `boolean` | `true` | 为 `false` 时点「取消」不会关闭（仍会 emit `cancel`） |
| `enableScroll` | `boolean` | `true` | **已废弃**：内容区统一由 `.drawer-content` 滚动，传值不再影响布局 |

## 事件

| 事件 | 说明 |
| --- | --- |
| `save` | 点「保存」触发，业务在这里校验并提交 |
| `cancel` | 点「取消」触发（先按 `canCancel` 决定是否关闭） |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 抽屉内容，外层已带 `el-scrollbar`，内部不要再套滚动容器 |

## 尺寸与层级

```ts
const size = ref(1152)
onBeforeMount(() => {
  const clientWidth = document.documentElement.clientWidth * 0.7
  if (clientWidth > size.value) size.value = clientWidth
  if (props.zIndex > 1) {
    for (let i = 0; i < props.zIndex - 1; i++) size.value *= 0.9
  }
})
```

- 单层：宽度取 `max(1152, 视口 × 0.7)`。
- 嵌套第 n 层：再乘 `0.9^(n-1)`，视觉上层层内缩。

## 源码（当前实现）

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

## 历史简化版

> 早期版本：没有 `closeOnClickModal` / `canCancel` / `cancel` 事件，`enableScroll` 也还没废弃。**新代码用上面的当前实现**，这里仅留档。

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

## 使用示例

```vue
<template>
  <CompDrawer
    v-model="show"
    title="编辑预算科目"
    tip="带 * 项必填"
    :z-index="2"
    :loading="saving"
    @save="handleSave"
    @cancel="handleCancel">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="科目编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
    </el-form>
  </CompDrawer>
</template>

<script lang="ts" setup>
  const show = defineModel<boolean>({ default: false })
  const saving = ref(false)
  const formRef = ref()
  const form = reactive({ code: '' })
  const rules = {
    code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
  }

  /** 替换成真实保存接口 */
  const saveApi = (data: typeof form) => Promise.resolve(data)

  const handleSave = async () => {
    await formRef.value?.validate()
    saving.value = true
    try {
      await saveApi(form)
      show.value = false
    } finally {
      saving.value = false
    }
  }

  const handleCancel = () => {
    // 需要二次确认时在这里拦；canCancel=false 时可用
  }
</script>
```

## 注意事项

1. **header 固定、内容滚动**：`.el-drawer__body` 是 `flex column`，`.header` 不滚动，`.drawer-content` 用 `flex: 1; min-height: 0`；不要在内容里再写 `height: 100%` 的滚动容器。
2. **样式必须写在非 scoped 块**：抽屉被 `append-to-body` 传送到 `body`，`scoped` 样式作用不到，靠 `.comp-drawer-box` 唯一 class 定位。
3. **`enableScroll` 已废弃**：不要再用它控制滚动，传了也不生效。
4. **保存不自动关闭**：`save` 只是事件，提交成功后要自己 `show = false`；`cancel` 在 `canCancel = false` 时也不关闭（用于「有未保存修改」拦截）。
5. 嵌套抽屉记得递增 `z-index` 属性（`zIndex`），否则宽度不会内缩、层级也可能被覆盖。
