# 01 — The evidence

## Method (October 2026)
1. Scraped every Site of the Year (53, 2011–2025), every Site of the Month (156) and 20 pages of Sites of the Day (599, 2025–2026) from awwwards.com: jury sub-scores, overall score, tags, palette, agency, description, live URL. → `data/winners.json`
2. Loaded every live site in Chromium (real GPU) at 1440×900, waited for intros, captured hero + two scroll frames (+ mobile for month/year winners), and measured: libraries in use, canvas coverage, video, fonts (by rendered character volume), the largest above-fold type (size, weight, tracking, leading, case), body size, scale ratio, background luminance, page length, custom cursor, preloader, blend modes, clip-path, sticky, nav links, mobile overflow. 762 loaded; 729 alive. → `data/benchmarks.json`, `refs/*.jpg`
3. Viewed contact sheets of the top 36 and bottom 12 recent winners and all Year winners side by side.
4. Read the official evaluation system and the Developer Award guidelines (`11-jury.md`).

## The jury
- Weights: Design 40%, Usability 30%, Creativity 20%, Content 10%. ≥18 jurors; the 3 scores furthest from the mean are discarded. Honorable Mention ≥ 6.5. SOTD = best of the day. The 8 highest-scoring sites of a month are re-judged for SOTM; all SOTMs are nominated for SOTY.
- Mean sub-scores: SOTY D8.08 U7.57 C8.25 Ct8.01 (7.95) · SOTM D7.97 U7.46 C8.19 Ct7.94 (7.86) · SOTD D7.44 U7.14 C7.54 Ct7.45 (7.37).
- **Usability is always the lowest sub-score** (Creativity − Usability ≈ +0.48 on average). Juries forgive some friction for invention — but top winners still have higher Usability than day winners (+0.26 same era). Don't use "experimental" as an excuse for broken.
- Correlation of sub-score with overall: Design 0.92, Creativity 0.83, Content 0.83, Usability 0.75.
- SOTD quintiles: top 20% ≥ 7.51, bottom 20% ≤ 7.25. The whole field is compressed; small craft differences decide it.

## Same-era tag comparison (2024+, month/year winners vs day winners)
| Tag | Month/Year | Day | Lift |
|---|---|---|---|
| Storytelling | 44.4% | 20.0% | 2.2× |
| Gestures / Interaction | 22.2% | 9.3% | 2.4× |
| Art & Illustration | 25.0% | 11.7% | 2.1× |
| Games & Entertainment | 16.7% | 4.8% | 3.4× |
| Colorful | 33.3% | 19.7% | 1.7× |
| Scrolling | 33.3% | 19.5% | 1.7× |
| Filters and Effects | 13.9% | 7.8% | 1.8× |
| Clean | 5.6% | 24.4% | 0.23× |
| Minimal | 2.8% | 10.7% | 0.26× |
| Figma (built) | 2.8% | 14.5% | 0.19× |
| Portfolio / Gallery | 0% | 23.5% / 10.4% | 0 |
n = 36 vs 599: directional, not precise.

## Tag effect on Creativity score within 2024+ (n=635)
Up: Unusual Navigation +0.20, Blender +0.19, Sound-Audio +0.17, Games +0.17, Illustration +0.16, Filters & Effects +0.14, Experimental +0.12, Storytelling +0.12, WebGL +0.12, Gestures +0.11, 3D +0.11.
Down: Clean −0.14, Minimal −0.14, Figma −0.14, Javascript (generic) −0.13, Photo & Video −0.13, Wordpress −0.12, Sanity −0.11, Big Background Images −0.11, CSS −0.10, E-Commerce −0.10, Business & Corporate −0.08, Luxury −0.08, Typography −0.07.

