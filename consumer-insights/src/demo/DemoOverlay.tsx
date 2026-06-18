import { useEffect, useState } from 'react'
import type { DemoBubble } from './demoScript'
import type { DemoModeHandle } from './useDemoMode'

// ─── Spotlight ────────────────────────────────────────────────────────────────

const PAD = 12  // padding around spotlit element

/**
 * Finds the first *visible* element matching the selector. The app shell renders
 * the page through two <Outlet />s (a hidden mobile one and the desktop one), so
 * a selector can match a 0×0 hidden duplicate that appears first in the DOM. We
 * skip those and return the first element that is actually laid out on screen.
 */
function findVisible(selector: string): Element | null {
  const els = document.querySelectorAll(selector)
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return null
}

/**
 * Continuously tracks an element's on-screen rect via requestAnimationFrame.
 * This is robust to lazy-loaded pages, async layout, scrolling, and animations:
 * it only reports a rect once the element exists AND has a non-zero size, and
 * keeps it in sync every frame. Returns null until the element is laid out.
 */
function useElementRect(selector: string) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    let raf = 0
    let prevKey = ''
    const tick = () => {
      const el = findVisible(selector)
      const r = el ? el.getBoundingClientRect() : null
      const valid = !!r && r.width > 0 && r.height > 0
      const key = valid
        ? `${Math.round(r!.left)},${Math.round(r!.top)},${Math.round(r!.width)},${Math.round(r!.height)}`
        : 'none'
      if (key !== prevKey) {
        prevKey = key
        setRect(valid ? r : null)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [selector])

  return rect
}

