import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { IconLayoutDashboard, IconCheck, IconDownload, IconCopy, IconExternalLink } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'
import ChartRenderer from '@/components/charts/ChartRenderer'
import type { DataWidgetCardData, Widget } from '@/types'
import type { WidgetType } from '@/types'
import { VizSwitcher } from './VizSwitcher'
import { DashboardPickerDropdown } from './DashboardPickerDropdown'
import { exportElAsPng, copyElAsPng } from './helpers'

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
    await copyElAsPng(cardRef.current)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={cardRef} className="w-full rounded-2xl rounded-bl-sm border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground leading-tight">{card.title}</h4>
            <p className="text-[11px] text-secondary-foreground mt-0.5">{card.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <VizSwitcher value={vizType} onChange={setVizType} />
            <button
              title="Export PNG"
              onClick={() => cardRef.current && exportElAsPng(cardRef.current, card.title)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconDownload size={12} strokeWidth={2} />
            </button>
            <button
              title={copied ? 'Copied!' : 'Copy image'}
              onClick={handleCopy}
              className={cn('w-6 h-6 flex items-center justify-center rounded transition-colors', copied ? 'text-green-600' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}
            >
              {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 pb-1" style={{ height: 140 }}>
        <ChartRenderer widget={fakeWidget} data={card.chartData} height={140} />
      </div>

      <div className="px-4 pb-2">
        <span className="text-[10px] text-muted-foreground">Source: {card.source}</span>
      </div>

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
          <button
            onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
            className="mt-1.5 w-full flex items-center justify-center gap-1 text-xs text-green-700 hover:text-green-900 transition-colors"
          >
            View dashboard <IconExternalLink size={10} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}

export function WidgetCluster({ widgets }: { widgets: DataWidgetCardData[] }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      {widgets.map((card, i) => (
        <WidgetClusterCard key={i} card={card} index={i} />
      ))}
    </div>
  )
}
