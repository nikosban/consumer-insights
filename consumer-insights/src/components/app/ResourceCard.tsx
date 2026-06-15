import { cn } from '@/lib/utils'

type ResourceCardProps = {
  icon?: React.ReactNode
  title: string
  /** Left side of the meta row — important contextual info (e.g. "3 widgets", "3 sections · Dashboard name") */
  meta?: React.ReactNode
  /** Right side of the meta row — date or secondary timestamp */
  date?: string
  actions?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ResourceCard({ icon, title, meta, date, actions, onClick, className }: ResourceCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-[8px] overflow-hidden bg-muted',
        'shadow-[0_0_0_1px_var(--border)]',
        onClick && 'cursor-pointer hover:shadow-[0_0_0_1px_hsl(var(--ring)/0.4),0_2px_4px_0_hsla(0,0%,0%,0.08)]',
        'transition-shadow',
        className
      )}
    >
      {/* Header — card surface elevated row */}
      <div className="flex items-center gap-3 p-2 bg-card rounded-[6px] shadow-[0_0_0_1px_var(--border)]">
        {/* Icon */}
        {icon !== undefined && (
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/8 text-primary shrink-0 [&>svg]:h-2.5 [&>svg]:w-2.5">
            {icon}
          </div>
        )}

        {/* Title */}
        <p className="text-sm font-semibold text-foreground flex-1 min-w-0 truncate">{title}</p>

        {/* Actions */}
        {actions && (
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={e => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Meta row — gray-25 background, left info / right date */}
      {(meta || date) && (
        <div className="flex items-center justify-between gap-4 px-2 py-2">
          {meta ? (
            <span className="text-xs text-secondary-foreground truncate">{meta}</span>
          ) : (
            <span />
          )}
          {date && (
            <span className="text-xs text-muted-foreground shrink-0">{date}</span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Small square icon button used in ResourceCard actions.
 * Replaces the hand-rolled 7×7 bordered buttons scattered across pages.
 */
type IconBtnProps = {
  icon: React.ReactNode
  label: string
  onClick: (e: React.MouseEvent) => void
  destructive?: boolean
  className?: string
}

export function IconBtn({ icon, label, onClick, destructive = false, className }: IconBtnProps) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background',
        'text-muted-foreground transition-colors',
        'opacity-0 group-hover:opacity-100',
        '[&>svg]:h-3 [&>svg]:w-3',
        destructive
          ? 'hover:bg-destructive/8 hover:border-destructive/30 hover:text-destructive'
          : 'hover:bg-accent hover:text-foreground',
        className
      )}
    >
      {icon}
    </button>
  )
}
