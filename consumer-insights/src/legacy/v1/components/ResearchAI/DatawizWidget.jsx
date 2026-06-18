import { useState, useRef, useEffect } from 'react'
import { addWidget } from '../../hooks/useDashboard'

const WIDGET_DATA = [
  { year: '2019', value: 40.3 },
  { year: '2020', value: 53.2 },
  { year: '2021', value: 58.6 },
  { year: '2022', value: 63.1 },
  { year: '2023', value: 70.5 },
  { year: '2024', value: 74.8 },
  { year: '2025', value: 79.2 },
  { year: '2026', value: 83.7 },
  { year: '2027', value: 88.4 },
  { year: '2028', value: 93.0 },
  { year: '2029', value: 98.1 },
]

const FF = "'Open Sans', system-ui, sans-serif"

const DWIcons = {
  column: (active) => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="9" width="4" height="8" rx="0.5" fill={active ? '#0666e5' : '#455f7c'}/>
      <rect x="7" y="5" width="4" height="12" rx="0.5" fill={active ? '#0666e5' : '#455f7c'}/>
      <rect x="13" y="2" width="4" height="15" rx="0.5" fill={active ? '#0666e5' : '#455f7c'}/>
    </svg>
  ),
  line: (active) => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <polyline points="1,14 5,9 9,11 13,5 17,2" stroke={active ? '#0666e5' : '#455f7c'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  table: (active) => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="16" height="16" rx="1" stroke={active ? '#0666e5' : '#455f7c'} strokeWidth="1.5"/>
      <line x1="1" y1="6.5" x2="17" y2="6.5" stroke={active ? '#0666e5' : '#455f7c'} strokeWidth="1.5"/>
      <line x1="1" y1="11.5" x2="17" y2="11.5" stroke={active ? '#0666e5' : '#455f7c'} strokeWidth="1.5"/>
      <line x1="6.5" y1="6.5" x2="6.5" y2="17" stroke={active ? '#0666e5' : '#455f7c'} strokeWidth="1.5"/>
    </svg>
  ),
  funnel: () => (
    <svg width="16" height="16" viewBox="0 0 16 18" fill="none">
      <path d="M1 2.5h14L10 9v6l-4-2V9L1 2.5z" stroke="#455f7c" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  chevron: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="#455f7c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  info: (color = '#455F7C') => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3"/>
      <path d="M8 7v4M8 5.5V6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  download: (color = '#455F7C') => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.63 12.87a.65.65 0 010 1.3H4.5a.65.65 0 010-1.3h7.13zM8 1.85a.65.65 0 01.65.65v7.43l1.39-1.39a.65.65 0 01.96.88l-2.5 2.5a.65.65 0 01-.92 0l-2.5-2.5a.65.65 0 11.92-.92L7.35 9.94V2.5A.65.65 0 018 1.85z" fill={color}/>
    </svg>
  ),
  copy: (color = '#455F7C') => (
    <svg width="16" height="16" viewBox="5.5 5.5 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.95 6.46a.585.585 0 01.585.585v7.2a.585.585 0 01-.585.585H14.84v2.115a.585.585 0 01-.585.585H7.05a.585.585 0 01-.585-.585V9.75a.585.585 0 01.585-.585H9.16V7.046A.585.585 0 019.745 6.46H16.95zm-3.275 3.87H7.635v6.03h6.03v-6.03zm2.69-2.7h-6.03v1.535h3.915a.585.585 0 01.585.585v3.915h1.53V7.63z" fill={color}/>
    </svg>
  ),
}

