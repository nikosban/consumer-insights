import { useEffect, useRef, useState, useCallback } from 'react'
import { useLayout } from '@/components/layout/LayoutContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAIStore } from '@/store/aiStore'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import type { ChatHistoryEntry } from '@/store/aiStore'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getFakeAIResponse, isEVTrigger,
  EV_PROCESSING_STEPS, EV_AI_TEXT, EV_BENCHMARK_PANEL,
  EV_WIDGET_CLUSTER, EV_AUDIENCE_DRAFT, EV_FOLLOW_UPS,
} from '@/data/fakeGenerators'
import { PRESET_CONVERSATIONS } from '@/data/presetConversations'
import ChartRenderer from '@/components/charts/ChartRenderer'
import type {
  AudienceCardData, DataWidgetCardData, Audience, AIMessage, Widget,
  ProcessingStep, BenchmarkPanelData, AudienceDraftData,
} from '@/types'
import { IconSend, IconSparkles, IconChevronDown, IconUsers, IconGlobe, IconTrendingUp, IconEdit, IconMessage, IconChartBar, IconCheck, IconLayoutDashboard, IconExternalLink, IconChevronRight, IconArrowUpRight, IconCrown, IconPlus, IconDownload, IconCopy, IconChartLine, IconTable, IconTrash, IconX, IconMessagePlus, IconAlertTriangleFilled, IconThumbUp, IconThumbDown } from '@tabler/icons-react'
import type { WidgetType } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'

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
  { Icon: IconUsers,       title: 'Audience Profiler',  desc: 'Build and explore precise audience segments',  color: '#F97316' },
  { Icon: IconGlobe,       title: 'Geomarket Brief',    desc: 'Compare consumer behaviour across regions',    color: '#22C55E' },
  { Icon: IconTrendingUp,  title: 'Brand Position',     desc: 'Benchmark awareness and competitive standing', color: '#A855F7' },
]

function UseCaseTile({ Icon, title, desc, color, onClick }: { Icon: React.ElementType; title: string; desc: string; color: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-start p-4 rounded-xl bg-muted transition-all text-left w-full border border-transparent hover:border-border hover:shadow-md"
    >
      <div
        style={hovered ? metalGradient(color) : {}}
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
          !hovered && 'bg-accent'
        )}
      >
        <Icon size={15} strokeWidth={2.5} className={hovered ? 'text-white' : 'text-muted-foreground'} />
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold text-foreground leading-snug">{title}</p>
        <p className="text-xs text-secondary-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </button>
  )
}

// ─── Chat History ─────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function groupHistory(history: ChatHistoryEntry[]) {
  const now = Date.now()
  const recent: ChatHistoryEntry[] = []
  const older: ChatHistoryEntry[] = []
  history.forEach(entry => {
    const days = (now - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (days < 7) recent.push(entry)
    else          older.push(entry)
  })
  return { recent, older }
}

function HistoryRow({ entry, onSelect }: { entry: ChatHistoryEntry; onSelect: (q: string) => void }) {
  const { removeHistory } = useAIStore()
  return (
    <div className="flex items-center px-1 rounded-md transition-colors hover:bg-accent group">
      <button
        onClick={() => onSelect(entry.firstMessage)}
        className="flex items-center gap-2 flex-1 min-w-0 text-left py-2 pl-2 pr-1"
      >
        <span className="flex-1 truncate text-xs text-foreground">{entry.firstMessage}</span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums group-hover:hidden">{formatDate(entry.createdAt)}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); removeHistory(entry.id) }}
        title="Delete"
        className="shrink-0 hidden group-hover:flex w-5 h-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
      >
        <IconX size={11} strokeWidth={2} />
      </button>
    </div>
  )
}

function HistoryGroup({ label, entries, onSelect }: { label: string; entries: ChatHistoryEntry[]; onSelect: (q: string) => void }) {
  if (entries.length === 0) return null
  return (
    <div className="mb-1">
      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">{label}</p>
      {entries.map(entry => <HistoryRow key={entry.id} entry={entry} onSelect={onSelect} />)}
    </div>
  )
}

/** Inline section rendered below the use-case tiles on the empty state */
function InlineHistory({ onSelect }: { onSelect: (q: string) => void }) {
  const { history } = useAIStore()
  const { recent, older } = groupHistory(history)
  const hasAny = recent.length + older.length > 0
  if (!hasAny) return null
  return (
    <div className="mt-8">
      <p className="px-3 text-xs font-semibold text-foreground mb-2">Recent chats</p>
      <HistoryGroup label="Recent" entries={recent} onSelect={onSelect} />
      <HistoryGroup label="Older"  entries={older}  onSelect={onSelect} />
    </div>
  )
}

