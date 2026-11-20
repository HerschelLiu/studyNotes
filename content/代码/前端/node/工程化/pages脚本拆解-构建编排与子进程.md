# 读 pages.mjs 学 Node：构建编排与子进程

> 对应仓库文件：`scripts/pages.mjs`、`scripts/pages.config.mjs`
>
> 目标：通过一个真实脚本，理解 Node 的 ESM、文件操作、子进程、并行与错误处理。

## 1. 这个脚本解决什么问题

仓库里有两个独立的静态站点生成器：

- VitePress：产物在 `apps/vitepress/.vitepress/dist`，base 是 `/studyNotes/vitepress/`；
- Astro：产物在 `apps/astro/dist`，base 是 `/studyNotes/astro/`；
- 还有一个人工维护的门户 `apps/home/index.html`。

GitHub Pages 一次只能发布一个目录，所以需要把它们合并成一个 `.pages/`：

```text
.pages/
├── index.html        # 门户
├── 404.html
├── .nojekyll
├── vitepress/
└── astro/
```

脚本要保证三件事：

1. 两个站点按正确的 base 构建；
2. 产物被完整复制到 `.pages/`（包括 `_astro` 这类目录）；
3. 缺文件时立刻失败，而不是部署后才发现 404。

早期实现是一条 shell 链（`rm/mkdir/cp/touch`），在 Windows 上不可用，也无法校验产物，所以改成了 Node 脚本。

## 2. 最小示例：在 Node 里执行 npm 命令

```js
import { spawnSync } from 'node:child_process'

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
})

if (result.status !== 0) {
  process.exit(1)
}
```

三个关键点：

- `spawnSync` 会**阻塞**，等子进程结束才返回；
- `stdio: 'inherit'` 让子进程的输出直接出现在当前终端；
- `status` 是退出码，`0` 表示成功。

如果想让多个命令同时跑，就要用异步的 `spawn`：

```js
import { spawn } from 'node:child_process'

const runAsync = (script) =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', script], { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      code === 0 ? resolve() : reject(new Error(`${script} 失败`))
    })
  })

await Promise.all([runAsync('build:vp'), runAsync('build:astro')])
```

## 3. 逐段拆解 pages.mjs

### 3.1 ESM 与路径

```js
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { pagesConfig } from './pages.config.mjs'

const { repoRoot, repoBase, outDir, homeDir, port, sites } = pagesConfig
const outRoot = path.join(repoRoot, outDir)
```

- ESM 中没有 `__dirname`，配置模块里用下面的方式拿当前文件目录：

```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
```

- `import.meta.url` 是当前模块的 `file://` URL；
- `fileURLToPath` 转成本地路径，再 `path.resolve(..., '..')` 回到仓库根；
- 这样启动目录在哪都不影响脚本，CI 和本地行为一致。

### 3.2 单一配置源

`pages.config.mjs` 只做一件事：根据 `PAGES_BASE` 算出所有路径和 base。

```js
const rawBase = process.env.PAGES_BASE || '/studyNotes/'
const repoBase = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`
const siteBase = (name) => `${repoBase}${name}/`

export const pagesConfig = {
  repoBase,
  sites: {
    vitepress: {
      script: 'build:vp',
      envKey: 'DOCS_BASE',
      base: siteBase('vitepress'),
      dist: 'apps/vitepress/.vitepress/dist',
    },
    astro: {
      script: 'build:astro',
      envKey: 'ASTRO_BASE',
      base: siteBase('astro'),
      dist: 'apps/astro/dist',
    },
  },
}
```

这样做的好处：

- base 只维护一处，不会出现“构建用 A、预览用 B”；
- 换仓库名或自定义域名，只传一个环境变量；
- `Object.values(sites)` 可以直接驱动构建循环，不用复制粘贴两段命令。

### 3.3 跨平台执行 npm

```js
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const spawnOptions = {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
}
```

- Windows 上 npm 是批处理文件 `npm.cmd`，不能像普通可执行文件那样直接 `spawn`；
- Node 20 之后，出于安全修复，启动 `.cmd` 必须带 `shell: true`（或显式通过 `cmd.exe /c`）；
- macOS / Linux 不需要 shell，关掉可以减少一层解释器，参数也更安全。

同步执行：

```js
const run = (script, env = {}) => {
  const result = spawnSync(npm, ['run', script], {
    ...spawnOptions,
    env: { ...process.env, ...env },
  })
  if (result.status !== 0) throw new Error(`npm run ${script} 失败`)
}
```

注意 `env` 的展开顺序：`...process.env` 在前，`...env` 在后，后者覆盖前者，所以 `DOCS_BASE`、`ASTRO_BASE` 能覆盖已有变量。

### 3.4 同步与并行

```js
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
```

- `spawn` 返回子进程对象，本身不是 Promise，需要手动包一层；
- `error` 事件处理“命令根本启动不了”（如找不到可执行文件）；
- `exit` 事件拿到退出码；
- `Promise.all` 任一失败就整体失败，符合“构建不能带病继续”的预期。

默认串行，是因为两个 SSG 同时构建会争内存和 CPU；需要时用 `--parallel` 打开。

### 3.5 文件操作

```js
await fs.rm(outRoot, { recursive: true, force: true })
await fs.mkdir(outRoot, { recursive: true })

