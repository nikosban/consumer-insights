import * as React from 'react'
import { cn } from '@/lib/utils'

export type CheckboxSize = 'sm' | 'default'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?:          CheckboxSize
  indeterminate?: boolean
  label?:         string
  description?:   string
}

const boxSize: Record<CheckboxSize, string> = {
  sm:      'w-3 h-3',
  default: 'w-[14px] h-[14px]',
}

const labelText: Record<CheckboxSize, string> = {
  sm:      'text-xs',
  default: 'text-sm',
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = 'default', indeterminate = false, label, description, className, disabled, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current!)
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    const control = (
      // group lets inner elements react to the hidden input state via group-has-*
      <span className="group relative inline-flex items-center justify-center shrink-0">
        <input
          ref={innerRef}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />

        {/* Visual box */}
        <span
          aria-hidden="true"
          className={cn(
            'rounded flex items-center justify-center transition-all',
            'border border-border bg-background',
            'peer-focus-visible:shadow-[var(--field-shadow-focus)]',
            'peer-checked:bg-primary peer-checked:border-primary',
            'peer-indeterminate:bg-primary peer-indeterminate:border-primary',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            boxSize[size],
          )}
        >
          {/* Checkmark — visible when checked but NOT indeterminate */}
          <svg
            aria-hidden="true"
            className={cn(
              'hidden group-has-[:checked]:group-has-[:not(:indeterminate)]:block',
              'text-primary-foreground',
              size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            )}
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1.5,5 4,7.5 8.5,2.5" />
          </svg>

          {/* Indeterminate dash */}
          <svg
            aria-hidden="true"
            className={cn(
              'hidden group-has-[:indeterminate]:block',
              'text-primary-foreground',
              size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            )}
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="2" y1="5" x2="8" y2="5" />
          </svg>
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
Checkbox.displayName = 'Checkbox'
