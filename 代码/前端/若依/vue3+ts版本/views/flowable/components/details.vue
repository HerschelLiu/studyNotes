<template>
  <div
    v-loading="isLoading"
    class="flowable-biz-details">
    <template v-if="data?.bizKey">
      <el-alert
        :title="`当前业务单据：${data?.bizName}`"
        type="info"
        :closable="false"
        style="margin-bottom: 15px" />
      <el-button
        type="primary"
        plain
        @click="handleShowDetails">
        查看详情
      </el-button>

      <template v-if="props.isShowAudit">
        <el-button
          type="primary"
          @click="handleShowModal('showApproval')">
          审 批
        </el-button>
        <!--deptFill(被驳回回起点/首节点)不能驳回，隐藏驳回按钮-->
        <el-button
          v-if="!(data?.taskDefKey === 'deptFill')"
          type="danger"
          plain
          @click="handleShowModal('showReject')">
          驳 回
        </el-button>
      </template>

      <el-button
        type="primary"
        plain
        @click="handleShowModal('showAttachment')">
        附件
      </el-button>
    </template>
    <el-empty
      v-else-if="!isLoading"
      description="暂无数据" />

    <!-- 科室填报详情抽屉 -->
    <!-- <DeptFillDetails
      v-if="bizKey === BIZ_KEY.DEPT_FILL"
      v-model="modalList.showDetails"
      :data="bizData" /> -->
    <!-- 项目论证详情抽屉 -->
    <JustifyDetails
      v-if="data?.bizKey === BizKey.项目论证"
      v-model="modalList.showDetails"
      :data="data?.demonstrate!"
      preview />

    <!-- 审批抽屉 -->
    <TheApproval
      v-model="modalList.showApproval"
      :task-id="props.taskId"
      @change="emits('change')" />

    <!-- 驳回抽屉 -->
    <TheReject
      v-model="modalList.showReject"
      :task-id="props.taskId"
      @change="emits('change')" />

    <!-- 附件 -->
    <CompUploadTemp
      v-if="data?.bizKey === BizKey.项目论证"
      v-model="modalList.showAttachment"
      :show-upload="false"
      :bizId="data?.demonstrate?.id as string"
      :bizType="UploadBizType['项目论证']" />
    <!-- 附件 end -->
  </div>
</template>

<script lang="ts" setup>
  import { readTaskDetails } from '@/api/flowable'
  import { useModal } from '@/hooks/useModal'
  import { BizKey } from '@/enum/flowable'
  import { UploadBizType } from '@/enum'

  import CompUploadTemp from '@/components/UploadTemp/index.vue'
  import DeptFillDetails from '@/views/masterBudget/budgetPrep/deptFill/components/details.vue'
  import JustifyDetails from '@/views/masterBudget/projectRepo/justification/justify/components/details.vue'
  import TheApproval from './approval.vue'
  import TheReject from './reject.vue'

  interface Props {
    taskId: string
    isShowAudit?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isShowAudit: false,
  })
  const emits = defineEmits(['change'])

  const { modalList, handleShowModal } = useModal({
    showDetails: false,
    showAttachment: false,
    showApproval: false,
    showReject: false,
  })

  const { isLoading, data } = useQuery({
    queryKey: queryKeys.flowable.taskDetail(props.taskId),
    queryFn: async () => {
      const { data } = await readTaskDetails(props.taskId)
      return data
    },
    enabled: computed(() => !!props.taskId),
  })

  /** 打开业务详情 */
  const handleShowDetails = () => {
    // 政府采购详情为独立页面，跳转查看
    // if (bizKey.value === BIZ_KEY.GOV_PURCHASE) {
    //   router.push({
    //     path: '/masterBudget/projectRepo/govProc/govProcDetailList',
    //     query: { id: bizId.value },
    //   })
    //   return
    // }
    handleShowModal('showDetails')
  }
</script>

<style lang="scss" scoped>
  .flowable-biz-details {
    width: 100%;
  }
</style>
