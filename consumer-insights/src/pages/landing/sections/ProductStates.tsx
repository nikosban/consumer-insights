import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stagger, fadeUp } from '../variants'
import { cn } from '@/lib/utils'

const PROMPT = 'Who are the heaviest online shoppers in Germany, 25–40?'

const STATES = [
  { label: 'Research AI',       key: 'ask'    },
  { label: 'Dashboard canvas',  key: 'build'  },
  { label: 'Reports & exports', key: 'export' },
] as const

type StateKey = typeof STATES[number]['key']

// ── State 0 — Ask ────────────────────────────────────────────────────────────

function AskState() {
  const [typed, setTyped] = useState('')
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    setTyped('')
    setShowCard(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(PROMPT.slice(0, i))
      if (i >= PROMPT.length) {
        clearInterval(interval)
        setTimeout(() => setShowCard(true), 400)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* AI prompt input */}
      <div className="rounded-xl border border-border bg-background p-4 shadow-[var(--field-shadow)]">
        <p className="text-xs font-medium text-muted-foreground mb-2">Research AI</p>
        <p className="text-sm text-foreground min-h-[40px]">
          {typed}
          <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
        </p>
      </div>

      {/* Audience card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Estimated reach</p>
                <p className="text-2xl font-semibold text-foreground tabular-nums">284k</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Germany</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Age 25–40', value: '100%' },
                { label: 'Online buyers', value: '78%' },
                { label: 'Weekly+', value: '43%' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-muted p-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── State 1 — Build ──────────────────────────────────────────────────────────

const BAR_HEIGHTS = [55, 80, 42, 65, 90, 38, 72]

function BuildState() {
  const [dropped, setDropped] = useState(false)

  useEffect(() => {
    setDropped(false)
    const t = setTimeout(() => setDropped(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Question card */}
      <motion.div
        className="rounded-xl border border-border bg-muted/50 p-3 cursor-grab"
        animate={dropped ? { opacity: 0.4, y: 8 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs font-medium text-muted-foreground">Survey question</p>
        <p className="text-sm text-foreground mt-0.5">Online shopping frequency</p>
      </motion.div>

      {/* Canvas with chart growing in */}
      <div className="rounded-xl border border-border bg-background p-4 min-h-[160px]">
        <p className="text-xs font-medium text-muted-foreground mb-3">Online shopping frequency — Germany 25–40</p>
        <div className="flex items-end gap-1.5 h-24">
          {BAR_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-primary/70"
              initial={{ scaleY: 0 }}
              animate={dropped ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: i * 0.04,
              }}
              style={{ height: `${h}%`, originY: 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── State 2 — Export ─────────────────────────────────────────────────────────

const REPORT_TEXT = 'Online shoppers aged 25–40 in Germany represent a high-value segment with strong weekly purchase intent. 78% of respondents transact online at least once per week, significantly above the EU average of 61%. Income bracket skews above median, with 54% reporting household income over €45k. Key categories: fashion, electronics, and grocery.'

function ExportState() {
  const [wordIdx, setWordIdx] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const words = REPORT_TEXT.split(' ')

  useEffect(() => {
    setWordIdx(0)
    setDone(false)
    intervalRef.current = setInterval(() => {
      setWordIdx(prev => {
        if (prev >= words.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDone(true)
          return words.length
        }
        return prev + 1
      })
    }, 50)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Generated insight</p>
        <p className="text-sm text-foreground leading-relaxed min-h-[80px]">
          {words.slice(0, wordIdx).join(' ')}
          {!done && <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse" />}
        </p>
      </div>

      <AnimatePresence>
        {done && (
          <motion.button
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium"
          >
            Export as PowerPoint →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

const STATE_COPY: Record<StateKey, string> = {
  ask:    'Describe what you need. The AI proposes the audience, explains every filter, and shows its working.',
  build:  'Drag survey questions onto the canvas. Charts build themselves. Compare cohorts, waves and markets without rebuilding.',
  export: 'One click from dashboard to slide deck or PDF. AI writes the sections. Every chart links to its source question.',
}

export function ProductStates() {
  const [current, setCurrent] = useState<StateKey>('ask')

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Headline */}
        <motion.div
          className="mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            The AI path
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Ask. Build. Export.
            <br />The AI path, start to finish.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base text-muted-foreground"
          >
            One of many ways to start — but the fastest.
          </motion.p>
        </motion.div>

        {/* Two-column layout: left = interactive, right = copy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — animated product state */}
          <div>
            {/* Progress dots */}
            <div className="flex items-center gap-3 mb-6">
              {STATES.map(({ label, key }, i) => (
                <button
                  key={key}
                  onClick={() => setCurrent(key)}
                  className={cn(
                    'flex items-center gap-2 text-xs font-medium transition-colors',
                    current === key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    current === key ? 'bg-primary' : 'bg-border',
                  )} />
                  <span className="hidden sm:inline">{`0${i + 1}`}</span>
                </button>
              ))}
            </div>

            {/* State panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {current === 'ask'    && <AskState />}
                {current === 'build'  && <BuildState />}
                {current === 'export' && <ExportState />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — label + copy + nav */}
          <div className="flex flex-col justify-start pt-10 lg:pt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mb-8"
              >
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary mb-3">
                  {STATES.find(s => s.key === current)!.label}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  {STATE_COPY[current]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step navigation buttons */}
            <div className="flex flex-col gap-2">
              {STATES.map(({ label, key }, i) => (
                <button
                  key={key}
                  onClick={() => setCurrent(key)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors',
                    current === key
                      ? 'bg-background text-foreground font-medium shadow-[var(--btn-raised-light-rest)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60',
                  )}
                >
                  <span className={cn(
                    'text-xs font-mono tabular-nums shrink-0',
                    current === key ? 'text-primary' : 'text-muted-foreground',
                  )}>
                    0{i + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
