import * as React from 'react'
import { cn } from '@/lib/utils'

export type RadioSize = 'sm' | 'default'

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?:        RadioSize
  label?:       string
  description?: string
}

export interface RadioGroupProps {
  name:       string
  value?:     string
  onChange?:  (value: string) => void
  size?:      RadioSize
  children:   React.ReactNode
  className?: string
}

const boxSize: Record<RadioSize, string> = {
  sm:      'w-3 h-3',
  default: 'w-[14px] h-[14px]',
}

const dotSize: Record<RadioSize, string> = {
  sm:      'w-1.5 h-1.5',
  default: 'w-2 h-2',
}

const labelText: Record<RadioSize, string> = {
  sm:      'text-xs',
  default: 'text-sm',
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface Ctx { name: string; value?: string; onChange?: (v: string) => void; size?: RadioSize }
const RadioGroupContext = React.createContext<Ctx | null>(null)

export function RadioGroup({ name, value, onChange, size = 'default', children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, size }}>
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// ─── Radio ────────────────────────────────────────────────────────────────────

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ size: sizeProp, label, description, className, disabled, value, onChange, ...props }, ref) => {
    const ctx        = React.useContext(RadioGroupContext)
    const size       = sizeProp ?? ctx?.size ?? 'default'
    const groupName  = ctx?.name ?? props.name
    const checked    = ctx && value !== undefined ? ctx.value === value : props.checked
    const handleChange = ctx?.onChange
      ? () => { if (value !== undefined) ctx.onChange!(String(value)) }
      : onChange

    const control = (
      // group lets inner elements react to the hidden input state via group-has-*
      <span className="group relative inline-flex items-center justify-center shrink-0">
        <input
          ref={ref}
          type="radio"
          name={groupName}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />

        {/* Visual circle */}
        <span
          aria-hidden="true"
          className={cn(
            'rounded-full flex items-center justify-center transition-all',
            'border border-border bg-background',
            'peer-focus-visible:shadow-[var(--field-shadow-focus)]',
            'peer-checked:bg-primary peer-checked:border-primary',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            boxSize[size],
          )}
        >
          {/* Inner dot — visible when checked via group-has-[:checked] */}
          <span
            aria-hidden="true"
            className={cn(
              'rounded-full bg-primary-foreground transition-transform scale-0',
              'group-has-[:checked]:scale-100',
              dotSize[size],
            )}
          />
        </span>
      </span>
    )

    if (!label && !description) {
      return <span className={cn('inline-flex', className)}>{control}</span>
    }

    return (
      <label
        className={cn(
          'inline-flex items-start gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        {control}
        <span className="flex flex-col gap-0.5">
          {label && (
            <span className={cn('font-medium text-foreground leading-none', labelText[size])}>
              {label}
            </span>
          )}
          {description && (
            <span className={cn('text-muted-foreground leading-snug', labelText[size])}>
              {description}
            </span>
          )}
        </span>
      </label>
    )
  },
)
Radio.displayName = 'Radio'
