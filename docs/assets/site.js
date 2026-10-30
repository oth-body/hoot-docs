// Collapse the menu on small screens, and add copy buttons to command blocks.
(() => {
  const menu = document.querySelector('.menu')
  if (menu && window.matchMedia('(max-width: 52rem)').matches) menu.open = false

  for (const pre of document.querySelectorAll('.prose pre')) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy'
    btn.textContent = 'Copy'
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText)
        btn.textContent = 'Copied'
      } catch {
        btn.textContent = 'Copy failed'
      }
      setTimeout(() => { btn.textContent = 'Copy' }, 1600)
    })
    const wrap = document.createElement('div')
    wrap.className = 'codeblock'
    pre.replaceWith(wrap)
    wrap.append(pre, btn)
  }
})()
