import { useRef } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp, scaleSettle } from '../variants'
import { ScreenFrame } from '../components/ScreenFrame'

const ENTRY_POINTS = [
  {
    title: 'Type a question',
    body: 'Describe your audience in plain language. The AI proposes the filters.',
  },
  {
    title: 'Drag a question',
    body: 'Drop any survey question onto the canvas. The chart builds itself instantly.',
  },
  {
    title: 'Browse a chart',
    body: '55+ pre-built charts, ready to filter, cross-tab and save.',
  },
]

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Headline */}
        <motion.div
          className="mb-16 max-w-2xl"
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
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-6"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Start anywhere.
            <br />End with the answer.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base text-muted-foreground leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Type a question, drag a survey item, or browse 55+ pre-built charts.
            Every path leads to the same canvas — and the same export.
          </motion.p>
        </motion.div>

        {/* Three entry-point cards */}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ENTRY_POINTS.map(({ title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-muted/40 p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
                {body}
              </p>
            </motion.div>
          ))}

          {/* Animated connecting line — spans full width behind cards at mid-height */}
          <motion.div
            ref={lineRef}
            className="absolute left-0 right-0 h-px bg-border/60 top-1/2 -translate-y-1/2 -z-10 origin-left hidden md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'linear', delay: 0.35 }}
          />
        </motion.div>

        {/* Converging arrow hint */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-px bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
        </motion.div>

        {/* Shared canvas preview */}
        <motion.div
          variants={scaleSettle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <ScreenFrame>
            {/* Canvas preview placeholder — a realistic-looking dashboard skeleton */}
            <div className="bg-background p-6 min-h-[280px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Bar chart skeleton */}
                <div className="rounded-xl border border-border p-4">
                  <div className="h-3 w-24 rounded bg-muted mb-4" />
                  <div className="flex items-end gap-1.5 h-24">
                    {[65, 40, 80, 55, 70, 45, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-primary/20"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Table skeleton */}
                <div className="rounded-xl border border-border p-4 col-span-2">
                  <div className="h-3 w-28 rounded bg-muted mb-4" />
                  <div className="space-y-2">
                    {[85, 72, 61, 54, 48].map((w, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-2.5 rounded bg-muted" style={{ width: `${w}%` }} />
                        <div className="h-2.5 w-8 rounded bg-muted shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScreenFrame>
        </motion.div>

      </div>
    </section>
  )
}
