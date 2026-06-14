import { cn } from '@/lib/utils'

interface ScreenFrameProps {
  children: React.ReactNode
  className?: string
  dark?: boolean
}

export function ScreenFrame({ children, className, dark = false }: ScreenFrameProps) {
  return (
    <div
      className={cn('rounded-xl overflow-hidden', className)}
      style={{
        boxShadow: dark
          ? '0px 4px 8px rgba(0,0,0,0.12), 0px 16px 32px rgba(0,0,0,0.16), 0px 32px 64px rgba(0,0,0,0.20)'
          : '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 4px 8px rgba(0,0,0,0.04), 0px 16px 32px rgba(0,0,0,0.06), 0px 32px 64px rgba(0,0,0,0.08)',
      }}
    >
      {/* Traffic-light chrome bar */}
      <div className="h-8 flex items-center px-3 gap-1.5 bg-muted border-b border-border shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
      </div>
      {children}
    </div>
  )
}
