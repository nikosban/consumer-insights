import { useNavigate } from 'react-router-dom'
import { IconSearch, IconChevronDown, IconWorld, IconStar, IconMail } from '@tabler/icons-react'

const NAV_LINKS = ['Statistics', 'Insights', 'Connect', 'Daily Data', 'Services'] as const

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 border-b border-border/50 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[1136px] px-6 flex items-center justify-between">

        {/* Left — logo + nav links */}
        <div className="flex items-center gap-6">
          <a href="/" className="shrink-0 py-4">
            <img
              src="/statista-logo.svg"
              alt="Statista"
              style={{ height: 24, filter: 'brightness(0)' }}
            />
          </a>
          <nav className="hidden lg:flex items-center">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                className="flex items-center gap-1.5 h-10 pl-3 pr-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                {link}
                <IconChevronDown size={13} strokeWidth={2} className="opacity-60" />
              </button>
            ))}
          </nav>
        </div>

        {/* Right — search, icon actions, CTA */}
        <div className="flex items-center gap-3 py-3">
          <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors">
            <IconSearch size={14} strokeWidth={2} />
            <kbd className="flex items-center gap-0.5 border border-border rounded px-1 h-5 text-xs font-medium text-foreground/50">
              <span>⌘</span><span>K</span>
            </kbd>
          </button>

          <div className="hidden sm:block h-4 w-px bg-border mx-1" />

          <div className="flex items-center">
            <button className="h-9 px-2.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-accent transition-colors">
              <IconWorld size={14} strokeWidth={2} />
            </button>
            <button className="h-9 px-2.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-accent transition-colors">
              <IconStar size={14} strokeWidth={2} />
            </button>
            <button className="h-9 px-2.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-accent transition-colors">
              <IconMail size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Research AI CTA — dark fill for contrast on light nav */}
          <button
            onClick={() => navigate('/research-ai')}
            className="flex items-center gap-2 h-9 pl-4 pr-3 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-colors"
          >
            Research AI
            <span className="flex items-center justify-center h-5 w-5 rounded text-xs font-medium bg-background/15">
              R
            </span>
          </button>
        </div>

      </div>
    </header>
  )
}
