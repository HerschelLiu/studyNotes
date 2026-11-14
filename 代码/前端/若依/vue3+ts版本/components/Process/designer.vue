<template>
  <div>
    <div class="card-header">
      <span>{{ translateNodeNameFn(elementType) }}</span>
    </div>
    <el-collapse v-model="activeName">
      <!--   常规信息     -->
      <el-collapse-item name="common">
        <template #title>
          <el-icon><InfoFilled /></el-icon>
          常规信息
        </template>
        <CommonPanel :id="elementId" />
      </el-collapse-item>

      <!--   任务信息     -->
      <el-collapse-item
        name="Task"
        v-if="elementType.indexOf('Task') !== -1">
        <template #title>
          <el-icon><Tickets /></el-icon>
          任务配置
        </template>
        <UserTaskPanel :id="elementId" />
      </el-collapse-item>

      <!--   表单     -->
      <el-collapse-item
        name="form"
        v-if="formVisible">
        <template #title>
          <el-icon><List /></el-icon>
          表单配置
        </template>
        <FormPanel :id="elementId" />
      </el-collapse-item>

      <!--   执行监听器     -->
      <el-collapse-item name="executionListener">
        <template #title>
          <el-icon><Promotion /></el-icon>
          执行监听器
          <el-badge
            :value="executionListenerCount"
            class="item"
            type="primary" />
        </template>
        <ExecutionListener
          :id="elementId"
          @getExecutionListenerCount="getExecutionListenerCount" />
      </el-collapse-item>

      <!--   任务监听器     -->
      <el-collapse-item
        name="taskListener"
        v-if="elementType === 'UserTask'">
        <template #title>
          <el-icon><Flag /></el-icon>
          任务监听器
          <el-badge
            :value="taskListenerCount"
            class="item"
            type="primary" />
        </template>
        <TaskListener
          :id="elementId"
          @getTaskListenerCount="getTaskListenerCount" />
      </el-collapse-item>

      <!--   多实例     -->
      <el-collapse-item
        name="multiInstance"
        v-if="elementType.indexOf('Task') !== -1">
        <template #title>
          <el-icon><Grid /></el-icon>
          多实例
        </template>
        <MultiInstance :id="elementId" />
      </el-collapse-item>
      <!--   流转条件     -->
      <el-collapse-item
        name="condition"
        v-if="conditionVisible">
        <template #title>
          <el-icon><Share /></el-icon>
          流转条件
        </template>
        <ConditionPanel :id="elementId" />
      </el-collapse-item>

      <!--   扩展属性     -->
      <el-collapse-item name="properties">
        <template #title>
          <el-icon><CirclePlus /></el-icon>
          扩展属性
        </template>
        <PropertiesPanel :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import ExecutionListener from './panel/executionListener.vue'
  import TaskListener from './panel/taskListener.vue'
  import MultiInstance from './panel/multiInstance.vue'
  import CommonPanel from './panel/commonPanel.vue'
  import UserTaskPanel from './panel/taskPanel.vue'
  import ConditionPanel from './panel/conditionPanel.vue'
  import FormPanel from './panel/formPanel.vue'
  import PropertiesPanel from './panel/PropertiesPanel.vue'
  import { translateNodeName } from './common/bpmnUtils'
  import { InfoFilled, Tickets, List, Promotion, Flag, Grid, Share, CirclePlus } from '@element-plus/icons-vue'

  defineOptions({ name: 'Designer' })

  const { proxy } = getCurrentInstance() as any

  const activeName = ref('common')
  const executionListenerCount = ref(0)
  const taskListenerCount = ref(0)
  const elementId = ref('')
  const elementType = ref('')
  const conditionVisible = ref(false) // 流转条件设置
  const formVisible = ref(false) // 表单配置

  /** 获取执行监听器数量 */
  const getExecutionListenerCount = (value: number) => {
    executionListenerCount.value = value
  }
  /** 获取任务监听器数量 */
  const getTaskListenerCount = (value: number) => {
    taskListenerCount.value = value
  }
  const translateNodeNameFn = (val: string) => translateNodeName(val)

  // 初始化数据
  const initFormOnChanged = (element: any) => {
    let activatedElement = element
    if (!activatedElement) {
      activatedElement =
        proxy.modelerStore.elRegistry.find((el: any) => el.type === 'bpmn:Process') ??
        proxy.modelerStore.elRegistry.find((el: any) => el.type === 'bpmn:Collaboration')
    }
    if (!activatedElement) return
    proxy.modelerStore.element = activatedElement
    elementId.value = activatedElement.id
    elementType.value = activatedElement.type.split(':')[1] || ''
    conditionVisible.value = !!(
      elementType.value === 'SequenceFlow' &&
      activatedElement.source &&
      activatedElement.source.type.indexOf('StartEvent') === -1
    )
    formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent'
  }

  // 注册节点事件
  const getActiveElement = () => {
    initFormOnChanged(null)
    proxy.modelerStore.modeler.on('import.done', () => {
      initFormOnChanged(null)
    })
    proxy.modelerStore.modeler.on('selection.changed', ({ newSelection }: any) => {
      initFormOnChanged(newSelection[0] || null)
    })
    proxy.modelerStore.modeler.on('element.changed', ({ element }: any) => {
      if (element && element.id === elementId.value) {
        initFormOnChanged(element)
      }
    })
  }

  // 初始化流程设计器
  const initModels = () => {
    getActiveElement()
  }

  /** 传值监听 */
  watch(
    () => elementId.value,
    () => {
      activeName.value = 'common'
    }
  )

  // created
  initModels()
</script>

<style lang="scss"></style>
