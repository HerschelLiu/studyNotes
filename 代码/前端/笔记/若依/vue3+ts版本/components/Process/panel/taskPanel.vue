<template>
  <div>
    <el-form
      label-width="80px"
      size="small">
      <el-form-item label="异步">
        <el-switch
          v-model="bpmnFormData.async"
          active-text="是"
          inactive-text="否"
          @change="updateElementTask('async')" />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select
          v-model="bpmnFormData.userType"
          placeholder="选择人员"
          @change="updateUserType">
          <el-option
            v-for="item in userTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item
        label="指定人员"
        v-if="bpmnFormData.userType === 'assignee'">
        <el-input-tag
          v-model="bpmnFormData.assignee"
          :value="bpmnFormData.assignee" />
        <el-button-group
          class="ml-4"
          style="margin-top: 4px">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="指定人员"
            placement="bottom">
            <el-button
              size="small"
              type="primary"
              icon="User"
              @click="singleUserCheck" />
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="选择表达式"
            placement="bottom">
            <el-button
              size="small"
              type="warning"
              icon="Postcard"
              @click="singleExpCheck" />
          </el-tooltip>
        </el-button-group>
      </el-form-item>

      <el-form-item
        label="候选人员"
        v-else-if="bpmnFormData.userType === 'candidateUsers'">
        <el-input-tag
          v-model="bpmnFormData.candidateUsers"
          :value="bpmnFormData.candidateUsers" />
        <el-button-group
          class="ml-4"
          style="margin-top: 4px">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="候选人员"
            placement="bottom">
            <el-button
              size="small"
              type="primary"
              icon="User"
              @click="multipleUserCheck" />
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="选择表达式"
            placement="bottom">
            <el-button
              size="small"
              type="warning"
              icon="Postcard"
              @click="singleExpCheck" />
          </el-tooltip>
        </el-button-group>
      </el-form-item>

      <el-form-item
        label="候选角色"
        v-else>
        <el-input-tag
          v-model="bpmnFormData.candidateGroups"
          :value="bpmnFormData.candidateGroups" />
        <el-button-group
          class="ml-4"
          style="margin-top: 4px">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="候选角色"
            placement="bottom">
            <el-button
              size="small"
              type="primary"
              icon="User"
              @click="multipleRoleCheck" />
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="选择表达式"
            placement="bottom">
            <el-button
              size="small"
              type="warning"
              icon="Postcard"
              @click="singleExpCheck" />
          </el-tooltip>
        </el-button-group>
      </el-form-item>

      <el-form-item label="优先级">
        <el-input
          v-model="bpmnFormData.priority"
          @change="updateElementTask('priority')" />
      </el-form-item>
      <el-form-item label="到期时间">
        <el-input
          v-model="bpmnFormData.dueDate"
          @change="updateElementTask('dueDate')" />
      </el-form-item>
    </el-form>

    <!--选择人员-->
    <el-dialog
      title="选择人员"
      v-model="userVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false">
      <FlowUser
        v-if="userVisible"
        :checkType="checkType"
        :selectValues="selectData.assignee || selectData.candidateUsers"
        @handleUserSelect="userSelect" />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="userVisible = false">
            取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="checkUserComplete">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--选择角色-->
    <el-dialog
      title="选择候选角色"
      v-model="roleVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false">
      <FlowRole
        v-if="roleVisible"
        :selectValues="selectData.candidateGroups"
        @handleRoleSelect="roleSelect" />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="roleVisible = false">
            取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="checkRoleComplete">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--选择表达式-->
    <el-dialog
      title="选择表达式"
      v-model="expVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false">
      <FlowExp
        v-if="expVisible"
        :selectValues="selectData.exp"
        @handleSingleExpSelect="expSelect" />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="expVisible = false">
            取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="checkExpComplete">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, getCurrentInstance } from 'vue'
  import FlowUser from '@/components/flow/User/index.vue'
  import FlowRole from '@/components/flow/Role/index.vue'
  import FlowExp from '@/components/flow/Expression/index.vue'
  import ElInputTag from '@/components/flow/ElInputTag/index.vue'
  import { StrUtil } from '@/utils/StrUtil'

  defineOptions({ name: 'TaskPanel' })

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
  })

  const { proxy } = getCurrentInstance() as any

  const userVisible = ref(false)
  const roleVisible = ref(false)
  const expVisible = ref(false)
  const isIndeterminate = ref(true)
  const checkType = ref('single')
  const userType = ref('')
  const userTypeOption = ref([
    { label: '指定人员', value: 'assignee' },
    { label: '候选人员', value: 'candidateUsers' },
    { label: '候选角色', value: 'candidateGroups' }
  ])
  const checkAll = ref(false)
  const bpmnFormData = reactive<any>({
    userType: '',
    assignee: '',
    candidateUsers: '',
    candidateGroups: '',
    dueDate: '',
    priority: '',
    dataType: '',
    expId: '',
  })
  const selectData = reactive<any>({
    assignee: null,
    candidateUsers: null,
    candidateGroups: null,
    exp: null,
  })
  const otherExtensionList = ref<any[]>([])

  const updateCustomElement = (key: string, value: any) => {
    const taskAttr = Object.create(null)
    taskAttr[key] = value
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, taskAttr)
  }

  const updateElementTask = (key: string) => {
    const taskAttr = Object.create(null)
    taskAttr[key] = bpmnFormData[key] || ''
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, taskAttr)
  }

  const deleteFlowAttar = () => {
    delete proxy.modelerStore.element.businessObject['dataType']
    delete proxy.modelerStore.element.businessObject['expId']
    delete proxy.modelerStore.element.businessObject['assignee']
    delete proxy.modelerStore.element.businessObject['candidateUsers']
    delete proxy.modelerStore.element.businessObject['candidateGroups']
  }

  const handleSelectData = (key: string, value: any) => {
    for (const oldKey in selectData) {
      if (key !== oldKey) {
        selectData[oldKey] = null
      } else {
        selectData[oldKey] = value
      }
    }
  }

  const getExpList = (val: any, key: string) => {
    if (StrUtil.isNotBlank(val)) {
      bpmnFormData[key] = proxy.modelerStore.expList?.find((item: any) => item.id.toString() === val).name
      selectData.exp = proxy.modelerStore.expList?.find((item: any) => item.id.toString() === val).id
    }
  }

  const getUserList = (val: any, key: string) => {
    if (StrUtil.isNotBlank(val)) {
      const newArr = proxy.modelerStore.userList?.filter((i: any) => val.toString().split(',').includes(i.userId.toString()))
      bpmnFormData[key] = newArr.map((item: any) => item.nickName).join(',')
      if ('assignee' === key) {
        selectData[key] = newArr.find((item: any) => item.userId.toString() === val.toString()).userId
      } else {
        selectData[key] = newArr.map((item: any) => item.userId)
      }
    }
  }

  const getRoleList = (val: any, key: string) => {
    if (StrUtil.isNotBlank(val)) {
      const newArr = proxy.modelerStore.roleList?.filter((i: any) => val.split(',').includes(i.roleId.toString()))
      bpmnFormData[key] = newArr.map((item: any) => item.roleName).join(',')
      if ('assignee' === key) {
        selectData[key] = newArr.find((item: any) => item.roleId.toString() === val.toString()).roleId
      } else {
        selectData[key] = newArr.map((item: any) => item.roleId)
      }
    }
  }

  const checkValuesEcho = (formData: any) => {
    if (StrUtil.isNotBlank(formData.expId)) {
      getExpList(formData.expId, formData.userType)
    } else {
      if ('candidateGroups' === formData.userType) {
        getRoleList(formData[formData.userType], formData.userType)
      } else {
        getUserList(formData[formData.userType], formData.userType)
      }
    }
  }

  const updateUserType = (val: string) => {
    deleteFlowAttar()
    delete proxy.modelerStore.element.businessObject['userType']
    bpmnFormData[val] = null
    Object.assign(selectData, {
      assignee: null,
      candidateUsers: null,
      candidateGroups: null,
      exp: null,
    })
    updateCustomElement('userType', val)
  }

  // 初始化表单
  const resetTaskForm = () => {
    Object.assign(bpmnFormData, {
      userType: '',
      assignee: '',
      candidateUsers: '',
      candidateGroups: '',
      dueDate: '',
      priority: '',
      dataType: '',
      expId: '',
    })
    Object.assign(selectData, {
      assignee: null,
      candidateUsers: null,
      candidateGroups: null,
      exp: null,
    })
    for (const key in bpmnFormData) {
      const value = proxy.modelerStore.element?.businessObject[key] || bpmnFormData[key]
      bpmnFormData[key] = value
    }
    checkValuesEcho(bpmnFormData)
  }

  /*单选人员*/
  const singleUserCheck = () => {
    userVisible.value = true
    checkType.value = 'single'
  }

  /*多选人员*/
  const multipleUserCheck = () => {
    userVisible.value = true
    checkType.value = 'multiple'
  }

  /*单选角色*/
  const singleRoleCheck = () => {
    roleVisible.value = true
    checkType.value = 'single'
  }

  /*多选角色*/
  const multipleRoleCheck = () => {
    roleVisible.value = true
  }

  /*单选表达式*/
  const singleExpCheck = () => {
    expVisible.value = true
  }

  // 表达式选中数据
  const expSelect = (selection: any) => {
    if (selection) {
      deleteFlowAttar()
      bpmnFormData[bpmnFormData.userType] = selection.name
      updateCustomElement('dataType', selection.dataType)
      updateCustomElement('expId', selection.id.toString())
      updateCustomElement(bpmnFormData.userType, selection.expression)
      handleSelectData('exp', selection.id)
    }
  }

  // 用户选中数据
  const userSelect = (selection: any) => {
    if (selection) {
      deleteFlowAttar()
      updateCustomElement('dataType', 'fixed')
      if (selection instanceof Array) {
        const userIds = selection.map((item: any) => item.userId)
        const nickName = selection.map((item: any) => item.nickName)
        bpmnFormData[bpmnFormData.userType] = nickName.join(',')
        updateCustomElement(bpmnFormData.userType, userIds.join(','))
        handleSelectData(bpmnFormData.userType, userIds)
      } else {
        bpmnFormData[bpmnFormData.userType] = selection.nickName
        updateCustomElement(bpmnFormData.userType, selection.userId)
        handleSelectData(bpmnFormData.userType, selection.userId)
      }
    }
  }

  // 角色选中数据
  const roleSelect = (selection: any, name: any) => {
    if (selection && name) {
      deleteFlowAttar()
      bpmnFormData[bpmnFormData.userType] = name
      updateCustomElement('dataType', 'fixed')
      updateCustomElement(bpmnFormData.userType, selection)
      handleSelectData(bpmnFormData.userType, selection)
    }
  }

  /*用户选中赋值*/
  const checkUserComplete = () => {
    userVisible.value = false
    checkType.value = ''
  }

  /*候选角色选中赋值*/
  const checkRoleComplete = () => {
    roleVisible.value = false
  }

  /*表达式选中赋值*/
  const checkExpComplete = () => {
    expVisible.value = false
  }

  // 去重数据
  const unique = (arr: any[], code: string) => {
    const res = new Map()
    return arr.filter((item) => !res.has(item[code]) && res.set(item[code], 1))
  }

  // 更新扩展属性信息
  const updateElementExtensions = (properties: any) => {
    const extensions = proxy.modelerStore.moddle.create('bpmn:ExtensionElements', {
      values: otherExtensionList.value.concat([properties])
    })
    proxy.modelerStore.modeling.updateProperties(proxy.modelerStore.element, {
      extensionElements: extensions
    })
  }

  /** 传值监听 */
  watch(
    () => props.id,
    (newVal) => {
      if (StrUtil.isNotBlank(newVal)) {
        resetTaskForm()
      }
    },
    { immediate: true }
  )
</script>
