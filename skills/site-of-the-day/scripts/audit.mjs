#!/usr/bin/env node
// SOTD audit — measures a running site with the same probes used on 808 Awwwards winners,
// compares it to the winners' distributions, flags patterns that lose jury points,
// checks the Developer-Award basics, and writes screenshots + a contact sheet for critique.
//
// Usage (from the project root, where playwright is installed):
//   npm i -D playwright && npx playwright install chromium
//   node <skill>/scripts/audit.mjs http://localhost:5173 [--out .sotd-audit] [--pages /,/about]
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(path.join(process.cwd(), 'noop.js'))
let chromium
try { ({ chromium } = require('playwright')) } catch {
  console.error('playwright not found in this project. Run: npm i -D playwright && npx playwright install chromium'); process.exit(1)
}
const SKILL = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const B = JSON.parse(fs.readFileSync(path.join(SKILL, 'data/benchmarks.json'), 'utf8'))
const args = process.argv.slice(2)
const url = args.find((a) => /^https?:/.test(a)) || 'http://localhost:5173'
const outDir = path.resolve(args[args.indexOf('--out') + 1] && args.includes('--out') ? args[args.indexOf('--out') + 1] : '.sotd-audit')
const pages = args.includes('--pages') ? args[args.indexOf('--pages') + 1].split(',') : [url] // default: exactly the URL given (keeps subpaths)
// --before "<js>": run in the page before measuring (e.g. scroll a transformation to its final state)
const before = args.includes('--before') ? args[args.indexOf('--before') + 1] : null
fs.mkdirSync(outDir, { recursive: true })
const GPU = ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']
const report = []
const R = (s = '') => report.push(s)
let fails = 0, warns = 0
const FAIL = (m) => { fails++; R(`- ❌ ${m}`) }
const WARN = (m) => { warns++; R(`- ⚠️ ${m}`) }
const PASS = (m) => R(`- ✅ ${m}`)
const pctl = (v, d) => (v < d.p10 ? '<p10' : v < d.p25 ? 'p10–25' : v < d.p50 ? 'p25–50' : v < d.p75 ? 'p50–75' : v < d.p90 ? 'p75–90' : '>p90')

