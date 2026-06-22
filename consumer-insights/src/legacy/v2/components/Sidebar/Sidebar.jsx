import { useEffect, useRef, useState } from 'react'
import { IconRowInsertBottom, IconRowRemove } from '@tabler/icons-react'
import { categories } from '../../data/sidebarData'
import { useLegacyStore } from '../../store/legacyStore'
import CatItem from './CatItem'
import s from './Sidebar.module.css'

const SURVEYS = [
  { id: 'global',    label: 'Global Survey',          description: 'Analyze global trends across 500+ industries and topics.' },
  { id: 'brand',     label: 'Brand KPIs',             description: 'Discover key performance indicators for over 10,000 brands.' },
  { id: 'pulse',     label: 'Pulse',                  description: 'Explore consumer sentiment and trends across industries.', badge: 'NEW' },
  { id: 'media',     label: 'Media & Touchpoints',    description: 'Track media & advertising usage across platforms and audiences.', badge: 'NEW' },
  { id: 'library',   label: 'Survey library',         description: 'In-depth and partner surveys since 2018.' },
]

const SECTIONS = [
  { id: 'survey',  label: 'Survey Items',   icon: 'ti-clipboard-list' },
  { id: 'target',  label: 'Target groups',  icon: 'ti-users' },
]

let wasDragging = false

