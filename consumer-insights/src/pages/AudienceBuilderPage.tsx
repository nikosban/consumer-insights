import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { RegionPicker } from '@/components/RegionPicker'
import { fakeAudienceSize, formatAudienceSize } from '@/data/fakeGenerators'
import type { FilterGroup, FilterCondition, Audience } from '@/types'
import { ATTRIBUTE_OPTIONS } from '@/types'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { cn } from '@/lib/utils'
import { AttributePicker } from '@/components/AttributePicker'
import { ValuePicker } from '@/components/ValuePicker'

type LocationState = { prefill?: Partial<Audience> }

const OPERATORS_NUMERIC = ['gte', 'lte', 'eq'] as const
const OPERATORS_STRING = ['eq', 'neq', 'in'] as const
const NUMERIC_KEYWORDS = ['age', 'spend', 'trips', 'frequency', 'time'] as const

const OPERATOR_LABELS: Record<string, string> = {
  gte: 'is at least',
  lte: 'is at most',
  eq:  'is',
  neq: 'is not',
  in:  'is one of',
}

function isFilterGroup(item: FilterCondition | FilterGroup): item is FilterGroup {
  return 'conditions' in item
}

function newCondition(): FilterCondition {
  return { id: `c-${Date.now()}-${Math.random()}`, attribute: 'Gender', operator: 'eq', value: '' }
}

function newGroup(): FilterGroup {
  return { id: `fg-${Date.now()}-${Math.random()}`, operator: 'AND', conditions: [newCondition()] }
}

// ─── Halftone illustration ────────────────────────────────────────────────────

