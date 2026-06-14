import { IconBrandLinkedin, IconBrandX, IconBrandGithub } from '@tabler/icons-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const LINK_GROUPS = [
  {
    heading: 'Product',
    links: ['Research AI', 'Audience Builder', 'Chart Library', 'Dashboard Canvas', 'API'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'Changelog', 'Status', 'Blog', 'Community'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact'],
  },
  {
    heading: 'Legal',
    links: ['Privacy', 'Terms', 'Cookies', 'Security'],
  },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1264px] mx-auto px-6">

        {/* Top row */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand col */}
          <div className="col-span-1">
            <img
              src="/statista-logo.svg"
              alt="Statista"
              style={{ height: 20 }}
              className="brightness-0 dark:invert mb-4"
            />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              Consumer-grade survey data for teams that move fast.
            </p>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map(group => (
            <div key={group.heading} className="col-span-1">
              <p className="text-xs font-semibold text-foreground uppercase tracking-[0.07em] mb-3">
                {group.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom row */}
        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 Statista GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <IconBrandLinkedin size={15} strokeWidth={2} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <IconBrandX size={15} strokeWidth={2} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <IconBrandGithub size={15} strokeWidth={2} />
              </a>
            </div>
            <div className="w-[92px]">
              <ThemeToggle />
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
