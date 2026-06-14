import { useEffect, useRef, useState } from 'react'

interface Palette {
  ray: [number, number, number, number]   // rgba
  dot: [number, number, number, number]
  glow: [number, number, number, number]
}

const PALETTES: Record<string, Palette> = {
  day:     { ray: [6,  102, 229, 0.35], dot: [6,  102, 229, 0.55], glow: [6,  102, 229, 0.08] },
  dawn:    { ray: [184,201,245, 0.45],  dot: [107,143,240, 0.65],  glow: [200,215,255, 0.10] },
  dusk:    { ray: [245,196,184, 0.45],  dot: [200,100, 80, 0.65],  glow: [255,220,210, 0.08] },
  evening: { ray: [196,184,245, 0.45],  dot: [120,100,210, 0.65],  glow: [220,210,255, 0.08] },
}

const PALETTE_KEYS = Object.keys(PALETTES) as Array<keyof typeof PALETTES>

const CONFIG = {
  rayCount:      120,
  rayCountMobile: 60,
  minLength:      80,
  maxLength:      400,
  dotRadius:       2.5,
  arcDegrees:      170,
  driftSpeed:      0.0003,
  mouseInfluence:  0.06,
  mouseThreshold:  150,
}

interface Ray {
  baseAngle: number
  length:    number
  opacity:   number
  deflectX:  number
  deflectY:  number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpPalette(a: Palette, b: Palette, t: number): Palette {
  return {
    ray:  [lerp(a.ray[0],b.ray[0],t), lerp(a.ray[1],b.ray[1],t), lerp(a.ray[2],b.ray[2],t), lerp(a.ray[3],b.ray[3],t)],
    dot:  [lerp(a.dot[0],b.dot[0],t), lerp(a.dot[1],b.dot[1],t), lerp(a.dot[2],b.dot[2],t), lerp(a.dot[3],b.dot[3],t)],
    glow: [lerp(a.glow[0],b.glow[0],t), lerp(a.glow[1],b.glow[1],t), lerp(a.glow[2],b.glow[2],t), lerp(a.glow[3],b.glow[3],t)],
  }
}

function toRgba([r,g,b,a]: [number,number,number,number]) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(3)})`
}

interface Props {
  className?: string
}

export function RayBurst({ className }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const frameRef   = useRef<number>(0)
  const timeRef    = useRef(0)
  const raysRef    = useRef<Ray[]>([])

  const [paletteIdx, setPaletteIdx] = useState(0)
  const paletteTransRef = useRef({ from: 0, to: 0, progress: 1 })

  // init rays
  function initRays(count: number) {
    const arcRad = (CONFIG.arcDegrees * Math.PI) / 180
    const startAngle = Math.PI + (Math.PI - arcRad) / 2
    raysRef.current = Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1)
      const baseAngle = startAngle + t * arcRad
      const lengthT   = Math.pow(Math.abs(t - 0.5) * 2, 0.5)
      const length     = lerp(CONFIG.maxLength, CONFIG.minLength, lengthT * 0.6)
      const opacity    = lerp(0.9, 0.3, lengthT)
      return { baseAngle, length, opacity, deflectX: 0, deflectY: 0 }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    initRays(isMobile ? CONFIG.rayCountMobile : CONFIG.rayCount)

    // DPR-aware resize
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w   = canvas.offsetWidth
      const h   = canvas.offsetHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Mouse
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMouse)

    // Animation loop
    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      timeRef.current += CONFIG.driftSpeed

      // Origin: slightly below bottom centre
      const ox = w * 0.5
      const oy = h * 1.05

      // Palette interpolation
      const pt = paletteTransRef.current
      if (pt.progress < 1) {
        pt.progress = Math.min(pt.progress + 0.016, 1)
      }
      const fromP = PALETTES[PALETTE_KEYS[pt.from]]
      const toP   = PALETTES[PALETTE_KEYS[pt.to]]
      const eased = pt.progress < 1 ? 1 - Math.pow(1 - pt.progress, 3) : 1
      const pal   = lerpPalette(fromP, toP, eased)

      // Draw glow
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, h * 0.8)
      grad.addColorStop(0, toRgba(pal.glow))
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Draw rays
      raysRef.current.forEach((ray, i) => {
        const drift    = Math.sin(timeRef.current * 60 + i * 0.3) * 0.008
        const angle    = ray.baseAngle + drift

        const ex0 = ox + Math.cos(angle) * ray.length
        const ey0 = oy + Math.sin(angle) * ray.length

        // Mouse deflection spring
        const dx = ex0 - mouseRef.current.x
        const dy = ey0 - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const targetDX = dist < CONFIG.mouseThreshold
          ? (mouseRef.current.x - ex0) * CONFIG.mouseInfluence * (1 - dist / CONFIG.mouseThreshold)
          : 0
        const targetDY = dist < CONFIG.mouseThreshold
          ? (mouseRef.current.y - ey0) * CONFIG.mouseInfluence * (1 - dist / CONFIG.mouseThreshold)
          : 0
        ray.deflectX += (targetDX - ray.deflectX) * 0.07
        ray.deflectY += (targetDY - ray.deflectY) * 0.07

        const ex = ex0 + ray.deflectX
        const ey = ey0 + ray.deflectY

        // Ray line
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = toRgba([...pal.ray.slice(0,3) as [number,number,number], pal.ray[3] * ray.opacity] as [number,number,number,number])
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Dot at end
        ctx.beginPath()
        ctx.arc(ex, ey, CONFIG.dotRadius, 0, Math.PI * 2)
        ctx.fillStyle = toRgba([...pal.dot.slice(0,3) as [number,number,number], pal.dot[3] * ray.opacity] as [number,number,number,number])
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  // Palette cycle button handler — advance transition
  const cyclePalette = () => {
    const next = (paletteIdx + 1) % PALETTE_KEYS.length
    paletteTransRef.current = { from: paletteIdx, to: next, progress: 0 }
    setPaletteIdx(next)
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {/* Palette cycle button */}
      <button
        onClick={cyclePalette}
        title="Change palette"
        className="absolute bottom-6 right-6 z-10 w-7 h-7 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
        aria-label="Cycle colour palette"
      >
        ☀
      </button>
    </>
  )
}
