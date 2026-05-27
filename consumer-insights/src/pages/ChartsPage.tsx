import { useState, useMemo, useEffect } from 'react'
import { ATTRIBUTE_GROUPS } from '@/types'
import type { Widget, ChartData, WidgetType } from '@/types'
import { generateChartData } from '@/data/fakeGenerators'
import ChartRenderer from '@/components/charts/ChartRenderer'
import { useAudienceStore } from '@/store/audienceStore'
import { Chip, FieldGroup, SectionLabel } from '@/components/app'
import { X, BarChart2, TrendingUp, PieChart, Table2, Hash } from 'lucide-react'
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
  // Survey details
  { c: 'Survey details',                 t: 'Survey country distribution',     ty: 'bar'       },
  { c: 'Survey details',                 t: 'Responses by survey wave',         ty: 'line'      },
  // Characteristics & demographics
  { c: 'Characteristics & demographics', t: 'Gender split',                     ty: 'pie'       },
  { c: 'Characteristics & demographics', t: 'Age distribution',                 ty: 'bar'       },
  { c: 'Characteristics & demographics', t: 'Country of residence',             ty: 'bar'       },
  // AI & smart technology
  { c: 'AI & smart technology',          t: 'AI assistant adoption',            ty: 'bar'       },
  { c: 'AI & smart technology',          t: 'Smart home device ownership',      ty: 'pie'       },
  // Consumer electronics
  { c: 'Consumer electronics',           t: 'Device type breakdown',            ty: 'pie'       },
  { c: 'Consumer electronics',           t: 'Streaming device ownership',       ty: 'bar'       },
  // Fashion
  { c: 'Fashion',                        t: 'Clothing spend by age group',      ty: 'bar'       },
  { c: 'Fashion',                        t: 'Sustainable fashion interest',      ty: 'pie'       },
  { c: 'Fashion',                        t: 'Fashion interest over time',        ty: 'line'      },
  // Finance
  { c: 'Finance',                        t: 'Income bracket distribution',      ty: 'bar'       },
  { c: 'Finance',                        t: 'Preferred payment methods',        ty: 'pie'       },
  { c: 'Finance',                        t: 'Investment behaviour',             ty: 'bar'       },
  // Food & consumption
  { c: 'Food & consumption',             t: 'Monthly food spend',               ty: 'bar'       },
  { c: 'Food & consumption',             t: 'Organic food preference',          ty: 'pie'       },
  { c: 'Food & consumption',             t: 'Restaurant visit frequency',       ty: 'bar'       },
  // Health
  { c: 'Health',                         t: 'Health insurance type',            ty: 'pie'       },
  { c: 'Health',                         t: 'Fitness activity frequency',       ty: 'bar'       },
  { c: 'Health',                         t: 'Health consciousness level',       ty: 'pie'       },
  // Housing & household equipment
  { c: 'Housing & household equipment',  t: 'Housing type breakdown',           ty: 'pie'       },
  { c: 'Housing & household equipment',  t: 'Household size distribution',      ty: 'bar'       },
  { c: 'Housing & household equipment',  t: 'Home ownership status',            ty: 'pie'       },
  // Insurance
  { c: 'Insurance',                      t: 'Insurance ownership rate',         ty: 'scorecard' },
  { c: 'Insurance',                      t: 'Insurance types owned',            ty: 'bar'       },
  // Internet & smartphone
  { c: 'Internet & smartphone',          t: 'Internet usage over time',         ty: 'line'      },
  { c: 'Internet & smartphone',          t: 'Smartphone OS distribution',       ty: 'pie'       },
  { c: 'Internet & smartphone',          t: 'Mobile data usage by age',         ty: 'bar'       },
  // Media & news
  { c: 'Media & news',                   t: 'News consumption frequency',       ty: 'bar'       },
  { c: 'Media & news',                   t: 'Streaming subscription share',     ty: 'pie'       },
  { c: 'Media & news',                   t: 'Daily media time spent',           ty: 'line'      },
  // Mobility
  { c: 'Mobility',                       t: 'Primary transport mode',           ty: 'pie'       },
  { c: 'Mobility',                       t: 'Car ownership status',             ty: 'pie'       },
  { c: 'Mobility',                       t: 'Travel frequency distribution',    ty: 'bar'       },
  // Online shopping
  { c: 'Online shopping',                t: 'Monthly online spend',             ty: 'bar'       },
  { c: 'Online shopping',                t: 'Purchase frequency',               ty: 'bar'       },
  { c: 'Online shopping',                t: 'Preferred retailer',               ty: 'pie'       },
  // Personal care
  { c: 'Personal care',                  t: 'Personal care monthly spend',      ty: 'bar'       },
  { c: 'Personal care',                  t: 'Grooming frequency',               ty: 'bar'       },
  // Print media & ePublishing
  { c: 'Print media & ePublishing',      t: 'Print media readership',           ty: 'bar'       },
  { c: 'Print media & ePublishing',      t: 'eBook usage rate',                 ty: 'pie'       },
  // Retail shopping
  { c: 'Retail shopping',                t: 'Monthly retail spend',             ty: 'bar'       },
  { c: 'Retail shopping',                t: 'Preferred store type',             ty: 'pie'       },
  { c: 'Retail shopping',                t: 'Loyalty programme membership',     ty: 'scorecard' },
  // Services & eServices
  { c: 'Services & eServices',           t: 'Service subscriptions held',       ty: 'pie'       },
  { c: 'Services & eServices',           t: 'Digital services usage',           ty: 'bar'       },
  // Social media & marketing
  { c: 'Social media & marketing',       t: 'Social media platforms used',      ty: 'bar'       },
  { c: 'Social media & marketing',       t: 'Daily social media time',          ty: 'line'      },
  { c: 'Social media & marketing',       t: 'Influencer engagement rate',       ty: 'scorecard' },
  // Travel
  { c: 'Travel',                         t: 'Annual trips taken',               ty: 'bar'       },
  { c: 'Travel',                         t: 'Accommodation preference',         ty: 'pie'       },
  { c: 'Travel',                         t: 'Travel budget distribution',       ty: 'bar'       },
  // Video games
  { c: 'Video games',                    t: 'Gaming frequency',                 ty: 'bar'       },
  { c: 'Video games',                    t: 'Gaming platform split',            ty: 'pie'       },
  { c: 'Video games',                    t: 'Monthly gaming spend',             ty: 'bar'       },
]

