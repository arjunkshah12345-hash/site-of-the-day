# 09 — Material: making bespoke assets as an agent

Juries score what they see. The single biggest visual difference between the top and bottom of the field is **material**: winners use things made for the subject (portraits, product shots, illustration, Blender worlds, custom type, archival scans). Generic stock and placeholder gradients read as template instantly.

## Order of preference
1. **Real assets from the client/subject**: photos, product renders, logos, documents, footage, sounds, data. Ask for them. Treat them well (crop, grade, sequence).
2. **Assets you can generate with code — properly**:
   - **GLSL stills**: write a fragment shader that depicts something *about* the subject (light through fluted glass, rods casting shadows, a topographic field from real elevation data), render it in headless Chromium at 2–3k px, export WebP. Iterate by looking at it. (Pattern: an HTML page with a full-screen triangle + shader, `canvas.toDataURL('image/webp', .9)` via Playwright; render in tiles with `gl.scissor` for heavy raymarchers.)
   - **Raymarched scenes**: SDF rooms, objects and fields with soft shadows give photographic-feeling architectural images. Watch for invalid distance bounds (rays skipping thin geometry) — clamp step size near the field.
   - **Procedural 3D**: build geometry from the subject's logic (folded plates, extruded glyphs, lathe from a real product profile), light it with an environment map, render live or capture posters.
   - **SVG systems**: technical drawings, diagrams, maps, glyph constructions, annotated callouts with real measurements.
   - **Typographic images**: the subject's words set as image (posters, specimen pages, giant numerals, lists).
   - **Canvas generative**: particles/flow that behave like the subject (rods leaning to a visitor, ink diffusing, traffic on a map) — interactive studies count as content.
   - **Image generation models** (if available in your environment): art-direct like a photographer — subject, lens, light, surface, grain, palette from the site's two colors; generate a *series* with one consistent direction; never use the first output.
3. **Licensed assets** only with clear rights; never hotlink; never "unsplash photo of laptop".

## Art direction checklist (for any asset)
- One light direction and quality across the whole site.
- One grade: shared black point, shared white point, shared grain.
- Crops that create tension (cut by the viewport, off-center, extreme close-ups) — not centered product-on-white unless that's the point.
- Consistent texture: if you add grain, add it everywhere (a fixed, low-opacity noise overlay ~5–8%).
- Every image has a job: reveals information, sets a chapter, or is interacted with.

## Never
Stock people pointing at laptops · 3D blobs/orbs/glass shapes as "abstract tech" · icon-library illustration people · AI images with no art direction (plastic skin, generic neon) · fake UI screenshots / fake dashboards · fake logos of clients · fabricated testimonials, awards, statistics. Content is judged; fabrication is a credibility failure.
