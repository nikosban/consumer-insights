import { useEffect, useRef } from 'react'

interface Dot {
  x: number
  y: number
  targetX: number
  targetY: number
  active: boolean
  opacity: number
  phase: number
}

interface Props {
  activeFraction: number  // 0–1, proportion of dots to show as active
  className?: string
}

const DOT_COUNT   = 1200
const DOT_RADIUS  = 2
const SPREAD      = 0.85  // fraction of canvas used when all active

export function DotPopulation({ activeFraction, className }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const dotsRef     = useRef<Dot[]>([])
  const frameRef    = useRef<number>(0)
  const timeRef     = useRef(0)
  const fracRef     = useRef(activeFraction)

  // Keep fracRef in sync without re-running effect
  fracRef.current = activeFraction

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w   = canvas.offsetWidth
      const h   = canvas.offsetHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      placeDots(w, h)
    }

    function placeDots(w: number, h: number) {
      dotsRef.current = Array.from({ length: DOT_COUNT }, (_) => {
        const angle = Math.random() * Math.PI * 2
        const r     = Math.sqrt(Math.random()) * (Math.min(w, h) * SPREAD * 0.5)
        return {
          x: w / 2 + Math.cos(angle) * r,
          y: h / 2 + Math.sin(angle) * r,
          targetX: w / 2 + Math.cos(angle) * r,
          targetY: h / 2 + Math.sin(angle) * r,
          active: true,
          opacity: 1,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      timeRef.current += 0.008

      const frac      = fracRef.current
      const activeN   = Math.round(DOT_COUNT * frac)
      // Cluster radius shrinks as fewer dots are active
      const clusterR  = (Math.min(w, h) * SPREAD * 0.5) * (0.3 + frac * 0.7)
      const cx        = w / 2
      const cy        = h / 2

      dotsRef.current.forEach((dot, i) => {
        const shouldBeActive = i < activeN

        if (shouldBeActive !== dot.active) {
          dot.active = shouldBeActive
          if (shouldBeActive) {
            // Spring back to a position inside the cluster
            const angle    = Math.random() * Math.PI * 2
            const r        = Math.sqrt(Math.random()) * clusterR
            dot.targetX    = cx + Math.cos(angle) * r
            dot.targetY    = cy + Math.sin(angle) * r
          } else {
            // Drift to the edge
            const angle    = Math.atan2(dot.y - cy, dot.x - cx)
            dot.targetX    = cx + Math.cos(angle) * (Math.min(w, h) * 0.65)
            dot.targetY    = cy + Math.sin(angle) * (Math.min(w, h) * 0.65)
          }
        }

        // Recalculate target for active dots as cluster shrinks
        if (dot.active) {
          const angle    = Math.atan2(dot.targetY - cy, dot.targetX - cx)
          const curR     = Math.sqrt((dot.targetX - cx) ** 2 + (dot.targetY - cy) ** 2)
          if (curR > clusterR) {
            const newR     = clusterR * (0.7 + Math.random() * 0.3)
            dot.targetX    = cx + Math.cos(angle) * newR
            dot.targetY    = cy + Math.sin(angle) * newR
          }
        }

        // Spring toward target
        dot.x += (dot.targetX - dot.x) * 0.04
        dot.y += (dot.targetY - dot.y) * 0.04

        // Breathing oscillation on active dots
        let bx = 0, by = 0
        if (dot.active) {
          bx = Math.sin(timeRef.current + dot.phase) * 0.4
          by = Math.cos(timeRef.current * 0.9 + dot.phase) * 0.4
        }

        // Fade in/out
        const targetOpacity = dot.active ? 0.55 : 0
        dot.opacity += (targetOpacity - dot.opacity) * 0.06

        if (dot.opacity < 0.01) return

        ctx.beginPath()
        ctx.arc(dot.x + bx, dot.y + by, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6,102,229,${dot.opacity.toFixed(3)})`
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
