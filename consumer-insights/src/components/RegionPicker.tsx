import { useEffect, useRef, useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconCheck, IconChevronDown, IconGlobe } from '@tabler/icons-react'
import { useRegionStore, ALL_COUNTRIES, COUNTRY_CODE } from '@/store/regionStore'
import type { Region } from '@/store/regionStore'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/app'

// ─── Country badge ────────────────────────────────────────────────────────────

function CountryBadge({ country, small }: { country: string; small?: boolean }) {
  const code = COUNTRY_CODE[country] ?? country.slice(0, 2).toUpperCase()
  return (
    <span className={cn(
      'inline-flex items-center rounded font-medium tabular-nums bg-muted text-secondary-foreground',
      small ? 'px-1 py-0 text-[10px]' : 'px-1.5 py-0.5 text-[11px]',
    )}>
      {code}
    </span>
  )
}

function CountryList({ countries, max = 4 }: { countries: string[]; max?: number }) {
  const visible = countries.slice(0, max)
  const rest = countries.length - max
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {visible.map((c) => <CountryBadge key={c} country={c} small />)}
      {rest > 0 && <span className="text-[10px] text-muted-foreground">+{rest}</span>}
    </span>
  )
}

// ─── Region row ───────────────────────────────────────────────────────────────

function RegionRow({
  region,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  region: Region
  selected: boolean
  onSelect: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        selected ? 'bg-primary/8 text-primary' : 'hover:bg-muted/60',
      )}
    >
      <div className={cn(
        'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
        selected ? 'border-primary bg-primary' : 'border-border',
      )}>
        {selected && <IconCheck className="h-2.5 w-2.5 text-white" strokeWidth={2} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn('text-xs font-medium', selected ? 'text-primary' : 'text-foreground')}>
            {region.name}
          </span>
          {region.isBuiltIn && (
            <span className="text-[10px] text-muted-foreground/60">built-in</span>
          )}
        </div>
        <CountryList countries={region.countries} max={5} />
      </div>

      {!region.isBuiltIn && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.() }}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <IconPencil className="h-3 w-3" strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.() }}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <IconTrash className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Region form ──────────────────────────────────────────────────────────────

function RegionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: { name: string; countries: string[] }
  onSave: (name: string, countries: string[]) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set(initial?.countries ?? []))

  function toggle(country: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(country)) next.delete(country)
      else next.add(country)
      return next
    })
  }

  return (
    <div className="border-t border-border pt-3 space-y-3">
      <p className="text-xs font-semibold text-foreground px-1">
        {initial ? 'Edit region' : 'New region'}
      </p>

      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Region name (e.g. DACH, Nordics…)"
        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
      />

      <div>
        <p className="text-[11px] text-muted-foreground mb-1.5 px-0.5">Select countries</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_COUNTRIES.map((country) => {
            const on = selected.has(country)
            return (
              <button
                key={country}
                type="button"
                onClick={() => toggle(country)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border transition-colors',
                  on
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-secondary-foreground border-border hover:border-primary/40 hover:text-foreground',
                )}
              >
                <span className="font-medium">{COUNTRY_CODE[country] ?? country.slice(0, 2)}</span>
                <span className="hidden sm:inline">{country}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded-lg border border-border text-secondary-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!name.trim() || selected.size === 0}
          onClick={() => onSave(name.trim(), Array.from(selected))}
          className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {initial ? 'Save changes' : 'Create region'}
        </button>
      </div>
    </div>
  )
}

// ─── RegionPicker ─────────────────────────────────────────────────────────────

type RegionPickerProps = {
  value: string
  onChange: (id: string) => void
}

export function RegionPicker({ value, onChange }: RegionPickerProps) {
  const { regions, add, update, remove } = useRegionStore()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const selected = regions.find((r) => r.id === value) ?? regions[0]
  const builtIn = regions.filter((r) => r.isBuiltIn)
  const custom = regions.filter((r) => !r.isBuiltIn)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setCreating(false)
        setEditingId(null)
      }
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function handleSelect(id: string) {
    onChange(id)
    setOpen(false)
    setCreating(false)
    setEditingId(null)
  }

  function handleCreate(name: string, countries: string[]) {
    const id = add(name, countries)
    onChange(id)
    setCreating(false)
    setOpen(false)
  }

  function handleUpdate(name: string, countries: string[]) {
    if (editingId) update(editingId, name, countries)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    remove(id)
    if (value === id) onChange('global')
  }

  const editingRegion = editingId ? regions.find((r) => r.id === editingId) : null

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setCreating(false); setEditingId(null) }}
        className={cn(
          'w-full h-9 flex items-center gap-2 px-3 rounded-md border text-xs transition-colors text-left',
          open ? 'border-ring ring-2 ring-ring/30 bg-background' : 'border-input bg-background hover:border-ring/50',
        )}
      >
        <IconGlobe className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={2} />
        <span className="font-medium text-foreground truncate">{selected?.name ?? 'Select region'}</span>
        {selected && (
          <span className="flex items-center gap-0.5 ml-1 shrink-0">
            {selected.countries.slice(0, 4).map((c) => (
              <CountryBadge key={c} country={c} small />
            ))}
            {selected.countries.length > 4 && (
              <span className="text-[10px] text-muted-foreground ml-0.5">+{selected.countries.length - 4}</span>
            )}
          </span>
        )}
        <IconChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 transition-transform', open && 'rotate-180')} strokeWidth={2} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[360px] bg-background border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
            {/* Built-in */}
            <SectionLabel className="px-3 py-1.5 mb-0">Built-in</SectionLabel>
            {builtIn.map((r) => (
              <RegionRow
                key={r.id}
                region={r}
                selected={r.id === value}
                onSelect={() => handleSelect(r.id)}
              />
            ))}

            {/* Custom */}
            {custom.length > 0 && (
              <>
                <div className="h-px bg-border mx-1 my-1" />
                <SectionLabel className="px-3 py-1.5 mb-0">Custom</SectionLabel>
                {custom.map((r) => (
                  editingId === r.id ? null : (
                    <RegionRow
                      key={r.id}
                      region={r}
                      selected={r.id === value}
                      onSelect={() => handleSelect(r.id)}
                      onEdit={() => { setEditingId(r.id); setCreating(false) }}
                      onDelete={() => handleDelete(r.id)}
                    />
                  )
                ))}
              </>
            )}
          </div>

          {/* Edit form */}
          {editingRegion && (
            <div className="px-3 pb-3">
              <RegionForm
                initial={{ name: editingRegion.name, countries: editingRegion.countries }}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}

          {/* Create form or trigger */}
          {!editingId && (
            <div className="border-t border-border px-3 py-2">
              {creating ? (
                <RegionForm
                  onSave={handleCreate}
                  onCancel={() => setCreating(false)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <IconPlus className="h-3.5 w-3.5" strokeWidth={2} />
                  Create region
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
