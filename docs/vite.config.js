import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const md = markdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() })

async function collectDocs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    if (e.isDirectory() && e.name !== 'node_modules') {
      files.push(...await collectDocs(join(dir, e.name)))
    } else if (e.name.endsWith('.md')) {
      files.push(join(dir, e.name))
    }
  }
  return files.sort()
}

function pageHtml(rel, content, nav, mdFiles) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${rel}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown.min.css">
  <style>
    body { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .markdown-body { box-sizing: border-box; min-width: 200px; max-width: 100%; }
    nav ul { display: flex; gap: 1rem; list-style: none; padding: 0; flex-wrap: wrap; }
    nav a { color: #0969da; text-decoration: none; }
    nav a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <nav class="markdown-body"><ul>${nav}</ul></nav>
  <article class="markdown-body">${content}</article>
</body>
</html>`
}

function buildNav(mdFiles) {
  return mdFiles.map(df => {
    const r = df.replace(__dirname + '/', '').replace(/\.md$/, '')
    const name = r.replace(/\/index$/, 'Home').split('/').pop().replace(/-/g, ' ')
    return `<li><a href="/${r}">${name}</a></li>`
  }).join('\n  ')
}

export { collectDocs, pageHtml, buildNav, md }

export default {
  root: __dirname,
  base: './',
  build: { outDir: 'dist', assetsDir: '_assets' },
}
