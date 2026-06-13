import { useState, useEffect } from 'react'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type Theme = 'system' | 'light' | 'dark'

const OPTIONS: { value: Theme; Icon: React.FC<{ size?: number; strokeWidth?: number }>; title: string }[] = [
  { value: 'system', Icon: IconDeviceDesktop, title: 'System' },
  { value: 'light',  Icon: IconSun,           title: 'Light'  },
  { value: 'dark',   Icon: IconMoon,          title: 'Dark'   },
]
const CYCLE: Theme[] = ['system', 'light', 'dark']

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) || 'system'
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (theme === 'system') applyTheme('system') }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  if (collapsed) {
    const idx = CYCLE.indexOf(theme)
    const next = CYCLE[(idx + 1) % CYCLE.length]
    const { Icon } = OPTIONS.find(o => o.value === theme)!
    return (
      <button
        onClick={() => setTheme(next)}
        title={`Theme: ${theme} — click to cycle`}
        className="flex items-center justify-center w-8 h-8 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <Icon size={14} strokeWidth={2} />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-0.5 bg-sidebar-accent rounded-md p-0.5 mx-1 my-0.5">
      {OPTIONS.map(({ value, Icon, title }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={title}
          className={cn(
            'flex flex-1 items-center justify-center h-6 rounded transition-colors',
            theme === value
              ? 'bg-background text-foreground shadow-[var(--btn-raised-light-rest)]'
              : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
          )}
        >
          <Icon size={12} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}
