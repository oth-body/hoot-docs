import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { collectDocs, pageHtml, buildNav, md } from './vite.config.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function build() {
  const outDir = join(__dirname, 'dist')
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
  const mdFiles = await collectDocs(__dirname)
  const nav = buildNav(mdFiles)
  for (const f of mdFiles) {
    const rel = f.replace(__dirname, '').replace(/^\//, '').replace(/\.md$/, '')
    const content = md.render(await readFile(f, 'utf8'))
    const html = pageHtml(rel, content, nav, mdFiles)
    const outPath = join(outDir, rel || 'index')
    await mkdir(outPath, { recursive: true })
    await writeFile(join(outPath, 'index.html'), html)
  }
  console.log('Built', mdFiles.length, 'pages')
}

build()
