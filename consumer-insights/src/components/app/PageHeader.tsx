import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('h-14 border-b border-border flex items-center px-4 gap-3 bg-background shrink-0', className)}>
      <div className="flex-1 min-w-0">{title}</div>
      {actions && (
        <div className="ml-auto flex items-center gap-2" data-toolbar>
          {actions}
        </div>
      )}
    </div>
  )
}
