import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const configFile = fileURLToPath(new URL('../config.mts', import.meta.url))

/**
 * 开发模式下新增 / 删除 Markdown 后，侧边栏配置不会自动重新计算。
 *
 * 这里不直接调用 server.restart()：VitePress 的本地搜索插件在 HMR 时会把
 * 新文档追加进旧索引，直接重启会复用该插件实例并触发 MiniSearch 重复 ID。
 * 改为触碰 config.mts，让 VitePress 走自己的配置变更流程，重新加载配置与插件，
 * sidebar.mjs 会重新扫描目录，搜索索引也会重建。
 *
 * 文件内容修改不需要重启，Vite 的 HMR 会直接热更新页面。
 */
export default function docsWatch(): Plugin {
  return {
    name: 'docs:content-watch',
    apply: 'serve',
    configureServer(server) {
      let timer: ReturnType<typeof setTimeout> | undefined

      const scheduleRestart = (file: string) => {
        if (!file.endsWith('.md')) return
        if (file.includes(`${path.sep}.vitepress${path.sep}`)) return
        if (file.includes(`${path.sep}node_modules${path.sep}`)) return

        clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            const now = new Date()
            fs.utimesSync(configFile, now, now)
            server.config.logger.info(
              '\n[docs] 检测到文档新增 / 删除，正在重新加载配置以刷新侧边栏…',
            )
          } catch (error) {
            server.config.logger.error(`[docs] 刷新配置失败：${String(error)}`)
          }
        }, 600)
      }

      server.watcher.on('add', scheduleRestart)
      server.watcher.on('unlink', scheduleRestart)
    },
  }
}
