import { useRef, useEffect } from 'react'

// Dawn palette — routes through pink/magenta to avoid green zone
const DAWN_HUES = [258, 230, 205, 335, 20]

function lerpHue(a: number, b: number, t: number) {
  let d = b - a
  if (Math.abs(d) > 180) d -= Math.sign(d) * 360
  return a + d * t
}

function dawnHue(phase: number) {
  const n = DAWN_HUES.length
  const p = (((phase % 1) + 1) % 1) * n
  const i = Math.floor(p) % n
  return lerpHue(DAWN_HUES[i], DAWN_HUES[(i + 1) % n], p - Math.floor(p))
}

// Sample quadratic bezier at t ∈ [0,1]
function qBez(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, t: number): [number, number] {
  const mt = 1 - t
  return [mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x, mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y]
}

interface Strand {
  angle: number   // tip angle from circle center (radians, 0=right, π/2=down in canvas)
  r:     number   // tip radius (fraction of R, adds spread at perimeter)
  phase: number   // colour phase offset
  width: number   // stroke width multiplier
  bow:   number   // bezier bow direction/amount (signed fraction of R)
}

const STEPS        = 28
const STRAND_COUNT = 480

function buildStrands(): Strand[] {
  const out: Strand[] = []
  let seed = 137
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    return (seed >>> 0) / 0xffffffff
  }

  for (let i = 0; i < STRAND_COUNT; i++) {
    // Full 340° arc — small 20° gap directly below the focal (bottom-most point)
    // Canvas 0° = right, 90° = down. Focal is at 90° (bottom of circle).
    // Gap: 80°–100° (directly below focal). Coverage: 100° → 80° the long way (340°).
    const a = (100 + rand() * 340) * Math.PI / 180
    out.push({
      angle: a,
      r:     0.80 + rand() * 0.22,
      phase: rand(),
      width: 0.35 + rand() * 0.75,
      bow:   (rand() - 0.5) * 0.18,
    })
  }
  return out
}

const STRANDS = buildStrands()
const MORPH_R = 240

export function DawnSun({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const rafRef    = useRef<number>(0)
  const tRef      = useRef(1.8)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl
    const ctx = canvas.getContext('2d')!

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const t = tRef.current
      tRef.current += 0.004

      // Responsive geometry — focal anchored in the right half of the canvas.
      // CSS mask on the canvas fades strands out on the left to protect copy.
      const R   = Math.min(w * 0.52, h * 0.84)
      const ccx = w * 0.82        // circle center in right portion
      const ccy = h * 0.30        // circle center upper portion
      // Focal: inside circle, 78% below circle center
      const fx  = ccx
      const fy  = ccy + R * 0.78

      const { x: mx, y: my } = mouseRef.current

      ctx.lineCap  = 'round'
      ctx.lineJoin = 'round'

      for (let si = 0; si < STRANDS.length; si++) {
        const s = STRANDS[si]

        // Tip on circle perimeter
        const tx = ccx + Math.cos(s.angle) * R * s.r
        const ty = ccy + Math.sin(s.angle) * R * s.r

        // Control point: midpoint offset perpendicularly by bow amount
        const midx = (fx + tx) * 0.5
        const midy = (fy + ty) * 0.5
        const dx   = tx - fx
        const dy   = ty - fy
        const len  = Math.sqrt(dx * dx + dy * dy) || 1
        // Perpendicular: (-dy, dx)
        let cpx = midx + (-dy / len) * R * s.bow
        let cpy = midy + (dx  / len) * R * s.bow

        // Hover morph: attract control point toward mouse with oscillation
        const dMouse = Math.sqrt((mx - tx) ** 2 + (my - ty) ** 2)
        const prox   = Math.max(0, 1 - dMouse / MORPH_R)
        if (prox > 0) {
          const amp    = Math.sin(t * 2.6 + si * 0.42) * prox * 72
          const toMx   = mx - cpx
          const toMy   = my - cpy
          const toMLen = Math.sqrt(toMx * toMx + toMy * toMy) || 1
          cpx += (toMx / toMLen) * amp
          cpy += (toMy / toMLen) * amp
        }

        // ── Sample bezier points ────────────────────────────────────────────
        const pts: [number, number][] = []
        for (let k = 0; k <= STEPS; k++) {
          pts.push(qBez(fx, fy, cpx, cpy, tx, ty, k / STEPS))
        }

        // ── Pass 1: full strand shape ───────────────────────────────────────
        const baseHue = dawnHue(t * 0.22 + s.phase + 0.15)
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let k = 1; k <= STEPS; k++) ctx.lineTo(pts[k][0], pts[k][1])
        ctx.lineWidth   = s.width * 1.2
        ctx.strokeStyle = `hsla(${baseHue}, 90%, 44%, 0.62)`
        ctx.stroke()

        // ── Pass 2: gradient overlay per segment ───────────────────────────
        ctx.lineWidth = s.width * 0.82
        for (let k = 0; k < STEPS; k++) {
          const segU  = (k + 0.5) / STEPS
          const phase = t * 0.22 + segU * 1.0 + s.phase
          const hue   = dawnHue(phase)
          const alpha = (segU < 0.06 ? segU / 0.06 : 1) * 0.75
          ctx.beginPath()
          ctx.moveTo(pts[k][0],     pts[k][1])
          ctx.lineTo(pts[k + 1][0], pts[k + 1][1])
          ctx.strokeStyle = `hsla(${hue}, 94%, 46%, ${alpha})`
          ctx.stroke()
        }

        // ── Tip dot ────────────────────────────────────────────────────────
        const dotHue = dawnHue(t * 0.22 + 1.0 + s.phase)
        ctx.beginPath()
        ctx.arc(tx, ty, s.width * 2.4 + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${dotHue}, 94%, 54%, 0.88)`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    function onMouseMove(e: MouseEvent) {
      const rect        = canvas.getBoundingClientRect()
      mouseRef.current  = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to right, transparent 18%, black 52%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 18%, black 52%)',
      }}
    />
  )
}
