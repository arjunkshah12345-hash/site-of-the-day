# 07 — Motion

Winners: GSAP 76%, Lenis 64%, clip-path 73%, split-text reveals on most. The Developer jury scores Animations at 15%: "smooth, fast, stable frame-rate; easings, timings, rhythm, appeal; balance and consistency — not too slow, too fast, too often, too different." Motion must reveal structure and relationships, not decorate.

## One language
Decide before coding:
- **Motion verb** from the concept (develop, boot, pour, slide, unfold, print, magnetize).
- **Three curves** — reveal, move, snap:
```js
// GSAP CustomEase (free) — or use these as CSS cubic-bezier()
CustomEase.create('reveal', '0.16, 1, 0.3, 1')     // text/media entering (expo-out feel)
CustomEase.create('move',   '0.65, 0.05, 0.36, 1') // things travelling (in-out)
CustomEase.create('snap',   '0.32, 0.72, 0, 1')    // UI response
```
- **Durations**: text hover 180–250ms · menu 350–550ms · image crop/hover 400–650ms · line reveals 0.8–1.1s with 0.06–0.12s stagger · page transition 0.7–1.2s · intro sequence ≤ 1.6s total.
- **Budget**: animate the 10% that carries meaning. Static body copy should simply be there.

## Setup: Lenis + GSAP + ScrollTrigger + SplitText (all free since GSAP 3.13)
```bash
npm i gsap lenis
```
```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const lenis = reduce ? null : new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
// anchor links through Lenis
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const t = document.querySelector(a.getAttribute('href')); if (!t || !lenis) return
  e.preventDefault(); lenis.scrollTo(t, { duration: 1.2 })
}))
```
`starter/motion.ts` contains all of this plus the reveal system below, ready to copy.

## Reveals (masked lines)
```js
document.fonts.ready.then(() => {
  document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,         // re-splits on resize/font load
      onSplit: (self) => gsap.fromTo(self.lines, { yPercent: 110 }, {
        yPercent: 0, duration: 1, stagger: 0.08, ease: 'reveal',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    })
  })
})
```
Media reveal: `clip-path: inset(100% 0 0 0)` → `inset(0)` with a slight inner `scale: 1.15 → 1` (`move` ease, 1.1s).

## Gotchas that break real sites (learned the hard way)
- **Use `fromTo` with explicit end values for reveals, plus `clearProps`.** `gsap.from()` records the *current* computed value as the end state; if anything has already set opacity/transform (a CSS transition, a re-init, HMR), elements end invisible.
- **GSAP writes `translate: none; rotate: none; scale: none` inline** on elements it transforms, which silently kills CSS individual-transform properties you use for hovers (`translate`, `scale`). Animate a wrapper with GSAP and hover the child with CSS, or `clearProps: 'transform,translate,rotate,scale'` on complete.
- **Initial hidden states only from JS.** Never `opacity: 0` in CSS for content; if JS fails or reduced-motion is on, content must be visible.
- **`position: sticky` and `fixed` create stacking contexts**; `transform`/`filter`/`contain`/`will-change: transform` on an ancestor turns a `position: fixed` child into an absolutely-positioned one. Plan your layers (fixed WebGL canvas, sticky stages, overlays) before building.
- **Pinned/scrubbed sections**: build tweens with function-based values measured from *layout* (`offsetLeft/Width`), not `getBoundingClientRect()` (which includes current transforms). On resize: `tl.progress(0); tl.invalidate();` then restore progress.
- **One rAF**: drive everything (Lenis, WebGL, scroll-linked state) from `gsap.ticker`. Never set React state per frame.
- **Smooth the scroll value you scrub with** (`p += (target - p) * (1 - Math.exp(-dt * 9))`) for buttery scrub that still reverses correctly.

## Preloader (54% of winners have one)
A brand moment, not a spinner: counter that drives a glyph, a boot sequence, a line drawing itself, the logo assembling.
- Show for real loading only (fonts + critical media + scene), min 0.6s, max ~2s; then reveal with the intro.
- Skip on repeat visits (`sessionStorage`) and for reduced motion.
- Never block the browser's first paint of meaningful HTML longer than needed; keep text in the DOM underneath.

## Page transitions (Transitions tag is common; Barba 7%, but modern sites use View Transitions)
```css
/* multi-page sites: cross-document view transitions */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: 500ms cubic-bezier(.65,.05,.36,1) both fade-out; }
::view-transition-new(root) { animation: 700ms cubic-bezier(.16,1,.3,1) both clip-in; }
@keyframes clip-in { from { clip-path: inset(100% 0 0 0) } to { clip-path: inset(0) } }
/* shared element: the clicked project image becomes the next hero */
.project-thumb.is-active, .project-hero { view-transition-name: project-media; }
```
SPA: `document.startViewTransition(() => router.navigate(href))`. Always update the URL and keep back/forward working.

## Hover vocabulary (pick 2–3, use consistently)
- Text roll (two stacked copies, swap through a mask, 220ms).
- Underline draw from the left, retract to the right.
- Image crop/scale change inside a fixed frame (550ms, `move`).
- Index list → full-bleed image swap behind the list.
- Magnetic pull for 1–2 primary controls only.
Touch: map hover states to `:active` or in-view (IntersectionObserver at 0.6 ratio).

## Custom cursor (50% of winners have a cursor element; only 2.5% hide the system cursor)
Use it for *context* (labels: "drag", "play", "view"; a crosshair over a drawing tool), keep the system cursor visible, disable on touch, and never lag it more than ~80ms.
```js
const c = document.querySelector('.cursor'); let x = 0, y = 0, cx = 0, cy = 0
addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY })
gsap.ticker.add(() => { cx += (x - cx) * .25; cy += (y - cy) * .25; c.style.transform = `translate(${cx}px,${cy}px)` })
```

## Scroll choreography patterns
- **Lights down between plates.** When a fixed layer (WebGL field, background scene) re-arranges per sticky chapter, only switch layouts once the chapter's stage is *pinned* (stage top ≤ ~6% of viewport); while a chapter is scrolling in or out, dim the fixed layer to near-ground. Otherwise arriving text sits on top of the previous chapter's imagery. Compute layout targets where the plot *will be* when pinned (`plotRect.top − stickyRect.top`), not where it is mid-scroll.
- **Pinned stage with scrubbed timeline** (transformation, object travel, chapter change). Use CSS `position: sticky` inside a tall section and compute progress yourself, or ScrollTrigger `pin: true, scrub: true`.
- **Horizontal section** only when content is a sequence (timeline, filmstrip).
- **Parallax**: small (±5–8%) and on media only.
- **Counters** only for real numbers.
- **Marquee** only if the moving text is content (a list of clients, a manifesto), and pause on hover/reduced motion.

## Sound (Sound-Audio +0.17 Creativity)
Off by default, visible toggle with state, short UI sounds (≤150ms) and one ambient bed; respect `prefers-reduced-motion` as a hint to keep it off.

## Reduced motion
Keep layout and state changes, drop travel: crossfades ≤ 200ms, no parallax, no scrub-linked transforms of large elements, no autoplaying loops. Test it (the audit does).
