import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { stagger, fadeUp } from '../variants'

type Expanded = null | 0 | 1 | 2

const FLEX_OPEN = 2.6
const FLEX_COMPRESSED = 0.72

/* ── Mini cards data ─────────────────────────────────────────────── */
const MINI_CARDS = [
  { id: 0,  type: 'stat',  label: 'Brand Awareness · DE', value: '62%',  sub: 'Q2 2025' },
  { id: 1,  type: 'bar',   label: 'Age Distribution',     bars: [38,62,80,55,28,14] },
  { id: 2,  type: 'stat',  label: 'Online Shoppers',       value: '284k', sub: 'Germany' },
  { id: 3,  type: 'table', label: 'Purchase Intent',       rows: ['Nike · 54%','Adidas · 41%','Puma · 28%'] },
  { id: 4,  type: 'stat',  label: 'Weekly buyers',         value: '43%',  sub: 'of target segment' },
  { id: 5,  type: 'bar',   label: 'Income Brackets',       bars: [22,44,55,34,20] },
  { id: 6,  type: 'table', label: 'EU Markets',            rows: ['Sweden · 78%','Germany · 62%','France · 58%'] },
  { id: 7,  type: 'stat',  label: 'NPS Score',             value: '+34',  sub: 'vs +21 industry avg' },
  { id: 8,  type: 'bar',   label: 'Streaming Adoption',    bars: [50,70,60,80,45,30] },
  { id: 9,  type: 'stat',  label: 'Mobile-first users',    value: '71%',  sub: 'Urban, 25–34' },
  { id: 10, type: 'table', label: 'Age × Purchase',        rows: ['25–34 · 61%','35–44 · 49%','45–54 · 33%'] },
  { id: 11, type: 'stat',  label: 'Subscription rate',     value: '38%',  sub: 'Streaming svc.' },
]

