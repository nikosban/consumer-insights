import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { FormField, fieldHeight, fieldRounded, fieldText, fieldShadowWrapper } from '@/components/ui/input'
import type { FieldSize, FieldState } from '@/components/ui/input'

// ─── Primitive compound components ───────────────────────────────────────────

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = 'default',
  state = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & { size?: FieldSize; state?: FieldState }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex w-full items-center justify-between gap-1.5 bg-background text-foreground',
        'pl-2.5 pr-2 whitespace-nowrap outline-none transition-shadow select-none',
        'data-placeholder:text-muted-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        fieldHeight[size],
        fieldRounded[size],
        fieldText[size],
        fieldShadowWrapper[state],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<IconChevronDown size={12} strokeWidth={2} className="text-muted-foreground shrink-0" />}
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36',
            'origin-(--transform-origin) overflow-x-hidden overflow-y-auto',
            'rounded-lg bg-popover text-popover-foreground py-1',
            'border border-border shadow-[0_1px_2px_rgba(0,0,0,.08),0_6px_14px_-4px_rgba(0,0,0,.14)]',
            'duration-100',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('px-3 py-1 text-xs font-semibold text-muted-foreground uppercase', className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 px-3 py-2 text-sm text-foreground',
        'outline-none select-none transition-colors',
        'hover:bg-accent focus:bg-accent',
        'data-disabled:pointer-events-none data-disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className="pointer-events-none ml-auto flex items-center" />}
      >
        <IconCheck size={12} strokeWidth={2} className="text-primary" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn('top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1', className)}
      {...props}
    >
      <IconChevronUp size={12} strokeWidth={2} className="text-muted-foreground" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn('bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1', className)}
      {...props}
    >
      <IconChevronDown size={12} strokeWidth={2} className="text-muted-foreground" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

// ─── SelectField — simple props-based API for form use ────────────────────────

export type SelectOption = { value: string; label: string; disabled?: boolean }
export type SelectGroup  = { group: string; items: SelectOption[] }

export interface SelectFieldProps {
  value?:       string
  onChange?:    (v: string) => void
  options:      SelectOption[] | SelectGroup[]
  placeholder?: string
  size?:        FieldSize
  state?:       FieldState
  leading?:     React.ReactNode
  disabled?:    boolean
  label?:       string
  helper?:      string
  error?:       string
  className?:   string
}

function isGrouped(opts: SelectOption[] | SelectGroup[]): opts is SelectGroup[] {
  return opts.length > 0 && 'group' in opts[0]
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  size    = 'default',
  state   = 'default',
  leading,
  disabled,
  label,
  helper,
  error,
  className,
}: SelectFieldProps) {
  const resolvedState: FieldState = error ? 'error' : state

  const trigger = (
    <SelectTrigger size={size} state={resolvedState} disabled={disabled} className={className}>
      {leading && (
        <span className="text-muted-foreground shrink-0 [&>svg]:shrink-0 pl-0.5">{leading}</span>
      )}
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  )

  const content = (
    <SelectContent>
      {isGrouped(options)
        ? options.map(g => (
            <SelectGroup key={g.group}>
              <SelectLabel>{g.group}</SelectLabel>
              {g.items.map(opt => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        : (options as SelectOption[]).map(opt => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))
      }
    </SelectContent>
  )

  const select = (
    <Select value={value} onValueChange={(v: string | null) => v != null && onChange?.(v)}>
      {trigger}
      {content}
    </Select>
  )

  if (label || helper || error) {
    return (
      <FormField label={label} helper={helper} error={error}>
        {select}
      </FormField>
    )
  }

  return select
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
