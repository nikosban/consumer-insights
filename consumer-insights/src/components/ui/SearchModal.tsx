import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, LayoutDashboard, FileText, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useProjectStore } from '@/store/projectStore'
import { ATTRIBUTE_GROUPS } from '@/types'

type Result = {
  id: string
  label: string
  meta?: string
  group: string
  icon: React.ReactNode
  href: string
}

const ALL_CHARTS: Result[] = ATTRIBUTE_GROUPS.flatMap(g =>
  (g.attrs as readonly string[]).map((attr, i) => ({
    id: `chart-${g.label}-${i}`,
    label: attr,
    meta: g.label,
    group: 'Charts',
    icon: <BarChart2 className="h-3.5 w-3.5" />,
    href: '/charts',
  }))
)

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { audiences } = useAudienceStore()
  const { dashboards } = useDashboardStore()
  const { projects } = useProjectStore()

  useEffect(() => {
    function onOpen() { setOpen(true) }
    document.addEventListener('open-search', onOpen)
    return () => document.removeEventListener('open-search', onOpen)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  function close() { setOpen(false) }

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const audienceResults: Result[] = audiences
      .filter(a => a.name.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q))
      .map(a => ({
        id: a.id, label: a.name, meta: a.region ?? undefined,
        group: 'Audiences', icon: <Users className="h-3.5 w-3.5" />,
        href: `/audiences/${a.id}/edit`,
      }))

    const dashboardResults: Result[] = dashboards
      .filter(d => d.name.toLowerCase().includes(q))
      .map(d => ({
        id: d.id, label: d.name, meta: `${d.widgets.length} widgets`,
        group: 'Dashboards', icon: <LayoutDashboard className="h-3.5 w-3.5" />,
        href: `/dashboards/${d.id}`,
      }))

    const analysisResults: Result[] = projects
      .flatMap(p => p.savedAnalyses)
      .filter(a => a.name.toLowerCase().includes(q))
      .map(a => ({
        id: a.id, label: a.name, meta: `${a.sections?.length ?? 0} sections`,
        group: 'Analyses', icon: <FileText className="h-3.5 w-3.5" />,
        href: `/analyses/${a.id}`,
      }))

    const chartResults = ALL_CHARTS.filter(c =>
      c.label.toLowerCase().includes(q) || c.meta?.toLowerCase().includes(q)
    ).slice(0, 5)

    return [...audienceResults, ...dashboardResults, ...analysisResults, ...chartResults]
  }, [query, audiences, dashboards, projects])

  useEffect(() => { setCursor(0) }, [results])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') { close(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
      if (e.key === 'Enter' && results[cursor]) { navigate(results[cursor].href); close() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, results, cursor, navigate])

  if (!open) return null

  const groups = Array.from(new Set(results.map(r => r.group)))

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'oklch(0.178 0.011 220 / 0.85)' }} />

      <div className="relative w-full max-w-[560px] mx-4 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: 'oklch(0.236 0.015 220)' }}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'oklch(0.325 0.020 220)' }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: 'oklch(0.648 0.022 220)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search audiences, dashboards, analyses, charts…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'oklch(0.982 0.003 220)', caretColor: 'oklch(0.47 0.243 264)' }}
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'oklch(0.178 0.011 220)', color: 'oklch(0.648 0.022 220)', border: '1px solid oklch(0.325 0.020 220)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        {query.trim() ? (
          results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center" style={{ color: 'oklch(0.524 0.025 220)' }}>
              No results for "{query}"
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto py-2">
              {groups.map(group => (
                <div key={group}>
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'oklch(0.524 0.025 220)' }}>
                    {group}
                  </div>
                  {results.filter(r => r.group === group).map((r, i) => {
                    const flatIdx = results.indexOf(r)
                    return (
                      <button
                        key={r.id}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                          flatIdx === cursor ? 'bg-white/10' : 'hover:bg-white/5'
                        )}
                        onMouseEnter={() => setCursor(flatIdx)}
                        onClick={() => { navigate(r.href); close() }}
                      >
                        <span style={{ color: 'oklch(0.648 0.022 220)' }}>{r.icon}</span>
                        <span className="flex-1 text-sm truncate" style={{ color: 'oklch(0.982 0.003 220)' }}>{r.label}</span>
                        {r.meta && <span className="text-xs shrink-0" style={{ color: 'oklch(0.524 0.025 220)' }}>{r.meta}</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="px-4 py-3 text-xs" style={{ color: 'oklch(0.524 0.025 220)' }}>
            Start typing to search across all content
          </div>
        )}
      </div>
    </div>
  )
}
