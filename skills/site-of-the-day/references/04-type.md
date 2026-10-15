# 04 — Typography

## Measured targets (589 winners, 1440px viewport)
| | p25 | p50 | p75 | p90 | Aim |
|---|---|---|---|---|---|
| Largest above-fold type (vw) | 3.3 | 5.7 | 9.6 | 15 | ≥ 8vw unless an image/scene dominates |
| Largest type (px @1440) | 48 | 82 | 138 | 216 | |
| Scale ratio max/body | 3.8× | 6.7× | 11.6× | 17.8× | ≥ 8× |
| Hero tracking (em) | −0.03 | −0.01 | 0 | | −0.02 … −0.05 for grotesks ≥ 80px |
| Hero line-height | 0.88 | 1.00 | 1.05 | | 0.8–0.92 for multi-line display |
| Body px | 14 | 16 | 20 | 26 | 16–19, line-height 1.4–1.55 |
| Families | 1 | 2 | 3 | 3 | 2 |

Hero weight among winners: **400 = 48%**, 500 = 15%, 700 = 15%. Big + regular reads expensive; big + bold reads like a slide deck. Uppercase heroes: ~⅓.

## What winners actually set (most-used families, recent)
PP Neue Montreal (by far #1), Inter, Geist + Geist Mono, Suisse Intl, Aeonik, IBM Plex Mono, DM Mono, Helvetica Now Display, Neue Haas Grotesk, Switzer, Roobert, Manrope, Instrument Sans, Editorial New, Druk (condensed), Mona Sans, ABC Diatype, TWK Lausanne, NB International, Big Caslon. A mono appears on 26% of winners — as metadata, never as body.

Note what's *rare*: italic serif display (7.6%), Space Grotesk, Poppins/Montserrat headline stacks, three-family "editorial kits".

## Free faces mapped to winner faces
All below are free for commercial use (Google Fonts / Fontshare / OFL). Self-host with `@fontsource` or download; preload the display weight.

| Role | Winner face | Free near-equivalent |
|---|---|---|
| Neo-grotesk text/display | Neue Montreal, Suisse Intl, Helvetica Now, Neue Haas | **Inter Tight**, **Host Grotesk**, **Switzer** (Fontshare), **Geist**, Hanken Grotesk, Instrument Sans |
| Geometric-humanist | Aeonik, Roobert, Diatype | **General Sans**, **Satoshi** (Fontshare), Manrope, DM Sans |
| Condensed display | Druk, Druk Condensed, Steelfish | **Anton**, **Big Shoulders Display**, **Archivo** (wdth 62), **Mona Sans** (wdth 75), Tanker (Fontshare), Bebas Neue |
| Wide display | Druk Wide, PP Monument Extended | **Unbounded**, **Panchang** (Fontshare), **Mona Sans** / **Hubot Sans** expanded, Archivo (wdth 125) |
| Characterful grotesk | FK Grotesk, Lay Grotesk, Die Grotesk | **Familjen Grotesk**, **Bricolage Grotesque**, **Funnel Display**, Cabinet Grotesk |
| Mono metadata | Geist Mono, Supply Mono, Plex Mono, DM Mono | **Geist Mono**, **JetBrains Mono**, **DM Mono**, **Martian Mono**, Fragment Mono |
| Serif (only if the concept needs it) | Editorial New, Big Caslon, Canela | **Newsreader**, **Fraunces** (opsz), Zodiak/Gambetta (Fontshare) |

**Default if nothing else is decided**: one grotesk with a width or optical axis (Mona Sans / Archivo / Inter Tight) used at two extremes + one mono for metadata. That alone puts you inside the winner distribution.

Variable width/weight axes are a creative tool: animate `font-variation-settings` / `font-stretch` on scroll or hover (Exat, Pangram).

## Rules
1. **One display decision, made huge.** The display face appears at one or two sizes only, and at least one is ≥ 8vw (or fitted to the container width).
2. **Set display type tight.** `letter-spacing: -0.03em; line-height: .88;` — then check descender/ascender collisions and use masks with padding.
3. **Regular weight first.** Reach for 400–500 at huge sizes; save 700+ for condensed faces or small caps labels.
4. **Metadata has its own voice**: 10–12px mono or small caps, +0.04–0.1em tracking, uppercase or not, always aligned to the grid. It's where real data lives (dates, coordinates, counts, credits).
5. **Fit text to width when the word is the image.** CSS `font-size: clamp()` gets close; for exact fit measure once:
```js
// fit a single-line element exactly to its container width
function fit(el) {
  el.style.fontSize = '100px'
  const ratio = el.parentElement.clientWidth / el.scrollWidth
  el.style.fontSize = `${100 * ratio}px`
}
document.fonts.ready.then(() => document.querySelectorAll('[data-fit]').forEach(fit))
addEventListener('resize', () => document.querySelectorAll('[data-fit]').forEach(fit))
```
   Or SVG `<text>` with a viewBox from `getBBox()` (pixel-exact, scales with CSS width).
6. **Body copy is short and big enough**: 16–19px, max 60ch, high contrast. Juries read.
7. **Mobile is a separate typographic edition**: re-break lines by hand (`<br class="d">` / spans per breakpoint), change alignment, don't just scale down. Display on mobile is often bigger relative to width (15–25vw).
8. **No faux styles** (synthetic bold/italic). Load the real files. `font-display: swap` + preload the display face; avoid layout shift by sizing containers.
9. **Numbers**: tabular figures for data (`font-variant-numeric: tabular-nums`), oldstyle only in editorial serif text.
10. **Accent word in italic serif**: only when the concept requires a second voice (a quote, a signature, a historical source). Not as decoration.

## Fluid scale (starting point)
```css
:root {
  --fs-meta: 11px;
  --fs-body: clamp(16px, 0.9rem + 0.25vw, 19px);
  --fs-h3: clamp(22px, 1.2rem + 1vw, 36px);
  --fs-h2: clamp(40px, 2rem + 3.6vw, 96px);
  --fs-display: clamp(64px, 11vw, 240px);   /* hero; push to 15–25vw for type-as-image */
}
.display { font-size: var(--fs-display); font-weight: 400; letter-spacing: -0.045em; line-height: .86; }
.meta { font: 400 var(--fs-meta)/1.4 var(--mono); letter-spacing: .06em; text-transform: uppercase; }
```
