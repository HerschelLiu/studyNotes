import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { pagesConfig } from './pages.config.mjs'

const { repoRoot, repoBase, outDir, homeDir, port, sites } = pagesConfig
const outRoot = path.join(repoRoot, outDir)
// Windows 上 npm 是 npm.cmd，不能直接 spawn，需要借助命令解释器（shell）
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const spawnOptions = {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

const run = (script, env = {}) => {
  const result = spawnSync(npm, ['run', script], {
    ...spawnOptions,
    env: { ...process.env, ...env },
  })
  if (result.status !== 0) throw new Error(`npm run ${script} 失败`)
}

const runParallel = (tasks) =>
  Promise.all(
    tasks.map(
      ({ script, env }) =>
        new Promise((resolve, reject) => {
          const child = spawn(npm, ['run', script], {
            ...spawnOptions,
            env: { ...process.env, ...env },
          })
          child.on('error', reject)
          child.on('exit', (code) => {
            code === 0 ? resolve() : reject(new Error(`npm run ${script} 失败`))
          })
        }),
    ),
  )

const assertExists = async (file) => {
  try {
    await fs.access(file)
  } catch {
    throw new Error(`缺少产物：${path.relative(repoRoot, file)}，请检查对应构建日志`)
  }
}

async function build({ parallel = false } = {}) {
  await fs.rm(outRoot, { recursive: true, force: true })
  await fs.mkdir(outRoot, { recursive: true })

  const tasks = Object.values(sites).map((site) => ({
    script: site.script,
    env: { [site.envKey]: site.base },
  }))

  if (parallel) await runParallel(tasks)
  else tasks.forEach(({ script, env }) => run(script, env))

  for (const [name, site] of Object.entries(sites)) {
    await fs.cp(path.join(repoRoot, site.dist), path.join(outRoot, name), { recursive: true })
  }

  await fs.copyFile(path.join(repoRoot, homeDir, 'index.html'), path.join(outRoot, 'index.html'))
  await fs.copyFile(path.join(repoRoot, homeDir, '404.html'), path.join(outRoot, '404.html'))
  await fs.writeFile(path.join(outRoot, '.nojekyll'), '')

  await Promise.all([
    assertExists(path.join(outRoot, 'index.html')),
    assertExists(path.join(outRoot, '404.html')),
    assertExists(path.join(outRoot, 'vitepress', 'index.html')),
    assertExists(path.join(outRoot, 'astro', 'index.html')),
  ])

  console.log(`\n.pages 已生成：${path.relative(repoRoot, outRoot)}`)
  console.log(`  门户：      ${repoBase}`)
  console.log(`  VitePress：${repoBase}vitepress/`)
  console.log(`  Astro：    ${repoBase}astro/`)
}

const sendFile = (res, file, status = 200) => {
  res.writeHead(status, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
  fsSync.createReadStream(file).pipe(res)
}

async function serve() {
  await assertExists(path.join(outRoot, 'index.html'))

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0])

    if (url === repoBase.replace(/\/$/, '')) {
      res.writeHead(302, { Location: repoBase })
      res.end()
      return
    }

    if (!url.startsWith(repoBase)) {
      sendFile(res, path.join(outRoot, '404.html'), 404)
      return
    }

    const relative = url.slice(repoBase.length)
    let file = path.resolve(outRoot, relative)

    if (!file.startsWith(outRoot)) {
      sendFile(res, path.join(outRoot, '404.html'), 404)
      return
    }

    if (!relative || relative.endsWith('/')) file = path.join(file, 'index.html')
    else if (!fsSync.existsSync(file) && fsSync.existsSync(`${file}.html`)) file = `${file}.html`

    if (!fsSync.existsSync(file) || !fsSync.statSync(file).isFile()) {
      sendFile(res, path.join(outRoot, '404.html'), 404)
      return
    }

    sendFile(res, file)
  })

  await new Promise((resolve) => server.listen(port, resolve))
  console.log(`\nPages 预览：http://localhost:${port}${repoBase}`)
  console.log(`  VitePress：http://localhost:${port}${repoBase}vitepress/`)
  console.log(`  Astro：    http://localhost:${port}${repoBase}astro/`)
}

const command = process.argv[2]
const flags = process.argv.slice(3)

try {
  if (command === 'build') {
    await build({ parallel: flags.includes('--parallel') })
  } else if (command === 'serve') {
    await serve()
  } else if (command === 'preview') {
    await build({ parallel: flags.includes('--parallel') })
    await serve()
  } else {
    console.error('用法：node scripts/pages.mjs <build|serve|preview> [--parallel]')
    process.exit(1)
  }
} catch (error) {
  console.error(`\n✖ ${error.message}`)
  process.exit(1)
}
