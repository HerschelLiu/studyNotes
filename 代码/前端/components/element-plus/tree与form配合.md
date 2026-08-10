```vue
<template>
  <comp-drawer
    v-model="show"
    :title="title"
    @save="handleSave">
    <div class="app-container">
      <!-- 原始表单 -->
      <el-form
        ref="dictRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item
          label="字典名称"
          prop="dictLabel">
          <el-input
            v-model.trim="form.dictLabel"
            placeholder="请输入字典名称"
            style="width: 240px" />
        </el-form-item>

        <el-form-item prop="dictType">
          <el-input
            v-model.trim="form.dictType"
            placeholder="请输入字典类型"
            style="width: 240px" />
          <template #label>
            <span>
              <el-tooltip
                content="数据存储中的Key值，如：sys_user_sex"
                placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              字典类型
            </span>
          </template>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">树形字典数据</el-divider>

      <!-- 树形字典 -->
      <el-form
        ref="formRef"
        :model="formModel"
        label-width="80px">
        <el-tree
          ref="treeRef"
          :data="treeData"
          node-key="nodeKey"
          default-expand-all
          :expand-on-click-node="false"
          class="dict-tree">
          <template #default="{ data }">
            <div class="tree-node">
              <el-form-item
                label="名称"
                :prop="`${data.nodeKey}.dictLabel`"
                :rules="rules.dictLabel">
                <el-input
                  v-model.trim="data.dictLabel"
                  placeholder="请输入名称"
                  style="width: 180px" />
              </el-form-item>

              <el-form-item
                label="编码"
                :prop="`${data.nodeKey}.dictCode`"
                :rules="rules.dictCode">
                <el-input
                  v-model.trim="data.dictCode"
                  placeholder="请输入编码"
                  style="width: 180px" />
              </el-form-item>

              <div class="tree-node__actions">
                <el-button
                  link
                  type="primary"
                  icon="Plus"
                  @click="handleAddSibling(data)">
                  同级
                </el-button>
                <el-button
                  link
                  type="primary"
                  icon="Plus"
                  @click="handleAddChild(data)">
                  子级
                </el-button>
                <el-button
                  v-if="!isRootNode(data) || treeData.length > 1"
                  link
                  type="danger"
                  icon="Delete"
                  @click="handleRemove(data)">
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </el-form>
    </div>
  </comp-drawer>
</template>

<script lang="ts" setup>
  import type { ResponseList } from '../index.vue'

  import { useRules } from '@/hooks/useRules.js'
  import { readDictTree, updateDictTree } from '@/api/system/dict-tree'
  import { useError } from '@/hooks/useTip.js'

  import CompDrawer from '@/components/Drawer/index.vue'

  const props = defineProps<{
    data: ResponseList
  }>()

  const emits = defineEmits(['change'])

  const show = defineModel<boolean>()

  const title = computed(() => {
    return props.data?.id ? '修改字典类型' : '新增字典类型'
  })

  const assetsForm = {
    dictLabel: undefined,
    dictType: undefined,
    status: '0',
    children: []
  }
  const form = reactive(assetsForm)

  const { sys_normal_disable } = useDict('sys_normal_disable')

  const rules = useRules([{ key: 'dictLabel', label: '名称' }, { key: 'dictType', label: '字典类型' }, { key: 'dictCode', label: '编码' }], {
    dictType: {
      pattern: /^[a-z][0-9a-z_]*$/,
      message: "字典类型必须以字母开头，且只能为（小写字母，数字，下划线）",
      trigger: "blur",
    }
  })

  // ===== 树形字典 =====
  interface TreeNode {
    nodeKey: string
    dictLabel: string
    dictType: string
    status: '0' | '1'
    children: TreeNode[]
  }

  const treeRef = ref()
  const dictRef = ref()
  const formRef = ref()
  const treeData = ref<TreeNode[]>([])
  const formModel = reactive<Record<string, TreeNode>>({})
  let nodeCounter = 0

  /** 创建节点并注册到表单模型 */
  const createNode = (): TreeNode => {
    const nodeKey = `node_${++nodeCounter}`
    const node = reactive<TreeNode>({
      nodeKey,
      dictLabel: '',
      dictType: '',
      status: '0',
      children: [],
    })
    formModel[nodeKey] = node
    return node
  }

  /** 递归查找节点所在的兄弟数组和索引 */
  const findParent = (
    nodes: TreeNode[],
    nodeKey: string
  ): { siblings: TreeNode[] | null; index: number } => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeKey === nodeKey) {
        return { siblings: nodes, index: i }
      }
      if (nodes[i].children?.length) {
        const result = findParent(nodes[i].children, nodeKey)
        if (result.siblings) return result
      }
    }
    return { siblings: null, index: -1 }
  }

  /** 从表单模型中移除节点及其所有子节点 */
  const removeFromFormModel = (node: TreeNode) => {
    delete formModel[node.nodeKey]
    node.children?.forEach(removeFromFormModel)
  }

  /** 判断是否为根节点 */
  const isRootNode = (data: TreeNode) => {
    return treeData.value.some((n: TreeNode) => n.nodeKey === data.nodeKey)
  }

  const handleAddSibling = (data: TreeNode) => {
    const { siblings, index } = findParent(treeData.value, data.nodeKey)
    if (siblings) {
      siblings.splice(index + 1, 0, createNode())
    }
  }

  const handleAddChild = (data: TreeNode) => {
    data.children.push(createNode())
    nextTick(() => {
      const node = treeRef.value?.getNode(data)
      if (node) {
        node.expanded = true
      }
    })
  }

  const handleRemove = (data: TreeNode) => {
    const { siblings, index } = findParent(treeData.value, data.nodeKey)
    if (siblings && index > -1) {
      siblings.splice(index, 1)
      removeFromFormModel(data)
    }
  }

  const handleSave = async () => {
    if (treeData.value.length === 0) {
      useError('请至少添加一个节点')
      return
    }
    if (!dictRef.value || !formRef.value) return
    try {
      await Promise.all([
        dictRef.value.validate(),
        formRef.value.validate()
      ])
      await updateDictTree({
        ...form,
        children: treeData.value
      })
      emits('change')
      show.value = false
    } catch {
      useError('请完善所有必填项')
    }
  }

  watch(() => props.data, (newVal) => {
    if (newVal?.id) {
      readDetails()
    } else {
      Object.assign(form, assetsForm)
    }
  })

  watch(show, (val: boolean | undefined, oldVal: boolean | undefined) => {
    if (val && !oldVal) {
      treeData.value = []
      Object.keys(formModel).forEach(key => delete formModel[key])
      const node = createNode()
      if (props.data?.id) {
        node.dictLabel = props.data.dictLabel || ''
        node.dictType = props.data.dictType || ''
        node.status = props.data.status || '0'
      }
      treeData.value.push(node)
    }
  })

  const readDetails = async () => {
    const { data } = await readDictTree(props.data.id)
    Object.assign(form, data)
    treeData.value = data?.children || []
  }
</script>

<style lang="scss" scoped>
  .dict-tree {
    :deep(.el-tree-node__content) {
      height: auto;
      margin-bottom: 18px;
    }

    .tree-node {
      display: flex;
      align-items: center;
      flex: 1;
      flex-wrap: wrap;
      gap: 12px;

      :deep(.el-form-item) {
        margin-bottom: 0;
      }

      &__actions {
        flex-shrink: 0;
        white-space: nowrap;
      }
    }
  }
</style>

```

