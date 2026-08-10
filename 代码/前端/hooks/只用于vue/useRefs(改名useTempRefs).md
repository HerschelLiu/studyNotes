## 普通写法
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
    /** search的Ref */
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

## vue3.5写法

```ts
import type { ComponentOptions, Ref } from 'vue'

import { useTemplateRef, ref } from 'vue'

type RefKeys = 'ELSearch' | 'ELHeader' | 'ELTable' | 'ELForm' | 'ELInput' | 'ELScrollbar' | 'ELElement' | 'ELList'

type TempRefsResult<T, K extends RefKeys> = {
  [P in K]: P extends 'ELList' ? Ref<T[]> : Readonly<Ref<T | undefined>>
}

/**
 * 常用 refs 的集合（按传入的 key 动态导出，不传不导出）
 * @param keys
 *   - 字符串：useTempRefs('ELForm') → { ELForm }，绑定同名 template ref
 *   - 数组：useTempRefs(['ELForm', 'ELTable']) → { ELForm, ELTable }，各自绑定同名 template ref
 *   - 对象：useTempRefs({ ELForm: 'myForm' }) → { ELForm }，绑定指定 template ref
 *   - 无参：返回空对象
 */
export function useTempRefs<T = ComponentOptions, K extends RefKeys = never>(
  keys: K | K[] | Partial<Record<K, string>> = {} as Partial<Record<K, string>>
): TempRefsResult<T, K> {
  /** 收集 name → templateKey 映射 */
  const keyMap: Record<string, string> = {}

  if (typeof keys === 'string') {
    keyMap[keys] = keys
  } else if (Array.isArray(keys)) {
    keys.forEach(k => {
      keyMap[k] = k
    })
  } else {
    Object.entries(keys).forEach(([k, v]) => {
      if (v) keyMap[k] = v as string
    })
  }

  const result = {} as TempRefsResult<T, K>

  Object.entries(keyMap).forEach(([name, refKey]) => {
    // ELList 是数组容器，使用 ref 而非 useTemplateRef
    if (name === 'ELList') {
      ;(result as any)[name] = ref<T[]>([])
    } else {
      ;(result as any)[name] = useTemplateRef<T>(refKey)
    }
  })

  return result
}

```

> 调用方式
>
> |                       调用方式                        |                含义                 |
> | :---------------------------------------------------: | :---------------------------------: |
> |                 useTempRefs('ELForm')                 |         { ELForm: Ref<T> }          |
> |          useTempRefs(['ELForm', 'ELTable'])           | { ELForm: Ref<T>, ELTable: Ref<T> } |
> | useTempRefs({ ELForm: 'myForm', ELTable: 'myTable' }) | { ELForm: Ref<T>, ELTable: Ref<T> } |
> |                     useTempRefs()                     |                 {}                  |
>
> 

## vue3.5兼容vueUse(ELList使用TemplateRefsList)

```ts
import type { ComponentOptions, Ref } from 'vue'
import type { TemplateRefsList } from '@vueuse/core'

import { useTemplateRef, ref } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'

type RefKeys = 'ELSearch' | 'ELHeader' | 'ELTable' | 'ELForm' | 'ELInput' | 'ELScrollbar' | 'ELElement' | 'ELList' | 'ELTempList'

type TempRefsResult<T, K extends RefKeys> = {
  [P in K]: P extends 'ELList'
    ? Ref<(T | null)[]>
    : P extends 'ELTempList'
    ? Readonly<Ref<Readonly<TemplateRefsList<T>>>>
    : Readonly<Ref<T | undefined>>
}

/**
 * 常用 refs 的集合（按传入的 key 动态导出，不传不导出）
 * @param keys
 *   - 字符串：useTempRefs('ELForm') → { ELForm }，绑定同名 template ref
 *   - 数组：useTempRefs(['ELForm', 'ELTable']) → { ELForm, ELTable }，各自绑定同名 template ref
 *   - 对象：useTempRefs({ ELForm: 'myForm' }) → { ELForm }，绑定指定 template ref
 *   - 无参：返回空对象
 */
// 重载：ELList 专用，只需传 T 即可获得类型安全的 ref 数组
export function useTempRefs<T = ComponentOptions>(keys: 'ELList'): TempRefsResult<T, 'ELList'>
// 重载：通用，K 从参数推断
export function useTempRefs<T = ComponentOptions, K extends RefKeys = never>(keys: K | K[] | Partial<Record<K, string>>): TempRefsResult<T, K>
export function useTempRefs<T = ComponentOptions, K extends RefKeys = never>(
  keys: K | K[] | Partial<Record<K, string>> = {} as Partial<Record<K, string>>
): TempRefsResult<T, K> {
  /** 收集 name → templateKey 映射 */
  const keyMap: Record<string, string> = {}

  if (typeof keys === 'string') {
    keyMap[keys] = keys
  } else if (Array.isArray(keys)) {
    keys.forEach(k => {
      keyMap[k] = k
    })
  } else {
    Object.entries(keys).forEach(([k, v]) => {
      if (v) keyMap[k] = v as string
    })
  }

  const result = {} as TempRefsResult<T, K>

  Object.entries(keyMap).forEach(([name, refKey]) => {
    // ELList 是数组容器，用于 :ref 回调收集元素，使用 ref 而非 useTemplateRef
    if (name === 'ELList') {
      ;(result as any)[name] = ref<(T | null)[]>([])
    } else if (name === 'ELTempList') {
      // ELTempList 使用 VueUse 的 useTemplateRefsList，通过 :ref="ELTempList.set" 收集
      ;(result as any)[name] = useTemplateRefsList<T>()
    } else {
      ;(result as any)[name] = useTemplateRef<T>(refKey)
    }
  })

  return result
}

```

> ```ts
> import TheList from ''
> const { ELList } = useTempRefs<InstanceType<typeof TheList>>('ELList')
> ```
>
> 
