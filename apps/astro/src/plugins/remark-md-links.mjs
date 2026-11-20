import path from 'node:path';

/** 递归遍历 mdast 节点，避免额外引入 unist 依赖。 */
function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

/**
 * 把共享 Markdown 里的相对 `.md` 链接转成 Starlight 路由：
 *
 *   ./getting-started.md  ->  /guide/getting-started/
 *   ../reference/x.md     ->  /reference/x/
 *
 * VitePress 自己会把 `.md` 转成 `.html`，所以共享内容只需要写 `.md`。
 */
export default function remarkMdLinks({ base = '/', contentDir }) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  return (tree, file) => {
    const source = file.path || file.history?.[0];
    if (!source || !contentDir) return;

    walk(tree, (node) => {
      if (node.type !== 'link' || typeof node.url !== 'string') return;

      // 绝对站内链接也要带上 base（例如首页的 /代码/README）
      if (node.url.startsWith('/') && !node.url.startsWith('//') && !/\.mdx?($|#|\?)/.test(node.url)) {
        if (prefix && !node.url.startsWith(prefix + '/')) {
          node.url = prefix + node.url;
        }
        return;
      }

      if (!/\.mdx?($|#|\?)/.test(node.url)) return;
      if (/^(?:[a-z]+:)?\/\//i.test(node.url) || node.url.startsWith('mailto:')) return;

      const [pathnamePart, ...rest] = node.url.split('#');
      const hash = rest.length ? `#${rest.join('#')}` : '';
      const [pathname] = pathnamePart.split('?');
      const absolute = pathname.startsWith('/')
        ? path.join(contentDir, pathname)
        : path.resolve(path.dirname(source), pathname);

      let relative = path.relative(contentDir, absolute).split(path.sep).join('/');
      relative = relative.replace(/\.mdx?$/, '');
      relative = relative.replace(/(^|\/)index$/, '$1').replace(/\/$/, '');
      if (relative.endsWith('/README')) relative = relative.slice(0, -'/README'.length);

      if (relative.startsWith('..')) return;

      // content/astro/ 下的文件在 Starlight 中被映射到根路由（见 content.config.ts），
      // 生成的链接也要去掉 astro/ 前缀，否则会出现 /astro/astro/xxx/。
      if (relative === 'astro' || relative.startsWith('astro/')) {
        relative = relative.slice('astro/'.length);
      }

      node.url = `${prefix}/${relative}${relative ? '/' : ''}${hash}`;
    });
  };
}
