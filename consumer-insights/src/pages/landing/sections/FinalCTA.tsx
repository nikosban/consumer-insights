import { motion } from 'framer-motion'
import { stagger, fadeUp } from '../variants'

export function FinalCTA() {
  return (
    <section className="relative bg-zinc-950 py-32 overflow-hidden">
      {/* Gradient fade from previous white section */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-16"
        style={{ background: 'linear-gradient(to bottom, var(--background), transparent)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-semibold tracking-tight text-zinc-50 leading-[1.1] mb-6"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            The brief is waiting.
            <br />So is the data.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Start with a discovery sprint. We co-build your first audience,
            walk the data with you, and show what's possible before
            you commit to anything.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          >
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 text-zinc-950 text-sm font-medium transition-colors hover:bg-white">
              Book a demo
              <span className="transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">→</span>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm font-medium transition-colors hover:border-zinc-500 hover:text-zinc-100">
              Watch the 5-minute tour
              <span>→</span>
            </button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-zinc-600">
            No commitment · Your data, your questions · Research team on the call
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
