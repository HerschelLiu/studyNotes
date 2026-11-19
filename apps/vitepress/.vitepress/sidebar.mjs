import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_ROOT = path.resolve(APP_ROOT, '../../content')

/** 每个一级分类的入口目录。侧边栏按目录实时生成。 */
export const SECTIONS = [
  { dir: '代码/前端', label: '前端', description: 'Vue / React / CSS / TS、工程化、小程序、移动端' },
  { dir: '代码/后端', label: '后端', description: 'Java、PHP、Node / Nest' },
  { dir: '代码/ai', label: 'AI', description: 'Agent 协作规范、Vue3 + AI、DSH 插件' },
  { dir: '代码/工具', label: '工具', description: 'Git、VSCode、终端、Markdown、自动化测试' },
  { dir: '代码/系统与运维', label: '系统与运维', description: 'Linux、macOS、Windows、Docker、云服务器' },
  { dir: '代码/资源', label: '资源', description: '字体、SVG、好用应用、开源协议' },
]

/** 把 md 相对路径转成 VitePress 路由。 */
function toRoute(relPath) {
  const route = '/' + relPath.split(path.sep).join('/').replace(/\.md$/i, '')
  return route.replace(/\/index$/i, '/')
}

function sortEntries(a, b) {
  if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
  return a.name.localeCompare(b.name, 'zh-CN')
}

function readEntries(absDir) {
  return fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .sort(sortEntries)
}

/**
 * 递归把一个目录转换成侧边栏 items。
 * README.md / index.md 作为「概览」置顶，其余目录折叠。
 *
 * @param {string} relDir
 * @param {Set<string>} [seen]
 * @returns {import('vitepress').DefaultTheme.SidebarItem[]}
 */
function buildItems(relDir, seen = new Set()) {
  const absDir = path.join(CONTENT_ROOT, relDir)
  if (!fs.existsSync(absDir) || seen.has(absDir)) return []
  seen.add(absDir)

  const entries = readEntries(absDir)
  const items = []

  const indexFile = entries.find((entry) => entry.isFile() && entry.name === 'index.md')
  const readmeFile = entries.find((entry) => entry.isFile() && /^readme\.md$/i.test(entry.name))

  if (indexFile) items.push({ text: '概览', link: toRoute(path.join(relDir, 'index.md')) })
  else if (readmeFile) items.push({ text: '概览', link: toRoute(path.join(relDir, 'README.md')) })

  for (const entry of entries) {
    const rel = path.join(relDir, entry.name)
    if (entry.isDirectory()) {
      const children = buildItems(rel, seen)
      if (children.length) items.push({ text: entry.name, collapsed: true, items: children })
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    if (/^readme\.md$/i.test(entry.name) || entry.name === 'index.md') continue
    items.push({ text: entry.name.replace(/\.md$/i, ''), link: toRoute(rel) })
  }

  return items
}

/**
 * 生成 VitePress sidebar 配置：
 * - 一级分类各自独立，避免单个侧边栏过长
 * - /代码/ 与 / 作为分类索引
 * - /指南/ 单独一组
 *
 * @returns {import('vitepress').DefaultTheme.SidebarMulti}
 */
export function generateSidebar() {
  /** @type {import('vitepress').DefaultTheme.SidebarMulti} */
  const sidebar = {}

  for (const section of SECTIONS) {
    if (!fs.existsSync(path.join(CONTENT_ROOT, section.dir))) continue
    sidebar[`/${section.dir}/`] = [
      { text: section.label, collapsed: false, items: buildItems(section.dir) },
    ]
  }

  const categoryLinks = SECTIONS.map((section) => ({
    text: section.label,
    link: section.dir === '代码/ai' ? '/代码/ai/README' : `/${section.dir}/README`,
  }))

  const indexSidebar = [{ text: '全库分类', collapsed: false, items: categoryLinks }]
  sidebar['/代码/'] = indexSidebar
  sidebar['/'] = indexSidebar

  if (fs.existsSync(path.join(CONTENT_ROOT, '指南'))) {
    sidebar['/指南/'] = [{ text: '站点指南', collapsed: false, items: buildItems('指南') }]
  }

  if (fs.existsSync(path.join(CONTENT_ROOT, 'vitepress'))) {
    sidebar['/vitepress/'] = [
      { text: 'VitePress 专属', collapsed: false, items: buildItems('vitepress') },
    ]
  }

  return sidebar
}

/**
 * 顶部导航。
 *
 * @returns {import('vitepress').DefaultTheme.NavItem[]}
 */
export function generateNav() {
  return [
    { text: '前端', link: '/代码/前端/README', activeMatch: '^/代码/前端/' },
    { text: '后端', link: '/代码/后端/README', activeMatch: '^/代码/后端/' },
    { text: 'AI', link: '/代码/ai/README', activeMatch: '^/代码/ai/' },
    { text: '工具', link: '/代码/工具/README', activeMatch: '^/代码/工具/' },
    { text: '系统与运维', link: '/代码/系统与运维/README', activeMatch: '^/代码/系统与运维/' },
    { text: '资源', link: '/代码/资源/README', activeMatch: '^/代码/资源/' },
    { text: '指南', link: '/指南/', activeMatch: '^/指南/' },
  ]
}
