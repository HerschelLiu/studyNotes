

```ts
import router from '@/router'
import useTagsViewStore from '@/store/modules/tagsView'

export const usePageBack = async () => {
  const route = router.currentRoute.value
  const { visitedViews } = await useTagsViewStore().delView(route)
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    await router.replace(latestView.fullPath)
  } else {
    await router.replace('/')
  }
}

```

