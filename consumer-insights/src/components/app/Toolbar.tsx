import { cn } from '@/lib/utils'

type ToolbarProps = {
  children: React.ReactNode
  className?: string
}

type ToolbarActionsProps = {
  children: React.ReactNode
  className?: string
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn('h-14 border-b border-border flex items-center px-4 gap-3 bg-background shrink-0', className)}>
      {children}
    </div>
  )
}

export function ToolbarActions({ children, className }: ToolbarActionsProps) {
  return (
    <div className={cn('ml-auto flex items-center gap-2', className)} data-toolbar>
      {children}
    </div>
  )
}
