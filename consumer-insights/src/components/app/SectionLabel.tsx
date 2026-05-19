import { cn } from '@/lib/utils'

type SectionLabelProps = {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn('text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2', className)}>
      {children}
    </p>
  )
}
