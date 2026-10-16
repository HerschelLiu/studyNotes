### `useFormAttachment`



```ts
import type { RequestAddAttachment, ResponseListAttachment } from '@/api/masterBudget'
import type { MaybeRefOrGetter, Ref } from 'vue'
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
   */
  bizId?: MaybeRefOrGetter<string | number | undefined>
  uuid?: MaybeRefOrGetter<string | undefined>
  /** 抽屉/弹窗的 v-model 引用：变为 false 时清空本地附件列表 */
  visible?: MaybeRefOrGetter<boolean | undefined>
}

export interface UseFormAttachmentResult {
  readonly list: Ref<RequestAddAttachment[]>
  handleUploadSuccess: (res: UploadFileResult, file: UploadUserFile) => void
  handleDelete: (items: RequestAddAttachment | RequestAddAttachment[]) => void
  /** 接收 CompUploadTemp @change 回传的列表，供 save 拼接 bizId */
  setList: (items: ResponseListAttachment[]) => void
  /** 新建态保存表单后，将返回的表单 id 写入每条附件 */
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
  const { bizType, bizId, visible, uuid } = baseOptions

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

  const save = async (id?: string | number) => {
    // 无业务主键/无附件时不调用批量关联接口（后端要求列表非空）；解除关联由逐条删除接口负责
    if ((toValue(bizId) || toValue(uuid) || id) && list.value.length) {
      await updateSaveAttachment(list.value.map(item => ({ ...item, bizId: id || toValue(bizId), uuid: toValue(uuid) })))
    }
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



### `CompUploadTemp`

```vue
<template>
  <comp-dialog
    v-model="show"
    title="附件管理"
    :min-width="800"
    :is-scroll="false">
    <!-- 按钮组 start -->
    <div class="btnGroup mb8">
      <!-- <el-button
        type="primary"
        size="small"
        @click="">
        批量下载
      </el-button>

      <el-button
        type="primary"
        size="small"
        @click="">
        附件库
      </el-button> -->
    </div>
    <!-- 按钮组 end -->

    <!-- 上传 start -->
    <CompFileUpload
      v-if="showUpload && !preview"
      is-drag
      :show-upload-file-list="false"
      :file-type="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'png', 'jpg', 'jpeg']"
      @success="handleUploadSuccess" />
    <!-- 上传 end -->

    <!-- 表格 start -->
    <CompTable
      v-model:list="list"
      :columns="columns"
      :show-table-tool-bar="false"
      :selectable="false"
      index>
      <template #col-action="{ row }">
        <el-button
          type="primary"
          link
          icon="View"
          size="small"
          @click="handlePreview(row)">
          预览
        </el-button>

        <el-button
          type="primary"
          link
          icon="Download"
          size="small"
          @click="handleDownload(row)">
          下载
        </el-button>

        <el-button
          type="primary"
          link
          icon="Delete"
          size="small"
          @click="handleDelete(row)">
          删除
        </el-button>

        <el-button
          type="primary"
          link
          icon="EditPen"
          size="small"
          @click="handleRename(row)">
          重命名
        </el-button>
      </template>
    </CompTable>
    <!-- 表格 end -->

    <!-- 分页 start -->
    <pagination
      v-if="enablePage"
      v-show="list.total > 0"
      :total="list.total"
      v-model:page="list.query.pageNum"
      v-model:limit="list.query.pageSize"
      @pagination="getList"
      style="padding: 6px 0px" />
    <!-- 分页 end -->

    <CompPreview
      v-model="modalList.showPreview"
      :url="previewUrl" />
  </comp-dialog>
</template>

