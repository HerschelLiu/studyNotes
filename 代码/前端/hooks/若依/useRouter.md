

```ts
import router from '@/router'
import useTagsViewStore from '@/store/modules/tagsView'

/**
 * 返回上一页并关闭当前页签
 * 对齐若依 TagsView 的 toLastView 逻辑：
 * 1. 关闭当前页签后，跳转到剩余的最后一个页签（即上一页）
 * 2. 无剩余页签时，Dashboard 走 /redirect 重新加载，其余回首页
 * 3. 固定页签（meta.affix）不允许关闭，直接跳过
 */
export const usePageBack = async () => {
  const route = router.currentRoute.value
  if (route.meta?.affix) return

  const { visitedViews } = await useTagsViewStore().delView(route)
  const latestView = visitedViews.slice(-1)[0]

  if (latestView) {
    await router.push(latestView.fullPath)
    return
  }

  if (route.name === 'Dashboard') {
    await router.replace({ path: `/redirect${route.fullPath}` })
    return
  }

  await router.replace('/')
}

```

