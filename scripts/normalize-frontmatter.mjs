#!/usr/bin/env node
/**
 * 把「只有 # 一级标题、没有 frontmatter」的旧 Markdown 规范化成共享内容：
 *
 *   1. 写入 frontmatter title
 *   2. 删除正文中的第一个一级标题
 *
 * 用法：
 *   node scripts/normalize-frontmatter.mjs ./content
 *   node scripts/normalize-frontmatter.mjs ./content --dry
 */
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const dirArg = args.find((arg) => !arg.startsWith('-')) || './content'
const dryRun = args.includes('--dry')
const root = path.resolve(dirArg)

if (!fs.existsSync(root)) {
  console.error(`目录不存在：${root}`)
  process.exit(1)
}

const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.mdx?$/.test(entry.name)) files.push(file)
  }
}
walk(root)

const quote = (value) => JSON.stringify(value)
let changed = 0
let skipped = 0

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const lines = source.split('\n')
  let frontmatterEnd = -1
  let hasTitle = false
  let title = ''

  if (lines[0] === '---') {
    frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---')
    if (frontmatterEnd > 0) {
      for (let i = 1; i < frontmatterEnd; i++) {
        const match = lines[i].match(/^title:\s*(.+?)\s*$/)
        if (match) {
          hasTitle = true
          title = match[1].replace(/^["']|["']$/g, '')
        }
      }
    }
  }

  let fence = false
  let h1Index = -1
  let h1Text = ''
  for (let i = frontmatterEnd > 0 ? frontmatterEnd + 1 : 0; i < lines.length; i++) {
    if (/^\s{0,3}(```|~~~)/.test(lines[i])) {
      fence = !fence
      continue
    }
    if (fence) continue
    const match = lines[i].match(/^#\s+(.+?)\s*$/)
    if (match) {
      h1Index = i
      h1Text = match[1].replace(/\s*#+\s*$/, '').trim()
      break
    }
  }

  if (!hasTitle && !h1Text) {
    console.warn(`跳过（没有 title 也没有 H1）：${path.relative(root, file)}`)
    skipped++
    continue
  }

  if (!hasTitle) title = h1Text
  if (!title) title = path.basename(file, path.extname(file))

  if (frontmatterEnd > 0) {
    if (!hasTitle) {
      let insertAt = 1
      // 尽量把 title 放在最前面
      lines.splice(insertAt, 0, `title: ${quote(title)}`)
      if (h1Index >= 0) h1Index++
      frontmatterEnd++
    }
  } else {
    lines.unshift('---', `title: ${quote(title)}`, '---', '')
    if (h1Index >= 0) h1Index += 4
  }

  if (h1Index >= 0 && lines[h1Index]?.startsWith('# ')) {
    lines.splice(h1Index, 1)
    // 清理 H1 后可能留下的连续空行
    if (lines[h1Index] === '' && lines[h1Index + 1] === '') lines.splice(h1Index, 1)
  }

  const next = lines.join('\n').replace(/^(---\n[\s\S]*?\n---)\n{3,}/, '$1\n\n')
  if (next !== source) {
    if (!dryRun) fs.writeFileSync(file, next)
    changed++
    console.log(`${dryRun ? '[dry] ' : ''}更新：${path.relative(root, file)} -> ${title}`)
  }
}

console.log(`\n完成：${changed} 个文件${dryRun ? '（dry-run，未写入）' : ''}，跳过 ${skipped} 个。`)
