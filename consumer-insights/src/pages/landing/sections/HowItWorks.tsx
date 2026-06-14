import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconUsers,
  IconWorld,
  IconTrendingUp,
  IconSparkles,
  IconSend2,
  IconCalendar,
  IconMapPin,
  IconCoins,
  IconShoppingCart,
  IconDeviceMobile,
} from '@tabler/icons-react'
import { stagger, fadeUp, scaleSettle } from '../variants'

/* ── BentoCard ─────────────────────────────────────────────────── */
interface BentoCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
function BentoCard({ children, className = '', style }: BentoCardProps) {
  // outer owns ::after beam — NO overflow-hidden (it would clip the inset:-1px pseudo-element)
  return (
    <div className="bento-card rounded-2xl cursor-default h-full" style={style}>
      <div className={`rounded-2xl border border-border overflow-hidden flex flex-col h-full ${className}`}>
        {children}
      </div>
    </div>
  )
}

/* ── shared label chip ─────────────────────────────────────────── */
function FeatureLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-secondary-foreground flex items-center gap-1.5 mb-3">
      <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
      {children}
    </p>
  )
}

/* ── Rich response cards per mode ──────────────────────────────── */
function AudienceResponseCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-background p-3"
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <IconUsers size={11} strokeWidth={2} className="text-primary" />
        <span className="text-[11px] font-semibold text-foreground">Premium Skincare Buyers · DE</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2.5">
        {['Women 28–36', 'Income €55k+', 'Mobile-first', 'Urban'].map(tag => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/15"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="border-t border-border pt-2 flex items-center justify-between">
        <span className="text-[10px] text-secondary-foreground">Estimated reach</span>
        <span className="text-[11px] font-semibold text-foreground tabular-nums">1.3M respondents</span>
      </div>
    </motion.div>
  )
}

