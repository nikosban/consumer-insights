import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAIStore } from '@/store/aiStore'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import type { ChatHistoryEntry } from '@/store/aiStore'
import { Skeleton } from '@/components/ui/skeleton'
import { getFakeAIResponse } from '@/data/fakeGenerators'
import ChartRenderer from '@/components/charts/ChartRenderer'
import type { AudienceCardData, DataWidgetCardData, Audience, AIMessage, Widget } from '@/types'
import {
  Send, Sparkles, RotateCcw, ChevronDown,
  Users, Globe, TrendingUp, SquarePen, MessageSquare, BarChart2,
  Check, LayoutDashboard, ExternalLink, ChevronRight, ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Gradient styles ──────────────────────────────────────────────────────────

const gradientNameStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0666E5 0%, #5ba3ff 30%, #0666E5 55%, #003eaa 80%, #0666E5 100%)',
  backgroundSize: '300% 300%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'sineGradient 4s ease-in-out infinite',
}

function metalGradient(color: string): React.CSSProperties {
  return {
    background: `linear-gradient(110deg, ${color}99 0%, ${color} 18%, ${color}dd 30%, #ffffff 40%, ${color}ee 50%, ${color} 65%, ${color}aa 78%, #ffffffbb 86%, ${color}cc 94%, ${color}99 100%)`,
    backgroundSize: '350% 350%',
    animation: 'sineGradient 2.5s ease-in-out infinite',
  }
}

// ─── Page background ──────────────────────────────────────────────────────────

const gridBgStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: [
    'linear-gradient(to right, rgba(6,102,229,0.05) 1px, transparent 1px)',
    'linear-gradient(to bottom, rgba(6,102,229,0.05) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '36px 36px',
  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)',
  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)',
}

// ─── Use-case tiles ───────────────────────────────────────────────────────────

const USE_CASES = [
  { Icon: Users,       title: 'Audience Profiler',  desc: 'Build and explore precise audience segments',  color: '#F97316' },
  { Icon: Globe,       title: 'Geomarket Brief',    desc: 'Compare consumer behaviour across regions',    color: '#22C55E' },
  { Icon: TrendingUp,  title: 'Brand Position',     desc: 'Benchmark awareness and competitive standing', color: '#A855F7' },
]

function UseCaseTile({ Icon, title, desc, color, onClick }: { Icon: React.ElementType; title: string; desc: string; color: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-start p-4 rounded-xl bg-gray-50 transition-all text-left w-full border border-transparent hover:border-gray-200 hover:shadow-md"
    >
      <div
        style={hovered ? metalGradient(color) : {}}
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
          !hovered && 'bg-gray-200/60'
        )}
      >
        <Icon size={15} strokeWidth={2.5} className={hovered ? 'text-white' : 'text-gray-500'} />
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold text-gray-800 leading-snug">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </button>
  )
}

// ─── Chat History Panel ───────────────────────────────────────────────────────

function groupHistory(history: ChatHistoryEntry[]) {
  const now = Date.now()
  const sevenDays: ChatHistoryEntry[] = []
  const pastMonth: ChatHistoryEntry[] = []
  history.forEach(entry => {
    const age = now - new Date(entry.createdAt).getTime()
    const days = age / (1000 * 60 * 60 * 24)
    if (days <= 7) sevenDays.push(entry)
    else if (days <= 30) pastMonth.push(entry)
  })
  return { sevenDays, pastMonth }
}