function HalftoneIllustration() {
  const cols = 20
  const rows = 12
  const W = 220
  const H = 132
  const cw = W / cols
  const ch = H / rows
  const maxR = cw * 0.46

  type Dot = { x: number; y: number; size: number; delay: number }
  const dots: Dot[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = c / (cols - 1)
      const ny = r / (rows - 1)

      // Two overlapping flowing bands
      const band1 = 0.38 + Math.sin(nx * Math.PI * 1.4 + 0.4) * 0.30
      const band2 = 0.62 + Math.cos(nx * Math.PI * 1.0 - 0.6) * 0.22
      const d1 = Math.max(0, 1 - Math.abs(ny - band1) / 0.26)
      const d2 = Math.max(0, 1 - Math.abs(ny - band2) / 0.20)
      const density = Math.max(d1, d2)

      if (density < 0.09) continue

      const x = (c + 0.5) * cw
      const y = (r + 0.5) * ch
      const size = maxR * 2 * density
      // Wave delay: diagonal ripple
      const delay = ((c * 110 + r * 80) % 2200)
      dots.push({ x, y, size, delay })
    }
  }

  return (
    <div className="w-full h-full bg-[#0452C8]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {dots.map((d, i) => (
          <rect
            key={i}
            x={d.x - d.size / 2}
            y={d.y - d.size / 2}
            width={d.size}
            height={d.size}
            rx="1.5"
            fill="white"
            style={{
              transformOrigin: `${d.x}px ${d.y}px`,
              animation: `dotPulse 5s ease-in-out infinite`,
              animationDelay: `${d.delay}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// ─── Preview card ─────────────────────────────────────────────────────────────

function PreviewCard({ size }: { size: number }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0452C8] sticky top-6">
      <div className="h-44 overflow-hidden">
        <HalftoneIllustration />
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-200">Estimated respondents</p>
        <p className="text-[28px] leading-[36px] font-bold text-white mt-1 tabular-nums">
          {formatAudienceSize(size)}
        </p>
        <p className="text-xs text-blue-300 mt-2">Updates as you adjust filters</p>
      </div>
    </div>
  )
}

// ─── Group editor ─────────────────────────────────────────────────────────────

type GroupEditorProps = { group: FilterGroup; onChange: (g: FilterGroup) => void; depth?: number }

function GroupEditor({ group, onChange, depth = 0 }: GroupEditorProps) {

  function updateCondition(index: number, patch: Partial<FilterCondition>) {
    const updated = group.conditions.map((c, i) =>
      i === index && !isFilterGroup(c) ? { ...c, ...patch } : c
    )
    onChange({ ...group, conditions: updated })
  }
  function updateSubGroup(index: number, updated: FilterGroup) {
    onChange({ ...group, conditions: group.conditions.map((c, i) => i === index ? updated : c) })
  }
  function removeItem(index: number) {
    onChange({ ...group, conditions: group.conditions.filter((_, i) => i !== index) })
  }

  return (
    <div className={cn('space-y-3', depth > 0 ? 'ml-4 pl-4 border-l-2 border-gray-100' : '')}>
      {/* AND / OR segmented toggle */}
      <div className="flex items-center gap-2.5">
        <div className="inline-flex rounded-md border border-border overflow-hidden text-xs font-semibold shrink-0">
          {(['AND', 'OR'] as const).map((op, i) => (
            <button
              key={op}
              type="button"
              onClick={() => onChange({ ...group, operator: op })}
              className={cn(
                'px-2.5 py-1 transition-colors',
                i > 0 && 'border-l border-border',
                group.operator === op
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-gray-900'
              )}
            >
              {op}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          match {group.operator === 'AND' ? 'all' : 'any'} of the following
        </span>
      </div>

      {/* Conditions */}
      {group.conditions.map((item, index) => {
        if (isFilterGroup(item)) {
          return (
            <div key={item.id} className="relative">
              <GroupEditor group={item} onChange={(g) => updateSubGroup(index, g)} depth={depth + 1} />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-0 right-0 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        }

        const attrOptions = ATTRIBUTE_OPTIONS[item.attribute]
        const hasOptions = attrOptions !== undefined
        const isNumeric = !hasOptions && NUMERIC_KEYWORDS.some(k => item.attribute.toLowerCase().includes(k))
        const operators = isNumeric ? OPERATORS_NUMERIC : OPERATORS_STRING

        return (
          <div key={item.id} className="flex items-center gap-2 flex-wrap">
            <AttributePicker
              value={item.attribute}
              onSelect={(attr) => {
                const opts = ATTRIBUTE_OPTIONS[attr]
                updateCondition(index, { attribute: attr, operator: opts ? 'in' : 'eq', value: opts ? [] : '' })
              }}
            />

            {hasOptions ? (
              <span className="text-xs text-muted-foreground px-0.5">is one of</span>
            ) : (
              <Select
                value={item.operator}
                onValueChange={(val) => { if (val !== null) updateCondition(index, { operator: val as FilterCondition['operator'] }) }}
              >
                <SelectTrigger className="w-36 h-8 text-xs">
                  <span>{OPERATOR_LABELS[item.operator] ?? item.operator}</span>
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op} value={op} className="text-xs">
                      {OPERATOR_LABELS[op] ?? op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hasOptions ? (
              <ValuePicker
                options={attrOptions}
                value={Array.isArray(item.value) ? item.value as string[] : []}
                onChange={(vals) => updateCondition(index, { value: vals })}
              />
            ) : (
              <Input
                className="h-8 text-xs w-40"
                placeholder={item.operator === 'in' ? 'val1, val2' : 'value'}
                value={Array.isArray(item.value) ? item.value.join(', ') : String(item.value)}
                onChange={(e) => {
                  const raw = e.target.value
                  updateCondition(index, { value: item.operator === 'in' ? raw.split(',').map(s => s.trim()) : raw })
                }}
              />
            )}

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="ghost" size="sm" className="text-xs h-7"
          onClick={() => onChange({ ...group, conditions: [...group.conditions, newCondition()] })}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add condition
        </Button>
        <Button type="button" variant="ghost" size="sm" className="text-xs h-7"
          onClick={() => onChange({ ...group, conditions: [...group.conditions, newGroup()] })}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add group
        </Button>
      </div>
    </div>
  )
}

// ─── AI query parser ─────────────────────────────────────────────────────────

function parseQuery(query: string): FilterGroup {
  const q = query.toLowerCase()
  const items: Array<FilterCondition | FilterGroup> = []
  let n = 0
  const cid = () => `ai-c-${Date.now()}-${n++}`
  const gid = () => `ai-g-${Date.now()}-${n++}`

  // Gender
  if (/\b(women|female)\b/.test(q))
    items.push({ id: cid(), attribute: 'Gender', operator: 'in', value: ['Female'] })
  else if (/\b(men|male)\b/.test(q))
    items.push({ id: cid(), attribute: 'Gender', operator: 'in', value: ['Male'] })

  // Age — broad 30-49 range first, then specific brackets
  if (/30.{0,4}49/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['30 - 39 years', '40 - 49 years'] })
  else if (/18.{0,4}29|gen.?z/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['18 - 29 years'] })
  else if (/30.{0,4}39|thirties/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['30 - 39 years'] })
  else if (/40.{0,4}49|forties/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['40 - 49 years'] })
  else if (/50.{0,4}64|fifties|boomers?/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['50 - 64 years'] })
  else if (/millennial/.test(q))
    items.push({ id: cid(), attribute: 'Age (basic)', operator: 'in', value: ['30 - 39 years', '40 - 49 years'] })

  // Income
  if (/\b(high.?income|wealthy|affluent|100k|150k)\b/.test(q))
    items.push({ id: cid(), attribute: 'Income bracket', operator: 'in', value: ['$100k–$150k', '$150k+'] })
  else if (/\bmiddle.?(income|class)\b/.test(q))
    items.push({ id: cid(), attribute: 'Income bracket', operator: 'in', value: ['$50k–$75k', '$75k–$100k'] })

  // Shopping frequency + device: if "or" appears between them, nest as OR group
  const hasOr = /\bor\b/.test(q)
  const hasFreq = /\b(daily|weekly|frequent|often|regular)\b/.test(q)
  const hasDevice = /\b(mobile|smartphone|desktop|tablet)\b/.test(q)

  if (hasOr && hasFreq && hasDevice) {
    const orItems: FilterCondition[] = []

    if (/\b(daily|every day)\b/.test(q))
      orItems.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily'] })
    else if (/\bweekly\b/.test(q))
      orItems.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily', 'Weekly'] })
    else if (/\b(frequent|often|regular)\b/.test(q))
      orItems.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily', 'Weekly', 'Bi-weekly'] })

    if (/\b(mobile|smartphone)\b/.test(q))
      orItems.push({ id: cid(), attribute: 'Device type', operator: 'in', value: ['Mobile'] })
    else if (/\bdesktop\b/.test(q))
      orItems.push({ id: cid(), attribute: 'Device type', operator: 'in', value: ['Desktop'] })

    if (orItems.length > 1)
      items.push({ id: gid(), operator: 'OR', conditions: orItems })
    else
      items.push(...orItems)
  } else {
    if (/\b(daily|every day)\b/.test(q))
      items.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily'] })
    else if (/\bweekly\b/.test(q))
      items.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily', 'Weekly'] })
    else if (/\b(frequent|often|regular)\b/.test(q))
      items.push({ id: cid(), attribute: 'Purchase frequency', operator: 'in', value: ['Daily', 'Weekly', 'Bi-weekly'] })

    if (/\b(mobile|smartphone)\b/.test(q))
      items.push({ id: cid(), attribute: 'Device type', operator: 'in', value: ['Mobile'] })
    else if (/\bdesktop\b/.test(q))
      items.push({ id: cid(), attribute: 'Device type', operator: 'in', value: ['Desktop'] })
  }

  if (items.length === 0) return newGroup()
  return { id: gid(), operator: 'AND', conditions: items }
}

// ─── Keyword highlight patterns ───────────────────────────────────────────────

type HighlightToken = { text: string; cls?: string }

const KEYWORD_PATTERNS: Array<{ re: RegExp; cls: string }> = [
  { re: /\b(women|female|men|male|gender)\b/gi,                                     cls: 'bg-violet-100 text-violet-700' },
  { re: /\b(\d{2}[-–]\d{2}|\d{2}\s*[-–]\s*\d{2}|gen\s*z|millennial|boomer)\b/gi,  cls: 'bg-blue-100 text-blue-700' },
  { re: /\b(daily|weekly|bi-weekly|frequent|often|regular)\b/gi,                    cls: 'bg-green-100 text-green-700' },
  { re: /\b(high[\s-]income|wealthy|affluent|\$?\d+k|middle[\s-]income)\b/gi,       cls: 'bg-amber-100 text-amber-700' },
  { re: /\b(mobile|smartphone|desktop|tablet)\b/gi,                                 cls: 'bg-rose-100 text-rose-700' },
]

function tokenise(text: string): HighlightToken[] {
  type Span = { start: number; end: number; cls: string }
  const spans: Span[] = []

  for (const { re, cls } of KEYWORD_PATTERNS) {
    const r = new RegExp(re.source, re.flags)
    let m: RegExpExecArray | null
    while ((m = r.exec(text)) !== null)
      spans.push({ start: m.index, end: m.index + m[0].length, cls })
  }

  spans.sort((a, b) => a.start - b.start)

  const tokens: HighlightToken[] = []
  let cursor = 0
  for (const { start, end, cls } of spans) {
    if (start < cursor) continue
    if (start > cursor) tokens.push({ text: text.slice(cursor, start) })
    tokens.push({ text: text.slice(start, end), cls })
    cursor = end
  }
  if (cursor < text.length) tokens.push({ text: text.slice(cursor) })
  return tokens
}

// ─── Highlighted input ────────────────────────────────────────────────────────

function HighlightedInput({
  value, onChange, onKeyDown, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const tokens = tokenise(value)

  return (
    <div className={cn(
      'relative flex-1 h-8 rounded-md border bg-background transition-shadow',
      focused ? 'border-ring ring-2 ring-ring/30' : 'border-input',
    )}>
      {/* Highlight overlay */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center px-3 text-xs pointer-events-none overflow-hidden whitespace-pre select-none"
      >
        {value
          ? tokens.map((t, i) =>
              t.cls
                ? <mark key={i} className={cn('rounded px-0.5 bg-opacity-80', t.cls)} style={{ background: 'inherit' }}>{t.text}</mark>
                : <span key={i}>{t.text}</span>
            )
          : <span className="text-muted-foreground">{placeholder}</span>
        }
      </div>
      {/* Actual input — transparent text, visible caret */}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute inset-0 w-full h-full px-3 text-xs bg-transparent text-transparent caret-gray-900 rounded-md focus:outline-none"
        style={{ caretColor: 'var(--color-foreground)' }}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}

// ─── AI query input ───────────────────────────────────────────────────────────

const AI_EXAMPLES = [
  'Women aged 30–39 who shop online weekly',
  'High-income homeowners aged 40–49',
  'Affluent women aged 30–49, daily shoppers or mobile users',
]

function AIQueryInput({ onApply }: { onApply: (f: FilterGroup) => void }) {
  const [query, setQuery] = useState('')

  function apply(q: string) {
    if (!q.trim()) return
    onApply(parseQuery(q))
  }

  return (
    <div className="rounded-xl border border-border bg-gray-50 p-4 space-y-3">
      <span className="text-xs font-semibold text-gray-700">Describe your audience</span>
      <div className="flex gap-2">
        <HighlightedInput
          value={query}
          onChange={setQuery}
          onKeyDown={e => { if (e.key === 'Enter') apply(query) }}
          placeholder={AI_EXAMPLES[0]}
        />
        <Button
          type="button"
          size="sm"
          className="h-8 text-xs px-3 shrink-0"
          disabled={!query.trim()}
          onClick={() => apply(query)}
        >
          Generate rules
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {AI_EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => { setQuery(ex); apply(ex) }}
            className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AudienceBuilderPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { audiences, add, update } = useAudienceStore()

  const isEditing = Boolean(id)
  const existing = id ? audiences.find((a) => a.id === id) : null
  const prefill = (location.state as LocationState | null)?.prefill

  const [name, setName]             = useState(existing?.name ?? prefill?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? prefill?.description ?? '')
  const [region, setRegion]         = useState<string>(existing?.region ?? prefill?.region ?? 'us')
  const [filters, setFilters]       = useState<FilterGroup>(
    existing?.filters ?? (prefill?.filters as FilterGroup | undefined) ?? newGroup()
  )
  const [audienceSize, setAudienceSize] = useState(() => fakeAudienceSize())
  const refreshSize = useCallback(() => setAudienceSize(fakeAudienceSize()), [])
  useEffect(() => { refreshSize() }, [filters, refreshSize])

  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  function handleSave() {
    const now = new Date().toISOString()
    if (isEditing && id) {
      update(id, { name, description, region, filters, updatedAt: now })
    } else {
      add({ id: `aud-${Date.now()}`, name, description, region, filters, isShared: false, createdAt: now, updatedAt: now })
    }
    navigate('/audiences')
  }

  return (
    <div className="px-6 py-10 max-w-[960px] mx-auto pb-10">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/audiences')}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-border bg-background text-gray-600 hover:bg-accent hover:text-gray-900 transition-colors shrink-0"
          >
            <IconWrapper><ArrowLeft size={ICON_SIZES.body} /></IconWrapper>
          </button>

          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false) }}
              placeholder="Audience name…"
              className="text-[24px] leading-[36px] font-bold text-gray-900 bg-transparent border-b-2 border-primary outline-none min-w-0 w-full placeholder:text-gray-300"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
              className="text-[24px] leading-[36px] font-bold text-gray-900 cursor-text hover:opacity-70 transition-opacity truncate select-none"
            >
              {name.trim() || (isEditing ? 'Untitled' : 'New Audience')}
            </h1>
          )}
        </div>
        <Button onClick={handleSave} disabled={!name.trim()} className="shrink-0">
          {isEditing ? 'Save Changes' : 'Save Audience'}
        </Button>
      </div>

      {/* Top fields */}
      <div className="max-w-[560px] space-y-5 mb-8">
        <div className="space-y-1.5">
          <Label>Region</Label>
          <RegionPicker value={region} onChange={setRegion} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="aud-desc">Description</Label>
          <Textarea
            id="aud-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe this audience segment…"
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      <div className="h-px bg-border mb-8" />

      {/* AI input + Rules + Preview side by side */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 space-y-5">
          <AIQueryInput onApply={setFilters} />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground shrink-0">or build manually</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <GroupEditor group={filters} onChange={setFilters} />
        </div>
        <div className="w-72 shrink-0">
          <PreviewCard size={audienceSize} />
        </div>
      </div>

    </div>
  )
}
