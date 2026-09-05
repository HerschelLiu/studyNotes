`useFormAttachment`



```ts
import type { RequestAddAttachment, ResponseListAttachment } from '@/api/masterBudget'
import type { MaybeRefOrGetter } from 'vue'
import type { UploadBizType } from '@/enum'
import type { UploadFileResult } from '@/types'
import type { UploadUserFile } from 'element-plus'

import { updateSaveAttachment } from '@/api/masterBudget'

/** useFormAttachment 入参 */
export interface UseFormAttachmentOptions {
  /** 业务附件类型（保存时写入每条附件） */
  bizType: UploadBizType
  /**
   * 业务主键
   * - 静态值：'123'
   * - ref / computed：bizIdRef
   * - reactive 字段：() => form.id
   * - props 传值：() => props.id
   */
  bizId?: MaybeRefOrGetter<string | number | undefined>
  /** 抽屉/弹窗的 v-model 引用：变为 false 时清空本地附件列表 */
  visible?: MaybeRefOrGetter<boolean | undefined>
}

export interface UseFormAttachmentResult {
  readonly list: { readonly value: ReadonlyArray<RequestAddAttachment> }
  handleUploadSuccess: (res: UploadFileResult, file: UploadUserFile) => void
  handleDelete: (items: RequestAddAttachment | RequestAddAttachment[]) => void
  setList: (items: ResponseListAttachment[]) => void
  save: (bizIdArg?: string | number) => Promise<void>
  clear: () => void
}

type AttachmentDraft = Omit<RequestAddAttachment, 'bizType'>

const mapUploadResult = (item: UploadFileResult, fileSize?: number): AttachmentDraft => ({
  filePath: item.url,
  originalName: item.originalFilename,
  fileName: item.originalFilename,
  fileSize,
  relativePath: item.fileName
})

const mapResponseRow = (item: ResponseListAttachment): AttachmentDraft => ({
  id: item.id,
  fileName: item.fileName,
  filePath: item.filePath,
  relativePath: item.relativePath
})

export function useFormAttachment(baseOptions: UseFormAttachmentOptions): UseFormAttachmentResult {
  const { bizType, bizId, visible } = baseOptions

  const list = ref<RequestAddAttachment[]>([])

  const handleUploadSuccess = (res: UploadFileResult, file: UploadUserFile) => {
    list.value.push({ ...mapUploadResult(res, file?.size), bizType })
  }

  const handleDelete = (items: RequestAddAttachment | RequestAddAttachment[]) => {
    const deleteSet = new Set(Array.isArray(items) ? items : [items])
    list.value = list.value.filter(item => !deleteSet.has(item))
  }

  const setList = (items: ResponseListAttachment[]) => {
    list.value = items.map(item => ({ ...mapResponseRow(item), bizType }))
  }

  const save = async (bizIdArg?: string | number) => {
    const raw = bizIdArg ?? toValue(bizId)
    const finalBizId = raw == null ? '' : String(raw)
    if (!finalBizId) return

    await updateSaveAttachment(list.value.map(item => ({ ...item, bizId: finalBizId })))
  }

  const clear = () => {
    list.value = []
  }

  // 弹框关闭时清空（组件未销毁，避免下次打开残留）
  watch(
    () => toValue(visible),
    newVisible => {
      if (!newVisible) clear()
    }
  )

  return {
    list,
    handleUploadSuccess,
    handleDelete,
    setList,
    save,
    clear
  }
}

```



使用

```vue
<template>
  <div>
    <el-button
      type="primary"
      @click="show = true">
      打开表单
    </el-button>

    <el-dialog
      v-model="show"
      title="示例表单（提交时保存附件，关闭/取消清缓存）"
      width="900px"
      @closed="handleClosed">
      <!-- 上传区 -->
      <FileUpload
        isDrag
        :file-type="fileTypeList"
        @success="attachment.handleUploadSuccess" />

      <!-- 已上传附件展示 -->
      <div class="mt16">
        <div class="mb8 f16 bold">已上传（{{ attachment.list.value.length }}）</div>
        <el-table
          v-if="attachment.list.value.length"
          :data="attachment.list.value as any"
          size="small"
          border>
          <el-table-column
            label="附件名称"
            prop="fileName"
            show-overflow-tooltip />
          <el-table-column
            label="大小"
            width="100"
            align="center">
            <template #default="{ row }">{{ formatSize(row.fileSize) }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template #default="{ row }">
              <el-button
                type="danger"
                link
                size="small"
                @click="attachment.handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button @click="show = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import FileUpload from '@/components/FileUpload/index.vue'
  import { UploadBizType } from '@/enum'
  import { useFormAttachment } from '@/hooks/useFormAttachment'
  import { useSuccess } from '@/hooks/useTip'
  import { nanoid } from 'nanoid'

  const fileTypeList: string[] = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png']

  const show = ref(false)
  /** 模拟业务主键：真实场景下由保存主表接口返回，或由上层 props 传入 */
  const bizId = ref<string | number | undefined>()

  const attachment = useFormAttachment({
    bizType: UploadBizType.项目论证,
    // bizId 支持四种形态：'123' / bizId(ref) / () => form.id / () => props.id
    bizId: bizId,
    visible: show,
  })

  const formatSize = (size?: number) => {
    if (!size) return '-'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const handleSave = async () => {
    // 真实场景：先保存业务主表，拿到 bizId，再保存附件
    bizId.value = bizId.value ?? `DEMO_${nanoid(8)}`
    await attachment.save(bizId.value)
    useSuccess('保存成功（含附件）')
    show.value = false
  }

  const handleClosed = () => {
    // visible 变 false 已触发 clear，此处留作额外清理钩子
  }
</script>

<style scoped lang="scss">
  .mt16 { margin-top: 16px; }
  .mb8  { margin-bottom: 8px; }
  .f16  { font-size: 16px; }
  .bold { font-weight: 600; }
</style>

```

