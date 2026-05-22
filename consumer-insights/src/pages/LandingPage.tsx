import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Globe, Star, Mail, ChevronDown } from 'lucide-react'

// Screenshot saved locally — no longer subject to Figma asset expiry
const APP_SCREENSHOT_URL = '/hero-screenshot.png'
const STATISTA_LOGO_URL = '/statista-logo.svg'

const NAV_LINKS = ['Statistics', 'Insights', 'Connect', 'Daily Data', 'Services'] as const

// Real Statista symbol path extracted from the logo SVG (Vector_9 — the icon beside the wordmark)
const STATISTA_SYMBOL_PATH =
  'M121.165 0.0324779H98.9772C98.7565 0.032475 98.5448 0.120164 98.3884 0.276378C98.2319 0.432591 98.1435 0.644621 98.1423 0.866112V16.0447C98.1825 16.0414 98.2229 16.0414 98.2631 16.0447C98.2631 16.0447 101.855 15.9733 103.4 15.1678C105.302 14.1739 106.72 12.1213 106.72 12.1213C107.08 11.5994 107.477 11.0235 107.604 10.8416C107.732 10.6597 107.859 10.4778 107.891 10.4367C107.924 10.3955 108.072 10.1833 108.161 10.0577C108.249 9.93215 108.614 9.40815 108.974 8.87983C108.974 8.87983 111.131 5.74449 114.206 4.14435C117.532 2.41212 121.931 2.6005 121.931 2.6005H122V0.866112C121.999 0.644621 121.91 0.432591 121.754 0.276378C121.597 0.120164 121.386 0.032475 121.165 0.0324779ZM116.635 8.85168C114.743 9.84338 113.328 11.9091 113.328 11.9091L112.443 13.1887C112.318 13.3685 112.189 13.5525 112.156 13.5936C112.124 13.6348 111.973 13.8448 111.887 13.9704C111.8 14.096 111.436 14.62 111.073 15.1505C111.073 15.1505 108.916 18.2858 105.84 19.886C102.653 21.5489 98.4832 21.4406 98.1423 21.4298V23.162C98.1423 23.3843 98.2303 23.5974 98.3869 23.7546C98.5434 23.9117 98.7558 24 98.9772 24H121.165C121.387 24 121.599 23.9117 121.755 23.7546C121.912 23.5974 122 23.3843 122 23.162V7.94875C121.929 7.96405 121.857 7.97275 121.784 7.97474C121.784 7.97474 118.192 8.04619 116.646 8.85168H116.635Z'

// Tile matches the container width so it never repeats horizontally.
// Cells are restricted to the left/right margins (< 130px and > 1020px)
// so they can never land on the centre copy column (858px wide, 149px margins).
const TILE_W = 1136
const TILE_H = 480

const WATERMARK_CELLS = [
  // Left margin  (x + 40 < 149)
  { x: 40,  y: 80,  dur: '10s',  begin: '0s'   },
  { x: 80,  y: 240, dur: '14s',  begin: '3.2s' },
  { x: 0,   y: 360, dur: '12s',  begin: '6.1s' },
  // Right margin (x > 1007)
  { x: 1020, y: 120, dur: '11s',  begin: '1.5s' },
  { x: 1060, y: 280, dur: '15s',  begin: '5.7s' },
  { x: 1100, y: 40,  dur: '13s',  begin: '8.3s' },
]

// Grid lines path across the full 1156×480 tile
const GRID_PATH = [
  ...Array.from({ length: Math.ceil(TILE_H / 40) }, (_, i) => `M0 ${i * 40}H${TILE_W}`),
  ...Array.from({ length: Math.ceil(TILE_W / 40) }, (_, i) => `M${i * 40} 0V${TILE_H}`),
].join(' ')

// Symbol fits in 24×24 units (viewBox 98 0 24 24); scaled to 20px inside a 40px cell
const SYM_SCALE = 20 / 24

const LOGO_HEIGHT = 28

const METRICS: { value: string; label: React.ReactNode }[] = [
  { value: '700k+', label: 'surveys contacted' },
  { value: '56',    label: 'countries covered'                  },
  { value: '50+',   label: 'industries tracked'                 },
  { value: '15+',   label: <>years of<br />trend data</>        },
]

const LOGOS = [
  { src: '/logos/google.svg',  alt: 'Google'   },
  { src: '/logos/samsung.svg', alt: 'Samsung'  },
  { src: '/logos/paypal.svg',  alt: 'PayPal'   },
  { src: '/logos/tmobile.svg', alt: 'T-Mobile' },
  { src: '/logos/adobe.svg',   alt: 'Adobe'    },
  { src: '/logos/pg.svg',      alt: 'P&G'      },
]