function ChatHistoryPanel({ onSelect, onNew, showNewChat }: {
  onSelect: (q: string) => void
  onNew: () => void
  showNewChat: boolean
}) {
  const { history } = useAIStore()
  const { sevenDays, pastMonth } = groupHistory(history)

  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-border bg-sidebar h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 h-14 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">Chat history</span>
        {showNewChat && (
          <button
            onClick={onNew}
            title="New chat"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <SquarePen size={12} />
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto py-2">
        {sevenDays.length > 0 && (
          <div className="mb-2">
            <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">7 days</p>
            {sevenDays.map(entry => (
              <button key={entry.id} onClick={() => onSelect(entry.firstMessage)}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-sidebar-foreground rounded-md mx-1 transition-colors hover:bg-white/70"
                style={{ width: 'calc(100% - 8px)' }}
              >
                <MessageSquare size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{entry.firstMessage}</span>
              </button>
            ))}
          </div>
        )}
        {pastMonth.length > 0 && (
          <div>
            <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">Past month</p>
            {pastMonth.map(entry => (
              <button key={entry.id} onClick={() => onSelect(entry.firstMessage)}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-sidebar-foreground rounded-md mx-1 transition-colors hover:bg-white/70"
                style={{ width: 'calc(100% - 8px)' }}
              >
                <MessageSquare size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{entry.firstMessage}</span>
              </button>
            ))}
          </div>
        )}
        {sevenDays.length === 0 && pastMonth.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">No chat history yet</p>
        )}
      </div>
    </aside>
  )
}

// ─── Revolving placeholder ────────────────────────────────────────────────────

const REVOLVING_PROMPTS = [
  'How many wireless earphones were sold in Germany last quarter?',
  'What market insights can you uncover about smartphone sales trends in the US?',
  'What customer behavior data do you need regarding online shopping habits?',
  'Which consumer segments are you analyzing for the recent wearable tech launch?',
  'What buying habit patterns are you investigating for eco-friendly products?',
  'Which regions show the strongest brand affinity for premium fashion?',
]

function RevolvingPlaceholder() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle')

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('exit')
      setTimeout(() => {
        setIdx(i => (i + 1) % REVOLVING_PROMPTS.length)
        setPhase('enter')
        setTimeout(() => setPhase('idle'), 350)
      }, 350)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const style: React.CSSProperties = {
    transition: 'transform 350ms ease, opacity 350ms ease',
    transform: phase === 'exit' ? 'translateY(-14px)' : phase === 'enter' ? 'translateY(14px)' : 'translateY(0)',
    opacity: phase === 'idle' ? 1 : 0,
  }

  return (
    <span className="pointer-events-none select-none" style={style}>
      {REVOLVING_PROMPTS[idx]}
    </span>
  )
}

// ─── Source chip + contextual chips ──────────────────────────────────────────

const SOURCE_OPTIONS = [
  { value: 'general',  label: 'General Chat',      icon: MessageSquare },
  { value: 'consumer', label: 'Consumer Insights', icon: BarChart2     },
  { value: 'market',   label: 'Market Insights',   icon: Globe         },
] as const
type SourceMode = 'general' | 'consumer' | 'market'

const SURVEY_OPTIONS  = ['All Surveys', 'Survey Pulse', 'Brand KPIs', 'Media & Touchpoints', 'Survey Library']
const MARKET_OPTIONS  = ['All Markets', 'Consumer Electronics', 'Fashion', 'Food & Beverage', 'Finance', 'Health', 'Mobility']
const COUNTRY_OPTIONS = ['All Countries', 'Germany', 'United States', 'United Kingdom', 'France', 'Japan', 'Brazil']

