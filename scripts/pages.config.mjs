import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const rawBase = process.env.PAGES_BASE || '/studyNotes/'
const repoBase = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`

const siteBase = (name) => `${repoBase}${name}/`

/** `.pages` 构建的单一配置来源。 */
export const pagesConfig = {
  repoRoot,
  repoBase,
  outDir: '.pages',
  homeDir: 'apps/home',
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
