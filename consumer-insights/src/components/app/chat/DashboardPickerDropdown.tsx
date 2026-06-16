import { useEffect, useRef, useState } from 'react'
import { useDashboardStore } from '@/store/dashboardStore'
import { IconChevronRight, IconPlus, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function DashboardPickerDropdown({
  dashboards,
  onSelect,
  label,
  direction = 'down',
}: {
  dashboards: { id: string; name: string }[]
  onSelect: (id: string, name: string) => void
  label: string
  direction?: 'up' | 'down'
}) {
  const { add: addDashboard } = useDashboardStore()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (creating) setTimeout(() => inputRef.current?.focus(), 0)
  }, [creating])

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    const id = `dash-${Date.now()}`
    addDashboard({ id, name, widgets: [], isShared: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    onSelect(id, name)
    setCreating(false)
    setNewName('')
  }

  return (
    <div
      onMouseDown={e => e.stopPropagation()}
      className={cn(
        'absolute right-0 z-20 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[200px]',
        direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
      )}
    >
      <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider">{label}</p>
      {dashboards.map(d => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id, d.name)}
          className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between gap-2"
        >
          <span className="truncate">{d.name}</span>
          <IconChevronRight size={11} className="shrink-0 text-muted-foreground" strokeWidth={2} />
        </button>
      ))}
      <div className="border-t border-border mt-1 pt-1">
        {creating ? (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <input
              ref={inputRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') { setCreating(false); setNewName('') }
              }}
              placeholder="Dashboard name…"
              className="flex-1 text-xs border border-border rounded-md px-2 py-1 outline-none focus:border-primary min-w-0"
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white disabled:opacity-40 shrink-0"
            >
              <IconCheck size={11} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full text-left px-3 py-2 text-xs text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1.5"
          >
            <IconPlus size={11} strokeWidth={2} />
            New dashboard
          </button>
        )}
      </div>
    </div>
  )
}
