import { useEffect, useRef } from 'react'
import TopBar from './components/TopBar/TopBar'
import Sidebar from './components/Sidebar/Sidebar'
import ControlsPanel from './components/Controls/ControlsPanel'
import SurveyCard from './components/SurveyCard/SurveyCard'
import SurveyCardErrorBoundary from './components/SurveyCard/SurveyCardErrorBoundary'
import DetailsPanel from './components/DetailsPanel/DetailsPanel'
import TargetGroupModal from './components/TargetGroups/TargetGroupModal'
import { getCardData } from './data/cardData'
import { useLegacyStore } from './store/legacyStore'
import s from './App.module.css'

export default function LegacyAppInner({ rootRef }) {
  const rowItems    = useLegacyStore(s => s.rowItems)
  const detailsName = useLegacyStore(s => s.detailsName)
  const isDragging  = useLegacyStore(s => s.isDragging)
  const setDetailsName      = useLegacyStore(s => s.setDetailsName)
  const toggleItem          = useLegacyStore(s => s.toggleItem)
  const setSelectionHidden  = useLegacyStore(s => s.setSelectionHidden)

  const contentAreaRef = useRef(null)

  useEffect(() => {
    rootRef?.current?.classList.toggle('is-dragging', isDragging)
  }, [isDragging, rootRef])

  useEffect(() => {
    function onWheel(e) {
      if (e.deltaY <= 0) return
      const content = contentAreaRef.current
      if (!content) return
      setSelectionHidden(true)
      if (!content.contains(e.target)) {
        content.scrollBy({ top: e.deltaY, behavior: 'instant' })
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [setSelectionHidden])

  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('[data-dropdown]') && !e.target.closest('[data-display-opts]')) {
        useLegacyStore.getState().setOpenDropdown(null)
        useLegacyStore.getState().toggleDisplayOptionsOpen()
        // only close if currently open
      }
    }
    // handled per-component now — no global listener needed
  }, [])

  return (
    <div className={s.app}>
      <TopBar />
      <div className={s.body}>
        <Sidebar />
        <main className={s.main}>
          <ControlsPanel />
          <div ref={contentAreaRef} className={s.contentArea}>

            {rowItems.map(name => (
              <SurveyCardErrorBoundary key={name}>
                <SurveyCard
                  name={name}
                  data={getCardData(name)}
                  onClose={() => toggleItem(name)}
                  onOpenDetails={() => setDetailsName(name)}
                  detailsOpen={detailsName === name}
                />
              </SurveyCardErrorBoundary>
            ))}
          </div>
        </main>
      </div>
      <DetailsPanel />
      <TargetGroupModal />
    </div>
  )
}
