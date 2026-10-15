# 03 — Twelve winning archetypes

Each archetype lists real winners (score, Creativity), what makes them work, a structure skeleton, motion, typical stack, and how it fails. Look at the screenshots: `refs/<slug>.jpg`. Query more with `scripts/refs.py`.

---

## 1. Explorable world
*Bruno Simon* (bruno-simon.com, SOTM 2026, 8.11, C8.62) · *Messenger* (messenger.abeto.co, SOTY 2025, 7.92) · *Igloo Inc* (igloo.inc, SOTY 2024) · *Umami Land* (SOTY 2021, 8.23, C8.75) · *Leo Parpeix* (SOTD 2026).
- **Why it wins**: the subject becomes a place with rules; play = memory. Highest Creativity scores in the dataset.
- **Skeleton**: branded loader → "click to start / sound on?" → world with 3–6 discoverable stations → each station opens a DOM panel (real text, links) → persistent minimal HUD (index, sound, exit to plain list).
- **Motion**: physics or eased camera rails; DOM panels slide/clip in; sound design.
- **Stack**: three.js / R3F (+ rapier/cannon for physics), Blender-made assets (glTF + Draco/KTX2), GSAP for camera.
- **Fails when**: no plain-content fallback, controls not explained, 20MB load with a spinner, low-poly default look, mobile unplayable. Always ship a "skip to list" link.

## 2. Object as protagonist
*Lando Norris* (SOTY 2025, 8.18) · *Opal Tadpole* (SOTY 2024) · *Mana Yerba Mate* (SOTY 2023, 8.03) · *Prometheus Fuels* (SOTY 2021, 8.40, C8.94) · *Santioni Spirits* (SOTD 2026, 8.09).
- **Why**: one product/person treated with portrait-level care; everything orbits it.
- **Skeleton**: hero = the object huge, with 2–3 small labels at the edges (not a headline block) → the object transforms or travels through chapters (material, scale, context) → details as annotated callouts → shop/CTA framed as part of the object's world.
- **Motion**: scroll-scrubbed rotation/scale of the object (≤90°), DOM-anchored WebGL so it lands in layout slots; text reveals line by line.
- **Stack**: three.js + GLB from real CAD/Blender, or high-res cut-out photography with layered parallax.
- **Fails when**: the object is generic (a random abstract blob), material looks default (plastic white, chrome), or it floats without composition.

## 3. Type as image (poster)
*Exat typeface* (SOTD 2025) · *Siena Film Foundation* (SOTM 2025, 7.90) · *Champions for Good* (SOTD 2026, hero 22vw) · *The Line Studio* (SOTM 2024) · *KPR* (SOTY 2022) · *Slosh Seltzer* (SOTM 2024) · *Pangram Pangram* (SOTY 2021).
- **Why**: when the name or language is the asset, type at 15–30vw becomes architecture.
- **Skeleton**: one word or name filling the width (fit to container), tiny mono/grotesk labels in the corners, then sections that each put one typographic idea at full scale (a number, a quote, a list).
- **Type**: condensed (Druk-like) or wide display + one neutral text face. Weight 400–500 at huge sizes, tracking −0.02 to −0.05em, line-height 0.8–0.9.
- **Motion**: characters/lines rise through masks; variable-font axis animation on scroll/hover; marquee only if it carries content.
- **Fails when**: the display face is a default (Inter Bold at 120px is not a poster), or every section repeats the same big-word-plus-paragraph pattern.

## 4. Chaptered longform / story
*Flashlights* (SOTD 2025, history of jailhouse lawyers) · *Persepolis Reimagined* (SOTY 2022) · *The Other Side of Truth* (SOTY 2022) · *The Power of Storytelling* (SOTD 2026, 7.87, C8.37) · *Star Atlas* (SOTY 2021).
- **Why**: Storytelling is the strongest top-tier tag (44% of month winners vs 20%).
- **Skeleton**: title card → chapters, each with its own color field and pacing (chapter title huge, period/date, then mixed media: archival image, quote, case file, number) → persistent chapter/timeline navigation (bottom rail or side index) → credits/sources as a designed colophon.
- **Motion**: pinned chapter transitions (color wipe, page turn), images develop/scale in, numbers count, quotes set line by line.
- **Fails when**: wall of text with fade-ins; no navigation to jump chapters; color changes without meaning.

## 5. Index with imagery (portfolio / production / photographer)
*Bennett & Clive* (SOTM 2024, client list as giant type over film) · *Ottografie* (SOTD 2025, 7.75) · *Akaru* (SOTM 2024, 7.91) · *Telescope* (SOTD 2025) · *Fluid Glass* (SOTD 2026).
- **Why**: the work is the material; the composition must make it look curated, not listed.
- **Skeleton**: the index *is* the hero (names as huge stacked type, hovering swaps the full-bleed image/video) → project pages with large media and a narrow metadata column → next-project transition that carries the image.
- **Motion**: hover image swap with clip/scale (400–650ms), page transition where the thumbnail becomes the hero, lists that reorder/filter with FLIP.
- **Fails when**: it's a card grid ("Portfolio" tag: 0% of month winners), or thumbnails are all the same size and rhythm.

