import { useEffect, useRef, useState } from 'react'
import { IconLayoutBottombarCollapseFilled, IconLayoutBottombarExpandFilled } from '@tabler/icons-react'
import { countries } from '../../data/countries'
import { years } from '../../data/sidebarData'
import { getCardData } from '../../data/cardData'
import { useLegacyStore } from '../../store/legacyStore'
import Dropdown, { DropdownItem } from './Dropdown'
import ZoneItem from './ZoneItem'
import s from './ControlsPanel.module.css'

function Zone({ zone, items, enabled = true }) {
  const [dragOver, setDragOver] = useState(false)
  const addedItems   = useLegacyStore(st => st.addedItems)
  const addToZone    = useLegacyStore(st => st.addToZone)
  const removeFromZone = useLegacyStore(st => st.removeFromZone)
  const moveZoneItem = useLegacyStore(st => st.moveZoneItem)
  const toggleItem   = useLegacyStore(st => st.toggleItem)

  const placeholder = zone === 'col'
    ? (enabled ? 'Drag and drop an item here to select column headings and switch to cross table (optional).' : 'Add a row first to enable columns.')
    : 'Drag and drop items here to select rows.'

  function handleDragOver(e) {
    if (!enabled) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  function handleDrop(e) {
    if (!enabled) return
    e.preventDefault()
    setDragOver(false)
    try {
      const { name, source } = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (source === 'sidebar') {
        if (!addedItems.includes(name)) toggleItem(name, zone)
        else if (!items.includes(name)) addToZone(zone, name)
      } else if (source !== zone) {
        moveZoneItem(source, name)
      }
    } catch (_) {}
  }

  return (
    <div
      className={`${s.zoneContent} ${!enabled ? s.zoneDisabled : dragOver ? s.zoneOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {items.map(name => {
        const data = getCardData(name)
        const answers = data.rows.filter(r => !r.isBase).map(r => r.label)
        return (
          <ZoneItem
            key={name}
            name={name}
            answers={answers}
            zone={zone}
            onRemove={() => removeFromZone(zone, name)}
            onMoveToOther={() => moveZoneItem(zone, name)}
            onScrollTo={() => {
              const el = [...document.querySelectorAll('[class*="card"]')]
                .find(c => c.querySelector('[class*="title"]')?.textContent.trim() === name)
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
        )
      })}
      {items.length === 0 && (
        <div className={s.dropTarget}>{placeholder}</div>
      )}
    </div>
  )
}

export default function ControlsPanel() {
  const selectedCountry      = useLegacyStore(s => s.selectedCountry)
  const selectedYear         = useLegacyStore(s => s.selectedYear)
  const openDropdown         = useLegacyStore(s => s.openDropdown)
  const displayOptionsOpen   = useLegacyStore(s => s.displayOptionsOpen)
  const displayOptions       = useLegacyStore(s => s.displayOptions)
  const isDragging           = useLegacyStore(s => s.isDragging)
  const selectionHidden      = useLegacyStore(s => s.selectionHidden)
  const rowItems             = useLegacyStore(s => s.rowItems)
  const colItems             = useLegacyStore(s => s.colItems)
  const targetGroups         = useLegacyStore(s => s.targetGroups)
  const appliedFilterGroupId = useLegacyStore(s => s.appliedFilterGroupId)
  const applyFilterGroup     = useLegacyStore(s => s.applyFilterGroup)
  const appliedFilterGroup   = targetGroups.find(g => g.id === appliedFilterGroupId) ?? null

  const setSelectedCountry   = useLegacyStore(s => s.setSelectedCountry)
  const setSelectedYear      = useLegacyStore(s => s.setSelectedYear)
  const setOpenDropdown      = useLegacyStore(s => s.setOpenDropdown)
  const toggleDisplayOptionsOpen = useLegacyStore(s => s.toggleDisplayOptionsOpen)
  const toggleDisplayOption  = useLegacyStore(s => s.toggleDisplayOption)
  const toggleSelectionHidden = useLegacyStore(s => s.toggleSelectionHidden)
  const clearAll             = useLegacyStore(s => s.clearAll)

  const colEnabled = rowItems.length > 0

  const displayPanelRef = useRef(null)
  useEffect(() => {
    if (!displayOptionsOpen) return
    function handleClick(e) {
      if (displayPanelRef.current && !displayPanelRef.current.contains(e.target)) {
        toggleDisplayOptionsOpen()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [displayOptionsOpen, toggleDisplayOptionsOpen])

  const [filterDragOver, setFilterDragOver] = useState(false)

  function handleFilterDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setFilterDragOver(true)
  }

  function handleFilterDrop(e) {
    e.preventDefault()
    setFilterDragOver(false)
    try {
      const { id, source } = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (source === 'target-group' && id) applyFilterGroup(id)
    } catch (_) {}
  }

  return (
    <section className={`${s.controls} ${isDragging ? s.dragging : ''}`}>
      <div className={s.controlsBar}>
        <div className={s.filters}>
          <Dropdown
            id="country"
            value={<><span className={`fi ${selectedCountry.flag}`} /> {selectedCountry.name.length > 16 ? selectedCountry.name.slice(0, 14) + '…' : selectedCountry.name}</>}
            open={openDropdown === 'country'}
            onToggle={setOpenDropdown}
          >
            {countries.map(c => (
              <DropdownItem key={c.code} selected={c.code === selectedCountry.code} onClick={() => { setSelectedCountry(c); setOpenDropdown(null) }}>
                <span className={`fi ${c.flag}`} /> {c.name}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown
            id="year"
            value={selectedYear}
            open={openDropdown === 'year'}
            onToggle={setOpenDropdown}
          >
            {years.map(y => (
              <DropdownItem key={y} selected={y === selectedYear} onClick={() => { setSelectedYear(y); setOpenDropdown(null) }}>
                {y}
              </DropdownItem>
            ))}
          </Dropdown>

          <div style={{ position: 'relative' }} ref={displayPanelRef}>
            <button
              className={`${s.customizeBtn} ${displayOptionsOpen ? s.customizeBtnOpen : ''}`}
              onClick={toggleDisplayOptionsOpen}
            >
              <i className="ti ti-adjustments-horizontal" />
              Customize View
            </button>
            {displayOptionsOpen && (
              <div className={s.displayPanel}>
                <div className={s.dopTitle}>CUSTOMIZE DATA VIEW</div>
                <div className={s.dopSubtitle}>Your selection applies to all tables.</div>
                {[
                  { id: 'absolute',   label: 'Absolute',   desc: 'Shows the number of respondents.' },
                  { id: 'population', label: 'Population', desc: 'Shows the estimated population represented in million.' },
                  { id: 'percent',    label: 'Index',      desc: 'Shows the index value for respondents.' },
                  { id: 'total',      label: 'Total share of all respondents', desc: 'Calculates results for all base labels.', disabled: true },
                ].map(opt => (
                  <div key={opt.id} className={s.dopItem}>
                    <input
                      className={s.dopCheckbox}
                      type="checkbox"
                      id={`dop-${opt.id}`}
                      disabled={opt.disabled}
                      checked={opt.disabled ? false : (displayOptions?.[opt.id] ?? true)}
                      onChange={() => !opt.disabled && toggleDisplayOption(opt.id)}
                    />
                    <div className={s.dopText}>
                      <label className={`${s.dopLabel} ${opt.disabled ? s.dopLabelDisabled : ''}`} htmlFor={`dop-${opt.id}`}>{opt.label}</label>
                      <span className={s.dopDesc}>{opt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={s.actions}>
          <button className={s.btnOutline} onClick={toggleSelectionHidden}>
            {selectionHidden
              ? <IconLayoutBottombarExpandFilled size={16} />
              : <IconLayoutBottombarCollapseFilled size={16} />
            }
            <span>{selectionHidden ? 'Show Setup' : 'Hide Setup'}</span>
          </button>

          <Dropdown id="download" value="Download" open={openDropdown === 'download'} onToggle={setOpenDropdown} alignRight primary>
            <DropdownItem onClick={() => setOpenDropdown(null)}>
              <div><div className={s.itemTitle}>CSV-Export</div><div className={s.itemSub}>Download .csv-file</div></div>
            </DropdownItem>
            <DropdownItem onClick={() => setOpenDropdown(null)}>
              <div><div className={s.itemTitle}>PPTX-Export</div><div className={s.itemSub}>Download .pptx-file</div></div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {isDragging && <div className={s.dragOverlay} />}

      {!selectionHidden && (
        <div className={s.dropZones}>
          <div className={s.dropRow}>
            <div className={`${s.dropZone} ${s.flex1} ${isDragging ? s.dropZoneActive : ''} ${isDragging && !colEnabled ? s.dropZoneLocked : ''}`}>
              <p className={s.dropLabel}>COLUMNS</p>
              <Zone zone="col" items={colItems} enabled={colEnabled} />
            </div>
            <div
              className={`${s.dropZone} ${s.filterZone} ${isDragging ? s.dropZoneActive : ''} ${filterDragOver ? s.zoneOver : ''}`}
              onDragOver={handleFilterDragOver}
              onDragLeave={() => setFilterDragOver(false)}
              onDrop={handleFilterDrop}
            >
              <p className={s.dropLabel}>FILTER</p>
              {appliedFilterGroup ? (
                <div className={s.appliedFilter}>
                  <i className="ti ti-users" />
                  <span className={s.appliedFilterName}>{appliedFilterGroup.name}</span>
                  <button className={s.filterRemoveBtn} onClick={() => applyFilterGroup(null)}>
                    <i className="ti ti-x" />
                  </button>
                </div>
              ) : (
                <div className={s.dropTarget}>Drag and drop a target group here or click "+" (optional).</div>
              )}
            </div>
          </div>
          <div className={`${s.dropZone} ${s.rowsZone} ${isDragging ? s.dropZoneActive : ''}`}>
            <p className={s.dropLabel}>ROWS</p>
            <Zone zone="row" items={rowItems} enabled />
          </div>
        </div>
      )}

      <div className={s.populationBar}>
        <div className={s.populationText}>
          <p>Population: 60,236 respondents, represent approx. 193.9m internet users in the United States, 18-64 years old</p>
          <div className={s.meta}>
            <p>Your selection: 60,236 respondents, potential: 100%, approx. 193.9m</p>
            <a href="#">View survey methodology</a>
            <span className={s.popDivider} />
            <a href="#">Request respondent level data <i className="ti ti-external-link" /></a>
          </div>
        </div>
        <a href="#" className={s.clearAll} onClick={e => { e.preventDefault(); clearAll() }}>Clear all</a>
      </div>
    </section>
  )
}
