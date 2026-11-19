<template>
  <div
    ref="rootRef"
    class="el-input-tag input-tag-wrapper"
    :class="[size ? 'el-input-tag--' + size : '']"
    @click="focusTagInput">
    <el-tag
      v-for="(tag, idx) in innerTags"
      v-bind="$attrs"
      :key="idx"
      :size="(size as any)"
      effect="dark"
      closable
      :disable-transitions="false"
      @close="remove(idx)">
      {{ tag }}
    </el-tag>
    <input
      v-if="!readOnly"
      class="tag-input"
      :placeholder="placeholder"
      @input="inputTag"
      :value="newTag"
      @keydown.delete.stop="removeLastTag" />
    <!--    @keydown = "addNew"
            @blur = "addNew"-->
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'

  import { ref, watch } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'ElInputTag', inheritAttrs: false })

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    addTagOnKeys: {
      type: Array as PropType<number[]>,
      default: () => []
    },
    size: {
      type: String,
      default: 'small'
    },
    placeholder: String
  })

  const emit = defineEmits(['update:modelValue'])

  const newTag = ref('')
  const innerTags = ref<string[]>([])
  const readOnly = ref(true)
  const rootRef = ref<HTMLElement>()

  const focusTagInput = () => {
    if (readOnly.value || !rootRef.value?.querySelector('.tag-input')) {
      return
    }
    const tagInput = rootRef.value.querySelector('.tag-input') as HTMLInputElement | null
    tagInput?.focus()
  }

  const inputTag = (ev: Event) => {
    newTag.value = (ev.target as HTMLInputElement).value
  }

  const addNew = (e: KeyboardEvent) => {
    if (e && !props.addTagOnKeys.includes(e.keyCode) && e.type !== 'blur') {
      return
    }
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    let addSuccess = false
    if (newTag.value.includes(',')) {
      newTag.value.split(',').forEach((item) => {
        if (addTag(item.trim())) {
          addSuccess = true
        }
      })
    } else {
      if (addTag(newTag.value.trim())) {
        addSuccess = true
      }
    }
    if (addSuccess) {
      tagChange()
      newTag.value = ''
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !innerTags.value.includes(trimmedTag)) {
      innerTags.value.push(trimmedTag)
      return true
    }
    return false
  }

  const remove = (index: number) => {
    innerTags.value.splice(index, 1)
    tagChange()
  }

  const removeLastTag = () => {
    if (newTag.value) {
      return
    }
    innerTags.value.pop()
    tagChange()
  }

  const tagChange = () => {
    emit('update:modelValue', innerTags.value)
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        innerTags.value = newVal!.split(',')
      } else {
        innerTags.value = []
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  .el-form-item.is-error .el-input-tag {
    border-color: #f56c6c;
  }
  .input-tag-wrapper {
    position: relative;
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    outline: none;
    padding: 0 10px 0 5px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .el-tag {
    margin-right: 4px;
  }

  .tag-input {
    background: transparent;
    border: 0;
    font-size: inherit;
    outline: none;
    padding-left: 0;
    width: 100px;
  }
  .el-input-tag {
    min-height: 42px;
  }
  .el-input-tag--small {
    min-height: 32px;
    line-height: 32px;
    font-size: 12px;
  }

  .el-input-tag--default {
    min-height: 34px;
    line-height: 34px;
  }

  .el-input-tag--large {
    min-height: 36px;
    line-height: 36px;
  }
</style>
