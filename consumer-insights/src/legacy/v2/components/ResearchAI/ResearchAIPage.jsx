import { useState } from 'react'
import GlobalNavbar from '../GlobalNavbar/GlobalNavbar'
import CiModeSidebar from './CiModeSidebar'
import ChatLane from './ChatLane'
import RightPanel from './RightPanel'
import RaiStartPage from './RaiStartPage'
import PromptField from './PromptField'
import s from './ResearchAIPage.module.css'

export default function ResearchAIPage() {
  const [page, setPage] = useState('start') // 'start' | 'chat'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mode, setMode] = useState('rai')
  const [hoveredSource, setHoveredSource] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)

  const sidebarW = sidebarCollapsed ? 56 : 240

  const handleSubmit = () => setPage('chat')

  return (
    <div className={s.root}>
      <GlobalNavbar />

      <div className={s.body}>
        {/* Sidebar — always visible */}
        <div className={s.sidebarWrap} style={{ width: sidebarW }}>
          <CiModeSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(v => !v)}
            mode={mode}
            onModeChange={setMode}
            onNewChat={() => setPage('start')}
          />
        </div>

        {page === 'start' ? (
          <div className={s.startWrap} style={{ paddingLeft: sidebarW }}>
            <RaiStartPage onSubmit={handleSubmit} sidebarLeft={sidebarW} />
          </div>
        ) : (
          <div className={s.contentArea} style={{ paddingLeft: sidebarW }}>
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
  )
}
