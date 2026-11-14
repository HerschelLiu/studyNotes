<template>
  <CompDialog
    v-model="show"
    width="500"
    title="流程审批">
    <el-form
      size="large"
      label-position="right"
      :rules="rules"
      :model="taskForm"
      :validate-on-rule-change="false"
      :inline="false"
      label-width="6em">
      <el-form-item
        label="驳回意见"
        prop="comment">
        <el-input
          type="textarea"
          :rows="4"
          resize="none"
          v-model="taskForm.comment"
          placeholder="请输入驳回意见" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="btn-group el-flex-center mt20">
        <el-button
          plain
          @click="show = false">
          取 消
        </el-button>
        <!-- v-busy="" -->
        <el-button
          type="primary"
          @click="handleReject">
          驳 回
        </el-button>
      </div>
    </template>
  </CompDialog>
</template>

<script lang="ts" setup>
  import type { RequestApproveTask } from '@/api/flowable'

  import { rejectTask } from '@/api/flowable'
  import { useReactive } from '@/hooks/useObject'
  import { useRules } from '@/hooks/useRules'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { useSuccess } from '@/hooks/useTip'

  import CompDialog from '@/components/Dialog/index.vue'

  const props = defineProps<{
    taskId: string
  }>()

  const emit = defineEmits(['change'])
  const show = defineModel<boolean>({ default: false })

  const { ELForm } = useTempRefs('ELForm')

  const [taskForm, resetTaskForm] = useReactive<RequestApproveTask>({
    taskId: '',
    comment: '',
  })

  const rules = useRules([{ key: 'comment', label: '驳回意见' }])

  watch(show, newVal => {
    if (!newVal) {
      resetTaskForm()
    }
  })

  const { submit: handleReject } = useSubmit(
    async () => {
      const request = {
        ...taskForm,
        taskId: props.taskId,
      }
      try {
        await rejectTask(request)
        useSuccess('提交成功')
        show.value = false
        emit('change')
      } catch (error) {
        throw error
      }
      return Promise.resolve()
    },
    {
      showLoading: true,
      loadingTitle: `正在提交...`,
      ELForm,
      invalidateKeys: [queryKeys.flowable.flowXmlAndNode()],
    }
  )
</script>

<style lang="scss" scoped>
  .btn-group {
    display: flex;
    justify-content: flex-end;
  }
</style>
