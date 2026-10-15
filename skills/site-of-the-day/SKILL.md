---
name: site-of-the-day
description: Build websites at Awwwards Site-of-the-Day / Site-of-the-Month level. Grounded in a measured study of 808 Awwwards winners (53 Sites of the Year, 156 Sites of the Month, 599 Sites of the Day) — their jury scores, tags, palettes, live typography, layout, motion stacks and screenshots — plus the official jury and Developer-Award criteria. Use whenever someone asks for an award-winning, Awwwards-level, "agency-grade", immersive, experimental, portfolio, launch, brand, campaign or product website, or says a site looks generic/templated/AI-made. Ships a reference finder over the 808 winners (with a local screenshot capturer), winner benchmarks, a jury-simulation audit script, and production motion/WebGL primitives.
---

# Site of the Day

You are building something a jury of working designers will score 1–10 on **Design 40%, Usability 30%, Creativity 20%, Content 10%**. A Site of the Day typically lands **~7.4**. Monthly winners land **~7.9**. Year winners **~8.0+**. The difference between them is not effects — it is **one idea, owned completely, made from bespoke material**.

`<skill>` below means the directory containing this SKILL.md (e.g. `~/.claude/skills/site-of-the-day` or `.agents/skills/site-of-the-day`).

Read `references/01-evidence.md` once. It is short, and it will stop you from doing the expensive wrong things.

## What the data says (the five facts that change how you work)

1. **Effects are table stakes, not differentiators.** Among 589 recent winners: GSAP 76%, Lenis smooth scroll 64%, three.js 43%, full-viewport WebGL canvas 54%, video 51%, custom cursor 50%, preloader 54%. None of these moves the score by more than ±0.05. Everyone has them. Do them well; don't expect credit for them.
2. **Creativity is the gap.** Month/Year winners beat Day winners by +0.47 on Creativity and +0.42 on Design (same era). Tags that raise Creativity: *Unusual Navigation* (+0.20), *Blender/3D craft* (+0.19), *Sound* (+0.17), *Games & Entertainment* (+0.17), *Illustration* (+0.16), *Filters & Effects*, *Storytelling* (+0.12). Tags that lower it: *Clean* (−0.14), *Minimal* (−0.14), *Figma*-built (−0.14), *Photo & Video* (−0.13), *Big Background Images* (−0.11), *E-Commerce* (−0.10).
3. **Storytelling is the strongest top-tier signal.** 44% of 2024+ month winners are tagged Storytelling vs 20% of day winners. Gesture-driven interaction 22% vs 9%. Art & Illustration 25% vs 12%. "Clean" 6% vs 24%. "Minimal" 3% vs 11%. Portfolio/Gallery templates: 0% of month winners.
4. **Type is set big, regular weight, tight.** Largest above-fold type: median 5.7vw, top quartile ≥9.6vw, top decile ≥15vw. Most common hero weight is **400** (48%), not bold. Tracking median −0.01em (p10 −0.05em). Line-height median 1.0 (p25 0.88). Two families (p50). Body 16px.
5. **The lowest-scoring winners look exactly like what generators produce by default**: bento/rounded card grids with soft 3D ("Eddie" describes itself as "bento grids, 3D animation, boxy friendly design" — 7.18), agency template (statement → services list → client wall), centered serif headline with an italic accent word on a soft gradient ("Humanist *Superintelligence*" — 7.16; "Where *Intelligence* Becomes Living" — 7.15), shop grids. Italic-serif display type appears on only 7.6% of winners and scores slightly lower. If your first idea looks like that, it is the wrong idea.

## The procedure

Do these in order. Do not skip to code.

### 1. Extract the subject's raw material (10 min)
Before any design, list what is *specific* to this subject: its physical objects, its verbs, its numbers, its history, its sounds, its people, its tools, its failure modes, its vocabulary. Winners are built from this, never from "a hero, features, testimonials". If content is missing, ask or write it — Content is 10% of the score and juries punish filler. See `references/10-copy.md`.

