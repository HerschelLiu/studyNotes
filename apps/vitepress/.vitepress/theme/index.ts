import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import DemoBlock from './components/DemoBlock.vue'
import AppLayout from './AppLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: AppLayout,
  enhanceApp({ app }) {
    // 全局注册后，Markdown 中可以直接使用 <DemoBlock src="..." />
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