function SupportTextBody({ expanded, onExpand, maxH = 240 }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ overflow: 'hidden', maxHeight: expanded ? 'none' : maxH }}>
        <div style={{ fontSize: 14, color: '#455f7c', lineHeight: '22px', fontFamily: FF }}>
          <p style={{ margin: '0 0 12px' }}>
            In 2024, total console market revenue reached an estimated 74.8 billion U.S. dollars, driven by hardware innovation and the rise of digital storefronts.
          </p>
          <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#0f2741' }}>What's driving growth?</p>
          <p style={{ margin: '0 0 12px' }}>
            Subscription services like PlayStation Plus and Xbox Game Pass now account for over 30% of total revenue, shifting monetization toward recurring digital income.
          </p>
          <p style={{ color: '#7b94a3', margin: '0 0 12px' }}>
            Forecast values through 2029 reflect a CAGR of ~5.5%, supported by next-gen hardware cycles and emerging market expansion.
          </p>
          <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#0f2741' }}>Platform mix</p>
          <p style={{ margin: 0 }}>
            Home consoles account for roughly 62% of total market revenue, with portable and hybrid systems making up the remainder. Cloud streaming platforms are growing but remain below 8% share in 2024.
          </p>
        </div>
      </div>
      {!expanded && (
        <>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 72,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), white)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'absolute', bottom: 8, right: 0 }}>
            <button
              onClick={onExpand}
              style={{
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'white', border: '1px solid #e0e0e0', borderRadius: 4,
                cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5v13M4 10.5l4 4 4-4" stroke="#455f7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function FooterBtn({ iconFn, onClick, tip }) {
  const [hovered, setHovered] = useState(false)
  const [tipRect, setTipRect] = useState(null)
  const ref = useRef(null)
  const color = hovered ? '#0055AA' : '#455F7C'
  return (
    <>
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => { setHovered(true); if (ref.current) setTipRect(ref.current.getBoundingClientRect()) }}
        onMouseLeave={() => { setHovered(false); setTipRect(null) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 11, background: hovered ? '#F5F8FB' : 'white',
          border: `1px solid ${hovered ? '#0055AA' : '#e0e0e0'}`,
          borderRadius: 6, cursor: 'pointer',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {iconFn(color)}
      </button>
      {hovered && tip && tipRect && (
        <div style={{
          position: 'fixed',
          top: tipRect.top - 40,
          left: tipRect.left + tipRect.width / 2,
          transform: 'translateX(-50%)',
          background: 'white', borderRadius: 4,
          boxShadow: '0px 5px 13px rgba(67,94,131,0.15)',
          height: 32, padding: '0 10px',
          display: 'flex', alignItems: 'center',
          whiteSpace: 'nowrap', zIndex: 2000, pointerEvents: 'none',
          fontFamily: FF, fontSize: 11, color: '#455f7c', lineHeight: '16px',
        }}>
          {tip}
        </div>
      )}
    </>
  )
}

export default function DatawizWidget() {
  const containerRef = useRef(null)
  const chartAreaRef = useRef(null)
  const [wrapW, setWrapW] = useState(900)
  const [chartAreaW, setChartAreaW] = useState(600)
  const [activeTab, setActiveTab] = useState('column')
  const [showSidebar, setShowSidebar] = useState(true)
  const [supportExpanded, setSupportExpanded] = useState(false)
  const [toggleHovered, setToggleHovered] = useState(false)
  const [hoverColor, setHoverColor] = useState(null)
  const [savedToast, setSavedToast] = useState(false)

  function handleAddToDashboard() {
    addWidget({
      title: 'Console gaming market worldwide',
      source: 'rai',
      chartType: 'bar',
      chartTitle: 'Console gaming market worldwide 2019–2029',
      data: WIDGET_DATA.map(d => ({ label: d.year, value: d.value, valueLabel: `${d.value}bn` })),
      meta: ['Source 1', 'Source 4'],
    })
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setWrapW(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = chartAreaRef.current
    if (!el) return
    const update = () => setChartAreaW(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isBig = wrapW >= 928 && showSidebar
  const isMini = wrapW < 538

  /* ── Chart geometry ── */
  const svgH = 240
  const padL = 44, padR = 8, padT = 16, padB = 28
  const cW = Math.max(chartAreaW, 80)
  const chartW = cW - padL - padR
  const chartH = svgH - padT - padB
  const maxVal = 110
  const yTicks = [0, 25, 50, 75, 100]
  const N = WIDGET_DATA.length
  const gW = chartW / N
  const toY = v => padT + chartH * (1 - v / maxVal)
  const baseY = toY(0)
  const toBarH = v => chartH * v / maxVal
  const groupInner = gW * 0.7
  const groupGap = (gW - groupInner) / 2
  const barW = Math.max(groupInner, 3)
  const showLabel = i => {
    if (cW < 320) return i === 0 || i === 5 || i === 10
    if (cW < 480) return i % 2 === 0
    return true
  }

  const gridAndAxis = yTicks.map(t => {
    const y = toY(t)
    return (
      <g key={t}>
        <line x1={padL} y1={y} x2={cW - padR} y2={y} stroke={t === 0 ? '#c4cfd8' : '#e8eef5'} strokeWidth={1}/>
        {t > 0 && <text x={padL - 5} y={y + 4} textAnchor="end" fontSize={10} fill="#7b94a3" fontFamily={FF}>{t}bn</text>}
      </g>
    )
  })

  const svgChart = (
    <svg width={cW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
      {gridAndAxis}
      {WIDGET_DATA.map((d, i) => {
        const x = padL + i * gW + groupGap
        const bh = toBarH(d.value)
        return (
          <g key={i}>
            <rect x={x} y={baseY - bh} width={Math.max(barW - 1.5, 2)} height={bh} fill="#0666e5" rx={2}/>
            {showLabel(i) && (
              <text x={padL + (i + 0.5) * gW} y={svgH - 5} textAnchor="middle" fontSize={9} fill="#7b94a3" fontFamily={FF} style={{ userSelect: 'none' }}>{d.year}</text>
            )}
          </g>
        )
      })}
    </svg>
  )

  const ptX = i => padL + (i + 0.5) * gW
  const svgLineChart = (
    <svg width={cW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="dw-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0666e5" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#0666e5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {gridAndAxis}
      <path
        d={[`M ${ptX(0)} ${toY(WIDGET_DATA[0].value)}`, ...WIDGET_DATA.map((d, i) => `L ${ptX(i)} ${toY(d.value)}`), `L ${ptX(N - 1)} ${baseY}`, `L ${ptX(0)} ${baseY}`, 'Z'].join(' ')}
        fill="url(#dw-line-grad)"
      />
      <polyline
        points={WIDGET_DATA.map((d, i) => `${ptX(i)},${toY(d.value)}`).join(' ')}
        stroke="#0666e5" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {WIDGET_DATA.map((d, i) => (
        <circle key={i} cx={ptX(i)} cy={toY(d.value)} r={3} fill="#0666e5" stroke="white" strokeWidth={2}/>
      ))}
      {WIDGET_DATA.map((d, i) => showLabel(i) && (
        <text key={i} x={ptX(i)} y={svgH - 5} textAnchor="middle" fontSize={9} fill="#7b94a3" fontFamily={FF} style={{ userSelect: 'none' }}>{d.year}</text>
      ))}
    </svg>
  )

  const tableChart = (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, lineHeight: '22px', fontFamily: FF }}>
          <thead>
            <tr style={{ background: '#f5f8fb' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#455f7c', fontWeight: 600, borderBottom: '2px solid #e5e5e5' }}>Year</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', color: '#455f7c', fontWeight: 600, borderBottom: '2px solid #e5e5e5' }}>Revenue (USD bn)</th>
            </tr>
          </thead>
          <tbody>
            {WIDGET_DATA.map((d, i) => (
              <tr key={i} style={{ background: 'white' }}>
                <td style={{ padding: '10px 12px', color: '#0f2741', fontWeight: 500, borderBottom: i < N - 1 ? '1px solid #f0f0f0' : 'none' }}>{d.year}</td>
                <td style={{ padding: '10px 12px', color: '#455f7c', textAlign: 'right', borderBottom: i < N - 1 ? '1px solid #f0f0f0' : 'none' }}>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const tabBtn = (id, label, iconFn) => {
    const active = activeTab === id
    return (
      <button onClick={() => setActiveTab(id)} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 2, border: 'none', cursor: 'pointer',
        background: active ? '#e5f1ff' : 'transparent',
        fontFamily: FF, fontSize: 14, fontWeight: 600,
        color: active ? '#0666e5' : '#0f2741', whiteSpace: 'nowrap',
      }}>
        {iconFn(active)}
        {!isMini && label}
      </button>
    )
  }

  const borderColor = hoverColor || '#e0e0e0'

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div style={{
        background: 'white',
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        transition: 'border-color 0.15s',
        width: '100%', overflow: 'hidden',
        position: 'relative', fontFamily: FF,
      }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0f2741', lineHeight: '28px', margin: 0 }}>
              Gaming console market revenue — Worldwide
            </p>
            <p style={{ fontSize: 11, color: '#455f7c', lineHeight: '16px', margin: 0 }}>
              in billion U.S. dollars, 2019–2029
            </p>
          </div>
          {/* Toggle sidebar button */}
          <button
            onClick={() => setShowSidebar(v => !v)}
            onMouseEnter={() => setToggleHovered(true)}
            onMouseLeave={() => setToggleHovered(false)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: toggleHovered ? '#F5F8FB' : 'white',
              border: `1px solid ${toggleHovered ? '#0055AA' : '#e0e0e0'}`,
              borderRadius: 6, cursor: 'pointer', padding: 11,
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {isBig
              ? <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><path d="M5 5H27C27.53 5 28.04 5.21 28.41 5.59C28.79 5.96 29 6.47 29 7V25C29 25.53 28.79 26.04 28.41 26.41C28.04 26.79 27.53 27 27 27H5C4.47 27 3.96 26.79 3.59 26.41C3.21 26.04 3 25.53 3 25V7C3 6.47 3.21 5.96 3.59 5.59C3.96 5.21 4.47 5 5 5ZM5 25H21V7H5V25Z" fill={toggleHovered ? '#0055AA' : '#455f7c'}/></svg>
              : <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><path d="M5 4.5H27C27.66 4.5 28.3 4.76 28.77 5.23C29.24 5.70 29.5 6.34 29.5 7V25C29.5 25.66 29.24 26.3 28.77 26.77C28.3 27.24 27.66 27.5 27 27.5H5C4.34 27.5 3.70 27.24 3.23 26.77C2.76 26.3 2.5 25.66 2.5 25V7C2.5 6.34 2.76 5.70 3.23 5.23C3.70 4.76 4.34 4.5 5 4.5ZM26.5 7.5H22.5V24.5H26.5V7.5ZM5.5 24.5H19.5V7.5H5.5V24.5Z" fill={toggleHovered ? '#0055AA' : '#455f7c'}/></svg>
            }
          </button>
        </div>

        <div style={{ height: 1, background: '#e5e5e5' }} />

        {/* Main body */}
        <div style={{ display: 'flex', gap: 24, padding: 24, alignItems: 'stretch' }}>

          {/* Chart area */}
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 24 }}>
              <div style={{
                display: 'flex', alignItems: 'center', height: 40,
                background: 'white', border: '1px solid #e0e0e0', borderRadius: 6, padding: '0 6px',
              }}>
                {tabBtn('column', 'Column', DWIcons.column)}
                <div style={{ width: 1, alignSelf: 'stretch', background: '#e5e5e5', margin: '0 2px', flexShrink: 0 }} />
                {tabBtn('line', 'Line', DWIcons.line)}
                <div style={{ width: 1, alignSelf: 'stretch', background: '#e5e5e5', margin: '0 2px', flexShrink: 0 }} />
                {tabBtn('table', 'Table', DWIcons.table)}
              </div>
              {!isMini && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'white', border: '1px solid #e0e0e0', borderRadius: 6,
                  padding: '7px 12px', cursor: 'pointer', flexShrink: 0,
                }}>
                  {DWIcons.funnel()}
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f2741', lineHeight: '24px', whiteSpace: 'nowrap' }}>
                    All categories
                  </span>
                  {DWIcons.chevron()}
                </div>
              )}
            </div>

            {/* Chart / table */}
            <div style={{ flex: '1 1 0', display: 'flex', alignItems: activeTab === 'table' ? 'flex-start' : 'center' }}>
              <div ref={chartAreaRef} style={{ width: '100%' }}>
                {activeTab === 'column' && svgChart}
                {activeTab === 'line' && svgLineChart}
                {activeTab === 'table' && tableChart}
              </div>
            </div>
          </div>

          {/* Sidebar — big variant only */}
          {isBig && (
            <div style={{ flex: '0 0 360px', width: 360, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minHeight: 290 }}>
              <p style={{ fontSize: 11, color: '#455f7c', lineHeight: '16px', margin: '0 0 4px', fontFamily: FF }}>
                {'Published by '}
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Statista Research Department</span>
                {', Sep 2024'}
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f2741', lineHeight: '28px', margin: '0 0 16px', fontFamily: FF }}>
                Console gaming market worldwide
              </p>
              <SupportTextBody expanded={supportExpanded} onExpand={() => setSupportExpanded(true)} maxH={240} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #f2f2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1 0 0', minWidth: 0 }}>
            <p style={{ fontSize: 11, color: '#455f7c', lineHeight: '20px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FF }}>
              <strong style={{ fontWeight: 700 }}>Sources:</strong>{' Newzoo; Ampere Analysis; IDC'}
            </p>
            <p style={{ fontSize: 11, color: '#455f7c', lineHeight: '20px', margin: 0, fontFamily: FF }}>
              <strong style={{ fontWeight: 700 }}>Last Updated:</strong>{' Jan 14, 2025'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }} onMouseEnter={() => setHoverColor('#0666e5')} onMouseLeave={() => setHoverColor(null)}>
            <FooterBtn iconFn={DWIcons.info} tip="Information about the data's source" />
            <FooterBtn iconFn={DWIcons.download} tip="Download data in a file" />
            <FooterBtn iconFn={DWIcons.copy} tip="Copy data to clipboard" />
            <FooterBtn
              tip="Copy for AI"
              iconFn={(color) => (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.5 2.55H11.25a.75.75 0 000 1.5h1v8.5H3.75V9.05a.75.75 0 00-1.5 0v3.75c0 .69.56 1.25 1.25 1.25h9c.69 0 1.25-.56 1.25-1.25V3.8c0-.69-.56-1.25-1.25-1.25z" fill={color}/>
                  <path d="M6.55 1.05c.243 0 .461.148.551.374l1.092 2.732 2.733 1.093c.225.09.373.308.373.551 0 .212-.112.406-.291.511l-.08.04-2.733 1.092-1.092 2.733c-.09.225-.308.373-.551.373-.212 0-.406-.112-.511-.291l-.04-.08-1.092-2.733L2.174 6.35C1.949 6.261 1.8 6.044 1.8 5.8c0-.243.148-.461.374-.551l2.733-1.092L6 1.424l.04-.08c.105-.18.299-.291.511-.291z" fill={color}/>
                </svg>
              )}
            />
            {!isMini && (
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', minWidth: 140,
                background: savedToast ? '#e8f5e8' : 'white',
                border: `1px solid ${savedToast ? '#4caf50' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer',
                fontFamily: FF, fontSize: 14, fontWeight: 600,
                color: savedToast ? '#2e7d32' : '#455f7c',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
              }}
              onClick={handleAddToDashboard}
              onMouseEnter={e => { if (!savedToast) { e.currentTarget.style.background = '#E8F2FF'; e.currentTarget.style.borderColor = '#0055AA' } }}
              onMouseLeave={e => { if (!savedToast) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e0e0e0' } }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/></svg>
                {savedToast ? 'Saved!' : 'Add to dashboard'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
