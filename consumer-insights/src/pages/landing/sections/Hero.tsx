import { motion } from 'framer-motion'
import { stagger, fadeUp } from '../variants'
import { CTAPrimary, CTASecondary } from '../components/LandingCTA'
import { LandingNav } from '../components/LandingNav'

export function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <LandingNav />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-20 flex flex-col items-start">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-0 max-w-[600px]"
        >
          {/* Data pill */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-xs font-medium text-secondary-foreground">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
              170,402 survey questions across 56 markets
            </span>
          </motion.div>

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
            className="text-lg text-secondary-foreground leading-relaxed max-w-md mb-10"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Ask a question about any consumer market. Consumer Insights
            builds the audience, generates the chart, and writes the brief —
            before the meeting starts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <CTAPrimary>
              Book a demo
              <span
                className="inline-block transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
                aria-hidden
              >
                →
              </span>
            </CTAPrimary>
            <CTASecondary>
              Try the assistant
            </CTASecondary>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
