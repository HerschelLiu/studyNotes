import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../content')

const SECTIONS = [
  { dir: '代码/前端', label: '前端' },
  { dir: '代码/后端', label: '后端' },
  { dir: '代码/ai', label: 'AI' },
  { dir: '代码/工具', label: '工具' },
  { dir: '代码/系统与运维', label: '系统与运维' },
  { dir: '代码/资源', label: '资源' },
  { dir: '指南', label: '指南' },
  { dir: 'astro', label: 'Astro 专属' },
]

/**
 * 与 content.config.ts 的 generateId 保持一致，Starlight 才能通过 slug 找到页面。
 * @param {string} relPath
 * @returns {string}
 */
function toSlug(relPath) {
  const id = relPath.split(path.sep).join('/').replace(/\.md$/i, '')
  if (id === 'astro/index') return 'index'
  if (id.startsWith('astro/')) return id.slice('astro/'.length)
  if (id === 'README') return 'README'
  if (id.endsWith('/README')) return id.slice(0, -'/README'.length)
  return id
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
 * 递归生成 Starlight 侧边栏条目；目录默认折叠，README / index 作为「概览」置顶。
 * @param {string} relDir
 * @returns {any[]}
 */
function buildItems(relDir) {
  const absDir = path.join(CONTENT_ROOT, relDir)
  if (!fs.existsSync(absDir)) return []

  const entries = readEntries(absDir)
  const items = []

  const indexFile = entries.find((entry) => entry.isFile() && entry.name === 'index.md')
  const readmeFile = entries.find((entry) => entry.isFile() && /^readme\.md$/i.test(entry.name))
  const overview = indexFile ?? readmeFile

  if (overview) {
    items.push({ label: '概览', slug: toSlug(path.join(relDir, overview.name)) })
  }

  for (const entry of entries) {
    const rel = path.join(relDir, entry.name)

    if (entry.isDirectory()) {
      const children = buildItems(rel)
      if (children.length) items.push({ label: entry.name, collapsed: true, items: children })
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    if (overview && entry.name === overview.name) continue
    items.push({ slug: toSlug(rel) })
  }

  return items
}

/**
 * 手动生成侧边栏：Starlight 的 autogenerate 依赖 src/content/docs 固定路径，
 * 本项目使用仓库根目录的 content/，会自动生成空分组，因此改为扫描目录。
 */
export function generateSidebar() {
  return SECTIONS.filter((section) => fs.existsSync(path.join(CONTENT_ROOT, section.dir))).map(
    (section) => ({
      label: section.label,
      items: buildItems(section.dir),
    }),
  )
}
