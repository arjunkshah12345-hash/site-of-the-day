/**
 * SOTD motion system — Lenis + GSAP (ScrollTrigger, SplitText, CustomEase).
 * Framework-agnostic. Copy into your project:  npm i gsap lenis
 *
 *   import { initMotion } from './motion'
 *   const motion = initMotion()          // call once after the DOM exists
 *   motion.destroy()                      // on unmount / HMR
 *
 * Declarative reveals (content is visible without JS; hidden states are set by JS only):
 *   <h2 data-reveal="lines">…</h2>        masked line reveal (SplitText, re-splits on resize)
 *   <p data-reveal="fade">…</p>            rise + fade
 *   <figure data-reveal="clip">…</figure>  clip-path wipe with inner scale
 *   data-reveal-delay="0.2"  data-reveal-start="top 80%"
 * Parallax:  <img data-parallax="8">       (±8% yPercent across the viewport pass; media only)
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('reveal', '0.16, 1, 0.3, 1')
CustomEase.create('move', '0.65, 0.05, 0.36, 1')
CustomEase.create('snap', '0.32, 0.72, 0, 1')

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const CLEAR = 'transform,translate,rotate,scale,opacity,clipPath'

export interface Motion {
  lenis: Lenis | null
  scrollTo: (target: string | Element | number) => void
  refresh: () => void
  destroy: () => void
}

export function initMotion(root: ParentNode = document): Motion {
  const reduce = prefersReducedMotion()
  const lenis = reduce ? null : new Lenis({ lerp: 0.1 })
  const onTick = (t: number) => lenis?.raf(t * 1000)
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('has-smooth')
  }

  const scrollTo = (target: string | Element | number) => {
    if (lenis) lenis.scrollTo(target as never, { duration: 1.2 })
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
    else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView()
  }
  const onAnchor = (e: Event) => {
    const a = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
    if (!a || a.getAttribute('href') === '#') return
    const t = document.querySelector(a.getAttribute('href')!)
    if (!t) return
    e.preventDefault()
    scrollTo(t)
    history.pushState(null, '', a.getAttribute('href'))
    ;(t as HTMLElement).focus?.({ preventScroll: true })
  }
  document.addEventListener('click', onAnchor)

  const splits: SplitText[] = []
  const ctx = gsap.context(() => {
    if (reduce) return
    const start = (el: Element) => (el as HTMLElement).dataset.revealStart || 'top 85%'
    const delay = (el: Element) => parseFloat((el as HTMLElement).dataset.revealDelay || '0')

    root.querySelectorAll('[data-reveal="fade"]').forEach((el) =>
      gsap.fromTo(el, { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, delay: delay(el), ease: 'reveal', clearProps: CLEAR,
        scrollTrigger: { trigger: el, start: start(el), once: true },
      }))

    root.querySelectorAll('[data-reveal="clip"]').forEach((el) => {
      const inner = el.firstElementChild
      const tl = gsap.timeline({ delay: delay(el), scrollTrigger: { trigger: el, start: start(el), once: true } })
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'move', clearProps: 'clipPath' })
      if (inner) tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: 'reveal', clearProps: CLEAR }, 0)
    })

    root.querySelectorAll('[data-parallax]').forEach((el) => {
      const amt = parseFloat((el as HTMLElement).dataset.parallax || '6')
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    document.fonts.ready.then(() => {
      root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
        splits.push(SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'line',
          onSplit: (self) => gsap.fromTo(self.lines, { yPercent: 115 }, {
            yPercent: 0, duration: 1, stagger: 0.08, delay: delay(el), ease: 'reveal',
            scrollTrigger: { trigger: el, start: start(el), once: true },
          }),
        }))
      })
      ScrollTrigger.refresh()
    })
  })

  return {
    lenis,
    scrollTo,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      ctx.revert()
      splits.forEach((s) => s.revert())
      document.removeEventListener('click', onAnchor)
      gsap.ticker.remove(onTick)
      lenis?.destroy()
      document.documentElement.classList.remove('has-smooth')
    },
  }
}

/** Smoothed 0..1 progress of a tall section with a sticky stage inside. Resize-safe, reversible. */
export function stageProgress(section: HTMLElement, onUpdate: (p: number, raw: number) => void, stiffness = 9) {
  let p = 0
  const tick = (_t: number, dtMs: number) => {
    const r = section.getBoundingClientRect()
    const raw = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)))
    p = prefersReducedMotion() ? raw : p + (raw - p) * (1 - Math.exp((-dtMs / 1000) * stiffness))
    if (Math.abs(p - raw) < 0.0004) p = raw
    onUpdate(p, raw)
  }
  gsap.ticker.add(tick)
  return () => gsap.ticker.remove(tick)
}

/** Preloader that is a brand moment, not a gate: real readiness, min/max time, skips on repeat + reduced motion. */
export async function preload(el: HTMLElement | null, ready: Promise<unknown>, { min = 600, max = 2200, key = 'sotd-seen' } = {}) {
  if (!el) return
  if (prefersReducedMotion() || sessionStorage.getItem(key)) { el.remove(); return }
  const t0 = performance.now()
  await Promise.race([ready, new Promise((r) => setTimeout(r, max))])
  const wait = Math.max(0, min - (performance.now() - t0))
  await new Promise((r) => setTimeout(r, wait))
  sessionStorage.setItem(key, '1')
  await gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'move' })
  el.remove()
}

/** Contextual cursor label (keeps the system cursor). <a data-cursor="View">  Disabled on touch. */
export function contextCursor(el: HTMLElement) {
  if (matchMedia('(hover: none)').matches) { el.remove(); return () => {} }
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y
  const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY }
  const over = (e: Event) => {
    const t = (e.target as Element).closest('[data-cursor]') as HTMLElement | null
    el.textContent = t?.dataset.cursor || ''
    el.classList.toggle('is-active', !!t)
  }
  const tick = () => { cx += (x - cx) * 0.25; cy += (y - cy) * 0.25; el.style.transform = `translate3d(${cx}px, ${cy}px, 0)` }
  addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerover', over)
  gsap.ticker.add(tick)
  return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); gsap.ticker.remove(tick) }
}
