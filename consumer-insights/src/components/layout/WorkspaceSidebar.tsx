import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useAIStore } from '@/store/aiStore'
import {
  IconMessage, IconUsers, IconChartBar, IconFlask, IconLogout,
  IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand,
  IconSearch, IconLayoutDashboard, IconCommand,
} from '@tabler/icons-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 160
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 224
const COLLAPSED_WIDTH = 52

const navItemCls = (isActive: boolean) =>
  cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full',
    isActive
      ? 'bg-background text-foreground font-medium shadow-[var(--btn-raised-light-rest)]'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  )

const iconOnlyCls = (isActive: boolean) =>
  cn(
    'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
    isActive
      ? 'bg-background text-foreground shadow-[var(--btn-raised-light-rest)]'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  )

function NavItem({ to, icon, label, end, collapsed, onClick }: {
  to: string; icon: React.ReactNode; label: string; end?: boolean; collapsed: boolean; onClick?: () => void
}) {
  if (collapsed) {
    return (
      <NavLink to={to} end={end} title={label} className={({ isActive }) => iconOnlyCls(isActive)} onClick={onClick}>
        {icon}
      </NavLink>
    )
  }
  return (
    <NavLink to={to} end={end} className={({ isActive }) => navItemCls(isActive)} onClick={onClick}>
      {icon}
      {label}
    </NavLink>
  )
}

export default function WorkspaceSidebar() {
  const navigate = useNavigate()
  const reset = useAIStore(s => s.reset)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isResizing = useRef(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setCollapsed(c => !c)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
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
              className="brightness-0 dark:brightness-0 dark:invert"
              style={{ height: 18 }}
              draggable={false}
            />
          </button>
        )}
        <div className={cn('shrink-0', collapsed && 'flex-1 flex justify-center')}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar (⌘D)' : 'Collapse sidebar (⌘D)'}
            className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed
              ? <IconLayoutSidebarLeftExpand size={14} strokeWidth={2} />
              : <IconLayoutSidebarLeftCollapse size={14} strokeWidth={2} />
            }
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className={cn('px-2 pt-3 pb-2 shrink-0', collapsed && 'hidden')}>
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-search'))}
          className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-md bg-background text-muted-foreground text-sm transition-[shadow,color] shadow-[var(--field-shadow)] hover:shadow-[var(--field-shadow-focus)] hover:text-foreground"
        >
          <IconSearch size={14} strokeWidth={2} className="shrink-0" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="inline-flex items-center gap-0.5 h-5 px-1.5 rounded border border-border bg-background text-foreground text-xs leading-none shadow-[var(--btn-raised-light-rest)]">
            <IconCommand size={10} strokeWidth={2} /><span className="font-mono">S</span>
          </kbd>
        </button>
      </div>

      {/* Primary nav */}
      <div className={cn('pt-1 flex-1 space-y-0.5', collapsed ? 'px-1.5 flex flex-col items-center' : 'px-2')}>
        <NavItem to="/research-ai" icon={<IconMessage       size={14} strokeWidth={2} />} label="Chat"       collapsed={collapsed} onClick={reset} />
        <NavItem to="/audiences"   icon={<IconUsers         size={14} strokeWidth={2} />} label="Audience"   collapsed={collapsed} />
        <NavItem to="/charts"      icon={<IconChartBar      size={14} strokeWidth={2} />} label="Charts"     collapsed={collapsed} />
        <NavItem to="/dashboards"  icon={<IconLayoutDashboard size={14} strokeWidth={2} />} label="Dashboards" collapsed={collapsed} />
        <NavItem to="/analyses"    icon={<IconFlask         size={14} strokeWidth={2} />} label="Analysis"   collapsed={collapsed} />
      </div>

      {/* Bottom — theme toggle + logout */}
      <div className={cn('pb-3 pt-2 border-t border-sidebar-border shrink-0 space-y-0.5', collapsed ? 'px-1.5 flex flex-col items-center' : 'px-2')}>
        <ThemeToggle collapsed={collapsed} />
        <button
          onClick={() => navigate('/playground')}
          title={collapsed ? 'Logout' : undefined}
          className={cn(collapsed ? iconOnlyCls(false) : cn(navItemCls(false), 'w-full'))}
        >
          <IconLogout size={14} strokeWidth={2} className="shrink-0" />
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
