import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const contentRoot = fileURLToPath(new URL('../../../../content', import.meta.url))

function sortEntries(a: fs.Dirent, b: fs.Dirent) {
  if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
  return a.name.localeCompare(b.name, 'zh-CN')
}

function hasIndexPage(dir: string) {
  return fs.existsSync(path.join(dir, 'index.md')) || fs.existsSync(path.join(dir, 'README.md'))
}

function firstMarkdown(dir: string, seen = new Set<string>()): string | null {
  if (!fs.existsSync(dir) || seen.has(dir)) return null
  seen.add(dir)

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .sort(sortEntries)

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) return path.join(dir, entry.name)
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const found = firstMarkdown(path.join(dir, entry.name), seen)
    if (found) return found
  }

  return null
}

/**
 * 目录链接（如 `vue/`）没有 index/README 时，改写为目录里的第一个 Markdown。
 *
 * GitHub 上目录链接可以直接浏览，静态站点没有目录索引，会 404；
 * 这里在渲染阶段补一个兜底，源文件仍然保持 `vue/` 的写法。
 */
export default function directoryLinks(md: any) {
  md.core.ruler.push('docs:directory-links', (state: any) => {
    const source = state.env?.realPath
    if (!source) return

    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue

      for (const child of token.children) {
        if (child.type !== 'link_open') continue

        const href = child.attrGet('href')
        if (!href || !href.endsWith('/') || href.startsWith('//')) continue
        if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:')) continue

        const [pathname, ...rest] = href.split('#')
        const hash = rest.length ? `#${rest.join('#')}` : ''

        const absolute = pathname.startsWith('/')
          ? path.join(contentRoot, pathname)
          : path.resolve(path.dirname(source), pathname)

        if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) continue
        if (hasIndexPage(absolute)) continue

        const first = firstMarkdown(absolute)
        if (!first) continue
        if (path.relative(contentRoot, first).startsWith('..')) continue

        const relative = path
          .relative(path.dirname(source), first)
          .split(path.sep)
          .join('/')

        child.attrSet('href', `${relative}${hash}`)
      }
    }
  })
}
