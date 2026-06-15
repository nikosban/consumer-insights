import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import WorkspaceSidebar from './WorkspaceSidebar'
import { LayoutProvider, useLayout } from './LayoutContext'
import { Toolbar } from '@/components/app'

function AppShell() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { leftPanel, rightSidebar } = useLayout()

  return (
    <div className="flex h-screen bg-sidebar overflow-hidden">

      {/* Desktop left sidebar */}
      <aside className="hidden md:flex shrink-0">
        <WorkspaceSidebar />
      </aside>

      {/* Mobile: top bar with hamburger + sheet sidebar */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        <Toolbar>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Menu className="h-5 w-5" />
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

      {/* Desktop: padded compound card — leftPanel + main + rightSidebar all share the same top edge */}
      <div className="hidden md:flex flex-1 min-w-0 p-2">
        <div
          className="flex flex-1 min-w-0 bg-background rounded-lg border border-border overflow-hidden"
          style={{
            boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)',
          }}
        >
          {leftPanel && <div className="shrink-0 flex">{leftPanel}</div>}
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <Outlet />
          </main>
          {rightSidebar && <div className="shrink-0 flex">{rightSidebar}</div>}
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  return (
    <LayoutProvider>
      <AppShell />
    </LayoutProvider>
  )
}
