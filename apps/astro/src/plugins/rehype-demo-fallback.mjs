/**
 * VitePress 的 <DemoBlock> 是 Vue 组件，Astro 侧没有同名组件。
 * 把共享内容里的 DemoBlock 标签替换成静态提示，避免出现空白自定义元素。
 */
function walk(node, fn) {
  fn(node)
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn)
  }
}

export default function rehypeDemoFallback() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element') return
      if (!/^demo-?block$/i.test(node.tagName || '')) return
      node.tagName = 'div'
      node.properties = { className: ['astro-demo-fallback'] }
      node.children = [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'text',
              value: '此交互示例是 VitePress 专属组件，Astro 版仅展示说明。',
            },
          ],
        },
      ]
    })
  }
}
