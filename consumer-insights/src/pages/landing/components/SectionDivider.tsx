import { motion } from 'framer-motion'

export function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        className="h-px bg-border"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.4, ease: 'linear' }}
      />
    </div>
  )
}