const PROBE = () => {
  const vw = innerWidth, vh = innerHeight
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const items = []; let n
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue
    const el = n.parentElement; const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    const r = el.getBoundingClientRect(); if (r.width <= 1 || r.height <= 1) continue // skip sr-only / clipped text
    items.push({ t, fs: parseFloat(cs.fontSize), ff: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), fw: cs.fontWeight, ls: parseFloat(cs.letterSpacing) || 0, lh: parseFloat(cs.lineHeight) || null, tt: cs.textTransform, fst: cs.fontStyle, top: r.top + scrollY, vt: r.top, op: +cs.opacity, len: t.length })
  }
  const fold = items.filter((i) => i.vt < vh && i.vt + i.fs > 0)
  const hero = fold.slice().sort((a, b) => b.fs - a.fs)[0] || null
  const longs = items.filter((i) => i.len > 60).map((i) => i.fs).sort((a, b) => a - b)
  const body = longs[Math.floor(longs.length / 2)] || null
  const fams = {}; for (const i of items) fams[i.ff] = (fams[i.ff] || 0) + i.len
  const maxFs = Math.max(0, ...items.map((i) => i.fs))
  const all = [...document.querySelectorAll('body *')]
  // rounded "feature card" grids: >=3 siblings, similar size, radius>=12, shadow or border
  let cardGrids = 0
  for (const parent of new Set(all.map((e) => e.parentElement))) {
    if (!parent) continue
    const kids = [...parent.children].filter((k) => { const cs = getComputedStyle(k); const r = k.getBoundingClientRect(); return parseFloat(cs.borderRadius) >= 12 && (cs.boxShadow !== 'none' || cs.borderStyle !== 'none' || cs.backgroundColor !== 'rgba(0, 0, 0, 0)') && r.width > 180 && r.height > 140 && r.width < vw * 0.5 })
    if (kids.length >= 3) { const w = kids.map((k) => Math.round(k.getBoundingClientRect().width / 10)); if (new Set(w).size <= 2) cardGrids++ }
  }
  const gradients = all.filter((e) => { const b = getComputedStyle(e).backgroundImage; return /(^|, )(linear|radial|conic)-gradient/.test(b) && !/^repeating-/.test(b) && e.getBoundingClientRect().width > vw * 0.4 }).length
  const purpleGrad = all.some((e) => { const b = getComputedStyle(e).backgroundImage; return /gradient/.test(b) && /rgb\((1[0-9][0-9]|[6-9][0-9]), ([0-9]{1,2}|1[0-4][0-9]), (2[0-5][0-9]|1[89][0-9])\)/.test(b) })
  const text = document.body.innerText
  const emoji = (text.match(/\p{Emoji_Presentation}/gu) || []).length
  const lorem = /lorem ipsum|dolor sit amet|\[placeholder\]|placeholder text|your (company|logo|brand|headline) here|insert .{1,20} here|todo:/i.test(text)
  const h1 = document.querySelector('h1')
  const h1cs = h1 && getComputedStyle(h1)
  const heroButtons = h1 ? [...document.querySelectorAll('a,button')].filter((b) => { const r = b.getBoundingClientRect(); return r.top < vh && r.top > h1.getBoundingClientRect().bottom - 10 && r.width > 100 && r.height > 36 }).length : 0
  const centeredHeroCTA = !!h1 && h1cs.textAlign === 'center' && heroButtons >= 2
  const imgsNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length
  const unnamed = [...document.querySelectorAll('a,button')].filter((b) => !(b.innerText.trim() || b.getAttribute('aria-label') || b.getAttribute('title') || b.querySelector('img[alt]:not([alt=""]),svg[aria-label],[aria-label]'))).length
  const hiddenText = items.filter((i) => i.op === 0 && i.len > 3 && i.vt < vh && i.vt > -i.fs).length
  const meta = { title: document.title, description: !!document.querySelector('meta[name=description]'), og: !!document.querySelector('meta[property="og:image"]'), lang: document.documentElement.lang, viewport: !!document.querySelector('meta[name=viewport]'), h1s: document.querySelectorAll('h1').length, main: !!document.querySelector('main'), nav: !!document.querySelector('nav') }
  const canv = [...document.querySelectorAll('canvas')].map((c) => { const r = c.getBoundingClientRect(); return (r.width * r.height) / (vw * vh) })
  return {
    hero: hero && { fs: hero.fs, vw: +(hero.fs / vw * 100).toFixed(2), ff: hero.ff, fw: hero.fw, lsEm: +(hero.ls / hero.fs).toFixed(3), lh: hero.lh ? +(hero.lh / hero.fs).toFixed(2) : null, upper: hero.tt === 'uppercase', italic: hero.fst === 'italic', text: hero.t.slice(0, 80) },
    body, scale: body ? +(maxFs / body).toFixed(1) : null, families: Object.entries(fams).sort((a, b) => b[1] - a[1]).map(([f]) => f),
    italicSerifDisplay: items.some((i) => i.fst === 'italic' && i.fs > 30 && /serif|instrument|playfair|cormorant|garamond|editorial|canela|fraunces/i.test(i.ff)),
    pageViewports: +(document.documentElement.scrollHeight / vh).toFixed(1), cardGrids, gradients, purpleGrad, emoji, lorem, centeredHeroCTA, imgsNoAlt, unnamed, hiddenText, meta,
    webglCover: +Math.max(0, ...canv).toFixed(2), videos: document.querySelectorAll('video').length,
    // a large image / svg in the first viewport also counts as a dominant element
    mediaCover: +Math.max(0, ...[...document.querySelectorAll('img, svg, picture')].map((m) => { const r = m.getBoundingClientRect(); const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)), h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)); return (w * h) / (vw * vh) })).toFixed(2),
    smooth: [...document.documentElement.classList].some((c) => c.startsWith('lenis')) || !!window.lenis,
    gsap: !!window.gsap || [...document.querySelectorAll('[style]')].some((e) => /translate: none; rotate: none; scale: none/.test(e.getAttribute('style'))),
  }
}

