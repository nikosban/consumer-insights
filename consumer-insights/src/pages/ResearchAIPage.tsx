import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAIStore } from '@/store/aiStore'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { getFakeAIResponse } from '@/data/fakeGenerators'
import {
  ArrowRight, Send, Sparkles, RotateCcw, ChevronDown,
  Users, Globe, TrendingUp, Clock,
} from 'lucide-react'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { cn } from '@/lib/utils'
import type { AIMessage } from '@/types'

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

// ─── History ──────────────────────────────────────────────────────────────────

const HISTORY_ITEMS = [
  'What are the key differences between Millennial and Gen Z shoppers?',
  'Which audience has the highest purchase intent?',
  'How do high-income homeowners compare to average consumers?',
  'What devices do Gen Z users prefer for online shopping?',
  'Brand awareness trends for sustainable products in 2024',
  'How does ad recall differ by gender and age group?',
  'Which regions show the strongest brand affinity?',
]

function HistorySection({ onSelect }: { onSelect: (q: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? HISTORY_ITEMS : HISTORY_ITEMS.slice(0, 5)

  return (
    <div className="w-full mt-16">
      <p className="text-xs font-semibold text-muted-foreground mb-1 px-1">Recent</p>
      <div className="flex flex-col">
        {visible.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item)}
            className="flex items-center gap-2.5 w-full text-left py-2 px-2 text-xs text-gray-600 rounded-lg transition-all hover:bg-white hover:shadow-sm hover:text-gray-900"
          >
            <IconWrapper size="support">
              <Clock size={ICON_SIZES.support} className="text-muted-foreground shrink-0" />
            </IconWrapper>
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>
      {!expanded && HISTORY_ITEMS.length > 5 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-background border border-border rounded-md hover:bg-accent hover:text-gray-900 active:bg-accent/70 transition-colors"
        >
          Show more
        </button>
      )}
    </div>
  )
}

// ─── Chip selects ─────────────────────────────────────────────────────────────

const SURVEY_TYPES    = ['All surveys', 'Global Survey', 'Brand KPIs', 'Pulse', 'Media and Touchpoints', 'Survey Library']
const AUDIENCE_OPTIONS = ['All audiences', 'Millennial Shoppers', 'Gen Z Mobile Users', 'High-Income Homeowners']

