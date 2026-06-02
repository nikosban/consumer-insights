import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { MessageSquare, Users, BarChart2, FlaskConical, LogOut, PanelLeftClose, PanelLeftOpen, Search, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 160
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 224
const COLLAPSED_WIDTH = 52

const navItemCls = (isActive: boolean) =>
  cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full',
    isActive
      ? 'bg-white text-gray-900 font-medium shadow-sm'
      : 'text-sidebar-foreground hover:bg-white/70'
  )

const iconOnlyCls = (isActive: boolean) =>
  cn(
    'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
    isActive
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-sidebar-foreground hover:bg-white/70'
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
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isResizing = useRef(false)

  // ⌘S / Ctrl+S toggles the sidebar; ⌘R / Ctrl+R opens global search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        setCollapsed(c => !c)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('open-search'))
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

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
            className="flex items-center flex-1 min-w-0 overflow-hidden"
          >
            <img
              src="/statista-logo.svg"
              alt="Statista"
              data-logo
              style={{ height: 18, filter: 'brightness(0)' }}
              draggable={false}
            />
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

      {/* Search bar */}
      <div className={cn('px-2 pt-3 pb-2 shrink-0', collapsed && 'hidden')}>
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-search'))}
          className="w-full flex items-center gap-2 h-9 px-2 rounded-md bg-background border border-border text-muted-foreground text-sm transition-colors hover:border-primary/40 hover:text-foreground"
          style={{ borderRadius: 6 }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-xs">Search</span>
          <kbd className="text-[10px] text-muted-foreground/60 font-mono">⌘R</kbd>
        </button>
      </div>

      {/* Primary nav */}
      <div className={cn('pt-1 flex-1 space-y-0.5', collapsed ? 'px-1.5 flex flex-col items-center' : 'px-2')}>
        <NavItem to="/research-ai" icon={<MessageSquare    size={ICON_SIZES.body} />} label="Chat"       collapsed={collapsed} />
        <NavItem to="/audiences"   icon={<Users            size={ICON_SIZES.body} />} label="Audience"   collapsed={collapsed} />
        <NavItem to="/charts"      icon={<BarChart2        size={ICON_SIZES.body} />} label="Charts"     collapsed={collapsed} />
        <NavItem to="/dashboards"  icon={<LayoutDashboard  size={ICON_SIZES.body} />} label="Dashboards" collapsed={collapsed} />
        <NavItem to="/analyses"    icon={<FlaskConical     size={ICON_SIZES.body} />} label="Analysis"   collapsed={collapsed} />
      </div>

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

      {/* Resize handle */}
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