type FlowStep = { title: string; tag: string; detail: string }
type FeatureBlockData = { title: string; description: string; steps: FlowStep[] }

const FEATURE_BLOCKS: FeatureBlockData[] = [
  {
    title: "Brief your agency with data they can't argue with.",
    description: 'Build the full audience portrait before you walk into the briefing room.',
    steps: [
      { title: 'Filter your audience',    tag: 'Segment',  detail: 'Age · Income · Media habit · Country' },
      { title: 'Build audience portrait', tag: 'Insights', detail: 'Demographics · Attitudes · Behaviour'  },
      { title: 'Campaign brief',          tag: 'Output',   detail: 'Ready to share before the briefing room' },
    ],
  },
  {
    title: 'Build market landscapes without fielding a single survey.',
    description: 'Deliver client-ready analysis across 150 markets backed by primary research.',
    steps: [
      { title: '150 market surveys',     tag: 'Source',  detail: 'Continuous primary research'          },
      { title: 'Category & competition', tag: 'Analyse', detail: 'Attitudes · Sizing · Competitive Intel' },
      { title: 'Client deliverable',     tag: 'Export',  detail: 'Charts · Tables · Cite-ready sourcing' },
    ],
  },
  {
    title: 'From raw survey to boardroom slide in under an hour.',
    description: "Your team's continuous research programme — without the cost of commissioning your own.",
    steps: [
      { title: 'Quarterly survey wave', tag: 'Track',   detail: '50+ industries · Continuous'  },
      { title: 'Cross-tab & filter',    tag: 'Analyse', detail: 'Any variable · Any segment'   },
      { title: 'Benchmark vs. waves',   tag: 'Compare', detail: 'Trend data · Brand health'    },
      { title: 'Boardroom slide',       tag: 'Output',  detail: 'Source-cited · Scrutiny-ready' },
    ],
  },
]

function LogoMarquee() {
  // Duplicate the set for a seamless loop
  const track = [...LOGOS, ...LOGOS, ...LOGOS]
  return (
    <div className="relative">
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0666e5, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0666e5, transparent)' }} />

      <div className="overflow-hidden">
        <div
          className="flex items-center gap-16"
          style={{
            width: 'max-content',
            animation: 'marquee-ltr 32s linear infinite',
          }}
        >
          {track.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              data-logo
              style={{ height: LOGO_HEIGHT, opacity: 0.7 }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function WatermarkBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Top-to-bottom opacity gradient: 100% → 0% */}
        <linearGradient id="wm-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="wm-mask">
          <rect width="100%" height="100%" fill="url(#wm-fade)" />
        </mask>

        <pattern id="wm" width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
          {/* Fine grid lines */}
          <path d={GRID_PATH} stroke="white" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />

          {/* Animated cells — each fades in/out independently via SMIL */}
          {WATERMARK_CELLS.map(({ x, y, dur, begin }) => (
            <g key={`${x}-${y}`} opacity="0">
              <animate
                attributeName="opacity"
                values="0;0;1;1;0"
                keyTimes="0;0.15;0.4;0.6;1"
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
              />
              {/* White fill at 48% opacity */}
              <rect x={x} y={y} width={40} height={40} fill="white" fillOpacity={0.48} />
              {/* Symbol in background blue — same colour as hero, creating an embossed look */}
              <g transform={`translate(${x + 10}, ${y + 10}) scale(${SYM_SCALE}) translate(-98, 0)`}>
                <path d={STATISTA_SYMBOL_PATH} fill="#0666e5" />
              </g>
            </g>
          ))}
        </pattern>
      </defs>

      {/* Pattern rect with fade mask applied */}
      <rect width="100%" height="100%" fill="url(#wm)" mask="url(#wm-mask)" />
    </svg>
  )
}

