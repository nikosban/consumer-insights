import { motion } from 'framer-motion'
import { fadeUp, fadeIn, stagger } from '../variants'
import { useCounter } from '../useCounter'

const METHODOLOGY = [
  {
    title: 'Weighted to census',
    body: 'Probability-based panels, weighted to census on age, gender, region and income.',
  },
  {
    title: '56 markets, four waves',
    body: 'Continuous fieldwork across 56 countries, four annual waves since 2014.',
  },
  {
    title: 'Source per chart',
    body: 'Every chart links back to its source question, its sample, and its confidence interval.',
  },
]

function StatCounter({ end, suffix = '', prefix = '', duration = 700, startFrom = 0, label, noGrouping = false }: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  startFrom?: number
  label: string
  noGrouping?: boolean
}) {
  const { count, ref } = useCounter(end, duration, startFrom)
  const display = noGrouping ? count.toString() : count.toLocaleString()
  return (
    <div className="flex flex-col gap-2">
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className="text-5xl font-semibold text-zinc-50 tabular-nums"
      >
        {prefix}{display}{suffix}
      </span>
      <span className="text-sm text-secondary-foreground">{label}</span>
    </div>
  )
}

export function DataSection() {
  return (
    <section className="bg-zinc-950 py-24">
      <div className="max-w-[1264px] mx-auto px-6">
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
            className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-500 mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary" />
            The data
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-zinc-50 leading-[1.15]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            170,402 questions.
            <br />56 markets. One canvas.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-base text-zinc-400 leading-relaxed max-w-2xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Built on Statista's verified survey database — 700,000+ respondents,
            probability-weighted to census, refreshed every Friday.
            Every chart links back to its source question. Every answer is citable.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeUp}>
            <StatCounter end={700} suffix="k+" duration={900} label="respondents" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCounter end={56} duration={500} label="markets" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCounter end={4} suffix="×" duration={400} label="annually" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCounter end={2014} duration={400} startFrom={2010} label="since" noGrouping />
          </motion.div>
        </motion.div>

        {/* Methodology */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-zinc-800 pt-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.3 }}
        >
          {METHODOLOGY.map(({ title, body }) => (
            <div key={title}>
              <p className="text-sm font-medium text-zinc-200 mb-2">{title}</p>
              <p className="text-sm text-zinc-500 leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
                {body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
