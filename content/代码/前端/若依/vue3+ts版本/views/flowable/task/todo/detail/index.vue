<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="flex space-between">
          <div class="flex">
            <div class="flex">
              <el-icon><Document /></el-icon>
              待办任务
            </div>
            <el-tag class="mr10 ml10">发起人:{{ state.startUser }}</el-tag>
            <el-tag>任务节点:{{ state.taskName }}</el-tag>
          </div>
          <el-button
            size="small"
            type="danger"
            @click="goBack">
            关闭
          </el-button>
        </div>
      </template>

      <el-tabs
        tab-position="top"
        v-model="state.activeName">
        <!--表单信息-->
        <el-tab-pane
          label="表单信息"
          name="1">
          <el-col
            :span="16"
            :offset="4">
            <!-- <v-form-render ref="vFormRef" /> -->
            <FlowableBizDetails
              :task-id="taskForm.taskId"
              :is-show-audit="true"
              @change="goBack" />
          </el-col>
        </el-tab-pane>

        <!--流程流转记录-->
        <el-tab-pane
          label="流转记录"
          name="2">
          <el-col
            :span="16"
            :offset="4">
            <div class="block">
              <TheRecord :flow-record-list="flowRecordList!" />
            </div>
          </el-col>
        </el-tab-pane>

        <!--流程图-->
        <el-tab-pane
          label="流程图"
          name="3">
          <BpmnViewer
            :flowData="flowData"
            :procInsId="taskForm.procInsId" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { useValidateArgs } from '@/hooks/useArgs'
  import { useReactive } from '@/hooks/useObject'
  import { listFlowRecord, readFlowXmlAndNode } from '@/api/flowable/task'

  import BpmnViewer from '@/components/Process/viewer/index.vue'
  import FlowableBizDetails from '@/views/flowable/components/details.vue'
  import TheRecord from '@/views/flowable/task/todo/detail/components/record.vue'

  const { proxy } = getCurrentInstance() as any

  const [state] = useReactive({
    /** 发起人信息 */
    startUser: '',
    /** 任务节点名称 */
    taskName: '',
    /** 选中的tab名称 */
    activeName: '1'
  })

  const [taskForm] = useReactive({
    procInsId: '',
    deployId: '',
    instanceId: '',
    taskId: ''
  })

  /** 返回页面 */
  const goBack = () => {
    const obj = { path: '/task/todo', query: { t: Date.now() } }
    proxy?.$tab.closeOpenPage(obj)
  }

  /** 流程节点数据 */
  const { data: flowData } = useQuery({
    queryKey: computed(() => queryKeys.flowable.flowXmlAndNode(taskForm)),
    queryFn: async () => {
      const request = { procInsId: taskForm.procInsId, deployId: taskForm.deployId }
      const { data } = await readFlowXmlAndNode(request)
      return data
    },
    enabled: computed(() => !!taskForm.procInsId && !!taskForm.deployId && state.activeName === '3')
  })

  /** 流程流转记录 */
  const { data: flowRecordList } = useQuery({
    queryKey: computed(() => queryKeys.flowable.listFlowRecord(taskForm)),
    queryFn: async () => {
      const request = { procInsId: taskForm.procInsId, deployId: taskForm.deployId }
      const { data } = await listFlowRecord(request)
      return data?.flowList || []
    },
    enabled: computed(() => !!taskForm.procInsId && !!taskForm.deployId)
  })

  onMounted(async () => {
    state.startUser = await useValidateArgs('startUser')
    state.taskName = await useValidateArgs('taskName')

    taskForm.taskId = await useValidateArgs('taskId')
    taskForm.procInsId = await useValidateArgs('procInsId')
    taskForm.deployId = await useValidateArgs('deployId')
    taskForm.instanceId = await useValidateArgs('instanceId', false)
  })
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
    margin-bottom: 20px;
  }

  .clearfix {
    &::before,
    &::after {
      display: table;
      content: '';
    }
    &::after {
      clear: both
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .space-between {
    justify-content: space-between;
  }
</style>
