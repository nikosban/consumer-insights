import * as React from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

// ─── Shared types ─────────────────────────────────────────────────────────────

export type FieldSize  = 'sm' | 'default' | 'lg'
export type FieldState = 'default' | 'error' | 'success'

// ─── Shared tokens (consumed by Input, Textarea, Select) ──────────────────────

export const fieldHeight: Record<FieldSize, string> = {
  sm:      'h-7',
  default: 'h-8',
  lg:      'h-9',
}

export const fieldRounded: Record<FieldSize, string> = {
  sm:      'rounded-md',
  default: 'rounded-lg',
  lg:      'rounded-lg',
}

export const fieldText: Record<FieldSize, string> = {
  sm:      'text-xs',
  default: 'text-sm',
  lg:      'text-sm',
}

export const fieldPadX: Record<FieldSize, string> = {
  sm:      'px-2',
  default: 'px-2.5',
  lg:      'px-3',
}

// Shadow classes on the outer wrapper div (focus-within triggers focus state)
export const fieldShadowWrapper: Record<FieldState, string> = {
  default: 'shadow-[var(--field-shadow)] focus-within:shadow-[var(--field-shadow-focus)]',
  error:   'shadow-[var(--field-shadow-error)] focus-within:shadow-[var(--field-shadow-error-focus)]',
  success: 'shadow-[var(--field-shadow-success)] focus-within:shadow-[var(--field-shadow-success-focus)]',
}

// Shadow classes directly on an element (focus-visible triggers focus state) — includes inset
export const fieldShadowDirect: Record<FieldState, string> = {
  default: 'shadow-[var(--field-inset),var(--field-shadow)] focus-visible:shadow-[var(--field-inset),var(--field-shadow-focus)]',
  error:   'shadow-[var(--field-inset),var(--field-shadow-error)] focus-visible:shadow-[var(--field-inset),var(--field-shadow-error-focus)]',
  success: 'shadow-[var(--field-inset),var(--field-shadow-success)] focus-visible:shadow-[var(--field-inset),var(--field-shadow-success-focus)]',
}

// Icon size to pair with each field size
export const fieldIconSize: Record<FieldSize, number> = {
  sm: 12, default: 13, lg: 14,
}

// ─── FormField — label + children + helper/error ──────────────────────────────

export function FormField({
  label, helper, error, children, className,
}: {
  label?: string
  helper?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-medium text-foreground">{label}</label>
      )}
      {children}
      {(error || helper) && (
        <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?:     FieldSize
  state?:    FieldState
  /** Icon or element rendered inside the left edge */
  leading?:  React.ReactNode
  /** Icon or element rendered inside the right edge (hidden when search has a value) */
  trailing?: React.ReactNode
  /** Short text attached to the left of the field with a divider */
  prefix?:   string
  /** Short text attached to the right of the field with a divider */
  suffix?:   string
  /** Label rendered above the field */
  label?:    string
  /** Helper text rendered below the field */
  helper?:   string
  /** Error message rendered below (also sets state to "error") */
  error?:    string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size    = 'default',
      state   = 'default',
      leading,
      trailing,
      prefix,
      suffix,
      label,
      helper,
      error,
      type,
      value,
      onChange,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const resolvedState: FieldState = error ? 'error' : state
    const isSearch  = type === 'search'
    const hasValue  = value != null ? String(value).length > 0 : false
    const showClear = isSearch && hasValue
    const iconSize  = fieldIconSize[size]

    const leadingPad:  Record<FieldSize, string> = { sm: 'pl-6',   default: 'pl-8',   lg: 'pl-9'  }
    const trailingPad: Record<FieldSize, string> = { sm: 'pr-6',   default: 'pr-8',   lg: 'pr-9'  }
    const leadingOff:  Record<FieldSize, string> = { sm: 'left-2', default: 'left-2.5', lg: 'left-3' }
    const trailingOff: Record<FieldSize, string> = { sm: 'right-2', default: 'right-2.5', lg: 'right-3' }

    const inputEl = (
      <input
        ref={ref}
        type={isSearch ? 'text' : type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'flex-1 min-w-0 bg-transparent outline-none border-0 text-foreground placeholder:text-muted-foreground',
          'disabled:pointer-events-none',
          'shadow-[var(--field-inset)]',
          fieldText[size],
          fieldPadX[size],
          leading  && leadingPad[size],
          (trailing || showClear) && trailingPad[size],
          prefix   && '!pl-0',
          suffix   && '!pr-0',
        )}
        {...props}
      />
    )

    const wrapper = (
      <div
        className={cn(
          'relative flex items-center bg-background overflow-hidden transition-shadow',
          fieldHeight[size],
          fieldRounded[size],
          fieldShadowWrapper[resolvedState],
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
      >
        {/* Inline prefix */}
        {prefix && (
          <span className={cn(
            'shrink-0 flex items-center self-stretch bg-muted text-secondary-foreground border-r border-[rgba(0,0,0,0.10)] dark:border-[rgba(255,255,255,0.08)]',
            fieldPadX[size], fieldText[size],
          )}>
            {prefix}
          </span>
        )}

        {/* Leading icon */}
        {leading && (
          <span className={cn(
            'absolute pointer-events-none text-muted-foreground [&>svg]:shrink-0',
            leadingOff[size],
          )}>
            {leading}
          </span>
        )}

        {inputEl}

        {/* Clear button (search) */}
        {showClear ? (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={e => {
              e.preventDefault()
              onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
            }}
            className={cn(
              'absolute flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors',
              trailingOff[size],
            )}
          >
            <IconX size={iconSize} strokeWidth={2} />
          </button>
        ) : trailing ? (
          <span className={cn(
            'absolute pointer-events-none text-muted-foreground [&>svg]:shrink-0',
            trailingOff[size],
          )}>
            {trailing}
          </span>
        ) : null}

        {/* Inline suffix */}
        {suffix && (
          <span className={cn(
            'shrink-0 flex items-center self-stretch bg-muted text-secondary-foreground border-l border-[rgba(0,0,0,0.10)] dark:border-[rgba(255,255,255,0.08)]',
            fieldPadX[size], fieldText[size],
          )}>
            {suffix}
          </span>
        )}
      </div>
    )

    if (label || helper || error) {
      return (
        <FormField label={label} helper={helper} error={error}>
          {wrapper}
        </FormField>
      )
    }

    return wrapper
  },
)
Input.displayName = 'Input'
