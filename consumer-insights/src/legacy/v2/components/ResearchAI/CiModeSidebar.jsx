import { useState, useRef } from 'react'
import s from './CiModeSidebar.module.css'
import { HISTORY_BY_MODE } from '../../data/ciModeData'

/* ── Inline icons ── */
const IconRAI = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
    <path d="M8.5 7.5C8.78 7.5 9 7.72 9 8V9H10C10.28 9 10.5 9.22 10.5 9.5S10.28 10 10 10H9V11C9 11.28 8.78 11.5 8.5 11.5S8 11.28 8 11V10H7C6.72 10 6.5 9.78 6.5 9.5S6.72 9 7 9H8V8C8 7.72 8.22 7.5 8.5 7.5Z" fill={active ? '#0666e5' : '#8fa3b1'}/>
    <path d="M4.5 2C4.7 2 4.89 2.12 4.96 2.31L5.88 4.62L8.19 5.54C8.38 5.61 8.5 5.80 8.5 6S8.40 6.34 8.25 6.43L8.19 6.46L5.88 7.38L4.96 9.69C4.89 9.88 4.7 10 4.5 10C4.32 10 4.16 9.90 4.07 9.75L4.04 9.69L3.12 7.38L0.81 6.46C0.62 6.39 0.5 6.20 0.5 6C0.5 5.80 0.62 5.61 0.81 5.54L3.12 4.62L4.04 2.31L4.07 2.25C4.16 2.10 4.32 2 4.5 2Z" fill={active ? '#0666e5' : '#8fa3b1'}/>
    <path d="M9.5 0.5C9.78 0.5 10 0.72 10 1V2H11C11.28 2 11.5 2.22 11.5 2.5S11.28 3 11 3H10V4C10 4.28 9.78 4.5 9.5 4.5S9 4.28 9 4V3H8C7.72 3 7.5 2.78 7.5 2.5S7.72 2 8 2H9V1C9 0.72 9.22 0.5 9.5 0.5Z" fill={active ? '#0666e5' : '#8fa3b1'}/>
  </svg>
)
const IconCI = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="5.5" cy="4.5" r="2" stroke={active ? '#7E3ED8' : '#8fa3b1'} strokeWidth="1.3"/>
    <path d="M1.5 13c0-2.21 1.79-3.5 4-3.5" stroke={active ? '#7E3ED8' : '#8fa3b1'} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="11" cy="7" r="2" stroke={active ? '#7E3ED8' : '#8fa3b1'} strokeWidth="1.3"/>
    <path d="M7.5 13.5c0-1.93 1.57-3 3.5-3s3.5 1.07 3.5 3" stroke={active ? '#7E3ED8' : '#8fa3b1'} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const IconNewChat = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14 10C14 12.21 12.21 14 10 14C7.79 14 6 12.21 6 10C6 7.79 7.79 6 10 6C12.21 6 14 7.79 14 10ZM10 7.5C10.28 7.5 10.5 7.72 10.5 8V9.5H12C12.28 9.5 12.5 9.72 12.5 10S12.28 10.5 12 10.5H10.5V12C10.5 12.28 10.28 12.5 10 12.5S9.5 12.28 9.5 12V10.5H8C7.72 10.5 7.5 10.28 7.5 10S7.72 9.5 8 9.5H9.5V8C9.5 7.72 9.72 7.5 10 7.5Z" fill="#455f7c"/>
    <path d="M4.05 0C1.81 0 0 1.81 0 4.05V6.45C0 7.94 0.80 9.24 2 9.95V12.5C2 12.7 2.12 12.89 2.31 12.96C2.50 13.04 2.71 12.998 2.85 12.855L4.87 10.834C4.98 10.73 5.03 10.58 5.02 10.44C5.01 10.29 5 10.15 5 10C5 7.24 7.24 5 10 5C10.82 5 11.59 5.20 12.27 5.55C12.43 5.63 12.61 5.62 12.76 5.53C12.91 5.44 13 5.28 13 5.10V4.05C13 1.81 11.19 0 8.95 0H4.05Z" fill="#455f7c"/>
  </svg>
)
const IconCollapse = ({ direction = 'left' }) => {
  const stroke = '#455f7c'
  return direction === 'left' ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.5 8H4.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3.5L4.5 8L9 12.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 3V13" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 8H11.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 12.5L11.5 8L7 3.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 13V3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
const IconDashboard = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1.5" stroke="#455f7c" strokeWidth="1.3"/>
    <rect x="8" y="1" width="5" height="5" rx="1.5" stroke="#455f7c" strokeWidth="1.3"/>
    <rect x="1" y="8" width="5" height="5" rx="1.5" stroke="#455f7c" strokeWidth="1.3"/>
    <rect x="8" y="8" width="5" height="5" rx="1.5" stroke="#455f7c" strokeWidth="1.3"/>
  </svg>
)
const IconAccount = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="3" stroke="#455f7c" strokeWidth="1.3"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#455f7c" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const MODES = [
  { id: 'rai', label: 'Research AI', Icon: IconRAI },
  { id: 'ci',  label: 'Consumer Insights', Icon: IconCI },
]

