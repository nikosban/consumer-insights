import { cn } from '@/lib/utils'

type SegmentedControlProps<T extends string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex rounded-md border border-border overflow-hidden text-xs font-semibold shrink-0', className)}>
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'px-2.5 py-1 transition-colors',
            i > 0 && 'border-l border-border',
            value === option
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-secondary-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
