import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import WorkspaceSidebar from './WorkspaceSidebar'
import { Toolbar } from '@/components/app'

export default function AppLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex shrink-0">
        <WorkspaceSidebar />
      </aside>

      {/* Mobile: top bar with hamburger + sheet sidebar */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Toolbar className="md:hidden">
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

        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
