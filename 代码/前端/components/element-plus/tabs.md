不相同子组件

```vue
<template>
	<el-tabs
    v-model="tabs.activeName"
    type="card">
    <el-tab-pane
      v-for="(tab, index) in tabs.items"
      :key="Number(index)"
      :label="`${tab.label}`"
      :name="tab.name"
      :lazy="false">
      <Component
        :is="tab.component"
        :ref="el => (ELList[Number(index)] = el)"
        v-bind="tab.attrs"
        :modelValue="tab.modelKey ? form[tab.modelKey] : undefined"
        @update:modelValue="
          (val) => {
            if (tab.modelKey) {
              ;(form as any)[tab.modelKey] = val
            }
          }
        " />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
  const ELList = ref([])
  
  export type TabKey = 'SUBJECT' | 'version'
  export interface Tabs {
    activeName: TabKey
    items: {
      name: TabKey
      label: string
      component: Component
      modelKey?: keyof RequestAddProjLib
      attrs?: Record<string, any>
    }[]
  }
  const tabs: Tabs = reactive({
    activeName: 'SUBJECT',
    items: [
      {
        name: 'SUBJECT',
        label: `预算科目`,
        component: markRaw(TheTableSubject),
        modelKey: 'subjectDtos',
        attrs: {}
      }
    ],
  })
    
</script>
```

若有调取接口需求，所以子组件使用`defineExpose`暴露出同一个名字

```ts
 /** 选中tab */
  const handleSelectTab = ({ index }: any) => {
    ELList.value[index]?.getList()
  }

  onMounted(() => {
    nextTick(() => {
      ELList.value[tabs.items.findIndex(item => tabs.activeName === item.name)]?.getList()
    })
  })
```

