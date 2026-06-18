import { IconCrown, IconUsers, IconPlus } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { BenchmarkPanelData } from '@/types'

export function BenchmarkPanel({ panel, onCreateDraft }: { panel: BenchmarkPanelData; onCreateDraft: () => void }) {
  const maxIntent = Math.max(...panel.segments.map(s => s.intentScore))

  return (
    <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
        <span className="text-[11px] font-semibold text-secondary-foreground">Audience segments</span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        {panel.segments.map(seg => (
          <div key={seg.name} className={cn('p-3 flex flex-col gap-2', seg.isBestMatch && 'bg-primary/3')}>
            <div className="flex items-start justify-between gap-1 min-h-[32px]">
              <span className={cn('text-xs font-semibold leading-tight', seg.isBestMatch ? 'text-primary' : 'text-foreground')}>
                {seg.name}
              </span>
              {seg.isBestMatch && (
                <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 leading-none">
                  <IconCrown size={8} strokeWidth={2} />
                  Best
                </span>
              )}
            </div>

            <div>
              <p className="text-[11px] text-secondary-foreground">{seg.ageRange}</p>
              <p className="text-[10px] text-muted-foreground/70 leading-snug mt-0.5">{seg.descriptor}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] text-secondary-foreground">EV purchase intent</span>
                <span className={cn('text-sm font-semibold', seg.isBestMatch ? 'text-primary' : 'text-foreground')}>
                  {seg.intentScore}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', seg.isBestMatch ? 'bg-primary' : 'bg-muted-foreground/40')}
                  style={{ width: `${(seg.intentScore / maxIntent) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-secondary-foreground">
              <IconUsers size={9} strokeWidth={2} />
              {seg.universe}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-secondary-foreground mb-2">{panel.nudge}</p>
        <button
          onClick={onCreateDraft}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <IconPlus size={11} strokeWidth={2} />
          Create Audience Draft
        </button>
      </div>
    </div>
  )
}
