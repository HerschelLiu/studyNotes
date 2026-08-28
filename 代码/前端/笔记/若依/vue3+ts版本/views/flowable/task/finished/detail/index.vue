<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>
            <el-icon><Document /></el-icon>
            已办任务
          </span>
          <el-button
            style="float: right;"
            size="small"
            type="danger"
            @click="goBack">
            关闭
          </el-button>
        </div>
      </template>
      <el-tabs
        tab-position="top"
        v-model="activeName"
        @tab-click="handleClick">
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
              <el-timeline>
                <el-timeline-item
                  v-for="(item,index ) in flowRecordList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)">
                  <p style="font-weight: 700">{{ item.taskName }}</p>
                  <el-card :body-style="{ padding: '10px' }">
                    <el-descriptions
                      class="margin-top"
                      :column="1"
                      size="small"
                      border>
                      <el-descriptions-item
                        v-if="item.assigneeName"
                        label-class-name="my-label">
                        <template #label>
                          <el-icon><User /></el-icon>
                          办理人
                        </template>
                        {{ item.assigneeName }}
                        <el-tag
                          type="info"
                          size="small">
                          {{ item.deptName }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.candidate"
                        label-class-name="my-label">
                        <template #label>
                          <el-icon><User /></el-icon>
                          候选办理
                        </template>
                        {{ item.candidate }}
                      </el-descriptions-item>
                      <el-descriptions-item label-class-name="my-label">
                        <template #label>
                          <el-icon><Calendar /></el-icon>
                          接收时间
                        </template>
                        {{ item.createTime }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.finishTime"
                        label-class-name="my-label">
                        <template #label>
                          <el-icon><Calendar /></el-icon>
                          处理时间
                        </template>
                        {{ item.finishTime }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.duration"
                        label-class-name="my-label">
                        <template #label>
                          <el-icon><Clock /></el-icon>
                          耗时
                        </template>
                        {{ item.duration }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.comment"
                        label-class-name="my-label">
                        <template #label>
                          <el-icon><Tickets /></el-icon>
                          处理意见
                        </template>
                        {{ item.comment.comment }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-tab-pane>
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

<script setup lang="ts">
  import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { flowRecord } from '@/api/flowable/finished'
  import { getProcessVariables, flowXmlAndNode } from '@/api/flowable/definition'
  import { Document, User, Calendar, Clock, Tickets } from '@element-plus/icons-vue'

  import BpmnViewer from '@/components/Process/viewer/index.vue'
  import FlowableBizDetails from '@/views/flowable/components/details.vue'

  defineOptions({ name: 'Record' })

  const route = useRoute()
  const { proxy } = getCurrentInstance() as any

  // 模型xml数据
  const flowData = ref<any>({})
  const activeName = ref('1')
  // 遮罩层
  const loading = ref(true)
  const flowRecordList = ref<any[]>([]) // 流程流转数据
  const taskForm = reactive<any>({
    multiple: false,
    comment: '', // 意见内容
    procInsId: '', // 流程实例编号
    instanceId: '', // 流程实例编号
    deployId: '',  // 流程定义编号
    taskId: '', // 流程任务编号
    procDefId: '',  // 流程编号
    vars: '',
  })
  const vFormRef = ref<any>(null)

  /** 返回页面 */
  const goBack = () => {
    const obj = { path: '/task/finished', query: { t: Date.now() } }
    proxy.$tab.closeOpenPage(obj)
  }
  /** 流程流转记录 */
  const getFlowRecordList = (procInsId: string, deployIdVal: string) => {
    const params = { procInsId: procInsId, deployId: deployIdVal }
    flowRecord(params).then((res: any) => {
      flowRecordList.value = res.data.flowList
    }).catch(() => {
      goBack()
    })
  }
  /** 获取流程变量内容 */
  const processVariables = (taskId: string) => {
    if (taskId) {
      getProcessVariables(taskId).then((res: any) => {
        nextTick(() => {
          vFormRef.value.setFormJson(res.data.formJson)
          nextTick(() => {
            vFormRef.value.setFormData(res.data)
            nextTick(() => {
              vFormRef.value.disableForm()
            })
          })
        })
      })
    }
  }
  const handleClick = (tab: any) => {
    if (tab.paneName === '3') {
      flowXmlAndNode({ procInsId: taskForm.procInsId, deployId: taskForm.deployId }).then((res: any) => {
        flowData.value = res.data
      })
    }
  }
  const setIcon = (val: any) => {
    if (val) {
      return 'Check'
    } else {
      return 'Clock'
    }
  }
  const setColor = (val: any) => {
    if (val) {
      return '#2bc418'
    } else {
      return '#b3bdbb'
    }
  }

  // created
  taskForm.deployId = route.query && (route.query.deployId as any)
  taskForm.taskId = route.query && (route.query.taskId as any)
  taskForm.procInsId = route.query && (route.query.procInsId as any)
  if (taskForm.taskId) {
    processVariables(taskForm.taskId)
  }
  getFlowRecordList(taskForm.procInsId, taskForm.deployId)
</script>
<style lang="scss" scoped>
  .test-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    margin-bottom: 20px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .my-label {
    background: #E1F3D8;
  }
</style>
