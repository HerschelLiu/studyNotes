/**
 * 共享内容里的 <DemoBlock ... /> 是 VitePress Vue 组件。
 * Astro 的 Markdown 会把它当原始 HTML 保留，这里替换成静态提示。
 */
function walk(node, fn) {
  fn(node)
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn)
  }
}

const replacement =
  '<div class="astro-demo-fallback"><p>此交互示例是 VitePress 专属组件，Astro 版仅展示说明。</p></div>'

export default function remarkDemoFallback() {
  return (tree) => {
    walk(tree, (node) => {
      if (typeof node.value !== 'string') return
      if (!/<DemoBlock\b/i.test(node.value)) return
      node.value = node.value.replace(/<DemoBlock\b[^>]*\/>/gi, replacement)
    })
  }
}
