import { motion } from 'framer-motion'
import { stagger, fadeUp } from '../variants'
import { AudienceRingLock } from '../components/AudienceRingLock'

export function AudienceBuilder() {
  return (
    <section className="bg-background pt-24 pb-0 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 mb-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            Audience builder
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Stack filters.
            <br />Watch the audience form.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base text-secondary-foreground leading-relaxed max-w-xl"
          >
            Six filter dimensions — gender, age, income, device, behaviour,
            market — rotate independently like a combination lock. Every
            combination maps to a real respondent count.
          </motion.p>
        </motion.div>
      </div>

      {/* Full-bleed canvas — no horizontal constraints */}
      <AudienceRingLock />

    </section>
  )
}
