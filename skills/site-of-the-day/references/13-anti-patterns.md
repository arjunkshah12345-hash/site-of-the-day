# 13 — Anti-patterns

## From the lowest-scoring winners (7.15–7.20, bottom of the SOTD field)
| Site (score) | What it does | Instead |
|---|---|---|
| Eddie (7.18) — "bento grids, 3D animation, boxy, friendly design" | rounded feature cards, soft 3D blobs, SaaS rhythm | archetype 8 (drawing → render) or 2 (the charger as object) |
| Glitch & Grit (7.17) | "Thoughtful, intentional & scalable" headline → services list → client wall | the work as the hero (archetype 5), a voice |
| Microsoft AI (7.16) | "Humanist *Superintelligence*" serif-italic on a soft gradient | a mechanism that demonstrates the claim |
| DaVincii (7.15) | ornamental dial + "Where *Intelligence* Becomes Living" | concrete subject material, real data |
| Normal is Boring (7.17) | ultralight italic serif + stock-feel interiors + cookie banner over the hero | one bold idea about the spaces; banner never covers the first impression |
| Yucca Packaging (7.17) | standard shop grid with filters | product as protagonist, then the shop |
| SSTR (7.17) | contact-form page as showcase | — |

## What AI-generated "award" sites do (and juries recognise instantly)
- **The editorial-kit reflex**: Space Grotesk / Inter + Instrument Serif *italic accent word* + IBM Plex Mono labels, warm off-white paper, one vermilion/orange accent, "Fig. 01" captions, "(01) Chapter" markers, crop marks, grain. Each piece is fine; together it's the most common generated look of 2025–26. Italic serif display: 7.6% of winners, slightly lower scores.
- **Abstract object without a subject**: a procedural sculpture / glass blob / chrome shape that doesn't come from the client's world.
- **Manifesto sections**: "We don't think X is finished." Big statements about the studio instead of showing the work.
- **Every section = huge headline + small paragraph + image**, repeated.
- Centered hero, gradient background, two pill buttons, logo wall, three feature cards, testimonial slider, stats row, FAQ accordion, CTA band, four-column footer.
- Fake specificity: invented clients, invented numbers, "Est. 2026", lorem in captions.
- Effects with no reason: cursor blobs, magnetic everything, noise everywhere, marquee of adjectives, horizontal scroll for no sequence.
- Motion everywhere at the same speed, or long intros with no skip.
- Mobile as an afterthought (desktop shrunk, overlapping text, hover-only content).

## Craft failures that cost Usability/Developer points
- Content invisible until JS animation runs (fails reduced motion, slow devices, crawlers).
- Scroll hijacking that fights the wheel/trackpad; snapping that traps.
- Preloader > 3s with no progress, or on every navigation.
- Console errors, missing alt, unlabeled icon buttons, no focus style.
- Horizontal overflow on phones; text colliding at intermediate widths (1024, 768).
- Jank from per-frame React state, layout thrash (`getBoundingClientRect` storms), huge un-compressed textures.
- Cookie/consent banners covering the hero on first load (design it small, bottom corner).
