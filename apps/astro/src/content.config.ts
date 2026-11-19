import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { fileURLToPath } from 'node:url';

// 直接读取仓库根目录的 content/，不生成副本
const contentDir = fileURLToPath(new URL('../../../content', import.meta.url));

export const collections = {
  docs: defineCollection({
    // 共享内容 + Astro 专属内容；排除 VitePress 专属目录
    loader: glob({
      base: contentDir,
      pattern: ['**/*.md', '!vitepress/**'],
      generateId: ({ entry }) => {
        const id = entry.replace(/\.mdx?$/, '');
        if (id === 'astro/index') return 'index';
        if (id.startsWith('astro/')) return id.slice('astro/'.length);
        if (id === 'README') return 'README';
        if (id.endsWith('/README')) return id.slice(0, -'/README'.length);
        return id;
      },
    }),
    schema: docsSchema(),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
