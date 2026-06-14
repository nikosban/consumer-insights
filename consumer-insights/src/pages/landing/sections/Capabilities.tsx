import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../variants'

const CARDS = [
  {
    title: 'Charts explorer',
    body: '55+ pre-built charts across demographics, finance, fashion and tech. Cross-tab, filter, save, or drop into a dashboard.',
    gradient: 'radial-gradient(ellipse at 30% 110%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 65%)',
  },
  {
    title: 'Analyses & reports',
    body: 'Turn any dashboard into a written report. AI streams the content. Export as PDF or PowerPoint in one click.',
    gradient: 'radial-gradient(ellipse at 70% 110%, color-mix(in srgb, #0891b2 15%, transparent), transparent 65%)',
  },
  {
    title: 'Question library',
    body: '170,402 survey questions, browseable by topic, market or wave. Hover to see the answer distribution. Click to add.',
    gradient: 'radial-gradient(ellipse at 50% 110%, color-mix(in srgb, #7c3aed 12%, transparent), transparent 60%)',
  },
]

export function Capabilities() {
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

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {CARDS.map(({ title, body, gradient }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow] duration-150 hover:border-foreground/20 hover:shadow-[rgba(0,0,0,0.06)_0px_0px_16px_0px]"
            >
              {/* Per-card gradient halo */}
              <div
                className="pointer-events-none absolute inset-0 opacity-100 transition-transform duration-300 group-hover:scale-[1.2]"
                style={{ background: gradient }}
              />
              <div className="relative z-10">
                <h3 className="text-base font-semibold text-foreground mb-3 transition-colors duration-150 group-hover:text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  {body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
