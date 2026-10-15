#!/usr/bin/env node
// Builds the local reference library: screenshots of winning sites, captured live.
// Screenshots are not redistributed with this skill (they belong to the sites' owners);
// this script makes them on your machine for private reference.
//
// Usage (needs playwright in the current project or globally):
//   npm i -D playwright && npx playwright install chromium
//   node <skill>/scripts/capture-refs.mjs --top 120            # best 120 winners since 2023
//   node <skill>/scripts/capture-refs.mjs --slugs lando-norris,why-zero
//   node <skill>/scripts/capture-refs.mjs --tags Storytelling --limit 30
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const OUT = path.join(ROOT, 'refs')
fs.mkdirSync(OUT, { recursive: true })
const require = createRequire(path.join(process.cwd(), 'noop.js'))
let chromium
try { ({ chromium } = require('playwright')) } catch {
  try { ({ chromium } = createRequire(import.meta.url)('playwright')) } catch {
    console.error('playwright not found. Run: npm i -D playwright && npx playwright install chromium'); process.exit(1)
  }
}
const args = process.argv.slice(2)
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/winners.json'), 'utf8')).filter((w) => !w.broken)
let list
if (opt('--slugs')) { const s = new Set(opt('--slugs').split(',')); list = W.filter((w) => s.has(w.slug)) }
else {
  const tags = (opt('--tags', '') || '').split(',').filter(Boolean).map((t) => t.toLowerCase())
  list = W.filter((w) => (w.year || 0) >= +opt('--since', 2023) && tags.every((t) => w.tags.some((x) => x.toLowerCase().includes(t))))
    .sort((a, b) => b.score - a.score).slice(0, +opt('--top', opt('--limit', 60)))
}
list = list.filter((w) => args.includes('--force') || !fs.existsSync(path.join(OUT, `${w.slug}.jpg`)))
console.log(`capturing ${list.length} sites → ${OUT}`)
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
let i = 0
async function worker() {
  while (list.length) {
    const w = list.shift()
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    try {
      await Promise.race([
        (async () => {
          await page.goto(w.url, { waitUntil: 'domcontentloaded', timeout: 30000 })
          await page.waitForTimeout(5000)
          await page.evaluate(() => { for (const b of document.querySelectorAll('button,a')) { if (/^(accept|accept all|allow all|agree|ok|got it)$/i.test((b.textContent || '').trim())) { b.click(); break } } }).catch(() => {})
          await page.waitForTimeout(500)
          await page.screenshot({ path: path.join(OUT, `${w.slug}.jpg`), type: 'jpeg', quality: 60, scale: 'css', clip: { x: 0, y: 0, width: 1440, height: 900 } })
          await page.mouse.wheel(0, 1000); await page.waitForTimeout(1500)
          await page.screenshot({ path: path.join(OUT, `${w.slug}-2.jpg`), type: 'jpeg', quality: 55 })
        })(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 60000)),
      ])
      console.log(`✓ ${++i} ${w.title}`)
    } catch (e) { console.log(`✗ ${w.title}: ${String(e.message).slice(0, 80)}`) }
    await ctx.close()
  }
}
await Promise.all([worker(), worker(), worker()])
await browser.close()
