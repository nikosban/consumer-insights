import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../variants'
import { useCounter } from '../useCounter'

const PROOFS = [
  { end: 1.7,  suffix: '×',  decimals: 1, duration: 600, label: 'Faster briefing cycle vs. agency research' },
  { end: 38,   suffix: '%',  decimals: 0, duration: 700, label: 'Of insights teams replaced at least one custom study' },
  { end: 78,   suffix: '%',  decimals: 0, duration: 800, label: 'Of users exported a deck in their first session' },
  { end: 47,   suffix: '%',  decimals: 0, duration: 700, label: 'Reduction in time from brief to stakeholder presentation' },
]

function ProofCounter({ end, suffix, decimals, duration, label }: {
  end: number
  suffix: string
  decimals: number
  duration: number
  label: string
}) {
  const intEnd = decimals > 0 ? Math.round(end * 10) : end
  const { count, ref } = useCounter(intEnd, duration)
  const display = decimals > 0 ? (count / 10).toFixed(1) : count.toString()

  return (
    <div className="relative flex flex-col gap-3 p-8 rounded-2xl border border-border bg-background overflow-hidden">
      {/* Pulse ring — fires once via CSS animation */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ animation: 'pulse-once 1s ease-out both' }}
      />
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className="text-5xl font-semibold text-primary tabular-nums"
      >
        {display}{suffix}
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
        {label}
      </p>
    </div>
  )
}

export function ProofNumbers() {
  return (
    <section className="bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">
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
            Proof
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            What teams get back
            <br />when research moves faster.
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {PROOFS.map((p) => (
            <motion.div key={p.label} variants={fadeUp}>
              <ProofCounter {...p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
