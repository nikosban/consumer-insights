import { useState, useMemo } from 'react'
import { categories } from '../../data/sidebarData'
import { useLegacyStore } from '../../store/legacyStore'
import s from './TargetGroupModal.module.css'

function initGroups(existingGroup) {
  if (!existingGroup?.selectionGroups) {
    if (!existingGroup?.selections?.length) return []
    const map = {}
    existingGroup.selections.forEach(sel => {
      if (!map[sel.catLabel]) {
        map[sel.catLabel] = { catLabel: sel.catLabel, catId: sel.catId, intraOp: 'OR', interOp: 'AND', items: [] }
      }
      map[sel.catLabel].items.push(sel)
    })
    return Object.values(map)
  }
  return existingGroup.selectionGroups
}

function ModalInner({ existingGroup }) {
  const selectedCountry       = useLegacyStore(st => st.selectedCountry)
  const selectedYear          = useLegacyStore(st => st.selectedYear)
  const targetGroups          = useLegacyStore(st => st.targetGroups)
  const closeTargetGroupModal = useLegacyStore(st => st.closeTargetGroupModal)
  const saveTargetGroup       = useLegacyStore(st => st.saveTargetGroup)
  const deleteTargetGroup     = useLegacyStore(st => st.deleteTargetGroup)

  const [name, setName]                 = useState(existingGroup?.name ?? 'Unnamed Target Group')
  const [selectionGroups, setGroups]    = useState(() => initGroups(existingGroup))
  const [expandedCats, setExpandedCats] = useState([])
  const [activeSubcat, setActiveSubcat] = useState(null)
  const [itemSearch, setItemSearch] = useState('')

  const isNameEmpty  = name.trim() === ''
  const totalItems   = selectionGroups.reduce((n, g) => n + g.items.length, 0)
  const isDuplicate  = targetGroups.some(
    g => g.id !== existingGroup?.id && g.name.toLowerCase() === name.trim().toLowerCase()
  )
  const canSave = !isNameEmpty && !isDuplicate

  const respondentCount = useMemo(() => {
    if (totalItems === 0) return 0
    const hash = selectionGroups.reduce((acc, g) =>
      acc + g.items.reduce((a, i) => a + i.item.length * 7 + g.catLabel.charCodeAt(0), 0), 0)
    return Math.floor(60236 * Math.min(0.94, 0.06 + (hash % 89) / 100))
  }, [selectionGroups, totalItems])

  const filteredCategories = useMemo(() => {
    const q = itemSearch.trim().toLowerCase()
    if (!q) return categories
    return categories.reduce((acc, cat) => {
      if (cat.label.toLowerCase().includes(q)) {
        return [...acc, cat]
      }
      const matchingSubs = cat.subcats.filter(s => s.label.toLowerCase().includes(q))
      if (matchingSubs.length > 0) {
        return [...acc, { ...cat, subcats: matchingSubs }]
      }
      return acc
    }, [])
  }, [itemSearch])

  function toggleCat(catId) {
    setExpandedCats(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId])
  }

  function selectSubcat(cat, subcat) {
    setActiveSubcat({ catId: cat.id, catLabel: cat.label, subcatId: subcat.id, subcatLabel: subcat.label, items: subcat.items })
  }

  function toggleItem(item) {
    if (!activeSubcat) return
    const { catId, catLabel, subcatId, subcatLabel } = activeSubcat
    setGroups(prev => {
      const gi = prev.findIndex(g => g.catLabel === catLabel)
      if (gi >= 0) {
        const group = prev[gi]
        const already = group.items.some(i => i.subcatId === subcatId && i.item === item)
        if (already) {
          const newItems = group.items.filter(i => !(i.subcatId === subcatId && i.item === item))
          if (newItems.length === 0) return prev.filter((_, i) => i !== gi)
          return prev.map((g, i) => i === gi ? { ...g, items: newItems } : g)
        } else {
          return prev.map((g, i) => i === gi
            ? { ...g, items: [...g.items, { catId, catLabel, subcatId, subcatLabel, item }] }
            : g)
        }
      } else {
        return [...prev, { catLabel, catId, intraOp: 'OR', interOp: 'AND', items: [{ catId, catLabel, subcatId, subcatLabel, item }] }]
      }
    })
  }

  function isChecked(item) {
    if (!activeSubcat) return false
    return selectionGroups.find(g => g.catLabel === activeSubcat.catLabel)
      ?.items.some(i => i.subcatId === activeSubcat.subcatId && i.item === item) ?? false
  }

  function deselectAll() {
    if (!activeSubcat) return
    setGroups(prev => prev.reduce((acc, group) => {
      if (group.catLabel !== activeSubcat.catLabel) return [...acc, group]
      const newItems = group.items.filter(i => i.subcatId !== activeSubcat.subcatId)
      return newItems.length === 0 ? acc : [...acc, { ...group, items: newItems }]
    }, []))
  }

  function removeItem(catLabel, item) {
    setGroups(prev => prev.reduce((acc, group) => {
      if (group.catLabel !== catLabel) return [...acc, group]
      const newItems = group.items.filter(i => i.item !== item)
      return newItems.length === 0 ? acc : [...acc, { ...group, items: newItems }]
    }, []))
  }

  function clearAll() { setGroups([]) }

  function toggleIntraOp(catLabel) {
    setGroups(prev => prev.map(g => g.catLabel === catLabel
      ? { ...g, intraOp: g.intraOp === 'OR' ? 'AND' : 'OR' }
      : g))
  }

  function toggleInterOp(gi) {
    setGroups(prev => prev.map((g, i) => i === gi
      ? { ...g, interOp: g.interOp === 'AND' ? 'OR' : 'AND' }
      : g))
  }

  function handleSave() {
    if (!canSave) return
    const selections = selectionGroups.flatMap(g => g.items)
    saveTargetGroup({ id: existingGroup?.id, name: name.trim(), selections, selectionGroups })
    closeTargetGroupModal()
  }

  function handleDelete() {
    deleteTargetGroup(existingGroup.id)
    closeTargetGroupModal()
  }

  const isEdit = !!existingGroup

  return (
    <div className={s.backdrop} onClick={e => { if (e.target === e.currentTarget) closeTargetGroupModal() }}>
      <div className={s.modal}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.titleRow}>
            <span className={s.title}>{isEdit ? 'Edit target group' : 'Create target group'}</span>
            <div className={s.headerBtns}>
              {isEdit && (
                <button className={s.iconBtn} onClick={handleDelete} title="Delete target group">
                  <i className="ti ti-trash" />
                </button>
              )}
              <button className={s.saveBtn} onClick={handleSave} disabled={!canSave}>
                {isEdit ? 'Update' : 'Save'}
              </button>
              <button className={s.iconBtn} onClick={closeTargetGroupModal} title="Close">
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
          <div className={s.metaRow}>
            <input
              className={s.nameInput}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Unnamed Target Group"
            />
