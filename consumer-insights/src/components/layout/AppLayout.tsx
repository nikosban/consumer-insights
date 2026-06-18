import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { IconMenu2 } from '@tabler/icons-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import WorkspaceSidebar from './WorkspaceSidebar'
import { LayoutProvider, useLayout } from './LayoutContext'
import { Toolbar } from '@/components/app'
import VersionSwitcherFab from '@/components/app/VersionSwitcherFab'

function AppShell() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { leftPanel, rightSidebar } = useLayout()

  return (
    <div className="flex h-screen bg-sidebar overflow-hidden p-2 gap-2">

      {/* Desktop left sidebar — plain column, blends into bg-sidebar */}
      <aside className="hidden md:flex shrink-0">
        <WorkspaceSidebar />
      </aside>

      {/* Optional left panel — plain column */}
      {leftPanel && (
        <div className="hidden md:flex shrink-0">
          {leftPanel}
        </div>
      )}

      {/* Mobile: top bar with hamburger + sheet sidebar */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        <Toolbar>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <IconMenu2 className="h-5 w-5" strokeWidth={2} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-56">
              <WorkspaceSidebar />
            </SheetContent>
          </Sheet>
          <button
            onClick={() => navigate('/')}
            className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
          >
            Consumer Insights
          </button>
        </Toolbar>
        <main className="flex-1 min-h-0 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>

      {/* Main content — the floating card */}
      <main
        className="hidden md:flex flex-1 min-w-0 flex-col bg-background rounded-lg border border-border overflow-hidden"
        style={{
          boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)',
        }}
      >
        <Outlet />
      </main>

      {/* Optional right sidebar — plain column */}
      {rightSidebar && (
        <div className="hidden md:flex shrink-0">
          {rightSidebar}
        </div>
      )}
    </div>
  )
}

export default function AppLayout() {
  return (
    <LayoutProvider>
      <AppShell />
      <VersionSwitcherFab />
    </LayoutProvider>
  )
}
