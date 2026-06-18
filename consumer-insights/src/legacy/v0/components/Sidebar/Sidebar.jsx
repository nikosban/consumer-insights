import { useState } from 'react'
import { categories } from '../../data/sidebarData'
import { useLegacyStore } from '../../store/legacyStore'
import CatItem from './CatItem'
import s from './Sidebar.module.css'

let wasDragging = false

export default function Sidebar() {
  const openAccordion  = useLegacyStore(s => s.openAccordion)
  const addedItems     = useLegacyStore(s => s.addedItems)
  const setOpenAccordion = useLegacyStore(s => s.setOpenAccordion)
  const toggleItem     = useLegacyStore(s => s.toggleItem)
  const setIsDragging  = useLegacyStore(s => s.setIsDragging)
  const targetGroups   = useLegacyStore(s => s.targetGroups)
  const appliedFilterGroupId = useLegacyStore(s => s.appliedFilterGroupId)
  const openTargetGroupModal = useLegacyStore(s => s.openTargetGroupModal)
  const applyFilterGroup = useLegacyStore(s => s.applyFilterGroup)

  const [surveyDetailsOpen, setSurveyDetailsOpen] = useState(true)
  const [customGroupsOpen, setCustomGroupsOpen] = useState(true)

  return (
    <aside className={s.sidebar}>
      <div className={s.header}>Global Survey</div>

      <div className={s.accordion} data-open={openAccordion === 'survey'}>
        <button className={s.accordionTrigger} onClick={() => setOpenAccordion('survey')}>
          <i className={`ti ti-clipboard-list ${s.triggerIcon}`} />
          <span className={s.triggerLabel}>Survey Items</span>
          <i className={`ti ti-chevron-down ${s.triggerChevron} ${openAccordion === 'survey' ? s.chevronOpen : ''}`} />
        </button>
        {openAccordion === 'survey' && (
          <div className={s.accordionBody}>
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
                      <i className={`ti ${addedItems.includes(label) ? 'ti-minus' : 'ti-plus'} ${s.itemAction}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {categories.map(cat => (
              <CatItem key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>

      <div className={s.accordion} data-open={openAccordion === 'target'}>
        <button className={s.accordionTrigger} onClick={() => setOpenAccordion('target')}>
          <i className={`ti ti-users ${s.triggerIcon}`} />
          <span className={s.triggerLabel}>Target groups</span>
          <i className={`ti ti-chevron-down ${s.triggerChevron} ${openAccordion === 'target' ? s.chevronOpen : ''}`} />
        </button>
        {openAccordion === 'target' && (
          <div className={s.accordionBody}>
            <div className={s.btnRow}>
              <button className={s.btnPrimary} onClick={() => openTargetGroupModal('create')}>Create target group</button>
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
        )}
      </div>
    </aside>
  )
}
