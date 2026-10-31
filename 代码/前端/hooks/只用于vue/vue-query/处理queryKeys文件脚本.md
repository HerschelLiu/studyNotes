`/scripts/gen-query-keys.mjs`

```js
#!/usr/bin/env node
/**
 * gen-query-keys.mjs — 自动维护 src/constants/queryKeys.ts
 *
 * 扫描 src 下所有 .ts/.vue 文件中 queryKeys.X.Y.Z(...) 调用:
 *   - 已存在 → 跳过, 报告"已存在"
 *   - 签名冲突 → 只警告, 不覆盖
 *   - 存量 key 串 → 保留原样 (不重写)
 *   - 孤立 key (已定义但未使用) → 列出但不删除
 *
 * Usage:
 *   node scripts/gen-query-keys.mjs          # 扫描 + 写回
 *   node scripts/gen-query-keys.mjs --check  # 只报告, 不写文件
 */

import { Project, SyntaxKind, QuoteKind, IndentationText } from 'ts-morph'
import { parse as parseVue } from '@vue/compiler-sfc'
import fastGlob from 'fast-glob'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const QUERY_KEYS_FILE = resolve(ROOT, 'src/constants/queryKeys.ts')
const SCAN_PATTERN = 'src/**/*.{ts,vue}'
const IGNORE_PATTERNS = ['src/constants/queryKeys.ts', '**/*.d.ts']

/** camelCase 段 → UPPER_SNAKE: financialManagement → FINANCIAL_MANAGEMENT */
const toUpperSnake = segment =>
  segment
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toUpperCase()

/** 路径 → key 串: ['financialManagement', 'voucherType', 'list'] → FINANCIAL_MANAGEMENT_VOUCHER_TYPE_LIST */
const formatKeyString = path => path.map(toUpperSnake).join('_')

const isKind = (node, kind) => !!node && typeof node.getKind === 'function' && node.getKind() === kind

/** 取 .vue 的 <script setup>/<script> 内容, 返回 (code, 行偏移) */
function getScriptContent(filePath) {
  if (!filePath.endsWith('.vue')) {
    return { code: readFileSync(filePath, 'utf8'), lineOffset: 0 }
  }
  const src = readFileSync(filePath, 'utf8')
  const { descriptor } = parseVue(src, { filename: filePath })
  const block = descriptor.scriptSetup ?? descriptor.script
  if (!block) return { code: '', lineOffset: 0 }
  // block.loc.start.line 是 1-based 的 .vue 行号; content 内部第 N 行 = .vue 的 (start.line + N - 1)
  const startLine = block.loc?.start?.line ?? 1
  return { code: block.content, lineOffset: startLine - 1 }
}

/**
 * 若 callee 是 queryKeys.X.Y.Z 形式的属性访问链, 返回路径数组; 否则 null
 * 例如 queryKeys.budgetDept.list(isRoll) → ['budgetDept', 'list']
 */
function tryExtractChain(callee) {
  const path = []
  let node = callee
  while (isKind(node, SyntaxKind.PropertyAccessExpression)) {
    path.unshift(node.getNameNode().getText())
    node = node.getExpression()
  }
  if (!isKind(node, SyntaxKind.Identifier) || node.getText() !== 'queryKeys') return null
  return path
}

function collectUsages(project) {
  const found = new Map() // path.join('.') → { path, argCounts:Set<number>, usages:[{file,line}] }
  const files = fastGlob.sync([SCAN_PATTERN], {
    cwd: ROOT,
    absolute: true,
    ignore: IGNORE_PATTERNS
  })
  for (const file of files) {
    const { code, lineOffset } = getScriptContent(file)
    if (!code.trim()) continue
    // 用 .ts 扩展名确保按 TypeScript 解析
    const sf = project.createSourceFile(`${file}.__gen__.ts`, code, { overwrite: true })
    for (const callExpr of sf.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const path = tryExtractChain(callExpr.getExpression())
      if (!path) continue
      const argCount = callExpr.getArguments().length
      const key = path.join('.')
      if (!found.has(key)) found.set(key, { path, argCounts: new Set(), usages: [] })
      const entry = found.get(key)
      entry.argCounts.add(argCount)
      entry.usages.push({ file: relative(ROOT, file), line: callExpr.getStartLineNumber() + lineOffset })
    }
  }
  return found
}

// ---------------- 2. 解析现有 queryKeys.ts ----------------

function findQueryKeysObject(sf) {
  const decl = sf.getVariableDeclaration('queryKeys')
  if (!decl) throw new Error(`queryKeys 变量未找到 in ${sf.getFilePath()}`)
  const init = decl.getInitializer()
  if (!isKind(init, SyntaxKind.ObjectLiteralExpression)) {
    throw new Error('queryKeys 初始值不是对象字面量')
  }
  return init
}

/** 在现有对象里按 path 查找节点; 找不到返回 null */
function lookupPath(obj, path) {
  let cur = obj
  for (const seg of path) {
    if (!isKind(cur, SyntaxKind.ObjectLiteralExpression)) return null
    const prop = cur.getProperty(seg)
    if (!prop) return null
    cur = prop.getInitializer()
    if (!cur) return null
  }
  return cur
}

/** 返回 ArrowFunction 的形参数量; 非函数返回 -1 */
function getExistingParamCount(node) {
  if (isKind(node, SyntaxKind.ArrowFunction)) return node.getParameters().length
  return -1
}

/** 递归收集所有叶子路径 (值为非对象字面量的属性) */
function collectExistingPaths(obj, prefix = [], acc = []) {
  if (!isKind(obj, SyntaxKind.ObjectLiteralExpression)) return acc
  for (const prop of obj.getProperties()) {
    if (!isKind(prop, SyntaxKind.PropertyAssignment)) continue
    const name = prop.getNameNode().getText()
    const init = prop.getInitializer()
    if (!init) continue
    const next = [...prefix, name]
    if (isKind(init, SyntaxKind.ObjectLiteralExpression)) {
      collectExistingPaths(init, next, acc)
    } else {
      acc.push(next)
    }
  }
  return acc
}

// ---------------- 3. 合并 ----------------

/** 构造箭头函数源码: argCount=0 → () => ['KEY']; 1 → (query?: Record<string, any>) => ['KEY', query] */
function buildArrowFunctionText(keyStr, argCount) {
  const params = []
  const body = [`'${keyStr}'`]
  for (let i = 0; i < argCount; i++) {
    if (i === 0) {
      params.push('query?: Record<string, any>')
      body.push('query')
    } else {
      params.push(`arg${i}: any`)
      body.push(`arg${i}`)
    }
  }
  return `(${params.join(', ')}) => [${body.join(', ')}]`
}

/** 沿 path 插入叶子; 中间层级不存在则补 {} */
function insertLeaf(obj, path, keyStr, argCount) {
  let cur = obj
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i]
    const existing = cur.getProperty(seg)
    if (existing) {
      cur = existing.getInitializer()
    } else {
      const newProp = cur.addPropertyAssignment({ name: seg, initializer: '{}' })
      cur = newProp.getInitializer()
    }
  }
  const last = path[path.length - 1]
  cur.addPropertyAssignment({ name: last, initializer: buildArrowFunctionText(keyStr, argCount) })
}

function merge(found, obj) {
  const report = { added: [], existing: [], conflict: [], orphan: [] }
  const existingPaths = collectExistingPaths(obj).map(p => p.join('.'))

  for (const [key, entry] of found) {
    const node = lookupPath(obj, entry.path)
    if (!node) {
      // 新增: 用最大 argCount 生成签名 (所有形参可选, 覆盖所有用法)
      const argCount = Math.max(0, ...entry.argCounts)
      const keyStr = formatKeyString(entry.path)
      insertLeaf(obj, entry.path, keyStr, argCount)
      report.added.push({ path: key, keyString: keyStr, argCount, usages: entry.usages })
      continue
    }
    const existingParamCount = getExistingParamCount(node)
    const maxUsed = Math.max(0, ...entry.argCounts)
    if (existingParamCount === -1) {
      report.conflict.push({ path: key, reason: '已存在但不是函数 (可能是数组字面量)', usages: entry.usages })
    } else if (maxUsed > existingParamCount) {
      report.conflict.push({
        path: key,
        reason: `已存在 ${existingParamCount} 参, 用法 ${maxUsed} 参`,
        usages: entry.usages
      })
    } else {
      report.existing.push({ path: key, paramCount: existingParamCount, usages: entry.usages })
    }
  }

  // orphan: 已定义但未使用
  for (const p of existingPaths) {
    if (!found.has(p)) report.orphan.push(p)
  }
  return report
}

// ---------------- 4. 报告 ----------------

function printSection(title, items, formatter) {
  console.log(`\n  ${title}: ${items.length} 条`)
  items.slice(0, 50).forEach(item => {
    console.log(`    ${formatter(item)}`)
    if (item.usages) {
      item.usages.slice(0, 2).forEach(u => console.log(`        @ ${u.file}:${u.line}`))
    }
  })
  if (items.length > 50) console.log(`    ... 还有 ${items.length - 50} 条`)
}

function printReport(report, checkOnly) {
  console.log(`\n=== queryKeys codegen ${checkOnly ? '(check only, 不写文件)' : ''} ===`)
  printSection('新增 (写入)', report.added, a => `+ ${a.path}  =>  ['${a.keyString}', ...]  (${a.argCount} 参)`)
  printSection('已存在 (跳过)', report.existing, e => `= ${e.path}  (${e.paramCount} 参)`)
  printSection('冲突 (未覆盖, 需手动检查)', report.conflict, c => `! ${c.path}  — ${c.reason}`)
  printSection('孤立 (已定义但未使用, 不删除)', report.orphan, p => `? ${p}`)
  console.log('')
}

// ---------------- main ----------------

function main() {
  const checkOnly = process.argv.includes('--check')

  // 内存 project 用于扫描用法 (不写盘)
  const scanProject = new Project({ useInMemoryFileSystem: true })
  const found = collectUsages(scanProject)

  // 真实 project 用于读写 queryKeys.ts (保证格式与原文件一致)
  const qkProject = new Project({
    skipAddingFilesFromTsConfig: true,
    manipulationSettings: { quoteKind: QuoteKind.Single, indentationText: IndentationText.TwoSpaces }
  })
  const qkSf = qkProject.addSourceFileAtPath(QUERY_KEYS_FILE)
  const obj = findQueryKeysObject(qkSf)

  const report = merge(found, obj)
  printReport(report, checkOnly)

  if (checkOnly) {
    console.log('check 模式: 不写文件')
    return
  }
  if (report.added.length > 0) {
    qkSf.saveSync()
    console.log(`已更新 ${relative(ROOT, QUERY_KEYS_FILE)}`)
  } else {
    console.log('无新增, 不写文件')
  }
}

try {
  main()
} catch (err) {
  console.error('FATAL:', err)
  process.exit(1)
}

```



`package.json`

```json
"scripts": {
    "gen:query-keys": "node scripts/gen-query-keys.mjs",
    "gen:query-keys:check": "node scripts/gen-query-keys.mjs --check"
  }
```

