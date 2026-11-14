<template>
  <div class="panel-tab__content">
    <el-form
      label-width="70px"
      @submit.prevent
      size="small">
      <el-form-item label="参数说明">
        <el-button
          size="small"
          type="primary"
          @click="dialogVisible = true">
          查看
        </el-button>
      </el-form-item>
      <el-form-item label="回路特性">
        <el-select
          v-model="loopCharacteristics"
          @change="changeLoopCharacteristicsType">
          <el-option
            label="并行多重事件"
            value="ParallelMultiInstance" />
          <el-option
            label="时序多重事件"
            value="SequentialMultiInstance" />
          <el-option
            label="循环事件"
            value="StandardLoop" />
          <el-option
            label="无"
            value="Null" />
        </el-select>
      </el-form-item>
      <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
        <el-form-item
          label="循环基数"
          key="loopCardinality">
          <el-input
            v-model="loopInstanceForm.loopCardinality"
            clearable
            @change="updateLoopCardinality" />
        </el-form-item>
        <el-form-item
          label="集合"
          key="collection">
          <el-input
            v-model="loopInstanceForm.collection"
            clearable
            @change="updateLoopBase" />
        </el-form-item>
        <el-form-item
          label="元素变量"
          key="elementVariable">
          <el-input
            v-model="loopInstanceForm.elementVariable"
            clearable
            @change="updateLoopBase" />
        </el-form-item>
        <el-form-item
          label="完成条件"
          key="completionCondition">
          <el-input
            v-model="loopInstanceForm.completionCondition"
            clearable
            @change="updateLoopCondition" />
        </el-form-item>
        <el-form-item
          label="异步状态"
          key="async">
          <el-checkbox
            v-model="loopInstanceForm.asyncBefore"
            label="异步前"
            @change="updateLoopAsync('asyncBefore')" />
          <el-checkbox
            v-model="loopInstanceForm.asyncAfter"
            label="异步后"
            @change="updateLoopAsync('asyncAfter')" />
          <el-checkbox
            v-model="loopInstanceForm.exclusive"
            v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
            label="排除"
            @change="updateLoopAsync('exclusive')" />
        </el-form-item>
        <el-form-item
          label="重试周期"
          prop="timeCycle"
          v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
          key="timeCycle">
          <el-input
            v-model="loopInstanceForm.timeCycle"
            clearable
            @change="updateLoopTimeCycle" />
        </el-form-item>
      </template>
    </el-form>

    <!-- 参数说明 -->
    <el-dialog
      title="多实例参数"
      v-model="dialogVisible"
      width="680px"
      @closed="emit('close')">
      <el-descriptions
        :column="1"
        border>
        <el-descriptions-item label="使用说明">按照BPMN2.0规范的要求，用于为每个实例创建执行的父执行，会提供下列变量:</el-descriptions-item>
        <el-descriptions-item label="collection(集合变量)">传入List参数, 一般为用户ID集合</el-descriptions-item>
        <el-descriptions-item label="elementVariable(元素变量)">List中单个参数的名称</el-descriptions-item>
        <el-descriptions-item label="loopCardinality(基数)">List循环次数</el-descriptions-item>
        <el-descriptions-item label="isSequential(串并行)">Parallel: 并行多实例，Sequential: 串行多实例</el-descriptions-item>
        <el-descriptions-item label="completionCondition(完成条件)">任务出口条件</el-descriptions-item>
        <el-descriptions-item label="nrOfInstances(实例总数)">实例总数</el-descriptions-item>
        <el-descriptions-item label="nrOfActiveInstances(未完成数)">
          当前活动的（即未完成的），实例数量。对于顺序多实例，这个值总为1
        </el-descriptions-item>
        <el-descriptions-item label="nrOfCompletedInstances(已完成数)">已完成的实例数量</el-descriptions-item>
        <el-descriptions-item label="loopCounter">给定实例在for-each循环中的index</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, getCurrentInstance } from 'vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'MultiInstance' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const emit = defineEmits(['close'])

  const { proxy } = getCurrentInstance() as any

  const dialogVisible = ref(false)
  const loopCharacteristics = ref('')
  const loopInstanceForm = ref<any>({})
  const multiLoopInstance = ref<any>({})
  const defaultLoopInstanceForm = {
    completionCondition: '',
    loopCardinality: '',
    extensionElements: [] as any[],
    asyncAfter: false,
    asyncBefore: false,
    exclusive: false
  }

  const getElementLoop = (businessObject: any) => {
    if (!businessObject.loopCharacteristics) {
      loopCharacteristics.value = 'Null'
      loopInstanceForm.value = {}
      return
    }
    if (businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
      loopCharacteristics.value = 'StandardLoop'
      loopInstanceForm.value = {}
      return
    }
    if (businessObject.loopCharacteristics.isSequential) {
      loopCharacteristics.value = 'SequentialMultiInstance'
    } else {
      loopCharacteristics.value = 'ParallelMultiInstance'
    }
    loopInstanceForm.value = {
      ...defaultLoopInstanceForm,
      ...businessObject.loopCharacteristics,
      completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? '',
      loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ''
    }
    multiLoopInstance.value = proxy.modelerStore.element.businessObject.loopCharacteristics
    if (
      businessObject.loopCharacteristics.extensionElements &&
      businessObject.loopCharacteristics.extensionElements.values &&
      businessObject.loopCharacteristics.extensionElements.values.length
    ) {
      loopInstanceForm.value.timeCycle = businessObject.loopCharacteristics.extensionElements.values[0].body
    }
  }

  const changeLoopCharacteristicsType = (type: string) => {
    loopInstanceForm.value = { ...defaultLoopInstanceForm }
    if (type === 'Null') {
      proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, { loopCharacteristics: null })
      return
    }
    if (type === 'StandardLoop') {
      const loopCharacteristicsObject = proxy.modelerStore.moddle.create('bpmn:StandardLoopCharacteristics')
      proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
        loopCharacteristics: loopCharacteristicsObject
      })
      multiLoopInstance.value = null
      return
    }
    if (type === 'SequentialMultiInstance') {
      multiLoopInstance.value = proxy.modelerStore.moddle.create('bpmn:MultiInstanceLoopCharacteristics', {
        isSequential: true
      })
    } else {
      multiLoopInstance.value = proxy.modelerStore.moddle.create('bpmn:MultiInstanceLoopCharacteristics')
    }
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
      loopCharacteristics: multiLoopInstance.value
    })
  }

  // 循环基数
  const updateLoopCardinality = (cardinality: string) => {
    let loopCardinality = null
    if (cardinality && cardinality.length) {
      loopCardinality = proxy.modelerStore.moddle.create('bpmn:FormalExpression', { body: cardinality })
    }
    proxy.modelerStore.modeling.updateModdleProperties(proxy.modelerStore.element, multiLoopInstance.value, {
      loopCardinality
    })
  }

  // 完成条件
  const updateLoopCondition = (condition: string) => {
    let completionCondition = null
    if (condition && condition.length) {
      completionCondition = proxy.modelerStore.moddle.create('bpmn:FormalExpression', { body: condition })
    }
    proxy.modelerStore.modeling.updateModdleProperties(proxy.modelerStore.element, multiLoopInstance.value, {
      completionCondition
    })
  }

  // 重试周期
  const updateLoopTimeCycle = (timeCycle: string) => {
    const extensionElements = proxy.modelerStore.moddle.create('bpmn:ExtensionElements', {
      values: [
        proxy.modelerStore.moddle.create(`flowable:FailedJobRetryTimeCycle`, {
          body: timeCycle
        })
      ]
    })
    proxy.modelerStore.modeling.updateModdleProperties(proxy.modelerStore.element, multiLoopInstance.value, {
      extensionElements
    })
  }

  // 直接更新的基础信息
  const updateLoopBase = () => {
    proxy.modelerStore.modeling.updateModdleProperties(proxy.modelerStore.element, multiLoopInstance.value, {
      collection: loopInstanceForm.value.collection || null,
      elementVariable: loopInstanceForm.value.elementVariable || null
    })
  }

  // 各异步状态
  const updateLoopAsync = (key: string) => {
    const { asyncBefore, asyncAfter } = loopInstanceForm.value
    let asyncAttr = Object.create(null)
    if (!asyncBefore && !asyncAfter) {
      loopInstanceForm.value.exclusive = false
      asyncAttr = { asyncBefore: false, asyncAfter: false, exclusive: false, extensionElements: null }
    } else {
      asyncAttr[key] = loopInstanceForm.value[key]
    }
    proxy.modelerStore.modeling.updateModdleProperties(proxy.modelerStore.element, multiLoopInstance.value, asyncAttr)
  }

  /** 传值监听 */
  watch(
    () => props.id,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        getElementLoop(proxy.modelerStore.element.businessObject)
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use '../style/process-panel';
</style>