function MiniCard({ card, expanded }: { card: typeof MINI_CARDS[0]; expanded?: boolean }) {
  return (
    <div style={{
      background: 'var(--background)',
      border: '1px solid hsl(var(--border))',
      borderRadius: 8,
      padding: expanded ? '9px 11px' : '7px 9px',
      flexShrink: 0,
    }}>
      <p style={{ fontSize: 9, fontWeight: 500, color: 'hsl(var(--secondary-foreground))', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {card.label}
      </p>
      {card.type === 'stat' && (
        <>
          <p style={{ fontSize: expanded ? 17 : 14, fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1, marginBottom: expanded ? 2 : 0 }}>
            {(card as any).value}
          </p>
          {expanded && <p style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))' }}>{(card as any).sub}</p>}
        </>
      )}
      {card.type === 'bar' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: expanded ? 26 : 18 }}>
          {(card as any).bars.map((h: number, i: number) => (
            <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', background: 'hsl(var(--primary) / 0.3)', height: `${h}%` }} />
          ))}
        </div>
      )}
      {card.type === 'table' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(card as any).rows.slice(0, 3).map((r: string, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'hsl(var(--secondary-foreground))' }}>
              <span>{r.split(' · ')[0]}</span>
              <span style={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>{r.split(' · ')[1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Column 1: Raw data ──────────────────────────────────────────── */
function RawDataColumn({ expanded }: { expanded: boolean }) {
  const DOUBLED = [...MINI_CARDS, ...MINI_CARDS]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div key="scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <motion.div
              animate={{ y: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DOUBLED.map((card, i) => (
                <MiniCard key={i} card={card} />
              ))}
            </motion.div>
            {/* top + bottom fades */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 12%, transparent 82%, hsl(var(--background)) 100%)' }} />
            {/* right-edge directional fade */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, transparent 50%, hsl(var(--background)) 100%)' }} />
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, overflow: 'auto' }}>
            <p style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>170,402</span> survey responses · <span style={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>22 categories</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {MINI_CARDS.map(card => (
                <MiniCard key={card.id} card={card} expanded />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Column 2: Research AI ───────────────────────────────────────── */
const QUERY = 'Who are the heaviest online shoppers in Germany, 25–40?'

type AIPhase = 'typing' | 'thinking' | 'result' | 'fade'

function ResearchAIColumn({ expanded }: { expanded: boolean }) {
  const [phase, setPhase] = useState<AIPhase>('typing')
  const [typed, setTyped] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    const loop = () => {
      setTyped(''); setPhase('typing')
      let i = 0
      intervalRef.current = setInterval(() => {
        i++; setTyped(QUERY.slice(0, i))
        if (i >= QUERY.length) {
          clear()
          timerRef.current = setTimeout(() => {
            setPhase('thinking')
            timerRef.current = setTimeout(() => {
              setPhase('result')
              timerRef.current = setTimeout(() => {
                setPhase('fade')
                timerRef.current = setTimeout(loop, 400)
              }, 3200)
            }, 1200)
          }, 300)
        }
      }, 38)
    }
    loop()
    return clear
  }, [])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            {/* Query bubble */}
            <div style={{ background: 'hsl(var(--primary) / 0.07)', border: '1px solid hsl(var(--primary) / 0.2)', borderRadius: '8px 8px 3px 8px', padding: '8px 10px', minHeight: 46 }}>
              <p style={{ fontSize: 11, color: 'hsl(var(--foreground))', lineHeight: 1.5 }}>
                {typed}
                {phase === 'typing' && <span style={{ display: 'inline-block', width: 1, height: 11, background: 'hsl(var(--primary))', marginLeft: 2, animation: 'ps-blink 0.9s infinite' }} />}
              </p>
            </div>
            {/* Thinking */}
            <AnimatePresence>
              {phase === 'thinking' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid hsl(var(--primary))', borderTopColor: 'transparent', animation: 'ps-spin 0.7s linear infinite' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'hsl(var(--muted-foreground) / 0.4)', animation: `ps-dot 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Result */}
            <AnimatePresence>
              {(phase === 'result' || phase === 'fade') && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: phase === 'fade' ? 0 : 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <div style={{ background: 'hsl(var(--primary) / 0.06)', border: '1px solid hsl(var(--primary) / 0.2)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 9, color: 'hsl(var(--secondary-foreground))', marginBottom: 2 }}>Estimated reach</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1 }}>284k</p>
                      </div>
                      <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.25)', color: 'hsl(var(--primary))', fontWeight: 500 }}>Germany</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {['Women 25–40','Online buyers','€45k+'].map(t => (
                        <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99, background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--secondary-foreground))' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '90%', background: 'hsl(var(--primary))', borderRadius: '12px 12px 3px 12px', padding: '8px 12px' }}>
                <p style={{ fontSize: 12, color: 'hsl(var(--primary-foreground))', lineHeight: 1.5 }}>
                  {typed}
                  {phase === 'typing' && <span style={{ display: 'inline-block', width: 1, height: 12, background: 'rgba(255,255,255,0.7)', marginLeft: 2, animation: 'ps-blink 0.9s infinite' }} />}
                </p>
              </div>
            </div>
            <AnimatePresence>
              {phase === 'thinking' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', border: '1.5px solid hsl(var(--primary))', borderTopColor: 'transparent', animation: 'ps-spin 0.7s linear infinite' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'hsl(var(--muted-foreground) / 0.4)', animation: `ps-dot 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {(phase === 'result' || phase === 'fade') && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ background: 'hsl(var(--primary) / 0.05)', border: '1px solid hsl(var(--primary) / 0.18)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 10, color: 'hsl(var(--secondary-foreground))', marginBottom: 2 }}>Estimated reach</p>
                        <p style={{ fontSize: 26, fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1 }}>284k</p>
                      </div>
                      <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 99, alignSelf: 'flex-start', background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.25)', color: 'hsl(var(--primary))', fontWeight: 500 }}>Germany</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                      {[['Age 25–40','100%'],['Online buyers','78%'],['Weekly+','43%']].map(([l,v]) => (
                        <div key={l} style={{ background: 'hsl(var(--muted))', borderRadius: 6, padding: '6px 8px' }}>
                          <p style={{ fontSize: 9, color: 'hsl(var(--secondary-foreground))', marginBottom: 2 }}>{l}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--foreground))' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: 8 }}>
                      <p style={{ fontSize: 11, color: 'hsl(var(--secondary-foreground))', lineHeight: 1.5 }}>
                        Filters: <span style={{ color: 'hsl(var(--foreground))' }}>Women · Urban · Income €45k+ · Mobile-first · Weekly purchase intent</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', borderRadius: 8, padding: '7px 10px' }}>
              <span style={{ flex: 1, fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Ask a follow-up…</span>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: 'hsl(var(--foreground))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="hsl(var(--background))" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Column 3: Export ────────────────────────────────────────────── */
const REPORT_WORDS = 'Online shoppers aged 25–40 in Germany represent a high-value segment. 78% transact weekly — significantly above the EU average of 61%. Income skews above median, with 54% reporting €45k+. Brand affinity is strong for premium sportswear and consumer electronics.'.split(' ')
const BAR_H = [48,72,38,84,60,92,44,68]

function ExportColumn({ expanded }: { expanded: boolean }) {
  const [wordIdx, setWordIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    const speed = expanded ? 50 : 80
    const loop = () => {
      setWordIdx(0)
      let i = 0
      intervalRef.current = setInterval(() => {
        i++; setWordIdx(i)
        if (i >= REPORT_WORDS.length) {
          clear()
          timerRef.current = setTimeout(loop, 2800)
        }
      }, speed)
    }
    loop()
    return clear
  }, [expanded])

  const text = REPORT_WORDS.slice(0, wordIdx).join(' ')
  const isStreaming = wordIdx < REPORT_WORDS.length

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: 'var(--background)', border: '1px solid hsl(var(--border))', borderRadius: 8, padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
              <div>
                <div style={{ width: '72%', height: 8, borderRadius: 3, background: 'hsl(var(--foreground) / 0.14)', marginBottom: 5 }} />
                <div style={{ width: '48%', height: 6, borderRadius: 3, background: 'hsl(var(--foreground) / 0.07)' }} />
              </div>
              <div style={{ height: 1, background: 'hsl(var(--border))' }} />
              <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <p style={{ fontSize: 10, color: 'hsl(var(--secondary-foreground))', lineHeight: 1.7 }}>
                  {text}
                  {isStreaming && <span style={{ display: 'inline-block', width: 1, height: 10, background: 'hsl(var(--primary))', marginLeft: 1, animation: 'ps-blink 0.9s infinite' }} />}
                </p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to bottom, transparent, var(--background))' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24, marginTop: 'auto' }}>
                {BAR_H.map((h,i) => (
                  <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', background: 'hsl(var(--primary) / 0.25)', height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div style={{ padding: '7px 0', borderRadius: 7, background: 'hsl(var(--foreground))', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'hsl(var(--background))' }}>Export as PowerPoint →</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--background)', border: '1px solid hsl(var(--border))', borderRadius: 10, padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 2 }}>German Online Shoppers</p>
                <p style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Market Brief · Q2 2025 · 284k respondents</p>
              </div>
              <div style={{ height: 1, background: 'hsl(var(--border))' }} />
              <p style={{ fontSize: 12, color: 'hsl(var(--secondary-foreground))', lineHeight: 1.65, flex: 1 }}>
                {text}
                {isStreaming && <span style={{ display: 'inline-block', width: 1, height: 12, background: 'hsl(var(--primary))', marginLeft: 2, animation: 'ps-blink 0.9s infinite' }} />}
              </p>
              <div style={{ background: 'hsl(var(--muted))', borderRadius: 7, padding: '8px 10px' }}>
                <p style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))', marginBottom: 6 }}>Fig 1. Shopping Frequency</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 36 }}>
                  {BAR_H.map((_h, i) => (
                    <motion.div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', background: 'hsl(var(--primary) / 0.45)', originY: 1 }}
                      animate={{ scaleY: [0.2, 1] }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.04 }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, padding: '9px 0', borderRadius: 8, background: 'hsl(var(--foreground))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--background))' }}>Export as PowerPoint →</span>
              </div>
              <div style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12, color: 'hsl(var(--secondary-foreground))' }}>PDF</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Flow arrow with traveling dots ─────────────────────────────── */
function FlowArrow() {
  return (
    <div style={{ width: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'hsl(var(--border))', transform: 'translateX(-50%)' }} />

      {[0, 0.55, 1.1].map((delay, i) => (
        <motion.div key={i} style={{
          position: 'absolute',
          width: 5, height: 5, borderRadius: '50%',
          background: 'hsl(var(--primary) / 0.55)',
          top: `${42 + i * 6}%`,
          zIndex: 2,
        }}
          animate={{ x: [-20, 56], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeOut', repeatDelay: 0.9 }}
        />
      ))}

      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4h6M5 2l2 2-2 2" stroke="hsl(var(--muted-foreground))" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ── Main section ────────────────────────────────────────────────── */
export function ProductStates() {
  const [expanded, setExpanded] = useState<Expanded>(null)
  const reduced = useReducedMotion()

  const flexFor = (i: number) => {
    if (expanded === null) return 1
    return expanded === i ? FLEX_OPEN : FLEX_COMPRESSED
  }

  const toggle = (i: Expanded) => setExpanded(prev => prev === i ? null : i)

  const STEP_META = [
    { num: '01', label: 'Raw data',    sub: '170,402 responses · 22 categories' },
    { num: '02', label: 'Research AI', sub: 'Ask in plain language'              },
    { num: '03', label: 'Export',      sub: 'One-click to deck or PDF'           },
  ]

  return (
    <section className="bg-muted py-24">
      <div className="max-w-[1264px] mx-auto px-6">

        <motion.div className="mb-12 max-w-xl"
          variants={reduced ? {} : stagger} initial={reduced ? false : 'hidden'}
          whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.p variants={reduced ? {} : fadeUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground mb-4 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            The AI Path
          </motion.p>
          <motion.h2 variants={reduced ? {} : fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15]"
            style={{ textWrap: 'balance' } as React.CSSProperties}>
            Ask. Build. Export.
          </motion.h2>
        </motion.div>

        {/* Step nav */}
        <div style={{ display: 'flex', marginBottom: 10 }}>
          {STEP_META.map((s, i) => (
            <div key={i} style={{ display: 'flex', minWidth: 0 }}>
              <motion.button
                onClick={() => toggle(i as Expanded)}
                animate={{ flex: flexFor(i) }}
                transition={{ type: 'spring', stiffness: 300, damping: 40 }}
                style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, overflow: 'hidden' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'ui-monospace,monospace', color: expanded === i ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', flexShrink: 0 }}>{s.num}</span>
                  <span style={{ fontSize: 13, fontWeight: expanded === i ? 600 : 400, color: expanded === i ? 'hsl(var(--foreground))' : 'hsl(var(--secondary-foreground))', transition: 'all 0.2s', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.label}</span>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 0 }}>
                        · {s.sub}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div style={{ height: 2, borderRadius: 1, background: 'hsl(var(--primary))', marginTop: 6 }}
                  animate={{ scaleX: expanded === i ? 1 : 0, opacity: expanded === i ? 1 : 0 }}
                  transition={{ duration: 0.22 }} />
              </motion.button>
              {i < 2 && <div style={{ width: 36, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* Columns */}
        <div style={{ display: 'flex', height: 500 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', minWidth: 0, flex: 1 }}>
              <motion.div
                animate={{ flex: flexFor(i) }}
                transition={{ type: 'spring', stiffness: 300, damping: 40 }}
                onClick={() => toggle(i as Expanded)}
                style={{ flex: 1, minWidth: 0, background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 12, padding: 16, overflow: 'hidden', cursor: expanded === i ? 'default' : 'pointer' }}>
                {i === 0 && <RawDataColumn expanded={expanded === 0} />}
                {i === 1 && <ResearchAIColumn expanded={expanded === 1} />}
                {i === 2 && <ExportColumn expanded={expanded === 2} />}
              </motion.div>
              {i < 2 && <FlowArrow />}
            </div>
          ))}
        </div>

        {expanded === null && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground text-center mt-5">
            Click any step to expand
          </motion.p>
        )}

      </div>

      <style>{`
        @keyframes ps-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ps-spin  { to { transform: rotate(360deg) } }
        @keyframes ps-dot   { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </section>
  )
}
