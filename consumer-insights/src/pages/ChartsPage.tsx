import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useLayout } from '@/components/layout/LayoutContext'
import { ATTRIBUTE_GROUPS, DEFAULT_CROSSTAB_CONFIG } from '@/types'
import type { Widget, ChartData, WidgetType, CrossTabConfig } from '@/types'
import { generateChartData, generateCrosstabRowData, generateTableRowData } from '@/data/fakeGenerators'
import ChartRenderer from '@/components/charts/ChartRenderer'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { Chip, FieldGroup, SectionLabel, Toolbar, ToolbarActions } from '@/components/app'
import { Button } from '@/components/ui/button'
import {
  X, BarChart2, TrendingUp, PieChart, Table2, Hash,
  ChevronRight, ChevronDown, LayoutDashboard, BookmarkPlus, Check, Share2, Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Chart library data ───────────────────────────────────────────────────────

type LibraryChart = {
  id: string
  title: string
  category: string
  type: WidgetType
  widget: Widget
  data: ChartData
}

const RAW: { c: string; t: string; ty: WidgetType }[] = [
  { c: 'Survey details',                 t: 'Survey country distribution',     ty: 'bar'       },
  { c: 'Survey details',                 t: 'Responses by survey wave',         ty: 'line'      },
  { c: 'Characteristics & demographics', t: 'Gender split',                     ty: 'pie'       },
  { c: 'Characteristics & demographics', t: 'Age distribution',                 ty: 'bar'       },
  { c: 'Characteristics & demographics', t: 'Country of residence',             ty: 'bar'       },
  { c: 'AI & smart technology',          t: 'AI assistant adoption',            ty: 'bar'       },
  { c: 'AI & smart technology',          t: 'Smart home device ownership',      ty: 'pie'       },
  { c: 'Consumer electronics',           t: 'Device type breakdown',            ty: 'pie'       },
  { c: 'Consumer electronics',           t: 'Streaming device ownership',       ty: 'bar'       },
  { c: 'Fashion',                        t: 'Clothing spend by age group',      ty: 'bar'       },
  { c: 'Fashion',                        t: 'Sustainable fashion interest',      ty: 'pie'       },
  { c: 'Fashion',                        t: 'Fashion interest over time',        ty: 'line'      },
  { c: 'Finance',                        t: 'Income bracket distribution',      ty: 'bar'       },
  { c: 'Finance',                        t: 'Preferred payment methods',        ty: 'pie'       },
  { c: 'Finance',                        t: 'Investment behaviour',             ty: 'bar'       },
  { c: 'Food & consumption',             t: 'Monthly food spend',               ty: 'bar'       },
  { c: 'Food & consumption',             t: 'Organic food preference',          ty: 'pie'       },
  { c: 'Food & consumption',             t: 'Restaurant visit frequency',       ty: 'bar'       },
  { c: 'Health',                         t: 'Health insurance type',            ty: 'pie'       },
  { c: 'Health',                         t: 'Fitness activity frequency',       ty: 'bar'       },
  { c: 'Health',                         t: 'Health consciousness level',       ty: 'pie'       },
  { c: 'Housing & household equipment',  t: 'Housing type breakdown',           ty: 'pie'       },
  { c: 'Housing & household equipment',  t: 'Household size distribution',      ty: 'bar'       },
  { c: 'Housing & household equipment',  t: 'Home ownership status',            ty: 'pie'       },
  { c: 'Insurance',                      t: 'Insurance ownership rate',         ty: 'scorecard' },
  { c: 'Insurance',                      t: 'Insurance types owned',            ty: 'bar'       },
  { c: 'Internet & smartphone',          t: 'Internet usage over time',         ty: 'line'      },
  { c: 'Internet & smartphone',          t: 'Smartphone OS distribution',       ty: 'pie'       },
  { c: 'Internet & smartphone',          t: 'Mobile data usage by age',         ty: 'bar'       },
  { c: 'Media & news',                   t: 'News consumption frequency',       ty: 'bar'       },
  { c: 'Media & news',                   t: 'Streaming subscription share',     ty: 'pie'       },
  { c: 'Media & news',                   t: 'Daily media time spent',           ty: 'line'      },
  { c: 'Mobility',                       t: 'Primary transport mode',           ty: 'pie'       },
  { c: 'Mobility',                       t: 'Car ownership status',             ty: 'pie'       },
  { c: 'Mobility',                       t: 'Travel frequency distribution',    ty: 'bar'       },
  { c: 'Online shopping',                t: 'Monthly online spend',             ty: 'bar'       },
  { c: 'Online shopping',                t: 'Purchase frequency',               ty: 'bar'       },
  { c: 'Online shopping',                t: 'Preferred retailer',               ty: 'pie'       },
  { c: 'Personal care',                  t: 'Personal care monthly spend',      ty: 'bar'       },
  { c: 'Personal care',                  t: 'Grooming frequency',               ty: 'bar'       },
  { c: 'Print media & ePublishing',      t: 'Print media readership',           ty: 'bar'       },
  { c: 'Print media & ePublishing',      t: 'eBook usage rate',                 ty: 'pie'       },
  { c: 'Retail shopping',                t: 'Monthly retail spend',             ty: 'bar'       },
  { c: 'Retail shopping',                t: 'Preferred store type',             ty: 'pie'       },
  { c: 'Retail shopping',                t: 'Loyalty programme membership',     ty: 'scorecard' },
  { c: 'Services & eServices',           t: 'Service subscriptions held',       ty: 'pie'       },
  { c: 'Services & eServices',           t: 'Digital services usage',           ty: 'bar'       },
  { c: 'Social media & marketing',       t: 'Social media platforms used',      ty: 'bar'       },
  { c: 'Social media & marketing',       t: 'Daily social media time',          ty: 'line'      },
  { c: 'Social media & marketing',       t: 'Influencer engagement rate',       ty: 'scorecard' },
  { c: 'Travel',                         t: 'Annual trips taken',               ty: 'bar'       },
  { c: 'Travel',                         t: 'Accommodation preference',         ty: 'pie'       },
  { c: 'Travel',                         t: 'Travel budget distribution',       ty: 'bar'       },
  { c: 'Video games',                    t: 'Gaming frequency',                 ty: 'bar'       },
  { c: 'Video games',                    t: 'Gaming platform split',            ty: 'pie'       },
  { c: 'Video games',                    t: 'Monthly gaming spend',             ty: 'bar'       },
]

const CHART_LIBRARY: LibraryChart[] = RAW.map((item, i) => {
  const id = `lib-${i}`
  const widget: Widget = {
    id, type: item.ty, title: item.t,
    audienceId: 'all', metric: 'brand_awareness', createdAt: '',
  }
  const data = generateChartData(item.ty, false, undefined, id)
  return { id, title: item.t, category: item.c, type: item.ty, widget, data }
})

// ─── Chart type meta ──────────────────────────────────────────────────────────

const CHART_TYPES: { type: WidgetType; label: string; Icon: LucideIcon }[] = [
  { type: 'table',     label: 'Table',     Icon: Table2     },
  { type: 'bar',       label: 'Bar',       Icon: BarChart2  },
  { type: 'line',      label: 'Line',      Icon: TrendingUp },
  { type: 'pie',       label: 'Pie',       Icon: PieChart   },
  { type: 'scorecard', label: 'Scorecard', Icon: Hash       },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const SIDEBAR_MIN = 160
const SIDEBAR_MAX = 360
const SIDEBAR_DEFAULT = 220

function ChartSidebar({
  selected,
  onSelect,
  width,
  onWidthChange,
}: {
  selected: LibraryChart | null
  onSelect: (c: LibraryChart) => void
  width: number
  onWidthChange: (w: number) => void
}) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(ATTRIBUTE_GROUPS.map(g => g.label))
  )
  const [savedOpen, setSavedOpen] = useState(true)
  const [search, setSearch] = useState('')
  const isResizing = useRef(false)
  const { widgets } = useWidgetStore()
  const savedCharts: LibraryChart[] = widgets
    .filter(w => w.id.startsWith('saved-'))
    .map(w => ({
      id: w.id,
      title: w.title,
      category: 'Saved',
      type: w.type,
      widget: w,
      data: generateChartData(w.type, false, undefined, w.id),
    }))

  function toggleCategory(label: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startW = width
    function onMove(ev: MouseEvent) {
      if (!isResizing.current) return
      onWidthChange(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startW + ev.clientX - startX)))
    }
    function onUp() {
      isResizing.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [width, onWidthChange])

  return (
    <aside
      className="relative shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden"
      style={{ width }}
    >
      {/* Header */}
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">Charts</span>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 border-b border-border shrink-0">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search charts…"
          className="w-full h-7 px-2 text-xs rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>

      {/* Tree */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Saved charts section */}
        {savedCharts.length > 0 && (
          <div className="mb-1">
            <button
              onClick={() => setSavedOpen(o => !o)}
              className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-sidebar-foreground hover:bg-white/70 transition-colors"
            >
              {savedOpen
                ? <ChevronDown size={11} className="shrink-0 text-muted-foreground" />
                : <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
              }
              <span className="truncate font-medium">Saved</span>
              <span className="ml-auto text-[10px] text-muted-foreground tabular-nums shrink-0">{savedCharts.length}</span>
            </button>
            {savedOpen && savedCharts.map(chart => (
              <button
                key={chart.id}
                draggable
                onDragStart={e => { e.dataTransfer.setData('text/plain', chart.title); e.dataTransfer.effectAllowed = 'copy' }}
                onClick={() => onSelect(chart)}
                className={cn(
                  'flex items-center gap-2 w-full text-left pl-7 pr-3 py-1.5 text-xs rounded-md mx-1 transition-colors cursor-grab active:cursor-grabbing',
                  selected?.id === chart.id
                    ? 'bg-primary/8 text-primary font-semibold'
                    : 'text-sidebar-foreground hover:bg-white/70',
                )}
                style={{ width: 'calc(100% - 8px)' }}
              >
                <span className="truncate">{chart.title}</span>
              </button>
            ))}
            <div className="mx-3 my-1 border-t border-border" />
          </div>
        )}

        {search.trim().length > 0 &&
          !CHART_LIBRARY.some(c =>
            c.title.toLowerCase().includes(search.trim().toLowerCase()) ||
            c.category.toLowerCase().includes(search.trim().toLowerCase())
          ) && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">
            No charts match "{search.trim()}"
          </p>
        )}

        {ATTRIBUTE_GROUPS.map(group => {
          const allCharts = CHART_LIBRARY.filter(c => c.category === group.label)
          const isSearching = search.trim().length > 0
          const q = search.trim().toLowerCase()
          const charts = isSearching
            ? allCharts.filter(c =>
                c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
              )
            : allCharts
          if (isSearching && charts.length === 0) return null
          const isOpen = isSearching ? true : openCategories.has(group.label)
          return (
            <div key={group.label}>
              {/* Category row */}
              <button
                onClick={() => { if (!isSearching) toggleCategory(group.label) }}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-sidebar-foreground hover:bg-white/70 transition-colors"
              >
                {isOpen
                  ? <ChevronDown size={11} className="shrink-0 text-muted-foreground" />
                  : <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                }
                <span className="truncate font-medium">{group.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums shrink-0">{charts.length}</span>
              </button>

              {/* Chart leaf items */}
              {isOpen && charts.map(chart => (
                <button
                  key={chart.id}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', chart.title)
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => onSelect(chart)}
                  className={cn(
                    'flex items-center gap-2 w-full text-left pl-7 pr-3 py-1.5 text-xs rounded-md mx-1 transition-colors cursor-grab active:cursor-grabbing',
                    selected?.id === chart.id
                      ? 'bg-primary/8 text-primary font-semibold'
                      : 'text-sidebar-foreground hover:bg-white/70',
                  )}
                  style={{ width: 'calc(100% - 8px)' }}
                >
                  <span className="truncate">{chart.title}</span>
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="group absolute right-0 top-0 h-full w-2 translate-x-1/2 cursor-col-resize z-10 flex items-center justify-center"
      >
        <div className="h-full w-px bg-sidebar-border transition-colors group-hover:bg-primary/40 group-active:bg-primary/60" />
      </div>
    </aside>
  )
}

// ─── Properties panel ─────────────────────────────────────────────────────────

function PropertiesPanel({
  chart,
  activeType,
  setActiveType,
  audienceId,
  setAudienceId,
  crossAttrs,
  setCrossAttrs,
  crossTabConfig,
  setCrossTabConfig,
  extraRows,
  setExtraRows,
  heatmap,
  setHeatmap,
  onClose,
}: {
  chart: LibraryChart
  activeType: WidgetType
  setActiveType: (t: WidgetType) => void
  audienceId: string
  setAudienceId: (id: string) => void
  crossAttrs: string[]
  setCrossAttrs: (attrs: string[]) => void
  crossTabConfig: CrossTabConfig
  setCrossTabConfig: (c: CrossTabConfig) => void
  extraRows: string[]
  setExtraRows: (rows: string[]) => void
  heatmap: boolean
  setHeatmap: (v: boolean) => void
  onClose: () => void
}) {
  const { audiences } = useAudienceStore()

  const isCrossTab = crossAttrs.length > 0
  const effectiveType = isCrossTab ? 'table' : activeType
  const selectedAudience = audiences.find(a => a.id === audienceId)
  const [rowDropOver, setRowDropOver] = useState(false)
  const [colDropOver, setColDropOver] = useState(false)

  function removeColumn(attr: string) {
    setCrossAttrs(crossAttrs.filter(a => a !== attr))
  }

  function addColumn(attr: string) {
    if (!crossAttrs.includes(attr)) setCrossAttrs([...crossAttrs, attr])
  }

  return (
    <aside className="relative shrink-0 border-l border-border flex flex-col bg-sidebar overflow-hidden h-full w-[288px]">

      {/* Header */}
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

        {/* Rows / Columns / Filters */}
        <div className="p-4 space-y-4 border-b border-border">

          {/* Rows */}
          <div>
            <SectionLabel>Rows</SectionLabel>
            <div
              className={cn(
                'flex flex-wrap gap-1.5 mb-1.5 min-h-[28px] rounded-md transition-colors',
                rowDropOver && 'bg-primary/8 ring-1 ring-primary/30'
              )}
              onDragOver={e => { e.preventDefault(); setRowDropOver(true) }}
              onDragLeave={() => setRowDropOver(false)}
              onDrop={e => {
                e.preventDefault()
                setRowDropOver(false)
                const val = e.dataTransfer.getData('text/plain')
                if (val && !extraRows.includes(val) && val !== chart.title) setExtraRows([...extraRows, val])
              }}
            >
              <Chip label={chart.widget.breakdown || chart.title} />
              {extraRows.map(row => (
                <Chip key={row} label={row} variant="primary" onRemove={() => setExtraRows(extraRows.filter(r => r !== row))} />
              ))}
            </div>
            <select
              data-rows-select
              value=""
              onChange={e => {
                const val = e.target.value
                if (val && !extraRows.includes(val)) setExtraRows([...extraRows, val])
              }}
              className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
            >
              <option value="">+ Add row</option>
              {ATTRIBUTE_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.attrs.map(attr => (
                    <option key={attr} value={attr} disabled={extraRows.includes(attr)}>{attr}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Columns */}
          <div>
            <SectionLabel>Columns</SectionLabel>
            <div
              className={cn(
                'flex flex-wrap gap-1.5 mb-1.5 min-h-[28px] rounded-md transition-colors',
                colDropOver && 'bg-primary/8 ring-1 ring-primary/30'
              )}
              onDragOver={e => { e.preventDefault(); setColDropOver(true) }}
              onDragLeave={() => setColDropOver(false)}
              onDrop={e => {
                e.preventDefault()
                setColDropOver(false)
                const val = e.dataTransfer.getData('text/plain')
                if (val) addColumn(val)
              }}
            >
              {crossAttrs.map(attr => (
                <Chip key={attr} label={attr} variant="primary" onRemove={() => removeColumn(attr)} />
              ))}
            </div>
            <select
              data-columns-select
              value=""
              onChange={e => { if (e.target.value) addColumn(e.target.value) }}
              className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
            >
              <option value="">+ Add column</option>
              {ATTRIBUTE_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.attrs.map(attr => (
                    <option key={attr} value={attr} disabled={crossAttrs.includes(attr)}>{attr}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Cross-tab columns */}
          {isCrossTab && (
            <div>
              <SectionLabel>Cross-tab columns</SectionLabel>
              <div className="space-y-1.5">
                {(
                  [
                    { key: 'showTotal',     label: 'Total'     },
                    { key: 'showUniverse',  label: 'Universe'  },
                    { key: 'showResponses', label: 'Responses' },
                    { key: 'showPctCol',    label: '% Col'     },
                    { key: 'showPctRow',    label: '% Row'     },
                    { key: 'showIndex',     label: 'Index'     },
                  ] as Array<{ key: keyof CrossTabConfig; label: string }>
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                      checked={crossTabConfig[key]}
                      onChange={e => setCrossTabConfig({ ...crossTabConfig, [key]: e.target.checked })}
                    />
                    <span className="text-xs text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filters — audience */}
          <div>
            <SectionLabel>Filters</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {audienceId && selectedAudience ? (
                <Chip label={selectedAudience.name} onRemove={() => setAudienceId('')} />
              ) : (
                <select
                  value=""
                  onChange={e => { if (e.target.value) setAudienceId(e.target.value) }}
                  className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
                >
                  <option value="">+ Audience</option>
                  {audiences.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Chart type */}
        <div className="p-4 border-b border-border">
          <FieldGroup label="Chart type">
            <div className="grid grid-cols-5 gap-1">
              {CHART_TYPES.map(({ type, label, Icon }) => {
                const isActive   = effectiveType === type
                const isDisabled = isCrossTab && type !== 'table'
                return (
                  <button
                    key={type}
                    onClick={() => { if (!isDisabled) { setCrossAttrs([]); setActiveType(type) } }}
                    disabled={isDisabled}
                    title={label}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded border transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/8 text-primary'
                        : isDisabled
                          ? 'border-border text-muted-foreground/30 cursor-not-allowed'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] font-medium">{label.slice(0, 5)}</span>
                  </button>
                )
              })}
            </div>
            {/* Heatmap toggle — only for table */}
            {effectiveType === 'table' && (
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heatmap}
                  onChange={e => setHeatmap(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary cursor-pointer"
                />
                <span className="text-xs text-foreground">Heatmap</span>
              </label>
            )}
          </FieldGroup>
        </div>

      </div>
    </aside>
  )
}

// ─── Save dialog ──────────────────────────────────────────────────────────────

function SaveDialog({
  defaultName,
  onConfirm,
  onCancel,
}: {
  defaultName: string
  onConfirm: (name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(defaultName)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-background border border-border rounded-xl shadow-xl w-80 p-5">
        <p className="text-sm font-semibold text-foreground mb-1">Save chart to library</p>
        <p className="text-xs text-muted-foreground mb-4">Give this chart a name. It will appear in your Charts library.</p>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim()) }}
          className="w-full h-8 px-3 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
          placeholder="Chart name"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 h-8 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (name.trim()) onConfirm(name.trim()) }}
            className="px-3 h-8 rounded-md bg-primary text-white text-xs hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartsPage() {
  const { setLeftPanel } = useLayout()
  const [selected, setSelected] = useState<LibraryChart | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT)

  // Chart config state — lifted here so both panel and centre share it
  const [activeType, setActiveType]       = useState<WidgetType>('table')
  const [audienceId, setAudienceId]       = useState<string>('')
  const [crossAttrs, setCrossAttrs]       = useState<string[]>([])
  const [crossTabConfig, setCrossTabConfig] = useState<CrossTabConfig>(DEFAULT_CROSSTAB_CONFIG)
  const [heatmap, setHeatmap] = useState(false)
  const [extraRows, setExtraRows]         = useState<string[]>([])

  // Save dialog
  const [saveOpen, setSaveOpen] = useState(false)

  // Add to dashboard popover
  const [dashMenuOpen, setDashMenuOpen] = useState(false)
  const [addedDash, setAddedDash] = useState<string | null>(null)
  const [creatingDash, setCreatingDash] = useState(false)
  const [newDashName, setNewDashName] = useState('')
  const addToDashRef = useRef<HTMLDivElement>(null)

  // Drop target for columns
  const [isDragOver, setIsDragOver] = useState(false)

  const { dashboards, add: addDashboard, updateLayout } = useDashboardStore()
  const { add: addWidget, remove: removeWidget } = useWidgetStore()

  // Close dashboard popover on outside click
  useEffect(() => {
    if (!dashMenuOpen) return
    function handler(e: MouseEvent) {
      if (addToDashRef.current && !addToDashRef.current.contains(e.target as Node)) {
        setDashMenuOpen(false)
        setCreatingDash(false)
        setNewDashName('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dashMenuOpen])

  // Reset chart config when selection changes — always default to table view
  useEffect(() => {
    if (selected) {
      setActiveType('table')
      setAudienceId('')
      setCrossAttrs([])
      setCrossTabConfig(DEFAULT_CROSSTAB_CONFIG)
      setExtraRows([])
      setHeatmap(false)
    }
  }, [selected?.id])

  // Force table when cross attrs are present
  useEffect(() => {
    if (crossAttrs.length > 0) setActiveType('table')
  }, [crossAttrs.length])

  const isCrossTab     = crossAttrs.length > 0
  const effectiveType  = isCrossTab ? 'table' : activeType

  const { widget, data, extraRowsData } = useMemo(() => {
    if (!selected) return { widget: null, data: null, extraRowsData: [] }
    const type = effectiveType

    const cat = selected.category
    // Merge series from all cross-tab dimensions so every added column is visible
    const baseData = generateChartData(type, false, crossAttrs[0] || undefined, `${selected.id}:${audienceId}`, undefined, undefined, cat)
    const data = isCrossTab && crossAttrs.length > 1
      ? {
          ...baseData,
          series: crossAttrs.flatMap(attr =>
            generateChartData('table', false, attr, selected.id, undefined, undefined, cat).series
          ),
        }
      : baseData

    const widget: Widget = {
      ...selected.widget,
      type,
      audienceId: audienceId || 'all',
      crossDimensionLabel: crossAttrs[0] || undefined,
      crossDimensionId:    crossAttrs[0] || undefined,
    }
    const extraRowsData = extraRows.map(rowAttr => ({
      label: rowAttr,
      data: isCrossTab
        ? {
            ...generateCrosstabRowData(rowAttr, crossAttrs[0], selected.id, undefined, cat),
            series: crossAttrs.flatMap(attr =>
              generateCrosstabRowData(rowAttr, attr, selected.id, undefined, cat).series
            ),
          }
        : generateTableRowData(rowAttr, selected.id),
    }))
    return { widget, data, extraRowsData }
  }, [selected, effectiveType, audienceId, crossAttrs, extraRows, isCrossTab])

  // ── Actions ─────────────────────────────────────────────────────────────────

  function handleAddToDashboard(dashId: string) {
    if (!selected || !widget) return
    const dash = dashboards.find(d => d.id === dashId)
    if (!dash) return
    const newId = `lib-dash-${Date.now()}`
    addWidget({ ...widget, id: newId, createdAt: new Date().toISOString() })
    const existing = dash.widgets
    const newDashWidget = {
      widgetId: newId,
      position: { x: (existing.length % 2) * 6, y: Math.floor(existing.length / 2) * 4, w: 6, h: 4 },
    }
    updateLayout(dashId, [...existing, newDashWidget])
    setAddedDash(dashId)
    setTimeout(() => { setAddedDash(null); setDashMenuOpen(false) }, 1200)
  }

  function handleAddToNewDashboard(dashName: string) {
    if (!selected || !widget) return
    const dashId = `dash-${Date.now()}`
    const widgetId = `lib-dash-${Date.now()}`
    addWidget({ ...widget, id: widgetId, createdAt: new Date().toISOString() })
    addDashboard({
      id: dashId, name: dashName,
      widgets: [{ widgetId, position: { x: 0, y: 0, w: 6, h: 4 } }],
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setAddedDash(dashId)
    setTimeout(() => { setAddedDash(null); setDashMenuOpen(false) }, 1200)
  }

  function handleSaveConfirm(name: string) {
    if (!selected || !widget) return
    const newId = `saved-${Date.now()}`
    addWidget({
      ...widget,
      id: newId,
      title: name,
      breakdown: selected.title,  // preserve original question name
      createdAt: new Date().toISOString(),
    })
    setSaveOpen(false)
  }

  // ── Drop handling (drag attribute onto chart) ────────────────────────────────

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }
  function handleDragLeave() {
    setIsDragOver(false)
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const val = e.dataTransfer.getData('text/plain')
    if (val && val !== selected?.title && !extraRows.includes(val)) setExtraRows(prev => [...prev, val])
  }

  // Inject the chart sidebar outside the white card via LayoutContext
  useEffect(() => {
    setLeftPanel(
      <ChartSidebar
        selected={selected}
        onSelect={chart => setSelected(chart)}
        width={sidebarWidth}
        onWidthChange={setSidebarWidth}
      />
    )
    return () => setLeftPanel(null)
  }, [selected, sidebarWidth, setLeftPanel])

  return (
    <div className="flex h-full overflow-hidden">

      {/* Centre — standalone chart view or empty state */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {selected && widget && data ? (
          <>
            {/* Chart toolbar */}
            <Toolbar>
              {/* Left: breadcrumb + title */}
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{selected.category}</p>
                <h1 className="text-sm font-semibold text-gray-900 truncate">{selected.title}</h1>
              </div>

              <ToolbarActions>
                {selected.id.startsWith('saved-') && (
                  <Button
                    variant="outline"
                    size="toolbar"
                    className="text-destructive hover:bg-destructive/10 hover:border-destructive/40"
                    onClick={() => {
                      removeWidget(selected.id)
                      setSelected(null)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                )}
                <Button variant="outline" size="toolbar">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
                <Button variant="outline" size="toolbar" onClick={() => setSaveOpen(true)}>
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  Save
                </Button>
                <div className="relative" ref={addToDashRef}>
                  <Button
                    size="toolbar"
                    onClick={() => setDashMenuOpen(o => !o)}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Add to dashboard
                  </Button>
                  {dashMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 overflow-hidden min-w-[200px]"
                      onMouseDown={e => e.stopPropagation()}
                    >
                      {dashboards.map(d => (
                        <button
                          key={d.id}
                          onClick={() => handleAddToDashboard(d.id)}
                          className="flex items-center justify-between gap-2 w-full px-3 py-2 text-xs text-left hover:bg-accent transition-colors"
                        >
                          <span className="truncate">{d.name}</span>
                          {addedDash === d.id && <Check className="h-3 w-3 text-green-600 shrink-0" />}
                        </button>
                      ))}
                      {creatingDash ? (
                        <form
                          className="flex items-center gap-1 px-2 py-1.5 border-t border-border"
                          onSubmit={e => { e.preventDefault(); if (newDashName.trim()) { handleAddToNewDashboard(newDashName.trim()); setCreatingDash(false); setNewDashName('') } }}
                        >
                          <input
                            autoFocus
                            value={newDashName}
                            onChange={e => setNewDashName(e.target.value)}
                            placeholder="Dashboard name"
                            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                          />
                          <button type="submit" className="text-xs text-primary font-medium">Add</button>
                        </form>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 w-full px-3 py-2 text-xs text-primary border-t border-border hover:bg-accent transition-colors"
                          onClick={() => setCreatingDash(true)}
                        >
                          + New dashboard
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </ToolbarActions>
            </Toolbar>

            {/* Chart area — drop target */}
            <div
              className={cn(
                'flex-1 transition-colors overflow-auto',
                effectiveType === 'table' ? 'p-0' : 'p-6',
                isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary/30' : 'bg-background'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <p className="text-sm text-primary font-medium bg-background/80 px-4 py-2 rounded-lg shadow">
                    Drop to add as row
                  </p>
                </div>
              )}
              <ChartRenderer
                widget={widget}
                data={data}
                height={effectiveType === 'table' ? undefined : 480}
                crossTabConfig={isCrossTab ? crossTabConfig : undefined}
                extraRowsData={extraRowsData}
                heatmap={heatmap}
              />
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Select a chart from the sidebar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Click any item in the tree to open it here</p>
            </div>
          </div>
        )}
      </div>

      {/* Right — properties panel */}
      {selected && (
        <PropertiesPanel
          chart={selected}
          activeType={activeType}
          setActiveType={setActiveType}
          audienceId={audienceId}
          setAudienceId={setAudienceId}
          crossAttrs={crossAttrs}
          setCrossAttrs={setCrossAttrs}
          crossTabConfig={crossTabConfig}
          setCrossTabConfig={setCrossTabConfig}
          extraRows={extraRows}
          setExtraRows={setExtraRows}
          heatmap={heatmap}
          setHeatmap={setHeatmap}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Save dialog */}
      {saveOpen && selected && (
        <SaveDialog
          defaultName={selected.title}
          onConfirm={handleSaveConfirm}
          onCancel={() => setSaveOpen(false)}
        />
      )}

    </div>
  )
}
