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
  // Images are written relative to the .md file (so they also show on
  // GitHub); the site serves them from the root.
  html = html.replace(/<img src="(?![a-z]+:|\/)([^"]+)"/g, (whole, target) => {
    const resolved = posix.normalize(posix.join(fromDir, target))
    if (resolved.startsWith('..')) return whole
    return `<img loading="lazy" decoding="async" src="/${resolved}"`
  })
  // Each screenshot links to the full-size file, for small screens.
  html = html.replace(/<img [^>]*src="(\/assets\/[^"]+)"[^>]*>/g, (img, src) => `<a class="shot" href="${src}">${img}</a>`)
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

// navTree orders pages for the sidebar: top-level pages by nav_order, with
// child pages (front matter `parent: <title>`) grouped under their parent.
// A parent title with no page of its own ("Getting Started") becomes a group
// heading placed by its first child.
function navTree(pages) {
  const byOrder = (a, b) => a.navOrder - b.navOrder || a.title.localeCompare(b.title)
  const children = new Map()
  for (const p of pages.filter(p => p.parent)) {
    if (!children.has(p.parent)) children.set(p.parent, [])
    children.get(p.parent).push(p)
  }
  const tops = pages.filter(p => !p.parent)
  for (const [parent, kids] of children) {
    if (!tops.some(t => t.title === parent)) {
      const order = Math.min(...kids.map(k => k.navOrder))
      tops.push({ title: parent, navOrder: order - 0.5, group: true })
    }
  }
  tops.sort(byOrder)
  return tops.map(t => ({ ...t, kids: (children.get(t.title) || []).sort(byOrder) }))
}

// readingOrder flattens the sidebar into the sequence used for prev/next links.
function readingOrder(pages) {
  const out = []
  for (const t of navTree(pages)) {
    if (!t.group) out.push(t)
    out.push(...t.kids)
  }
  return out
}

function buildNav(pages, currentRel) {
  const link = p => {
    const cur = p.rel === currentRel ? ' aria-current="page"' : ''
    return `<li><a href="${p.url}"${cur}>${escapeHtml(p.title)}</a></li>`
  }
  const items = []
  for (const t of navTree(pages)) {
    if (t.kids.length) {
      const head = t.group ? `<span class="nav-group">${escapeHtml(t.title)}</span>` : `<a href="${t.url}">${escapeHtml(t.title)}</a>`
      items.push(`<li>${head}<ul>${t.kids.map(link).join('')}</ul></li>`)
    } else {
      items.push(link(t))
    }
  }
  return items.join('\n      ')
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

const REPO = 'https://github.com/oth-body/hoot-docs'

function pagerHtml(page, pages) {
  const order = readingOrder(pages)
  const i = order.findIndex(p => p.rel === page.rel)
  const prev = order[i - 1], next = order[i + 1]
  const a = (p, label, cls) => p
    ? `<a class="${cls}" href="${p.url}" rel="${cls}"><span>${label}</span>${escapeHtml(p.title)}</a>`
    : '<span></span>'
  return `<nav class="pager" aria-label="Previous and next page">${a(prev, 'Previous', 'prev')}${a(next, 'Next', 'next')}</nav>`
}

function pageHtml(page, content, nav, pager) {
  const title = page.rel === 'index' ? 'Hoot: a terminal client for Nostr' : `${page.title} | Hoot docs`
  const source = `${REPO}/blob/master/docs/${page.rel}.md`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="description" content="Hoot is a terminal client for Nostr: post notes, read the feed and DMs, and zap in sats from the command line.">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap">
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body class="${page.rel === 'index' ? 'home' : 'doc'}">
  <a class="skip" href="#content">Skip to content</a>
  <div class="shell">
    <aside class="side">
      <a class="mark" href="/" aria-label="Hoot docs home">hoot<span class="cursor" aria-hidden="true"></span></a>
      <details class="menu" open>
        <summary>Menu</summary>
        <nav aria-label="Documentation"><ul>
      ${nav}
        </ul></nav>
      </details>
      <p class="side-links"><a href="https://github.com/oth-body/hoot">Source on GitHub</a><br><a href="https://github.com/oth-body/hoot/releases">Releases</a></p>
    </aside>
    <main id="content">
      <article class="prose">${content}</article>
      ${pager}
      <p class="edit"><a href="${source}">Edit this page on GitHub</a></p>
    </main>
  </div>
  <script src="/assets/site.js" defer></script>
</body>
</html>`
}

function renderPage(page, pages) {
  const content = rewriteLinks(md.render(page.body), page.rel)
  return pageHtml(page, content, buildNav(pages, page.rel), pagerHtml(page, pages))
}

export { collectDocs, loadPages, renderPage, parseFrontMatter, rewriteLinks, buildNav, navTree, readingOrder, urlFor, md }

export default {
  root: __dirname,
  base: './',
  build: { outDir: 'dist', assetsDir: '_assets' },
}
