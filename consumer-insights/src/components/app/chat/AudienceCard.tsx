import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { IconDownload, IconCopy, IconCheck, IconUsers, IconGlobe, IconLayoutDashboard, IconExternalLink, IconArrowUpRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'
import type { AudienceCardData, Audience, Widget } from '@/types'
import { DashboardPickerDropdown } from './DashboardPickerDropdown'
import { exportElAsPng, copyElAsPng } from './helpers'

export function AudienceCard({ card }: { card: AudienceCardData }) {
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
    await copyElAsPng(cardRef.current)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={cardRef} className="max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
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
            <button
              title="Export PNG"
              onClick={() => cardRef.current && exportElAsPng(cardRef.current, card.name)}
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

      {/* Body */}
      <div className="grid grid-cols-2 divide-x divide-border">
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

      {/* CTAs */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToLibrary}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors active:scale-[0.98]',
              saved ? 'border border-green-200 bg-green-50 text-green-700 cursor-default' : 'bg-primary text-white hover:bg-primary/90'
            )}
          >
            {saved ? <IconCheck size={11} strokeWidth={2} /> : <IconUsers size={11} strokeWidth={2} />}
            {saved ? 'Audience created' : 'Create draft audience'}
          </button>

          <div ref={dashRef} className="relative flex-1">
            <button
              onClick={() => !addedToDash && setDashPickerOpen(o => !o)}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 h-8 rounded-lg border text-xs font-medium transition-colors',
                addedToDash ? 'border-green-200 bg-green-50 text-green-700 cursor-default' : 'border-border bg-background text-foreground hover:bg-accent'
              )}
            >
              {addedToDash ? <IconCheck size={11} strokeWidth={2} /> : <IconLayoutDashboard size={11} strokeWidth={2} />}
              {addedToDash ? 'Added' : 'Add to Dashboard'}
            </button>
            {dashPickerOpen && (
              <DashboardPickerDropdown
                dashboards={dashboards}
                onSelect={(id, name) => { setDashPickerOpen(false); handleAddToDashboard(id, name) }}
                label="Select dashboard"
                direction="up"
              />
            )}
          </div>

          <button
            onClick={() => document.dispatchEvent(new CustomEvent('focus-chat-input'))}
            className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            Refine
          </button>
        </div>

        <button
          onClick={handleOpenBuilder}
          className="w-full flex items-center justify-center gap-1 h-7 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Open in Audience Builder
          <IconArrowUpRight size={11} className="shrink-0" strokeWidth={2} />
        </button>

        {addedToDash && (
          <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-xs text-green-800">Added to <span className="font-medium">{addedToDash.name}</span></span>
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
}
