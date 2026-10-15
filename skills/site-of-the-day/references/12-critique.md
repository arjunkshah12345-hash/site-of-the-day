# 12 — Critique protocol (jury simulation)

You cannot judge your own site from code. Judge it from screenshots, next to real winners, against anchors. Do this after every major build pass — at least twice.

## 1. Capture
```bash
node <skill>/scripts/audit.mjs http://localhost:5173 --out .sotd-audit
python3 <skill>/scripts/refs.py <same tags/archetype as your concept> --tier sotm --limit 3 --sheet .sotd-audit/refs.jpg
```
Open `.sotd-audit/contact-sheet.jpg` and `.sotd-audit/refs.jpg`. Look at them together.

## 2. Fast tests (fail any → fix before scoring)
- **5-second test**: from the first desktop frame alone, can you say what this is and what's special? Is there one dominant element?
- **One-sentence test**: describe the signature interaction in one sentence. If you can't, there isn't one.
- **Swap test**: replace the brand name with a competitor's. Does the design still work? Then it's a template.
- **Squint test**: blur your eyes at the contact sheet. Do sections have different silhouettes, or is it the same block repeated?
- **Stillness test**: with no motion at all, is every frame a composed image?
- **Phone test**: is the mobile edition designed (re-composed, re-broken type) or shrunk?
- **Template-tell scan**: card grids, centered hero + 2 CTAs, gradient wash, emoji, stock imagery, fake logos/stats, italic-serif accent reflex, "Elevate/Seamless/Innovative" copy. (The audit flags most of these.)

## 3. Score each criterion with anchors
Write a number and the visible evidence for it.

| Score | Design (40%) | Usability (30%) | Creativity (20%) | Content (10%) |
|---|---|---|---|---|
| **6.5** (HM floor) | competent template, nice fonts, generic composition | works, conventional | familiar patterns | generic copy, stock media |
| **7.0** | consistent system, one strong section, others filler | clear nav, some friction, mobile ok | one effect not tied to subject | decent, some filler |
| **7.4** (median SOTD) | strong first viewport, authored type, coherent palette, polished details | fast, legible, keyboard-able, mobile designed | a recognisable idea, executed in most of the site | specific copy, real assets |
| **7.8** (SOTM level — e.g. Siena 7.90, Why Zero 7.73 / C8.16, Bennett & Clive / C8.13) | every frame composed; type and material unmistakable; no weak section | invention without confusion; skip paths; flawless mobile | the interaction *is* the message; memorable in one sentence | voiced, concrete, edges written (loader, 404) |
| **8.2+** (SOTY — Lando 8.18, Lusion 8.25, Prometheus 8.40) | portrait-level craft, bespoke material everywhere | effortless despite ambition | a new mechanism the field will copy | the subject understood deeply |

Weighted total = .4·D + .3·U + .2·C + .1·Ct. Be harsh: generated sites usually overrate themselves by ~1 point. If any criterion < 7.4, that's the priority.

## 4. Fix the three most damaging problems
Rank by (visibility × score weight). First-viewport issues and repeated-section monotony usually top the list, then mobile, then motion jank, then copy. Fix, re-run the audit, re-look. Keep a short log of what changed and why.

## 5. Before saying "done"
- Audit passes with 0 fails; every warning has a concept-based reason.
- Two critique passes completed with screenshots viewed.
- Tested: keyboard path, reduced motion, 360/390/768/1024/1440/1920 widths, resize mid-animation, scroll reversal, back/forward, no-WebGL fallback if applicable.
- Report real measurements (load, frames, sizes) — never claim untested things.