function ModeSwitcher({ mode, onModeChange }) {
  return (
    <div className={s.modeSwitcher}>
      {MODES.map(({ id, label, Icon }) => {
        const active = mode === id
        return (
          <button
            key={id}
            onClick={() => onModeChange(id)}
            style={{ position: 'relative', flex: active ? 1 : 0, minWidth: active ? 0 : 32 }}
            className={`${s.modeBtn} ${active ? s.modeBtnActive : ''}`}
          >
            <Icon active={active} />
            {active && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            {!active && id === 'ci' && <span className={s.notifDot} />}
          </button>
        )
      })}
    </div>
  )
}

export default function CiModeSidebar({ collapsed, onToggle, mode, onModeChange, onNewChat }) {
  const historyGroups = HISTORY_BY_MODE[mode] || HISTORY_BY_MODE.rai

  if (collapsed) {
    return (
      <div className={s.collapsedInner}>
        <div className={s.collapsedTop}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', background: '#eef0f3', borderRadius: 8, padding: 3, marginBottom: 4 }}>
            {MODES.map(({ id, label, Icon }) => {
              const active = mode === id
              return (
                <button key={id} title={label} onClick={() => onModeChange(id)}
                  style={{ position: 'relative', width: 36, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', cursor: 'pointer', background: active ? 'white' : 'transparent', boxShadow: active ? '0 1px 3px rgba(15,39,65,0.12)' : 'none', transition: 'background 0.15s, box-shadow 0.15s' }}>
                  <Icon active={active} />
                  {!active && id === 'ci' && <span className={s.notifDot} />}
                </button>
              )
            })}
          </div>
          <button title="New chat" onClick={onNewChat} className={s.iconBtn}><IconNewChat /></button>
        </div>
        <div className={s.collapsedBottom}>
          <button className={s.collapseBtn} onClick={onToggle}><IconCollapse direction="right" /></button>
          <button title="Your account" className={s.iconBtn}><IconAccount /></button>
        </div>
      </div>
    )
  }

  return (
    <div className={s.inner}>
      <ModeSwitcher mode={mode} onModeChange={onModeChange} />

      <div className={s.actionRow}>
        <button className={s.newChatBtn} onClick={onNewChat}>
          <IconNewChat />
          New chat
        </button>
        <button className={s.collapseBtn} onClick={onToggle}>
          <IconCollapse direction="left" />
        </button>
      </div>

      <a href="/consumer_insights_v2/dashboard" className={s.navItem}>
        <IconDashboard />
        Dashboard
        <span className={s.soonPill}>Soon</span>
      </a>

      <div className={s.historyList}>
        {historyGroups.map(({ label, items }) => (
          <div key={label} className={s.historyGroup}>
            <span className={s.historyGroupLabel}>{label}</span>
            {items.map(item => (
              <button key={item} className={s.historyItem}>{item}</button>
            ))}
          </div>
        ))}
      </div>

      <div className={s.footer}>
        <button className={s.accountBtn}>
          <span className={s.accountLabel}>Your account</span>
          <span className={s.accountName}>Enterprise account</span>
        </button>
      </div>
    </div>
  )
}
