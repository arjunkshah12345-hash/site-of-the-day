# 06 — Layout and composition

## The first viewport (where scores are decided)
A juror forms the Design score in seconds. Every top winner's first viewport has:
- **One dominant element** taking 40–100% of the screen: giant type (≥ 8–25vw), a full-bleed scene/photo/video, or a single object. Not two.
- **Corner furniture**: logo top-left, 2–5 nav items or a menu button top-right, and 1–3 tiny labels in the other corners (location, date, index, sound toggle, "scroll"). These small elements at the edges create the frame that makes the dominant element feel placed.
- **Almost no paragraph text.** If there's a sentence, it's ≤ 20 words, small, and placed off-axis.
- **No centered headline + subheading + two buttons.** That composition is the strongest "template" signal in the low-scoring field.

Patterns seen in winners:
- *Name fills the width* (Siena, Exat, The Line, Champions for Good).
- *Object in the middle, labels in the corners* (Lando's portrait, Mana's centered headline flanked by "YERBA" … "MATE" at the edges).
- *List as hero* (Bennett & Clive: client names stacked right-aligned over a full-bleed film still).
- *A scene, full-bleed, UI only at the edges* (Messenger, Bruno Simon, Active Theory).
- *Instruction as hero* (Why Zero: "DRAW A ZERO" small, center, over a living scene).

## Grid
- 12 columns desktop (gutter 16–24px, margin 16–40px; larger on ≥1600px), 4 or 6 on mobile. Use CSS grid with named lines; place elements by column, then *break* the grid deliberately for the dominant element (full-bleed, overhanging, cropped by the viewport).
- Alignment does the work: a label aligned to the same column as a word 600px below it creates tension and order.
- Hairlines (1px at 15–20% ink) as visible structure are common in technical/editorial winners. Use them as a system, not as decoration.

## Rhythm between sections
- Alternate **density** (a packed index, a text-heavy chapter) with **release** (one image, one number, one sentence on an empty field).
- Never repeat the same section structure twice in a row (big title + paragraph + image is the default AI loop).
- Change at least one of: scale, alignment, color field, media type, motion behavior — at every section boundary.
- Median page length is 7.3 viewports; a quarter of winners are a single screen. Shorter and denser beats long and repetitive (pages > 8 viewports score slightly lower).

## Navigation
- Header: median 4 links; 44% use a menu button. Big full-screen menus are an opportunity (type at display size, an image per item, current page indicated).
- *Unusual Navigation* is the #1 Creativity tag — a timeline rail, a radial index, a map, a world, a keyboard, scroll-as-time — **but** keep it learnable: label it, show where you are, and offer a plain list/skip.
- Always: logo → home, visible current state, Esc closes overlays, back button works (history API for page transitions).

## Mobile edition
Designed separately, not shrunk:
- Re-compose the first viewport for a 9:19 frame: display type may be *bigger* relative to width; the object may be cropped by the edge on purpose.
- Replace hover with tap states or in-view states (activate when centered).
- Simplify WebGL (lower DPR, fewer passes) but keep the concept visible.
- No horizontal overflow at 360px. Tap targets ≥ 44px. Menu reachable instantly.

## Footer / end
The last screen is a finale, not a sitemap dump: a giant wordmark or final statement, the contact as a large typographic link, a small credits/colophon, real links only. Many winners extend the concept into the 404 page.
