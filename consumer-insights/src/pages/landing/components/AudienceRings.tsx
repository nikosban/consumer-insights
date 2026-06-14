import { motion } from 'framer-motion'

const W  = 560
const CX = W / 2
const CY = W / 2

interface RingItem {
  label:   string
  angle:   number   // degrees, 0 = top, clockwise
  primary: boolean
}

interface RingDef {
  id:       string
  radius:   number
  duration: number
  cw:       boolean
  items:    RingItem[]
}

function makeRing(id: string, radius: number, duration: number, cw: boolean, labels: string[], primaryIdx: number): RingDef {
  return {
    id, radius, duration, cw,
    items: labels.map((label, i) => ({
      label,
      angle: (i / labels.length) * 360,
      primary: i === primaryIdx,
    })),
  }
}

const RINGS: RingDef[] = [
  makeRing('gender',    62,  9,  true,  ['Women', 'Men', 'Non-binary'],             0),
  makeRing('age',       104, 14, false, ['18–24', '25–40', '41–55', '55+'],         1),
  makeRing('income',    146, 18, true,  ['<€25k', '€25–45k', '€45k+', '€75k+'],    2),
  makeRing('device',    186, 22, false, ['Smartphone', 'Desktop', 'Tablet'],        0),
  makeRing('behaviour', 224, 26, true,  ['Weekly buyer', 'Monthly', 'Occasional'],  0),
  makeRing('market',    262, 30, false, ['Germany', 'France', 'UK', 'Spain'],       0),
]

function chipW(label: string) { return Math.max(40, label.length * 6.0 + 16) }
const CHIP_H = 19

// CSS variable colour helpers — use var() directly (tokens are oklch, not hsl)
const C = {
  border:      'var(--border)',
  bg:          'var(--background)',
  fg:          'var(--foreground)',
  muted:       'var(--muted-foreground)',
  primary:     'var(--primary)',
  primaryFg:   'var(--primary-foreground)',
  primaryFade: 'color-mix(in oklch, var(--primary) 20%, transparent)',
  borderFade:  'color-mix(in oklch, var(--border) 50%, transparent)',
}

interface Props {
  activeFilters: Set<string>
}

export function AudienceRings({ activeFilters }: Props) {
  return (
    <svg viewBox={`0 0 ${W} ${W}`} width="100%" height="100%">
      {RINGS.map((r) => {
        const isActive  = activeFilters.has(r.id)
        const rotateDir = r.cw ? 360 : -360

        return (
          <motion.g
            key={r.id}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
            animate={{ rotate: rotateDir }}
            transition={{ duration: r.duration, repeat: Infinity, ease: 'linear' }}
          >
            {/* Track */}
            <circle
              cx={CX} cy={CY} r={r.radius}
              fill="none"
              style={{
                stroke:      isActive ? C.primaryFade : C.border,
                strokeWidth: isActive ? 1.5 : 1,
              }}
            />

            {r.items.map((item) => {
              const rad         = (item.angle - 90) * (Math.PI / 180)
              const x           = CX + Math.cos(rad) * r.radius
              const y           = CY + Math.sin(rad) * r.radius
              const w           = chipW(item.label)
              const highlighted = isActive && item.primary

              return (
                <motion.g
                  key={item.label}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                  animate={{ rotate: -rotateDir }}
                  transition={{ duration: r.duration, repeat: Infinity, ease: 'linear' }}
                >
                  <rect
                    x={x - w / 2} y={y - CHIP_H / 2}
                    width={w} height={CHIP_H}
                    rx={CHIP_H / 2}
                    style={{
                      fill:        highlighted ? C.primary : C.bg,
                      stroke:      highlighted ? C.primary : item.primary ? C.border : C.borderFade,
                      strokeWidth: 1,
                    }}
                  />
                  <text
                    x={x} y={y + 4}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="var(--font-sans, system-ui, sans-serif)"
                    style={{
                      fontWeight: item.primary ? 500 : 400,
                      fill:       highlighted ? C.primaryFg : item.primary ? C.fg : C.muted,
                    }}
                  >
                    {item.label}
                  </text>
                </motion.g>
              )
            })}
          </motion.g>
        )
      })}

      {/* Centre node */}
      <circle
        cx={CX} cy={CY} r={40}
        style={{ fill: C.bg, stroke: C.border, strokeWidth: 1 }}
      />
    </svg>
  )
}
