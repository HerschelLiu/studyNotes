##  `customRef`

创建一个自定义的`ref`，并对其依赖跟踪和更新触发进行显式控制。

```ts
import { customRef } from 'vue';

/**
*创建一个防抖的ref
*@paramValue初始值
*@paramdelay延迟毫秒数，默认500ms
*/
export function useDebouncedRef<T> (value: T, delay = 500) {
  let timeout: number;
  //customRef是一个强大的API，允许我们完全控制ref的依赖跟踪和更新触发
  return customRef((track, trigger) => {
    return {
      get() {
        track(); //告诉Vue，这个值被读取了，需要追踪依赖
        return value;
      },
      set(newValue: T) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger(); //告诉Vue，值已经改变，请更新DOM
        }, delay);
      },
    };
  });
}
```



```vue
<template>
  <input v-model="searchText" placeholder="输入500ms后触发更新" type="text">
  <p>Debounced Value: {{ searchText }}</p>
</template>

<script setup lang="ts">
import { useDebouncedRef } from './composables/useDebouncedRef';

//使用起来就像一个普通的ref，但它自带防抖功能！
const searchText = useDebouncedRef('', 500);

//我们可以像往常一样watch它，回调只会在防抖后执行
// watch(searchText, (newValue) => {
//   console.log('向服务器发起请求：', newValue);
// 11 });
</script>

```



## `shallowRef`

**性能优化的利器**。当我们有大型的、不可变的数据结构时（例如一个巨大的JSON对象、一个第三方库的实例），使用`ref`会对其进行深度递归代理，造成不必要的性能开销。此时`shallowRef`就是最佳选择。



假设我们需要引入一个庞大的图表库实例，这个实例本身有很多内部属性，但我们只关心实例本身是否被替换。

```vue
<template>
  <div ref="chartContainber"></div>
</template>

<script setup lang="ts">
import {onMounted, shallowRef, triggerRef } from 'vue';
import SomeHeavyChartLibrary from 'some-heavy-chart-library';

//使用shallowRef,Vue不会尝试代理aChartInstance内部的所有属性
const chartInstance = shallowRef (null);
const chartContainer = ref (null);

onMounted(() => {
  // aChartInstance的赋值是响应式的
  chartInstance.value = new SomeHeavyChartLibrary(chartContainer.value);
});

function updateChartWithoptions(newOptions) {
  if (chartContainer.value) {
    //chartInstance内部属性的改变不会触发更新
    chartInstance.value.setOptions (newOptions);
    //如果我们确实需要手动强制更新，可以使用triggerRef
    // triggerRef (chartInstance);
  }
}
</script>

```



## 引用

store JavaScript公众号