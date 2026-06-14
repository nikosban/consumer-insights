import { useNavigate } from 'react-router-dom'
import { IconSearch, IconChevronDown } from '@tabler/icons-react'

const NAV_LINKS = ['Statistics', 'Insights', 'Connect', 'Services'] as const

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Left — logo + nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="shrink-0 flex items-center">
            <img src="/statista-logo.svg" alt="Statista" style={{ height: 22 }} />
          </a>
          <nav className="hidden lg:flex items-center">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                className="flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link}
                <IconChevronDown size={12} strokeWidth={2} className="opacity-60" />
              </button>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <IconSearch size={13} strokeWidth={2} />
            <span className="text-xs">Search</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-border mx-1" />

          <button
            className="h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Sign in
          </button>

          <button
            onClick={() => navigate('/research-ai')}
            className="h-9 px-4 rounded-full bg-foreground text-background text-sm font-medium transition-colors hover:bg-zinc-800"
          >
            Get started
          </button>
        </div>

      </div>
    </header>
  )
}
