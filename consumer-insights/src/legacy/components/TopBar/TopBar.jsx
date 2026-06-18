import { useState, useRef, useEffect } from 'react'
import s from './TopBar.module.css'

const SURVEYS = [
  { id: 'global',   label: 'Global Survey',          desc: 'Analyze global trends across 500+ industries and topics.',        badge: null },
  { id: 'brand',    label: 'Brand KPIs',              desc: 'Discover key performance indicators for over 10,000 brands.',     badge: null },
  { id: 'pulse',    label: 'Pulse',                   desc: 'Explore consumer sentiment and trends across industries.',        badge: 'NEW' },
  { id: 'media',    label: 'Media & Touchpoints',     desc: 'Track media & advertising usage across platforms and audiences.', badge: 'NEW' },
  { id: 'library',  label: 'Survey library',          desc: 'In-depth and partner surveys since 2018.',                       badge: null },
]

export default function TopBar() {
  const [open, setOpen]             = useState(false)
  const [selected, setSelected]     = useState('global')
  const ref                         = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const selectedLabel = SURVEYS.find(s => s.id === selected)?.label ?? 'Surveys'

  return (
    <header className={s.topbar}>
      <div className={s.left}>
        <a className={s.logo} href="#">
          <span className={s.wordmark}>statista</span>
          <span className={s.divider} />
          <span className={s.product}>Consumer Insights</span>
        </a>
        <div className={s.searchWrap}>
          <i className="ti ti-search" />
          <input type="text" placeholder="Search for topics or brands... e.g., hobbies" />
        </div>
      </div>
      <div className={s.right}>
        <div ref={ref} className={s.surveysWrap}>
          <button
            className={`${s.btn} ${open ? s.btnOpen : ''}`}
            onClick={() => setOpen(o => !o)}
          >
            {selectedLabel}
            <i className={`ti ${open ? 'ti-chevron-up' : 'ti-chevron-down'}`} />
          </button>
          {open && (
            <div className={s.surveysDropdown}>
              {SURVEYS.map(survey => {
                const isSelected = selected === survey.id
                return (
                  <div
                    key={survey.id}
                    className={`${s.surveyOption} ${isSelected ? s.surveyOptionSelected : ''}`}
                    onClick={() => { setSelected(survey.id); setOpen(false) }}
                  >
                    <div className={`${s.radio} ${isSelected ? s.radioSelected : ''}`}>
                      {isSelected && <div className={s.radioDot} />}
                    </div>
                    <div className={s.surveyText}>
                      <div className={s.surveyLabel}>
                        {survey.label}
                        {survey.badge && <span className={s.badge}>{survey.badge}</span>}
                      </div>
                      <div className={s.surveyDesc}>{survey.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <button className={`${s.btn} ${s.btnNoBorder}`}>Logout</button>
      </div>
    </header>
  )
}
