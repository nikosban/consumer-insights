import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChipProps = {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'primary'
  className?: string
}

export function Chip({ label, onRemove, variant = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 h-7 rounded-md text-xs max-w-full',
        variant === 'default' && 'bg-muted text-foreground',
        variant === 'primary' && 'bg-primary/8 border border-primary/20 text-primary',
        className
      )}
    >
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
