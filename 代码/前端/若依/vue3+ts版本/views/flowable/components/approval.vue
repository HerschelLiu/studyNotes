<template>
  <CompDialog
    v-model="show"
    v-loading="isLoading"
    width="500"
    title="流程审批">
    <el-form
      size="large"
      label-position="right"
      :rules="rules"
      :model="taskForm"
      :validate-on-rule-change="false"
      :disabled="isLoading"
      :inline="false"
      label-width="6em">
      <el-form-item>
        <FlowUser
          v-if="checkSendUser"
          :checkType="checkType"
          @handleUserSelect="handleUserSelect" />
        <FlowRole
          v-if="checkSendRole"
          @handleRoleSelect="handleRoleSelect" />
      </el-form-item>

      <el-form-item
        label="处理意见"
        prop="comment">
        <el-input
          type="textarea"
          :rows="4"
          resize="none"
          v-model="taskForm.comment"
          placeholder="请输入处理意见" />
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
          @click="handleApprove">
          审 批
        </el-button>
      </div>
    </template>
  </CompDialog>
</template>

<script lang="ts" setup>
  import type { RequestApproveTask } from '@/api/flowable'

  import { approveTask } from '@/api/flowable'
  import { useReactive } from '@/hooks/useObject'
  import { useRules } from '@/hooks/useRules'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { readNextFlowNode } from '@/api/flowable/task'
  import { useError, useSuccess } from '@/hooks/useTip'

  import CompDialog from '@/components/Dialog/index.vue'
  import FlowUser from '@/components/flow/User/index.vue'
  import FlowRole from '@/components/flow/Role/index.vue'

  const props = defineProps<{
    taskId: string
  }>()

  const emit = defineEmits(['change'])
  const show = defineModel<boolean>({ default: false })

  const { ELForm } = useTempRefs('ELForm')

  const [taskForm, resetTaskForm] = useReactive<RequestApproveTask>({
    taskId: '',
    comment: '',
    variables: {}
  })

  const rules = useRules([{ key: 'comment', label: '处理意见' }])

  watch(show, newVal => {
    if (!newVal) {
      resetTaskForm()
    }
  })

  const { data: nextFlowNodeData, isLoading } = useQuery({
    queryKey: computed(() => queryKeys.flowable.nextFlowNode(props.taskId)),
    queryFn: async () => {
      const { data } = await readNextFlowNode(props.taskId)

      return data
    },
    enabled: computed(() => !!props.taskId && show.value)
  })

  /** 是否展示人员选择模块 */
  const checkSendUser = computed(() => nextFlowNodeData.value?.dataType === 'dynamic' && nextFlowNodeData.value?.type !== 'candidateGroups')

  /** 是否展示角色选择模块 */
  const checkSendRole = computed(() => nextFlowNodeData.value?.dataType === 'dynamic' && nextFlowNodeData.value?.type === 'candidateGroups')

  /** 选择类型 */
  const checkType = computed(() => {
    const { dataType, type } = nextFlowNodeData.value ?? {}
    if (dataType !== 'dynamic') return 'single'
    if (type === 'assignee') return 'single'
    if (type === 'candidateGroups') return 'single'
    return 'multiple'
  })

  /** 会签节点 */
  const multiInstanceVars = computed(() => nextFlowNodeData.value?.dataType === 'dynamic' && !['assignee', 'candidateUsers', 'candidateGroups'].includes(nextFlowNodeData.value?.type) ? nextFlowNodeData.value?.vars : '')


  /** 用户信息选中数据 */
  const handleUserSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.userId.toString())
        if (multiInstanceVars.value) {
          taskForm.variables![multiInstanceVars.value] = selectVal
        } else {
          taskForm.variables!['approval'] = selectVal.join(',')
        }
      } else {
        taskForm.variables!['approval'] = selection.userId.toString()
      }
    }
  }

  /** 角色信息选中数据 */
  const handleRoleSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.roleId.toString())
        taskForm.variables!['approval'] = selectVal.join(',')
      } else {
        taskForm.variables!['approval'] = selection
      }
    }
  }

  const { submit: handleApprove } = useSubmit(
    async () => {
      const request = {
        ...taskForm,
        taskId: props.taskId,
      }
      try {
        if (!taskForm.variables && checkSendUser.value) {
          useError('请选择流程接收人员')
          return Promise.reject()
        }
        if (!taskForm.variables && checkSendRole.value) {
          useError('请选择流程接收角色组')
          return Promise.reject()
        }
        if (!taskForm.comment) {
          useError('请输入审批意见')
          return Promise.reject()
        }
        await approveTask(request)
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
