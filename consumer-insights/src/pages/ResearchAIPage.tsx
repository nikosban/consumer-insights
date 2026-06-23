import { memo, useEffect, useRef, useState, useCallback } from 'react'
import { useLayout } from '@/components/layout/LayoutContext'
import { useSearchParams } from 'react-router-dom'
import { useAIStore } from '@/store/aiStore'
import type { ChatHistoryEntry } from '@/store/aiStore'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getFakeAIResponse, isEVTrigger,
  EV_PROCESSING_STEPS, EV_AI_TEXT, EV_BENCHMARK_PANEL,
  EV_WIDGET_CLUSTER, EV_AUDIENCE_DRAFT, EV_FOLLOW_UPS,
} from '@/data/fakeGenerators'
import type { AIMessage, ProcessingStep } from '@/types'
import { IconSend, IconSparkles, IconChevronDown, IconTrendingUp, IconMessage, IconUsers, IconGlobe, IconChartBar, IconTrash, IconAlertTriangleFilled, IconEdit } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
  DataWidgetCard, AudienceCard, AudienceDraftCard, BenchmarkPanel,
  WidgetCluster, ProcessingStepsDisplay, FollowUpChips, MessageActions,
} from '@/components/app/chat'

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


// ─── Use-case tiles ───────────────────────────────────────────────────────────

const USE_CASES = [
  { Icon: IconUsers,       title: 'Audience Profiler',  desc: 'Build and explore precise audience segments',  color: '#F97316' },
  { Icon: IconGlobe,       title: 'Geomarket Brief',    desc: 'Compare consumer behaviour across regions',    color: '#22C55E' },
  { Icon: IconTrendingUp,  title: 'Brand Position',     desc: 'Benchmark awareness and competitive standing', color: '#A855F7' },
]

const UseCaseTile = memo(function UseCaseTile({ Icon, title, desc, color, onClick }: { Icon: React.ElementType; title: string; desc: string; color: string; onClick: () => void }) {
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
})

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

const HistoryRow = memo(function HistoryRow({ entry, onSelect, hideDate, isActive }: { entry: ChatHistoryEntry; onSelect: (q: string) => void; hideDate?: boolean; isActive?: boolean }) {
  const { removeHistory } = useAIStore()
  return (
    <div className={`flex items-center px-1 rounded-md transition-colors group ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}>
      <button
        onClick={() => onSelect(entry.firstMessage)}
        className="flex items-center gap-2 flex-1 min-w-0 text-left py-2 pl-2 pr-1"
      >
        {isActive && <span className="shrink-0 w-1 h-1 rounded-full bg-primary" />}
        <span className={`flex-1 truncate text-xs ${isActive ? 'text-foreground font-medium' : 'text-foreground'}`}>{entry.firstMessage}</span>
        {!hideDate && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums group-hover:hidden">{formatDate(entry.createdAt)}</span>
        )}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); removeHistory(entry.id) }}
        title="Delete"
        className="shrink-0 hidden group-hover:flex w-5 h-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
      >
        <IconTrash size={11} strokeWidth={2} />
      </button>
    </div>
  )
})

function HistoryGroup({ label, entries, onSelect, hideDate, activeId }: { label: string; entries: ChatHistoryEntry[]; onSelect: (q: string) => void; hideDate?: boolean; activeId?: string }) {
  if (entries.length === 0) return null
  return (
    <div className="mb-1">
      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">{label}</p>
      {entries.map(entry => <HistoryRow key={entry.id} entry={entry} onSelect={onSelect} hideDate={hideDate} isActive={entry.id === activeId} />)}
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
function ChatHistoryPanel({ onSelect, onNew, activeId }: { onSelect: (q: string) => void; onNew: () => void; activeId?: string }) {
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
        <HistoryGroup label="Recent" entries={recent} onSelect={onSelect} hideDate activeId={activeId} />
        <HistoryGroup label="Older"  entries={older}  onSelect={onSelect} hideDate activeId={activeId} />
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
          <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MessageActions text={msg.content} />
          </div>
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-4 group">
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
              <div className="max-w-xl flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
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
            <AudienceCard card={msg.audienceCard} />
          </div>
        )}

        {/* Data widget card */}
        {!msg.isStreaming && msg.dataWidget && (
          <div className="mt-2">
            <DataWidgetCard card={msg.dataWidget} />
          </div>
        )}

        {/* Follow-up suggestion chips */}
        {!msg.isStreaming && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
          <div>
            <FollowUpChips suggestions={msg.suggestedFollowUps} onSend={onSend} />
          </div>
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
  const { conversation, isStreaming, addMessage, updateLastAssistantMessage, setStreaming, reset, loadConversation, history } = useAIStore()
  const [input, setInput] = useState('')
  const [activeEntryId, setActiveEntryId] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmittedRef = useRef(false)
  const [searchParams] = useSearchParams()

  const isEmpty = conversation.messages.length === 0

  const handleSelect = useCallback(async (q: string) => {
    const entry = history.find(e => e.firstMessage === q)
    setActiveEntryId(entry?.id)
    const { PRESET_CONVERSATIONS } = await import('@/data/presetConversations')
    const preset = PRESET_CONVERSATIONS[q]
    if (preset) {
      loadConversation(preset)
    } else {
      reset()
      setInput(q)
    }
  }, [loadConversation, reset, history])

  useEffect(() => {
    setLeftPanel(null)
    if (!isEmpty) {
      setRightSidebar(<ChatHistoryPanel onSelect={handleSelect} onNew={reset} activeId={activeEntryId} />)
    } else {
      setRightSidebar(null)
    }
    return () => { setLeftPanel(null); setRightSidebar(null) }
  }, [isEmpty, handleSelect, reset, setLeftPanel, setRightSidebar, activeEntryId])

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
                <div>
                  <InputBox
                    input={input} setInput={setInput}
                    isStreaming={isStreaming} onSend={() => handleSend()}
                  />
                </div>

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
