import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { readdir, readFile } from 'fs/promises'
import { join, dirname, posix } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const md = markdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() })

async function collectDocs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== 'dist') {
      files.push(...await collectDocs(join(dir, e.name)))
    } else if (e.name.endsWith('.md')) {
      files.push(join(dir, e.name))
    }
  }
  return files.sort()
}

// parseFrontMatter splits Jekyll-style front matter from the body.
// markdown-it has no front-matter support: left in, the block rendered as a
// horizontal rule followed by a "title: … nav_order: …" heading on every page.
function parseFrontMatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src)
  if (!m) return { data: {}, body: src }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (!kv) continue
    let v = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2')
    if (/^-?\d+$/.test(v)) v = Number(v)
    data[kv[1]] = v
  }
  return { data, body: src.slice(m[0].length) }
}

// relPath turns /abs/docs/getting-started/installation.md into
// "getting-started/installation" (and docs/index.md into "index").
function relPath(file) {
  return file.slice(__dirname.length + 1).replace(/\\/g, '/').replace(/\.md$/, '')
}

// urlFor maps a doc's rel path to its served URL: index → "/", others → "/rel/".
function urlFor(rel) {
  return rel === 'index' ? '/' : `/${rel}/`
}

// rewriteLinks points links between docs at their built URLs. The sources
// link to sibling .md files (which is what GitHub and Jekyll expect), but the
// built site serves each page at /<path>/, so "posting-notes.md" from
// /getting-started/installation/ must become "/posting-notes/".
function rewriteLinks(html, rel) {
  const fromDir = posix.dirname(rel)
  return html.replace(/href="([^"#:?]+)\.md(#[^"]*)?"/g, (whole, target, hash = '') => {
    if (target.startsWith('//')) return whole
    const resolved = target.startsWith('/')
      ? target.slice(1)
      : posix.normalize(posix.join(fromDir, target))
    if (resolved.startsWith('..')) return whole
    return `href="${urlFor(resolved)}${hash}"`
  })
}

async function loadPages(files) {
  const pages = []
  for (const f of files) {
    const { data, body } = parseFrontMatter(await readFile(f, 'utf8'))
    const rel = relPath(f)
    const fallback = rel === 'index' ? 'Home' : rel.split('/').pop().replace(/-/g, ' ')
    pages.push({ file: f, rel, url: urlFor(rel), body, title: data.title || fallback, navOrder: data.nav_order ?? 999, parent: data.parent || null })
  }
  return pages
}

// buildNav lists top-level pages by nav_order, with child pages (front matter
// `parent: <title>`) listed right after their parent, also by nav_order.
// A parent title with no page of its own is placed by its first child.
function buildNav(pages, currentRel) {
  const byOrder = (a, b) => a.navOrder - b.navOrder || a.title.localeCompare(b.title)
  const children = new Map()
  for (const p of pages.filter(p => p.parent)) {
    if (!children.has(p.parent)) children.set(p.parent, [])
    children.get(p.parent).push(p)
  }
  const items = []
  const tops = pages.filter(p => !p.parent).sort(byOrder)
  // Orphan parents ("Getting Started" has no page) slot in before the first
  // top-level page whose nav_order is higher than the group's best child.
  for (const [parent, kids] of children) {
    if (!tops.some(t => t.title === parent)) {
      const order = Math.min(...kids.map(k => k.navOrder))
      tops.push({ title: parent, navOrder: order + 0.5, group: true })
    }
  }
  tops.sort(byOrder)
  const link = p => {
    const cls = p.rel === currentRel ? ' aria-current="page"' : ''
    return `<li><a href="${p.url}"${cls}>${p.title}</a></li>`
  }
  for (const t of tops) {
    if (!t.group) { items.push(link(t)) }
    for (const k of (children.get(t.title) || []).sort(byOrder)) {
      items.push(link(k))
    }
  }
  return items.join('\n  ')
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

function pageHtml(page, content, nav) {
  const title = page.rel === 'index' ? 'Hoot' : `${page.title} · Hoot`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown.min.css">
  <style>
    body { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .markdown-body { box-sizing: border-box; min-width: 200px; max-width: 100%; }
    nav ul { display: flex; gap: 1rem; list-style: none; padding: 0; flex-wrap: wrap; }
    nav a { color: #0969da; text-decoration: none; }
    nav a:hover, nav a[aria-current] { text-decoration: underline; }
  </style>
</head>
<body>
  <nav class="markdown-body"><ul>${nav}</ul></nav>
  <article class="markdown-body">${content}</article>
</body>
</html>`
}

function renderPage(page, pages) {
  const content = rewriteLinks(md.render(page.body), page.rel)
  return pageHtml(page, content, buildNav(pages, page.rel))
}

export { collectDocs, loadPages, renderPage, parseFrontMatter, rewriteLinks, buildNav, urlFor, md }

export default {
  root: __dirname,
  base: './',
  build: { outDir: 'dist', assetsDir: '_assets' },
}
