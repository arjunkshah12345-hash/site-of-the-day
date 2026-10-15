# 05 — Color

## Measured
- Awwwards-listed palettes: **2 colors 80%**, 1 color 15%, 3+ 5%.
- 51% of listed colors are neutrals; **35% of winners have no saturated color at all**.
- Dark backgrounds 44%, light 47% — neither is "more premium".
- Accent hue clusters: red/orange/yellow 0–60° (≈45% of saturated accents), teal/cyan/blue 150–240° (≈25%). Purple 270–300° is the rarest.
- Real winner pairs: Lando Norris `#D2FF00 / #111112` · Lusion `#1A2FFB / #F0F1FA` · Mana `#FFD372 / #F15B40` · Siena `#000000 / #FAF7EF` · Champions for Good `#23002B / #E894FF` · Flashlights `#F1EADA / #DF4359` · Heron AI `#F15534 / #282828` · Why Zero `#FFFFFF / #01C654` · Exat `#1C1D1E / #EEEFEB` · Slosh `#FFC1FF` (one color!) · KPR `#6D64A3`.

## Rules
1. **Two colors**: a ground and an ink. Pick them from the subject (the product's material, the brand's history, a photograph's dominant tone), not from a palette generator.
2. **Off-whites and off-blacks**, never `#fff` on `#000` for large fields: warm paper `#F1EADA`, `#FAF7EF`, `#F5F0EB`; cool paper `#F0F1FA`, `#EEEFEB`; inks `#111112`, `#181716`, `#1C1D1E`, `#0E0E0E`.
3. **The accent is an event.** One saturated color, used on ≤ 5% of pixels, always meaning the same thing (live state, the signature, the active chapter, the CTA). Lando's lime appears on the signature, the store button and a final full-screen flash — nowhere else.
4. **Or go monochrome-saturated**: an entire page in one strong color with ink (Slosh pink, KPR violet, Flashlights' per-chapter fields). Commit to the field; don't tint it with gradients.
5. **Chapter colors** (longform): each chapter one flat field from a defined set of 3–5, transitions as hard wipes. Color = navigation.
6. **Photography carries color.** If you have rich imagery, keep UI neutral.
7. **Gradients only when they are light or material** (light through glass, sky, a heat map of real data). Never purple→blue decorative washes, never mesh blobs behind text.
8. **Contrast**: body text ≥ 4.5:1, large text ≥ 3:1. Test grey metadata on the actual background.
9. **Dark mode by concept, not by default.** Dark grounds suit light-emitting subjects (film, night, screens, WebGL glow); light grounds suit paper, product, editorial.

## Recipe
```css
:root {
  --ground: #F1EADA;   /* from the subject */
  --ink: #161514;
  --ink-2: color-mix(in oklab, var(--ink) 55%, var(--ground)); /* metadata */
  --hair: color-mix(in oklab, var(--ink) 18%, transparent);
  --event: #DF4359;    /* the one accent; document what it means */
}
```