/* ── Section switcher ── */
function SectionSwitcher({ active, onChange }) {
  return (
    <div className={s.sectionSwitcher}>
      {SECTIONS.map(sec => {
        const isActive = active === sec.id
        return (
          <button
            key={sec.id}
            className={`${s.sectionBtn} ${isActive ? s.sectionBtnActive : ''}`}
            onClick={() => onChange(sec.id)}
            title={!isActive ? sec.label : undefined}
          >
            <i className={`ti ${sec.icon} ${s.sectionIcon}`} />
            {isActive && <span className={s.sectionLabel}>{sec.label}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* ── Survey Items panel ── */
function SurveyPanel() {
  const addedItems   = useLegacyStore(s => s.addedItems)
  const toggleItem   = useLegacyStore(s => s.toggleItem)
  const setIsDragging = useLegacyStore(s => s.setIsDragging)
  const [surveyDetailsOpen, setSurveyDetailsOpen] = useState(true)

  return (
    <div className={s.panelBody}>
      <div className={`${s.catItem} ${surveyDetailsOpen ? s.catOpen : ''}`}>
        <div className={s.catTrigger} onClick={() => setSurveyDetailsOpen(o => !o)}>
          <i className={`ti ti-chevron-right ${s.catChevron}`} />
          <span className={s.catLabel}>Survey Details</span>
        </div>
        {surveyDetailsOpen && (
          <div className={s.catBody}>
            {['Survey year', 'Survey month', 'U.S.- Iran military conflict 2026', 'Split topic by group'].map(label => (
              <div
                key={label}
                className={`${s.surveyItem} ${addedItems.includes(label) ? s.surveyItemAdded : ''}`}
                draggable
                onDragStart={e => {
                  wasDragging = true
                  e.dataTransfer.setData('text/plain', JSON.stringify({ name: label, source: 'sidebar' }))
                  e.dataTransfer.effectAllowed = 'move'
                  setIsDragging(true)
                }}
                onDragEnd={() => { setIsDragging(false); setTimeout(() => { wasDragging = false }, 0) }}
                onClick={() => { if (wasDragging) return; toggleItem(label) }}
              >
                <i className={`ti ti-grip-vertical ${s.dragHandle}`} />
                <span className={s.itemLabel}>{label}</span>
                {addedItems.includes(label)
                  ? <IconRowRemove size={16} strokeWidth={2} className={s.itemAction} />
                  : <IconRowInsertBottom size={16} strokeWidth={2} className={s.itemAction} />
                }
              </div>
            ))}
          </div>
        )}
      </div>
      {categories.map(cat => (
        <CatItem key={cat.id} cat={cat} />
      ))}
    </div>
  )
}

/* ── Target Groups panel ── */
function TargetPanel() {
  const targetGroups         = useLegacyStore(s => s.targetGroups)
  const appliedFilterGroupId = useLegacyStore(s => s.appliedFilterGroupId)
  const openTargetGroupModal = useLegacyStore(s => s.openTargetGroupModal)
  const applyFilterGroup     = useLegacyStore(s => s.applyFilterGroup)
  const setIsDragging        = useLegacyStore(s => s.setIsDragging)
  const [customGroupsOpen, setCustomGroupsOpen] = useState(true)

  return (
    <div className={s.panelBody}>
      <div className={s.btnRow}>
        <button className={s.btnPrimary} onClick={() => openTargetGroupModal('create')}>
          Create target group
        </button>
      </div>

      <div
        className={`${s.subHeader} ${s.subHeaderPrimary} ${customGroupsOpen ? s.subHeaderOpen : ''}`}
        onClick={() => setCustomGroupsOpen(o => !o)}
        style={{ cursor: 'pointer' }}
      >
        <i className={`ti ${customGroupsOpen ? 'ti-chevron-down' : 'ti-chevron-right'} ${s.subChevron}`} />
        <span className={s.subLabel}>Custom target groups</span>
        <span className={s.badge}>{targetGroups.length}</span>
      </div>

      {customGroupsOpen && targetGroups.map(g => {
        const isApplied = appliedFilterGroupId === g.id
        return (
          <div
            key={g.id}
            className={s.targetItem}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('text/plain', JSON.stringify({ id: g.id, name: g.name, source: 'target-group' }))
              e.dataTransfer.effectAllowed = 'move'
              setIsDragging(true)
            }}
            onDragEnd={() => setIsDragging(false)}
          >
            <i className={`ti ti-grip-vertical ${s.dragHandle}`} />
            <span className={s.dragLabel} title={g.name}>{g.name}</span>
            <button
              className={s.dragActionBtn}
              onClick={() => openTargetGroupModal(g.id)}
              title="Edit target group"
            >
              <i className={`ti ti-pencil ${s.dragAction}`} />
            </button>
            <button
              className={`${s.dragActionBtn} ${isApplied ? s.dragActionApplied : ''}`}
              onClick={() => applyFilterGroup(isApplied ? null : g.id)}
              title={isApplied ? 'Remove filter' : 'Apply as filter'}
            >
              <i className={`ti ${isApplied ? 'ti-check' : 'ti-plus'} ${s.dragAction}`} />
            </button>
          </div>
        )
      })}

      {customGroupsOpen && targetGroups.length === 0 && (
        <div className={s.emptyGroups}>No custom target groups yet.</div>
      )}

      <div className={s.subHeader}>
        <i className={`ti ti-chevron-right ${s.subChevron}`} />
        <span className={s.subLabel}>Predefined target groups</span>
        <span className={s.badge}>170</span>
      </div>
    </div>
  )
}

/* ── Sidebar ── */
export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('survey')
  const [currentSurvey, setCurrentSurvey] = useState('global')
  const [surveyOpen, setSurveyOpen] = useState(false)
  const surveyRef = useRef(null)

  useEffect(() => {
    if (!surveyOpen) return
    function handleClick(e) {
      if (surveyRef.current && !surveyRef.current.contains(e.target)) setSurveyOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [surveyOpen])

  return (
    <aside className={s.sidebar}>
      {/* Survey selector */}
      <div className={s.header} ref={surveyRef}>
        <button
          className={`${s.surveyTrigger} ${surveyOpen ? s.surveyTriggerOpen : ''}`}
          onClick={() => setSurveyOpen(o => !o)}
        >
          {SURVEYS.find(sv => sv.id === currentSurvey)?.label ?? 'Global Survey'}
          <i className="ti ti-chevron-down" />
        </button>
        {surveyOpen && (
          <div className={s.surveyDropdown}>
            {SURVEYS.map(sv => {
              const active = sv.id === currentSurvey
              return (
                <div
                  key={sv.id}
                  className={`${s.surveyOption} ${active ? s.surveyOptionActive : ''}`}
                  onClick={() => { setCurrentSurvey(sv.id); setSurveyOpen(false) }}
                >
                  <div className={`${s.surveyRadio} ${active ? s.surveyRadioActive : ''}`}>
                    {active && <div className={s.surveyRadioDot} />}
                  </div>
                  <div className={s.surveyOptionContent}>
                    <div className={s.surveyOptionTitle}>
                      {sv.label}
                      {sv.badge && <span className={s.surveyBadge}>{sv.badge}</span>}
                    </div>
                    <div className={s.surveyOptionDesc}>{sv.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Search */}
      <div className={s.sidebarSearch}>
        <i className="ti ti-search" />
        <input className={s.sidebarSearchInput} type="text" placeholder="Search topics or brands…" />
      </div>

      {/* Section switcher */}
      <SectionSwitcher active={activeSection} onChange={setActiveSection} />

      {/* Active panel */}
      {activeSection === 'survey' ? <SurveyPanel /> : <TargetPanel />}
    </aside>
  )
}
