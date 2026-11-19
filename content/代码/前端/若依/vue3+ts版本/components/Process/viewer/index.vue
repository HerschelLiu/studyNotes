<template>
  <div class="containers">
    <el-container style="align-items: stretch">
      <el-main class="flow-viewer">
        <div class="process-status">
          <span class="intro">状态：</span>
          <div class="finish">已办理</div>
          <div class="processing">处理中</div>
          <div class="todo">未进行</div>
        </div>
        <!-- 流程图显示 -->
        <div
          v-loading="loading"
          class="canvas"
          ref="flowCanvas"></div>
        <!--  按钮区域  -->
        <el-button-group class="button-group">
          <el-tooltip
            effect="dark"
            content="适中"
            placement="bottom">
            <el-button
              size="small"
              icon="Rank"
              @click="fitViewport" />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="放大"
            placement="bottom">
            <el-button
              size="small"
              icon="ZoomIn"
              @click="zoomViewport(true)" />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="缩小"
            placement="bottom">
            <el-button
              size="small"
              icon="ZoomOut"
              @click="zoomViewport(false)" />
          </el-tooltip>
        </el-button-group>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import type { PropType } from 'vue'
  import { CustomViewer as BpmnViewer } from '@/components/Process/common'

  defineOptions({ name: 'BpmnViewer' })

  const props = defineProps({
    flowData: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
      required: false
    },
    procInsId: {
      type: String,
      default: ''
    },
  })

  const { proxy } = getCurrentInstance() as any

  const flowCanvas = ref<HTMLElement | null>(null)
  const bpmnViewer = ref<any>(null)
  const flowDetail = ref<any>({})
  const loading = ref(true)
  let zoom = 1

  // 设置高亮颜色的
  const fillColor = (nodeData: any[]) => {
    const canvas = bpmnViewer.value.get('canvas')
    bpmnViewer.value.getDefinitions().rootElements[0].flowElements.forEach((n: any) => {
      const completeTask = nodeData.find(m => m.key === n.id)
      const todoTask = nodeData.find(m => !m.completed)
      const endTask = nodeData[nodeData.length - 1]
      if (n.$type === 'bpmn:UserTask') {
        if (completeTask) {
          canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
          n.outgoing?.forEach((nn: any) => {
            const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              if (todoTask && completeTask.key === todoTask.key && !todoTask.completed) {
                canvas.addMarker(nn.id, todoTask.completed ? 'highlight' : 'highlight-todo')
                canvas.addMarker(nn.targetRef.id, todoTask.completed ? 'highlight' : 'highlight-todo')
              } else {
                canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              }
            }
          })
        }
      }
      // 排他网关
      else if (n.$type === 'bpmn:ExclusiveGateway') {
        if (completeTask) {
          canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
          n.outgoing?.forEach((nn: any) => {
            const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          })
        }
      }
      // 并行网关
      else if (n.$type === 'bpmn:ParallelGateway') {
        if (completeTask) {
          canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
          n.outgoing?.forEach((nn: any) => {
            const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          })
        }
      } else if (n.$type === 'bpmn:StartEvent') {
        n.outgoing.forEach((nn: any) => {
          const completeTaskStart = nodeData.find(m => m.key === nn.targetRef.id)
          if (completeTaskStart) {
            canvas.addMarker(nn.id, 'highlight')
            canvas.addMarker(n.id, 'highlight')
            return
          }
        })
      } else if (n.$type === 'bpmn:EndEvent') {
        if (endTask.key === n.id && endTask.completed) {
          canvas.addMarker(n.id, 'highlight')
          return
        }
      }
    })
  }

  // 让图能自适应屏幕
  const fitViewport = () => {
    zoom = bpmnViewer.value.get('canvas').zoom('fit-viewport', 'auto')
    loading.value = false
  }

  // 加载流程图片
  const loadFlowCanvas = async (flowData: any) => {
    try {
      await bpmnViewer.value.importXML(flowData.xmlData)
      await fitViewport()
      if (flowData.nodeData !== undefined && flowData.nodeData.length > 0 && props.procInsId) {
        await fillColor(flowData.nodeData)
      }
    } catch (err: any) {
      console.error(err.message, err.warnings)
    }
  }

  // 放大缩小
  const zoomViewport = (zoomIn = true) => {
    zoom = bpmnViewer.value.get('canvas').zoom()
    zoom += (zoomIn ? 0.1 : -0.1)
    if (zoom >= 0.2) bpmnViewer.value.get('canvas').zoom(zoom)
  }

  /** 传值监听 */
  watch(
    () => props.flowData,
    (newValue) => {
      if (Object.keys(newValue).length > 0) {
        if (bpmnViewer.value) {
          bpmnViewer.value.destroy()
        }
        bpmnViewer.value = new BpmnViewer({
          container: flowCanvas.value,
          height: 'calc(100vh - 200px)',
        })
        loadFlowCanvas(newValue)
      }
    }
  )
</script>

<style lang="scss">
  @use "../style/flow-viewer.scss";
</style>
