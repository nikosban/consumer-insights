import { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { ATTRIBUTE_GROUPS } from '@/types'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onSelect: (attr: string) => void
}

function findCategory(attr: string): string {
  return ATTRIBUTE_GROUPS.find(g => (g.attrs as readonly string[]).includes(attr))?.label
    ?? ATTRIBUTE_GROUPS[0].label
}

export function AttributePicker({ value, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState(() => findCategory(value))
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const openPanel = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const panelW = 480
    const viewportW = window.innerWidth
    let left = rect.left
    if (left + panelW > viewportW - 8) left = viewportW - panelW - 8
    setCoords({ top: rect.bottom + 4, left })
    setHoveredCategory(findCategory(value))
    setOpen(true)
  }, [value])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const currentAttrs = ATTRIBUTE_GROUPS.find(g => g.label === hoveredCategory)?.attrs ?? []

  const panel = open
    ? ReactDOM.createPortal(
        <div
          ref={panelRef}
          style={{ top: coords.top, left: coords.left, width: 480 }}
          className="fixed z-50 flex rounded-xl border border-border bg-white shadow-xl overflow-hidden"
        >
          {/* Left: categories */}
          <div className="w-48 shrink-0 border-r border-border bg-gray-50 py-1.5 overflow-y-auto max-h-72">
            {ATTRIBUTE_GROUPS.map(g => (
              <button
                key={g.label}
                type="button"
                onMouseEnter={() => setHoveredCategory(g.label)}
                onClick={() => setHoveredCategory(g.label)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs transition-colors',
                  hoveredCategory === g.label
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Right: attributes */}
          <div className="flex-1 py-1.5 overflow-y-auto max-h-72">
            {currentAttrs.map(attr => (
              <button
                key={attr}
                type="button"
                onClick={() => {
                  onSelect(attr)
                  setOpen(false)
                }}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs transition-colors',
                  attr === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {attr}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        className={cn(
          'inline-flex items-center justify-between gap-1.5 h-8 w-52 rounded-md border border-input bg-background px-2.5 text-xs text-left transition-colors',
          'hover:bg-accent hover:text-gray-900',
          open && 'ring-2 ring-ring ring-offset-0'
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {panel}
    </>
  )
}