function GeoResponseCard() {
  const markets = [
    { name: 'Sweden',  pct: 78 },
    { name: 'Germany', pct: 62 },
    { name: 'France',  pct: 58 },
    { name: 'Poland',  pct: 42 },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-background p-3"
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <IconWorld size={11} strokeWidth={2} className="text-primary" />
        <span className="text-[11px] font-semibold text-foreground">Streaming Adoption — EU</span>
      </div>
      <div className="space-y-1.5">
        {markets.map(({ name, pct }, i) => (
          <motion.div
            key={name}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.15 }}
          >
            <span className="w-12 text-[10px] text-secondary-foreground shrink-0">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary/65"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="w-7 text-right text-[10px] font-medium text-foreground tabular-nums">{pct}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BrandResponseCard() {
  const intent = [
    { name: 'Nike',   pct: 54 },
    { name: 'Adidas', pct: 41 },
    { name: 'Puma',   pct: 28 },
  ]
  const attrs = [
    { label: 'Innovation', nike: 72, adidas: 55 },
    { label: 'Style',      nike: 68, adidas: 62 },
    { label: 'Value',      nike: 54, adidas: 61 },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-2"
    >
      {/* Purchase intent */}
      <div className="flex-1 rounded-xl border border-border bg-background p-2.5">
        <p className="text-[10px] font-semibold text-foreground mb-2">Purchase Intent, 18–34</p>
        <div className="space-y-1.5">
          {intent.map(({ name, pct }, i) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-9 text-[10px] text-secondary-foreground shrink-0">{name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary/65"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.55, delay: i * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="text-[10px] font-medium text-foreground tabular-nums">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Attribute comparison */}
      <div className="flex-1 rounded-xl border border-border bg-background p-2.5">
        <p className="text-[10px] font-semibold text-foreground mb-2">Brand Attributes</p>
        <div className="space-y-1.5">
          {attrs.map(({ label, nike, adidas }, i) => (
            <div key={label}>
              <span className="text-[10px] text-secondary-foreground">{label}</span>
              <div className="flex gap-0.5 h-1.5 mt-0.5">
                <motion.div
                  className="rounded-l-full bg-primary/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${nike / 2}%` }}
                  transition={{ duration: 0.55, delay: i * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="rounded-r-full bg-primary/25"
                  initial={{ width: 0 }}
                  animate={{ width: `${adidas / 2}%` }}
                  transition={{ duration: 0.55, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <span className="flex items-center gap-1 text-[9px] text-secondary-foreground">
            <span className="w-2 h-1 rounded-full bg-primary/70 inline-block" />Nike
          </span>
          <span className="flex items-center gap-1 text-[9px] text-secondary-foreground">
            <span className="w-2 h-1 rounded-full bg-primary/25 inline-block" />Adidas
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const RESPONSE_CARDS = {
  audience: AudienceResponseCard,
  geo: GeoResponseCard,
  brand: BrandResponseCard,
} as const

/* ── conversation data ─────────────────────────────────────────── */
const MODES = [
  {
    id: 'audience' as const,
    label: 'Audience Profiler',
    Icon: IconUsers,
    q: 'Who buys premium skincare in Germany, ages 25–40?',
  },
  {
    id: 'geo' as const,
    label: 'Geomarket Brief',
    Icon: IconWorld,
    q: 'Compare streaming adoption across EU markets.',
  },
  {
    id: 'brand' as const,
    label: 'Brand Position',
    Icon: IconTrendingUp,
    q: 'How does Nike compare to Adidas in purchase intent, 18–34?',
  },
]

type Phase = 'typing-q' | 'thinking' | 'showing-card' | 'done'

/* ── CARD: Research AI ─────────────────────────────────────────── */
function ResearchAICard() {
  const [modeIdx, setModeIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing-q')
  const [displayQ, setDisplayQ] = useState('')

  const mode = MODES[modeIdx]
  const ResponseCard = RESPONSE_CARDS[mode.id]

  // Reset when mode changes
  useEffect(() => {
    setPhase('typing-q')
    setDisplayQ('')
  }, [modeIdx])

  // Typewriter: question (50ms/char — deliberate pace)
  useEffect(() => {
    if (phase !== 'typing-q') return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayQ(mode.q.slice(0, i))
      if (i >= mode.q.length) {
        clearInterval(id)
        setTimeout(() => setPhase('thinking'), 700)
      }
    }, 50)
    return () => clearInterval(id)
  }, [phase, mode.q])

  // Thinking → show card
  useEffect(() => {
    if (phase !== 'thinking') return
    const id = setTimeout(() => setPhase('showing-card'), 1600)
    return () => clearTimeout(id)
  }, [phase])

  // Card shown → done
  useEffect(() => {
    if (phase !== 'showing-card') return
    const id = setTimeout(() => setPhase('done'), 800)
    return () => clearTimeout(id)
  }, [phase])

  // Done → advance
  useEffect(() => {
    if (phase !== 'done') return
    const id = setTimeout(() => setModeIdx(i => (i + 1) % MODES.length), 5000)
    return () => clearTimeout(id)
  }, [phase])

  return (
    <div className="flex flex-col h-full p-5">
      <FeatureLabel>Research AI</FeatureLabel>
      <h3 className="text-sm font-semibold text-foreground mb-1">Ask anything</h3>
      <p className="text-xs text-secondary-foreground leading-relaxed mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
        Type a plain-language question. The AI selects the right survey data, builds the audience, and writes the brief.
      </p>

      {/* mode pills */}
      <div className="flex flex-col gap-1.5 mb-4">
        {MODES.map(({ id, label, Icon }, idx) => {
          const active = id === mode.id
          return (
            <button
              key={id}
              onClick={() => { if (idx !== modeIdx) setModeIdx(idx) }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 text-left ${
                active
                  ? 'bg-primary/[0.07] border-primary/20 text-foreground'
                  : 'bg-muted/40 border-border text-secondary-foreground hover:border-primary/20 hover:text-foreground'
              }`}
            >
              <Icon
                size={13}
                strokeWidth={2}
                className={active ? 'text-primary' : 'text-secondary-foreground'}
              />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {/* conversation window — grows to fill remaining card height */}
      <div className="rounded-xl border border-border bg-background overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-2.5 p-3 overflow-hidden justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-2.5"
            >
              {/* user bubble */}
              {displayQ && (
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2">
                    <p className="text-[11px] leading-snug text-primary-foreground">
                      {displayQ}
                      {phase === 'typing-q' && (
                        <span className="inline-block w-px h-[10px] bg-primary-foreground/60 ml-0.5 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* thinking dots */}
              {phase === 'thinking' && (
                <div className="flex items-center gap-1.5 px-1">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0">
                    <IconSparkles size={10} strokeWidth={2} className="text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full bg-muted-foreground/40"
                        style={{ animation: `dotPulse 1.2s ${i * 0.22}s ease-in-out infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* rich response card */}
              {(phase === 'showing-card' || phase === 'done') && (
                <div className="flex gap-1.5 items-start">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0 mt-0.5">
                    <IconSparkles size={10} strokeWidth={2} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ResponseCard />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* input bar */}
        <div className="border-t border-border px-3 py-2 flex items-center gap-2 shrink-0">
          <span className="flex-1 text-[11px] text-secondary-foreground/40 truncate">
            {phase === 'done' ? 'Ask a follow-up…' : ''}
          </span>
          <div className="w-5 h-5 rounded-md bg-foreground/90 flex items-center justify-center shrink-0">
            <IconSend2 size={10} strokeWidth={2} className="text-background" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── CARD: Audience Builder ────────────────────────────────────── */

const AUDIENCE_CHIPS = [
  { id: 0, label: 'Age 25–40',    Icon: IconCalendar,    fx: 0.11, fy: 0.22 },
  { id: 1, label: 'Germany',      Icon: IconMapPin,      fx: 0.11, fy: 0.50 },
  { id: 2, label: 'Income €45k+', Icon: IconCoins,       fx: 0.11, fy: 0.78 },
  { id: 3, label: 'Women',        Icon: IconUsers,       fx: 0.76, fy: 0.22 },
  { id: 4, label: 'Online buyers',Icon: IconShoppingCart,fx: 0.76, fy: 0.50 },
  { id: 5, label: 'Mobile-first', Icon: IconDeviceMobile,fx: 0.76, fy: 0.78 },
] as const

const AUDIENCE_COUNTS = [0, 48200, 31600, 24860, 38100, 29400, 15800]

const BG_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  key: i,
  fx: ((i * 137 + 31) % 80 + 10) / 100,
  fy: ((i * 97 + 17) % 80 + 10) / 100,
  r: ((i * 53) % 3) + 1,
  op: ((i * 71) % 30 + 8) / 100,
}))

function AudienceCard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 580, h: 300 })
  const [activeChips, setActiveChips] = useState<number[]>([])
  const [pulsing, setPulsing] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setDims({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let rafId: number
    let currentCount = 0

    const animateCount = (target: number) => {
      const start = currentCount
      const diff = target - start
      const duration = 950
      const t0 = performance.now()
      cancelAnimationFrame(rafId)
      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1)
        const eased = 1 - (1 - t) ** 3
        currentCount = Math.round(start + diff * eased)
        setDisplayCount(currentCount)
        if (t < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    const run = (step: number, active: number[]) => {
      if (step >= AUDIENCE_CHIPS.length) {
        const t = setTimeout(() => {
          setActiveChips([])
          setPulsing(null)
          currentCount = 0
          setDisplayCount(0)
          const t2 = setTimeout(() => run(0, []), 700)
          timeouts.push(t2)
        }, 2800)
        timeouts.push(t)
        return
      }
      setPulsing(step)
      const t1 = setTimeout(() => {
        const newActive = [...active, step]
        setActiveChips(newActive)
        setPulsing(null)
        animateCount(AUDIENCE_COUNTS[newActive.length])
        const t2 = setTimeout(() => run(step + 1, newActive), 1900)
        timeouts.push(t2)
      }, 950)
      timeouts.push(t1)
    }

    const t0 = setTimeout(() => run(0, []), 700)
    timeouts.push(t0)
    return () => { timeouts.forEach(clearTimeout); cancelAnimationFrame(rafId) }
  }, [])

  const cx = dims.w / 2
  const cy = dims.h / 2

  const chipPx = AUDIENCE_CHIPS.map(c => ({ ...c, x: c.fx * dims.w, y: c.fy * dims.h }))

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* base surface */}
      <div className="absolute inset-0 bg-background" />

      {/* atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{
          width: 260, height: 260, left: cx - 130, top: cy - 130,
          background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 68%)',
        }} />
        <div className="absolute rounded-full" style={{
          width: 180, height: 180, left: -20, top: 0,
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 68%)',
        }} />
        <div className="absolute rounded-full" style={{
          width: 160, height: 160, right: -10, bottom: 0,
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 68%)',
        }} />
      </div>

      {/* background particles */}
      <svg className="absolute inset-0 pointer-events-none" width={dims.w} height={dims.h}>
        {BG_PARTICLES.map(p => (
          <circle key={p.key} cx={p.fx * dims.w} cy={p.fy * dims.h} r={p.r} fill="rgba(139,92,246,1)" opacity={p.op} />
        ))}
      </svg>

      {/* connection lines + pulse balls */}
      <svg className="absolute inset-0 pointer-events-none" width={dims.w} height={dims.h}>
        <defs>
          <filter id="ab-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {chipPx.map(chip => {
          const isActive = activeChips.includes(chip.id)
          return (
            <line
              key={chip.id}
              x1={chip.x} y1={chip.y} x2={cx} y2={cy}
              stroke={isActive ? 'rgba(139,92,246,0.40)' : 'rgba(180,170,220,0.18)'}
              strokeWidth={isActive ? 1 : 0.6}
              strokeDasharray={isActive ? '3 5' : '2 7'}
            />
          )
        })}
        {/* Pulse travel ball */}
        {pulsing !== null && (() => {
          const chip = chipPx[pulsing]
          return (
            <motion.circle
              key={`pulse-${pulsing}`}
              r={3.5}
              fill="rgba(139,92,246,0.9)"
              filter="url(#ab-glow)"
              initial={{ cx: chip.x, cy: chip.y, opacity: 1 }}
              animate={{ cx, cy, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
            />
          )
        })()}
      </svg>

      {/* attribute chips */}
      {chipPx.map((chip, idx) => {
        const isActive = activeChips.includes(chip.id)
        const isPulsing = pulsing === chip.id
        return (
          <motion.div
            key={chip.id}
            className="absolute pointer-events-none"
            style={{ left: chip.x, top: chip.y, translateX: '-50%', translateY: '-50%' }}
            animate={{ y: isActive ? 0 : [0, -5, 0] }}
            transition={isActive
              ? { duration: 0.3 }
              : { duration: 3.2 + idx * 0.45, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all duration-500 ${
                isActive
                  ? 'border-primary/25 text-primary'
                  : isPulsing
                  ? 'border-primary/15 text-primary/60'
                  : 'bg-background/80 border-border text-secondary-foreground'
              }`}
              style={{
                background: isActive ? 'rgba(139,92,246,0.07)' : undefined,
                boxShadow: isActive
                  ? '0 0 16px rgba(139,92,246,0.22), 0 1px 4px rgba(0,0,0,0.05)'
                  : '0 1px 4px rgba(0,0,0,0.07)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <chip.Icon size={11} strokeWidth={2} className={isActive ? 'text-primary' : 'text-secondary-foreground'} />
              {chip.label}
            </div>
          </motion.div>
        )
      })}

      {/* central audience card */}
      <motion.div
        className="absolute bg-background rounded-xl border border-border"
        style={{
          width: 192,
          left: cx - 96,
          top: cy - 62,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.09)',
        }}
        animate={{ scale: pulsing !== null ? 1.025 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-3">
          <p className="text-[10px] text-secondary-foreground mb-0.5">Audience segment</p>
          <p className="text-xs font-semibold text-foreground mb-2 leading-snug">Premium Skincare Buyers</p>
          <div className="flex flex-wrap gap-1 min-h-[18px] mb-2.5">
            <AnimatePresence>
              {activeChips.slice(0, 4).map(id => (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.25 }}
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-medium text-primary border border-primary/20"
                  style={{ background: 'rgba(139,92,246,0.07)' }}
                >
                  {AUDIENCE_CHIPS[id].label}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="border-t border-border pt-2 flex items-baseline gap-1">
            <span className="text-[15px] font-semibold text-foreground tabular-nums leading-none">
              {displayCount > 0 ? displayCount.toLocaleString('en-US') : '—'}
            </span>
            {displayCount > 0 && (
              <span className="text-[10px] text-secondary-foreground">respondents</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* label overlay */}
      <div className="absolute top-3.5 left-4 pointer-events-none">
        <FeatureLabel>Audience Builder</FeatureLabel>
      </div>
    </div>
  )
}

/* ── CARD: Dashboard ───────────────────────────────────────────── */
function DashboardCard() {
  const dashboards = [
    { name: 'DE Consumer Tracker Q2', charts: 8, updated: '2h ago' },
    { name: 'EU Streaming Landscape', charts: 5, updated: 'Yesterday' },
    { name: 'Nike vs Adidas — 18–34', charts: 6, updated: '3d ago' },
  ]
  return (
    <div className="flex flex-col h-full p-5">
      <FeatureLabel>Dashboards</FeatureLabel>
      <h3 className="text-sm font-semibold text-foreground mb-1">Share and present</h3>
      <p className="text-xs text-secondary-foreground leading-relaxed mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
        Saved dashboards stay live. Filters update every chart. Export to PDF or share a link.
      </p>
      <div className="flex-1 rounded-xl border border-border overflow-hidden bg-background min-h-0 flex flex-col">
        <div className="flex-1 divide-y divide-border overflow-hidden">
          {dashboards.map(({ name, charts, updated }) => (
            <div key={name} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border shrink-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-[1px] bg-primary/30" />
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{name}</p>
                <p className="text-[10px] text-secondary-foreground">{charts} charts · {updated}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] text-secondary-foreground">3 dashboards</span>
          <span className="text-[10px] font-medium text-primary">Export PDF</span>
        </div>
      </div>
    </div>
  )
}

/* ── CARD: Canvas ──────────────────────────────────────────────── */
function CanvasCard() {
  return (
    <div className="flex flex-col h-full p-5">
      <FeatureLabel>Dashboard Canvas</FeatureLabel>
      <h3 className="text-sm font-semibold text-foreground mb-1">Drag, drop, export</h3>
      <p className="text-xs text-secondary-foreground leading-relaxed mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
        Drop survey questions onto a canvas. Charts build instantly with audience and region filters applied globally.
      </p>
      <div className="flex-1 rounded-xl border border-border overflow-hidden flex bg-background min-h-0">
        <div className="w-28 shrink-0 border-r border-border bg-muted/30 p-2 space-y-px overflow-hidden">
          <p className="text-[9px] font-medium text-secondary-foreground px-1 pb-1.5 uppercase tracking-[0.06em]">Popular</p>
          {['Age distribution', 'Gender', 'Income bracket', 'Purchase intent', 'Device type'].map(item => (
            <div key={item} className="flex items-center gap-1.5 px-1.5 py-1 rounded">
              <div className="w-1 h-1 rounded-full bg-border shrink-0" />
              <span className="text-[9px] text-secondary-foreground truncate">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 p-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="rounded-lg border border-border p-2 bg-background">
              <div className="h-1.5 w-12 rounded bg-muted mb-2" />
              <div className="flex items-end gap-0.5 h-10">
                {[50, 75, 40, 90, 60, 35, 80].map((h, i) => (
                  <div key={i} className="flex-1 rounded-[1px] bg-primary/25" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border p-2 bg-background flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(221 83% 53%)" strokeWidth="10" strokeDasharray="48 40" strokeDashoffset="0" opacity="0.7" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(221 83% 53%)" strokeWidth="10" strokeDasharray="25 63" strokeDashoffset="-48" opacity="0.25" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── CARD: Chart Library ───────────────────────────────────────── */
function ChartsCard() {
  return (
    <div className="flex flex-col h-full p-5">
      <FeatureLabel>Chart Library</FeatureLabel>
      <h3 className="text-sm font-semibold text-foreground mb-1">55+ ready-made charts</h3>
      <p className="text-xs text-secondary-foreground leading-relaxed mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
        Browse pre-built survey charts by topic. Filter by audience, cross-tab by any dimension, save to a dashboard.
      </p>
      <div className="flex-1 rounded-xl border border-border overflow-hidden bg-background min-h-0">
        <div className="p-2 space-y-px">
          {[
            { label: 'Characteristics & demographics', count: 3 },
            { label: 'AI & smart technology',          count: 2 },
            { label: 'Finance',                        count: 4 },
            { label: 'Food & consumption',             count: 3 },
            { label: 'Health',                         count: 3 },
            { label: 'Media & news',                   count: 3 },
          ].map(({ label, count }) => (
            <div key={label} className="flex items-center justify-between px-2.5 py-1.5 rounded">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                <span className="text-xs text-secondary-foreground">{label}</span>
              </div>
              <span className="text-[10px] font-medium text-secondary-foreground/60 tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── main section ──────────────────────────────────────────────── */
export function HowItWorks() {
  return (
    <section className="bg-background py-24">
      <div className="max-w-[1264px] mx-auto px-6">

        <motion.div
          className="mb-14 max-w-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-5"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Start anywhere.
            <br />End with the answer.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base text-secondary-foreground leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Ask a question, define an audience, or pick a chart — every path
            leads to the same canvas, and the same export.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="bento-grid grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div variants={scaleSettle} className="md:row-span-2 h-full">
            <BentoCard className="h-full bg-muted/30">
              <ResearchAICard />
            </BentoCard>
          </motion.div>

          <motion.div variants={scaleSettle} className="h-full">
            <BentoCard className="h-full bg-background">
              <AudienceCard />
            </BentoCard>
          </motion.div>

          <motion.div variants={scaleSettle} className="h-full">
            <BentoCard className="h-full bg-muted/30">
              <ChartsCard />
            </BentoCard>
          </motion.div>

          <motion.div variants={scaleSettle} className="h-full">
            <BentoCard className="h-full bg-background">
              <DashboardCard />
            </BentoCard>
          </motion.div>

          <motion.div variants={scaleSettle} className="h-full">
            <BentoCard className="h-full bg-muted/30">
              <CanvasCard />
            </BentoCard>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