## 6. Gesture toy (perform the message)
*Why Zero* (SOTM 2026, "draw a zero") · *Don't Board Me* (SOTY 2024) · *Sephora Pinball* · *Paper Planes* (SOTY 2016).
- **Why**: Gestures/Interaction tag is 2.4× more frequent among month winners.
- **Skeleton**: one instruction in the first viewport ("draw a zero", "throw it", "hold to…") → immediate, satisfying response → the content unlocks/organises around the result → obvious skip.
- **Motion**: physics, springs, input-reactive shaders; sound on response.
- **Fails when**: the gesture is hidden, fiddly on touch, or unrelated to the message.

## 7. Simulated machine / interface
*Shader Development Studio* (SOTD 2026, C8.33: CRT boot) · *Active Theory v6* (SOTM 2024, C8.68: OS + AI chat) · *Active Theory v4* (SOTY 2018).
- **Why**: the site *is* the subject's tool; instantly memorable.
- **Skeleton**: boot/loader that belongs to the machine → a working interface (windows, terminal, dials, timeline) with real content inside → an escape hatch to plain pages.
- **Type**: mono/bitmap or period-correct faces; one display face as the "logo".
- **Fails when**: cosplay without function (a fake terminal that just prints marketing copy).

## 8. Drawing → render (transformation)
*Heron AI* (SOTD 2026: elevation line drawing renders into a shaded building) · *Telkom-OT* (wireframe → solid part) · *Lidar Drone Scanning* (point cloud).
- **Why**: shows the product's value as a visible process; perfect for B2B/tech that otherwise becomes a SaaS template.
- **Skeleton**: line state in the hero → scroll scrubs the transformation (lines → hatch → shaded → photoreal) → annotations explain each stage → the final state frames the CTA.
- **Stack**: SVG stroke-dashoffset for lines, cross-fade to rendered stills, or a shader that interpolates line/shade.
- **Fails when**: the "drawing" is decorative and doesn't relate to the product.

## 9. Illustrated universe
*Mana* (SOTY 2023) · *Santioni Spirits* (8.09, comic-book world) · *Umami Land* · *KPR* · *Maxima Therapy* (SOTD 2025).
- **Why**: Illustration +0.16 Creativity; bespoke characters are unforgettable.
- **Skeleton**: characters/props layered in depth around the product → each section a scene → playful microinteractions on characters.
- **Fails when**: illustrations are generic vector-library people, or style is inconsistent.

## 10. Cinematic reel
*Mario Roudil* · *Chew Productions* · *Dark: Netflix Guide* (SOTY 2020).
- **Why**: when footage is the product. But note: *Video* tag −0.05 overall and *Photo & Video* −0.13 Creativity — reels alone rarely win big. Add an idea (interactive timeline, scrubbable reel, cast as navigation).
- **Skeleton**: full-bleed video with minimal UI at the edges; play/sound controls designed; project index as type.

## 11. Spatial gallery
*Jesper Landberg* (SOTD 2026: curved 3D carousel of projects) · *Lusion v3* (SOTY 2023, 8.25).
- **Why**: turns a list into space; drag/scroll physics feels physical.
- **Skeleton**: WebGL planes on a curve/cylinder/grid with inertia; DOM labels synced; click → plane expands into project page.
- **Fails when**: it's only a carousel with distortion and the projects are weak.

## 12. Technical grid / Swiss data
*KPR* (hairline grid + wide display) · *Heron AI* (hairlines, mono metadata) · *Terminal Industries* (SOTD 2026) · *Flashlights* timeline rail.
- **Why**: structure as aesthetic; credible for engineering/finance/science.
- **Skeleton**: visible hairline grid, mono labels with real data, one huge display element per screen, numbers that matter.
- **Fails when**: the grid is decoration and the data is fake ("99.9% uptime", invented stats). Never fabricate numbers.

---

## Choosing
| Subject | Strong archetypes |
|---|---|
| Product launch / DTC | 2, 9, 6 |
| B2B / AI / dev tool | 8, 7, 12 (never the SaaS template) |
| Agency / studio / designer | 1, 7, 11, 5, 3 |
| Culture / museum / history / NGO | 4, 3, 1 |
| Fashion / photographer / production | 5, 10 (+ an idea), 3 |
| Food & drink | 9, 2, 1 |
| Sport / athlete / music artist | 2 (person as object), 3, 10 |
| Type foundry / publication | 3, 12 |
| Event / festival | 3, 6, 9 |
