## VUE

```bash
npm i vite-plugin-svg-icons -D
```



```ts
// main.ts
// svg
import 'virtual:svg-icons-register'

// vite.config
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig } from 'vite'

export default () => {
  return defineConfig({
    plugins: [
    	createSvgIconsPlugin({
        iconDirs: [
          resolve(__dirname, './src/icons'),
          resolve(__dirname, './src/views/permission/custom/icons'),
          resolve(__dirname, './node_modules/@element-plus/icons-svg')
        ],
        symbolId: 'icon-[name]' // icon-[dir]-[name]
      })
    ]
  })
}
```



```ts
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

```ts
type Words =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

/** 限定首字母大写 */
type Cap = `${Capitalize<Words>}${string}`
```

### SvgIcon使用

```bash
npm i vue-svgicon
```

```ts
// main

import SvgIcon from 'vue-svgicon'
import '@/icons/components'
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em',
})

// package.json
{
  "scripts": {
    "svg": "vsvg -s ./src/icons/svg -t ./src/icons/components --es6" // 尾部可以增加 --ext ts输出为ts文件
  }
}
```

```css
/* 全局css */
.svg-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  color: inherit;
  fill: none;
  stroke: currentColor;
  vertical-align: middle;
}

.svg-fill {
  fill: currentColor;
  stroke: none;
}
```

