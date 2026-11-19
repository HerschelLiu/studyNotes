---
title: "tabs（动态 Tab 页签）"
---

> 场景：同一页面里切换多个**不同子组件**（如「预算科目 / 版本」），每个子组件自身是一个列表页，需要统一处理：
>
> - 切换 Tab 时懒加载 / 刷新数据
> - Tab 内的子组件值写回父级表单（`modelKey`）
> - 父组件能统一调用子组件暴露的方法（`getList()`）

## 基本用法

```vue
<template>
  <el-tabs v-model="tabs.activeName" type="card">
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
        :model-value="tab.modelKey ? form[tab.modelKey] : undefined"
        @update:model-value="val => {
          if (tab.modelKey) (form as any)[tab.modelKey] = val
        }" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
  // 注意：<script setup> 里不能写 export，类型放在同目录 types.ts 或直接本地声明
  type TabKey = 'SUBJECT' | 'version'

  interface Tabs {
    activeName: TabKey
    items: {
      name: TabKey
      label: string
      component: Component
      modelKey?: keyof RequestAddProjLib
      attrs?: Record<string, any>
    }[]
  }

  const ELList = ref([])

  const tabs = reactive<Tabs>({
    activeName: 'SUBJECT',
    items: [
      {
        name: 'SUBJECT',
        label: '预算科目',
        component: markRaw(TheTableSubject),
        modelKey: 'subjectDtos',
        attrs: {},
      },
    ],
  })
</script>
```

## 配置说明

| 字段 | 说明 |
| --- | --- |
| `activeName` | 当前 Tab 的 `name` |
| `items[].name` | Tab 唯一标识（同时是 `TabKey` 联合类型成员） |
| `items[].label` | Tab 标题 |
| `items[].component` | 子组件，**必须 `markRaw`**，否则会被深度响应式代理，出现性能与警告问题 |
| `items[].modelKey` | 子组件值写回 `form` 的字段名；不传则子组件自己管理状态 |
| `items[].attrs` | 透传给子组件的额外属性 |
| `ELList` | 子组件实例数组，按 index 与 `items` 对应 |

## 调用子组件方法

子组件若要支持父级调用（如刷新列表），用 `defineExpose` 暴露**同名方法**，父级按当前 Tab 索引取实例：

```ts
/** 切换 Tab 后刷新当前子组件 */
const handleSelectTab = ({ index }: any) => {
  ELList.value[index]?.getList()
}

/** 首次进入时刷新当前 Tab 的子组件 */
onMounted(() => {
  nextTick(() => {
    ELList.value[tabs.items.findIndex(item => tabs.activeName === item.name)]?.getList()
  })
})
```

子组件侧：

```ts
defineExpose({ getList })
```

## 注意

1. `component` 必须 `markRaw`，否则 Vue 会把组件对象变成响应式代理（性能损耗 + 警告）。
2. `:ref` 用函数形式收集实例，`ELList` 与 `items` 的顺序必须一致；`v-for` 的 `key` 用 `index` 即可（Tab 顺序固定）。
3. 子组件方法名要统一（这里是 `getList`），否则父级无法批量调用。
4. `lazy: false` 表示首次渲染就挂载所有 Tab 内容；Tab 很多、内容很重时改成 `lazy`（默认 `true`）避免首屏卡顿。
5. `<script setup>` 内不能出现 `export`，示例里的类型请放到 `types.ts` 或去掉 `export`。
