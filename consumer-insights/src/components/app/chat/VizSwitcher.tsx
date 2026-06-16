import { IconChartBar, IconChartLine, IconTable } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { WidgetType } from '@/types'

const VIZ_TYPES: { type: WidgetType; Icon: React.ElementType; label: string }[] = [
  { type: 'bar',   Icon: IconChartBar,  label: 'Bar'   },
  { type: 'line',  Icon: IconChartLine, label: 'Line'  },
  { type: 'table', Icon: IconTable,     label: 'Table' },
]

export function VizSwitcher({ value, onChange }: { value: WidgetType; onChange: (t: WidgetType) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
      {VIZ_TYPES.map(({ type, Icon, label }) => (
        <button
          key={type}
          title={label}
          onClick={() => onChange(type)}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded transition-colors',
            value === type ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon size={12} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}
