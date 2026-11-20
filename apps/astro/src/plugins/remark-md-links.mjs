import fs from 'node:fs';
import path from 'node:path';

/** 递归遍历 mdast 节点，避免额外引入 unist 依赖。 */
function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

function sortEntries(a, b) {
  if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
  return a.name.localeCompare(b.name, 'zh-CN');
}

function hasIndexPage(dir) {
  return fs.existsSync(path.join(dir, 'index.md')) || fs.existsSync(path.join(dir, 'README.md'));
}

/**
 * 目录链接（如 `vue/`）没有 index/README 时，退回到目录中的第一个 Markdown。
 * GitHub 上目录链接本身可用，静态站点没有目录索引，需要这个兜底。
 */
function firstMarkdown(dir, seen = new Set()) {
  if (!fs.existsSync(dir) || seen.has(dir)) return null;
  seen.add(dir);

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .sort(sortEntries);

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) return path.join(dir, entry.name);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const found = firstMarkdown(path.join(dir, entry.name), seen);
    if (found) return found;
  }

  return null;
}

/**
 * 把共享 Markdown 里的相对链接转成 Starlight 路由：
 *
 *   ./getting-started.md  ->  /guide/getting-started/
 *   ../reference/x.md     ->  /reference/x/
 *   vue/                  ->  /代码/前端/vue/环境变量文件/（目录无索引时）
 *
 * VitePress 自己会把 `.md` 转成 `.html`，所以共享内容只需要写 `.md`。
 */
export default function remarkMdLinks({ base = '/', contentDir }) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  return (tree, file) => {
    const source = file.path || file.history?.[0];
    if (!source || !contentDir) return;

    const toRoute = (absolute, hash = '') => {
      let relative = path.relative(contentDir, absolute).split(path.sep).join('/');
      relative = relative.replace(/\.mdx?$/, '');
      relative = relative.replace(/(^|\/)index$/, '$1').replace(/\/$/, '');
      if (relative.endsWith('/README')) relative = relative.slice(0, -'/README'.length);
      if (relative.startsWith('..')) return null;

      // content/astro/ 下的文件在 Starlight 中被映射到根路由（见 content.config.ts），
      // 生成的链接也要去掉 astro/ 前缀，否则会出现 /astro/astro/xxx/。
      if (relative === 'astro' || relative.startsWith('astro/')) {
        relative = relative.slice('astro/'.length);
      }

      return `${prefix}/${relative}${relative ? '/' : ''}${hash}`;
    };

    walk(tree, (node) => {
      if (node.type !== 'link' || typeof node.url !== 'string') return;

      // 绝对站内链接也要带上 base（例如首页的 /代码/README）
      if (node.url.startsWith('/') && !node.url.startsWith('//') && !/\.mdx?($|#|\?)/.test(node.url)) {
        if (prefix && !node.url.startsWith(prefix + '/')) {
          node.url = prefix + node.url;
        }
        return;
      }

      const [pathnamePart, ...rest] = node.url.split('#');
      const hash = rest.length ? `#${rest.join('#')}` : '';
      const [pathname] = pathnamePart.split('?');

      if (/^(?:[a-z]+:)?\/\//i.test(pathname) || pathname.startsWith('mailto:')) return;

      if (!/\.mdx?($|#|\?)/.test(node.url)) {
        if (!node.url.endsWith('/')) return;

        const absolute = pathname.startsWith('/')
          ? path.join(contentDir, pathname)
          : path.resolve(path.dirname(source), pathname);

        if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) return;
        if (hasIndexPage(absolute)) return;

        const first = firstMarkdown(absolute);
        if (!first) return;

        const route = toRoute(first, hash);
        if (route) node.url = route;
        return;
      }

      const absolute = pathname.startsWith('/')
        ? path.join(contentDir, pathname)
        : path.resolve(path.dirname(source), pathname);

      const route = toRoute(absolute, hash);
      if (route) node.url = route;
    });
  };
}
