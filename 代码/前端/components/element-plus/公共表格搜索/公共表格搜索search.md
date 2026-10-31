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



使用

在每个列表页的search组件中使用

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

