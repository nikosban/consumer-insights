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
            width: '320px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Version
            </span>
          </div>
          {VERSIONS.filter(v => !v.hidden).map((v, i) => {
            const isActive = activeVersion === v.id
            return (
              <button
                key={v.id}
                onClick={() => {
                  navigate(v.path)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '0.75rem',
                  gap: '0.25rem',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', width: '100%' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                  }}>
                    {v.label}
                  </span>
                  {isActive && (
                    <IconCheck size={12} stroke={2} style={{ color: 'var(--primary)', marginLeft: 'auto' }} />
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', lineHeight: 1.4 }}>
                  {v.description}
                </span>
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
