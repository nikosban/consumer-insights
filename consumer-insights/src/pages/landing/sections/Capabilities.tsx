import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger } from '../variants'

const REPORT_INSIGHT = 'Online shoppers aged 25–40 in Germany represent a high-value segment. 78% transact weekly, above the EU average of 61%. Income skews above median. Key categories: fashion, electronics, grocery. Recommended action: increase frequency targeting in Q3 campaign.'

const CARDS = [
  {
    key: 'charts',
    title: 'Charts explorer',
    body: '55+ pre-built charts across demographics, finance, fashion and tech. Cross-tab, filter, save, or drop into a dashboard.',
    gradient: 'radial-gradient(ellipse at 30% 110%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 65%)',
    streaming: false,
  },
  {
    key: 'reports',
    title: 'Analyses & reports',
    body: 'Turn any dashboard into a written report. AI streams the content. Export as PDF or PowerPoint in one click.',
    gradient: 'radial-gradient(ellipse at 70% 110%, color-mix(in srgb, #0891b2 15%, transparent), transparent 65%)',
    streaming: true,
  },
  {
    key: 'library',
    title: 'Question library',
    body: '170,402 survey questions, browseable by topic, market or wave. Hover to see the answer distribution. Click to add.',
    gradient: 'radial-gradient(ellipse at 50% 110%, color-mix(in srgb, #7c3aed 12%, transparent), transparent 60%)',
    streaming: false,
  },
]

function ReportsCard({ title, body, gradient }: { title: string; body: string; gradient: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const savedIdxRef = useRef(0)
  const words = REPORT_INSIGHT.split(' ')

  const startStream = () => {
    if (done) return
    intervalRef.current = setInterval(() => {
      setWordIdx(prev => {
        const next = prev + 1
        savedIdxRef.current = next
        if (next >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDone(true)
          return words.length
        }
        return next
      })
    }, 55)
  }

  const stopStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (isHovered) startStream()
    else stopStream()
    return () => stopStream()
  }, [isHovered])

  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow] duration-150 hover:border-foreground/20 hover:shadow-[rgba(0,0,0,0.06)_0px_0px_16px_0px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-none absolute inset-0 opacity-100 transition-transform duration-300 group-hover:scale-[1.2]"
        style={{ background: gradient }} />
      <div className="relative z-10 p-6">
        <h3 className="text-base font-semibold text-foreground mb-3 transition-colors duration-150">
          {title}
        </h3>
        {wordIdx > 0 ? (
          <div className="min-h-[60px]">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {words.slice(0, wordIdx).join(' ')}
              {!done && <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse" />}
            </p>
            <AnimatePresence>
              {done && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-xs font-medium text-primary cursor-pointer"
                >
                  Export as PowerPoint →
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]" style={{ textWrap: 'balance' } as React.CSSProperties}>
            {body}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export function Capabilities() {
  return (
    <section className="bg-muted py-24">
      <div className="max-w-[1264px] mx-auto px-6">
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
            <span className="inline-block w-1 h-1 rounded-full bg-primary" />
            Capabilities
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Everything else
            <br />in the toolkit.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-base text-muted-foreground leading-relaxed max-w-md"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Three more tools on the same canvas.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {CARDS.map(card => card.streaming ? (
            <ReportsCard key={card.key} title={card.title} body={card.body} gradient={card.gradient} />
          ) : (
            <motion.div
              key={card.key}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow] duration-150 hover:border-foreground/20 hover:shadow-[rgba(0,0,0,0.06)_0px_0px_16px_0px]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-100 transition-transform duration-300 group-hover:scale-[1.2]"
                style={{ background: card.gradient }} />
              <div className="relative z-10">
                <h3 className="text-base font-semibold text-foreground mb-3 transition-colors duration-150">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
