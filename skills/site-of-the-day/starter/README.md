# starter/

Production primitives, not a template. Copy the files you need into the project.

- `motion.ts` — Lenis + GSAP (ScrollTrigger, SplitText, CustomEase) wired to one ticker; declarative reveals (`data-reveal="lines|fade|clip"`), parallax, anchor scrolling, `stageProgress()` for pinned/sticky scrubbed sections (smoothed, reversible, resize-safe), `preload()` brand-moment loader, `contextCursor()`. Respects reduced motion. `npm i gsap lenis`
- `webgl-stage.ts` — one fixed three.js canvas whose objects are fitted into DOM layout slots every frame (`stage.place(obj, rectOf(el))`), rect interpolation for scroll journeys, WebGL probe + context-loss fallback, disposal. `npm i three`, load with `import()`.
- `base.css` — reset, focus ring, reduced-motion, masks, grain overlay, skip link.

They encode the gotchas in `references/07-motion.md` (fromTo + clearProps, GSAP vs CSS individual transforms, stacking contexts, one ticker).
