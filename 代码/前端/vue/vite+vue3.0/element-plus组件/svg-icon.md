```vue
<template>
  <svg :style="useStyle({ width, height })" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'SvgIcon'
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'

import { useLineString } from '@/hooks/useString'
import { useStyle } from '@/hooks/useStyle'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String as PropType<Cap>,
    required: true
  },
  color: {
    type: String,
    default: 'CurrentColor'
  },
  width: {
    type: String,
    default: '1em'
  },
  height: {
    type: String,
    default: '1em'
  }
})

const symbolId = computed(() => `#${props.prefix}-${useLineString(props.name)}`)
</script>

```