// Generate data once at module load so grid cards are stable
const CHART_LIBRARY: LibraryChart[] = RAW.map((item, i) => {
  const id = `lib-${i}`
  const widget: Widget = {
    id,
    type: item.ty,
    title: item.t,
    audienceId: 'all',
    metric: 'brand_awareness',
    createdAt: '',
  }
  const data = generateChartData(item.ty, false)
  return { id, title: item.t, category: item.c, type: item.ty, widget, data }
})

// ─── Type meta — mirrors DashboardBuilderPage exactly ────────────────────────

const CHART_TYPES: { type: WidgetType; label: string; Icon: LucideIcon }[] = [
  { type: 'table',     label: 'Table',     Icon: Table2    },
  { type: 'bar',       label: 'Bar',       Icon: BarChart2 },
  { type: 'line',      label: 'Line',      Icon: TrendingUp },
  { type: 'pie',       label: 'Pie',       Icon: PieChart  },
  { type: 'scorecard', label: 'Scorecard', Icon: Hash      },
]

// Kept for card badges only
const TYPE_COLOR: Record<WidgetType, string> = {
  bar:       'bg-blue-50 text-blue-600',
  line:      'bg-emerald-50 text-emerald-700',
  pie:       'bg-purple-50 text-purple-600',
  table:     'bg-orange-50 text-orange-600',
  scorecard: 'bg-amber-50 text-amber-600',
}

// ─── Category sidebar ─────────────────────────────────────────────────────────

const ALL = 'All'
const CATEGORIES = [ALL, ...ATTRIBUTE_GROUPS.map(g => g.label)]

function CategorySidebar({
  active,
  onSelect,
  counts,
}: {
  active: string
  onSelect: (c: string) => void
  counts: Record<string, number>
}) {
  return (
    <aside className="w-[196px] shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden">
      {/* Header — aligns with h-14 navbar */}
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <span className="text-sm font-semibold text-sidebar-foreground">Charts</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
              active === cat
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-sidebar-foreground hover:bg-white/70'
            )}
          >
            <span className="truncate">{cat}</span>
            <span className={cn(
              'text-xs tabular-nums ml-1 shrink-0',
              active === cat ? 'text-gray-500' : 'text-muted-foreground'
            )}>
              {counts[cat] ?? 0}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

// ─── Chart card ───────────────────────────────────────────────────────────────

function ChartCard({
  chart,
  selected,
  compact,
  onClick,
}: {
  chart: LibraryChart
  selected: boolean
  compact: boolean
  onClick: () => void
}) {
  const meta = CHART_TYPES.find(t => t.type === chart.type)!
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left rounded-xl border transition-all overflow-hidden bg-white w-full',
        selected
          ? 'border-primary ring-1 ring-primary shadow-md'
          : 'border-border hover:border-gray-300 hover:shadow-sm'
      )}
    >
      <div className={cn('px-3 pt-3 pb-1', compact && 'px-2 pt-2')}>
        <ChartRenderer widget={chart.widget} data={chart.data} height={compact ? 100 : 130} />
      </div>
      <div className={cn('px-3 pb-3 pt-1', compact && 'px-2 pb-2')}>
        <p className="text-xs font-medium text-gray-900 leading-snug line-clamp-2">{chart.title}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
            TYPE_COLOR[chart.type]
          )}>
            <meta.Icon size={9} />
            {meta.label}
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Detail panel — mirrors WidgetPropertiesPanel from DashboardBuilderPage ───

