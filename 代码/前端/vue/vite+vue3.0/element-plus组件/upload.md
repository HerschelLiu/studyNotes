```js
<template>
  <div class="flex flex-wrap">
    <div v-if="list.length" class="img-box">
      <comp-image
        v-for="(item, index) in list"
        :key="item.imagePath"
        :src="item.allImagePath"
        :preview-src-list="previewList"
        border-radius="6px"
        :width="width"
        :height="height"
        :initial-index="index"
        class="m-2px"
      />

      <div v-if="!look" class="img-delete" @click="handleRemove(index)">
        <el-icon class="icon"><Delete /></el-icon>
      </div>
    </div>

    <div v-if="list.length < limit && !look" class="m-2">
      <el-upload
        ref="ELElement"
        :action="uploadImageUrl"
        :show-file-list="false"
        :headers="headers"
        :accept="_accept"
        :limit="limit"
        :on-exceed="exceedUpload"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        :on-remove="uploadRemove"
      >
        <div class="upload">
          <div v-loading="loading" class="upload-btn" :style="boxStyle">
            <el-icon><Plus /></el-icon>
          </div>
        </div>
      </el-upload>
      <el-text v-if="isHaveValue(tip)" type="info" size="small" class="mt-5">{{ tip }}</el-text>
    </div>
  </div>
</template>

<script setup>
import { uploadImageUrl } from '@/api/autarky/autarky';
import { getToken } from '@/utils/auth';
import { isImage } from '@/hooks/useValidate';
import { useError } from '@/hooks/useTip';
import { computed, ref, watch } from 'vue';
import { useStyle, useUnit } from '@/hooks/useStyle';
import { isHaveValue } from '@/hooks/useValidate';

import { Plus, Delete } from '@element-plus/icons-vue';
import CompImage from '@/components/image/index.vue';

const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 1,
  },
  /** 上传大小限制, 默认5MB */
  fileLimit: {
    type: Number,
    default: 5 * 1024 * 1024,
  },
  /** 上传文件类型
   * @type { 'img' }
   */
  type: {
    type: String,
    default: 'img',
  },
  /** 多选 */
  multiple: {
    type: Boolean,
    default: false,
  },
  /** 接收的文件类型 */
  accept: {
    type: String,
    default: '',
  },
  /**
   * 文件列表的类型
   * @type { 'text' | 'picture' | 'picture-card' }
   */
  listType: {
    type: String,
    default: 'picture-card',
  },
  /** 宽度 */
  width: {
    type: [String, Number],
    default: 250,
  },
  /** 接收的文件类型 */
  height: {
    type: [String, Number],
    default: 250,
  },
  tip: {
    type: String,
    default: '',
  },
  previewUrl: {
    type: String,
    default: 'allImagePath',
  },
  /** 是否仅预览 */
  look: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['error', 'success', 'remove']);

const headers = ref({
  Authorization: 'Bearer ' + getToken(),
});
/** 当前文件 */
const currentFile = ref();
const loading = ref(false);
const ELElement = ref(null);
const list = ref([]);

const previewList = computed(() =>
  isHaveValue(props.previewUrl) ? list.value.map((item) => item[props.previewUrl]) : list.value
);
const boxStyle = computed(() => {
  return useStyle({
    width: useUnit(props.width),
    height: useUnit(props.height),
  });
});

const _accept = computed(() => {
  let __accept = '';

  switch (props.type) {
    case 'img':
    default:
      __accept = '.jpg,.jpeg,.png,.gif';
      break;
  }

  return `${__accept},${props.accept}`;
});

watch(() => props.fileList, val => {
  list.value = val.filter(item => isHaveValue(item[props.previewUrl]))
}, { immediate: true })

/** 上传之前 */
const beforeUpload = (file) => {
  currentFile.value = file;

  if (props.type === 'img') {
    const pass = file.size < props.fileLimit;
    if (!isImage(file)) {
      useError('上传图片只能是 jpg,jpeg,png,gif 格式');
      emit('error');
      return false;
    } else if (!pass) {
      useError(`上传图片大小不能超过 ${props.fileLimit / 1024 / 1024}MB!`);
      emit('error');
      return false;
    }
  } else {
    useError(`上传文件类型有误`);
    emit('error');

    return false;
  }

  loading.value = true;
  return true;
};

/** 上传错误 */
const uploadFail = () => {
  loading.value = false;
  useError('上传失败，请重试');
  clearFiles();
  emit('error');
};

/** 上传超出数量 */
const exceedUpload = () => {
  loading.value = false;
  useError('上传的图片或文件超出数量啦');
  clearFiles();
  emit('error');
};

/** 清除已上传 */
const clearFiles = () => {
  ELElement.value?.clearFiles();
};

/** 上传文件完成 */
const uploadSuccess = (res) => {
  if (res.success !== true || res.code !== 200) {
    loading.value = false;
    useError(res.msg);
    emit('error');
    return;
  }
  // if (Array.isArray(value.value)) value.value.push(res.data);
  // else value.value = res.data;
  const obj = {
    allImagePath: res.data.allImagePath,
    imagePath: res.data.imagePath,
    fileName: res.data.fileName,
  };
  list.value = [...list.value, obj];
  loading.value = false;
  emit('success', { list: list.value, res: res.data });
};

/** 删除已上传文件 */
const uploadRemove = (file) => {
  const _list = [...list.value]
  if (file.response === undefined) return
  const index = _list.findIndex(item => file.response.data.imagePath === item.imagePath)
  _list.splice(index, 1)
  list.value = _list
}


/** 手动删除单文件 */
const handleRemove = (index) => {
  const _list = [...list.value]
  _list.splice(index, 1)
  list.value = _list
  emit('remove')
}
</script>

<style lang="scss" scoped>
.upload {
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--el-border-color-darker);
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }
  }
}

.img-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .img-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 44px;
    height: 44px;
    background: rgba(#333, 0.8);
    border-radius: 0 6px 0 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .icon {
      color: var(--el-color-danger);
      margin: 0 0 10px 10px;
    }
  }
}
</style>

```

