import { useEffect, useState, useRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onOpen() { setOpen(true) }
    document.addEventListener('open-search', onOpen)
    return () => document.removeEventListener('open-search', onOpen)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center')}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'oklch(0.178 0.011 220 / 0.85)' }} />

      {/* Search box */}
      <div className="relative w-full max-w-[560px] mx-4 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: 'oklch(0.236 0.015 220)' }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'oklch(0.325 0.020 220)' }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: 'oklch(0.648 0.022 220)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chats, dashboards, analyses…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'oklch(0.982 0.003 220)', caretColor: 'oklch(0.47 0.243 264)' }}
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'oklch(0.178 0.011 220)', color: 'oklch(0.648 0.022 220)', border: '1px solid oklch(0.325 0.020 220)' }}>
            ESC
          </kbd>
        </div>
        <div className="px-4 py-3 text-xs" style={{ color: 'oklch(0.524 0.025 220)' }}>
          {query ? `Searching for "${query}"…` : 'Start typing to search across all content'}
        </div>
      </div>
    </div>
  )
}
