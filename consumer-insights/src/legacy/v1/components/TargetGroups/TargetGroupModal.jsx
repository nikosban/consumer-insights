import { useState, useMemo } from 'react'
import { categories } from '../../data/sidebarData'
import { useLegacyStore } from '../../store/legacyStore'
import s from './TargetGroupModal.module.css'

function ModalInner({ existingGroup }) {
  const selectedCountry = useLegacyStore(st => st.selectedCountry)
  const selectedYear = useLegacyStore(st => st.selectedYear)
  const targetGroups = useLegacyStore(st => st.targetGroups)
  const closeTargetGroupModal = useLegacyStore(st => st.closeTargetGroupModal)
  const saveTargetGroup = useLegacyStore(st => st.saveTargetGroup)
  const deleteTargetGroup = useLegacyStore(st => st.deleteTargetGroup)

  const [name, setName] = useState(existingGroup?.name ?? 'Unnamed Target Group')
  const [selections, setSelections] = useState(existingGroup?.selections ?? [])
  const [expandedCats, setExpandedCats] = useState([])
  const [activeSubcat, setActiveSubcat] = useState(null)

  const isNameEmpty = name.trim() === ''
  const isDuplicate = targetGroups.some(
    g => g.id !== existingGroup?.id && g.name.toLowerCase() === name.trim().toLowerCase()
  )
  const canSave = !isNameEmpty && !isDuplicate

  const respondentCount = useMemo(() => {
    if (selections.length === 0) return 0
    const hash = selections.reduce((acc, sel) => acc + sel.item.length * 7 + sel.catId.charCodeAt(0), 0)
    return Math.floor(60236 * Math.min(0.94, 0.06 + (hash % 89) / 100))
  }, [selections])

  function toggleCat(catId) {
    setExpandedCats(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  function selectSubcat(cat, subcat) {
    setActiveSubcat({ catId: cat.id, catLabel: cat.label, subcatId: subcat.id, subcatLabel: subcat.label, items: subcat.items })
  }

  function toggleItem(item) {
    const already = selections.some(sel => sel.catId === activeSubcat.catId && sel.subcatId === activeSubcat.subcatId && sel.item === item)
    if (already) {
      setSelections(prev => prev.filter(sel => !(sel.catId === activeSubcat.catId && sel.subcatId === activeSubcat.subcatId && sel.item === item)))
    } else {
      setSelections(prev => [...prev, {
        catId: activeSubcat.catId,
        catLabel: activeSubcat.catLabel,
        subcatId: activeSubcat.subcatId,
        subcatLabel: activeSubcat.subcatLabel,
        item,
      }])
    }
  }

  function deselectAll() {
    if (!activeSubcat) return
    setSelections(prev => prev.filter(sel => !(sel.catId === activeSubcat.catId && sel.subcatId === activeSubcat.subcatId)))
  }

  function removeItem(sel) {
    setSelections(prev => prev.filter(s => !(s.catId === sel.catId && s.subcatId === sel.subcatId && s.item === sel.item)))
  }

  function clearAll() {
    setSelections([])
  }

  function handleSave() {
    if (!canSave) return
    saveTargetGroup({ id: existingGroup?.id, name: name.trim(), selections })
    closeTargetGroupModal()
  }

  function handleDelete() {
    deleteTargetGroup(existingGroup.id)
    closeTargetGroupModal()
  }

  const selectionGroups = useMemo(() => {
    const map = {}
    selections.forEach(sel => {
      if (!map[sel.catLabel]) map[sel.catLabel] = []
      map[sel.catLabel].push(sel)
    })
    return Object.entries(map)
  }, [selections])

  const isEdit = !!existingGroup

  return (
    <div className={s.backdrop} onClick={e => { if (e.target === e.currentTarget) closeTargetGroupModal() }}>
      <div className={s.modal}>

        {/* Close button — absolute top-right */}
        <button className={s.closeBtn} onClick={closeTargetGroupModal}>
          <i className="ti ti-x" />
        </button>

        {/* Header */}
        <div className={s.header}>
          <div className={s.titleRow}>
            <span className={s.title}>{isEdit ? 'Edit target group' : 'Create target group'}</span>
            <div className={s.headerBtns}>
              {isEdit && (
                <button className={s.deleteBtn} onClick={handleDelete}>
                  Delete target group
                </button>
              )}
              <button className={s.saveBtn} onClick={handleSave} disabled={!canSave}>
                {isEdit ? 'Save changes and close' : 'Save and close'}
              </button>
            </div>
          </div>

          <div className={s.selectionRow}>
            <span className={s.selectionLabel}>Current selection:</span>
            <span className={s.chip}>{selectedCountry.name}</span>
            <span className={s.chip}>{selectedYear}</span>
          </div>
        </div>

        {/* Content */}
        <div className={s.content}>
          <input
            className={s.nameInput}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Unnamed Target Group"
          />
          {isDuplicate && <div className={s.nameError}>This target group title is already in use.</div>}

          {/* Three columns */}
          <div className={s.columns}>

            {/* Col 1: Items */}
            <div className={s.colItems}>
              <div className={s.colHeaderArea}>
                <div className={s.colTitleRow}>
                  <span className={s.badge}>1</span>
                  <span className={s.colTitle}>ITEMS</span>
                </div>
                <span className={s.colSubtitle}>Pick items to create your own target group</span>
              </div>
              <div className={s.colBody}>
                {categories.map(cat => (
                  <div key={cat.id}>
                    <div className={s.listRow} onClick={() => toggleCat(cat.id)}>
                      <i className={`ti ${expandedCats.includes(cat.id) ? 'ti-chevron-down' : 'ti-chevron-right'}`} />
                      <span>{cat.label}</span>
                    </div>
                    {expandedCats.includes(cat.id) && cat.subcats.map(subcat => (
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
              <div className={s.colHeaderArea}>
                <div className={s.colTitleRow}>
                  <span className={s.badge}>2</span>
                  <span className={s.colTitle}>Characteristics</span>
                </div>
                <div className={s.colSubRow}>
                  <span className={s.colSubtitle}>{activeSubcat?.subcatLabel ?? ''}</span>
                  {activeSubcat && (
                    <button className={s.actionLink} onClick={deselectAll}>Deselect All</button>
                  )}
                </div>
              </div>
              <div className={s.colBody}>
                {activeSubcat ? (
                  activeSubcat.items.map(item => {
                    const checked = selections.some(sel => sel.catId === activeSubcat.catId && sel.subcatId === activeSubcat.subcatId && sel.item === item)
                    return (
                      <label key={item} className={`${s.checkRow} ${checked ? s.checkRowChecked : ''}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleItem(item)} />
                        {item}
                      </label>
                    )
                  })
                ) : (
                  <div className={s.emptyState}>Select a subcategory from the left to view characteristics.</div>
                )}
              </div>
            </div>

            {/* Col 3: Your selection */}
            <div className={s.colSelection}>
              <div className={s.colHeaderArea}>
                <div className={s.colTitleRow}>
                  <span className={s.badge}>2</span>
                  <span className={s.colTitle}>Your selection</span>
                </div>
                <div className={s.colSubRow}>
                  <span />
                  {selections.length > 0 && (
                    <button className={s.actionLink} onClick={clearAll}>Clear all</button>
                  )}
                </div>
              </div>
              <div className={s.selectionBody}>
                {selectionGroups.length === 0 ? (
                  <div className={s.emptyState}>No items selected yet.</div>
                ) : (
                  selectionGroups.map(([catLabel, items]) => (
                    <div key={catLabel}>
                      <div className={s.selGroupLabel}>{catLabel.toUpperCase()}</div>
                      {items.map(sel => (
                        <div key={sel.item} className={s.selItem}>
                          <span className={s.selItemText}>{sel.item}</span>
                          <button className={s.removeBtn} onClick={() => removeItem(sel)}>
                            <i className="ti ti-trash" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={s.footer}>
            Number of respondents: {respondentCount.toLocaleString()}
          </div>
        </div>

      </div>
    </div>
  )
}

export default function TargetGroupModal() {
  const targetGroupModalId = useLegacyStore(s => s.targetGroupModalId)
  const targetGroups = useLegacyStore(s => s.targetGroups)

  if (!targetGroupModalId) return null

  const existingGroup = targetGroupModalId !== 'create'
    ? targetGroups.find(g => g.id === targetGroupModalId) ?? null
    : null

  return <ModalInner key={targetGroupModalId} existingGroup={existingGroup} />
}
