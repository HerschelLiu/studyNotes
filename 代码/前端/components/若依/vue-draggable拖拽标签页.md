`src/layout/components/TagsView/index.vue`

```vue
<!-- 标签滚动区 -->
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll" @update-arrows="updateArrowState">
      <draggable
        class="tags-view-draggable"
        :model-value="visitedViews"
        item-key="path"
        :animation="200"
        :move="onDragMove"
        @update:model-value="onReorder"
      >
        <template #item="{ element: tag }">
          <router-link
            :data-path="tag.path"
            :class="{ 'active': isActive(tag), 'has-icon': tagsIcon }"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            class="tags-view-item"
            :style="tagActiveStyle(tag)"
            @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
            @contextmenu.prevent="openMenu(tag, $event)"
          >
            <svg-icon v-if="tagsIcon && tag.meta && tag.meta.icon && tag.meta.icon !== '#'" :icon-class="tag.meta.icon" style="margin-right: 3px;" />
            {{ tag.title }}
            <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" class="tags-close-btn">
              <close class="el-icon-close" />
            </span>
          </router-link>
        </template>
      </draggable>
    </scroll-pane>

import draggable from 'vuedraggable/dist/vuedraggable.common'

const visitedViews = computed(() => useTagsViewStore().visitedViews)
/** 拖拽约束：禁止拖动固定页签，也禁止把其他页签拖入固定区 */
function onDragMove(evt: any): boolean {
  return evt.draggedContext.index >= affixCount.value
      && evt.relatedContext.index >= affixCount.value
}

/** 拖拽完成：走 store action 整体替换顺序并持久化，保持单一数据源 */
function onReorder(views: any[]): void {
  useTagsViewStore().reorderVisitedViews(views)
}
```



`src/store/modules/tagsView.ts`

```ts
const useTagsViewStore = defineStore(
  'tags-view',{
    actions: {
      // 拖拽排序：整体替换页签顺序并持久化（固定页签由调用方保证仍在前端）
      reorderVisitedViews(views: View[]) {
        this.visitedViews = views
        saveVisitedViews(this.visitedViews)
      },
    }
  })
```

