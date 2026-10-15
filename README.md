# site-of-the-day

[![skills.sh](https://skills.sh/b/arjunkshah12345-hash/site-of-the-day)](https://skills.sh/arjunkshah12345-hash/site-of-the-day)

An agent skill for building websites the Awwwards jury rewards — learned from **808 winners** (53 Sites of the Year, 156 Sites of the Month, 599 Sites of the Day): their jury scores, tags and palettes, plus live measurements of typography, layout, colour and motion stacks on every site still online.

![cover](cover.jpg)

```bash
npx skills add arjunkshah12345-hash/site-of-the-day
```

Then ask your agent for something like *“Build an Awwwards-level site for a small coffee roaster. Use the site-of-the-day skill.”*

## What the data says
- **Effects are table stakes.** GSAP 76%, smooth scroll 64%, full-screen WebGL 54%, custom cursor 50%, preloader 54% of recent winners — none moves the score more than ±0.05.
- **Creativity is the gap.** Month/Year winners beat the daily field by +0.47 on creativity. Storytelling: 44% of monthly winners vs 20% of daily.
- **Type is big, regular, tight.** Largest above-fold type: median 5.7vw, top quarter ≥ 9.6vw; weight 400 on 48%; two families.
- **Two colours.** 80% of winning palettes have exactly two; a third of winners use nothing saturated.
- **What loses looks generated.** Bento cards with soft 3D, a centred serif headline with one italic word on a gradient, “thoughtful, intentional & scalable”.

## What's inside `skills/site-of-the-day/`
| | |
|---|---|
| `SKILL.md` | the procedure: raw material → one idea → references → archetype → material → systems → motion → build → audit ×2 |
| `references/` | 13 chapters: evidence, concept engine, 12 winning archetypes, type (free fonts mapped to what winners use), colour, layout, motion (GSAP/Lenis/SplitText with the gotchas), WebGL, making bespoke material, copy, the official jury + Developer Award criteria, critique protocol, anti-patterns |
| `scripts/refs.py` | find winners by tag, tier, year, darkness, free text |
| `scripts/capture-refs.mjs` | build a private local screenshot library of winners |
| `scripts/audit.mjs` | measure a running site against the winners' distributions; flags template patterns; checks overflow, reduced motion, focus, alt, metadata, console errors, scroll frame times; writes a contact sheet |
| `starter/` | motion system (Lenis + GSAP reveals, sticky-stage progress, preloader, context cursor) and a DOM-anchored three.js stage |
| `data/` | `winners.json` (808 winners), `benchmarks.json` (percentiles) |

The audit and capture scripts use Playwright from your project: `npm i -D playwright && npx playwright install chromium`.

## Method & honesty
Scores, tags and palettes come from public awwwards.com pages; measurements from loading each live site in Chromium (October 2026). Screenshots are **not** included — they belong to the sites' owners; `capture-refs.mjs` makes them locally for private reference. Month/Year vs Day comparisons were redone within the same era; the top-tier sample is small (n=36), and library detection is heuristic. See `references/01-evidence.md`.

Not affiliated with Awwwards.
