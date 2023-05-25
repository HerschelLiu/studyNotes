```js
import { onMounted, onUnmounted, ref, Ref } from 'vue'
import * as echarts from 'echarts'

/** 解决vue3和echarts的tooltip无法显示的问题 */
export const unwrap = (obj: any) => obj && (obj.__v_raw || obj.valueOf() || obj)

/**
 * echarts图表hooks
 * @param id HTML元素id
 * @param option 初始化配置
 * @param notMerge setOption 参数
 * @param lazyUpdate setOption 参数
 * @returns echarts实例Ref
 */
export const useEcharts = (id: string, option: echarts.EChartsCoreOption = {}, notMerge ? : boolean | undefined, lazyUpdate ? : boolean | undefined): { echart: Ref < echarts.ECharts | null >, setOption: (option: echarts.EChartsCoreOption) => void } => {
  const echart = ref(null) as Ref < echarts.ECharts | null >

  onUnmounted(() => {
    echart.value?.clear && echart.value.clear()
    echart.value?.dispose && echart.value.dispose()
    window.addEventListener('resize', resize)
  })

  onMounted(() => {
    const dom = document.getElementById(id) as HTMLElement
    if (!dom) {
      throw Error('需要承载Echarts的HTML元素不存在')
    }
    echart.value = echarts.init(dom)
    unwrap(echart.value).setOption(option, notMerge, lazyUpdate)
    window.removeEventListener('resize', resize)
  })

  // 图表 resize 方法
  const resize = () => {
    unwrap(echart.value).resize()
  }

  const setOption = (option: echarts.EChartsCoreOption) => {
    setTimeout(() => {
      unwrap(echart.value).setOption(option, notMerge, lazyUpdate)
    }, 100)
  }

  return { echart, setOption }
}

```

