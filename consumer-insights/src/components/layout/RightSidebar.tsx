import { useState, useRef, useCallback } from 'react'
import { IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const MIN_WIDTH = 200
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 280
const COLLAPSED_WIDTH = 52

export default function RightSidebar({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isResizing = useRef(false)

  const startResize = useCallback((e: React.MouseEvent) => {
    if (collapsed) return
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startWidth = width

    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth - (e.clientX - startX))))
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
      className="relative flex flex-col h-full bg-sidebar shrink-0 overflow-hidden border-l border-sidebar-border"
      style={{ width: sidebarWidth, transition: 'width 180ms ease' }}
    >
      {/* Resize handle — left edge */}
      {!collapsed && (
        <div
          onMouseDown={startResize}
          className="group absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize z-10 flex items-center justify-center"
        >
          <div className="h-full w-px bg-sidebar-border transition-colors group-hover:bg-primary/40 group-active:bg-primary/60" />
        </div>
      )}

      {/* Header */}
      <div className="h-14 flex items-center px-3 border-b border-sidebar-border shrink-0">
        <div className={cn('shrink-0', collapsed ? 'flex-1 flex justify-center' : 'mr-auto')}>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand panel' : 'Collapse panel'}
            className="inline-flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {collapsed
              ? <IconLayoutSidebarRightExpand size={14} stroke={2} />
              : <IconLayoutSidebarRightCollapse size={14} stroke={2} />
            }
          </button>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  )
}