function SpotlightOverlay({ bubble }: { bubble: DemoBubble }) {
  const rect = useElementRect(bubble.selector)

  if (!rect) return null

  const x = rect.left - PAD
  const y = rect.top - PAD
  const w = rect.width + PAD * 2
  const h = rect.height + PAD * 2
  const vw = window.innerWidth
  const vh = window.innerHeight
  const r = 10

  // callout position
  const pos = bubble.position ?? 'bottom'
  const cx = x + w / 2
  const cy = y + h / 2

  let calloutStyle: React.CSSProperties = {}
  if (pos === 'bottom') calloutStyle = { top: y + h + 16, left: cx, transform: 'translateX(-50%)' }
  if (pos === 'top')    calloutStyle = { top: y - 16, left: cx, transform: 'translate(-50%, -100%)' }
  if (pos === 'right')  calloutStyle = { top: cy, left: x + w + 16, transform: 'translateY(-50%)' }
  if (pos === 'left')   calloutStyle = { top: cy, left: x - 16, transform: 'translate(-100%, -50%)' }

  return (
    <>
      {/* Dark overlay with cutout via SVG */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9990 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} fill="black" />
          </mask>
        </defs>
        <rect width={vw} height={vh} fill="rgba(0,0,0,0.65)" mask="url(#spotlight-mask)" />
        {/* white glow ring around cutout */}
        <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={r + 2} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      </svg>

      {/* Callout bubble */}
      <div
        style={{
          position: 'fixed',
          zIndex: 9991,
          pointerEvents: 'none',
          maxWidth: 280,
          ...calloutStyle,
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
        }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{bubble.label}</p>
          {bubble.sublabel && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{bubble.sublabel}</p>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Pulse ring ───────────────────────────────────────────────────────────────

function PulseRing({ bubble, index }: { bubble: DemoBubble; index: number }) {
  const rect = useElementRect(bubble.selector)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 300)
    return () => clearTimeout(t)
  }, [index])

  if (!rect || !visible) return null

  const x = rect.left - PAD
  const y = rect.top - PAD
  const w = rect.width + PAD * 2
  const h = rect.height + PAD * 2
  const r = 10

  const pos = bubble.position ?? 'bottom'
  const cx = x + w / 2

  let calloutStyle: React.CSSProperties = {}
  if (pos === 'bottom') calloutStyle = { top: y + h + 12, left: cx, transform: 'translateX(-50%)' }
  if (pos === 'top')    calloutStyle = { top: y - 12, left: cx, transform: 'translate(-50%, -100%)' }
  if (pos === 'right')  calloutStyle = { top: y + h / 2, left: x + w + 12, transform: 'translateY(-50%)' }
  if (pos === 'left')   calloutStyle = { top: y + h / 2, left: x - 12, transform: 'translate(-100%, -50%)' }

  return (
    <>
      <style>{`
        @keyframes demo-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
          70%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
      {/* pulse ring */}
      <div style={{
        position: 'fixed',
        left: x, top: y, width: w, height: h,
        borderRadius: r,
        border: '2px solid rgba(255,255,255,0.9)',
        animation: 'demo-pulse 1.8s ease-out infinite',
        animationDelay: `${index * 0.2}s`,
        zIndex: 9990,
        pointerEvents: 'none',
      }} />
      {/* callout */}
      <div style={{ position: 'fixed', zIndex: 9991, pointerEvents: 'none', maxWidth: 240, ...calloutStyle }}>
        <div style={{
          background: 'white',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{bubble.label}</p>
          {bubble.sublabel && (
            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{bubble.sublabel}</p>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Control bar ──────────────────────────────────────────────────────────────

const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: 36, padding: '0 14px', borderRadius: 8,
  border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
  transition: 'background 0.15s',
}

function ControlBar({ demo }: { demo: DemoModeHandle }) {
  const { state, stepIndex, totalSteps, currentStep, pause, resume, next, prev, stop } = demo
  const isPlaying = state === 'playing'
  const sceneName = currentStep?.scene ?? ''
  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100)

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8,
      background: 'white', borderRadius: 14,
      padding: '8px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
      minWidth: 420,
    }}>
      {/* scene label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1 }}>
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {sceneName}
        </p>
        {/* progress bar */}
        <div style={{ marginTop: 6, height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#3b82f6', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
        <button style={{ ...btnBase, background: '#f8fafc', color: '#475569', width: 36, padding: 0 }} onClick={prev} disabled={stepIndex === 0} title="Previous">
          ◀
        </button>
        <button
          style={{ ...btnBase, background: isPlaying ? '#fef2f2' : '#eff6ff', color: isPlaying ? '#dc2626' : '#2563eb', width: 36, padding: 0 }}
          onClick={isPlaying ? pause : resume}
          title={isPlaying ? 'Pause' : 'Resume'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button style={{ ...btnBase, background: '#f8fafc', color: '#475569', width: 36, padding: 0 }} onClick={next} disabled={stepIndex >= totalSteps - 1} title="Next">
          ▶▶
        </button>
        <button style={{ ...btnBase, background: '#fef2f2', color: '#dc2626', marginLeft: 4 }} onClick={stop}>
          Stop
        </button>
      </div>
    </div>
  )
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export default function DemoOverlay({ demo }: { demo: DemoModeHandle }) {
  const { state, currentStep } = demo

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') demo.stop()
      if (e.key === ' ') { e.preventDefault(); state === 'playing' ? demo.pause() : demo.resume() }
      if (e.key === 'ArrowRight') demo.next()
      if (e.key === 'ArrowLeft') demo.prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, demo])

  if (state === 'idle' || !currentStep) return null

  const spotlightBubbles = currentStep.bubbles.filter(b => b.type === 'spotlight')
  const pulseBubbles = currentStep.bubbles.filter(b => b.type === 'pulse')

  return (
    <>
      {/* Spotlight — show only first spotlight bubble (one at a time) */}
      {spotlightBubbles.length > 0 && <SpotlightOverlay bubble={spotlightBubbles[0]} />}

      {/* Pulse rings — all shown simultaneously, staggered */}
      {pulseBubbles.map((b, i) => <PulseRing key={b.selector} bubble={b} index={i} />)}

      {/* Control bar */}
      <ControlBar demo={demo} />
    </>
  )
}
