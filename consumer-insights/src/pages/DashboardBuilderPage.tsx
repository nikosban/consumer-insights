import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GridLayout from 'react-grid-layout'
import type { LayoutItem, Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDashboardStore } from '@/store/dashboardStore'
import { useProjectStore } from '@/store/projectStore'
import { useWidgetStore } from '@/store/widgetStore'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ExportModal from '@/components/ExportModal'
import ChartRenderer from '@/components/charts/ChartRenderer'
import EmptyState from '@/components/EmptyState'
import { generateChartData, DIMENSION_VALUES } from '@/data/fakeGenerators'
import { SURVEY_CATALOG, SURVEY_TYPES, SURVEY_COUNTRIES } from '@/data/surveyData'
import type { SurveyQuestion } from '@/data/surveyData'
import type { DashboardWidget, Widget, WidgetType, ChartData } from '@/types'
import {
  Share2, RefreshCw, X, GripVertical,
  Search, ChevronRight, Plus,
  Table2, BarChart2, TrendingUp, PieChart, Hash,
  Sparkles, Send,
} from 'lucide-react'
import type { Audience } from '@/types'
import type { LucideIcon } from 'lucide-react'

const ROW_HEIGHT = 60

type PlacedWidget = DashboardWidget & { chartKey: number }

function toLayoutItem(pw: PlacedWidget): LayoutItem {
  return {
    i: pw.widgetId,
    x: pw.position.x,
    y: pw.position.y,
    w: pw.position.w,
    h: pw.position.h,
    minW: 3,
    minH: 3,
  }
}

// ─── Chart type switcher ──────────────────────────────────────────────────────

const CHART_TYPES: { type: WidgetType; label: string; Icon: LucideIcon }[] = [
  { type: 'table',     label: 'Table',    Icon: Table2 },
  { type: 'bar',       label: 'Bar',      Icon: BarChart2 },
  { type: 'line',      label: 'Line',     Icon: TrendingUp },
  { type: 'pie',       label: 'Pie',      Icon: PieChart },
  { type: 'scorecard', label: 'Scorecard', Icon: Hash },
]

