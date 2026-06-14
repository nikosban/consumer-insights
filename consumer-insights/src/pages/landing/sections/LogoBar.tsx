import { motion } from 'framer-motion'

const LOGOS = [
  { src: '/logos/google.svg',  alt: 'Google'   },
  { src: '/logos/samsung.svg', alt: 'Samsung'  },
  { src: '/logos/adobe.svg',   alt: 'Adobe'    },
  { src: '/logos/paypal.svg',  alt: 'PayPal'   },
  { src: '/logos/pg.svg',      alt: 'P&G'      },
  { src: '/logos/tmobile.svg', alt: 'T-Mobile' },
]

export function LogoBar() {
  return (
    <section className="bg-muted py-12">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-medium text-muted-foreground mb-8 uppercase tracking-[0.08em]">
          Trusted by research teams at
        </p>
        <motion.div
          className="flex items-center justify-center gap-10 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {LOGOS.map(({ src, alt }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className="h-6 w-auto grayscale brightness-0 opacity-30 hover:opacity-70 hover:grayscale-0 hover:brightness-100 transition-all duration-200 object-contain"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
