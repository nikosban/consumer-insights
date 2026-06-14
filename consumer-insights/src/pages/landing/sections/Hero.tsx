import { motion } from 'framer-motion'
import { stagger, fadeUp } from '../variants'
import { CTAPrimary, CTASecondary } from '../components/LandingCTA'
import { LandingNav } from '../components/LandingNav'
import { RayBurst } from '../components/RayBurst'

const TRUST_ITEMS = [
  'Trusted by 23,069+ research teams',
  'Refreshed every Friday',
  "Built on Statista's 700k+ respondent database",
]

export function Hero() {
  return (
    <section className="relative min-h-[88vh] bg-background flex items-center overflow-hidden">
      <LandingNav />

      {/* Ray burst canvas */}
      <div className="absolute inset-0 z-0">
        <RayBurst className="w-full h-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-0"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground mb-6"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" aria-hidden />
            Consumer Insights
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] mb-6"
          >
            Your audience,
            <br />
            <span className="landing-gradient-text">in 15 minutes.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Ask a question about any consumer market. Consumer Insights
            builds the audience, generates the chart, and writes the brief —
            before the meeting starts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          >
            <CTAPrimary>
              Book a demo
              <span
                className="inline-block transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-[3px]"
                aria-hidden
              >
                →
              </span>
            </CTAPrimary>
            <CTASecondary>
              Try the assistant
            </CTASecondary>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground"
          >
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-border">·</span>}
                {item}
              </span>
            ))}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
