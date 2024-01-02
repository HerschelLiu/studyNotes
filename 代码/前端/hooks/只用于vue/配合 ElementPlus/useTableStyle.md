```ts
import type { CSSProperties } from 'vue'

import { useUnit } from '@/hooks/useStyle'

/** 表头样式 */
export function useHeaderStyle({ ...data }): CSSProperties {
  if (data.rowIndex === 0) {
    return {
      fontSize: useUnit(16),
      fontWeight: 'bold',
      height: useUnit(50),
      borderTop: `1px solid var(--el-table-border-color)`,
      textAlign: 'left'
    }
  }
  return {}
}

/** 单元格样式名 */
export function useCellClass({ ...data }) {
  if (data.columnIndex === 0) return `cell-${data.columnIndex}`
  else return ''
}

/** 行样式 */
export function useRowStyle({ ...data }) {
  return {
    height: useUnit(data.height ?? 48),
    fontSize: useUnit(data.fontSize ?? '14px')
  }
}

```

> ```vue
> <el-table
>     :data="items"
>     size="default"
>     element-loading-text="正在加载..."
>     :row-style="useRowStyle"
>     :header-cell-style="useHeaderStyle"
>     :empty-text="'暂无数据'"
>     class="list-table"
>   >
>     <template #empty>
>       <el-empty />
>     </template>
>   </el-table>
> ```
>
> 没有自定义全选，则不加useRowStyle