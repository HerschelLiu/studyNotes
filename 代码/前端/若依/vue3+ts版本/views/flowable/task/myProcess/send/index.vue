<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>
            <el-icon><Document /></el-icon>
            发起任务
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
          <!--初始化流程加载表单信息-->
          <el-col
            :span="16"
            :offset="4">
            <v-form-render
              :form-data="formRenderData"
              ref="vFormRef" />
            <div style="margin-left:15%;margin-bottom: 20px;font-size: 14px;">
              <el-button
                type="primary"
                @click="submitForm">
                提 交
              </el-button>
              <el-button
                type="primary"
                @click="resetForm">
                重 置
              </el-button>
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程图-->
        <el-tab-pane
          label="流程图"
          name="2">
          <BpmnViewer :flowData="flowData" />
        </el-tab-pane>
      </el-tabs>
      <!--选择流程接收人-->
      <el-dialog
        :title="taskTitle"
        v-model="taskOpen"
        width="65%"
        append-to-body>
        <FlowUser
          v-if="checkSendUser"
          :checkType="checkType"
          @handleUserSelect="handleUserSelect" />
        <FlowRole
          v-if="checkSendRole"
          @handleRoleSelect="handleRoleSelect" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="taskOpen = false">取 消</el-button>
            <el-button
              type="primary"
              @click="submitTask">
              提 交
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { definitionStart, flowXmlAndNode } from '@/api/flowable/definition'
  import { flowFormData } from '@/api/flowable/process'
  import { getNextFlowNodeByStart } from '@/api/flowable/todo'
  import BpmnViewer from '@/components/Process/viewer/index.vue'
  import FlowUser from '@/components/flow/User/index.vue'
  import FlowRole from '@/components/flow/Role/index.vue'
  import { Document } from '@element-plus/icons-vue'

  defineOptions({ name: 'Record' })

  const route = useRoute()
  const { proxy } = getCurrentInstance() as any

  // 模型xml数据
  const flowData = ref<any>({})
  const activeName = ref('1')
  const deployId = ref('')  // 流程定义编号
  const procDefId = ref('')  // 流程实例编号
  const formRenderData = ref<any>({})
  const taskTitle = ref<any>(null)
  const taskOpen = ref(false)
  const checkSendUser = ref(false) // 是否展示人员选择模块
  const checkSendRole = ref(false) // 是否展示角色选择模块
  const checkType = ref('') // 选择类型
  const checkValues = ref<any>(null) // 选中任务接收人员数据
  const formData = ref<any>({}) // 填写的表单数据
  const multiInstanceVars = ref('') // 会签节点
  const formJson = ref<any>({}) // 表单json
  const vFormRef = ref<any>(null)

  /** 返回页面 */
  const goBack = () => {
    const obj = { path: '/task/process', query: { t: Date.now() } }
    proxy.$tab.closeOpenPage(obj)
  }
  /** 流程表单数据 */
  const getFlowFormData = (deployIdVal: string) => {
    const params = { deployId: deployIdVal }
    flowFormData(params).then((res: any) => {
      nextTick(() => {
        vFormRef.value.setFormJson(res.data)
        formJson.value = res.data
      })
    }).catch(() => {
      goBack()
    })
  }
  const handleClick = (tab: any) => {
    if (tab.paneName === '2') {
      flowXmlAndNode({ deployId: deployId.value }).then((res: any) => {
        flowData.value = res.data
      })
    }
  }

  // created
  deployId.value = route.query && (route.query.deployId as any)
  procDefId.value = route.query && (route.query.procDefId as any)
  getFlowFormData(deployId.value)
  /** 申请流程表单数据提交 */
  const submitForm = () => {
    vFormRef.value.getFormData().then((formFormData: any) => {
      getNextFlowNodeByStart({ deploymentId: deployId.value, variables: formFormData }).then((res: any) => {
        const data = res.data
        if (data) {
          formData.value = formFormData
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
            taskOpen.value = true
            taskTitle.value = '选择任务接收'
          } else {
            if (procDefId.value) {
              const param: any = {
                formJson: formJson.value,
              }
              Object.assign(param, formFormData)
              definitionStart(procDefId.value, param).then((res: any) => {
                proxy.$modal.msgSuccess(res.msg)
                goBack()
              })
            }
          }
        }
      })
    }).catch(() => {
    })
  }
  /** 重置表单 */
  const resetForm = () => {
    vFormRef.value.resetForm()
  }
  /** 提交流程 */
  const submitTask = () => {
    if (!checkValues.value && checkSendUser.value) {
      proxy.$modal.msgError('请选择任务接收!')
      return
    }
    if (!checkValues.value && checkSendRole.value) {
      proxy.$modal.msgError('请选择流程接收角色组!')
      return
    }
    if (formData.value) {
      const param: any = {
        formJson: formJson.value,
      }
      Object.assign(param, formData.value)
      if (multiInstanceVars.value) {
        param[multiInstanceVars.value] = checkValues.value
      } else {
        param['approval'] = checkValues.value
      }
      definitionStart(procDefId.value, param).then((res: any) => {
        proxy.$modal.msgSuccess(res.msg)
        goBack()
      })
    }
  }
  /** 用户信息选中数据 */
  const handleUserSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.userId)
        if (multiInstanceVars.value) {
          checkValues.value = selectVal
        } else {
          checkValues.value = selectVal.join(',')
        }
      } else {
        checkValues.value = selection.userId
      }
    }
  }
  /** 角色信息选中数据 */
  const handleRoleSelect = (selection: any) => {
    if (selection) {
      if (selection instanceof Array) {
        const selectVal = selection.map((item: any) => item.roleId)
        checkValues.value = selectVal.join(',')
      } else {
        checkValues.value = selection
      }
    }
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
