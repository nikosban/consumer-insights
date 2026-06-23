import { useState } from 'react'
import s from './CiModeSidebar.module.css'
import { HISTORY_BY_MODE } from '../../data/ciModeData'

const SAVED_DASHBOARDS = ['My Dashboard']

export default function CiModeSidebar({ collapsed, onNewChat, onDashboard }) {
  const historyGroups = HISTORY_BY_MODE.rai
  const [dashOpen, setDashOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(true)

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
        <button title="Target Groups" className={s.collapsedIconBtn}>
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
        <button className={s.navItem}>
          <i className={`ti ti-users ${s.navIcon}`} />
          <span className={s.navLabel}>Target Groups</span>
        </button>
      </nav>

      {/* Dashboards section */}
      <div className={s.section}>
        <div className={s.sectionHeader} onClick={() => setDashOpen(o => !o)}>
          <i className={`ti ti-chevron-right ${s.sectionChevron} ${dashOpen ? s.sectionChevronOpen : ''}`} />
          <span className={s.sectionLabel}>Dashboards</span>
          <button
            className={s.sectionActionBtn}
            title="New dashboard"
            onClick={e => { e.stopPropagation() }}
          >
            <i className="ti ti-plus" />
          </button>
        </div>
        {dashOpen && (
          <div className={s.sectionBody}>
            {SAVED_DASHBOARDS.map(name => (
              <button key={name} className={s.dashItem} onClick={onDashboard}>
                <i className={`ti ti-layout-dashboard ${s.dashItemIcon}`} />
                {name}
              </button>
            ))}
          </div>
        )}
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
          </div>
        )}
      </div>
    </div>
  )
}
