/**
 * SOTD WebGL stage — one fixed canvas whose objects are anchored to DOM layout slots.
 * npm i three   (code-split it:  const { Stage } = await import('./webgl-stage'))
 *
 *   const stage = new Stage(canvas)           // canvas: position:fixed; inset:0; pointer-events:none
 *   if (!stage.ok) showPosters()              // no WebGL → keep <img> posters
 *   const obj = stage.add(myGroup)            // any Object3D
 *   gsap.ticker.add((t, dt) => {
 *     stage.place(obj, rectOf(slotEl), { fit: 'box', fill: 1 })   // sits exactly in the slot
 *     stage.render()
 *   })
 *
 * The object's rotated bounding box is fitted into the DOM rect every frame, so layout,
 * responsive breakpoints and resizes are handled by CSS. Interpolate between two rects
 * (lerpRect) to make an object travel between composed positions on scroll.
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export interface Rect { cx: number; cy: number; w: number; h: number }
export const rectOf = (el: Element): Rect => { const r = el.getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height } }
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t })

export class Stage {
  readonly ok: boolean
  renderer!: THREE.WebGLRenderer
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(22, 1, 0.5, 100)
  private dist = 16
  private w = 1
  private h = 1
  private env: THREE.WebGLRenderTarget | null = null
  private ro?: ResizeObserver
  private boxes = new WeakMap<THREE.Object3D, { pts: THREE.Vector3[]; r: number }>()
  private tmp = new THREE.Vector3()

  constructor(private canvas: HTMLCanvasElement, { maxDpr = 1.75, mobileDpr = 1.5, envIntensity = 0.6 } = {}) {
    const probe = document.createElement('canvas')
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) { this.ok = false; return }
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch { this.ok = false; return }
    this.ok = true
    const r = this.renderer
    r.setClearColor(0, 0)
    r.outputColorSpace = THREE.SRGBColorSpace
    r.toneMapping = THREE.NeutralToneMapping
    const pm = new THREE.PMREMGenerator(r)
    const room = new RoomEnvironment()
    this.env = pm.fromScene(room, 0.04)
    this.scene.environment = this.env.texture
    this.scene.environmentIntensity = envIntensity
    room.dispose(); pm.dispose()
    this.camera.position.set(0, 0, this.dist)
    const resize = () => {
      this.w = canvas.clientWidth; this.h = canvas.clientHeight
      r.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 768 ? mobileDpr : maxDpr))
      r.setSize(this.w, this.h, false)
      this.camera.aspect = this.w / this.h
      this.camera.updateProjectionMatrix()
    }
    resize()
    this.ro = new ResizeObserver(resize); this.ro.observe(canvas)
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); (this as { ok: boolean }).ok = false; document.documentElement.classList.remove('has-gl') })
    document.documentElement.classList.add('has-gl')
  }

  /** world units per CSS pixel on the z=0 plane */
  get wpp() { return (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.dist) / this.h }

  add(obj: THREE.Object3D) {
    this.scene.add(obj)
    const pts: THREE.Vector3[] = []
    obj.updateMatrixWorld(true)
    obj.traverse((o) => {
      const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry | undefined
      if (!g?.attributes?.position) return
      const p = g.attributes.position
      const step = Math.max(1, Math.floor(p.count / 400)) // sample for speed
      for (let i = 0; i < p.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrix))
    })
    const sphere = new THREE.Box3().setFromPoints(pts).getBoundingSphere(new THREE.Sphere())
    this.boxes.set(obj, { pts, r: sphere.radius || 1 })
    return obj
  }

  /** Fit obj into a DOM rect. Rotation is taken from obj.quaternion (set it before calling). */
  place(obj: THREE.Object3D, rect: Rect, { fit = 'box' as 'box' | 'sphere', fill = 1, z = 0 } = {}) {
    const info = this.boxes.get(obj); if (!info) return
    const wpp = this.wpp
    let s: number, ox = 0, oy = 0
    if (fit === 'box') {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const p of info.pts) {
        this.tmp.copy(p).applyQuaternion(obj.quaternion)
        minX = Math.min(minX, this.tmp.x); maxX = Math.max(maxX, this.tmp.x)
        minY = Math.min(minY, this.tmp.y); maxY = Math.max(maxY, this.tmp.y)
      }
      s = Math.min((rect.w * wpp) / (maxX - minX || 1), (rect.h * wpp) / (maxY - minY || 1)) * fill
      ox = ((minX + maxX) / 2) * s; oy = ((minY + maxY) / 2) * s
    } else {
      s = ((Math.min(rect.w, rect.h) / 2) * wpp / info.r) * fill
    }
    obj.scale.setScalar(s)
    obj.position.set((rect.cx - this.w / 2) * wpp - ox, -(rect.cy - this.h / 2) * wpp - oy, z)
  }

  /** Is a rect (plus margin) on screen? Skip render work when nothing visible. */
  visible(rect: Rect, margin = 0.2) {
    const m = this.h * margin
    return rect.cy + rect.h / 2 > -m && rect.cy - rect.h / 2 < this.h + m && rect.w > 1
  }

  render() { if (this.ok) this.renderer.render(this.scene, this.camera) }
  clear() { if (this.ok) this.renderer.clear() }

  dispose() {
    this.ro?.disconnect()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
      mats.forEach((mat) => { Object.values(mat).forEach((v) => (v as THREE.Texture)?.isTexture && (v as THREE.Texture).dispose()); mat.dispose() })
    })
    this.env?.dispose()
    this.renderer?.dispose()
    document.documentElement.classList.remove('has-gl')
  }
}
