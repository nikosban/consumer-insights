import { useNavigate } from 'react-router-dom'
import { IconSearch, IconChevronDown, IconWorld, IconStar, IconMail } from '@tabler/icons-react'

const NAV_LINKS = ['Statistics', 'Insights', 'Connect', 'Daily Data', 'Services'] as const

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 border-b border-white/[0.08] bg-primary py-4">
      <div className="mx-auto max-w-[1136px] px-6 flex items-center justify-between">

        {/* Left — logo + nav links */}
        <div className="flex items-center gap-6">
          <a href="/" className="shrink-0">
            <img src="/statista-logo.svg" alt="Statista" style={{ height: 24 }} />
          </a>
          <nav className="hidden lg:flex items-center">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                className="flex items-center gap-1.5 h-10 pl-3 pr-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                {link}
                <IconChevronDown size={14} strokeWidth={2} className="opacity-70" />
              </button>
            ))}
          </nav>
        </div>

        {/* Right — search, icon actions, CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition-colors">
            <IconSearch size={14} strokeWidth={2} />
            <kbd className="flex items-center gap-0.5 border border-white/[0.14] rounded px-1 h-5 text-xs font-medium text-white/70">
              <span>⌘</span><span>K</span>
            </kbd>
          </button>

          <div className="hidden sm:block h-4 w-px bg-white/[0.14]" />

          <div className="flex items-center">
            <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
              <IconWorld size={14} strokeWidth={2} />
            </button>
            <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
              <IconStar size={14} strokeWidth={2} />
            </button>
            <button className="h-10 px-3 rounded-md text-white/90 hover:bg-white/10 transition-colors">
              <IconMail size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Research AI CTA */}
          <button
            onClick={() => navigate('/research-ai')}
            className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-md bg-white text-[#313c49] text-sm font-medium transition-opacity hover:opacity-90"
            style={{ boxShadow: 'var(--btn-white-shadow)' }}
          >
            Research&nbsp;AI
            <span
              className="flex items-center justify-center h-5 w-5 rounded text-xs font-medium"
              style={{ border: '1px solid rgba(49,60,73,0.12)' }}
            >
              R
            </span>
          </button>
        </div>

      </div>
    </header>
  )
}