<span className={s.chip}>{selectedCountry.name}</span>
            <span className={s.chip}>{selectedYear}</span>
          </div>
          {isDuplicate && <div className={s.nameError}>This target group title is already in use.</div>}
        </div>

        {/* Body */}
        <div className={s.body}>

          {/* Shared column header row — all three aligned */}
          <div className={s.colHeadersRow}>
            <div className={s.colHeaderItems}>
              <span className={s.colTitle}>Survey Items</span>
              <span className={s.colSubtitle}>Pick items to create your target group</span>
              <div className={s.searchWrap}>
                <i className="ti ti-search" />
                <input
                  className={s.searchInput}
                  value={itemSearch}
                  onChange={e => setItemSearch(e.target.value)}
                  placeholder="Search items…"
                />
                {itemSearch && (
                  <button className={s.searchClear} onClick={() => setItemSearch('')}>
                    <i className="ti ti-x" />
                  </button>
                )}
              </div>
            </div>
            <div className={s.colHeaderChars}>
              <div className={s.colTitleRow}>
                <span className={s.colTitle}>Characteristics</span>
                {activeSubcat && <button className={s.actionLink} onClick={deselectAll}>Deselect All</button>}
              </div>
              <span className={s.colSubtitle}>{activeSubcat?.subcatLabel ?? 'Select a subcategory to view options'}</span>
            </div>
            <div className={s.colHeaderSel}>
              <div className={s.colTitleRow}>
                <span className={s.colTitle}>Your selection</span>
                {selectionGroups.length > 0 && (
                  <button className={s.actionLink} onClick={clearAll}>Clear all</button>
                )}
              </div>
              <span className={s.colSubtitle}>Review and configure your target group</span>
            </div>
          </div>

          {/* Column bodies */}
          <div className={s.colBodies}>

            {/* Col 1: Items */}
            <div className={s.colItems}>
              <div className={s.colBody}>
                {filteredCategories.map(cat => (
                  <div key={cat.id}>
                    <div className={s.listRow} onClick={() => toggleCat(cat.id)}>
                      <i className={`ti ${(expandedCats.includes(cat.id) || itemSearch) ? 'ti-chevron-down' : 'ti-chevron-right'}`} />
                      <span>{cat.label}</span>
                    </div>
                    {(expandedCats.includes(cat.id) || itemSearch) && cat.subcats.map(subcat => (
                      <div
                        key={subcat.id}
                        className={`${s.subcatRow} ${activeSubcat?.subcatId === subcat.id && activeSubcat?.catId === cat.id ? s.subcatRowActive : ''}`}
                        onClick={() => selectSubcat(cat, subcat)}
                      >
                        {subcat.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Characteristics */}
            <div className={s.colChars}>
              <div className={s.colBody}>
                {activeSubcat ? (
                  activeSubcat.items.map(item => (
                    <label key={item} className={`${s.checkRow} ${isChecked(item) ? s.checkRowChecked : ''}`}>
                      <input type="checkbox" checked={isChecked(item)} onChange={() => toggleItem(item)} />
                      {item}
                    </label>
                  ))
                ) : (
                  <div className={s.emptyState}>Select a subcategory from the left to view characteristics.</div>
                )}
              </div>
            </div>

            {/* Col 3: Your selection */}
            <div className={s.selectionZone}>
              <div className={s.selectionGroups}>
                {selectionGroups.length === 0 ? (
                  <div className={s.emptyState}>No items selected yet.</div>
                ) : (
                  selectionGroups.map((group, gi) => (
                    <div key={group.catLabel} className={s.groupAndConnector}>
                      <div className={s.groupCard}>
                        <div className={s.groupLabel}>{group.catLabel.toUpperCase()}</div>
                        {group.items.map((item, ii) => (
                          <div key={item.item}>
                            {ii > 0 && (
                              <div className={s.opSwitcher}>
                                <button
                                  className={`${s.opSwitcherBtn} ${group.intraOp === 'AND' ? s.opSwitcherBtnActive : ''}`}
                                  onClick={() => group.intraOp !== 'AND' && toggleIntraOp(group.catLabel)}
                                >AND</button>
                                <button
                                  className={`${s.opSwitcherBtn} ${group.intraOp === 'OR' ? s.opSwitcherBtnActive : ''}`}
                                  onClick={() => group.intraOp !== 'OR' && toggleIntraOp(group.catLabel)}
                                >OR</button>
                              </div>
                            )}
                            <div className={s.selItem}>
                              <span className={s.selItemText}>{item.item}</span>
                              <button className={s.removeBtn} onClick={() => removeItem(group.catLabel, item.item)}>
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {gi < selectionGroups.length - 1 && (
                        <div className={s.interConnector}>
                          <div className={s.opSwitcher}>
                            <button
                              className={`${s.opSwitcherBtn} ${group.interOp === 'AND' ? s.opSwitcherBtnActive : ''}`}
                              onClick={() => group.interOp !== 'AND' && toggleInterOp(gi)}
                            >AND</button>
                            <button
                              className={`${s.opSwitcherBtn} ${group.interOp === 'OR' ? s.opSwitcherBtnActive : ''}`}
                              onClick={() => group.interOp !== 'OR' && toggleInterOp(gi)}
                            >OR</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className={s.footer}>
                Number of respondents: {respondentCount.toLocaleString()}
              </div>
            </div>

          </div>{/* colBodies */}
        </div>{/* body */}
      </div>{/* modal */}
    </div>
  )
}

export default function TargetGroupModal() {
  const targetGroupModalId = useLegacyStore(s => s.targetGroupModalId)
  const targetGroups       = useLegacyStore(s => s.targetGroups)

  if (!targetGroupModalId) return null

  const existingGroup = targetGroupModalId !== 'create'
    ? targetGroups.find(g => g.id === targetGroupModalId) ?? null
    : null

  return <ModalInner key={targetGroupModalId} existingGroup={existingGroup} />
}
