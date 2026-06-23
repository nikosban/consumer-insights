import { memo, useEffect, useRef, useState } from 'react'
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

export const DataWidgetCard = memo(function DataWidgetCard({ card }: { card: DataWidgetCardData }) {
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
    await copyElAsPng(cardRef.current)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

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
      {/* Header */}
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
              <DashboardPickerDropdown
                dashboards={dashboards}
                onSelect={(id, name) => { setDashPickerOpen(false); handleAddToDashboard(id, name) }}
                label="Select dashboard"
                direction="down"
              />
            )}
          </div>
        </div>

        {isMultiValue && (
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-[11px] text-muted-foreground leading-none mb-1">Peak</p>
              <p className="text-sm font-semibold text-foreground leading-none">
                {peakVal}% <span className="text-xs font-normal text-secondary-foreground">· {peakLabel}</span>
              </p>
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

      {/* Chart */}
      <div className="px-3 pt-3 pb-2" style={{ height: 220 }}>
        <ChartRenderer widget={fakeWidget} data={card.chartData} height={220} />
      </div>

      {/* Source */}
      {card.source && (
        <div className="px-3 py-1.5 border-t border-border flex items-center gap-1">
          <span className="text-[11px] text-muted-foreground">Source: </span>
          <span className="text-[11px] font-medium text-secondary-foreground">{card.source}</span>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border flex items-center gap-1">
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
        {addedToDash && (
          <div className="flex-1 flex items-center justify-between ml-2">
            <span className="text-xs text-green-700">Added to <span className="font-medium">{addedToDash.name}</span></span>
            <button
              onClick={() => navigate(`/dashboards/${addedToDash.id}`)}
              className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-900 transition-colors shrink-0"
            >
              Go there <IconExternalLink size={10} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
