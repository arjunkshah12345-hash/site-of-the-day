# 08 — WebGL and 3D

54% of recent winners have a canvas covering most of the viewport; three.js is detected on 43%. Score effect of fullscreen WebGL: +0.04. WebGL raises Creativity (+0.12) **only when it carries the concept**. A decorative shader behind a template is worth nothing.

## When it earns points
- The subject is spatial or physical (a product, a place, a machine, a material).
- The transformation is the message (drawing → render, raw → refined, scattered → assembled).
- The world is the story (explorable stations).
- An image treatment that is *about* the subject (fluted glass for a light brand, ink bleeding for a print house, heat distortion for an energy company).

## When it loses points
Floating glass blobs, iridescent spheres, torus knots, generic particle fields, "AI brain" networks, noise gradients behind text, default MeshStandardMaterial plastic, untextured low-poly, a 15MB scene with a spinner for a brochure site.

## Architecture
- **One canvas, fixed, behind or between DOM layers**, `pointer-events: none`, driven by `gsap.ticker`. Real text, links and controls stay in HTML (accessibility, SEO, Developer Award).
- **DOM-anchored objects**: lay out an empty `<div data-anchor>` in the page grid, and each frame map its `getBoundingClientRect()` to world space so the 3D object sits exactly in the layout slot and travels between slots on scroll. `starter/webgl-stage.ts` implements this (perspective camera, world-units-per-pixel, fit-to-box using the object's rotated bounding box, resize-safe).
- **Image planes synced to DOM `<img>`** (galleries, hover distortion): one plane per image, texture from the same URL, position/scale from the rect; hide the DOM image only after the texture is ready.
- **Layering text over/under the object**: put the canvas inside the same stacking context as the type layers and give lines different z-index (one line behind the object, one in front). Remember `position: sticky/fixed` create stacking contexts.

## Look
- Lighting sells material: an environment map (three's `RoomEnvironment` via PMREM, or an HDRI), one strong key light, low ambient. `NeutralToneMapping` or `AgXToneMapping` for true color; sRGB output.
- Materials from the subject: ceramic (clearcoat, roughness .35), anodised metal (metalness 1, roughness .2–.3, tinted), paper (no specular, subtle subsurface feel via sheen), glass (transmission — expensive, use sparingly).
- Shadows ground objects: a shadow-catcher plane (`ShadowMaterial`, opacity .15–.25) or baked contact shadow.
- Postprocessing only with intent (grain, chromatic aberration at edges, bloom on emissive). Each pass costs mobile frames.
- Geometry: author it (Blender → glTF + Draco/meshopt, textures KTX2) or generate it procedurally with intention (folded plates, extruded type, lathe profiles from the subject's real dimensions). Look at it from many angles before choosing the hero pose.

## Performance budget
- DPR clamp: `min(devicePixelRatio, 1.75)` desktop, `1.5` mobile.
- Render on demand when idle; stop when off-screen (`IntersectionObserver`) and on `visibilitychange`.
- Code-split three.js (`import()`), show a static poster (pre-rendered PNG of the hero state) until the first frame, and as the fallback for no-WebGL / context loss.
- Target: scroll p95 frame ≤ 17ms on a laptop, LCP < 2.5s, total JS < 400KB gz before the 3D chunk.
- Dispose geometries, materials, textures, render targets on unmount; `renderer.dispose()`.

## Patterns (short recipes)
- **Data field of images**: one `InstancedMesh` of quads sampling a texture atlas (hundreds of screenshots/products/artworks in one draw call), per-instance attributes for atlas UV, palette colours and a highlight value. Layouts are just target rects (grid / histogram / scatter computed from DOM plot frames), animated per instance with a stagger. A uniform flips every tile into its palette; a highlight attribute lights subsets. Picking is a rect test in CSS px. Used for this skill's own site.
- **Scroll-scrubbed object journey**: progress `p` from the pinned section → interpolate anchor rects (hero slot → frame slot), rotation (≤ 80–90°), material params, and optionally a mid-transition scale surge (`1 + k·sin(πe)`) for drama.
- **Line → render**: render the scene twice (edges via `EdgesGeometry` + shaded), crossfade by scroll; or SVG strokes (`stroke-dashoffset`) over a pre-rendered still.
- **Displacement image hover**: fragment shader offsets UVs by a noise/flow texture × hover strength; animate strength 0 → 1 → 0 with `move` ease.
- **Point cloud / scan**: `THREE.Points` with size attenuation, reveal by distance from a moving plane.
- **Generated stills**: if live WebGL isn't justified, render GLSL or three.js once in a headless browser and ship the image (see `09-material.md`).

## Fallbacks and accessibility
- Probe support (`canvas.getContext('webgl2') || getContext('webgl')`) before constructing the renderer to avoid console errors.
- `webglcontextlost` → preventDefault, show posters.
- Reduced motion: no idle rotation, no camera travel; crossfade between composed states.
- Never put essential text only inside the canvas.
