import { useState, useRef, useEffect } from 'react'

const FF = "'Open Sans', system-ui, sans-serif"

const COUNTRIES = [
  { code: 'WW', label: 'Worldwide',      icon: 'ti-world' },
  { code: 'US', label: 'United States',  icon: 'ti-flag' },
  { code: 'DE', label: 'Germany',        icon: 'ti-flag' },
  { code: 'GB', label: 'United Kingdom', icon: 'ti-flag' },
  { code: 'FR', label: 'France',         icon: 'ti-flag' },
  { code: 'CN', label: 'China',          icon: 'ti-flag' },
  { code: 'JP', label: 'Japan',          icon: 'ti-flag' },
  { code: 'BR', label: 'Brazil',         icon: 'ti-flag' },
  { code: 'IN', label: 'India',          icon: 'ti-flag' },
  { code: 'AU', label: 'Australia',      icon: 'ti-flag' },
]

function CountrySelect() {
  const [selected, setSelected] = useState(COUNTRIES[0])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 28, padding: '0 8px',
          border: '1px solid #e0e0e0', borderRadius: 6,
          background: open ? '#f0f5ff' : 'white',
          cursor: 'pointer', fontFamily: FF,
          transition: 'background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = '#a0b4c8' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = '#e0e0e0' }}
      >
        <i className={`ti ${selected.icon}`} style={{ fontSize: 14, color: '#455f7c', lineHeight: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: '#455f7c', whiteSpace: 'nowrap' }}>{selected.label}</span>
        <i className="ti ti-chevron-down" style={{ fontSize: 11, color: '#7b94a3', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          background: 'white', border: '1px solid #e0e0e0', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(15,39,65,0.12)',
          zIndex: 100, minWidth: 180, overflow: 'hidden',
          padding: '4px 0',
        }}>
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              onClick={() => { setSelected(c); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '7px 12px',
                border: 'none', background: c.code === selected.code ? '#f0f5ff' : 'white',
                cursor: 'pointer', fontFamily: FF, textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f5f8fb' }}
              onMouseLeave={e => { e.currentTarget.style.background = c.code === selected.code ? '#f0f5ff' : 'white' }}
            >
              <i className={`ti ${c.icon}`} style={{ fontSize: 14, color: '#455f7c', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#0f2741', fontWeight: c.code === selected.code ? 600 : 400 }}>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PromptField({ placeholder = 'Ask anything to start', minHeight = 104, onSubmit }) {
  const [value, setValue] = useState('')
  const taRef = useRef(null)

  const submit = () => {
    const v = value.trim()
    if (v) { onSubmit?.(v); setValue('') }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(Math.max(e.target.scrollHeight, minHeight), 200) + 'px'
  }

  return (
    <div style={{
      position: 'relative',
      border: '1px solid #c4c4c4',
      borderRadius: 8,
      minHeight,
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <textarea
        ref={taRef}
        value={value}
        placeholder={placeholder}
        rows={1}
        onChange={e => setValue(e.target.value)}
        onInput={autoResize}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: FF,
          fontSize: 14,
          color: '#0f2741',
          background: 'transparent',
          lineHeight: '22px',
          padding: '16px 16px 8px 16px',
          minHeight: minHeight - 44,
          alignSelf: 'stretch',
        }}
      />
      {/* Bottom bar: country select left, send button right */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px 8px 12px', gap: 8,
      }}>
        <CountrySelect />
        <button
          onClick={submit}
          style={{
            width: 40, height: 40,
            background: '#0666E5',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.854 3.146a.5.5 0 0 1 .125.517L9.979 13.644a.5.5 0 0 1-.968-.028L7.317 9.39 9.854 6.854a.5.5 0 0 0-.708-.708L6.61 8.683 2.314 6.964a.5.5 0 0 1 .022-.969L12.336 3.02a.5.5 0 0 1 .518.126Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