function DetailPanel({ chart, onClose }: { chart: LibraryChart; onClose: () => void }) {
  const { audiences } = useAudienceStore()

  const [activeType, setActiveType] = useState<WidgetType>(chart.type)
  const [audienceId, setAudienceId]  = useState<string>('')
  const [crossAttr,  setCrossAttr]   = useState<string>('')

  useEffect(() => {
    setActiveType(chart.type)
    setAudienceId('')
    setCrossAttr('')
  }, [chart.id, chart.type])

  useEffect(() => {
    if (crossAttr) setActiveType('table')
  }, [crossAttr])

  const { widget, data } = useMemo(() => {
    const type = crossAttr ? 'table' : activeType
    const data = generateChartData(type, false, crossAttr || undefined)
    const widget: Widget = {
      ...chart.widget,
      type,
      audienceId: audienceId || 'all',
      crossDimensionLabel: crossAttr || undefined,
      crossDimensionId:    crossAttr || undefined,
    }
    return { widget, data }
  }, [chart.widget, activeType, audienceId, crossAttr])

  const isCrossTab   = Boolean(crossAttr)
  const effectiveType = isCrossTab ? 'table' : activeType
  const selectedAudience = audiences.find(a => a.id === audienceId)

  return (
    <aside className="relative shrink-0 border-l border-border flex flex-col bg-sidebar overflow-hidden h-full w-[288px]">

      {/* Header — identical to WidgetPropertiesPanel */}
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
            <Chip label={chart.title} />
          </div>

          {/* Columns — cross tab dimension */}
          <div>
            <SectionLabel>Columns</SectionLabel>
            {crossAttr ? (
              <Chip label={crossAttr} variant="primary" onRemove={() => setCrossAttr('')} />
            ) : (
              <select
                value=""
                onChange={e => { if (e.target.value) setCrossAttr(e.target.value) }}
                className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground cursor-pointer appearance-none"
              >
                <option value="">+ Add column</option>
                {ATTRIBUTE_GROUPS.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.attrs.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

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

        {/* Chart type — same grid as WidgetPropertiesPanel */}
        <div className="p-4 space-y-5 border-b border-border">
          <FieldGroup label="Chart type">
            <div className="grid grid-cols-5 gap-1">
              {CHART_TYPES.map(({ type, label, Icon }) => {
                const isActive   = effectiveType === type
                const isDisabled = isCrossTab && type !== 'table'
                return (
                  <button
                    key={type}
                    onClick={() => { if (!isDisabled) { setCrossAttr(''); setActiveType(type) } }}
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
          </FieldGroup>
        </div>

        {/* Chart preview */}
        <div className="p-4">
          <ChartRenderer widget={widget} data={data} height={260} />
        </div>

      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartsPage() {
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [selected, setSelected] = useState<LibraryChart | null>(null)

  const counts: Record<string, number> = { [ALL]: CHART_LIBRARY.length }
  ATTRIBUTE_GROUPS.forEach(g => {
    counts[g.label] = CHART_LIBRARY.filter(c => c.category === g.label).length
  })

  const filtered =
    activeCategory === ALL
      ? CHART_LIBRARY
      : CHART_LIBRARY.filter(c => c.category === activeCategory)

  function handleSelect(chart: LibraryChart) {
    setSelected(prev => (prev?.id === chart.id ? null : chart))
  }

  function handleCategorySelect(cat: string) {
    setActiveCategory(cat)
    setSelected(null)
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* Category sidebar */}
      <CategorySidebar
        active={activeCategory}
        onSelect={handleCategorySelect}
        counts={counts}
      />

      {/* Chart grid */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header — same h-14 as sidebar and detail panel */}
        <div className="h-14 flex items-center px-6 border-b border-border shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {activeCategory === ALL ? 'All charts' : activeCategory}
            </h1>
            <p className="text-xs text-muted-foreground">
              {filtered.length} chart{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className={cn('grid gap-4', selected ? 'grid-cols-2' : 'grid-cols-3')}>
            {filtered.map(chart => (
              <ChartCard
                key={chart.id}
                chart={chart}
                selected={selected?.id === chart.id}
                compact={!!selected}
                onClick={() => handleSelect(chart)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel chart={selected} onClose={() => setSelected(null)} />
      )}

    </div>
  )
}
