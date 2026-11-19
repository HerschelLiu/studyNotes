<template>
  <div
    v-loading="isView"
    class="flow-containers"
    :class="{ 'view-mode': isView }">
    <el-container style="height: 100%">
      <el-header style="border-bottom: 1px solid rgb(218 218 218);height: auto;padding-left:0">
        <div style="display: flex; padding: 10px 0; justify-content: space-between;">
          <el-button-group>
            <el-upload
              action=""
              :before-upload="openBpmn"
              style="margin-right: 10px; display:inline-block;">
              <el-tooltip
                effect="dark"
                content="加载xml"
                placement="bottom">
                <el-button
                  size="small"
                  icon="FolderOpened" />
              </el-tooltip>
            </el-upload>
            <el-tooltip
              effect="dark"
              content="新建"
              placement="bottom">
              <el-button
                size="small"
                icon="CirclePlus"
                @click="newDiagram" />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="自适应屏幕"
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
            <el-tooltip
              effect="dark"
              content="后退"
              placement="bottom">
              <el-button
                size="small"
                icon="Back"
                @click="modeler.get('commandStack').undo()" />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="前进"
              placement="bottom">
              <el-button
                size="small"
                icon="Right"
                @click="modeler.get('commandStack').redo()" />
            </el-tooltip>
          </el-button-group>
          <el-button-group>
            <el-button
              size="small"
              icon="View"
              @click="showXML">
              查看xml
            </el-button>
            <el-button
              size="small"
              icon="Download"
              @click="saveXML(true)">
              下载xml
            </el-button>
            <el-button
              size="small"
              icon="Picture"
              @click="saveImg('svg', true)">
              下载svg
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="save">
              保存模型
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="goBack">
              关闭
            </el-button>
          </el-button-group>
        </div>
      </el-header>
      <!-- 流程设计页面 -->
      <el-container style="align-items: stretch">
        <el-main>
          <div
            ref="canvas"
            class="canvas" />
        </el-main>

        <!--右侧属性栏-->
        <el-card
          shadow="never"
          class="normalPanel">
          <Designer v-if="loadCanvas" />
        </el-card>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed, onMounted, getCurrentInstance } from 'vue'
  import customTranslate from './customPanel/customTranslate'
  import Modeler from 'bpmn-js/lib/Modeler'
  import Designer from './designer.vue'
  import getInitStr from './flowable/init'
  import { StrUtil } from '@/utils/StrUtil'
  import FlowableModule from './flowable/flowable.json'
  import customControlsModule from './customPanel'

  defineOptions({ name: 'BpmnModel' })

  const props = defineProps({
    xml: {
      type: String,
      default: ''
    },
    isView: {
      type: Boolean,
      default: false
    },
  })

  const emit = defineEmits(['save', 'showXML'])

  const { proxy } = getCurrentInstance() as any

  const canvas = ref<HTMLElement | null>(null)
  const modeler = ref<any>(null)
  const zoom = ref(1)
  const loadCanvas = ref(false)
  const simulationStatus = ref(false)
  const bpmnlintStatus = ref(false)
  const simulation = ref(true)
  const designer = ref(true)

  const additionalModules = computed(() => {
    const Modules: any[] = []
    Modules.push(customControlsModule)
    Modules.push({
      translate: ['value', customTranslate]
    })
    return Modules
  })

  // 下载流程文件
  const downloadFile = (filename: string, data: any, type: string) => {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(new Blob([data], { type: type }))
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // 获取流程基础信息
  const getProcess = () => {
    const element = getProcessElement()
    return {
      id: element.id,
      name: element.name,
      category: element.processCategory
    }
  }

  // 获取流程主面板节点
  const getProcessElement = () => {
    const rootElements = proxy.modelerStore.modeler.getDefinitions().rootElements
    for (let i = 0; i < rootElements.length; i++) {
      if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
    }
  }

  // 让图能自适应屏幕
  const fitViewport = () => {
    zoom.value = proxy.modelerStore.canvas.zoom('fit-viewport')
    const bbox = (document.querySelector('.flow-containers .viewport') as SVGGraphicsElement).getBBox()
    const currentViewBox = proxy.modelerStore.canvas.viewbox()
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2
    }
    proxy.modelerStore.canvas.viewbox({
      x: elementMid.x - currentViewBox.width / 2,
      y: elementMid.y - currentViewBox.height / 2,
      width: currentViewBox.width,
      height: currentViewBox.height
    })
    zoom.value = bbox.width / currentViewBox.width * 1.8
    loadCanvas.value = true
  }

  // 根据提供的xml创建流程图
  const createNewDiagram = async (data: string) => {
    if (StrUtil.isNotBlank(proxy.modelerStore.modeler)) {
      data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (_match, str) {
        return str.replace(/</g, '&lt;')
      })
      try {
        await proxy.modelerStore.modeler.importXML(data)
        fitViewport()
      } catch (err: any) {
        console.error(err.message, err.warnings)
      }
    }
  }

  // 根据默认文件初始化流程图
  const newDiagram = () => {
    createNewDiagram(getInitStr())
  }

  // 放大缩小
  const zoomViewport = (zoomIn = true) => {
    zoom.value = proxy.modelerStore.canvas.zoom()
    zoom.value += (zoomIn ? 0.1 : -0.1)
    proxy.modelerStore.canvas.zoom(zoom.value)
  }

  // 保存xml
  const saveXML = async (download = false) => {
    try {
      const { xml } = await proxy.modelerStore.modeler.saveXML({ format: true })
      if (download) {
        downloadFile(`${getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
      }
      return xml
    } catch (err) {
      console.log(err)
    }
  }

  // 在线查看xml
  const showXML = async () => {
    try {
      const xmlStr = await saveXML()
      emit('showXML', xmlStr)
    } catch (err) {
      console.log(err)
    }
  }

  // 保存流程图为svg
  const saveImg = async (type = 'svg', download = false) => {
    try {
      const { svg } = await proxy.modelerStore.modeler.saveSVG({ format: true })
      if (download) {
        downloadFile(getProcessElement().name, svg, 'image/svg+xml')
      }
      return svg
    } catch (err) {
      console.log(err)
    }
  }

  // 保存流程图
  const save = async () => {
    const process = getProcess()
    const xml = await saveXML()
    const svg = await saveImg()
    const result = { process, xml, svg }
    emit('save', result)
    window.parent.postMessage(result, '*')
    goBack()
  }

  // 打开流程文件
  const openBpmn = (file: File) => {
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = () => {
      createNewDiagram(reader.result as string)
    }
    return false
  }

  /** 关闭当前标签页并返回上个页面 */
  const goBack = () => {
    const obj = { path: '/flowable/definition', query: { t: Date.now() } }
    proxy.$tab.closeOpenPage(obj)
  }

  /** 传值监听 */
  watch(
    () => props.xml,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        createNewDiagram(newVal)
      } else {
        newDiagram()
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    /** 创建bpmn 实例 */
    const modelerInstance = new Modeler({
      container: canvas.value,
      additionalModules: additionalModules.value,
      moddleExtensions: {
        flowable: FlowableModule
      },
      keyboard: { bindTo: document },
    })
    modeler.value = modelerInstance
    // 注册 modeler 相关信息
    proxy.modelerStore.modeler = modelerInstance
    proxy.modelerStore.modeling = modelerInstance.get('modeling')
    proxy.modelerStore.moddle = modelerInstance.get('moddle')
    proxy.modelerStore.canvas = modelerInstance.get('canvas')
    proxy.modelerStore.bpmnFactory = modelerInstance.get('bpmnFactory')
    proxy.modelerStore.elRegistry = modelerInstance.get('elementRegistry')
    // 直接点击新建按钮时,进行新增流程图
    if (StrUtil.isBlank(props.xml)) {
      newDiagram()
    } else {
      createNewDiagram(props.xml)
    }
  })
</script>

<style lang="scss">
  /*左边工具栏以及编辑节点的样式*/
  @use "bpmn-js/dist/assets/diagram-js.css";
  @use "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
  @use "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
  @use "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
  .view-mode {
    .el-header, .el-aside, .djs-palette, .bjs-powered-by {
      display: none;
    }
    .el-loading-mask {
      background-color: initial;
    }
    .el-loading-spinner {
      display: none;
    }
  }

  .flow-containers {
    width: 100%;
    height: 100%;
    .canvas {
      min-height: 850px;
      width: 100%;
      height: 100%;
      background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+")
    }
    .panel {
      position: absolute;
      right: 0;
      top: 50px;
      width: 300px;
    }
    .load {
      margin-right: 10px;
    }
    .normalPanel {
      width: 460px;
      height: 100%;
      padding: 20px 20px;
    }

    .el-main {
      position: relative;
      padding: 0;
    }

    .el-main .button-group {
      display: flex;
      flex-direction: column;
      position: absolute;
      width: auto;
      height: auto;
      top: 10px;
      right: 10px;
    }

    .button-group .el-button {
      width: 100%;
      margin: 0 0 5px;
    }
  }
</style>
