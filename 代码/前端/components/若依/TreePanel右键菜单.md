`useTreeContextMenu`

```ts
/** 右键菜单项配置（内部常量，用于类型推导） */
const _contextMenuItems = [
  { key: 'add', label: '新增', icon: 'Plus', type: 'primary' },
  { key: 'edit', label: '编辑', icon: 'Edit' },
  { divided: true },
  { key: 'delete', label: '删除', icon: 'Delete', type: 'danger' }
] as const

/** 右键菜单项配置（可变数组，供模板渲染使用） */
export const contextMenuItems: (typeof _contextMenuItems)[number][] = [..._contextMenuItems]

/** 右键菜单项类型 */
type ContextMenuItem = (typeof _contextMenuItems)[number]
/** 排除分割线 */
type KeyedContextMenuItem = Extract<ContextMenuItem, { key: string }>
/** key类型 */
export type ContextMenuKey = KeyedContextMenuItem['key']
/** 处理器 */
export type ContextMenuHandlers<T = any> = Partial<Record<ContextMenuKey, (data: T) => void>>
/** TreePanel context-menu-click 事件 payload */
interface ContextMenuPayload<T = any> {
  key: ContextMenuKey
  label: string
  data: T
}

/**
 * 树右键菜单 hook
 * @param handlers 各页面实现的菜单项处理函数集合
 * @returns 可直接绑定到 TreePanel 的 @context-menu-click 的事件处理函数
 */
export function useTreeContextMenu<T = any>(handlers: ContextMenuHandlers<T>) {
  return ({ key, data }: ContextMenuPayload<T>) => {
    handlers[key]?.(data)
  }
}

```

> ```vue
> <template>
> <div class="app-container tree-sidebar-manage-wrap">
>     <tree-panel
>       title="职位类别"
>       :tree-data="dataSource"
>       search-placeholder="请搜索"
>       storage-key="positionCategory-sidebar-width"
>       :defaultExpandAll="true"
>       :showContextMenu="true"
>       :context-menu-items="contextMenuItems"
>       @node-click="handleNodeClick"
>       @context-menu-click="handleContextMenuClick"
>       @refresh="getTree"
>       ref="categoryTreeRef" />
>   </div>
> 
>   <div class="tree-sidebar-content"></div>
> </template>
> <script lang="ts" setup>
> const handleContextMenuClick = useTreeContextMenu<any>({
>   add: (data) => { /* 新增逻辑 */ },
>   edit: (data) => { /* 编辑逻辑 */ },
>   delete: (data) => { /* 删除逻辑 */ }
> })
> </script>
> ```
>
> 