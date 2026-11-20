import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { generateNav, generateSidebar } from './sidebar.mjs'
import docsWatch from './plugins/content-watch'

/**
 * GitHub Pages 是项目站点，地址形如：
 * https://<user>.github.io/studyNotes/
 * 因此构建时通过 DOCS_BASE=/studyNotes/ 注入 base。
 * 本地开发 / 预览默认使用 /，自定义域名也使用 /。
 */
const base = process.env.DOCS_BASE || '/'

/**
 * 把 Markdown 正文里的 {{ ... }} 转成 HTML 实体。
 *
 * 笔记里大量出现 Vue 插值写法，VitePress 会把 Markdown 当成 Vue 模板编译，
 * 未定义的 {{ foo }} 会导致 SSR 报错。这里只处理正文文本与原始 HTML 块，
 * 代码块（含缩进代码块）会被加上 v-pre，不受影响。
 *
 * 单独某篇页面确实需要 Vue 插值时，在 frontmatter 中写 `allowVue: true` 跳过。
 */
function escapeVueMustache(md: any) {
  md.renderer.rules.code_block = (tokens: any[], idx: number) =>
    `<pre v-pre><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`

  md.core.ruler.push('docs:escape-vue-mustache', (state: any) => {
    if (state.env?.frontmatter?.allowVue) return

    for (const token of state.tokens) {
      if (token.type === 'inline' && token.children) {
        const children: any[] = []
        for (const child of token.children) {
          if (
            child.type === 'code_inline' &&
            child.content.includes('{{')
          ) {
            const code = new state.Token('html_inline', '', 0)
            code.content = `<code v-pre>${state.md.utils.escapeHtml(child.content)}</code>`
            children.push(code)
            continue
          }
          if (child.type === 'html_inline' && /<\/?(script|style)\b/i.test(child.content)) {
            // 正文里描述 <script>/<style> 时不要把标签交给 Vue 解析
            child.content = child.content.replace(/<(\/?(?:script|style)\b)/gi, '&lt;$1')
            children.push(child)
            continue
          }
          if (child.type !== 'text' || !child.content.includes('{{')) {
            children.push(child)
            continue
          }
          const parts = child.content.split('{{')
          parts.forEach((part: string, index: number) => {
            if (index > 0) {
              const entity = new state.Token('html_inline', '', 0)
              entity.content = '&#123;&#123;'
              children.push(entity)
            }
            if (part) {
              const text = new state.Token('text', '', 0)
              text.content = part
              children.push(text)
            }
          })
        }
        token.children = children
      } else if (token.type === 'html_block') {
        token.content = token.content.replace(/\{\{/g, '&#123;&#123;')
        token.content = token.content.replace(/<(\/?(?:script|style)\b)/gi, '&lt;$1')
      }
    }
  })
}

export default defineConfig({
  lang: 'zh-CN',
  title: '学习笔记',
  description: '前端、后端、AI、工具与系统运维学习笔记，支持全文搜索、可交互示例与源码查看。',
  base,
  cleanUrls: false,
  ignoreDeadLinks: true,
  srcDir: fileURLToPath(new URL('../../../content', import.meta.url)),
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache',
  srcExclude: ['**/node_modules/**', '**/dist/**', 'public/**', 'astro/**'],
  rewrites: {
    'vitepress/index.md': 'index.md',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}brand-logo.svg` }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'author', content: 'Herschel Liu' }],
  ],

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: escapeVueMustache,
  },

  vite: {
    plugins: [docsWatch()],
  },

  themeConfig: {
    logo: '/brand-logo.svg',
    siteTitle: '学习笔记',

    nav: generateNav(),

    sidebar: generateSidebar(),

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    editLink: {
      pattern: 'https://github.com/HerschelLiu/studyNotes/edit/master/content/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/HerschelLiu/studyNotes' },
    ],

    footer: {
      message: '基于 VitePress 构建 · 由 GitHub Pages 托管',
      copyright: 'Copyright © 2026 Herschel Liu',
    },

    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言',
    externalLinkIcon: true,
  },
})
