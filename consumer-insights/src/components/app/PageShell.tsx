import { cn } from '@/lib/utils'

type PageShellProps = {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('p-6 max-w-4xl mx-auto', className)}>
      {children}
    </div>
  )
}
