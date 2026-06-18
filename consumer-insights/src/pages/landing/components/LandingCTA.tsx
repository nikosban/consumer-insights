import { cn } from '@/lib/utils'

type CTAProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  className?: string
}

/**
 * Primary landing CTA — dark fill, border beam, arrow slide.
 * Pill shape, beam rotates via @property --beam-angle + conic-gradient on ::before.
 */
export function CTAPrimary({ children, className, ...rest }: CTAProps) {
  return (
    <button
      {...rest}
      className={cn(
        'landing-cta-primary',
        'group relative inline-flex items-center gap-2 px-6 py-3 rounded-full',
        'bg-foreground text-background text-sm font-medium',
        'cursor-pointer select-none whitespace-nowrap',
        'transition-colors duration-150',
        'hover:bg-foreground/85',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Secondary landing CTA — outlined, border darkens on hover, arrow slide.
 */
export function CTASecondary({ children, className, ...rest }: CTAProps) {
  return (
    <button
      {...rest}
      className={cn(
        'relative inline-flex items-center gap-2 px-6 py-3 rounded-full',
        'bg-transparent text-foreground text-sm font-medium border border-border',
        'cursor-pointer select-none whitespace-nowrap',
        'transition-[border-color,color] duration-200',
        'hover:border-foreground/40 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Arrow span — slides 3px right on parent hover.
 */
export function CTAArrow() {
  return (
    <span
      className="inline-block transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
      aria-hidden
    >
      →
    </span>
  )
}
