import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconUsers,
  IconWorld,
  IconTrendingUp,
  IconSparkles,
  IconSend2,
} from '@tabler/icons-react'
import { stagger, fadeUp } from '../variants'

/* ── FeatureCard shell ───────────────────────────────────────────── */
interface CardProps {
  label: string
  title: string
  body: string
  proof?: string
  haloBase: string
  haloExtra: string
  screenshot: React.ReactNode
  large?: boolean
}

function FeatureCard({ label, title, body, proof, haloBase, haloExtra, screenshot, large }: CardProps) {
  return (
    <div
      className={`bento-card group relative rounded-2xl border border-border bg-background
        transition-[border-color] duration-200 ease-linear
        ${large ? 'h-[480px]' : 'h-[400px]'}`}
    >
      <div className="relative flex flex-col h-full rounded-2xl overflow-hidden">
        {/* Text area */}
        <div className="shrink-0 p-6 flex flex-col gap-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <h3 className={`font-semibold text-foreground leading-snug ${large ? 'text-xl' : 'text-base'}`}>
            {title}
          </h3>
          <p
            className="text-sm text-secondary-foreground leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {body}
          </p>
          {proof && (
            <p className="text-xs text-muted-foreground mt-0.5">{proof}</p>
          )}
        </div>

        {/* Screenshot area */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: haloBase }} />
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: haloExtra }}
          />
          <div className="relative h-full">
            {screenshot}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Research AI animated chat panel ────────────────────────────── */

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
          <span key={tag} className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/15">
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
          <motion.div key={name} className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.15 }}>
            <span className="w-12 text-[10px] text-secondary-foreground shrink-0">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary/65" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }} />
            </div>
            <span className="w-7 text-right text-[10px] font-medium text-foreground tabular-nums">{pct}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BrandResponseCard() {
  const intent = [{ name: 'Nike', pct: 54 }, { name: 'Adidas', pct: 41 }, { name: 'Puma', pct: 28 }]
  const attrs = [{ label: 'Innovation', nike: 72, adidas: 55 }, { label: 'Style', nike: 68, adidas: 62 }, { label: 'Value', nike: 54, adidas: 61 }]
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex gap-2">
      <div className="flex-1 rounded-xl border border-border bg-background p-2.5">
        <p className="text-[10px] font-semibold text-foreground mb-2">Purchase Intent, 18–34</p>
        <div className="space-y-1.5">
          {intent.map(({ name, pct }, i) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-9 text-[10px] text-secondary-foreground shrink-0">{name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary/65" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.55, delay: i * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }} />
              </div>
              <span className="text-[10px] font-medium text-foreground tabular-nums">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-border bg-background p-2.5">
        <p className="text-[10px] font-semibold text-foreground mb-2">Brand Attributes</p>
        <div className="space-y-1.5">
          {attrs.map(({ label, nike, adidas }, i) => (
            <div key={label}>
              <span className="text-[10px] text-secondary-foreground">{label}</span>
              <div className="flex gap-0.5 h-1.5 mt-0.5">
                <motion.div className="rounded-l-full bg-primary/70" initial={{ width: 0 }} animate={{ width: `${nike / 2}%` }} transition={{ duration: 0.55, delay: i * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }} />
                <motion.div className="rounded-r-full bg-primary/25" initial={{ width: 0 }} animate={{ width: `${adidas / 2}%` }} transition={{ duration: 0.55, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <span className="flex items-center gap-1 text-[9px] text-secondary-foreground"><span className="w-2 h-1 rounded-full bg-primary/70 inline-block" />Nike</span>
          <span className="flex items-center gap-1 text-[9px] text-secondary-foreground"><span className="w-2 h-1 rounded-full bg-primary/25 inline-block" />Adidas</span>
        </div>
      </div>
    </motion.div>
  )
}

const RESPONSE_CARDS = { audience: AudienceResponseCard, geo: GeoResponseCard, brand: BrandResponseCard } as const

const MODES = [
  { id: 'audience' as const, label: 'Audience Profiler',  Icon: IconUsers,       q: 'Who buys premium skincare in Germany, ages 25–40?' },
  { id: 'geo'      as const, label: 'Geomarket Brief',    Icon: IconWorld,       q: 'Compare streaming adoption across EU markets.' },
  { id: 'brand'    as const, label: 'Brand Position',     Icon: IconTrendingUp,  q: 'How does Nike compare to Adidas in purchase intent, 18–34?' },
]

type Phase = 'typing-q' | 'thinking' | 'showing-card' | 'done'

function ResearchAIChatPanel() {
  const [modeIdx, setModeIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing-q')
  const [displayQ, setDisplayQ] = useState('')
  const mode = MODES[modeIdx]
  const ResponseCard = RESPONSE_CARDS[mode.id]

  useEffect(() => { setPhase('typing-q'); setDisplayQ('') }, [modeIdx])

  useEffect(() => {
    if (phase !== 'typing-q') return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayQ(mode.q.slice(0, i))
      if (i >= mode.q.length) { clearInterval(id); setTimeout(() => setPhase('thinking'), 700) }
    }, 50)
    return () => clearInterval(id)
  }, [phase, mode.q])

  useEffect(() => {
    if (phase !== 'thinking') return
    const id = setTimeout(() => setPhase('showing-card'), 1600)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'showing-card') return
    const id = setTimeout(() => setPhase('done'), 800)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'done') return
    const id = setTimeout(() => setModeIdx(i => (i + 1) % MODES.length), 5000)
    return () => clearTimeout(id)
  }, [phase])

  return (
    <div className="absolute inset-0 flex flex-col px-4 pb-4 gap-2.5">
      {/* Mode pills — horizontal row */}
      <div className="flex gap-1.5 shrink-0">
        {MODES.map(({ id, label, Icon }, idx) => {
          const active = id === mode.id
          return (
            <button
              key={id}
              onClick={() => { if (idx !== modeIdx) setModeIdx(idx) }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 whitespace-nowrap ${
                active
                  ? 'bg-primary/[0.07] border-primary/20 text-foreground'
                  : 'bg-muted/40 border-border text-secondary-foreground hover:border-primary/20 hover:text-foreground'
              }`}
            >
              <Icon size={12} strokeWidth={2} className={active ? 'text-primary' : 'text-secondary-foreground'} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Conversation window */}
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
              {phase === 'thinking' && (
                <div className="flex items-center gap-1.5 px-1">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0">
                    <IconSparkles size={10} strokeWidth={2} className="text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40"
                        style={{ animation: `dotPulse 1.2s ${i * 0.22}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              )}
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

/* ── Other screenshot mocks ──────────────────────────────────────── */

const AB_DOTS = [
  { cx: 30, cy: 28, delay: 0 },
  { cx: 70, cy: 20, delay: 0.5 },
  { cx: 85, cy: 45, delay: 1.1 },
  { cx: 55, cy: 35, delay: 0.8 },
  { cx: 18, cy: 50, delay: 1.4 },
  { cx: 42, cy: 18, delay: 0.3 },
  { cx: 78, cy: 60, delay: 1.7 },
  { cx: 22, cy: 68, delay: 0.6 },
]

function AudienceBuilderScreenshot() {
  const filters = [
    { label: 'Gender',   value: 'Women',    active: true },
    { label: 'Age',      value: '25–40',    active: true },
    { label: 'Income',   value: '€45k+',    active: true },
    { label: 'Market',   value: 'Germany',  active: true },
    { label: 'Platform', value: 'Mobile',   active: false },
  ]
  return (
    <div className="absolute inset-0">
      {/* Pulse rings — centered in upper visible area, pointer-events-none */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center" style={{ paddingTop: '10%' }}>
        {/* Concentric expanding rings */}
        {[0, 0.7, 1.4, 2.1].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-violet-400/40"
            style={{ width: 40 + i * 0, height: 40 + i * 0 }}
            animate={{ scale: [1, 4 + i * 1.2], opacity: [0.5, 0] }}
            transition={{ duration: 2.8, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        {/* Center dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-violet-400/70"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Outer glow */}
        <div className="absolute w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }} />
      </div>

      {/* Scattered dots — pointer-events-none */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {AB_DOTS.map((p, i) => (
          <motion.circle
            key={i}
            cx={`${p.cx}%`} cy={`${p.cy}%`} r={1.5}
            fill="rgba(139,92,246,0.65)"
            animate={{ opacity: [0.15, 0.7, 0.15], scale: [1, 1.8, 1] }}
            transition={{ duration: 2.6, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {/* Foreground UI */}
      <div className="absolute inset-0 flex flex-col justify-end pb-4 px-4 gap-2">
        <div className="rounded-xl border border-border bg-background px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-secondary-foreground mb-0.5">Estimated reach</p>
            <p className="text-xl font-semibold text-foreground tabular-nums leading-none">284k</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-primary/60" />
              </div>
              <span className="text-[10px] text-muted-foreground">62%</span>
            </div>
            <p className="text-[9px] text-muted-foreground">quality score</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.07em] text-muted-foreground mb-2">Active filters</p>
          <div className="flex flex-wrap gap-1.5">
            {filters.map(f => (
              <div key={f.label} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium ${f.active ? 'bg-primary/8 border-primary/25 text-foreground' : 'bg-muted/40 border-border text-muted-foreground'}`}>
                <span className="text-muted-foreground">{f.label}</span>
                <span className={f.active ? 'text-primary' : 'text-muted-foreground'}>·</span>
                <span>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardScreenshot() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-2">
      <div className="flex gap-2 flex-1">
        <div className="flex-1 rounded-xl border border-border bg-background p-3 flex flex-col">
          <div className="h-1.5 w-16 rounded bg-muted mb-2" />
          <div className="flex-1 flex items-end gap-0.5">
            {[55, 80, 45, 92, 68, 38, 75, 60].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-[2px] bg-primary/25" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-background p-3 flex flex-col">
          <div className="h-1.5 w-12 rounded bg-muted mb-2" />
          <div className="flex-1 flex items-center justify-center">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="26" cy="26" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="75 51" opacity="0.65" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
              <circle cx="26" cy="26" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="28 98" strokeDashoffset="-75" opacity="0.3" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-1">
        <div className="flex-[2] rounded-xl border border-border bg-background p-3 flex flex-col">
          <div className="h-1.5 w-20 rounded bg-muted mb-2" />
          <div className="flex-1 relative">
            <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              <polyline points="0,32 20,28 40,20 60,22 80,12 100,8 120,10" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.7" strokeLinejoin="round" />
              <polyline points="0,32 20,28 40,20 60,22 80,12 100,8 120,10 120,40 0,40" fill="hsl(var(--primary))" fillOpacity="0.06" />
            </svg>
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-background p-3 flex flex-col justify-center gap-1">
          <div className="h-1.5 w-10 rounded bg-muted mb-1" />
          <p className="text-xl font-semibold text-primary tabular-nums leading-none">78%</p>
          <p className="text-[9px] text-muted-foreground">vs 71% last wave</p>
        </div>
      </div>
    </div>
  )
}

function ReportScreenshot() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-2">
      <div className="flex-1 rounded-xl border border-border bg-background overflow-hidden flex flex-col">
        <div className="h-6 border-b border-border bg-muted/40 flex items-center px-3 gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="flex-1 mx-2 h-3 rounded bg-muted" />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="h-1.5 w-8 rounded bg-primary/40 mb-2" />
            <div className="h-3 w-40 rounded bg-foreground/15 mb-1.5" />
            <div className="h-2 w-32 rounded bg-foreground/8" />
          </div>
          <div className="rounded-lg border border-border p-2 bg-muted/20">
            <div className="h-1.5 w-16 rounded bg-muted mb-2" />
            <div className="flex items-end gap-0.5 h-10">
              {[45, 70, 55, 85, 60, 40, 72].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-[1px] bg-primary/30" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded bg-foreground/8" />
            <div className="h-1.5 w-[90%] rounded bg-foreground/8" />
            <div className="h-1.5 w-[70%] rounded bg-foreground/8" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-7 rounded-lg border border-border bg-background flex items-center justify-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted" />
          <div className="h-1.5 w-10 rounded bg-muted" />
        </div>
        <div className="flex-1 h-7 rounded-lg bg-foreground flex items-center justify-center">
          <div className="h-1.5 w-14 rounded bg-background/30" />
        </div>
      </div>
    </div>
  )
}

function QuestionLibraryScreenshot() {
  const questions = [
    { q: 'How often do you purchase skincare products?', pct: 78 },
    { q: 'Which brands do you trust most for skincare?', pct: 62 },
    { q: 'Where do you primarily shop for beauty products?', pct: 54 },
    { q: 'How important is sustainability in your purchase?', pct: 47 },
  ]
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-2">
      <div className="rounded-xl border border-border bg-background flex items-center gap-2 px-3 py-2 shrink-0">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-muted-foreground shrink-0">
          <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M7.5 7.5L9.5 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span className="text-[11px] text-muted-foreground flex-1">Search 170,402 questions…</span>
      </div>
      <div className="flex-1 rounded-xl border border-border bg-background overflow-hidden">
        {questions.map((item, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2 ${i < questions.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-foreground leading-snug line-clamp-1">{item.q}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/50" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-[9px] text-muted-foreground tabular-nums w-6">{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CrosstabScreenshot() {
  const headers = ['18–24', '25–34', '35–44', '45–54']
  const rows = [
    { label: 'Daily',   vals: [38, 54, 47, 29] },
    { label: 'Weekly',  vals: [28, 31, 35, 40] },
    { label: 'Monthly', vals: [18, 10, 12, 22] },
    { label: 'Rarely',  vals: [16,  5,  6,  9] },
  ]
  const maxVal = 54
  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex-1 h-7 rounded-lg border border-border bg-background flex items-center px-2.5 gap-1.5">
          <div className="h-1.5 w-8 rounded bg-muted" />
          <div className="h-1.5 w-12 rounded bg-foreground/15" />
        </div>
        <div className="text-[10px] text-muted-foreground">by</div>
        <div className="flex-1 h-7 rounded-lg border border-primary/25 bg-primary/5 flex items-center px-2.5 gap-1.5">
          <div className="h-1.5 w-6 rounded bg-primary/40" />
          <div className="h-1.5 w-10 rounded bg-primary/30" />
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-border bg-background overflow-hidden">
        <div className="grid border-b border-border bg-muted/30" style={{ gridTemplateColumns: '80px repeat(4, 1fr)' }}>
          <div className="px-2.5 py-1.5" />
          {headers.map(h => (
            <div key={h} className="px-2 py-1.5 text-[9px] font-medium text-muted-foreground text-center">{h}</div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <div key={ri} className={`grid ${ri < rows.length - 1 ? 'border-b border-border' : ''}`} style={{ gridTemplateColumns: '80px repeat(4, 1fr)' }}>
            <div className="px-2.5 py-2 text-[9px] font-medium text-secondary-foreground">{row.label}</div>
            {row.vals.map((v, ci) => {
              const intensity = v / maxVal
              return (
                <div key={ci} className="px-2 py-2 flex items-center justify-center">
                  <span
                    className="text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded"
                    style={{
                      background: `rgba(59,130,246,${intensity * 0.15})`,
                      color: intensity > 0.6 ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))',
                    }}
                  >
                    {v}%
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Card data ───────────────────────────────────────────────────── */

const LARGE_CARDS = [
  {
    label: 'Research AI',
    title: 'Ask any question. Get the answer.',
    body: 'Describe your audience in plain language. The AI proposes the filters, audits the sample size, and explains every choice in the language of the source questions.',
    proof: 'Works across all 56 markets · No prompt engineering needed',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(59,130,246,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(59,130,246,0.07) 0%, transparent 75%)',
    screenshot: <ResearchAIChatPanel />,
  },
  {
    label: 'Audience Builder',
    title: 'Build any audience in minutes.',
    body: 'Connect gender, age, income, platform, market and attitude. Every node cites its source variable. Weighted reach updates as you compose — no rebuilding required.',
    proof: '284k matched respondents on average · Live reach estimate',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(139,92,246,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(139,92,246,0.07) 0%, transparent 75%)',
    screenshot: <AudienceBuilderScreenshot />,
  },
]

const ROW2_CARDS = [
  {
    label: 'Crosstab',
    title: 'Slice any data by any dimension.',
    body: 'Break any chart into segments — age, market, income, brand affinity. The crosstab updates instantly. No rebuilding, no re-querying.',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(236,72,153,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(236,72,153,0.07) 0%, transparent 75%)',
    screenshot: <CrosstabScreenshot />,
    wide: true,
  },
  {
    label: 'Question library',
    title: 'Search 170,402 questions as you think.',
    body: 'Browse by topic, market or wave. Hover any question to see the answer distribution. Click to add it to your canvas.',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(16,185,129,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(16,185,129,0.07) 0%, transparent 75%)',
    screenshot: <QuestionLibraryScreenshot />,
    wide: false,
  },
]

const ROW3_CARDS = [
  {
    label: 'Dashboard',
    title: 'Turn questions into charts, instantly.',
    body: 'Drag any survey question onto the canvas. Charts build themselves. Compare cohorts, waves and markets side by side.',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(6,182,212,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(6,182,212,0.07) 0%, transparent 75%)',
    screenshot: <DashboardScreenshot />,
    wide: false,
  },
  {
    label: 'Report',
    title: 'From dashboard to deck. One click.',
    body: 'Every dashboard becomes a slide deck or PDF. AI writes the section copy. Every chart links back to its source question — citable by default.',
    haloBase: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(245,158,11,0.13) 0%, transparent 75%)',
    haloExtra: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(245,158,11,0.07) 0%, transparent 75%)',
    screenshot: <ReportScreenshot />,
    wide: true,
  },
]

/* ── Section ─────────────────────────────────────────────────────── */

export function HowItWorks() {
  const reduced = useReducedMotion()
  const containerVariants = reduced ? {} : stagger
  const itemVariants = reduced ? {} : fadeUp

  return (
    <section className="bg-background py-24">
      <div className="max-w-[1264px] mx-auto px-6">

        {/* Section header */}
        <motion.div
          className="mb-14 max-w-2xl"
          variants={reduced ? {} : stagger}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            What it does
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-5"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Everything research needs.
            <br />Nothing it doesn't.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base text-secondary-foreground leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Six purpose-built tools. One workflow. No stitching together
            reports from multiple platforms.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-4"
        >
          {/* Row 1 — Research AI (wide) + Audience Builder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LARGE_CARDS.map((card, i) => (
              <motion.div key={card.label} variants={itemVariants} className={i === 0 ? 'md:col-span-2' : 'md:col-span-1'}>
                <FeatureCard {...card} large />
              </motion.div>
            ))}
          </div>

          {/* Row 2 — Crosstab (wide) + Question Library */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROW2_CARDS.map(card => (
              <motion.div key={card.label} variants={itemVariants} className={card.wide ? 'md:col-span-2' : 'md:col-span-1'}>
                <FeatureCard {...card} />
              </motion.div>
            ))}
          </div>

          {/* Row 3 — Dashboard + Report (wide) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROW3_CARDS.map(card => (
              <motion.div key={card.label} variants={itemVariants} className={card.wide ? 'md:col-span-2' : 'md:col-span-1'}>
                <FeatureCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