const browser = await chromium.launch({ args: GPU })
const shots = []
R(`# SOTD audit — ${url}`)
R(`Benchmarks: ${B.source}. Percentiles are vs. winners (p50 = typical winner).`)
for (const p of pages) {
  const target = new URL(p, url).href
  R(`\n## ${target}`)
  // Desktop
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  const t0 = Date.now()
  await page.goto(target, { waitUntil: 'load', timeout: 45000 })
  const loadMs = Date.now() - t0
  const fcp = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime || null)
  await page.waitForTimeout(3500)
  if (before) { await page.evaluate(before); await page.waitForTimeout(2500); R(`(measured after --before: ${before.slice(0, 80)})`) }
  const m = await page.evaluate(PROBE)
  const slug = p.replace(/\W+/g, '_') || 'home'
  const H = await page.evaluate(() => document.documentElement.scrollHeight)
  const stops = [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1]
  for (const [k, f] of stops.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((H - 900) * f))
    await page.waitForTimeout(1300)
    const file = path.join(outDir, `${slug}-d${k}.jpg`); await page.screenshot({ path: file, type: 'jpeg', quality: 70 }); shots.push(file)
  }
  // frame timing across a real wheel scroll
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600)
  await page.evaluate(() => { window.__f = []; let l = performance.now(); const loop = (t) => { window.__f.push(t - l); l = t; if (window.__rec) requestAnimationFrame(loop) }; window.__rec = true; requestAnimationFrame(loop) })
  for (let y = 0; y < Math.min(H, 9000); y += 100) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16) }
  const frames = (await page.evaluate(() => { window.__rec = false; return window.__f.slice(3) })).sort((a, b) => a - b)
  const p95 = frames[Math.floor(frames.length * 0.95)] || 0
  // keyboard focus visibility on first 6 tab stops
  await page.evaluate(() => window.scrollTo(0, 0))
  let focusVisible = 0, focusTotal = 0
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    const v = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none' })
    if (v !== null) { focusTotal++; if (v) focusVisible++ }
  }
  await ctx.close()

  // Mobile + tablet overflow
  const overflow = {}
  for (const [w, h] of [[390, 844], [360, 780], [768, 1024]]) {
    const mc = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768, deviceScaleFactor: 2 })
    const mp = await mc.newPage()
    await mp.goto(target, { waitUntil: 'load', timeout: 45000 }); await mp.waitForTimeout(2500)
    overflow[w] = await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    const mh = await mp.evaluate(() => document.documentElement.scrollHeight)
    for (const [k, f] of [0, 0.3, 0.65].entries()) {
      await mp.evaluate((y) => window.scrollTo(0, y), Math.round(mh * f)); await mp.waitForTimeout(1100)
      if (w === 390) { const file = path.join(outDir, `${slug}-m${k}.jpg`); await mp.screenshot({ path: file, type: 'jpeg', quality: 70 }); shots.push(file) }
    }
    await mc.close()
  }
  // Reduced motion: is content visible without animation?
  const rc = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const rp = await rc.newPage(); await rp.goto(target, { waitUntil: 'load' }); await rp.waitForTimeout(1500)
  const rmHidden = await rp.evaluate(() => { let n = 0; for (const el of document.querySelectorAll('h1,h2,h3,p,a,img')) { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && +getComputedStyle(el).opacity === 0) n++ } return n })
  await rc.close()

  // ── Report ──
  R('\n### Measurements vs winners')
  if (m.hero) {
    R(`- Largest above-fold type: ${m.hero.fs}px = **${m.hero.vw}vw** (${pctl(m.hero.vw, B.heroTypeVw)}; winners p50 ${B.heroTypeVw.p50}vw, p75 ${B.heroTypeVw.p75}vw, p90 ${B.heroTypeVw.p90}vw) · "${m.hero.text}"`)
    R(`- Hero face ${m.hero.ff} w${m.hero.fw}${m.hero.upper ? ' UPPERCASE' : ''}${m.hero.italic ? ' italic' : ''} · tracking ${m.hero.lsEm}em (winners p25 ${B.heroTrackingEm.p25}, p50 ${B.heroTrackingEm.p50}) · line-height ${m.hero.lh} (winners p25 ${B.heroLineHeight.p25}, p50 ${B.heroLineHeight.p50})`)
  }
  R(`- Body ${m.body}px (winners p50 ${B.bodyPx.p50}) · scale ratio ${m.scale}× (${m.scale ? pctl(m.scale, B.scaleRatio) : '-'}; winners p50 ${B.scaleRatio.p50}×, p75 ${B.scaleRatio.p75}×)`)
  R(`- Families: ${m.families.slice(0, 5).join(', ')} (${m.families.length}; winners p50 ${B.fontFamilies.p50}, p90 ${B.fontFamilies.p90})`)
  R(`- Page length ${m.pageViewports} viewports (winners p50 ${B.pageViewports.p50}) · WebGL canvas cover ${m.webglCover} · video ${m.videos} · smooth scroll ${m.smooth} · GSAP ${m.gsap}`)
  R(`- Load ${loadMs}ms · FCP ${fcp ? Math.round(fcp) + 'ms' : 'n/a'} · scroll frame p95 ${p95.toFixed(1)}ms (${frames.length} frames)`)

  R('\n### Jury-risk patterns (from low-scoring winners and the data)')
  m.cardGrids ? FAIL(`${m.cardGrids} rounded card grid(s) — the strongest "SaaS template" signal in low scorers. Replace with an authored composition.`) : PASS('No rounded feature-card grids')
  m.centeredHeroCTA ? WARN('Centered headline + 2 buttons hero — the generic landing-page opener. Winners open with a world, an object, or type that owns the screen.') : PASS('Hero is not the centered-headline-plus-two-buttons template')
  m.purpleGrad ? FAIL('Purple/blue gradient background detected — top AI-slop tell.') : m.gradients > 1 ? WARN(`${m.gradients} large gradient backgrounds — make sure each one is motivated (light, material, brand), not decoration.`) : PASS('No decorative gradient washes')
  m.emoji ? WARN(`${m.emoji} emoji in page text — winners use bespoke iconography or none.`) : PASS('No emoji')
  m.lorem ? FAIL('Placeholder / lorem / TODO text present.') : PASS('No placeholder copy')
  m.italicSerifDisplay ? WARN(`Italic serif display type: used by only ${(B.adoption.italicSerifDisplay * 100).toFixed(0)}% of winners and correlated with slightly lower scores. It is the default "editorial" move of generated sites — keep only if the concept demands it.`) : PASS('No reflexive italic-serif accent word')
  m.families.length > 3 ? WARN(`${m.families.length} font families — winners use 2 (p50), 3 at most.`) : PASS(`${m.families.length} font families`)
  if (m.hero && m.hero.vw < B.heroTypeVw.p25 && m.webglCover < 0.5 && !m.videos && m.mediaCover < 0.2) WARN(`Largest type is only ${m.hero.vw}vw with no full-screen image/WebGL/video carrying the hero — the first viewport likely lacks a dominant element.`)
  if (m.scale && m.scale < B.scaleRatio.p25) WARN(`Type scale contrast ${m.scale}× is in the bottom quartile of winners — hierarchy will read flat.`)

  R('\n### Developer-award basics (WPO, RWD, markup, a11y)')
  errors.length ? FAIL(`${errors.length} console/page errors: ${errors.slice(0, 3).join(' | ').slice(0, 300)}`) : PASS('No console errors')
  for (const [w, o] of Object.entries(overflow)) o > 1 ? FAIL(`Horizontal overflow ${o}px at ${w}px wide`) : PASS(`No horizontal overflow at ${w}px`)
  rmHidden ? FAIL(`${rmHidden} visible-area elements stay at opacity 0 with prefers-reduced-motion — content must not depend on animation.`) : PASS('Content visible with reduced motion')
  m.hiddenText > 2 ? WARN(`${m.hiddenText} above-the-fold text nodes still at opacity 0 after load — the intro is hiding content.`) : PASS('First viewport fully revealed after load')
  m.imgsNoAlt ? FAIL(`${m.imgsNoAlt} <img> without alt`) : PASS('All images have alt')
  m.unnamed ? WARN(`${m.unnamed} links/buttons without an accessible name`) : PASS('All controls named')
  focusTotal && focusVisible < focusTotal ? WARN(`Focus ring visible on ${focusVisible}/${focusTotal} tab stops`) : PASS('Keyboard focus visible')
  !m.meta.description || !m.meta.og ? WARN(`Metadata: description ${m.meta.description}, og:image ${m.meta.og}`) : PASS('Description + OpenGraph present')
  m.meta.h1s !== 1 ? WARN(`${m.meta.h1s} <h1> elements`) : PASS('Exactly one h1')
  !m.meta.lang ? FAIL('<html lang> missing') : PASS(`lang="${m.meta.lang}"`)
  p95 > 20 ? WARN(`Scroll frame p95 ${p95.toFixed(1)}ms — jank is judged under Animations (15%) and WPO (20%).`) : PASS(`Smooth scroll frames (p95 ${p95.toFixed(1)}ms)`)
}
await browser.close()

