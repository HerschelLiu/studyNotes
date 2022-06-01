```tsx
import { createElementVNode, defineComponent } from 'vue'

import { useLineString } from '@/hooks/useString'

/**
 * icon组件使用,包括element-plus及私有的图标库
 * @param iconName 图标名称
 * @returns svg图标对应的组件
 */
export function useIcon(iconName: Cap) {
  return defineComponent({
    setup() {
      const render = () =>
        createElementVNode(
          'svg',
          {
            viewBox: '0 0 1024 1024',
            xmlns: 'http://www.w3.org/2000/svg'
          },
          [
            createElementVNode('use', {
              'xlink:href': `#icon-${useLineString(iconName)}`,
              'xlink:type': 'extended',
              fill: 'CurrentColor'
            })
          ]
        )
      return render
    }
  })
}

```

