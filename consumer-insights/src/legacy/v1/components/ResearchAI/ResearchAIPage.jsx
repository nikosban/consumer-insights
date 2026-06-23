import { useState, useRef, useCallback, useEffect } from 'react'
import GlobalNavbar from '../GlobalNavbar/GlobalNavbar'
import CiModeSidebar from './CiModeSidebar'
import ChatLane from './ChatLane'
import RightPanel from './RightPanel'
import RaiStartPage from './RaiStartPage'
import PromptField from './PromptField'
import { DashboardContent } from '../Dashboard/DashboardPage'
import s from './ResearchAIPage.module.css'

const SIDEBAR_MIN = 180
const SIDEBAR_MAX = 480
const SIDEBAR_DEFAULT = 240
const SIDEBAR_COLLAPSED = 56

export default function ResearchAIPage() {
  const [page, setPage] = useState('start')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarW, setSidebarW] = useState(SIDEBAR_DEFAULT)
  const [mode, setMode] = useState('rai')
  const [hoveredSource, setHoveredSource] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [resizing, setResizing] = useState(false)
  const resizingRef = useRef(false)

  const handleSubmit = () => setPage('chat')

  const startResize = useCallback((e) => {
    e.preventDefault()
    resizingRef.current = true
    setResizing(true)

    function onMouseMove(e) {
      if (!resizingRef.current) return
      setSidebarW(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, e.clientX)))
    }

    function onMouseUp() {
      resizingRef.current = false
      setResizing(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  // Prevent text selection while resizing
  useEffect(() => {
    if (resizing) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [resizing])

  const effectiveW = sidebarCollapsed ? SIDEBAR_COLLAPSED : sidebarW

  return (
    <div className={s.root}>
      <GlobalNavbar />

      <div className={s.body}>
        {/* Sidebar */}
        <div className={s.sidebarWrap} style={{ width: effectiveW }}>
          <CiModeSidebar
            collapsed={sidebarCollapsed}
            mode={mode}
            onModeChange={setMode}
            onNewChat={() => setPage('start')}
            onDashboard={() => setPage('dashboard')}
          />
        </div>

        {/* Resize handle — only when expanded */}
        {!sidebarCollapsed && (
          <div
            className={`${s.resizeHandle} ${resizing ? s.resizeHandleActive : ''}`}
            style={{ left: effectiveW - 3 }}
            onMouseDown={startResize}
          />
        )}

        {/* Toggle button — floats on the sidebar border */}
        <button
          className={s.sidebarToggle}
          style={{ left: effectiveW - 12 }}
          onClick={() => setSidebarCollapsed(v => !v)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`ti ${sidebarCollapsed ? 'ti-chevron-right' : 'ti-chevron-left'}`} />
        </button>

        <div className={s.pageWrap} style={{ paddingLeft: effectiveW }}>
          {page === 'dashboard' && <DashboardContent />}
          {page === 'start' && <RaiStartPage onSubmit={handleSubmit} sidebarLeft={effectiveW} />}
          {page === 'chat' && (
            <div className={s.chatInner}>
              <div className={s.chatCol}>
                <div className={s.laneScroll}>
                  <ChatLane
                    hoveredSource={hoveredSource}
                    onBadgeEnter={setHoveredSource}
                    onBadgeLeave={() => setHoveredSource(null)}
                  />
                </div>
                <div className={s.promptWrap}>
                  <div className={s.promptBar}>
                    <PromptField
                      placeholder="Ask a follow-up question…"
                      minHeight={56}
                      onSubmit={() => {}}
                    />
                  </div>
                  <div className={s.infoNote}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#7b94a3" strokeWidth="1.2"/>
                      <path d="M7 6v4M7 4.5v.5" stroke="#7b94a3" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    Our AI can make mistakes. Please check important information.
                  </div>
                </div>
              </div>
              <RightPanel
                hoveredSource={hoveredSource}
                selectedSource={selectedSource}
                onSourceSelect={n => setSelectedSource(prev => prev === n ? null : n)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
