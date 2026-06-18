import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Chip, FieldGroup, Toolbar, ToolbarActions, Breadcrumb, BreadcrumbItem } from '@/components/app'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  IconPlus, IconTrash,
  IconAlertTriangle, IconChartBar, IconLayoutDashboard, IconMessage,
} from '@tabler/icons-react'
import { RegionPicker } from '@/components/RegionPicker'
import { fakeAudienceSize, formatAudienceSize } from '@/data/chartGenerators'
import type { FilterGroup, FilterCondition, Audience } from '@/types'
import { ATTRIBUTE_OPTIONS } from '@/types'
import { cn } from '@/lib/utils'
import { AttributePicker } from '@/components/AttributePicker'
import { ValuePicker } from '@/components/ValuePicker'
import { toast } from '@/components/ui/Toaster'

type LocationState = { prefill?: Partial<Audience> }

const WAVES = [
  { value: 'w1-2023-q3', label: 'Wave 1 · Q3 2023' },
  { value: 'w2-2024-q1', label: 'Wave 2 · Q1 2024' },
  { value: 'w3-2024-q2', label: 'Wave 3 · Q2 2024' },
  { value: 'w4-2024-q4', label: 'Wave 4 · Q4 2024' },
  { value: 'w5-2025-q1', label: 'Wave 5 · Q1 2025' },
]

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

// ─── Bayer dither canvas ──────────────────────────────────────────────────────

function DitherCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const bayer = [
      [ 0/16,  8/16,  2/16, 10/16],
      [12/16,  4/16, 14/16,  6/16],
      [ 3/16, 11/16,  1/16,  9/16],
      [15/16,  7/16, 13/16,  5/16],
    ]
    const BLOCK = 4
    let frame = 0
    let rafId: number
    function render() {
      const W = canvas!.width, H = canvas!.height
      const cols = Math.ceil(W / BLOCK), rows = Math.ceil(H / BLOCK)
      ctx.clearRect(0, 0, W, H)
      const t = frame * 0.012
      const pulse = 0.45 + 0.2 * Math.sin(t * 0.7)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols, ny = r / rows
          const gradient = pulse * Math.pow(1 - ny, 0.7)
          const v = gradient + 0.08 * Math.sin(nx * 6 + t) * Math.cos(ny * 2 - t * 0.5)
          if (v > bayer[r % 4][c % 4]) {
            ctx.fillStyle = 'rgba(255,255,255,0.18)'
            ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK)
          }
        }
      }
      frame++
      rafId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(rafId)
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-80"
      width={280}
      height={480}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

// ─── Filter breakdown helpers ─────────────────────────────────────────────────

const REGION_LABELS: Record<string, string> = {
  us: 'United States', de: 'Germany', uk: 'United Kingdom',
  fr: 'France', global: 'Global', Global: 'Global',
}

const REGION_BASE: Record<string, number> = {
  us: 3_600_000, de: 820_000, uk: 680_000,
  fr: 540_000, global: 8_200_000, Global: 8_200_000,
}

const ATTR_REDUCTION: Record<string, number> = {
  'Age (basic)': 0.38, 'Age (detailed)': 0.38,
  'Gender': 0.46,
  'Income bracket': 0.32,
  'Purchase frequency': 0.28,
  'Device type': 0.35,
  'Education level': 0.30,
  'Household size': 0.25,
}

function hasValue(c: FilterCondition): boolean {
  return c.value !== null && c.value !== undefined && c.value !== '' &&
    !(Array.isArray(c.value) && c.value.length === 0)
}

function flattenConditions(group: FilterGroup): FilterCondition[] {
  const out: FilterCondition[] = []
  for (const item of group.conditions) {
    if (isFilterGroup(item)) out.push(...flattenConditions(item))
    else if (hasValue(item)) out.push(item)
  }
  return out
}

function conditionLabel(c: FilterCondition): string {
  const val = Array.isArray(c.value)
    ? c.value.slice(0, 2).join(', ') + (c.value.length > 2 ? '…' : '')
    : String(c.value)
  return `${c.attribute}: ${val}`
}

type BreakdownRow = { label: string; running: number; delta: number | null }

