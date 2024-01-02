```ts
import { onActivated, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export const useRouteInit = (func: Function) => {
  const route = useRoute()
  if (route.meta.keepAlive) {
    onActivated(async () => {
      func()
    })
  } else {
    onMounted(async () => {
      func()
    })
  }
}

```

