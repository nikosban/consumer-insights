import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import { stagger, fadeUp } from '../variants'
import { DotPopulation } from '../components/DotPopulation'
import { useCounter } from '../useCounter'

const FILTER_OPTIONS = [
  { id: 'gender',   label: 'Women',         group: 'Gender'    },
  { id: 'age',      label: 'Age 25–40',      group: 'Age'       },
  { id: 'income',   label: 'Income €45k+',   group: 'Income'    },
  { id: 'device',   label: 'Smartphone',     group: 'Device'    },
  { id: 'freq',     label: 'Weekly buyer',   group: 'Behaviour' },
  { id: 'market',   label: 'Germany',        group: 'Market'    },
]

const REACH_BASE = 284000
const FILTER_MULTIPLIERS: Record<string, number> = {
  gender: 0.51,
  age:    0.62,
  income: 0.54,
  device: 0.73,
  freq:   0.48,
  market: 0.28,
}

function calcReach(active: Set<string>) {
  let reach = 8200000
  active.forEach(id => { reach *= (FILTER_MULTIPLIERS[id] ?? 0.7) })
  return Math.round(Math.max(reach, 12000))
}

function ReachNumber({ value }: { value: number }) {
  const { count, ref } = useCounter(value, 400)
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="tabular-nums">
      {count >= 1000 ? `${(count / 1000).toFixed(0)}k` : count.toString()}
    </span>
  )
}

export function AudienceBuilder() {
  const [active, setActive] = useState<Set<string>>(new Set())
  const reach = calcReach(active)
  const activeFraction = active.size === 0 ? 1 : Math.min(reach / REACH_BASE, 1)

  const toggle = (id: string) => {
    setActive(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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
            className="text-xs font-medium uppercase tracking-[0.08em] text-secondary-foreground mb-4 flex items-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-primary shrink-0" />
            Audience builder
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15] mb-6"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Wire filters together.
            <br />Watch the audience form.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base text-secondary-foreground leading-relaxed max-w-xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Connect the criteria that matter — gender, age, income, platform,
            market, attitude. Every node cites its source variable.
          </motion.p>
        </motion.div>

        <div className="relative rounded-2xl border border-border overflow-hidden" style={{ minHeight: 480 }}>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <DotPopulation activeFraction={activeFraction} className="w-full h-full" />
          </div>

          <div className="relative z-10 p-8 flex flex-col h-full" style={{ minHeight: 480 }}>
            <div className="flex flex-wrap gap-2 mb-6">
              {FILTER_OPTIONS.map(({ id, label, group }) => {
                const isActive = active.has(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background/80 backdrop-blur-sm text-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="text-xs opacity-60">{group}</span>
                    <span>{label}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <IconX size={10} strokeWidth={2.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>

            <div className="mt-auto">
              <div className="inline-flex flex-col gap-1 rounded-xl border border-border bg-background/90 backdrop-blur-sm px-5 py-4 shadow-[rgba(0,0,0,0.06)_0px_0px_16px_0px]">
                <p className="text-xs text-secondary-foreground font-medium">Estimated reach</p>
                <p className="text-3xl font-semibold text-foreground">
                  <ReachNumber key={reach} value={reach} />
                  <span className="text-lg text-secondary-foreground ml-1">respondents</span>
                </p>
                {active.size > 0 && (
                  <p className="text-xs text-secondary-foreground">
                    {active.size} filter{active.size > 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