<script lang="ts" setup>
  import type { RequestListAttachment, ResponseListAttachment } from '@/api/masterBudget'
  import type { TableColumn } from '@/components/CompTable/types'
  import type { UploadFileResult } from '@/types/api/common'

  import { deleteAttachment, listAttachment, updateAttachment } from '@/api/masterBudget'
  import { UploadBizType } from '@/enum'
  import { useModal } from '@/hooks/useModal'
  import { useSuccess } from '@/hooks/useTip'
  import { ElMessageBox, UploadUserFile } from 'element-plus'

  import CompDialog from '@/components/Dialog/index.vue'
  import CompFileUpload from '@/components/FileUpload/index.vue'
  import CompPreview from '@/components/Preview/index.vue'
  import CompTable from '@/components/CompTable/index.vue'

  type RequestList = RequestListAttachment
  type ResponseList = ResponseListAttachment

  const { proxy } = getCurrentInstance()!

  interface Props {
    bizId?: string | number
    bizType: UploadBizType
    showUpload?: boolean
    uuid?: string
    /** 是否启用分页 */
    enablePage?: boolean
    preview?: boolean
    /** 是否表单内选择 */
    selectable?: boolean
    /**
     * 外部预加载开关：为 true 时即使弹窗未打开也查询附件列表
     * 用于编辑态抽屉打开即获取已关联附件，驱动外部表单的附件镜像字段
     */
    active?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    showUpload: true,
    enablePage: true,
    preview: false,
    selectable: false,
    active: false
  })
  const emit = defineEmits<{
    change: [selected: ResponseList[]]
    success: []
  }>()
  const show = defineModel<boolean>({
    default: false,
  })

  const { list, getList, resetList } = useListQuery<RequestList, ResponseList>(
    {
      bizId: props.bizId as string,
      bizType: props.bizType,
      uuid: props.uuid
    },
    (query) => queryKeys.attachment.list(query),
    async query => {
      const data = await listAttachment({
        ...query,
        bizId: props.bizId as string,
        bizType: props.bizType,
        uuid: props.uuid,
      })

      emit('change', data.rows)
      return data
    },
    {
      enabled: () => (show.value || props.active) && (!!props.bizId || !!props.uuid) && !!props.bizType,
      enablePage: computed(() => props.enablePage),
    }
  )
  const { modalList, handleShowModal } = useModal({
    showPreview: false,
  })

  const previewUrl = ref('')

  /** 表格列配置 */
  const columns: TableColumn<ResponseList>[] = [
    { prop: 'fileName', label: '附件名称', align: 'center', showOverflowTooltip: true },
    { prop: 'uploadTime', label: '上传时间', align: 'center' },
    { prop: 'action', label: '操作', width: 260, slot: true },
  ]

  // 弹窗关闭时整体重置列表（items/total/query）
  // active 预加载模式下列表由外部抽屉生命周期托管，关闭弹窗保留数据，避免空窗与重复请求
  watch(show, val => {
    if (!val) {
      emit('change', list.items)
      if (!props.active) resetList()
    }
  })

  const handlePreview = (row: ResponseList) => {
    previewUrl.value = row.relativePath
    handleShowModal('showPreview')
  }

  const handleDownload = (row: ResponseList) => {
    !(proxy as any).downloadGet(row.relativePath, {}, `${row.fileName}`)
  }

  const { submit: handleDelete } = useSubmit(
    async (row: ResponseList) => {
      try {
        await deleteAttachment({
          id: row.id,
          bizId: props.bizId as string,
          bizType: props.bizType,
        })
        list.loading = false
        useSuccess('删除成功')
        getList()
      } catch (error) {
        throw error
      }
    },
    {
      invalidateKeys: [queryKeys.attachment.list()],
      showConfirm: true,
      confirmTitle: row => `是否删除${row?.fileName}附件？`,
    }
  )

  const handleRename = (row: ResponseList) => {
    ElMessageBox.prompt('请输入新的附件名称', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: row.fileName,
      inputValidator: val => {
        if (val.trim() !== '') return true
        return '附件名称不能为空'
      },
    }).then(async ({ value }) => {
      await updateAttachment(
        {
          id: row.id,
          fileName: value,
          bizId: props.bizId as string,
          bizType: props.bizType,
        },
        !!row.id
      )
      useSuccess('重命名成功')
      getList()
    })
  }

  const { submit: handleUploadSuccess } = useSubmit(
    async (res: UploadFileResult, file: UploadUserFile) => {
      try {
        await updateAttachment({
          filePath: res.url,
          originalName: res.originalFilename,
          fileName: res.originalFilename,
          fileSize: file.size,
          relativePath: res.fileName,
          bizId: props.bizId as string,
          bizType: props.bizType,
          uuid: props.uuid,
        })
        useSuccess('上传成功')
        emit('success')
        return Promise.resolve()
      } catch (error) {
        throw error
      }
    },
    {
      showLoading: true,
      loadingTitle: `正在提交...`,
      invalidateKeys: [queryKeys.attachment.list()],
    }
  )
</script>

<style scoped lang="scss">
  .btnGroup {
    display: flex;
    justify-content: flex-end;
  }
</style>

```

业务场景：

这个上传组件设计之初是先有项目Id，再上传附件，在updateAttachment方法上，这样minIO与项目就关联上了。但是后续发现有些需要在新建表格中上传，因为表单没创建，所以没有id，所以新写useFormAttachment，并多加了uuid，这样等表格提交，返回表单id给到useFormAttachment.save，这样就互相关联了，新建表单中使用方式：

```vue
<template>
<CompUploadTemp
  v-model="modalList.showAttachment" // 打开、关闭弹窗
  :biz-id="form.id"
  :uuid="attachmentUuid"
  :biz-type="UploadBizType['项目库管理']"
  :enable-page="false" 
  @change="setAttachmentList" />
</template>

<script lang="ts" setup>
const attachmentUuid = ref('') // 标识id，可用nanoid()

const {
  list: attachmentList,
  setList: setAttachmentList, // 对附件组件change回来的数据作一些操作
  save: saveAttachments,
} = useFormAttachment({
  bizType: UploadBizType['项目库管理'],
  bizId: () => form.id,
  visible: show,// // 弹框关闭时清空（组件未销毁，避免下次打开残留）
})
</script>
```

