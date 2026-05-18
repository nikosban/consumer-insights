import { NavLink, useNavigate, useLocation, useMatch } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { Home, Users, Folder, LogOut, Plus, PanelLeftClose, PanelLeftOpen, LayoutDashboard, LineChart, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUB_ITEMS = [
  { tab: 'dashboards', label: 'Dashboards', icon: LayoutDashboard },
  { tab: 'analyses',   label: 'Analyses',   icon: LineChart },
  { tab: 'notes',      label: 'Notes',      icon: FileText },
]

const MIN_WIDTH = 160
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 224
const COLLAPSED_WIDTH = 52

const navItemCls = (isActive: boolean) =>
  cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full',
    isActive
      ? 'bg-gray-100 text-gray-900 font-medium'
      : 'text-sidebar-foreground hover:bg-gray-100'
  )

const iconOnlyCls = (isActive: boolean) =>
  cn(
    'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
    isActive
      ? 'bg-gray-100 text-gray-900'
      : 'text-sidebar-foreground hover:bg-gray-100'
  )

function NavItem({ to, icon, label, end, collapsed }: {
  to: string; icon: React.ReactNode; label: string; end?: boolean; collapsed: boolean
}) {
  if (collapsed) {
    return (
      <NavLink to={to} end={end} title={label} className={({ isActive }) => iconOnlyCls(isActive)}>
        <IconWrapper>{icon}</IconWrapper>
      </NavLink>
    )
  }
  return (
    <NavLink to={to} end={end} className={({ isActive }) => navItemCls(isActive)}>
      <IconWrapper>{icon}</IconWrapper>
      {label}
    </NavLink>
  )
}

export default function WorkspaceSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const workspaceMatch = useMatch('/workspace/:projectId')
  const activeProjectId = workspaceMatch?.params.projectId ?? null
  const activeTab = new URLSearchParams(location.search).get('tab') ?? 'dashboards'

  const { projects, add } = useProjectStore()
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isResizing = useRef(false)

  // ⌘S / Ctrl+S toggles the sidebar
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        setCollapsed(c => !c)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleNewProject() {
    const id = `proj-${Date.now()}`
    add({ id, name: 'Untitled Project', savedAnalyses: [], notes: [], dashboardIds: [], createdAt: new Date().toISOString() })
    navigate(`/workspace/${id}`)
  }

  const startResize = useCallback((e: React.MouseEvent) => {
    if (collapsed) return
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startWidth = width

    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + e.clientX - startX)))
    }
    function onMouseUp() {
      isResizing.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [width, collapsed])

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : width

  return (
    <div
      className={cn('relative flex flex-col h-full bg-sidebar shrink-0 overflow-hidden', collapsed && 'border-r border-sidebar-border')}
      style={{ width: sidebarWidth, transition: 'width 180ms ease' }}
    >
      {/* Header */}
      <div className="h-14 flex items-center gap-1 px-3 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-semibold text-sidebar-foreground hover:text-primary transition-colors flex-1 min-w-0 overflow-hidden"
          >
            <span className="text-primary font-bold text-base leading-none shrink-0">CI</span>
            <span className="text-sm truncate">Consumer Insights</span>
          </button>
        )}
        <div className={cn('shrink-0', collapsed && 'flex-1 flex justify-center')}>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar (⌘S)' : 'Collapse sidebar (⌘S)'}
            className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:bg-accent hover:text-gray-900 transition-colors"
          >
            {collapsed
              ? <PanelLeftOpen className="h-[14px] w-[14px]" />
              : <PanelLeftClose className="h-[14px] w-[14px]" />
            }
          </button>
        </div>
      </div>

      {/* Primary nav */}
      <div className={cn('pt-3 pb-1 space-y-0.5 shrink-0', collapsed ? 'px-1.5 flex flex-col items-center' : 'px-2')}>
        <NavItem to="/research-ai" icon={<Home size={ICON_SIZES.body} />} label="Home" collapsed={collapsed} />
        <NavItem to="/audiences" icon={<Users size={ICON_SIZES.body} />} label="Audiences" collapsed={collapsed} />
      </div>

      {/* Workspaces header — hidden when collapsed */}
      {!collapsed && (
        <div className="flex items-center justify-between px-3 pt-4 pb-1 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">Workspaces</span>
          <button
            onClick={handleNewProject}
            title="New workspace"
            className="inline-flex items-center justify-center w-[22px] h-[22px] rounded border border-border bg-background text-gray-700 transition-colors hover:bg-accent hover:text-gray-900 active:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconWrapper><Plus size={ICON_SIZES.body} /></IconWrapper>
          </button>
        </div>
      )}

      {/* Workspace list */}
      <ScrollArea className="flex-1 px-2">
        <div className={cn('pb-2', collapsed ? 'flex flex-col items-center px-0 space-y-0.5' : 'space-y-0.5')}>
          {projects.map((project) => {
            const isExpanded = activeProjectId === project.id

            if (collapsed) {
              return (
                <NavLink
                  key={project.id}
                  to={`/workspace/${project.id}`}
                  title={project.name}
                  className={({ isActive }) => iconOnlyCls(isActive)}
                >
                  <IconWrapper><Folder size={ICON_SIZES.body} /></IconWrapper>
                </NavLink>
              )
            }

            return (
              <div key={project.id}>
                <NavLink
                  to={`/workspace/${project.id}`}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full',
                    isActive
                      ? 'text-gray-900 font-medium'
                      : 'text-sidebar-foreground hover:bg-gray-100'
                  )}
                >
                  <IconWrapper><Folder size={ICON_SIZES.body} /></IconWrapper>
                  <span className="truncate">{project.name}</span>
                </NavLink>

                {isExpanded && (
                  <div className="ml-5 mt-0.5 mb-1 border-l border-border pl-1.5 space-y-0.5">
                    {SUB_ITEMS.map(({ tab, label }) => {
                      const isActive = activeTab === tab
                      return (
                        <NavLink
                          key={tab}
                          to={`/workspace/${project.id}?tab=${tab}`}
                          className={cn(
                            'flex items-center pl-3 pr-3 py-1.5 rounded-md text-sm transition-colors w-full',
                            isActive
                              ? 'bg-primary/8 text-primary font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                          )}
                        >
                          {label}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {!collapsed && projects.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No workspaces yet</p>
          )}
        </div>
      </ScrollArea>

      {/* Bottom — logout */}
      <div className={cn('pb-3 pt-2 border-t border-sidebar-border shrink-0', collapsed ? 'px-1.5 flex justify-center' : 'px-2')}>
        <button
          onClick={() => navigate('/')}
          title={collapsed ? 'Logout' : undefined}
          className={cn(collapsed ? iconOnlyCls(false) : cn(navItemCls(false), 'w-full'))}
        >
          <IconWrapper><LogOut size={ICON_SIZES.body} /></IconWrapper>
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Resize handle — expanded only */}
      {!collapsed && (
        <div
          onMouseDown={startResize}
          className="group absolute right-0 top-0 h-full w-2 translate-x-1/2 cursor-col-resize z-10 flex items-center justify-center"
        >
          <div className="h-full w-px bg-sidebar-border transition-colors group-hover:bg-primary/40 group-active:bg-primary/60" />
        </div>
      )}
    </div>
  )
}
