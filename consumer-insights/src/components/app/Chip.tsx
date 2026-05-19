import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChipProps = {
  label: string
  onRemove?: () => void
  onClick?: () => void
  variant?: 'default' | 'primary' | 'suggestion'
  className?: string
}

export function Chip({ label, onRemove, onClick, variant = 'default', className }: ChipProps) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 h-7 rounded-md text-xs max-w-full',
        variant === 'default' && 'bg-muted text-foreground',
        variant === 'primary' && 'bg-primary/8 border border-primary/20 text-primary',
        variant === 'suggestion' && 'rounded-full border border-border bg-white text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
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
    </Tag>
  )
}
