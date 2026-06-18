import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconSwitchHorizontal, IconCheck } from '@tabler/icons-react'
import { VERSIONS, getActiveVersion } from '@/config/versions'

export default function VersionSwitcherFab() {
  const [open, setOpen]   = useState(false)
  const navigate          = useNavigate()
  const location          = useLocation()
  const ref               = useRef<HTMLDivElement>(null)

  const activeVersion = getActiveVersion(location.pathname)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 0.5rem)',
            right: 0,
            width: '200px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Version
            </span>
          </div>
          {VERSIONS.map(v => {
            const isActive = activeVersion === v.id
            return (
              <button
                key={v.id}
                onClick={() => { navigate(v.path); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  gap: '0.625rem',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <span style={{
                  minWidth: '2rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                }}>
                  {v.label}
                </span>
                <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--secondary-foreground)' }}>
                  {v.description}
                </span>
                {isActive && (
                  <IconCheck size={14} stroke={2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                )}
              </button>
            )
          })}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        title="Switch version"
        style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '50%',
          background: 'var(--primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          color: 'white',
        }}
      >
        <IconSwitchHorizontal size={18} stroke={2} />
      </button>
    </div>
  )
}