### 2. Find the one idea (the concept)
Write one sentence: **"The site is a ___ where you ___ to ___."** It must be impossible to reuse for another client. Use the concept engine in `references/02-concept.md` (10 proven moves, each with winners: make the metaphor literal, make the user perform the message, turn the subject's tool into the interface, simulate the subject's machine, show the transformation, etc.).
Then pull real references — never design from memory:
```bash
python3 <skill>/scripts/refs.py --any "Food & Drink,E-Commerce" --tier sotm --sheet /tmp/refs.jpg
python3 <skill>/scripts/refs.py --q "architecture" --since 2025 --limit 10
python3 <skill>/scripts/refs.py --list-tags
```
Look at them: screenshots are captured locally on first use (`node <skill>/scripts/capture-refs.mjs --top 120` builds a private library of the best recent winners; `refs.py` prints the exact command for any hits you haven't captured), or open the URLs. Pick 3. Write down what each does that you will *not* copy and the one principle you will take.

### 3. Choose an archetype, then break one of its rules
`references/03-archetypes.md` has 12 winning archetypes (explorable world, object-as-hero, type-as-image poster, chaptered longform, index-with-imagery, gesture toy, simulated machine, drawing→render transformation, illustrated universe, cinematic reel, spatial gallery, technical grid). Each lists winners, structure, motion, stack and its failure mode. Pick one that serves the concept. Then deliberately violate one of its conventions in a way the concept justifies — that's where Creativity points come from.

### 4. Decide the material before the layout
Juries score what they see. Winners use bespoke material: commissioned photography, real product shots, illustration, 3D built in Blender, custom type, generative graphics, sound. Agents can make real material: GLSL shaders rendered to stills or live, procedural 3D, SVG systems, typographic image-making, canvas generative art, sampled UI from the subject, image generation if available. **Never** stock photos, placeholder gradients, or icon-library illustrations. See `references/09-material.md`.

### 5. Set the systems (type, color, grid)
- Type: `references/04-type.md` — two families max; one display face used huge; free font shortlist mapped to what winners actually use (Neue Montreal, Inter, Geist, Suisse, Aeonik, Helvetica Now, Druk, Mona Sans); numeric targets.
- Color: `references/05-color.md` — 80% of winner palettes are exactly **2 colors**; 35% contain no saturated color at all; when there is an accent it's usually red/orange (0–60°) or teal/blue (150–240°), and it's used as an *event*, not decoration.
- Layout: `references/06-layout.md` — composition moves, grids, navigation (median 4 header links; 44% use a menu button), the first viewport.

### 6. Choreograph motion as one language
`references/07-motion.md`: preloader (brand moment, ≤2s, skippable, cached), intro, scroll (Lenis + ScrollTrigger), reveals (SplitText lines through masks), hover (180–250ms text, 400–650ms image), page transitions, sound. Copy-paste primitives in `starter/`. Motion must explain structure, never decorate.

### 7. If 3D/WebGL: one scene, one job
`references/08-webgl.md`: when it earns points (concept-carrying worlds, objects, transformations) and when it loses them (decorative blobs, generic particles, glass torus). DOM-anchored WebGL recipe in `starter/webgl-stage.ts`. Budget, fallbacks, reduced-motion.

### 8. Build it properly (30% Usability + Developer Award)
Semantic HTML, real links, keyboard, focus, reduced motion, no content hidden behind animation, no horizontal overflow, mobile designed as its own edition, fast first paint, no console errors. Checklist: `references/11-jury.md` (official criteria + Developer Award weights: WPO 20, Responsive 20, Semantics/SEO 20, Markup 15, Animations 15, Accessibility 10).

### 9. Audit like a jury, then iterate twice
Run the app, then:
```bash
node <skill>/scripts/audit.mjs http://localhost:5173 --out .sotd-audit
```
If the page's real state only exists after scrolling (a transformation, a pinned sequence, a deliberate "before" state), measure that state too: `--before "window.scrollTo(0, 5200)"`. It measures your site with the exact probes used on the 808 winners, prints where you fall in the winner distributions, flags jury-risk patterns (card grids, centered hero + 2 CTAs, purple gradients, emoji, italic-serif reflex, placeholders), checks overflow at 390/360/768, reduced motion, focus, alt text, metadata, scroll frame times, and writes a contact sheet. **Look at the contact sheet** next to your 3 references and run the critique protocol in `references/12-critique.md` (jury simulation with score anchors). Fix the three most damaging problems. Re-run. Do this at least twice. Only claim what you verified.

## Hard rules
- One idea per site. If you can describe it with "and", cut half.
- The first viewport must contain a dominant element (type ≥ ~8vw, a full-bleed image/scene, or an object) and almost nothing else. No centered-headline + subhead + two-button hero.
- No rounded feature-card grids, bento boxes, testimonial carousels, logo walls, pricing tables, or stats rows unless the concept makes them strange.
- No purple/blue gradients, glass blobs, glowing orbs, chrome torus knots, generic particles, emoji, stock photos, lorem, "Elevate your…".
- Do not reach for the italic-serif-accent-word move by reflex. Do not default to Space Grotesk + Instrument Serif + mono "editorial" kits. (This is what generated sites look like; it's measurably rare among winners.)
- Two font families. Huge type at regular weight with tight tracking before bold.
- Two colors, maybe one accent used as an event.
- Everything readable and navigable with JS disabled, reduced motion, keyboard, and on a 360px phone.
- Every interaction must have a reason you can state in one sentence that ties back to the concept.

## Files
- `references/01-evidence.md` — the study: numbers, method, caveats
- `references/02-concept.md` — the concept engine with winning examples
- `references/03-archetypes.md` — 12 archetypes, winners, structures, failure modes
- `references/04-type.md` · `05-color.md` · `06-layout.md` — systems with measured targets
- `references/07-motion.md` · `08-webgl.md` — choreography and 3D, with code
- `references/09-material.md` — making bespoke assets as an agent
- `references/10-copy.md` — how winners write
- `references/11-jury.md` — official criteria, Developer Award checklist
- `references/12-critique.md` — jury simulation and the iteration loop
- `references/13-anti-patterns.md` — what the lowest scorers and generated sites do
- `scripts/refs.py` — reference finder over 808 winners (scores, tags, palettes, fonts, stack, URLs)
- `scripts/capture-refs.mjs` — builds the local screenshot library in `refs/` (not redistributed: the sites belong to their owners)
- `scripts/audit.mjs` — jury-risk + developer audit with winner benchmarks
- `starter/` — motion system (Lenis + GSAP + SplitText reveals, preloader, cursor, transitions) and DOM-anchored WebGL stage
- `data/winners.json` · `data/benchmarks.json` — the dataset