function buildBreakdown(region: string, filters: FilterGroup, total: number): BreakdownRow[] {
  const base = REGION_BASE[region] ?? 8_200_000
  const conditions = flattenConditions(filters)

  // If no active conditions, just return region base → total
  if (conditions.length === 0) {
    return [{ label: REGION_LABELS[region] ?? region, running: base, delta: null }]
  }

  // Distribute reductions so the final step lands close to `total`
  const rows: BreakdownRow[] = [
    { label: REGION_LABELS[region] ?? region, running: base, delta: null },
  ]
  let running = base
  const gap = base - total
  const reductions = conditions.map((c) => ATTR_REDUCTION[c.attribute] ?? 0.33)
  const reductionSum = reductions.reduce((s, r) => s + r, 0)

  for (let i = 0; i < conditions.length; i++) {
    const share = reductionSum > 0 ? reductions[i] / reductionSum : 1 / conditions.length
    const delta = Math.round(gap * share)
    running = Math.max(0, running - delta)
    rows.push({ label: conditionLabel(conditions[i]), running, delta: -delta })
  }

  // Snap last row to exact total
  rows[rows.length - 1].running = total

  return rows
}

// ─── Preview card ─────────────────────────────────────────────────────────────

const LOW_THRESHOLD = 200_000

function PreviewCard({
  size, region, filters, audienceName,
}: {
  size: number; region: string; filters: FilterGroup; audienceName: string
}) {
  const navigate = useNavigate()
  const breakdown = buildBreakdown(region, filters, size)
  const hasFilters = flattenConditions(filters).length > 0
  const isLow = size < LOW_THRESHOLD

  const totalRows = breakdown.length + (hasFilters ? 1 : 0)
  const isLong = totalRows > 10

  return (
    <div className={cn(
      'rounded-xl overflow-hidden bg-blue-950 flex flex-col relative sticky top-6',
      isLong ? 'h-auto' : 'h-[520px]'
    )}>
      {/* Bayer dither */}
      <div className="absolute inset-0 pointer-events-none">
        <DitherCanvas />
      </div>
      {/* Gradient scrim — clears text areas at top and bottom */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-950 via-transparent to-blue-950" />

      <div className="relative z-10 p-5 flex-1 flex flex-col min-h-0">
        {/* Title + description */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-white">Respondent preview</p>
          <p className="text-xs font-medium text-white/75 mt-1 leading-relaxed">
            Estimated reach based on your current region and filters.
          </p>
        </div>

        {/* Spacer pushes count + breakdown to bottom */}
        <div className="flex-1" />

        {/* Breakdown funnel — always shown */}
        <div className="mb-3 space-y-1.5">
          {breakdown.map((row, i) => (
            <div key={i} className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-white/80 truncate min-w-0">{row.label}</span>
              <span className={cn(
                'text-xs tabular-nums shrink-0 font-medium',
                row.delta === null ? 'text-white' :
                row.delta < 0 ? 'text-white/70' : 'text-emerald-400'
              )}>
                {row.delta === null
                  ? formatAudienceSize(row.running)
                  : `${row.delta < 0 ? '−' : '+'}${formatAudienceSize(Math.abs(row.delta))}`
                }
              </span>
            </div>
          ))}
          {hasFilters && (
            <div className="border-t border-white/15 pt-1.5 flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-white">Total</span>
              <span className="text-xs font-semibold text-white tabular-nums">{formatAudienceSize(size)}</span>
            </div>
          )}
        </div>

        {/* Big count */}
        <div className="mb-1" data-demo="builder-universe">
          <p className="text-xs font-medium text-white/75 mb-1">Estimated respondents</p>
          <p className="text-[32px] leading-[40px] font-semibold text-white tabular-nums">
            {formatAudienceSize(size)}
          </p>
        </div>

        {/* Low sample warning */}
        {isLow && (
          <div className="mt-3 rounded-lg bg-amber-500/15 border border-amber-400/25 px-3 py-2.5">
            <div className="flex items-start gap-1.5 mb-1">
              <IconAlertTriangle size={12} strokeWidth={2} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-200">Sample size may be too small</p>
            </div>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              Try broadening the age range, removing a filter, or switching to Global.
            </p>
          </div>
        )}

        {/* Suggested actions */}
        <div className="mt-4 pt-3 border-t border-white/15 space-y-0.5">
          <p className="text-xs font-semibold text-white/60 mb-2">Use this audience</p>
          <Button variant="ghost-inverse" size="sm" className="w-full justify-start"
            onClick={() => navigate('/charts', { state: { benchmarkAudience: { name: audienceName } } })}>
            <IconChartBar strokeWidth={2} />
            Benchmark audience
          </Button>
          <Button variant="ghost-inverse" size="sm" className="w-full justify-start"
            onClick={() => navigate('/dashboards')}>
            <IconLayoutDashboard strokeWidth={2} />
            Apply to a dashboard
          </Button>
          <Button variant="ghost-inverse" size="sm" className="w-full justify-start"
            onClick={() => navigate('/chat', { state: { audienceName } })}>
            <IconMessage strokeWidth={2} />
            Apply to Research AI
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Group editor ─────────────────────────────────────────────────────────────

type GroupEditorProps = {
  group: FilterGroup
  onChange: (g: FilterGroup) => void
  depth?: number
  onRemove?: () => void
}

function GroupEditor({ group, onChange, depth = 0, onRemove }: GroupEditorProps) {

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

  function toggleOperator() {
    onChange({ ...group, operator: group.operator === 'AND' ? 'OR' : 'AND' })
  }

  return (
    <div className={cn(
      depth > 0 ? 'bg-muted/40 border border-border rounded-lg p-3' : ''
    )}>
      {/* Group header — only when nested, shows operator label + remove */}
      {depth > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            Match {group.operator === 'AND' ? 'all' : 'any'} of the following
          </span>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            >
              <IconTrash className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          )}
        </div>
      )}

      {/* Conditions interleaved with between-connectors */}
      <div className="space-y-2">
      {group.conditions.map((item, index) => {
        const connector = index > 0 && (
          <div key={`sep-${index}`} className="flex items-center gap-2 ml-1">
            <button
              type="button"
              data-demo="builder-logic"
              onClick={toggleOperator}
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded border transition-colors select-none',
                group.operator === 'AND'
                  ? 'bg-background border-border text-secondary-foreground hover:border-primary/40 hover:text-primary'
                  : 'bg-primary/8 border-primary/30 text-primary hover:bg-primary/12'
              )}
            >
              {group.operator}
            </button>
          </div>
        )

        if (isFilterGroup(item)) {
          return (
            <div key={item.id}>
              {connector}
              <GroupEditor
                group={item}
                onChange={(g) => updateSubGroup(index, g)}
                depth={depth + 1}
                onRemove={() => removeItem(index)}
              />
            </div>
          )
        }

        const attrOptions = ATTRIBUTE_OPTIONS[item.attribute]
        const hasOptions = attrOptions !== undefined
        const isNumeric = !hasOptions && NUMERIC_KEYWORDS.some(k => item.attribute.toLowerCase().includes(k))
        const operators = isNumeric ? OPERATORS_NUMERIC : OPERATORS_STRING

        return (
          <div key={item.id}>
            {connector}
            <div className="grid grid-cols-[208px_1fr_auto] items-center gap-2">
              <AttributePicker
                value={item.attribute}
                onSelect={(attr) => {
                  const opts = ATTRIBUTE_OPTIONS[attr]
                  updateCondition(index, { attribute: attr, operator: opts ? 'in' : 'eq', value: opts ? [] : '' })
                }}
              />

              <div className="flex items-center gap-2 min-w-0">
                {hasOptions ? (
                  <span className="text-xs text-secondary-foreground shrink-0">is one of</span>
                ) : (
                  <Select
                    value={item.operator}
                    onValueChange={(val) => { if (val !== null) updateCondition(index, { operator: val as FilterCondition['operator'] }) }}
                  >
                    <SelectTrigger className="w-32 shrink-0 h-8 text-xs">
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
                    className="h-8 text-xs min-w-0"
                    placeholder={item.operator === 'in' ? 'val1, val2' : 'value'}
                    value={Array.isArray(item.value) ? item.value.join(', ') : String(item.value)}
                    onChange={(e) => {
                      const raw = e.target.value
                      updateCondition(index, { value: item.operator === 'in' ? raw.split(',').map(s => s.trim()) : raw })
                    }}
                  />
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeItem(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <IconTrash className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        )
      })}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" className="text-xs h-7"
          onClick={() => onChange({ ...group, conditions: [...group.conditions, newCondition()] })}>
          <IconPlus className="h-3.5 w-3.5 mr-1" strokeWidth={2} /> Add condition
        </Button>
        <Button type="button" variant="ghost" size="sm" className="text-xs h-7"
          onClick={() => onChange({ ...group, conditions: [...group.conditions, newGroup()] })}>
          <IconPlus className="h-3.5 w-3.5 mr-1" strokeWidth={2} /> Add group
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

  if (/\b(women|female)\b/.test(q))
    items.push({ id: cid(), attribute: 'Gender', operator: 'in', value: ['Female'] })
  else if (/\b(men|male)\b/.test(q))
    items.push({ id: cid(), attribute: 'Gender', operator: 'in', value: ['Male'] })

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

  if (/\b(high.?income|wealthy|affluent|100k|150k|top.?income|top.?bracket)\b/.test(q))
    items.push({ id: cid(), attribute: 'Income bracket', operator: 'in', value: ['$100k–$150k', '$150k+'] })
  else if (/\bmiddle.?(income|class)\b/.test(q))
    items.push({ id: cid(), attribute: 'Income bracket', operator: 'in', value: ['$50k–$75k', '$75k–$100k'] })

  if (/\b(ev|electric.?vehicle|electric.?car|automotive|ev.?interest)\b/.test(q))
    items.push({ id: cid(), attribute: 'Interest', operator: 'in', value: ['Automotive / Electric Vehicles'] })

  if (/\b(eco.?conscious|sustainability|sustainable|green|eco.?friendly)\b/.test(q))
    items.push({ id: cid(), attribute: 'Interest', operator: 'in', value: ['Sustainability / Environment'] })

  if (/\b(early.?adopt|tech.?savvy|technophile|innovator)\b/.test(q))
    items.push({ id: cid(), attribute: 'Psychographic', operator: 'in', value: ['Early Adopter'] })

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
  const tokens = tokenise(value)
  return (
    <div className="relative flex-1 h-8 rounded-md border border-border bg-background focus-within:border-primary/50 transition-colors">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center px-3 text-xs pointer-events-none overflow-hidden whitespace-pre select-none"
      >
        {value
          ? tokens.map((t, i) =>
              t.cls
                ? <mark key={i} className={cn('rounded px-0.5', t.cls)}>{t.text}</mark>
                : <span key={i} className="text-foreground">{t.text}</span>
            )
          : <span className="text-muted-foreground">{placeholder}</span>
        }
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="absolute inset-0 w-full h-full px-3 text-xs bg-transparent text-transparent caret-foreground rounded-md focus:outline-none"
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}

// ─── AI query input ───────────────────────────────────────────────────────────

const AI_EXAMPLES = [
  'High-income men aged 25–40 with EV interest',
  'Gen Z early adopters with sustainability values',
  'Eco-conscious, top income bracket, aged 18–30',
]

function AIQueryInput({ onApply }: { onApply: (f: FilterGroup) => void }) {
  const [query, setQuery] = useState('')

  function apply(q: string) {
    if (!q.trim()) return
    onApply(parseQuery(q))
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">Generate from description</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Describe your audience in plain language — we'll generate the filter rules automatically.
        </p>
      </div>

      <div className="relative">
        <HighlightedInput
          value={query}
          onChange={setQuery}
          onKeyDown={e => { if (e.key === 'Enter') apply(query) }}
          placeholder={AI_EXAMPLES[0]}
        />
        {!query.trim() && (
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 h-5 px-1.5 rounded border border-border bg-background text-muted-foreground text-[10px] leading-none shadow-[var(--btn-raised-light-rest)] pointer-events-none select-none font-mono">
            ↵ Enter
          </kbd>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Examples</p>
        <div className="flex flex-wrap gap-1.5">
          {AI_EXAMPLES.map(ex => (
            <Chip
              key={ex}
              label={ex}
              variant="suggestion"
              onClick={() => { setQuery(ex); apply(ex) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AudienceBuilderPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { audiences, add, update, remove } = useAudienceStore()

  const isEditing = Boolean(id)
  const existing = id ? audiences.find((a) => a.id === id) : null
  const prefill = (location.state as LocationState | null)?.prefill

  const [name, setName]               = useState(existing?.name ?? prefill?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? prefill?.description ?? '')
  const [region, setRegion]           = useState<string>(existing?.region ?? prefill?.region ?? 'us')
  const [wave, setWave]               = useState<string>(existing?.wave ?? prefill?.wave ?? WAVES[WAVES.length - 1].value)
  const [filters, setFilters]         = useState<FilterGroup>(
    existing?.filters ?? (prefill?.filters as FilterGroup | undefined) ?? newGroup()
  )
  const [audienceSize, setAudienceSize] = useState(() => fakeAudienceSize())
  const refreshSize = useCallback(() => setAudienceSize(fakeAudienceSize()), [])
  useEffect(() => { refreshSize() }, [filters, region, refreshSize])

  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Dirty tracking
  const savedRef = useRef({
    name: existing?.name ?? prefill?.name ?? '',
    description: existing?.description ?? prefill?.description ?? '',
    region: existing?.region ?? prefill?.region ?? 'us',
    wave: existing?.wave ?? prefill?.wave ?? WAVES[WAVES.length - 1].value,
    filters: JSON.stringify(existing?.filters ?? prefill?.filters ?? newGroup()),
  })
  const isDirty = !isEditing || (
    name !== savedRef.current.name ||
    description !== savedRef.current.description ||
    region !== savedRef.current.region ||
    wave !== savedRef.current.wave ||
    JSON.stringify(filters) !== savedRef.current.filters
  )

  function hasValidFilter(group: FilterGroup): boolean {
    return group.conditions.some(c =>
      isFilterGroup(c) ? hasValidFilter(c) : (c.value !== null && c.value !== undefined && c.value !== '' && !(Array.isArray(c.value) && c.value.length === 0))
    )
  }

  const canSave = name.trim().length > 0 && hasValidFilter(filters)

  function handleSave() {
    if (!canSave) return
    const now = new Date().toISOString()
    if (isEditing && id) {
      update(id, { name, description, region, wave, filters, updatedAt: now })
      savedRef.current = { name, description, region, wave, filters: JSON.stringify(filters) }
      toast.success('Audience updated')
    } else {
      add({ id: `aud-${Date.now()}`, name, description, region, wave, filters, isShared: false, createdAt: now, updatedAt: now })
      toast.success('Audience created')
      navigate('/audiences')
    }
  }

  function handleDelete() {
    if (!isEditing || !id) return
    remove(id)
    toast.success('Audience deleted')
    navigate('/audiences')
  }

  return (
    <>
    <Toolbar>
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/audiences')}>Audiences</BreadcrumbItem>
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false) }}
            placeholder="Audience name…"
            className="text-sm font-medium text-foreground bg-transparent border-b border-primary outline-none min-w-0 max-w-48 placeholder:text-muted-foreground"
            autoFocus
          />
        ) : (
          <BreadcrumbItem current onClick={() => setEditingTitle(true)} className="cursor-text hover:opacity-70 transition-opacity">
            {name.trim() || (isEditing ? 'Untitled' : 'New Audience')}
          </BreadcrumbItem>
        )}
      </Breadcrumb>
      <ToolbarActions>
        {isEditing && (
          <Button variant="secondary" size="toolbar" onClick={handleDelete}>
            <IconTrash className="h-3.5 w-3.5" strokeWidth={2} />
            Delete audience
          </Button>
        )}
        {isDirty && (
          <Button data-demo="builder-save" variant="secondary" size="toolbar" onClick={handleSave} disabled={!canSave}>
            {isEditing ? 'Save changes' : 'Save audience'}
          </Button>
        )}
      </ToolbarActions>
    </Toolbar>

    <div className="flex-1 overflow-y-auto">
    <div className="px-6 py-10 max-w-[960px] mx-auto pb-10">

      {/* 2-column grid */}
      <div className="grid grid-cols-[1fr_280px] gap-8 items-start">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          <div className="space-y-5">
            <div data-demo="builder-region">
            <FieldGroup label="Region">
              <RegionPicker value={region} onChange={setRegion} />
            </FieldGroup>
            </div>
            <FieldGroup label="Wave">
              <Select value={wave} onValueChange={(val) => val !== null && setWave(val)}>
                <SelectTrigger className="h-8 text-xs">
                  <span>{WAVES.find(w => w.value === wave)?.label ?? wave}</span>
                </SelectTrigger>
                <SelectContent>
                  {WAVES.map(w => (
                    <SelectItem key={w.value} value={w.value} className="text-xs">{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label="Description">
              <Textarea
                id="aud-desc"
                data-demo="builder-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe this audience segment…"
                rows={2}
                className="resize-none"
              />
            </FieldGroup>
          </div>

          <div className="h-px bg-border" />

          <AIQueryInput onApply={(generated) => {
            setFilters(prev => {
              const existingAttrs = new Set(
                prev.conditions.flatMap(c =>
                  'attribute' in c ? [c.attribute] : (c as { conditions: { attribute: string }[] }).conditions.map(x => x.attribute)
                )
              )
              const fresh = generated.conditions.filter(c =>
                'attribute' in c ? !existingAttrs.has((c as { attribute: string }).attribute) : true
              )
              return { ...prev, conditions: [...prev.conditions, ...fresh] }
            })
          }} />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground shrink-0">or build manually</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <GroupEditor group={filters} onChange={setFilters} />
        </div>

        {/* Right column — preview card fills full height */}
        <PreviewCard
          size={audienceSize}
          region={region}
          filters={filters}
          audienceName={name.trim() || 'New Audience'}
        />
      </div>

    </div>
    </div>
    </>
  )
}
