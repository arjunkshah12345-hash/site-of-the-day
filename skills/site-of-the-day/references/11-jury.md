# 11 — The jury: official criteria and the Developer Award

## Site of the Day (awwwards.com/about-evaluation)
- **Design 40% · Usability 30% · Creativity 20% · Content 10%.**
- Each nominee goes to ≥ 18 jurors (designers, developers, art directors, agencies). The 3 scores furthest from the average are discarded. Voting runs 5 days; PRO users' votes count.
- Honorable Mention: jury score ≥ 6.5. SOTD: highest of the day. The **8 highest-scoring sites each month** are re-judged for Site of the Month (user votes carry weight). All SOTMs are nominated for **Site of the Year** (announced in February).
- What a juror does in practice: opens the site on a big screen, watches the intro, scrolls the home page, tries the menu, hovers things, opens 1–2 inner pages, resizes or checks mobile, and scores. First impressions and the home page dominate.

## Developer Award (only SOTD winners are eligible; > 7 wins it)
Weights: **WPO 0.20 · Responsive/Mobile 0.20 · Semantics/SEO 0.20 · Markup/Metadata 0.15 · Animations/Transitions 0.15 · Accessibility 0.10.**

**WPO**: compression; critical rendering path; defer/async scripts; prioritise above-the-fold; minified CSS/JS; optimised, compressed, deferred media (modern formats, responsive images, lazy loading); CDN and caching; fewer redirects, DNS lookups, third parties; no iframes; avoid heavy filters; inline critical SVG; progressive enhancement; **no console logs or errors**; rendering performance; HTTPS/HTTP2; works cross-browser.

**Responsive / Mobile**: flexible grid; flexible media; consistent breakpoints; readable responsive typography; conditional/lazy loading; viewport meta; feature detection; retina assets; proper input for touch; tap target size; responsive navigation patterns; works cross-browser.

**Markup / Metadata**: valid HTML; doctype, lang, charset; title/meta description; OpenGraph/Twitter cards; structured data (schema.org); image alt; favicons/touch icons; minimal meaningful markup.

**Semantics / SEO**: sectioning model (header, nav, main, article, section, footer); one h1 and a real heading outline; descriptive links; clean URLs; sitemap/robots; proper hyperlinks (HTML links, not JS click handlers); 404 handling.

**Animations / Transitions**: "Animations are most useful when they reflect and reinforce the semantic relationships between elements… the entire experience is one continuous space." Consistent strategy across all interactions; smooth, stable frame rate; easing, timing, rhythm, appeal; balance (not too slow/fast/often/different); 2D/3D; math, physics, generative techniques; GPU/memory management, garbage collection, GLSL optimisation; parallax done well; page transitions with history support and a friendly loading UI. Only real-time animation counts (not video).

**Accessibility**: keyboard, mouse and touch input; labelled interactive elements; viewport config; tap target size; focus management and visible focus; logical tab order; one clickable area per link; legible font sizes; colour contrast; **no information only on hover**; text alternatives; captions/transcripts for video with audio; `aria-hidden` on decorative elements; browser history works; WCAG POUR; landmark roles; widget roles; live regions where state changes.

## Implementation checklist (copy into your plan)
- [ ] `<html lang>`, charset, viewport, title, description, OG image (1200×630) + Twitter card, favicon set, theme-color
- [ ] header / nav / main / section / footer, exactly one h1, logical h2/h3
- [ ] all navigation is `<a href>`; buttons are `<button>`; skip link
- [ ] visible `:focus-visible` style that matches the design language
- [ ] content visible with JS off / before JS / with reduced motion
- [ ] images: AVIF/WebP, `width`/`height`, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero
- [ ] fonts self-hosted, subset, preloaded display weight, `font-display: swap`
- [ ] heavy libraries (three.js) code-split; posters before first frame
- [ ] no console errors or warnings; no 404s for assets
- [ ] no horizontal overflow at 360/390/768; tap targets ≥ 44px
- [ ] hover-only information has a touch/keyboard equivalent
- [ ] sound off by default with a visible toggle; video with audio has captions
- [ ] page transitions keep URLs and back/forward working
- [ ] 404 page designed
