import { cn } from '@/lib/utils'

type FieldGroupProps = {
  label: string
  children: React.ReactNode
  className?: string
}

export function FieldGroup({ label, children, className }: FieldGroupProps) {
  return (
    <div className={cn(className)}>
      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</label>
      {children}
    </div>
  )
}
