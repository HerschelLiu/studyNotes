<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span><el-icon><Document /></el-icon> 待办任务</span>
          <el-tag style="margin-left:10px">发起人:{{ startUser }}</el-tag>
          <el-tag>任务节点:{{ taskName }}</el-tag>
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
            <v-form-render ref="vFormRef" />
            <div style="margin-left:10%;margin-bottom: 20px;font-size: 14px;">
              <el-button
                type="primary"
                @click="handleComplete">
                审 批
              </el-button>
            </div>
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
        <!--流程图-->
        <el-tab-pane
          label="流程图"
          name="3">
          <BpmnViewer
            :flowData="flowData"
            :procInsId="taskForm.procInsId" />
        </el-tab-pane>
      </el-tabs>
      <!--审批任务-->
      <el-dialog
        :title="completeTitle"
        v-model="completeOpen"
        width="60%"
        append-to-body>
        <el-form
          ref="taskFormRef"
          :model="taskForm">
          <el-form-item prop="targetKey">
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
            label-width="80px"
            prop="comment"
            :rules="[{ required: true, message: '请输入处理意见', trigger: 'blur' }]">
            <el-input
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入处理意见" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="completeOpen = false">取 消</el-button>
            <el-button
              type="primary"
              @click="taskComplete">
              确 定
            </el-button>
          </span>
        </template>
      </el-dialog>
      <!--退回流程-->
      <el-dialog
        :title="returnTitle"
        v-model="returnOpen"
        width="40%"
        append-to-body>
        <el-form
          ref="taskFormRef"
          :model="taskForm"
          label-width="80px">
          <el-form-item
            label="退回节点"
            prop="targetKey">
            <el-radio-group v-model="taskForm.targetKey">
              <el-radio-button
                v-for="item in returnTaskList"
                :key="item.id"
                :label="item.id">
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="退回意见"
            prop="comment"
            :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
            <el-input
              style="width: 50%"
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入意见" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="returnOpen = false">取 消</el-button>
            <el-button
              type="primary"
              @click="taskReturn">
              确 定
            </el-button>
          </span>
        </template>
      </el-dialog>
      <!--驳回流程-->
      <el-dialog
        :title="rejectTitle"
        v-model="rejectOpen"
        width="40%"
        append-to-body>
        <el-form
          ref="taskFormRef"
          :model="taskForm"
          label-width="80px">
          <el-form-item
            label="驳回意见"
            prop="comment"
            :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
            <el-input
              style="width: 50%"
              type="textarea"
              v-model="taskForm.comment"
              placeholder="请输入意见" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="rejectOpen = false">取 消</el-button>
            <el-button
              type="primary"
              @click="taskReject">
              确 定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { flowRecord } from '@/api/flowable/finished'
  import { flowXmlAndNode } from '@/api/flowable/definition'
  import {
    complete,
    rejectTask,
    returnList,
    returnTask,
    getNextFlowNode,
    delegate,
    flowTaskForm
  } from '@/api/flowable/todo'
  import BpmnViewer from '@/components/Process/viewer'
  import FlowUser from '@/components/flow/User'
  import FlowRole from '@/components/flow/Role'
  import { Document, User, Calendar, Clock, Tickets } from '@element-plus/icons-vue'

  defineOptions({ name: 'Record' })

  const route = useRoute()
  const { proxy } = getCurrentInstance() as any

  const eventName = ref('click')
  // 流程数据
  const flowData = ref<any>({})
  const activeName = ref('1')
  // 遮罩层
  const loading = ref(true)
  const flowRecordList = ref<any[]>([]) // 流程流转数据
  const rules = reactive<Record<string, any[]>>({})
  const taskForm = reactive<any>({
    returnTaskShow: false,
    delegateTaskShow: false,
    defaultTaskShow: true,
    comment: '',
    procInsId: '',
    instanceId: '',
    deployId: '',
    taskId: '',
    procDefId: '',
    targetKey: '',
    variables: {},
  })
  const returnTaskList = ref<any[]>([])  // 回退列表数据
  const completeTitle = ref<any>(null)
  const completeOpen = ref(false)
  const returnTitle = ref<any>(null)
  const returnOpen = ref(false)
  const rejectOpen = ref(false)
  const rejectTitle = ref<any>(null)
  const checkSendUser = ref(false) // 是否展示人员选择模块
  const checkSendRole = ref(false)// 是否展示角色选择模块
  const checkType = ref('single') // 选择类型
  const taskName = ref<any>(null) // 任务节点
  const startUser = ref<any>(null) // 发起人信息
  const multiInstanceVars = ref('') // 会签节点
  const formJson = ref<any>({})
  const vFormRef = ref<any>(null)
  const taskFormRef = ref<any>(null)

  /** 返回页面 */
  const goBack = () => {
    const obj = { path: '/task/todo', query: { t: Date.now() } }
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
  /** 流程节点表单 */
  const getFlowTaskForm = (taskId: string) => {
    if (taskId) {
      flowTaskForm({ taskId: taskId }).then((res: any) => {
        vFormRef.value.setFormJson(res.data.formJson)
        formJson.value = res.data.formJson
        nextTick(() => {
          vFormRef.value.setFormData(res.data)
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
  /** 用户信息选中数据 */
  const handleUserSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.userId.toString())
        if (multiInstanceVars.value) {
          taskForm.variables[multiInstanceVars.value] = selectVal
        } else {
          taskForm.variables['approval'] = selectVal.join(',')
        }
      } else {
        taskForm.variables['approval'] = selection.userId.toString()
      }
    }
  }
  /** 角色信息选中数据 */
  const handleRoleSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.roleId.toString())
        taskForm.variables['approval'] = selectVal.join(',')
      } else {
        taskForm.variables['approval'] = selection
      }
    }
  }
  /** 委派任务 */
  const handleDelegate = () => {
    taskForm.delegateTaskShow = true
    taskForm.defaultTaskShow = false
  }
  const handleAssign = () => {
  }
  /** 驳回任务 */
  const handleReject = () => {
    rejectOpen.value = true
    rejectTitle.value = '驳回流程'
  }
  /** 驳回任务 */
  const taskReject = () => {
    taskFormRef.value.validate((valid: boolean) => {
      if (valid) {
        rejectTask(taskForm).then((res: any) => {
          proxy.$modal.msgSuccess(res.msg)
          goBack()
        })
      }
    })
  }
  /** 可退回任务列表 */
  const handleReturn = () => {
    returnOpen.value = true
    returnTitle.value = '退回流程'
    returnList(taskForm).then((res: any) => {
      returnTaskList.value = res.data
    })
  }
  /** 提交退回任务 */
  const taskReturn = () => {
    taskFormRef.value.validate((valid: boolean) => {
      if (valid) {
        returnTask(taskForm).then((res: any) => {
          proxy.$modal.msgSuccess(res.msg)
          goBack()
        })
      }
    })
  }
  /** 取消回退任务按钮 */
  const cancelTask = () => {
    taskForm.returnTaskShow = false
    taskForm.defaultTaskShow = true
    returnTaskList.value = []
  }
  /** 委派任务 */
  const submitDeleteTask = () => {
    taskFormRef.value.validate((valid: boolean) => {
      if (valid) {
        delegate(taskForm).then((response: any) => {
          proxy.$modal.msgSuccess(response.msg)
          goBack()
        })
      }
    })
  }
  /** 取消回退任务按钮 */
  const cancelDelegateTask = () => {
    taskForm.delegateTaskShow = false
    taskForm.defaultTaskShow = true
    returnTaskList.value = []
  }
  /** 加载审批任务弹框 */
  const handleComplete = () => {
    completeOpen.value = true
    completeTitle.value = '流程审批'
    submitForm()
  }
  /** 用户审批任务 */
  const taskComplete = () => {
    if (!taskForm.variables && checkSendUser.value) {
      proxy.$modal.msgError('请选择流程接收人员!')
      return
    }
    if (!taskForm.variables && checkSendRole.value) {
      proxy.$modal.msgError('请选择流程接收角色组!')
      return
    }
    if (!taskForm.comment) {
      proxy.$modal.msgError('请输入审批意见!')
      return
    }
    if (taskForm) {
      complete(taskForm).then((response: any) => {
        proxy.$modal.msgSuccess(response.msg)
        goBack()
      })
    } else {
      complete(taskForm).then((response: any) => {
        proxy.$modal.msgSuccess(response.msg)
        goBack()
      })
    }
  }
  /** 申请流程表单数据提交 */
  const submitForm = () => {
    const params = { taskId: taskForm.taskId }
    getNextFlowNode(params).then((res: any) => {
      vFormRef.value.getFormData().then((formFormData: any) => {
        Object.assign(taskForm.variables, formFormData)
        taskForm.variables.formJson = formJson.value
        console.log(taskForm, '流程审批提交表单数据1')
      }).catch(() => {
      })
      const data = res.data
      if (data) {
        if (data.dataType === 'dynamic') {
          if (data.type === 'assignee') {
            checkSendUser.value = true
            checkType.value = 'single'
          } else if (data.type === 'candidateUsers') {
            checkSendUser.value = true
            checkType.value = 'multiple'
          } else if (data.type === 'candidateGroups') {
            checkSendRole.value = true
          } else {
            multiInstanceVars.value = data.vars
            checkSendUser.value = true
            checkType.value = 'multiple'
          }
        }
      }
    })
  }
  /** 动态绑定操作按钮的点击事件 */
  const handleButtonClick = (method: string) => {
    ;(proxy as any)[method]()
  }

  // created
  if (route.query) {
    taskName.value = route.query.taskName
    startUser.value = route.query.startUser
    taskForm.deployId = route.query.deployId as any
    taskForm.taskId = route.query.taskId as any
    taskForm.procInsId = route.query.procInsId as any
    taskForm.executionId = route.query.executionId as any
    taskForm.instanceId = route.query.procInsId as any
    if (taskForm.taskId) {
      getFlowTaskForm(taskForm.taskId)
    }
    getFlowRecordList(taskForm.procInsId, taskForm.deployId)
  }
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
