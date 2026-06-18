import { useState, useRef, useEffect } from 'react'
import s from './ZoneItem.module.css'

export default function ZoneItem({ name, answers, zone, onRemove, onMoveToOther, onScrollTo }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [search, setSearch]         = useState('')
  const [checked, setChecked]       = useState(() => new Set(answers))
  const filterRef = useRef(null)
  const menuRef   = useRef(null)

  // Close popovers on outside click
  useEffect(() => {
    function handle(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
      if (menuRef.current   && !menuRef.current.contains(e.target))   setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const visibleAnswers = answers.filter(a => a.toLowerCase().includes(search.toLowerCase()))
  const allChecked     = answers.every(a => checked.has(a))

  function toggleAnswer(label) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function handleDeselectAll() {
    setChecked(allChecked ? new Set() : new Set(answers))
  }

  return (
    <div
      className={s.item}
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ name, source: zone }))
        e.dataTransfer.effectAllowed = 'move'
      }}
    >
      <i className={`ti ti-grip-vertical ${s.drag}`} />
      <span className={s.label}>{name}</span>

      {/* Filter button */}
      <div className={s.popoverWrap} ref={filterRef}>
        <button
          className={`${s.btn} ${filterOpen ? s.btnActive : ''}`}
          title="Filter answers"
          onClick={() => { setFilterOpen(o => !o); setMenuOpen(false) }}
        >
          <i className="ti ti-adjustments-horizontal" />
        </button>
        {filterOpen && (
          <div className={s.filterPopover}>
            <button className={s.deselectAll} onClick={handleDeselectAll}>
              {allChecked ? 'Deselect all' : 'Select all'}
            </button>
            <div className={s.searchWrap}>
              <input
                className={s.searchInput}
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search
                ? <button className={s.searchClear} onClick={() => setSearch('')}><i className="ti ti-x" /></button>
                : <i className={`ti ti-search ${s.searchIcon}`} />
              }
            </div>
            <div className={s.answerList}>
              {visibleAnswers.map(label => (
                <label key={label} className={s.answerRow}>
                  <input
                    type="checkbox"
                    className={s.answerCheck}
                    checked={checked.has(label)}
                    onChange={() => toggleAnswer(label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
              {visibleAnswers.length === 0 && (
                <span className={s.noResults}>No results</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Context menu button */}
      <div className={s.popoverWrap} ref={menuRef}>
        <button
          className={`${s.btn} ${menuOpen ? s.btnActive : ''}`}
          title="Options"
          onClick={() => { setMenuOpen(o => !o); setFilterOpen(false) }}
        >
          <i className="ti ti-chevron-right" />
        </button>
        {menuOpen && (
          <div className={s.contextMenu}>
            <button className={`${s.menuItem} ${s.menuItemMuted}`} onClick={() => { onMoveToOther(); setMenuOpen(false) }}>
              <span>{zone === 'row' ? 'Use as column' : 'Use as row'}</span>
              <i className="ti ti-arrow-up" />
            </button>
            <button className={s.menuItem} onClick={() => { onScrollTo(); setMenuOpen(false) }}>
              <span>Scroll to item</span>
              <i className="ti ti-link" />
            </button>
            <button className={s.menuItem} onClick={() => { onRemove(); setMenuOpen(false) }}>
              <span>Remove item</span>
              <i className="ti ti-trash" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