// contact sheet (optional, needs python3 + Pillow)
try {
  const { execFileSync } = await import('node:child_process')
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[2:]; d=[f for f in fs if '-d' in f]; m=[f for f in fs if '-m' in f]
W=480; rows=[]
for i in range(0,len(d),4):
  ims=[Image.open(f).resize((W,300)) for f in d[i:i+4]]; r=Image.new('RGB',(W*4+18,300),(20,20,20))
  for k,im in enumerate(ims): r.paste(im,(k*(W+6),0))
  rows.append(r)
if m:
  ims=[Image.open(f) for f in m]; ims=[im.resize((int(im.width*600/im.height),600)) for im in ims]
  r=Image.new('RGB',(W*4+18,600),(20,20,20)); x=0
  for im in ims: r.paste(im,(x,0)); x+=im.width+6
  rows.append(r)
S=Image.new('RGB',(W*4+18,sum(r.height+6 for r in rows)),(20,20,20)); y=0
for r in rows: S.paste(r,(0,y)); y+=r.height+6
S.save(sys.argv[1],quality=78)`, path.join(outDir, 'contact-sheet.jpg'), ...shots])
  R(`\nContact sheet: ${path.join(outDir, 'contact-sheet.jpg')} — LOOK at it and critique against references/12-critique.md before declaring done.`)
} catch { R(`\nScreenshots in ${outDir}`) }
R(`\n**Result: ${fails} fail(s), ${warns} warning(s).** Fails must be fixed. Warnings need a reason rooted in the concept.`)
fs.writeFileSync(path.join(outDir, 'report.md'), report.join('\n'))
console.log(report.join('\n'))
process.exit(fails ? 2 : 0)
