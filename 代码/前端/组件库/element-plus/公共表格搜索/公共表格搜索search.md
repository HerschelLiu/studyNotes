# 公共表格搜索 TableSearch

> 列表页统一搜索区外壳：`el-form` + 左侧搜索项 + 「查询 / 重置」+ 右侧操作区 + 可选「返回」按钮，样式与布局已统一，业务只写搜索项和按钮。

## 目录

- [概述](#概述)
- [Props](#props)
- [事件](#事件)
- [插槽](#插槽)
- [源码](#源码)
- [使用](#使用)
  - [配合 `CompCommonSearchItem`](#配合-compcommonsearchitem)
  - [注意](#注意)

## 概述

- **结构**：左侧 `#left` 放搜索项（通常用 `CompCommonSearchItem`），右侧 `#right` 放批量操作按钮。
- **查询**：点查询先 `validate()`，通过后 `emit('search')`；校验失败只提示、不请求。
- **重置**：先 `clearValidate()` 再 `emit('reset')`，由页面自行复位查询条件。
- **布局**：`direction` 支持横向 / 纵向；纵向时右侧区域占满整行。
- **依赖**：`useSearch`（查询对象与事件约定）、`useTempRefs`（表单实例）、`useState`（返回）、`useStyle`（内联样式）。

## Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `object` | `{}` | 查询对象，双向绑定到 `el-form` |
| `loading` | `boolean` | `false` | 查询中状态，控制按钮 loading |
| `rules` | `FormRules` | `{}` | 校验规则，按 `el-form-item` 的 `prop`（查询字段名）匹配 |
| `direction` | `boolean` | `false` | 是否纵向布局 |
| `showSearchBtn` | `boolean` | `true` | 是否显示「查询」按钮 |
| `showResetBtn` | `boolean` | `true` | 是否显示「重置」按钮 |
| `showBackButton` | `boolean` | `false` | 是否显示「返回」按钮（调用 `useState().handleCancel`） |
| `size` | `'' \| 'large' \| 'default' \| 'small'` | `'small'` | 表单 / 按钮尺寸 |
| `cardProps` | `object` | — | 透传给外层容器的属性（如 `shadow`） |

## 事件

| 事件 | 触发时机 | 说明 |
| --- | --- | --- |
| `search` | 点「查询」或回车提交，且校验通过 | 页面在这里把 `pageNum` 置 1 并请求列表 |
| `reset` | 点「重置」 | 页面复位查询条件后重新查询 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `left` | 左侧搜索项区域；**只有传了 `#left` 才会渲染左侧区块与查询/重置按钮** |
| `right` | 右侧操作区，可放批量删除、导入导出等按钮 |

## 源码

`index.vue`：

```vue
<template>
  <div
    v-bind="cardProps"
    shadow="never"
    class="search-wrapper">
    <el-form
      ref="ELForm"
      :model="model"
      :rules="rules"
      :validate-on-rule-change="false"
      :size="size"
      label-position="left"
      inline
      class="custom-search"
      :style="style"
      @submit.prevent="handleSearch">
      <div
        v-if="slots.left"
        class="left">
        <slot name="left" />

        <el-form-item v-if="showSearchBtn">
          <el-button
            :loading="loading"
            type="primary"
            icon="Search"
            :size="size"
            native-type="submit">
            查询
          </el-button>
          <el-button
            v-if="showResetBtn"
            icon="Refresh"
            :size="size"
            :loading="loading"
            @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </div>

      <div
        v-if="slots.right || showBackButton"
        class="right"
        :style="rightStyle">
        <el-button
          v-if="showBackButton"
          size="default"
          icon="Back"
          @click="useState().handleCancel">
          返回
        </el-button>
        <slot name="right" />
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import type { FormRules } from 'element-plus'

  import { ref, useSlots } from 'vue'
  import { useStyle } from '@/hooks/useStyle'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { useState } from '@/hooks/useState'

  interface Props {
    model: object
    showBackButton?: boolean
    /** 表单校验规则：按 el-form-item 的 prop（即查询字段名）匹配 */
    rules?: FormRules
    /** 是否纵向布局 */
    direction?: boolean
    loading: boolean
    showSearchBtn?: boolean
    cardProps?: object
    size?: '' | 'large' | 'default' | 'small'
    showResetBtn?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    model: () => ({}),
    showBackButton: false,
    rules: () => ({}),
    direction: false,
    loading: false,
    showSearchBtn: true,
    size: 'small',
    showResetBtn: true,
  })

  const emit = defineEmits(['search', 'reset'])

  const { ELForm } = useTempRefs('ELForm');
  const slots = useSlots()

  /** 搜索 */
  const handleSearch = async () => {
    try {
      if (ELForm?.value) await ELForm.value?.validate()
      emit('search')
    } catch (error) {
      // nothing
    }
  }

  const handleReset = () => {
    ELForm.value?.clearValidate()
    emit('reset')
  }

  /** 样式 */
  const style = computed(() => {
    return useStyle({
      flexDirection: props.direction ? 'column' : 'row',
    })
  })
  const rightStyle = computed(() => {
    return useStyle({
      width: props.direction ? '100%' : 'auto',
      marginLeft: props.direction ? '0' : '50px',
    })
  })
</script>

<style scoped>
  .search-wrapper {
    margin-bottom: 16px;
    padding-top: 16px;
  }

  .custom-search {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    .left {
      display: flex;
      flex-flow: row wrap;

      .title {
        color: var(--el-text-color-primary);
        font-size: 16px;
        font-weight: bold;
        line-height: 32px;
      }

      .text {
        line-height: 32px;
      }

      .form-flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        min-height: 40px;

        .form-group {
          margin: 0;
        }

        .gray {
          flex-grow: 1;
          margin-top: 0;
          margin-right: 30px;
          margin-left: 1em;
          font-size: 14px;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      flex-shrink: 0;
      justify-content: flex-end;
      /* margin-bottom: 16px; */

      .el-button + .el-button {
        margin-left: 16px;
      }

      .text {
        margin-right: 16px;
        line-height: 32px;
      }
    }

    .el-form-item {
      margin-right: 16px;

      &.fr {
        margin-right: 0;
      }
    }

    .el-select {
      vertical-align: top;
    }

    .el-form-item__error {
      top: 30px;
    }
  }
</style>
```

## 使用

在每个列表页的 search 组件里使用：

```vue
<template>
  <CompTableSearch
    :model="query"
    :loading="loading"
    @search="handleSearch"
    @reset="handleReset">
    <template #left>
      <el-form-item label="项目名称">
        <el-input
          v-model.trim="query.projectName"
          placeholder="项目名称"
          clearable
          size="default"
          class="width-240" />
      </el-form-item>

    </template>

    <template #right>
      <slot />
    </template>
  </CompTableSearch>
</template>

<script lang="ts" setup>
  import type { RequestList } from '../list.vue'

  import { defineSearchEmits, defineSearchProps, useSearch } from '@/hooks/useSearch'

  import CompTableSearch from '@/components/TableSearch/index.vue'

  const props = defineProps({
    ...defineSearchProps<RequestList>(),
  })

  const emit = defineEmits([...defineSearchEmits()])

  /** 搜索基础数据 */
  const { query, handleReset, handleSearch } = useSearch<RequestList>(props, { emit })
</script>
```

### 配合 `CompCommonSearchItem`

搜索项较多时，左侧不要手写一堆 `el-form-item`，直接用 `CompCommonSearchItem` 渲染：

```vue
<CompTableSearch :model="list.query" :loading="list.loading" @search="handleSearch" @reset="handleReset">
  <template #left>
    <CompCommonSearchItem v-model="list.query" :options="searchOptions" />
  </template>
  <template #right>
    <el-button type="danger" :disabled="!selected.length" @click="handleBatchDelete">批量删除</el-button>
  </template>
</CompTableSearch>
```

### 注意

1. `#left` 不传时，查询 / 重置按钮也不会渲染（按钮在左侧区块内）。
2. `search` 前会做表单校验，像「日期范围起止必填」这类规则直接写 `rules` 即可，不用在页面里再判断。
3. `reset` 只清校验状态，**不会**清空 `model`；清空逻辑在页面的 `handleReset` 里（一般用 `resetList()` 或 `useAssign`）。
4. 组件本身不含分页；分页用 `<pagination>` 或列表 hook 里的 `list.query.pageNum/pageSize`。