function ChipSelect({ options, value, onChange }: {
  label?: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
        className={cn(
          'inline-flex items-center gap-1 text-xs transition-colors py-1',
          value !== options[0]
            ? 'text-white font-medium'
            : 'text-gray-400 hover:text-gray-100'
        )}
      >
        <span>{value}</span>
        <IconWrapper size="support"><ChevronDown size={ICON_SIZES.support} /></IconWrapper>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
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

// ─── Input box (shared) ───────────────────────────────────────────────────────

function InputBox({
  input, setInput, isStreaming, onSend,
  surveyType, setSurveyType, audience, setAudience, audienceOptions,
  rows = 3,
}: {
  input: string; setInput: (v: string) => void; isStreaming: boolean; onSend: () => void
  surveyType: string; setSurveyType: (v: string) => void
  audience: string; setAudience: (v: string) => void; audienceOptions: string[]
  rows?: number
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  return (
    <div className="bg-gray-900 border border-white/20 rounded-2xl">
      {/* Dark input card — 2px inset */}
      <div className="p-[2px]">
        <div className="bg-gray-800 rounded-[14px] border border-white/10">
          <Textarea
            className="resize-none text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 pt-3 pb-1 text-white placeholder:text-gray-400"
            placeholder="Ask about your audience, brand metrics, or consumer behaviour…"
            rows={rows}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <div className="flex justify-end px-3 pb-2.5">
            <Button
              onClick={onSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              variant="default"
              className="h-8 w-8 shrink-0 bg-blue-500 hover:bg-blue-400 text-white disabled:bg-blue-500/40 disabled:opacity-100 disabled:text-white/60"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chip toolbar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <ChipSelect label="Survey"   options={SURVEY_TYPES}    value={surveyType} onChange={setSurveyType} />
        <ChipSelect label="Audience" options={audienceOptions}  value={audience}   onChange={setAudience} />
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

function MessageBubble({ msg }: { msg: AIMessage }) {
  const navigate = useNavigate()
  const isUser = msg.role === 'user'

  function handleHandoff() {
    if (!msg.handoff) return
    if (msg.handoff.type === 'create_audience') navigate('/audiences/new', { state: { prefill: msg.handoff.payload } })
    else if (msg.handoff.type === 'create_widget') navigate('/widgets/new', { state: { prefill: msg.handoff.payload } })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0 mt-1">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      )}
      <div className={`max-w-xl ${isUser ? 'ml-12' : 'mr-8'}`}>
        <div className={cn('rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
        )}>
          {msg.isStreaming ? (
            <span>{renderMarkdown(msg.content)}<span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm" /></span>
          ) : (
            msg.content.split('\n').map((line, i, arr) => (
              <span key={i}>{renderMarkdown(line)}{i < arr.length - 1 && <br />}</span>
            ))
          )}
        </div>
        {!isUser && !msg.isStreaming && msg.handoff && (
          <div className="mt-2 border border-primary/20 bg-primary/5 rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground mb-2">Suggested action</p>
            <Button size="sm" className="gap-1.5" onClick={handleHandoff}>
              <ArrowRight className="h-3.5 w-3.5" />
              {msg.handoff.type === 'create_audience' ? 'Open in Audience Builder' : 'Open in Widget Creator'}
            </Button>
          </div>
        )}
        {!isUser && !msg.isStreaming && msg.attribution && (
          <p className="text-xs text-muted-foreground mt-1.5 px-1">Based on Statista survey data, {msg.attribution}</p>
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
  const { audiences } = useAudienceStore()
  const [input, setInput] = useState('')
  const [surveyType, setSurveyType] = useState(SURVEY_TYPES[0])
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0])
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const audienceOptions = [AUDIENCE_OPTIONS[0], ...audiences.map(a => a.name)]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation.messages, isStreaming])

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current) } }, [])

  function handleSend(override?: string) {
    const text = (override ?? input).trim()
    if (!text || isStreaming) return
    setInput('')
    addMessage({ id: `msg-${Date.now()}`, role: 'user', content: text })
    const assistantMsg: AIMessage = { id: `msg-${Date.now() + 1}`, role: 'assistant', content: '', isStreaming: true }
    addMessage(assistantMsg)
    setStreaming(true)
    const scenario = getFakeAIResponse(text)
    let charIndex = 0
    intervalRef.current = setInterval(() => {
      charIndex++
      updateLastAssistantMessage({ content: scenario.insight.slice(0, charIndex) })
      if (charIndex >= scenario.insight.length) {
        clearInterval(intervalRef.current!)
        updateLastAssistantMessage({ content: scenario.insight, isStreaming: false, handoff: scenario.handoff, attribution: scenario.dataset })
        setStreaming(false)
      }
    }, 18)
  }

  const isEmpty = conversation.messages.length === 0

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Grid background */}
      <div style={gridBgStyle} aria-hidden />

      {isEmpty ? (
        /* ── Empty / home state ── */
        <div className="relative flex-1 overflow-y-auto">
          <div className="flex flex-col items-center justify-center min-h-full py-12 px-4">
            <div className="w-full max-w-[720px]">

              {/* Heading */}
              <h2 className="text-[24px] leading-[36px] font-bold text-gray-900 mb-8">
                What are you researching today?<br />
                Good to see you, <span style={gradientNameStyle}>Nikos</span>.
              </h2>

              {/* Input */}
              <InputBox
                input={input} setInput={setInput}
                isStreaming={isStreaming} onSend={() => handleSend()}
                surveyType={surveyType} setSurveyType={setSurveyType}
                audience={audience} setAudience={setAudience}
                audienceOptions={audienceOptions}
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

              {/* History */}
              <HistorySection onSelect={q => { setInput(q) }} />

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
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={reset}>
              <RotateCcw className="h-3 w-3" />
              New conversation
            </Button>
          </div>

          <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {conversation.messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {isStreaming && conversation.messages.at(-1)?.role !== 'assistant' && <StreamingSkeleton />}
            </div>
          </div>

          <div className="relative px-6 py-4 shrink-0">
            <div className="max-w-3xl mx-auto">
              <InputBox
                input={input} setInput={setInput}
                isStreaming={isStreaming} onSend={() => handleSend()}
                surveyType={surveyType} setSurveyType={setSurveyType}
                audience={audience} setAudience={setAudience}
                audienceOptions={audienceOptions}
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
  )
}
