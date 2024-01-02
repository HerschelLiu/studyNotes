```ts
import type { ComponentOptions } from 'vue'
import { ref } from 'vue'

/** 常用refs的集合 */
export function useRefs<T = ComponentOptions>() {
  const ELSearch = ref<T>()
  const ELHeader = ref<T>()
  const ELTable = ref<T>()
  const ELForm = ref<T>()
  const ELInput = ref<T>()
  const ELScrollbar = ref<T>()
  const ELList = ref<T[]>([])
  const ELElement = ref<T>()

  return {
    /** search的Ref */
    ELSearch,
    /** header的Ref */
    ELHeader,
    /** table的Ref */
    ELTable,
    /** form的Ref */
    ELForm,
    /** input的Ref */
    ELInput,
    /** scrollbar的Ref */
    ELScrollbar,
    /** list的Ref */
    ELList,
    /** 不记名的Ref */
    ELElement
  }
}

```

> ref数组
>
> ```html
> <el-tab-pane v-for="(tab, index) in tabs.items" :key="Number(index)" :name="tab.key">
>   <template #label>
>     {{ tab.value }}
>     <span class="tip">({{ state.promptList[index] }})</span>
>   </template>
>   <the-list
>     v-if="state.mounted"
>     :ref="(el: any) => ELList[Number(index)] = el"
>     :key="tab.key"
>     :query="query"
>     :show-status="tab.tabKey"
>     @refresh="getList"
>   />
> </el-tab-pane>
> ```
>
> 