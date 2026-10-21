<template>
  <span class="preview-actions">
    <el-button
      v-if="print"
      @click="emit('print')">
      打印
    </el-button>

    <el-button
      v-if="download"
      @click="emit('download')">
      下载
    </el-button>
  </span>
</template>

<script lang="ts" setup>
  interface Props {
    /** 是否显示打印按钮 */
    print?: boolean
    /** 是否显示下载按钮 */
    download?: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    print: []
    download: []
  }>()
</script>