function ChartTypeSwitcher({
  currentType,
  onChange,
}: {
  currentType: WidgetType
  onChange: (t: WidgetType) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = CHART_TYPES.find((t) => t.type === currentType)
  const CurrentIcon = current?.Icon ?? Table2

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        title={current?.label}
        className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <CurrentIcon className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
          {CHART_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={(e) => { e.stopPropagation(); onChange(type); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors hover:bg-accent ${
                type === currentType ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Widget properties panel ──────────────────────────────────────────────────

const YEARS = ['All years', '2022', '2023', '2024', '2025']


const MIN_PANEL_WIDTH = 220
const MAX_PANEL_WIDTH = 480
const DEFAULT_PANEL_WIDTH = 288

function WidgetPropertiesPanel({
  widget,
  audiences,
  onClose,
  onUpdate,
}: {
  widget: Widget
  audiences: Audience[]
  onClose: () => void
  onUpdate: (patch: Partial<Widget>) => void
}) {
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH)
  const isResizing = useRef(false)

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startWidth = panelWidth

    function onMouseMove(ev: MouseEvent) {
      if (!isResizing.current) return
      setPanelWidth(Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, startWidth - (ev.clientX - startX))))
    }
    function onMouseUp() {
      isResizing.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [panelWidth])

  return (
    <aside
      className="relative shrink-0 border-l border-border flex flex-col bg-sidebar overflow-hidden h-full"
      style={{ width: panelWidth }}
    >
      {/* Resize handle on left edge */}
      <div
        onMouseDown={startResize}
        className="group absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize z-10 flex items-center justify-center"
      >
        <div className="h-full w-px bg-sidebar-border transition-colors group-hover:bg-primary/40 group-active:bg-primary/60" />
      </div>

      <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Properties</p>
        <button
          onClick={onClose}
          className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Rows / Columns / Filters ── */}
        <div className="p-4 space-y-4 border-b border-border">

          {/* Rows */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Rows</p>
            {widget.title ? (
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted rounded-md text-xs text-foreground max-w-full">
                  <span className="truncate">{widget.title}</span>
                  <button
                    onClick={() => onUpdate({ title: '' })}
                    className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic py-0.5">No row selected</p>
            )}
          </div>

          {/* Columns */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Columns</p>
            {widget.crossDimensionLabel ? (
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/8 border border-primary/20 rounded-md text-xs text-primary max-w-full">
                  <span className="truncate">{widget.crossDimensionLabel}</span>
                  <button
                    onClick={() => onUpdate({ crossDimensionLabel: undefined, crossDimensionId: undefined })}
                    className="shrink-0 rounded p-0.5 text-primary/60 hover:text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic py-0.5">Drop a question as column</p>
            )}
          </div>

          {/* Filters */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Filters</p>
            <div className="flex flex-wrap gap-1.5">
              {/* Audience */}
              <Select value={widget.audienceId} onValueChange={(v) => onUpdate({ audienceId: v ?? undefined })}>
                <SelectTrigger size="sm" className="text-xs w-auto max-w-[160px] bg-muted border-0 rounded-md">
                  <span className="truncate">
                    {audiences.find((a) => a.id === widget.audienceId)?.name ?? widget.audienceId}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a.id} value={a.id} className="text-xs">{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Country — chip when active, native select when not */}
              {widget.country && widget.country !== 'All countries' ? (
                <span className="inline-flex items-center gap-1 px-2.5 h-7 bg-muted rounded-md text-xs text-foreground">
                  <span>{widget.country}</span>
                  <button
                    onClick={() => onUpdate({ country: undefined })}
                    className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) onUpdate({ country: e.target.value }) }}
                  className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
                >
                  <option value="">+ Country</option>
                  {SURVEY_COUNTRIES.filter((c) => c !== 'All countries').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}

              {/* Year — chip when active, native select when not */}
              {widget.year && widget.year !== 'All years' ? (
                <span className="inline-flex items-center gap-1 px-2.5 h-7 bg-muted rounded-md text-xs text-foreground">
                  <span>{widget.year}</span>
                  <button
                    onClick={() => onUpdate({ year: undefined })}
                    className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) onUpdate({ year: e.target.value }) }}
                  className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
                >
                  <option value="">+ Year</option>
                  {YEARS.filter((y) => y !== 'All years').map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* ── Detailed settings ── */}
        <div className="p-4 space-y-5">

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Title</label>
            <Input
              value={widget.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          {/* Chart type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Chart type</label>
            <div className="grid grid-cols-5 gap-1">
              {CHART_TYPES.map(({ type, label, Icon }) => (
                <button
                  key={type}
                  onClick={() => onUpdate({ type })}
                  title={label}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded border transition-colors ${
                    widget.type === type
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-medium">{label.slice(0, 5)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metrics — only when a cross dimension is set */}
          {widget.crossDimensionLabel && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">Metrics</label>
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
                    checked={!!widget.showIndex}
                    onChange={(e) => onUpdate({ showIndex: e.target.checked })}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Index</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Shows the relevance for a target group.</p>
                  </div>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
                    checked={!!widget.showTotalShare}
                    onChange={(e) => onUpdate({ showTotalShare: e.target.checked })}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Total share of all respondents</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Calculates results for all respondents.</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

// ─── Survey browser sidebar ───────────────────────────────────────────────────

const SURVEY_YEARS = ['All years', '2022', '2023', '2024', '2025']

// Design token: subtle inset-bottom shadow + hairline border, matching the Paper design spec
const BROWSER_FIELD_SHADOW = 'rgba(0,0,0,0.08) 0px -2px 0px inset, rgba(0,0,0,0.12) 0px 0px 0px 1px'

function SurveyBrowser({ onAdd, onDragStart, onDragEnd }: {
  onAdd: (q: SurveyQuestion) => void
  onDragStart?: (q: SurveyQuestion) => void
  onDragEnd?: () => void
}) {
  const [search, setSearch] = useState('')
  const [surveyType, setSurveyType] = useState('All surveys')
  const [country, setCountry] = useState('All countries')
  const [year, setYear] = useState('All years')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const isSearching = search.length > 0

  const filtered = isSearching
    ? SURVEY_CATALOG.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.label.toLowerCase().includes(search.toLowerCase()) ||
            cat.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.questions.length > 0)
    : SURVEY_CATALOG

  function toggleCategory(label: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  function isOpen(label: string) {
    return isSearching || expanded.has(label)
  }

  return (
    <>
      <div className="p-3 space-y-2 border-b border-border shrink-0">
        {/* Search */}
        <div
          className="flex items-center gap-1.5 h-8 px-2 rounded-md bg-[#FDFDFD] dark:bg-input"
          style={{ boxShadow: BROWSER_FIELD_SHADOW }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: '#B8B8B8' }} />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#B8B8B8]"
            style={{ color: '#707070' }}
          />
          <kbd className="text-[11px] font-sans shrink-0" style={{ color: '#B8B8B8' }}>⌘K</kbd>
        </div>

        {/* Survey type */}
        <Select value={surveyType} onValueChange={(v) => setSurveyType(v ?? '')}>
          <SelectTrigger
            className="h-8 text-sm w-full rounded-md border-0 bg-[#FDFDFD] dark:bg-input [&_svg]:text-[#B8B8B8]"
            style={{ boxShadow: BROWSER_FIELD_SHADOW, color: '#707070' }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SURVEY_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country */}
        <Select value={country} onValueChange={(v) => setCountry(v ?? '')}>
          <SelectTrigger
            className="h-8 text-sm w-full rounded-md border-0 bg-[#FDFDFD] dark:bg-input [&_svg]:text-[#B8B8B8]"
            style={{ boxShadow: BROWSER_FIELD_SHADOW, color: '#707070' }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SURVEY_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select value={year} onValueChange={(v) => setYear(v ?? '')}>
          <SelectTrigger
            className="h-8 text-sm w-full rounded-md border-0 bg-[#FDFDFD] dark:bg-input [&_svg]:text-[#B8B8B8]"
            style={{ boxShadow: BROWSER_FIELD_SHADOW, color: '#707070' }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SURVEY_YEARS.map((y) => (
              <SelectItem key={y} value={y} className="text-sm">{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground px-4 py-4">No questions match "{search}"</p>
        )}
        {filtered.map((category) => {
          const open = isOpen(category.label)
          return (
            <div key={category.label}>
              <button
                onClick={() => toggleCategory(category.label)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors border-b border-border"
              >
                <ChevronRight
                  className={`h-3 w-3 transition-transform duration-150 shrink-0 ${open ? 'rotate-90' : ''}`}
                />
                <span className="flex-1 text-left truncate">{category.label}</span>
              </button>

              {open && (
                <div className="border-b border-border">
                  {category.questions.map((q) => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('survey-question-id', q.id)
                        e.dataTransfer.setData('survey-question-label', q.label)
                        e.dataTransfer.effectAllowed = 'copy'
                        onDragStart?.(q)
                      }}
                      onDragEnd={() => onDragEnd?.()}
                      className="group flex items-center gap-2 px-3 py-2 hover:bg-primary/5 transition-colors cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      <span className="flex-1 text-xs text-foreground truncate leading-snug">{q.label}</span>
                      <button
                        onClick={() => onAdd(q)}
                        title="Add to canvas"
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-primary/10 text-primary shrink-0 transition-opacity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─── Cross-dimension drop preview ────────────────────────────────────────────

function CrossDimensionPreview({ question }: { question: SurveyQuestion }) {
  const cols = (DIMENSION_VALUES[question.label] ?? ['Group A', 'Group B', 'Group C']).slice(0, 5)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px] rounded z-10">
      <div className="w-[calc(100%-24px)] max-w-sm bg-background border border-primary/40 rounded-lg overflow-hidden shadow-md">
        {/* Column header bar */}
        <div className="flex items-center gap-2 bg-primary/8 border-b border-primary/20 px-3 py-2">
          <span className="text-[11px] font-semibold text-primary truncate">× {question.label}</span>
          <span className="text-[10px] text-muted-foreground shrink-0 ml-auto">as columns</span>
        </div>
        {/* Mini table preview */}
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left py-1.5 px-2 font-medium text-muted-foreground border-b border-border sticky left-0 bg-muted/40 min-w-[80px]">
                  Answers
                </th>
                {cols.map((col) => (
                  <th key={col} className="text-right py-1.5 px-2 font-medium text-primary/80 border-b border-border whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i} className="border-b border-border/30 last:border-0">
                  <td className="py-1.5 px-2 sticky left-0 bg-background">
                    <div className="h-1.5 bg-muted rounded-full" style={{ width: `${55 + i * 15}%` }} />
                  </td>
                  {cols.map((col) => (
                    <td key={col} className="py-1.5 px-2 text-right text-muted-foreground/60">
                      <div className="h-1.5 bg-muted/60 rounded-full ml-auto" style={{ width: '60%' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs font-medium text-primary mt-2.5">Drop to create cross table</p>
    </div>
  )
}

// ─── Key metrics strip ────────────────────────────────────────────────────────

function KeyMetricsStrip({ type, data }: { type: WidgetType; data: ChartData }) {
  if (type === 'scorecard') return null

  let primary = ''
  let primaryLabel = ''
  let secondary = ''
  let secondaryLabel = ''

  if (type === 'bar') {
    const max = Math.max(...data.series.flatMap((s) => s.values))
    const min = Math.min(...data.series.flatMap((s) => s.values))
    primary = `${max}%`
    primaryLabel = 'Peak'
    secondary = `${min}%`
    secondaryLabel = 'Min'
  } else if (type === 'line') {
    const vals = data.series[0]?.values ?? []
    const last = vals[vals.length - 1] ?? 0
    const first = vals[0] ?? last
    const delta = last - first
    primary = `${last}%`
    primaryLabel = 'Latest'
    secondary = `${delta >= 0 ? '+' : ''}${delta}%`
    secondaryLabel = 'vs start'
  } else if (type === 'pie') {
    const vals = data.series[0]?.values ?? []
    const total = vals.reduce((a, b) => a + b, 0) || 1
    const maxIdx = vals.indexOf(Math.max(...vals))
    primary = data.labels[maxIdx] ?? ''
    primaryLabel = 'Top segment'
    secondary = `${Math.round((vals[maxIdx] / total) * 100)}%`
    secondaryLabel = 'share'
  } else if (type === 'table') {
    primary = `${data.labels.length}`
    primaryLabel = 'Answers'
    const vals = data.series[0]?.values ?? []
    const maxIdx = vals.indexOf(Math.max(...vals))
    secondary = (data.labels[maxIdx] ?? '').slice(0, 14)
    secondaryLabel = 'top answer'
  }

  return (
    <div className="flex items-center gap-5 px-3 py-1.5 border-b border-border/40 bg-muted/10 shrink-0">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold text-foreground">{primary}</span>
        <span className="text-[10px] text-muted-foreground">{primaryLabel}</span>
      </div>
      {secondary && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-foreground/70">{secondary}</span>
          <span className="text-[10px] text-muted-foreground">{secondaryLabel}</span>
        </div>
      )}
    </div>
  )
}

// ─── AI prompt card ───────────────────────────────────────────────────────────

function DotGrid() {
  const COLS = 22
  const ROWS = 10
  const dots: { key: string; delay: number }[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = col / (COLS - 1) - 0.5
      const cy = row / (ROWS - 1) - 0.5
      const dist = Math.sqrt(cx * cx + cy * cy)
      dots.push({ key: `${row}-${col}`, delay: dist * 700 })
    }
  }
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        padding: '12px 16px',
      }}
    >
      {dots.map(({ key, delay }) => (
        <div key={key} className="flex items-center justify-center">
          <div
            className="rounded-full bg-white"
            style={{
              width: 2.5,
              height: 2.5,
              animation: 'dotGridPulse 2.4s ease-in-out infinite',
              animationDelay: `${delay}ms`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function AIPromptCard({
  onCreateWidget,
  onDismiss,
}: {
  onCreateWidget: (q: SurveyQuestion) => void
  onDismiss: () => void
}) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit() {
    if (!query.trim() || isLoading) return
    setIsLoading(true)
    const captured = query
    setQuery('')
    setTimeout(() => {
      setIsLoading(false)
      onCreateWidget({ id: `ai-${Date.now()}`, label: captured })
    }, 1200)
  }

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ background: '#1e3a8a', minHeight: 140 }}>
      <DotGrid />
      <div className="relative z-10 flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-semibold text-white">Ask AI to build a widget</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded text-blue-300/60 hover:text-blue-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Show gender breakdown of smartphone usage…"
            className="flex-1 h-9 rounded-lg px-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="h-9 px-3 rounded-lg bg-white text-blue-900 font-medium text-sm hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1.5"
          >
            {isLoading
              ? <RefreshCw className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dashboards, add, update, updateLayout, toggleShare } = useDashboardStore()
  const { widgets, add: addWidget, update: updateWidget } = useWidgetStore()
  const { audiences } = useAudienceStore()
  const { projects } = useProjectStore()

  const existing = id ? dashboards.find((d) => d.id === id) : null
  const isNew = !existing

  const [dashId] = useState(existing?.id ?? `dash-${Date.now()}`)
  const [name, setName] = useState(existing?.name ?? 'Untitled Dashboard')
  const [isShared, setIsShared] = useState(existing?.isShared ?? false)
  const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>(
    (existing?.widgets ?? []).map((w) => ({ ...w, chartKey: Math.random() }))
  )
  const [audienceOverride, setAudienceOverride] = useState<string>('')
  const [exportOpen, setExportOpen] = useState(false)
  const [containerWidth, setContainerWidth] = useState(900)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverWidgetId, setDragOverWidgetId] = useState<string | null>(null)
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [aiCardVisible, setAiCardVisible] = useState(false)
  const [draggingQuestion, setDraggingQuestion] = useState<SurveyQuestion | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerWidth(entry.contentRect.width)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [])

  const persistLayout = useCallback(
    (pw: PlacedWidget[]) => {
      const layout: DashboardWidget[] = pw.map(({ chartKey: _ck, ...rest }) => rest)
      if (isNew) {
        const exists = dashboards.find((d) => d.id === dashId)
        if (!exists) {
          add({
            id: dashId, name, widgets: layout, isShared,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        } else {
          update(dashId, { name, isShared })
          updateLayout(dashId, layout)
        }
      } else {
        updateLayout(dashId, layout)
      }
    },
    [dashId, name, isShared, isNew, dashboards, add, update, updateLayout]
  )

  function debouncedSave(pw: PlacedWidget[]) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => persistLayout(pw), 2000)
  }

  function handleLayoutChange(newLayout: Layout) {
    const updated = placedWidgets.map((pw) => {
      const l = newLayout.find((x) => x.i === pw.widgetId)
      if (!l) return pw
      return { ...pw, position: { x: l.x, y: l.y, w: l.w, h: l.h } }
    })
    setPlacedWidgets(updated)
    debouncedSave(updated)
  }

  function addWidgetToCanvas(widgetId: string) {
    if (placedWidgets.some((pw) => pw.widgetId === widgetId)) return
    const maxY = placedWidgets.reduce((acc, pw) => Math.max(acc, pw.position.y + pw.position.h), 0)
    const updated: PlacedWidget[] = [
      ...placedWidgets,
      { widgetId, position: { x: 0, y: maxY, w: 6, h: 4 }, chartKey: Math.random() },
    ]
    setPlacedWidgets(updated)
    debouncedSave(updated)
  }

  function addQuestionAsWidget(q: SurveyQuestion) {
    const widgetId = `wid-${Date.now()}`
    const newWidget: Widget = {
      id: widgetId,
      type: 'table',
      title: q.label,
      audienceId: audiences[0]?.id ?? 'aud-1',
      metric: 'category_penetration',
      createdAt: new Date().toISOString(),
    }
    addWidget(newWidget)
    addWidgetToCanvas(widgetId)
    setSelectedWidgetId(widgetId)
  }

  function addCrossDimension(widgetId: string, questionId: string, questionLabel: string) {
    updateWidget(widgetId, {
      crossDimensionLabel: questionLabel,
      crossDimensionId: questionId,
      type: 'table',
    })
    setPlacedWidgets((prev) =>
      prev.map((pw) => pw.widgetId === widgetId ? { ...pw, chartKey: Math.random() } : pw)
    )
    setSelectedWidgetId(widgetId)
  }

  function removeWidget(widgetId: string) {
    const updated = placedWidgets.filter((pw) => pw.widgetId !== widgetId)
    setPlacedWidgets(updated)
    debouncedSave(updated)
    if (selectedWidgetId === widgetId) setSelectedWidgetId(null)
  }

  function handleRefresh() {
    setPlacedWidgets((prev) => prev.map((pw) => ({ ...pw, chartKey: Math.random() })))
  }

  function handleToggleShare() {
    const next = !isShared
    setIsShared(next)
    if (!isNew) toggleShare(dashId)
  }

  function handleNameBlur() {
    if (!isNew) update(dashId, { name })
  }

  function handleCanvasDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const questionId = e.dataTransfer.getData('survey-question-id')
    const questionLabel = e.dataTransfer.getData('survey-question-label')
    if (questionId && questionLabel) {
      addQuestionAsWidget({ id: questionId, label: questionLabel })
    }
  }

  const selectedWidget = selectedWidgetId
    ? widgets.find((w) => w.id === selectedWidgetId) ?? null
    : null

  const layout: LayoutItem[] = placedWidgets.map(toLayoutItem)

  return (
    <div className="flex h-full overflow-hidden" onClick={() => setSelectedWidgetId(null)}>
      {/* Survey browser sidebar */}
      <aside
        className="w-72 shrink-0 border-r border-border flex flex-col bg-sidebar overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions</p>
        </div>
        <SurveyBrowser
          onAdd={addQuestionAsWidget}
          onDragStart={setDraggingQuestion}
          onDragEnd={() => setDraggingQuestion(null)}
        />
      </aside>

      {/* Main canvas */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background shrink-0">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => { setEditingTitle(false); handleNameBlur() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { setEditingTitle(false); handleNameBlur() } }}
              className="h-7 text-sm font-medium w-52 bg-transparent border-b-2 border-primary outline-none px-1 placeholder:text-muted-foreground"
              autoFocus
            />
          ) : (
            <span
              onClick={() => { setEditingTitle(true); setTimeout(() => titleInputRef.current?.select(), 0) }}
              title="Click to rename"
              className="text-sm font-medium truncate max-w-52 cursor-text hover:opacity-60 transition-opacity select-none px-1"
            >
              {name || 'Untitled Dashboard'}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Select value={audienceOverride} onValueChange={(v) => setAudienceOverride(v ?? '')}>
              <SelectTrigger className="h-7 text-xs w-40">
                <SelectValue placeholder="Audience override" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">None (per-widget)</SelectItem>
                {audiences.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="text-xs">{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleToggleShare}>
              <Share2 className="h-3.5 w-3.5" />
              {isShared ? 'Shared' : 'Share'}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => {
                const project = projects.find(p => p.dashboardIds.includes(dashId))
                if (project) {
                  navigate(`/workspace/${project.id}?tab=analyses&newFrom=${dashId}`)
                } else {
                  navigate(`/workspace?newFrom=${dashId}`)
                }
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate Analysis
            </Button>
          </div>
        </div>

        {/* Grid canvas */}
        <div
          className={`flex-1 overflow-auto pl-4 pt-4 pb-4 transition-colors ${isDragOver ? 'bg-primary/5' : 'bg-muted/20'}`}
          data-dashboard-canvas
          ref={canvasRef}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={(e) => {
            if (!canvasRef.current?.contains(e.relatedTarget as Node)) setIsDragOver(false)
          }}
          onDrop={handleCanvasDrop}
        >
          {placedWidgets.length === 0 ? (
            <EmptyState
              title="Canvas is empty"
              description="Click + next to a question or drag it here to add a widget."
            />
          ) : (
            <>
            <GridLayout
              layout={layout}
              gridConfig={{ cols: 12, rowHeight: ROW_HEIGHT, margin: [12, 12] }}
              dragConfig={{ enabled: true, handle: '.drag-handle', bounded: false }}
              width={containerWidth - 16}
              onLayoutChange={handleLayoutChange}
            >
              {placedWidgets.map((pw) => {
                const widget = widgets.find((w) => w.id === pw.widgetId)
                if (!widget) return null
                const data = generateChartData(
                  widget.type,
                  Boolean(widget.benchmarkAudienceId),
                  widget.crossDimensionLabel
                )
                const isSelected = selectedWidgetId === pw.widgetId
                const isDragTarget = dragOverWidgetId === pw.widgetId

                return (
                  <div
                    key={pw.widgetId}
                    data-widget-id={pw.widgetId}
                    onClick={(e) => { e.stopPropagation(); setSelectedWidgetId(pw.widgetId) }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverWidgetId(pw.widgetId) }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverWidgetId(null)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragOverWidgetId(null)
                      setIsDragOver(false)
                      const qId = e.dataTransfer.getData('survey-question-id')
                      const qLabel = e.dataTransfer.getData('survey-question-label')
                      if (qId && qLabel) addCrossDimension(pw.widgetId, qId, qLabel)
                    }}
                    className={`group bg-background rounded-lg flex flex-col overflow-hidden transition-all cursor-pointer ${
                      isDragTarget
                        ? 'ring-2 ring-primary/30'
                        : isSelected
                          ? 'ring-2 ring-primary'
                          : ''
                    }`}
                    style={{ boxShadow: BROWSER_FIELD_SHADOW }}
                  >
                    {/* Header */}
                    <div className={`relative flex items-center gap-2 px-3 py-2 shrink-0 ${widget.type === 'scorecard' ? 'border-b border-border' : ''}`}>
                      <span
                        className="drag-handle absolute left-1.5 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold truncate flex-1 ml-0 group-hover:ml-4 transition-[margin-left] duration-150">{widget.title}</span>
                      {widget.crossDimensionLabel && (
                        <span className="text-[10px] text-muted-foreground hidden sm:inline truncate max-w-[80px]">
                          × {widget.crossDimensionLabel}
                        </span>
                      )}
                      <ChartTypeSwitcher
                        currentType={widget.type}
                        onChange={(t) => updateWidget(widget.id, { type: t })}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeWidget(pw.widgetId) }}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Key metrics strip */}
                    <KeyMetricsStrip type={widget.type} data={data} />

                    {/* Chart */}
                    <div className="flex-1 min-h-0 p-2 relative">
                      <ChartRenderer
                        key={pw.chartKey}
                        widget={widget}
                        data={data}
                        height={pw.position.h * ROW_HEIGHT - (widget.type === 'scorecard' ? 52 : 86)}
                      />
                      {isDragTarget && draggingQuestion && (
                        <CrossDimensionPreview question={draggingQuestion} />
                      )}
                    </div>
                  </div>
                )
              })}
            </GridLayout>

            {/* Divider + AI card */}
            <div className="mt-3 pr-3" style={{ width: containerWidth - 16 }}>
              {!aiCardVisible ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <button
                    onClick={() => setAiCardVisible(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border hover:border-primary/30 transition-colors shrink-0"
                  >
                    <Sparkles className="h-3 w-3" />
                    Ask AI
                  </button>
                  <div className="flex-1 h-px bg-border" />
                </div>
              ) : (
                <AIPromptCard
                  onCreateWidget={addQuestionAsWidget}
                  onDismiss={() => setAiCardVisible(false)}
                />
              )}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Widget properties panel */}
      {selectedWidget && (
        <div className="h-full" onClick={(e) => e.stopPropagation()}>
          <WidgetPropertiesPanel
            widget={selectedWidget}
            audiences={audiences}
            onClose={() => setSelectedWidgetId(null)}
            onUpdate={(patch) => {
              updateWidget(selectedWidget.id, patch)
              if (patch.type || patch.crossDimensionLabel !== undefined) {
                setPlacedWidgets((prev) =>
                  prev.map((pw) =>
                    pw.widgetId === selectedWidget.id ? { ...pw, chartKey: Math.random() } : pw
                  )
                )
              }
            }}
          />
        </div>
      )}

      <ExportModal dashboardId={dashId} open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
