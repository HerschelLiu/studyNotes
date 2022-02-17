## vueuse

一款基于Vue组合式API的函数工具集。

它基于**Vue Composition Api (组合式API)**，只有在支持组合式API的环境下，才可以正常使用它；什么是组合式API?

**安装**

```
npm i @vueuse/core
// or
yarn add @vueuse/core
```

**例子1：useMouse**

```vue
<template>
  <div id="app">
    <h3>Mouse: {{x}} x {{y}}</h3>
  </div>
</template>
<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()
</script>

<!--或-->

<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

**例子2：useInterval**

```vue
<script setup lang="ts">
import { useInterval } from '.'
const { counter, pause, resume } = useInterval(200, { controls: true })

// counter 一个 Ref 对象，它是响应式的，counter.value等于已经计数的次数
// pause() 暂停
// resume() 恢复 
</script>

<template>
  <div id="APP">
    <p>Interval fired: {{ counter }}</p>
  </div>
</template>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

**例子3：useVModel**

```vue
<template>
  <div>
    name:
    <input v-model="_name"/>
    age:
    <input v-model="_age"/>
    sex:
    <input v-model="_sex"/>
  </div>
</template>
<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
const props = defineProps({
  name: String,
  age: String,
  sex: String
})
const emit = defineEmits(['update:name', 'update:age', 'update:sex'])

const _name = useVModel(props, 'name', emit)
const _age = useVModel(props, 'age', emit)
const _sex = useVModel(props, 'sex', emit)
</script>

<!-- 接着，在index.vue中使用它 -->

<template>
  <div>
    <Test
    v-model:name="formData.name"
    v-model:age="formData.age"
    v-model:sex="formData.sex"
    ></Test>
    {{ formData }}
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue-demi';
import Test from './Test.vue'
const formData = reactive({
  name: 'lily',
  age: '8',
  sex: 'boy'
})
</script>

作者：华为云开发者社区
链接：https://zhuanlan.zhihu.com/p/458308850
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



