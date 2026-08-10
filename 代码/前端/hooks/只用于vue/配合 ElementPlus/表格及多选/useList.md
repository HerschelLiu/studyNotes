搭配elementPlus

```ts
import { useZIndex } from 'element-plus'
import type { ComponentOptions, PropType, Ref } from 'vue'
import { computed, reactive } from 'vue'

import { useStorage } from '@/hooks/useStorage'
import { isArray } from '@/hooks/useValidate'
import settings from '@/settings'

import useElementVisible from './useElementVisible'
import { sleep } from './useUtils'
import useWatchElement from './useWatchElement'

type Refs =
  | {
      ELSearch?: Ref<ComponentOptions | undefined>
      ELTable?: Ref<ComponentOptions | undefined>
      ELHeader?: Ref<ComponentOptions | undefined>
    }
  | undefined

let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null

/** 定义列表数据 */
export function useList<Q = null, R = object>(otherQuery: Partial<Q>, refs: Refs = undefined, enablePage = true) {
  useWatchElement(
    'enter',
    () => refs?.ELTable?.value?.$el?.querySelector?.('.el-table__header-wrapper'),
    async (tableHeader: HTMLDivElement) => {
      intersectionObserver?.disconnect()
      resizeObserver?.disconnect()

      await sleep(0)
      const pageHeader = refs?.ELSearch?.value?.$el as HTMLDivElement
      if (!pageHeader || !tableHeader) return

      resizeObserver = new ResizeObserver(() => {
        const tableInnerWrapper = tableHeader.parentElement
        /** 不可见说明离开了当前页面 */
        if (!useElementVisible(tableHeader)) {
          return false
        }
        const rect = tableHeader.getBoundingClientRect()
        const position = tableHeader?.style.getPropertyValue('position')
        tableHeader.setAttribute(
          'style',
          `
          top: ${pageHeader.clientHeight}px;
          width: ${tableInnerWrapper?.clientWidth}px;
          left: ${rect.left}px;
          z-index: ${useZIndex().nextZIndex()};
          position: ${position};
          `.replace(/\s+/g, ' ')
        )
      })
      resizeObserver.observe(document.querySelector('.app-main')!)

      intersectionObserver = new IntersectionObserver(([entry]) => {
        const tableInnerWrapper = tableHeader.parentElement
        /** 不可见说明离开了当前页面 */
        if (!useElementVisible(tableHeader)) {
          return false
        }
        const rect = tableHeader.getBoundingClientRect()
        tableHeader.setAttribute(
          'style',
          `
          top: ${pageHeader.clientHeight}px;
          width: ${tableInnerWrapper?.clientWidth}px;
          left: ${rect.left}px;
          z-index: ${useZIndex().nextZIndex()};
          `.replace(/\s+/g, ' ')
        )

        if (!entry.isIntersecting) {
          tableInnerWrapper?.style.setProperty('padding-top', `${tableHeader.clientHeight}px`)
          tableHeader?.style.setProperty('position', `fixed`)
        } else {
          tableInnerWrapper?.style.setProperty('padding-top', '0px')
          tableHeader?.style.setProperty('position', 'static')
        }
      })
      intersectionObserver.observe(pageHeader)
    },
    true
  )

  const list = reactive<List<Q, R>>({
    items: [],
    query: {
      ...getPage(enablePage),
      ...(otherQuery as Q)
    },
    loading: false,
    total: 0,
    request: async function (callback) {
      if (this.loading) return
      this.loading = true
      try {
        const data = await callback()
        this.items = isArray(data.items) ? data.items : isArray(data) ? data : []
        this.total = typeof data.total === 'number' ? data.total : isArray(data) ? data.length : 0
        this.loading = false
      } catch (error) {
        this.items = []
      }
      this.loading = false
    }
  })

  return list
}

/** 插入分页参数 */
const getPage = (enablePage = true) => {
  const pageSize = useStorage<number>(settings.pageSizeKey, '20')
  return enablePage ? { pageIndex: 1, pageSize: pageSize.value } : {}
}

/** 定义列表参数 */
export const defineListProps = <T>() => {
  return {
    /** 数据列表 */
    list: {
      type: Object as PropType<T>,
      required: true
    }
  }
}

/** 定义列表emits */
export const defineListEmits = () => {
  return ['update:list']
}

/** 列表数据组件化 */
export const useListRef = <Q = null, R = object>(props: any, context: { emit: (event: any, ...args: any[]) => void }) => {
  /** 列表数据组件化 */
  const list = computed({
    get() {
      return props.list
    },
    set(value: List<Q, R>) {
      context.emit('update:list', value)
    }
  })
  return {
    list
  }
}

```





精简

```ts
/**
 * @import { Ref, Reactive } from 'vue
 */

import { reactive } from 'vue';
import { useStorage } from '@/hooks/useStorage'

/**
 * 定义列表参数
 */
export const defineListProps = () => {
  return {
    /** 数据列表 */
    list: {
      type: Object,
      required: true,
    },
  };
};

/** 定义列表emits */
export const defineListEmits = () => {
  return ['update:list'];
};

/**
 * 插入分页参数
 * @function
 * @param { boolean } enablePage 是否启用分页
 * @returns { pageNum: number, pageSize: number } 分页参数
 */
const getPage = (enablePage = true) => {
  /**
   * 分页参数
   * @type { Ref<number> }
   */
  const pageSize = useStorage('pageSize', '20');
  return enablePage ? { pageNum: 1, pageSize: pageSize.value } : {};
};

/**
 * 列表数据
 * @typedef { Reactive<Object> } List
 * @property { Object } query 查询条件
 * @property { Object[] } items 列表数据
 * @property { boolean } loading 加载状态
 * @property { number } total 总数
 * @property { (callback: () => Promise<any>) => Promise<void>} request 请求方法
 */

/**
 * 列表 hooks
 * @template Q = null
 * @name useList
 * @function
 * @param { Partial<Q> } otherQuery 其他查询条件
 * @param { boolean } [enablePage=true] 是否启用分页
 * @returns { Reactive<List> } 列表数据
 */
export const useList = (otherQuery, enablePage = true) => {
  /** @type { Reactive<List> } */
  let list = reactive({
    query: {
      ...getPage(enablePage),
      ...otherQuery,
    },
    items: [],
    loading: false,
    total: 0,
    request: async function (callback) {
      if (this.loading) return;
      this.loading = true;
      try {
        const data = await callback();

        this.items = Array.isArray(data.records) ? data.records : Array.isArray(data) ? data : [];
        this.total = typeof data.total === 'number' ? data.total : Array.isArray(data) ? data.length : 0;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  });

  return list;
};

/**
 * 列表数据组件化
 * @param { any } props
 * @param { { emit: (event: any, ...args: any[]) => void } } context
 */
export const useListRef = (props, context) => {
  /** 列表数据组件化 */
  const list = computed({
    get() {
      return props.list;
    },
    set(value) {
      context.emit('update:list', value);
    },
  });
  
  return {
    list,
  };
};

```

