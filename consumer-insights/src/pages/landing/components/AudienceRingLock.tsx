import { useRef, useEffect, useState, useCallback } from 'react'

// ── Colour helpers ────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function chipFill(t: number)   { return `rgb(${Math.round(lerp(255,6,t))},${Math.round(lerp(255,102,t))},${Math.round(lerp(255,229,t))})` }
function chipStroke(t: number) { return t > 0.3 ? `rgba(6,102,229,${t})` : `rgba(0,0,0,${lerp(0.10,0,t)})` }
function chipFg(t: number)     { return `rgba(${Math.round(lerp(30,255,t))},${Math.round(lerp(40,255,t))},${Math.round(lerp(60,255,t))},${lerp(0.38,1,t)})` }

// ── Data ─────────────────────────────────────────────────────────────────────
interface Val  { label: string; mult: number }
interface Ring { id: string; speed: number; dir: 1|-1; start: number; values: Val[] }

const BASE      = 80_000_000
const MIN_REACH = 10_000
const Y_SCALE   = 0.48   // ry = rx * Y_SCALE → wider than tall

function mkRing(id: string, speed: number, dir: 1|-1, values: Val[], apexIdx = 0): Ring {
  const n = values.length
  return { id, speed, dir, start: Math.PI / 2 - (apexIdx / n) * 2 * Math.PI, values }
}

const RINGS: Ring[] = [
  mkRing('gender',    0.14,  1, [{ label:'Women', mult:0.51 },{ label:'Men', mult:0.47 },{ label:'Other', mult:0.24 }], 0),
  mkRing('age',       0.10, -1, [{ label:'18–24', mult:0.26 },{ label:'25–40', mult:0.38 },{ label:'41–55', mult:0.30 },{ label:'55+', mult:0.22 }], 1),
  mkRing('income',    0.08,  1, [{ label:'<€25k', mult:0.38 },{ label:'€25–45k', mult:0.42 },{ label:'€45k+', mult:0.34 },{ label:'€75k+', mult:0.24 }], 2),
  mkRing('device',    0.06, -1, [{ label:'Smartphone', mult:0.66 },{ label:'Desktop', mult:0.40 },{ label:'Tablet', mult:0.28 }], 0),
  mkRing('behaviour', 0.05,  1, [{ label:'Weekly buyer', mult:0.44 },{ label:'Monthly', mult:0.38 },{ label:'Occasional', mult:0.30 }], 0),
  mkRing('market',    0.04, -1, [{ label:'Germany', mult:0.42 },{ label:'France', mult:0.38 },{ label:'UK', mult:0.36 },{ label:'Spain', mult:0.30 },{ label:'Italy', mult:0.26 }], 0),
]

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}k`
  return n.toString()
}

// ── Component ─────────────────────────────────────────────────────────────────
export function AudienceRingLock() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const prevKey     = useRef('')
  const displayRef  = useRef('–')
  const [display, setDisplay] = useState('–')

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    function resize() {
      const dpr    = window.devicePixelRatio || 1
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

      const t  = performance.now() / 1000
      const CX = w / 2
      // Focal at canvas bottom — arcs open upward and fill the full canvas height
      const CY    = h
      const R_max = CX - 20          // outer arc nearly spans full width
      const R_min = R_max * 0.18
      const nR    = RINGS.length

      // Edge-to-edge baseline
      ctx.beginPath()
      ctx.moveTo(0, CY)
      ctx.lineTo(w, CY)
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.lineWidth   = 1
      ctx.stroke()

      let newReach = BASE
      const keys: string[] = []

      for (let ri = 0; ri < nR; ri++) {
        const ring = RINGS[ri]
        const rx   = R_min + (R_max - R_min) * (ri / (nR - 1))
        const ry   = rx * Y_SCALE
        const n    = ring.values.length

        // Elliptical arc track
        ctx.beginPath()
        ctx.ellipse(CX, CY, rx, ry, 0, 0, Math.PI, true)
        ctx.strokeStyle = 'rgba(0,0,0,0.07)'
        ctx.lineWidth   = 1
        ctx.stroke()

        // Compute angles
        const θs: number[] = []
        let bestIdx = 0, bestSin = -Infinity

        for (let vi = 0; vi < n; vi++) {
          let θ = (vi / n) * 2 * Math.PI + ring.start + t * ring.speed * ring.dir
          θ = ((θ % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          θs.push(θ)
          const s = Math.sin(θ)
          if (s > bestSin) { bestSin = s; bestIdx = vi }
        }

        newReach *= ring.values[bestIdx].mult
        keys.push(ring.values[bestIdx].label)

        // Draw chips — farthest from apex first
        const order = [...Array(n).keys()].sort((a, b) => Math.sin(θs[a]) - Math.sin(θs[b]))
        const CHIP_H = 22

        for (const vi of order) {
          const θ = θs[vi]
          const s = Math.sin(θ)
          if (s <= 0) continue

          const alpha  = s * s
          const colorT = Math.pow(s, 6)
          if (alpha < 0.02) continue

          const x = CX + rx * Math.cos(θ)
          const y = CY - ry * s

          ctx.font = `${colorT > 0.4 ? 500 : 400} 10.5px var(--font-sans, system-ui, sans-serif)`
          const chipW = ctx.measureText(ring.values[vi].label).width + 20

          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.roundRect(x - chipW / 2, y - CHIP_H / 2, chipW, CHIP_H, CHIP_H / 2)
          ctx.fillStyle   = chipFill(colorT)
          ctx.fill()
          ctx.strokeStyle = chipStroke(colorT)
          ctx.lineWidth   = 1
          ctx.stroke()
          ctx.fillStyle    = chipFg(colorT)
          ctx.textAlign    = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(ring.values[vi].label, x, y + 0.5)
          ctx.globalAlpha = 1
        }
      }

      // Focal dot
      ctx.beginPath()
      ctx.arc(CX, CY, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fill()

      // Update counter
      const key = keys.join('|')
      if (key !== prevKey.current) {
        prevKey.current = key
        const val = fmt(Math.max(Math.round(newReach), MIN_REACH))
        displayRef.current = val
        setDisplay(val)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <>
      {/* Canvas height = R_max * Y_SCALE = (w/2) * 0.48 ≈ w/4 → aspect ≈ 4:1 */}
      <div style={{ width: '100%', height: 'calc(100vw * 0.24)', maxHeight: '420px', minHeight: '200px' }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="py-5 text-center select-none pointer-events-none">
        <p className="text-3xl font-semibold text-foreground tabular-nums leading-none">{display}</p>
        <p className="text-xs text-secondary-foreground mt-1.5">respondents</p>
      </div>
    </>
  )
}
