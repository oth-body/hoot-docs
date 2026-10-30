import { writeFile, mkdir, rm } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { collectDocs, loadPages, renderPage } from './vite.config.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function build() {
  const outDir = join(__dirname, 'dist')
  await rm(outDir, { recursive: true, force: true })
  const pages = await loadPages(await collectDocs(__dirname))
  const urls = new Set(pages.map(p => p.url))
  const broken = []
  for (const page of pages) {
    // index.md → dist/index.html (the site root); others → dist/<rel>/index.html
    const dir = page.rel === 'index' ? outDir : join(outDir, page.rel)
    await mkdir(dir, { recursive: true })
    const html = renderPage(page, pages)
    // Fail the build on internal links to pages that don't exist.
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      if (!urls.has(href)) broken.push(`${page.rel}.md -> ${href}`)
    }
    for (const [, href] of html.matchAll(/href="([^"#:?]+\.md)(?:#[^"]*)?"/g)) {
      broken.push(`${page.rel}.md -> ${href} (outside docs/)`)
    }
    await writeFile(join(dir, 'index.html'), html)
  }
  if (broken.length) {
    throw new Error('Broken internal links:\n  ' + broken.join('\n  '))
  }
  console.log('Built', pages.length, 'pages')
}

build().catch(err => {
  console.error(err)
  process.exit(1)
})