// SVG icons (16×16 viewport, white strokes) keyed by tag name
const STEP_ICONS: Record<string, React.ReactElement> = {
  Segment: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h14l-5 6v5l-4-2V9Z" fill="rgba(255,255,255,0.15)" strokeWidth="1.2" />
    </g>
  ),
  Insights: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="5.5" r="2.8" />
      <path d="M2.5 14.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
    </g>
  ),
  Output: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,2 4,14 12,14 12,2" />
      <line x1="4" y1="2" x2="12" y2="2" />
      <line x1="6" y1="6" x2="10" y2="6" />
      <line x1="6" y1="9" x2="10" y2="9" />
      <polyline points="5,12 8,14.5 11,12" strokeWidth="1.2" />
    </g>
  ),
  Source: (
    <g fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round">
      <ellipse cx="8" cy="4.5" rx="4.5" ry="1.8" />
      <path d="M3.5 4.5v7c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8v-7" />
      <path d="M3.5 8c0 1 2 1.8 4.5 1.8S12.5 9 12.5 8" />
    </g>
  ),
  Analyse: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 11.5 L5 8 L8 10 L12.5 4.5" />
      <circle cx="5" cy="8" r="1.5" fill="white" stroke="none" />
      <circle cx="8" cy="10" r="1.5" fill="white" stroke="none" />
      <circle cx="12.5" cy="4.5" r="1.5" fill="white" stroke="none" />
    </g>
  ),
  Export: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="10" height="12" rx="1.5" />
      <line x1="5.5" y1="6" x2="10.5" y2="6" />
      <line x1="5.5" y1="9" x2="10.5" y2="9" />
      <line x1="5.5" y1="12" x2="8" y2="12" />
    </g>
  ),
  Track: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <polyline points="8,4.5 8,8 11,10" />
    </g>
  ),
  Compare: (
    <g fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="6" x2="11" y2="6" /><polyline points="8.5,3.5 11,6 8.5,8.5" />
      <line x1="14" y1="10" x2="5" y2="10" /><polyline points="7.5,7.5 5,10 7.5,12.5" />
    </g>
  ),
}

function FlowDiagram({ steps, uid }: { steps: FlowStep[]; uid: string }) {
  const VW   = 320
  const CX   = 160     // horizontal center
  const LX   = 24      // card left x
  const CW   = 272     // card width
  const CH   = 76      // card height
  const IW   = 48      // icon area width
  const CONN = 40      // connector gap
  const PAD  = 28
  const STEP = CH + CONN
  const n    = steps.length
  const H    = PAD + n * CH + (n - 1) * CONN + PAD

  // When all cards + lines have appeared
  const revealEnd = n * 0.38 + 0.32

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#f1f5f9',
        backgroundImage: 'radial-gradient(circle, #c0cdd9 1.5px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full" style={{ display: 'block' }}>
        <defs>
          {/* Per-card clip paths so the icon area respects card border-radius */}
          {steps.map((_, i) => (
            <clipPath key={i} id={`${uid}-c${i}`}>
              <rect x={LX} y={PAD + i * STEP} width={CW} height={CH} rx="14" />
            </clipPath>
          ))}
          {/* Arrowhead marker */}
          <marker id={`${uid}-arr`} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <polygon points="1,1 6,3.5 1,6" fill="#94a3b8" />
          </marker>
        </defs>

        {steps.map(({ title, tag, detail }, i) => {
          const y      = PAD + i * STEP
          const isLast = i === n - 1
          const y1     = y + CH          // connector top
          const y2     = y + CH + CONN   // connector bottom
          const mid    = (y1 + y2) / 2

          // Timing
          const cardBegin = `${i * 0.38}s`
          const lineBegin = `${i * 0.38 + 0.28}s`
          const dotBegin  = `${revealEnd + 0.3 + i * 0.15}s`

          // Colors
          const cardBg    = isLast ? '#0666e5' : 'white'
          const iconBg    = isLast ? 'rgba(255,255,255,0.18)' : '#0557c7'
          const titleC    = isLast ? 'white' : '#0f172a'
          const detailC   = isLast ? 'rgba(255,255,255,0.62)' : '#94a3b8'
          const tagBg     = isLast ? 'rgba(255,255,255,0.16)' : 'rgba(6,102,229,0.09)'
          const tagC      = isLast ? 'rgba(255,255,255,0.9)' : '#0666e5'
          const border    = isLast ? 'rgba(255,255,255,0.12)' : '#e2e8f0'

          return (
            <g key={i}>

              {/* ── Connector between this card and next ── */}
              {!isLast && (
                <g>
                  {/* Dashed line — draws in */}
                  <line
                    x1={CX} y1={y1 + 1} x2={CX} y2={y2 - 8}
                    stroke="#b0bec8" strokeWidth="1.5"
                    strokeDasharray={CONN} strokeDashoffset={CONN}
                    markerEnd={`url(#${uid}-arr)`}
                  >
                    <animate attributeName="stroke-dashoffset"
                      from={CONN} to={0} dur="0.28s" begin={lineBegin} fill="freeze" />
                  </line>

                  {/* Step label floating on connector */}
                  <g opacity="0">
                    <animate attributeName="opacity" from="0" to="1"
                      dur="0.2s" begin={lineBegin} fill="freeze" />
                    <rect x={CX - 28} y={mid - 11} width={56} height={22} rx="11"
                      fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    <text x={CX} y={mid} textAnchor="middle" dominantBaseline="middle"
                      style={{ fontSize: 9.5, fontWeight: 600, fill: '#64748b', fontFamily: 'Open Sans, sans-serif', letterSpacing: '0.02em' }}>
                      {`Step ${i + 2}`}
                    </text>
                  </g>

                  {/* Traveling dot */}
                  <circle cx={CX} cy={y1} r="4" fill="#0666e5" opacity="0">
                    <animate attributeName="cy"
                      from={y1 + 6} to={y2 - 10}
                      dur="1s" begin={dotBegin} repeatCount="indefinite" calcMode="ease-in-out" />
                    <animate attributeName="opacity"
                      values="0;1;1;0" keyTimes="0;0.1;0.88;1"
                      dur="1s" begin={dotBegin} repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* ── Card ────────────────────────────────── */}
              <g opacity="0">
                <animate attributeName="opacity" from="0" to="1"
                  dur="0.32s" begin={cardBegin} fill="freeze" />

                {/* Clipped interior (card fill + icon area) */}
                <g clipPath={`url(#${uid}-c${i})`}>
                  <rect x={LX} y={y} width={CW} height={CH} fill={cardBg} />
                  <rect x={LX} y={y} width={IW} height={CH} fill={iconBg} />
                </g>

                {/* Border ring */}
                <rect x={LX} y={y} width={CW} height={CH} rx="14"
                  fill="none" stroke={border} strokeWidth="1" />

                {/* Icon (16×16, centred in icon area) */}
                <g transform={`translate(${LX + IW / 2 - 8}, ${y + CH / 2 - 8})`}>
                  {STEP_ICONS[tag]}
                </g>

                {/* Title */}
                <text
                  x={LX + IW + 14} y={y + CH / 2 - 10}
                  dominantBaseline="middle"
                  style={{ fontSize: 13, fontWeight: 700, fill: titleC, fontFamily: 'Open Sans, sans-serif' }}
                >
                  {title}
                </text>

                {/* Detail */}
                <text
                  x={LX + IW + 14} y={y + CH / 2 + 11}
                  dominantBaseline="middle"
                  style={{ fontSize: 10.5, fill: detailC, fontFamily: 'Open Sans, sans-serif' }}
                >
                  {detail}
                </text>

                {/* Tag badge */}
                <rect x={LX + CW - 72} y={y + (CH - 24) / 2} width={60} height={24} rx="12"
                  fill={tagBg} />
                <text
                  x={LX + CW - 42} y={y + CH / 2}
                  textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: 10, fontWeight: 700, fill: tagC, fontFamily: 'Open Sans, sans-serif' }}
                >
                  {tag}
                </text>
              </g>

            </g>
          )
        })}
      </svg>
    </div>
  )
}

