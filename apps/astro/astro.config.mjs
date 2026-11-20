// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import { fileURLToPath } from 'node:url';
import remarkMdLinks from './src/plugins/remark-md-links.mjs';
import rehypeDemoFallback from './src/plugins/rehype-demo-fallback.mjs';
import remarkDemoFallback from './src/plugins/remark-demo-fallback.mjs';
import { generateSidebar } from './sidebar.mjs';

// 本地 /；与 VitePress 合并部署时传 ASTRO_BASE=/studyNotes/astro/
const base = process.env.ASTRO_BASE || '/';
const contentDir = fileURLToPath(new URL('../../content', import.meta.url));

export default defineConfig({
  site: process.env.SITE_URL || 'https://herschelliu.github.io',
  base,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDemoFallback, [remarkMdLinks, { base, contentDir }]],
      rehypePlugins: [rehypeDemoFallback],
    }),
  },
  integrations: [
    starlight({
      title: '学习笔记 · Astro',
      description: '学习笔记的 Astro/Starlight 版，与 VitePress 共用 content/。',
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/HerschelLiu/studyNotes',
        },
      ],
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: generateSidebar(),
    }),
  ],
});