for (const [name, site] of Object.entries(sites)) {
  await fs.cp(path.join(repoRoot, site.dist), path.join(outRoot, name), {
    recursive: true,
  })
}

await fs.copyFile(path.join(repoRoot, homeDir, 'index.html'), path.join(outRoot, 'index.html'))
await fs.writeFile(path.join(outRoot, '.nojekyll'), '')
```

逐个说明：

| API | 作用 | 注意点 |
| --- | --- | --- |
| `fs.rm(..., { recursive, force })` | 删除目录 | `force` 让目录不存在时也不报错 |
| `fs.mkdir(..., { recursive })` | 递归建目录 | 父目录不存在会自动创建 |
| `fs.cp(src, dest, { recursive })` | 递归复制 | 会包含点文件，不像 `cp dist/*` 会漏掉 |
| `fs.copyFile` | 复制单个文件 | 目标存在时默认覆盖 |
| `fs.writeFile` | 写文件 | 这里用来生成空的 `.nojekyll` |

所有操作都在 `await` 之后才进入下一步，顺序不能乱：必须先构建、再复制。

### 3.6 产物校验

```js
const assertExists = async (file) => {
  try {
    await fs.access(file)
  } catch {
    throw new Error(`缺少产物：${path.relative(repoRoot, file)}，请检查对应构建日志`)
  }
}

await Promise.all([
  assertExists(path.join(outRoot, 'index.html')),
  assertExists(path.join(outRoot, '404.html')),
  assertExists(path.join(outRoot, 'vitepress', 'index.html')),
  assertExists(path.join(outRoot, 'astro', 'index.html')),
])
```

`fs.access` 只关心“能不能访问”，失败就抛错。因为四个检查互不依赖，用 `Promise.all` 并发执行；错误信息里用 `path.relative` 打印相对路径，比绝对路径更容易读。

### 3.7 命令分发

```js
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
```

- `process.argv[2]` 是第一个业务参数，`[3..]` 是 flags；
- 顶层 `await` 允许直接写异步流程（ESM 特性）；
- 统一 `try/catch`：任何一步抛错都打印一行原因并以非 0 退出，CI 才能正确判定失败。

## 4. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| Windows 报 `EINVAL` / 找不到 npm | `.cmd` 没有通过 shell 启动 | 加 `shell: process.platform === 'win32'` |
| 子进程有输出但脚本立刻往下走 | 用了 `spawn` 却没有等待 Promise | 用 `await` 或同步的 `spawnSync` |
| 看不到构建日志 | 没设置 `stdio: 'inherit'` | 默认是 pipe，需要自己读流 |
| 环境变量没生效 | `env` 展开顺序写反 | `{ ...process.env, ...自定义 }` |
| 复制后少了隐藏文件 | 用了 `cp dist/*` | 用 `fs.cp(..., { recursive: true })` |
| 并行构建机器卡死 | 两个 SSG 同时吃内存 | 默认串行，谨慎用 `--parallel` |
| 构建退出码 0 但页面 404 | 只判断了子进程成功，没校验产物 | 增加 `assertExists` |

## 5. 在项目里怎么用

```bash
npm run pages:build              # 串行构建 + 组装 + 校验
npm run pages:build -- --parallel
PAGES_BASE=/demo/ npm run pages:build
```

CI 里只需要一个步骤：

```yaml
- run: npm run pages:build
  env:
    PAGES_BASE: /studyNotes/
```

## 6. 练习

1. 增加 `--only=vitepress`，只构建并复制一个站点；
2. 给每个阶段加耗时统计（`performance.now()`），看看瓶颈在构建还是复制；
3. 把 `pages.mjs` 拆成 `build.mjs` 和 `serve.mjs`，用 `node:util` 的 `parseArgs` 解析参数；
4. 用 `node --inspect-brk scripts/pages.mjs build` 在 VS Code 里单步执行，观察 `tasks` 和 `.pages` 的变化。

下一篇：[静态服务器与路径处理](./pages脚本拆解-静态服务器与路径处理.md)