## Live measurements (589 alive winners, 2024–2026)
| Signal | Value |
|---|---|
| GSAP | 76% |
| Lenis smooth scroll | 64% |
| three.js | 43% |
| Canvas covering >50% of viewport | 54% (fixed full-screen canvas 13%) |
| Video on page | 51% |
| Custom cursor element | 50% (but `cursor:none` only 2.5% — the system cursor stays) |
| Preloader element | 54% |
| clip-path in use | 73% · mix-blend-mode 52% · position:sticky 46% |
| Webflow 21% · Nuxt 19% · Next 18% · WordPress 9% · Barba 7% · Astro 6% · Framer 2% |
| Dark background 44% · light 47% |
| Largest above-fold type | p25 3.3vw · **p50 5.7vw** · p75 9.6vw · p90 15vw (px: p50 82, p75 138, p90 216) |
| Hero weight | 400: 48% · 500: 15% · 700: 15% · 300: 6% · 600: 5% · 900: 4% |
| Hero uppercase | 33–45% |
| Hero tracking | p10 −0.05em · p25 −0.03em · p50 −0.01em (53% negative) |
| Hero line-height | p10 0.80 · p25 0.88 · p50 1.00 |
| Body text | p50 16px (p75 20px) |
| Scale ratio max/body | p25 3.8× · p50 6.7× · p75 11.6× · p90 17.8× |
| Font families | p50 2 · p90 3 |
| Mono face present | 26% |
| Italic serif display | 7.6% (and −0.04 score vs without) |
| Page length | p25 1 viewport (single-screen experiences!) · p50 7.3 · p75 13.5 · p90 22 |
| Header nav links | p50 4 · menu button 44% |

Most-used families (rendered volume, recent): PP Neue Montreal (≈45 sites across spellings), Inter, Geist + Geist Mono, Suisse Intl, Aeonik, IBM Plex Mono, DM Mono, Helvetica Now, Neue Haas Grotesk, Switzer, Manrope, Roobert, Instrument Sans, Editorial New, Druk, Mona Sans.

## Score effects of features (recent, with vs without)
Fullscreen WebGL +0.04 · preloader +0.03 · three.js +0.03 · dark bg +0.02 · custom cursor +0.01 · GSAP +0.01 · Lenis −0.01 · Next.js −0.05 · Nuxt +0.09 (studio-built sites) · italic serif −0.04 · page >8 viewports −0.03.
**Read this as: none of it matters much.** Concept-level tags move scores 3–5× more than any technology.

## Palettes (Awwwards-listed, 734 sites)
2 colors: 80% · 1 color: 15% · 3+: 5%. 51% of all listed colors are neutrals; 35% of sites have **no** saturated color. Accent hues cluster at red/orange/yellow (0–60°, 45%) and teal/blue (150–240°, 25%). Purple (270–300°) is the rarest hue among winners.

## What the screenshots show (qualitative)
- Every top site has one idea specific to its subject; you can name it in five words ("draw a zero", "a CRT boot screen", "a drawing that renders", "the client list as giant type over film", "a tiny planet you deliver mail on").
- The material is bespoke: real portraits and a signature (Lando Norris), commissioned illustration (Mana, Santioni), Blender worlds (Messenger, Leo Parpeix), the typeface itself (Exat), archival photography (Flashlights), architectural drawings (Heron AI).
- Long branded preloaders are common on WebGL worlds (Lusion counter-morph, Messenger envelope, Shader BIOS bar). They are part of the concept, not a spinner.
- Several top sites are a single screen (Siena, Why Zero, Bruno Simon) — depth over length.
- The bottom of the field: bento cards, generic agency templates, soft gradients with serif-italic accents, shop grids, contact-form pages.

## Caveats
- Month/Year lists go back to 2011, Day sample is 2025–26: cross-tier comparisons were redone same-era. Year-winner n is small.
- Library detection is heuristic (globals, script URLs, DOM fingerprints); bundled libraries can hide. "Splitting" detection was too noisy and is omitted.
- Heavy WebGL sites often still showed preloaders after 5s; their type metrics are underrepresented.
- Correlations are small and observational. Use them to avoid traps, not as formulas.