function ContextChip({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const isDefault = value === options[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'h-[26px] px-2 rounded-[6px] border text-xs flex items-center gap-1 cursor-pointer transition-colors',
          isDefault
            ? 'bg-sidebar border-border text-muted-foreground hover:border-primary/40'
            : 'bg-primary/5 border-primary/30 text-primary'
        )}
      >
        <span>{value}</span>
        <ChevronDown size={10} className="shrink-0" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
          <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">{label}</p>
          {options.map(opt => (
            <button
              key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={cn('w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors', opt === value ? 'text-primary font-medium' : 'text-gray-700')}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function SourceChip({ value, onChange }: { value: SourceMode; onChange: (v: SourceMode) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SOURCE_OPTIONS.find(o => o.value === value)!
  const CurrentIcon = current.icon

  useEffect(() => {
    function close(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-[26px] px-2 rounded-[6px] bg-sidebar border border-border text-xs flex items-center gap-1 cursor-pointer transition-colors hover:border-primary/40 text-muted-foreground"
      >
        <CurrentIcon size={11} className="shrink-0" />
        <span>{current.label}</span>
        <ChevronDown size={10} className="shrink-0" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
          <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">Source</p>
          {SOURCE_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn('w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2', opt.value === value ? 'text-primary font-medium' : 'text-gray-700')}
              >
                <Icon size={12} className="shrink-0" />
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Input box ────────────────────────────────────────────────────────────────

function InputBox({
  input, setInput, isStreaming, onSend, rows = 2,
}: {
  input: string; setInput: (v: string) => void; isStreaming: boolean; onSend: () => void; rows?: number
}) {
  const [sourceMode, setSourceMode] = useState<SourceMode>('general')
  const [survey, setSurvey]   = useState(SURVEY_OPTIONS[0])
  const [market, setMarket]   = useState(MARKET_OPTIONS[0])
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0])
  const [audience, setAudience] = useState('All Audiences')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Listen for "focus-chat-input" custom event (dispatched by AudienceCard "Refine in chat")
  useEffect(() => {
    function onFocus() { textareaRef.current?.focus() }
    document.addEventListener('focus-chat-input', onFocus)
    return () => document.removeEventListener('focus-chat-input', onFocus)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  return (
    <div className="rounded-2xl bg-white border border-border shadow-sm overflow-visible">
      {/* Textarea area with revolving placeholder */}
      <div className="relative px-4 pt-3 pb-1">
        {!input && (
          <div className="absolute top-3 left-4 right-16 text-sm text-muted-foreground pointer-events-none overflow-hidden flex items-start">
            <RevolvingPlaceholder />
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="resize-none text-sm w-full bg-transparent outline-none border-0 text-gray-900 placeholder:text-transparent"
          rows={rows}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder=" "
        />
      </div>

      {/* Bottom row: chips left, send right */}
      <div className="flex items-center gap-1.5 px-3 pb-2.5 border-t border-border pt-2">
        {/* Source chip */}
        <SourceChip value={sourceMode} onChange={setSourceMode} />

        {/* Contextual chips */}
        {sourceMode === 'consumer' && (
          <>
            <ContextChip label="Survey"   value={survey}   options={SURVEY_OPTIONS}  onChange={setSurvey} />
            <ContextChip label="Audience" value={audience} options={['All Audiences', 'Millennial Shoppers', 'Gen Z Mobile Users', 'High-Income Homeowners']} onChange={setAudience} />
          </>
        )}
        {sourceMode === 'market' && (
          <>
            <ContextChip label="Market"  value={market}  options={MARKET_OPTIONS}  onChange={setMarket} />
            <ContextChip label="Country" value={country} options={COUNTRY_OPTIONS} onChange={setCountry} />
          </>
        )}

        <div className="flex-1" />

        {/* Send button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isStreaming}
          className="w-[30px] h-[30px] rounded-[6px] bg-gray-900 text-white flex items-center justify-center shrink-0 transition-opacity disabled:opacity-30"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Audience Card message ────────────────────────────────────────────────────

function AudienceCardMessage({ card }: { card: AudienceCardData }) {
  const navigate = useNavigate()
  const { add: addAudience } = useAudienceStore()
  const { dashboards } = useDashboardStore()
  const [saved, setSaved] = useState(false)
  const [dashPickerOpen, setDashPickerOpen] = useState(false)
  const [addedToDash, setAddedToDash] = useState<{ id: string; name: string } | null>(null)
  const dashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dashRef.current && !dashRef.current.contains(e.target as Node)) setDashPickerOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function handleOpenBuilder() {
    navigate('/audiences/new', { state: { prefill: card.prefill } })
  }

  function handleSaveToLibrary() {
    if (saved) return
    const aud: Audience = {
      id: `aud-${Date.now()}`,
      name: card.prefill.name ?? card.name,
      description: card.subtitle,
      filters: card.prefill.filters ?? { id: 'fg-empty', operator: 'AND', conditions: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isShared: false,
      region: card.region,
    }
    addAudience(aud)
    setSaved(true)
  }

  function handleAddToDashboard(dashId: string, dashName: string) {
    setDashPickerOpen(false)
    setAddedToDash({ id: dashId, name: dashName })
  }

  return (
    <div className="max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-border bg-white shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{card.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{card.subtitle}</p>
          </div>
          {/* Confidence badge */}
          <span className="shrink-0 text-[11px] font-medium text-primary bg-primary/8 rounded-full px-2 py-0.5 leading-5">
            {card.confidence}% match
          </span>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <Users size={10} className="shrink-0" />
            {card.sampleSize.toLocaleString()} respondents
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <Globe size={10} className="shrink-0" />
            {card.region}
          </span>
        </div>
      </div>

      {/* ── Body: 2-column grid ── */}
      <div className="grid grid-cols-2 divide-x divide-border">
        {/* Demographics */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2">DEMOGRAPHICS</p>
          <div className="space-y-2">
            {card.demographics.map(d => (
              <div key={d.label} className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-muted-foreground shrink-0">{d.label}</span>
                <span className="text-[11px] font-medium text-gray-900 text-right">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behaviors */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2">BEHAVIORS</p>
          <div className="space-y-2">
            {card.behaviors.map(b => (
              <div key={b.label} className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-muted-foreground shrink-0">{b.label}</span>
                <span className="text-[11px] font-medium text-gray-900 text-right">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        {/* Primary row: Create draft + Add to dashboard */}
        <div className="flex items-center gap-2">
          {/* Create Draft Audience — primary action */}
          <button
            onClick={handleSaveToLibrary}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors active:scale-[0.98]',
              saved
                ? 'border border-green-200 bg-green-50 text-green-700 cursor-default'
                : 'bg-primary text-white hover:bg-primary/90'
            )}
          >
            {saved ? <Check size={11} /> : <Users size={11} />}
            {saved ? 'Audience created' : 'Create draft audience'}
          </button>

          {/* Add to Dashboard */}
          <div ref={dashRef} className="relative flex-1">
            <button
              onClick={() => !addedToDash && setDashPickerOpen(o => !o)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 h-8 rounded-lg border text-xs font-medium transition-colors',
                addedToDash
                  ? 'border-green-200 bg-green-50 text-green-700 cursor-default'
                  : 'border-border bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              )}
            >
              {addedToDash ? <Check size={11} /> : <LayoutDashboard size={11} />}
              {addedToDash ? 'Added' : 'Add to Dashboard'}
            </button>

            {/* Dashboard picker dropdown */}
            {dashPickerOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">Select dashboard</p>
                {dashboards.length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">No dashboards yet</p>
                )}
                {dashboards.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleAddToDashboard(d.id, d.name)}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{d.name}</span>
                    <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refine in chat */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('focus-chat-input'))}
            className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Refine
          </button>
        </div>

        {/* Open in Builder — secondary link */}
        <button
          onClick={handleOpenBuilder}
          className="w-full flex items-center justify-center gap-1 h-7 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Open in Audience Builder
          <ArrowUpRight size={11} className="shrink-0" />
        </button>

        {/* Go to Dashboard strip */}
        {addedToDash && (
          <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-xs text-green-800">Added to <span className="font-medium">{addedToDash.name}</span></span>
            <button
              onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
              className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-900 transition-colors shrink-0"
            >
              Go there
              <ExternalLink size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Data Widget Card message ─────────────────────────────────────────────────

function DataWidgetCardMessage({ card }: { card: DataWidgetCardData }) {
  const navigate = useNavigate()
  const { dashboards } = useDashboardStore()
  const [dashPickerOpen, setDashPickerOpen] = useState(false)
  const [addedToDash, setAddedToDash] = useState<{ id: string; name: string } | null>(null)
  const dashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dashRef.current && !dashRef.current.contains(e.target as Node)) setDashPickerOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  // Minimal Widget shell — ChartRenderer only needs type + id
  const fakeWidget: Widget = {
    id: 'chat-widget-preview',
    type: card.chartType,
    title: card.title,
    audienceId: '',
    metric: card.metric,
    createdAt: new Date().toISOString(),
  }

  function handleAddToDashboard(dashId: string, dashName: string) {
    setDashPickerOpen(false)
    setAddedToDash({ id: dashId, name: dashName })
  }

  return (
    <div className="max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-border bg-white shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{card.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
          </div>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 leading-5 whitespace-nowrap">
            {card.metric}
          </span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-3 pt-3 pb-1">
        <ChartRenderer widget={fakeWidget} data={card.chartData} height={150} />
      </div>

      {/* ── Source ── */}
      <div className="px-4 pb-3">
        <span className="text-[10px] text-muted-foreground">Source: {card.source}</span>
      </div>

      {/* ── CTAs ── */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2">

          {/* Add to Dashboard (primary) */}
          <div ref={dashRef} className="relative flex-1">
            <button
              onClick={() => !addedToDash && setDashPickerOpen(o => !o)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors',
                addedToDash
                  ? 'border border-green-200 bg-green-50 text-green-700 cursor-default'
                  : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
              )}
            >
              {addedToDash ? <Check size={11} /> : <LayoutDashboard size={11} />}
              {addedToDash ? 'Added to Dashboard' : 'Add to Dashboard'}
            </button>

            {/* Dashboard picker */}
            {dashPickerOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">Select dashboard</p>
                {dashboards.length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">No dashboards yet</p>
                )}
                {dashboards.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleAddToDashboard(d.id, d.name)}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{d.name}</span>
                    <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refine */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('focus-chat-input'))}
            className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Refine
          </button>
        </div>

        {/* Go to Dashboard strip */}
        {addedToDash && (
          <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-xs text-green-800">
              Added to <span className="font-medium">{addedToDash.name}</span>
            </span>
            <button
              onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
              className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-900 transition-colors shrink-0"
            >
              Go there <ExternalLink size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Follow-up suggestion chips ───────────────────────────────────────────────

function FollowUpChips({ suggestions, onSend }: { suggestions: string[]; onSend: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map(q => (
        <button
          key={q}
          onClick={() => onSend(q)}
          className="flex items-center gap-1.5 text-xs text-primary border border-primary/25 bg-primary/5 rounded-full px-3 py-1.5 hover:bg-primary/10 hover:border-primary/40 transition-colors"
        >
          <ChevronRight size={11} className="shrink-0" />
          {q}
        </button>
      ))}
    </div>
  )
}

// ─── Message rendering ────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

function MessageBubble({ msg, onSend }: { msg: AIMessage; onSend: (q: string) => void }) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-xl ml-12">
          <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground">
            {msg.content.split('\n').map((line, i, arr) => (
              <span key={i}>{renderMarkdown(line)}{i < arr.length - 1 && <br />}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-4">
      {/* Avatar */}
      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0 mt-1">
        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
      </div>

      <div className="max-w-xl mr-8 w-full">
        {/* Text bubble */}
        <div className={cn(
          'rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-muted text-foreground',
          !msg.isStreaming && (msg.audienceCard || msg.dataWidget) && 'mb-3'
        )}>
          {msg.isStreaming ? (
            <span>
              {renderMarkdown(msg.content)}
              <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm" />
            </span>
          ) : (
            msg.content.split('\n').map((line, i, arr) => (
              <span key={i}>{renderMarkdown(line)}{i < arr.length - 1 && <br />}</span>
            ))
          )}
        </div>

        {/* Audience card */}
        {!msg.isStreaming && msg.audienceCard && (
          <AudienceCardMessage card={msg.audienceCard} />
        )}

        {/* Data widget card */}
        {!msg.isStreaming && msg.dataWidget && (
          <DataWidgetCardMessage card={msg.dataWidget} />
        )}

        {/* Follow-up suggestion chips */}
        {!msg.isStreaming && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
          <FollowUpChips suggestions={msg.suggestedFollowUps} onSend={onSend} />
        )}

        {/* Attribution */}
        {!msg.isStreaming && msg.attribution && (
          <p className="text-xs text-muted-foreground mt-1.5 px-1">
            Based on Statista survey data, {msg.attribution}
          </p>
        )}
      </div>
    </div>
  )
}

function StreamingSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0 mt-1">
        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
      <div className="space-y-2 max-w-xs">
        <Skeleton className="h-4 w-64" /><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-56" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchAIPage() {
  const { conversation, isStreaming, addMessage, updateLastAssistantMessage, setStreaming, reset } = useAIStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation.messages, isStreaming])

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current) } }, [])

  function handleSend(override?: string) {
    const text = (override ?? input).trim()
    if (!text || isStreaming) return
    setInput('')

    addMessage({ id: `msg-${Date.now()}`, role: 'user', content: text })

    // Detect context from last assistant message
    const lastAssistantMsg = conversation.messages
      .filter(m => m.role === 'assistant')
      .at(-1)
    const lastWasClarify = lastAssistantMsg?.messageType === 'clarify'
    const lastHadAudienceCard = lastAssistantMsg?.messageType === 'audience_card'

    const assistantMsg: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    addMessage(assistantMsg)
    setStreaming(true)

    const scenario = getFakeAIResponse(text, { lastWasClarify, lastHadAudienceCard })

    let charIndex = 0
    intervalRef.current = setInterval(() => {
      charIndex++
      updateLastAssistantMessage({ content: scenario.content.slice(0, charIndex) })
      if (charIndex >= scenario.content.length) {
        clearInterval(intervalRef.current!)
        updateLastAssistantMessage({
          content: scenario.content,
          isStreaming: false,
          attribution: scenario.dataset,
          audienceCard: scenario.audienceCard,
          dataWidget: scenario.dataWidget,
          messageType: scenario.type,
          suggestedFollowUps: scenario.suggestedFollowUps,
        })
        setStreaming(false)
      }
    }, 18)
  }

  const isEmpty = conversation.messages.length === 0

  return (
    <div className="flex h-full overflow-hidden">

      {/* Chat history panel */}
      <ChatHistoryPanel
        onSelect={q => { reset(); setInput(q) }}
        onNew={reset}
        showNewChat={!isEmpty}
      />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        {/* Grid background — scoped to content area only */}
        <div style={gridBgStyle} aria-hidden />
        {isEmpty ? (
          /* ── Empty / home state ── */
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-12 px-8">
              <div className="w-full max-w-[640px]">

                {/* Heading */}
                <h2 className="text-[24px] leading-[36px] font-bold text-gray-900 mb-8">
                  What are you researching today?<br />
                  Good to see you, <span style={gradientNameStyle}>Nikos</span>.
                </h2>

                {/* Input */}
                <InputBox
                  input={input} setInput={setInput}
                  isStreaming={isStreaming} onSend={() => handleSend()}
                />

                <p className="text-xs text-muted-foreground mt-2.5 text-center">
                  Press Enter to send · Shift+Enter for new line · Responses are illustrative
                </p>

                {/* Use-case tiles */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {USE_CASES.map(({ Icon, title, desc, color }) => (
                    <UseCaseTile
                      key={title}
                      Icon={Icon}
                      title={title}
                      desc={desc}
                      color={color}
                      onClick={() => handleSend(title)}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* ── Conversation state ── */
          <>
            <div className="relative flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Research AI
              </div>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1.5 hover:bg-accent">
                <RotateCcw className="h-3 w-3" />
                New conversation
              </button>
            </div>

            <div ref={scrollRef} className="relative flex-1 min-h-0 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto">
                {conversation.messages.map(msg => <MessageBubble key={msg.id} msg={msg} onSend={handleSend} />)}
                {isStreaming && conversation.messages.at(-1)?.role !== 'assistant' && <StreamingSkeleton />}
              </div>
            </div>

            <div className="relative px-6 py-4 shrink-0">
              <div className="max-w-3xl mx-auto">
                <InputBox
                  input={input} setInput={setInput}
                  isStreaming={isStreaming} onSend={() => handleSend()}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send · Shift+Enter for new line · Responses are illustrative
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
