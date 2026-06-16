import { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type Props = {
  options: string[]
  value: string[]
  onChange: (values: string[]) => void
}

export function ValuePicker({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const openPanel = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const panelW = 220
    const viewportW = window.innerWidth
    let left = rect.left
    if (left + panelW > viewportW - 8) left = viewportW - panelW - 8
    setCoords({ top: rect.bottom + 4, left })
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
  }

  const label = value.length === 0
    ? <span className="text-muted-foreground">Select…</span>
    : value.length === 1
      ? <span className="truncate">{value[0]}</span>
      : <span className="truncate">{value.length} selected</span>

  const panel = open
    ? ReactDOM.createPortal(
        <div
          ref={panelRef}
          style={{ top: coords.top, left: coords.left, width: 220 }}
          className="fixed z-50 rounded-xl border border-border bg-white shadow-xl py-1.5 overflow-y-auto max-h-64"
        >
          {options.map(opt => {
            const checked = value.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors hover:bg-accent',
                  checked ? 'text-primary' : 'text-secondary-foreground'
                )}
              >
                <span className={cn(
                  'shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center',
                  checked ? 'bg-primary border-primary' : 'border-gray-300'
                )}>
                  {checked && <IconCheck className="w-2.5 h-2.5 text-white" strokeWidth={2} />}
                </span>
                {opt}
              </button>
            )
          })}
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openPanel()}
        className={cn(
          'inline-flex items-center justify-between gap-1.5 h-8 w-44 rounded-md border border-input bg-background px-2.5 text-xs text-left transition-colors',
          'hover:bg-accent hover:text-foreground',
          open && 'ring-2 ring-ring ring-offset-0'
        )}
      >
        {label}
        <IconChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} strokeWidth={2} />
      </button>
      {panel}
    </>
  )
}
