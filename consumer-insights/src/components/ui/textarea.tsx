import * as React from 'react'
import { cn } from '@/lib/utils'
import { FormField, fieldShadowDirect, fieldRounded, fieldText, fieldPadX } from '@/components/ui/input'
import type { FieldSize, FieldState } from '@/components/ui/input'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?:   FieldSize
  state?:  FieldState
  label?:  string
  helper?: string
  error?:  string
}

const minH: Record<FieldSize, string> = {
  sm:      'min-h-[64px]',
  default: 'min-h-[80px]',
  lg:      'min-h-[96px]',
}

const paddingY: Record<FieldSize, string> = {
  sm:      'py-1.5',
  default: 'py-2',
  lg:      'py-2.5',
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'default', state = 'default', label, helper, error, className, disabled, ...props }, ref) => {
    const resolvedState: FieldState = error ? 'error' : state

    const el = (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full min-w-0 bg-background text-foreground outline-none resize-none transition-shadow',
          'placeholder:text-muted-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          '[field-sizing:content]',
          fieldRounded[size],
          fieldText[size],
          fieldPadX[size],
          paddingY[size],
          minH[size],
          fieldShadowDirect[resolvedState],
          className,
        )}
        {...props}
      />
    )

    if (label || helper || error) {
      return (
        <FormField label={label} helper={helper} error={error}>
          {el}
        </FormField>
      )
    }

    return el
  },
)
Textarea.displayName = 'Textarea'
