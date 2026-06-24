import { useState } from 'react'
import s from './CiModeSidebar.module.css'
import { HISTORY_BY_MODE } from '../../data/ciModeData'
import { useLegacyStore } from '../../store/legacyStore'

export default function CiModeSidebar({ collapsed, onNewChat, onDashboard }) {
  const historyGroups = HISTORY_BY_MODE.rai
  const [dashOpen, setDashOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(true)
  const setOpenAccordion = useLegacyStore(s => s.setOpenAccordion)

  function goToTargetGroups() {
    localStorage.setItem('ci_open_accordion', 'target')
    window.location.href = '/consumer_insights_v1'
  }

  if (collapsed) {
    return (
      <div className={s.collapsedInner}>
        <button title="New chat" onClick={onNewChat} className={s.collapsedIconBtn}>
          <i className="ti ti-message-plus" />
        </button>
        <div className={s.collapsedDivider} />
        <button title="Crosstabs" className={s.collapsedIconBtn}>
          <i className="ti ti-table-column" />
        </button>
        <button title="Target Groups" className={s.collapsedIconBtn} onClick={goToTargetGroups}>
          <i className="ti ti-users" />
        </button>
        <div className={s.collapsedDivider} />
        <button title="Dashboards" className={s.collapsedIconBtn} onClick={onDashboard}>
          <i className="ti ti-layout-dashboard" />
        </button>
      </div>
    )
  }

  return (
    <div className={s.inner}>
      {/* Header: New Chat */}
      <div className={s.header}>
        <button className={s.newChatBtn} onClick={onNewChat}>
          <i className={`ti ti-message-plus ${s.newChatIcon}`} />
          New Chat
        </button>
      </div>

      {/* Nav items */}
      <nav className={s.nav}>
        <a className={s.navItem} href="/consumer_insights_v1" target="_blank" rel="noopener noreferrer">
          <i className={`ti ti-table-column ${s.navIcon}`} />
          <span className={s.navLabel}>Crosstabs</span>
          <i className={`ti ti-arrow-up-right ${s.navExternal}`} />
        </a>
        <button className={s.navItem} onClick={goToTargetGroups}>
          <i className={`ti ti-users ${s.navIcon}`} />
          <span className={s.navLabel}>Target Groups</span>
          <i className={`ti ti-arrow-up-right ${s.navExternal}`} />
        </button>
      </nav>

      {/* Dashboards section */}
      <div className={s.section}>
        <div className={s.sectionHeader} onClick={() => setDashOpen(o => !o)}>
          <i className={`ti ti-chevron-right ${s.sectionChevron} ${dashOpen ? s.sectionChevronOpen : ''}`} />
          <span className={s.sectionLabel}>Dashboards</span>
          <span className={s.comingSoonBadge}>Coming soon</span>
        </div>
      </div>

      {/* Chat History section */}
      <div className={`${s.section} ${s.sectionFlex}`}>
        <div className={s.sectionHeader} onClick={() => setHistoryOpen(o => !o)}>
          <i className={`ti ti-chevron-right ${s.sectionChevron} ${historyOpen ? s.sectionChevronOpen : ''}`} />
          <span className={s.sectionLabel}>Chat History</span>
        </div>
        {historyOpen && (
          <div className={`${s.sectionBody} ${s.historyList}`}>
            {historyGroups.map(({ label, items }) => (
              <div key={label} className={s.historyGroup}>
                <span className={s.historyGroupLabel}>{label}</span>
                {items.map(item => (
                  <button key={item} className={s.historyItem}>{item}</button>
                ))}
              </div>
            ))}
            <div className={s.historyGroup}>
              <span className={s.historyGroupLabel}>Dashboards</span>
              <button className={s.historyItem} onClick={onDashboard}>
                <i className={`ti ti-layout-dashboard`} style={{ marginRight: 6, fontSize: 13, verticalAlign: 'middle' }} />
                My Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