function FeatureBlock({ title, description, steps, idx }: FeatureBlockData & { idx: number }) {
  return (
    <div className="grid grid-cols-2 gap-16 py-16 border-t border-border items-start">
      <div className="pt-4">
        <h3 className="text-[1.5rem] leading-[1.25] font-semibold text-[#0f172a] text-balance">{title}</h3>
        <p className="mt-3 text-[16px] leading-[26px] text-[#64748b]">{description}</p>
      </div>
      <FlowDiagram steps={steps} uid={`fd${idx}`} />
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Blue hero band ─────────────────────────────────────── */}
      <div className="bg-[#0666e5] relative">


        {/* Nav */}
        <header className="relative border-b border-white/[0.08] py-4">
          <div className="mx-auto max-w-[1136px] px-6 flex items-center justify-between">

            {/* Left — logo + nav links */}
            <div className="flex items-center gap-6">
              <a href="/" className="shrink-0">
                <img src={STATISTA_LOGO_URL} alt="Statista" data-logo style={{ height: 24 }} />
              </a>
              <nav className="hidden lg:flex items-center">
                {NAV_LINKS.map(link => (
                  <button
                    key={link}
                    className="flex items-center gap-2 h-10 pl-3 pr-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {link}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Right — search, icon actions, CTA */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition-colors">
                <Search className="h-3.5 w-3.5" />
                <kbd className="flex items-center gap-0.5 border border-white/[0.14] rounded px-1 h-5 text-[11px] font-medium">
                  <span>⌘</span><span>K</span>
                </kbd>
              </button>

              {/* Vertical divider */}
              <div className="hidden sm:block h-4 w-px bg-white/[0.14]" />

              <div className="flex items-center">
                <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                </button>
                <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Research AI CTA */}
              <button
                onClick={() => navigate('/research-ai')}
                className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-md bg-white text-[#313c49] text-sm font-medium transition-opacity hover:opacity-90"
                style={{ boxShadow: 'var(--btn-white-shadow)' }}
              >
                Research&nbsp;AI
                <span
                  className="flex items-center justify-center h-5 w-5 rounded text-[11px] font-medium"
                  style={{ border: '1px solid rgba(49,60,73,0.12)' }}
                >
                  R
                </span>
              </button>
            </div>

          </div>
        </header>

        {/* Content area with subtle side borders */}
        <div className="relative mx-auto max-w-[1136px] border-x border-white/[0.08] flex flex-col items-center pt-8 gap-10 overflow-hidden">

          {/* Tile watermark — real Statista symbol, contained within the 1156px column */}
          <WatermarkBackground />

          {/* Hero text */}
          <div className="w-full max-w-[858px] px-6 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center border border-white/[0.14] rounded-full px-3 py-0.5">
              <span className="text-white text-xs leading-5">
                Real survey data. Verified humans. No guesswork.
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-semibold text-white">
              The consumer intelligence system to own your market.
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-[20px] leading-[1.6] text-white/80 max-w-[600px]">
              150 markets. 50+ industries. Real survey data your competitors are already using.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex items-center gap-[14px]">
              <button
                onClick={() => navigate('/research-ai')}
                className="h-10 px-3 rounded-md bg-white text-[#313c49] text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ boxShadow: 'var(--btn-white-shadow)' }}
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/research-ai')}
                className="h-10 pl-4 pr-3 text-white text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Screenshot frame */}
          <div
            className="relative w-full max-w-[858px] rounded-tl-[24px] rounded-tr-[24px] pt-1 px-1"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Inner image */}
            <div className="relative w-full h-[440px] rounded-tl-[20px] rounded-tr-[20px] overflow-hidden">
              <img
                src={APP_SCREENSHOT_URL}
                alt="Consumer Insights dashboard"
                className="absolute left-0 w-full"
                style={{ height: '106%', top: '-6%' }}
              />
            </div>

            {/* Gradient fade — covers bottom of image and bleeds past the glass border sides */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '-1px',
                left: '-40px',
                width: 'calc(100% + 80px)',
                height: '195px',
                background: 'linear-gradient(to bottom, rgba(6,102,229,0) 0%, #0666e5 100%)',
              }}
            />
          </div>

        </div>
      </div>
      {/* ── End blue band ──────────────────────────────────────── */}

      {/* Logo marquee strip */}
      <div className="bg-[#0666e5] border-t border-white/[0.08]">
        <div className="mx-auto max-w-[1136px] border-x border-white/[0.08] py-10 overflow-hidden">
          <LogoMarquee />
        </div>
      </div>

      {/* ── Role / metrics section ─────────────────────────────── */}
      <div className="bg-white border-t border-border">
        <div className="relative mx-auto max-w-[1136px] border-x border-border py-16 flex flex-col items-center text-center overflow-hidden">

          {/* Diagonal stripe columns */}
          {(['left', 'right'] as const).map(side => (
            <div
              key={side}
              className={`absolute inset-y-0 ${side}-0 w-8 pointer-events-none`}
              style={{
                backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(0,0,0,0.1) 6px, rgba(0,0,0,0.1) 7.5px)',
              }}
            />
          ))}

          {/* Full-height vertical border lines at stripe edges */}
          <div className="absolute inset-y-0 left-8 w-px bg-border pointer-events-none" />
          <div className="absolute inset-y-0 right-8 w-px bg-border pointer-events-none" />

          {/* Content — padded to align with stripe edges */}
          <div className="relative z-10 w-full px-8">
            <div className="flex flex-col items-center text-center">

              {/* Section header */}
              <div className="w-full px-10 py-10 border-b border-border flex flex-col items-center">
                <div className="max-w-[680px]">
                  <h2 className="text-[2.25rem] leading-[1.1] font-semibold text-[#0f172a] text-balance">
                    The right insight for your exact job.
                  </h2>
                  <p className="mt-3 text-[18px] leading-[1.6] text-[#94a3b8] text-balance">
                    Choose your role — the data, the proof, and the workflow are different for each.
                  </p>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="w-full border-b border-border py-8 grid grid-cols-4">
                {METRICS.map(({ value, label }) => (
                  <div key={value} className="flex flex-col items-center text-center">
                    <div className="text-[48px] leading-[56px] font-semibold text-[#0f172a]">{value}</div>
                    <div className="mt-2 text-[16px] leading-[24px] text-[#64748b] max-w-[100px]">{label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
