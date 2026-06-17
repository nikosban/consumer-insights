import { Children } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type BreadcrumbItemProps = {
  children: React.ReactNode
  current?: boolean
  onClick?: () => void
  className?: string
}

export function BreadcrumbItem({ children, current, onClick, className }: BreadcrumbItemProps) {
  if (current) {
    return (
      <span className={cn('text-sm font-medium text-foreground truncate max-w-48', className)}>
        {children}
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('text-sm text-secondary-foreground hover:text-foreground transition-colors whitespace-nowrap', className)}
    >
      {children}
    </button>
  )
}

type BreadcrumbProps = {
  children: React.ReactNode
  className?: string
}

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  const items = Children.toArray(children)
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 min-w-0', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1 min-w-0">
          {item}
          {i < items.length - 1 && (
            <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" strokeWidth={2} />
          )}
        </span>
      ))}
    </nav>
  )
}
