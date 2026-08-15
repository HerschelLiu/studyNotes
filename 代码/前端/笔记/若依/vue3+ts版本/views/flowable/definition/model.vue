<template>
  <div>
    <bpmn-model
      v-if="dataExit"
      :xml="xml"
      :is-view="false"
      @save="save"
      @showXML="showXML" />
    <!--在线查看xml-->
    <el-drawer
      :title="xmlTitle"
      :modal="false"
      direction="rtl"
      v-model="xmlOpen"
      size="60%">
      <!-- 设置对话框内容高度 -->
      <el-scrollbar>
        <pre v-highlight="xmlData"><code class="xml"></code></pre>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { ref, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { readXml, roleList, saveXml, userList, expList } from '@/api/flowable/definition'
  import BpmnModel from '@/components/Process/index.vue'
  import vkBeautify from 'vkbeautify'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark.css'

  defineOptions({ name: 'Model' })

  const route = useRoute()
  const { proxy } = getCurrentInstance() as any

  const xml = ref('') // 后端查询到的xml
  const modeler = ref('')
  const dataExit = ref(false)
  const xmlOpen = ref(false)
  const xmlTitle = ref('')
  const xmlData = ref('')

  // 自定义指令 v-highlight
  const vHighlight = {
    mounted(el: HTMLElement, binding: any) {
      const targets = el.querySelectorAll('code')
      let target
      let i
      for (i = 0; i < targets.length; i += 1) {
        target = targets[i]
        if (typeof binding.value === 'string') {
          target.textContent = binding.value
        }
        hljs.highlightElement(target as HTMLElement)
      }
    },
    updated(el: HTMLElement, binding: any) {
      const targets = el.querySelectorAll('code')
      let target
      let i
      for (i = 0; i < targets.length; i += 1) {
        target = targets[i]
        if (typeof binding.value === 'string') {
          target.textContent = binding.value
          hljs.highlightElement(target as HTMLElement)
        }
      }
    },
  }

  /** xml 文件 */
  const getXmlData = (deployIdVal: string) => {
    readXml(deployIdVal).then((res: any) => {
      xml.value = res.data
      modeler.value = res.data
    })
  }
  /** 保存xml */
  const save = (data: any) => {
    const params = {
      name: data.process.name,
      category: data.process.category,
      xml: data.xml
    }
    saveXml(params).then((res: any) => {
      proxy.$modal.msgSuccess(res.msg)
      const obj = { path: '/flowable/definition', query: { t: Date.now() } }
      proxy.$tab.closeOpenPage(obj)
    })
  }
  /** 指定流程办理人员列表 */
  const getDataList = () => {
    userList().then((res: any) => {
      proxy.modelerStore.userList = res.data
    })
    roleList().then((res: any) => {
      proxy.modelerStore.roleList = res.data
    })
    expList().then((res: any) => {
      proxy.modelerStore.expList = res.data
      dataExit.value = true
    })
  }
  /** 展示xml */
  const showXML = (xmlDataVal: string) => {
    xmlTitle.value = 'xml查看'
    xmlOpen.value = true
    xmlData.value = vkBeautify.xml(xmlDataVal)
  }

  // created
  const deployIdVal = route.query && (route.query.deployId as any)
  if (deployIdVal) {
    getXmlData(deployIdVal)
  }
  getDataList()
</script>
<style lang="scss" scoped>
  .content-box{
    line-height: 10px;
  }
  // 修改对话框高度
  .showAll_dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    :deep(.el-dialog) {
      margin: 0 auto !important;
      height: 80%;
      overflow: hidden;
      background-color: #ffffff;
      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
        color: #ffffff;
        padding: 0 15px;
      }
    }
  }
</style>
