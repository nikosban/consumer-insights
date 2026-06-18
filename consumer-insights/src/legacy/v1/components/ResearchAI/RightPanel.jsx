import { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import s from './RightPanel.module.css'
import { SOURCES } from '../../data/ciModeData'
import TypeIcon from './TypeIcon'

/* ── Source tooltip (portal) ── */
function SourceTooltip({ sourceIndex, anchorRect }) {
  if (!sourceIndex || !anchorRect) return null
  const source = SOURCES[sourceIndex - 1]
  if (!source) return null

  const tooltipWidth = 320
  const TOOLTIP_H = 270
  const midX = anchorRect.left + anchorRect.width / 2
  const left = Math.max(8, Math.min(midX - tooltipWidth / 2, window.innerWidth - tooltipWidth - 8))
  const arrowLeft = midX - left - 6
  const showBelow = anchorRect.top < TOOLTIP_H + 10
  const FF = "'Open Sans', system-ui, sans-serif"

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: showBelow ? anchorRect.bottom + 10 : anchorRect.top - 10, left, transform: showBelow ? 'none' : 'translateY(-100%)', width: tooltipWidth, zIndex: 2000, fontFamily: FF }}>
      <div className={s.tooltip}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className={s.tooltipTypeRow}>
            <div className={s.tooltipLabel}>
              <TypeIcon type={source.type} size={20} />
              <span style={{ fontSize: 13, color: '#455f7c', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}>{source.label}</span>
            </div>
            <div className={s.tooltipSourcePill}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#455f7c' }}>Source</span>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#093b7f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white', lineHeight: 1 }}>{sourceIndex}</span>
              </div>
            </div>
          </div>
          <div className={s.tooltipTitle}>{source.title}</div>
        </div>
        <p className={s.tooltipDesc}>{source.desc}</p>
        {(source.lastUpdate || source.released || source.surveyPeriod) && (
          <div className={s.tooltipMeta}>
            {source.lastUpdate && <div className={s.tooltipMetaItem}><span className={s.tooltipMetaLabel}>Last update</span><span className={s.tooltipMetaValue}>{source.lastUpdate}</span></div>}
            {source.released && <div className={s.tooltipMetaItem}><span className={s.tooltipMetaLabel}>Released</span><span className={s.tooltipMetaValue}>{source.released}</span></div>}
            {source.surveyPeriod && <div className={s.tooltipMetaItem}><span className={s.tooltipMetaLabel}>Survey period</span><span className={s.tooltipMetaValue}>{source.surveyPeriod}</span></div>}
          </div>
        )}
        <div className={s.tooltipAttribution}>{source.attribution || 'Statista'}</div>
      </div>
      {showBelow
        ? <div style={{ position: 'absolute', top: -6, left: arrowLeft, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid white' }} />
        : <div style={{ position: 'absolute', bottom: -6, left: arrowLeft, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white' }} />
      }
    </div>,
    document.body
  )
}

/* ── Source item (expanded view) ── */
function SourceItem({ source, index, hoveredSource, selectedSource, onSelect }) {
  const isActive = hoveredSource === index || selectedSource === index
  return (
    <div
      className={`${s.sourceItem} ${isActive ? s.sourceItemActive : ''}`}
      onClick={() => onSelect?.(index)}
    >
      <div className={`${s.badgeCircle} ${isActive ? s.badgeCircleActive : ''}`}>
        {index}
      </div>
      <div className={s.sourceContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TypeIcon type={source.type} size={14} />
          <span className={s.sourceLabel}>{source.label}</span>
        </div>
        <span className={s.sourceTitle}>{source.title}</span>
        {source.pills?.length > 0 && (
          <div className={s.sourcePills}>
            {source.pills.map(p => <span key={p} className={s.pill}>{p}</span>)}
          </div>
        )}
        {(selectedSource === index) && source.desc && (
          <p className={s.sourceDesc}>{source.desc}</p>
        )}
      </div>
    </div>
  )
}

/* ── RightPanel ── */
export default function RightPanel({ hoveredSource, selectedSource, onSourceSelect }) {
  const scrollRef = useRef(null)
  const itemRefs = useRef([])
  const [expanded, setExpanded] = useState(false)
  const [tooltipIdx, setTooltipIdx] = useState(null)
  const [tooltipRect, setTooltipRect] = useState(null)

  useEffect(() => {
    if (!hoveredSource) return
    const item = itemRefs.current[hoveredSource - 1]
    const container = scrollRef.current
    if (!item || !container) return
    const itemRect = item.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [hoveredSource])

  return (
    <div
      className={s.panel}
      style={{ width: expanded ? 320 : 64 }}
    >
      {/* Toggle header */}
      <div className={s.header}>
        <button
          className={s.toggleBtn}
          onClick={() => setExpanded(v => !v)}
          title={expanded ? 'Collapse sources' : 'Expand sources'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h10" stroke="#455f7c" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        {expanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            <span className={s.headerTitle}>Sources</span>
            <span className={s.countBadge}>{SOURCES.length}</span>
          </div>
        )}
      </div>

      {/* Rail (collapsed) */}
      {!expanded && (
        <div className={s.railList} ref={scrollRef}>
          {SOURCES.map((_, i) => {
            const idx = i + 1
            const isActive = hoveredSource === idx || selectedSource === idx
            return (
              <div
                key={idx}
                ref={el => { itemRefs.current[i] = el }}
                className={`${s.railItem} ${isActive ? s.railItemActive : ''}`}
                onMouseEnter={e => { setTooltipIdx(idx); setTooltipRect(e.currentTarget.getBoundingClientRect()) }}
                onMouseLeave={() => { setTooltipIdx(null); setTooltipRect(null) }}
                onClick={() => onSourceSelect?.(idx)}
              >
                {idx}
              </div>
            )
          })}
        </div>
      )}

      {/* Expanded list */}
      {expanded && (
        <div className={s.list} ref={scrollRef}>
          {SOURCES.map((source, i) => {
            const idx = i + 1
            return (
              <div key={idx} ref={el => { itemRefs.current[i] = el }}>
                <SourceItem
                  source={source}
                  index={idx}
                  hoveredSource={hoveredSource}
                  selectedSource={selectedSource}
                  onSelect={onSourceSelect}
                />
              </div>
            )
          })}
        </div>
      )}

      {tooltipIdx && tooltipRect && (
        <SourceTooltip sourceIndex={tooltipIdx} anchorRect={tooltipRect} />
      )}
    </div>
  )
}
