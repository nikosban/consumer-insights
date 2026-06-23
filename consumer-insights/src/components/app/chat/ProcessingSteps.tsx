import { memo, useState } from 'react'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { ProcessingStep } from '@/types'

export const ProcessingStepsDisplay = memo(function ProcessingStepsDisplay({ steps }: { steps: ProcessingStep[] }) {
  const [expanded, setExpanded] = useState(false)
  const allDone = steps.every(s => s.status === 'done')
  const activeStep = steps.find(s => s.status === 'active')
  const doneCount = steps.filter(s => s.status === 'done').length

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <span className="text-[11px] font-semibold text-secondary-foreground flex-1">
          {allDone
            ? `${doneCount} steps completed`
            : activeStep
              ? activeStep.label
              : 'Processing'}
        </span>
        <IconChevronDown
          size={12}
          className={cn('text-muted-foreground transition-transform shrink-0', expanded && 'rotate-180')}
          strokeWidth={2}
        />
      </button>

      {expanded && (
        <div className="px-3 py-2 space-y-1.5 border-t border-border">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn('flex items-center gap-2 text-xs transition-opacity duration-300', step.status === 'pending' ? 'opacity-30' : 'opacity-100')}
            >
              <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                {step.status === 'done' && <IconCheck size={11} className="text-green-600" strokeWidth={2} />}
                {step.status === 'active' && (
                  <svg className="animate-spin h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {step.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />}
              </div>
              <span className={cn(
                'shrink-0 font-medium w-36',
                step.status === 'done' ? 'text-muted-foreground' : step.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.label}
              </span>
              <span className={cn('truncate', step.status === 'active' ? 'text-primary' : 'text-muted-foreground')}>
                {step.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