/** Right sidebar shown during an active conversation */
function ChatHistoryPanel({ onSelect, onNew }: { onSelect: (q: string) => void; onNew: () => void }) {
  const { history, clearHistory } = useAIStore()
  const { recent, older } = groupHistory(history)
  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-l border-border bg-sidebar h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 h-14 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">Chat history</span>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              title="Clear history"
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
            >
              <IconTrash size={12} strokeWidth={2} />
            </button>
          )}
          <button
            onClick={onNew}
            title="New chat"
            className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <IconEdit size={12} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto py-2">
        <HistoryGroup label="Recent" entries={recent} onSelect={onSelect} />
        <HistoryGroup label="Older"  entries={older}  onSelect={onSelect} />
        {recent.length + older.length === 0 && (
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
  { value: 'general',  label: 'General Chat',      icon: IconMessage   },
  { value: 'consumer', label: 'Consumer Insights', icon: IconChartBar  },
  { value: 'market',   label: 'Market Insights',   icon: IconGlobe     },
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
          'h-[30px] px-2 rounded-[6px] border text-xs flex items-center gap-1 cursor-pointer transition-colors',
          isDefault
            ? 'bg-sidebar border-border text-muted-foreground hover:border-primary/40'
            : 'bg-primary/5 border-primary/30 text-primary'
        )}
      >
        <span>{value}</span>
        <IconChevronDown size={10} className="shrink-0" strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-20 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
          <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">{label}</p>
          {options.map(opt => (
            <button
              key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={cn('w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors', opt === value ? 'text-primary font-medium' : 'text-foreground')}
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
        className="h-[30px] px-2 rounded-[6px] bg-sidebar border border-border text-xs flex items-center gap-1 cursor-pointer transition-colors hover:border-primary/40 text-muted-foreground"
      >
        <CurrentIcon size={11} className="shrink-0" />
        <span>{current.label}</span>
        <IconChevronDown size={10} className="shrink-0" strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-20 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
          <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">Source</p>
          {SOURCE_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn('w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2', opt.value === value ? 'text-primary font-medium' : 'text-foreground')}
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
  const [sourceMode, setSourceMode] = useState<SourceMode>('consumer')
  const [survey, setSurvey]   = useState(SURVEY_OPTIONS[0])
  const [market, setMarket]   = useState(MARKET_OPTIONS[0])
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0])
  const [audience, setAudience] = useState('All Audiences')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    function onFocus() { textareaRef.current?.focus() }
    function onSet(e: Event) {
      const text = (e as CustomEvent<string>).detail
      setInput(text)
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
    document.addEventListener('focus-chat-input', onFocus)
    document.addEventListener('set-chat-input', onSet)
    return () => {
      document.removeEventListener('focus-chat-input', onFocus)
      document.removeEventListener('set-chat-input', onSet)
    }
  }, [setInput])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-visible">
      {/* Textarea area with revolving placeholder */}
      <div className="relative px-4 pt-3 pb-1">
        {!input && (
          <div className="absolute top-3 left-4 right-16 text-sm text-muted-foreground pointer-events-none overflow-hidden flex items-start">
            <RevolvingPlaceholder />
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="resize-none text-sm w-full bg-transparent outline-none border-0 text-foreground placeholder:text-transparent"
          rows={rows}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder=" "
        />
      </div>

      {/* Bottom row: chips left, send right */}
      <div className="flex items-center gap-1.5 px-3 pb-2.5 pt-2">
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
          className="w-[30px] h-[30px] rounded-[6px] bg-foreground text-background flex items-center justify-center shrink-0"
        >
          <IconSend className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

// ─── Audience Card message ────────────────────────────────────────────────────

function AudienceCardMessage({ card }: { card: AudienceCardData }) {
  const navigate = useNavigate()
  const { add: addAudience } = useAudienceStore()
  const { dashboards, updateLayout } = useDashboardStore()
  const { add: addWidget } = useWidgetStore()
  const [saved, setSaved] = useState(false)
  const [dashPickerOpen, setDashPickerOpen] = useState(false)
  const [addedToDash, setAddedToDash] = useState<{ id: string; name: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const dashRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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
    toast.success('Audience saved to library')
  }

  function handleAddToDashboard(dashId: string, dashName: string) {
    setDashPickerOpen(false)
    const widgetId = `widget-${Date.now()}`
    const newWidget: Widget = {
      id: widgetId,
      type: 'bar',
      title: card.name,
      audienceId: '',
      metric: card.subtitle,
      createdAt: new Date().toISOString(),
    }
    addWidget(newWidget)
    const dash = dashboards.find(d => d.id === dashId)
    const existing = dash?.widgets ?? []
    const y = existing.reduce((max, w) => Math.max(max, w.position.y + w.position.h), 0)
    updateLayout(dashId, [...existing, { widgetId, position: { x: 0, y, w: 6, h: 4 } }])
    setAddedToDash({ id: dashId, name: dashName })
    toast.success(`Added to ${dashName}`)
  }

  async function handleCopy() {
    if (!cardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true })
    canvas.toBlob(blob => {
      if (!blob) return
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => toast.success('Image copied to clipboard'))
        .catch(() => toast.error('Copy failed'))
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={cardRef} className="max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-border bg-card shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight">{card.name}</h3>
            <p className="text-xs text-secondary-foreground mt-0.5 leading-snug">{card.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-medium text-primary bg-primary/8 rounded-full px-2 py-0.5 leading-5">
              {card.confidence}% match
            </span>
            <button title="Export PNG" onClick={() => cardRef.current && exportElAsPng(cardRef.current, card.name)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <IconDownload size={12} strokeWidth={2} />
            </button>
            <button title={copied ? 'Copied!' : 'Copy image'} onClick={handleCopy}
              className={cn('w-6 h-6 flex items-center justify-center rounded transition-colors', copied ? 'text-green-600' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}>
              {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] text-secondary-foreground bg-muted rounded-full px-2 py-0.5">
            <IconUsers size={10} className="shrink-0" strokeWidth={2} />
            {card.sampleSize.toLocaleString()} respondents
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-secondary-foreground bg-muted rounded-full px-2 py-0.5">
            <IconGlobe size={10} className="shrink-0" strokeWidth={2} />
            {card.region}
          </span>
        </div>
      </div>

      {/* ── Body: 2-column grid ── */}
      <div className="grid grid-cols-2 divide-x divide-border">
        {/* Demographics */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold text-secondary-foreground mb-2">Demographics</p>
          <div className="space-y-2">
            {card.demographics.map(d => (
              <div key={d.label} className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-secondary-foreground shrink-0">{d.label}</span>
                <span className="text-xs font-medium text-foreground text-right">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behaviors */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold text-secondary-foreground mb-2">Behaviors</p>
          <div className="space-y-2">
            {card.behaviors.map(b => (
              <div key={b.label} className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-secondary-foreground shrink-0">{b.label}</span>
                <span className="text-xs font-medium text-foreground text-right">{b.value}</span>
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
            {saved ? <IconCheck size={11} strokeWidth={2} /> : <IconUsers size={11} strokeWidth={2} />}
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
                  : 'border-border bg-background text-foreground hover:bg-accent'
              )}
            >
              {addedToDash ? <IconCheck size={11} strokeWidth={2} /> : <IconLayoutDashboard size={11} strokeWidth={2} />}
              {addedToDash ? 'Added' : 'Add to Dashboard'}
            </button>

            {dashPickerOpen && (
              <DashboardPickerDropdown dashboards={dashboards} onSelect={(id, name) => { setDashPickerOpen(false); handleAddToDashboard(id, name) }} label="Select dashboard" direction="up" />
            )}
          </div>

          {/* Refine in chat */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('focus-chat-input'))}
            className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-accent transition-colors"
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
          <IconArrowUpRight size={11} className="shrink-0" strokeWidth={2} />
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
              <IconExternalLink size={10} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Viz type switcher ────────────────────────────────────────────────────────

const VIZ_TYPES: { type: WidgetType; Icon: React.ElementType; label: string }[] = [
  { type: 'bar',   Icon: IconChartBar,   label: 'Bar'   },
  { type: 'line',  Icon: IconChartLine,  label: 'Line'  },
  { type: 'table', Icon: IconTable,      label: 'Table' },
]

function VizSwitcher({ value, onChange }: { value: WidgetType; onChange: (t: WidgetType) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
      {VIZ_TYPES.map(({ type, Icon, label }) => (
        <button
          key={type}
          title={label}
          onClick={() => onChange(type)}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded transition-colors',
            value === type ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon size={12} />
        </button>
      ))}
    </div>
  )
}

// ─── Export helpers ───────────────────────────────────────────────────────────

async function exportElAsPng(el: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = filename
  a.click()
  toast.success('PNG exported')
}

// ─── Data Widget Card message ─────────────────────────────────────────────────

function DataWidgetCardMessage({ card }: { card: DataWidgetCardData }) {
  const navigate = useNavigate()
  const { dashboards, updateLayout } = useDashboardStore()
  const { add: addWidget } = useWidgetStore()
  const [dashPickerOpen, setDashPickerOpen] = useState(false)
  const [addedToDash, setAddedToDash] = useState<{ id: string; name: string } | null>(null)
  const [vizType, setVizType] = useState<WidgetType>(card.chartType)
  const [copied, setCopied] = useState(false)
  const dashRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dashRef.current && !dashRef.current.contains(e.target as Node)) setDashPickerOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const fakeWidget: Widget = {
    id: 'chat-widget-preview',
    type: vizType,
    title: card.title,
    audienceId: '',
    metric: card.metric,
    createdAt: new Date().toISOString(),
  }

  function handleAddToDashboard(dashId: string, dashName: string) {
    setDashPickerOpen(false)
    const widgetId = `widget-${Date.now()}`
    addWidget({ id: widgetId, type: vizType, title: card.title, audienceId: '', metric: card.metric, createdAt: new Date().toISOString() })
    const dash = dashboards.find(d => d.id === dashId)
    const existing = dash?.widgets ?? []
    const y = existing.reduce((max, w) => Math.max(max, w.position.y + w.position.h), 0)
    updateLayout(dashId, [...existing, { widgetId, position: { x: 0, y, w: 6, h: 4 } }])
    setAddedToDash({ id: dashId, name: dashName })
    toast.success(`Added to ${dashName}`)
  }

  async function handleCopy() {
    if (!cardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true })
    canvas.toBlob(blob => {
      if (!blob) return
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => toast.success('Image copied to clipboard'))
        .catch(() => toast.error('Copy failed'))
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Derive three scannable metrics from the primary series
  const primaryValues = card.chartData.series[0]?.values ?? []
  const primaryLabels = card.chartData.labels ?? []
  const isMultiValue = primaryValues.length > 1
  const peakIdx = isMultiValue ? primaryValues.reduce((best, v, i) => v > primaryValues[best] ? i : best, 0) : 0
  const peakVal = primaryValues[peakIdx] ?? 0
  const peakLabel = primaryLabels[peakIdx] ?? ''
  const avg = isMultiValue ? Math.round(primaryValues.reduce((s, v) => s + v, 0) / primaryValues.length) : 0
  const delta = peakVal - avg

  return (
    <div ref={cardRef} className="w-full rounded-2xl rounded-bl-sm border border-border bg-card shadow-sm overflow-hidden">

      {/* ── Header: title + add-to-dashboard icon ── */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-tight">{card.title}</h3>
          <div ref={dashRef} className="relative shrink-0">
            <button
              title={addedToDash ? 'Added to dashboard' : 'Add to dashboard'}
              onClick={() => !addedToDash && setDashPickerOpen(o => !o)}
              className={cn(
                'w-6 h-6 flex items-center justify-center rounded transition-colors',
                addedToDash ? 'text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {addedToDash ? <IconCheck size={12} strokeWidth={2} /> : <IconLayoutDashboard size={12} strokeWidth={2} />}
            </button>
            {dashPickerOpen && (
              <DashboardPickerDropdown dashboards={dashboards} onSelect={(id, name) => { setDashPickerOpen(false); handleAddToDashboard(id, name) }} label="Select dashboard" direction="down" />
            )}
          </div>
        </div>

        {/* ── Metric strip ── */}
        {isMultiValue && (
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-[11px] text-muted-foreground leading-none mb-1">Peak</p>
              <p className="text-sm font-semibold text-foreground leading-none">{peakVal}% <span className="text-xs font-normal text-secondary-foreground">· {peakLabel}</span></p>
            </div>
            <div className="w-px self-stretch bg-border" />
            <div>
              <p className="text-[11px] text-muted-foreground leading-none mb-1">Average</p>
              <p className="text-sm font-semibold text-foreground leading-none">{avg}%</p>
            </div>
            <div className="w-px self-stretch bg-border" />
            <div>
              <p className="text-[11px] text-muted-foreground leading-none mb-1">Peak vs avg</p>
              <p className="text-sm font-semibold text-foreground leading-none">+{delta}pp</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      <div className="px-3 pt-3 pb-2" style={{ height: 220 }}>
        <ChartRenderer widget={fakeWidget} data={card.chartData} height={220} />
      </div>

      {/* ── Footer: actions left, added-confirmation right ── */}
      <div className="px-3 py-2 border-t border-border flex items-center gap-1">
        <VizSwitcher value={vizType} onChange={setVizType} />
        <button title="Export PNG" onClick={() => cardRef.current && exportElAsPng(cardRef.current, card.title)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <IconDownload size={12} strokeWidth={2} />
        </button>
        <button title={copied ? 'Copied!' : 'Copy image'} onClick={handleCopy}
          className={cn('w-6 h-6 flex items-center justify-center rounded transition-colors', copied ? 'text-green-600' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}>
          {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
        </button>
        {addedToDash && (
          <div className="flex-1 flex items-center justify-between ml-2">
            <span className="text-xs text-green-700">Added to <span className="font-medium">{addedToDash.name}</span></span>
            <button onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
              className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-900 transition-colors shrink-0">
              Go there <IconExternalLink size={10} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Message action bar (copy / edit) ────────────────────────────────────────

function MessageActions({ text, role = 'user' }: { text: string; role?: 'user' | 'assistant' }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Response copied'))
      .catch(() => toast.error('Copy failed'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (role === 'assistant') {
    return (
      <div className="flex items-center gap-0.5 mt-1">
        <button
          title="This response was good"
          className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <IconThumbUp size={12} strokeWidth={2} />
        </button>
        <button
          title="This response was not good"
          className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <IconThumbDown size={12} strokeWidth={2} />
        </button>
        <button
          title={copied ? 'Copied!' : 'Copy'}
          onClick={handleCopy}
          className={cn('flex items-center justify-center h-6 w-6 rounded transition-colors',
            copied ? 'text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
        >
          {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5 mt-1">
      <button
        title={copied ? 'Copied!' : 'Copy'}
        onClick={handleCopy}
        className={cn('flex items-center justify-center h-6 w-6 rounded transition-colors',
          copied ? 'text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
      >
        {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
      </button>
      <button
        title="Edit and resend"
        onClick={() => document.dispatchEvent(new CustomEvent('set-chat-input', { detail: text }))}
        className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <IconEdit size={12} strokeWidth={2} />
      </button>
    </div>
  )
}

// ─── Follow-up suggestion chips ───────────────────────────────────────────────

function FollowUpChips({ suggestions, onSend }: { suggestions: string[]; onSend: (q: string) => void }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-1.5 mb-2.5">
        <IconSparkles size={12} strokeWidth={2} className="text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground">Query suggestions</span>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.map(q => (
          <button
            key={q}
            onClick={() => onSend(q)}
            className="flex items-center gap-1.5 text-xs text-primary bg-transparent rounded-lg px-3 py-1.5 hover:bg-primary/8 active:bg-primary/12 transition-colors text-left w-full"
          >
            <IconMessagePlus size={11} className="shrink-0 text-primary/70" strokeWidth={2} />
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── EV Demo: Processing Steps ───────────────────────────────────────────────

function ProcessingStepsDisplay({ steps }: { steps: ProcessingStep[] }) {
  const [expanded, setExpanded] = useState(false)
  const allDone = steps.every(s => s.status === 'done')
  const activeStep = steps.find(s => s.status === 'active')
  const doneCount = steps.filter(s => s.status === 'done').length

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* header — always visible, click to toggle */}
      <button
        type="button"
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <span className="text-[11px] font-semibold text-secondary-foreground flex-1">
          {allDone
            ? `${doneCount} steps completed`
            : activeStep
              ? activeStep.label
              : 'Processing'
          }
        </span>
        <IconChevronDown size={12} className={cn('text-muted-foreground transition-transform shrink-0', expanded && 'rotate-180')} strokeWidth={2} />
      </button>

      {/* expandable body */}
      {expanded && (
        <div className="px-3 py-2 space-y-1.5 border-t border-border">
          {steps.map((step, i) => (
            <div key={i} className={cn('flex items-center gap-2 text-xs transition-opacity duration-300', step.status === 'pending' ? 'opacity-30' : 'opacity-100')}>
              <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                {step.status === 'done' && <IconCheck size={11} className="text-green-600" strokeWidth={2} />}
                {step.status === 'active' && (
                  <svg className="animate-spin h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {step.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />}
              </div>
              <span className={cn('shrink-0 font-medium w-36', step.status === 'done' ? 'text-muted-foreground' : step.status === 'active' ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
              <span className={cn('truncate', step.status === 'active' ? 'text-primary' : 'text-muted-foreground')}>
                {step.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── EV Demo: Benchmark Panel ─────────────────────────────────────────────────

function BenchmarkPanel({ panel, onCreateDraft }: { panel: BenchmarkPanelData; onCreateDraft: () => void }) {
  const maxIntent = Math.max(...panel.segments.map(s => s.intentScore))

  return (
    <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
        <span className="text-[11px] font-semibold text-secondary-foreground">Audience segments</span>
      </div>

      {/* segment cards */}
      <div className="grid grid-cols-3 divide-x divide-border">
        {panel.segments.map(seg => (
          <div
            key={seg.name}
            className={cn(
              'p-3 flex flex-col gap-2',
              seg.isBestMatch && 'bg-primary/3'
            )}
          >
            {/* name + best match badge */}
            <div className="flex items-start justify-between gap-1 min-h-[32px]">
              <span className={cn('text-xs font-semibold leading-tight', seg.isBestMatch ? 'text-primary' : 'text-foreground')}>
                {seg.name}
              </span>
              {seg.isBestMatch && (
                <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 leading-none">
                  <IconCrown size={8} strokeWidth={2} />
                  Best
                </span>
              )}
            </div>

            {/* age + descriptor */}
            <div>
              <p className="text-[11px] text-secondary-foreground">{seg.ageRange}</p>
              <p className="text-[10px] text-muted-foreground/70 leading-snug mt-0.5">{seg.descriptor}</p>
            </div>

            {/* intent score */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] text-secondary-foreground">Intent</span>
                <span className={cn('text-sm font-bold', seg.isBestMatch ? 'text-primary' : 'text-foreground')}>
                  {seg.intentScore}%
                </span>
              </div>
              {/* bar */}
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', seg.isBestMatch ? 'bg-primary' : 'bg-muted-foreground/40')}
                  style={{ width: `${(seg.intentScore / maxIntent) * 100}%` }}
                />
              </div>
            </div>

            {/* universe */}
            <div className="flex items-center gap-1 text-[10px] text-secondary-foreground">
              <IconUsers size={9} strokeWidth={2} />
              {seg.universe}
            </div>
          </div>
        ))}
      </div>

      {/* nudge + CTA */}
      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-secondary-foreground mb-2">{panel.nudge}</p>
        <button
          onClick={onCreateDraft}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <IconPlus size={11} strokeWidth={2} />
          Create Audience Draft
        </button>
      </div>
    </div>
  )
}

// ─── EV Demo: Widget Cluster ──────────────────────────────────────────────────
// Renders each widget as its own card so they're visually separate.

function WidgetClusterCard({ card, index }: { card: DataWidgetCardData; index: number }) {
  const navigate = useNavigate()
  const { dashboards, updateLayout } = useDashboardStore()
  const { add: addWidget } = useWidgetStore()
  const [dashPickerOpen, setDashPickerOpen] = useState(false)
  const [addedToDash, setAddedToDash] = useState<{ id: string; name: string } | null>(null)
  const [vizType, setVizType] = useState<WidgetType>(card.chartType)
  const [copied, setCopied] = useState(false)
  const dashRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dashRef.current && !dashRef.current.contains(e.target as Node)) setDashPickerOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const fakeWidget: Widget = {
    id: `cluster-widget-${index}`,
    type: vizType,
    title: card.title,
    audienceId: '',
    metric: card.metric,
    createdAt: new Date().toISOString(),
  }

  function handleAdd(dashId: string, dashName: string) {
    setDashPickerOpen(false)
    const widgetId = `widget-${Date.now()}`
    addWidget({ id: widgetId, type: vizType, title: card.title, audienceId: '', metric: card.metric, createdAt: new Date().toISOString() })
    const dash = dashboards.find(d => d.id === dashId)
    const existing = dash?.widgets ?? []
    const y = existing.reduce((max, w) => Math.max(max, w.position.y + w.position.h), 0)
    updateLayout(dashId, [...existing, { widgetId, position: { x: 0, y, w: 6, h: 4 } }])
    setAddedToDash({ id: dashId, name: dashName })
    toast.success(`Added to ${dashName}`)
  }

  async function handleCopy() {
    if (!cardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true })
    canvas.toBlob(blob => {
      if (!blob) return
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => toast.success('Image copied to clipboard'))
        .catch(() => toast.error('Copy failed'))
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={cardRef} className="w-full rounded-2xl rounded-bl-sm border border-border bg-card shadow-sm overflow-hidden">
      {/* header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground leading-tight">{card.title}</h4>
            <p className="text-[11px] text-secondary-foreground mt-0.5">{card.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <VizSwitcher value={vizType} onChange={setVizType} />
            <button title="Export PNG" onClick={() => cardRef.current && exportElAsPng(cardRef.current, card.title)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <IconDownload size={12} strokeWidth={2} />
            </button>
            <button title={copied ? 'Copied!' : 'Copy image'} onClick={handleCopy}
              className={cn('w-6 h-6 flex items-center justify-center rounded transition-colors', copied ? 'text-green-600' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}>
              {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="px-3 pt-3 pb-1" style={{ height: 140 }}>
        <ChartRenderer widget={fakeWidget} data={card.chartData} height={140} />
      </div>

      {/* source */}
      <div className="px-4 pb-2">
        <span className="text-[10px] text-muted-foreground">Source: {card.source}</span>
      </div>

      {/* add to dashboard */}
      <div className="px-4 py-2.5 border-t border-border">
        <div ref={dashRef} className="relative">
          <button
            onClick={() => !addedToDash && setDashPickerOpen(o => !o)}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors',
              addedToDash
                ? 'border border-green-200 bg-green-50 text-green-700 cursor-default'
                : 'border border-border bg-background text-foreground hover:bg-accent'
            )}
          >
            {addedToDash ? <IconCheck size={11} strokeWidth={2} /> : <IconLayoutDashboard size={11} strokeWidth={2} />}
            {addedToDash ? `Added to ${addedToDash.name}` : 'Add to Dashboard'}
          </button>
          {dashPickerOpen && (
            <DashboardPickerDropdown dashboards={dashboards} onSelect={handleAdd} label="Select dashboard" direction="up" />
          )}
        </div>
        {addedToDash && (
          <button onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
            className="mt-1.5 w-full flex items-center justify-center gap-1 text-xs text-green-700 hover:text-green-900 transition-colors">
            View dashboard <IconExternalLink size={10} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}

function WidgetCluster({ widgets }: { widgets: DataWidgetCardData[] }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      {widgets.map((card, i) => (
        <WidgetClusterCard key={i} card={card} index={i} />
      ))}
    </div>
  )
}

// shared tiny component used by WidgetCluster
function DashboardPickerDropdown({ dashboards, onSelect, label, direction = 'down' }: {
  dashboards: { id: string; name: string }[]
  onSelect: (id: string, name: string) => void
  label: string
  direction?: 'up' | 'down'
}) {
  const { add: addDashboard } = useDashboardStore()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (creating) setTimeout(() => inputRef.current?.focus(), 0)
  }, [creating])

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    const id = `dash-${Date.now()}`
    addDashboard({ id, name, widgets: [], isShared: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    onSelect(id, name)
    setCreating(false)
    setNewName('')
  }

  return (
    <div onMouseDown={e => e.stopPropagation()} className={cn('absolute right-0 z-20 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[200px]', direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1')}>

      <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">{label}</p>
      {dashboards.map(d => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id, d.name)}
          className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between gap-2"
        >
          <span className="truncate">{d.name}</span>
          <IconChevronRight size={11} className="shrink-0 text-muted-foreground" strokeWidth={2} />
        </button>
      ))}
      <div className="border-t border-border mt-1 pt-1">
        {creating ? (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <input
              ref={inputRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setCreating(false); setNewName('') } }}
              placeholder="Dashboard name…"
              className="flex-1 text-xs border border-border rounded-md px-2 py-1 outline-none focus:border-primary min-w-0"
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white disabled:opacity-40 shrink-0"
            >
              <IconCheck size={11} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full text-left px-3 py-2 text-xs text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1.5"
          >
            <IconPlus size={11} strokeWidth={2} />
            New dashboard
          </button>
        )}
      </div>
    </div>
  )
}

// ─── EV Demo: Audience Draft Card ─────────────────────────────────────────────

function AudienceDraftCard({ draft }: { draft: AudienceDraftData }) {
  const navigate = useNavigate()
  const { add: addAudience } = useAudienceStore()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (saved) return
    const aud: Audience = {
      id: `aud-${Date.now()}`,
      name: draft.name,
      filters: draft.prefill.filters ?? { id: 'fg-empty', operator: 'AND', conditions: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isShared: false,
    }
    addAudience(aud)
    setSaved(true)
    toast.success('Audience saved to library')
  }

  function handleOpenBuilder() {
    navigate('/audiences/new', { state: { prefill: draft.prefill } })
  }

  return (
    <div className="mt-3 max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-primary/30 bg-card shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-primary/4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary">Audience draft</span>
        </div>
        <button
          onClick={handleOpenBuilder}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <IconEdit size={10} strokeWidth={2} />
          Edit
        </button>
      </div>

      {/* name */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-foreground">{draft.name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          ← Inherited from: <span className="font-medium text-foreground">{draft.inheritedFrom}</span>
        </p>
      </div>

      {/* filters */}
      <div className="px-4 pb-3">
        <div className="space-y-1.5">
          {draft.filters.map(f => (
            <div key={f.label} className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-secondary-foreground shrink-0">{f.label}</span>
              <span className="text-xs font-medium text-foreground text-right">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <button
          onClick={handleOpenBuilder}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
        >
          Open in Audience Builder
          <IconArrowUpRight size={10} strokeWidth={2} />
        </button>
        <button
          onClick={handleSave}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors',
            saved
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
          )}
        >
          {saved ? <IconCheck size={11} strokeWidth={2} /> : <IconUsers size={11} strokeWidth={2} />}
          {saved ? 'Saved' : 'Save to My Audiences'}
        </button>
      </div>
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

function MessageBubble({ msg, onSend, onCreateDraft }: {
  msg: AIMessage
  onSend: (q: string) => void
  onCreateDraft: () => void
}) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 group">
        <div className="max-w-xl ml-12">
          <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground">
            {msg.content.split('\n').map((line, i, arr) => (
              <span key={i}>{renderMarkdown(line)}{i < arr.length - 1 && <br />}</span>
            ))}
          </div>
          <div className="flex justify-end mt-1">
            <MessageActions text={msg.content} />
          </div>
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-4">
      {/* Avatar — aligned with top of first content block */}
      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0">
        <IconSparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2} />
      </div>

      <div className="w-full min-w-0">
        {/* Processing steps (EV demo) */}
        {msg.processingSteps && msg.processingSteps.length > 0 && (
          <ProcessingStepsDisplay steps={msg.processingSteps} />
        )}

        {/* Text bubble — constrained width for readability */}
        {(msg.content || (!msg.processingSteps && !msg.audienceDraft)) && (
          <div className={cn(!msg.content && 'hidden')}>
            <div className="max-w-xl rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-muted text-foreground">
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
            {!msg.isStreaming && msg.content && (
              <div className="max-w-xl flex justify-end">
                <MessageActions text={msg.content} role="assistant" />
              </div>
            )}
          </div>
        )}

        {/* Benchmark panel (EV demo) */}
        {!msg.isStreaming && msg.benchmarkPanel && (
          <div className="mt-4">
            <BenchmarkPanel panel={msg.benchmarkPanel} onCreateDraft={onCreateDraft} />
          </div>
        )}

        {/* Widget cluster (EV demo) */}
        {!msg.isStreaming && msg.widgetCluster && msg.widgetCluster.length > 0 && (
          <div className="mt-4">
            <WidgetCluster widgets={msg.widgetCluster} />
          </div>
        )}

        {/* Audience draft card */}
        {msg.audienceDraft && (
          <div className="mt-2">
            <AudienceDraftCard draft={msg.audienceDraft} />
          </div>
        )}

        {/* Audience card */}
        {!msg.isStreaming && msg.audienceCard && (
          <div className="mt-2">
            <AudienceCardMessage card={msg.audienceCard} />
          </div>
        )}

        {/* Data widget card */}
        {!msg.isStreaming && msg.dataWidget && (
          <div className="mt-2">
            <DataWidgetCardMessage card={msg.dataWidget} />
          </div>
        )}

        {/* Follow-up suggestion chips */}
        {!msg.isStreaming && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
          <FollowUpChips suggestions={msg.suggestedFollowUps} onSend={onSend} />
        )}
      </div>
    </div>
  )
}

function StreamingSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0">
        <IconSparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2} />
      </div>
      <div className="space-y-2 max-w-xs">
        <Skeleton className="h-4 w-64" /><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-56" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchAIPage() {
  const { setLeftPanel, setRightSidebar } = useLayout()
  const { conversation, isStreaming, addMessage, updateLastAssistantMessage, setStreaming, reset, loadConversation } = useAIStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmittedRef = useRef(false)
  const [searchParams] = useSearchParams()

  const isEmpty = conversation.messages.length === 0

  const handleSelect = useCallback((q: string) => {
    const preset = PRESET_CONVERSATIONS[q]
    if (preset) {
      loadConversation(preset)
    } else {
      reset()
      setInput(q)
    }
  }, [loadConversation, reset])

  useEffect(() => {
    setLeftPanel(null)
    if (!isEmpty) {
      setRightSidebar(<ChatHistoryPanel onSelect={handleSelect} onNew={reset} />)
    } else {
      setRightSidebar(null)
    }
    return () => { setLeftPanel(null); setRightSidebar(null) }
  }, [isEmpty, handleSelect, reset, setLeftPanel, setRightSidebar])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation.messages, isStreaming])

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current) } }, [])

  useEffect(() => {
    const q = searchParams.get('q')?.trim()
    if (q && isEmpty && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true
      handleSend(q)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCreateDraft() {
    addMessage({
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: "Here's your pre-filled audience draft, inherited from the Urban Tech Professionals benchmark:",
      messageType: 'audience_draft',
      audienceDraft: EV_AUDIENCE_DRAFT,
    })
  }

  function handleSend(override?: string) {
    const text = (override ?? input).trim()
    if (!text || isStreaming) return
    setInput('')

    addMessage({ id: `msg-${Date.now()}`, role: 'user', content: text })

    // ── EV demo path ──────────────────────────────────────────────────────────
    if (isEVTrigger(text)) {
      const initialSteps: ProcessingStep[] = EV_PROCESSING_STEPS.map((s, i) => ({
        ...s,
        status: i === 0 ? 'active' : 'pending',
      }))

      addMessage({
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        isStreaming: true,
        messageType: 'ev_demo',
        processingSteps: initialSteps,
      })
      setStreaming(true)

      // Advance steps sequentially; steps at index 8 ("Identifying") and 10 ("Benchmarking") are slower
      const SLOW = new Set([8, 10])
      let cumulativeDelay = 0

      EV_PROCESSING_STEPS.forEach((_, i) => {
        cumulativeDelay += SLOW.has(i) ? 1200 : 380
        const delay = cumulativeDelay
        setTimeout(() => {
          const updatedSteps: ProcessingStep[] = EV_PROCESSING_STEPS.map((s, j) => ({
            ...s,
            status: j <= i ? 'done' : j === i + 1 ? 'active' : 'pending',
          }))
          updateLastAssistantMessage({ processingSteps: updatedSteps })
        }, delay)
      })

      // After all steps: stream the AI response text
      const textStartDelay = cumulativeDelay + 500
      setTimeout(() => {
        let charIndex = 0
        intervalRef.current = setInterval(() => {
          charIndex++
          updateLastAssistantMessage({ content: EV_AI_TEXT.slice(0, charIndex) })
          if (charIndex >= EV_AI_TEXT.length) {
            clearInterval(intervalRef.current!)
            updateLastAssistantMessage({
              content: EV_AI_TEXT,
              isStreaming: false,
              benchmarkPanel: EV_BENCHMARK_PANEL,
              widgetCluster: EV_WIDGET_CLUSTER,
              suggestedFollowUps: EV_FOLLOW_UPS,
            })
            setStreaming(false)
          }
        }, 18)
      }, textStartDelay)

      return
    }

    // ── Generic path ──────────────────────────────────────────────────────────
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

  return (
    <div className="flex h-full overflow-hidden">

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        {/* Grid background — scoped to content area only */}
        <div style={gridBgStyle} aria-hidden />
        {isEmpty ? (
          /* ── Empty / home state ── */
          <div className="relative flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-12 px-8">
              <div className="w-full max-w-[640px]">

                {/* Heading */}
                <h2 className="text-[24px] leading-[36px] font-semibold text-foreground mb-8">
                  What are you researching today?<br />
                  Good to see you, <span style={gradientNameStyle}>Nikos</span>.
                </h2>

                {/* Input */}
                <InputBox
                  input={input} setInput={setInput}
                  isStreaming={isStreaming} onSend={() => handleSend()}
                />

                <p className="text-xs text-muted-foreground mt-2.5 text-center flex items-center justify-center gap-1">
                  <IconAlertTriangleFilled size={11} strokeWidth={2} className="shrink-0 text-muted-foreground/70" />
                  Our AI can make mistakes. Please check important information.
                </p>

                {/* Use-case tiles */}
                <div className="grid grid-cols-3 gap-3 mt-8">
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

                {/* Chat history inline */}
                <InlineHistory onSelect={handleSelect} />

              </div>
            </div>
          </div>
        ) : (
          /* ── Conversation state ── */
          <>
            <div ref={scrollRef} className="relative flex-1 min-h-0 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto">
                {conversation.messages.map(msg => <MessageBubble key={msg.id} msg={msg} onSend={handleSend} onCreateDraft={handleCreateDraft} />)}
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
                <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                  <IconAlertTriangleFilled size={11} strokeWidth={2} className="shrink-0 text-muted-foreground/70" />
                  Our AI can make mistakes. Please check important information.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
