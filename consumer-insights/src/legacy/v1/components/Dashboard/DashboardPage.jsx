import { useState, useRef, useEffect } from 'react'
import GlobalNavbar from '../GlobalNavbar/GlobalNavbar'
import { useDashboard, removeWidget, clearDashboard } from '../../hooks/useDashboard'
import s from './DashboardPage.module.css'

const FF = "'Open Sans', system-ui, sans-serif"

/* ── Inline chart type icons ── */
const ChartIcons = {
  column: (active) => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="9" width="4" height="8" rx="0.5" fill={active ? '#0666e5' : '#7b94a3'}/>
      <rect x="7" y="5" width="4" height="12" rx="0.5" fill={active ? '#0666e5' : '#7b94a3'}/>
      <rect x="13" y="2" width="4" height="15" rx="0.5" fill={active ? '#0666e5' : '#7b94a3'}/>
    </svg>
  ),
  line: (active) => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <polyline points="1,14 5,9 9,11 13,5 17,2" stroke={active ? '#0666e5' : '#7b94a3'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  table: (active) => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="16" height="16" rx="1" stroke={active ? '#0666e5' : '#7b94a3'} strokeWidth="1.5"/>
      <line x1="1" y1="6.5" x2="17" y2="6.5" stroke={active ? '#0666e5' : '#7b94a3'} strokeWidth="1.5"/>
      <line x1="1" y1="11.5" x2="17" y2="11.5" stroke={active ? '#0666e5' : '#7b94a3'} strokeWidth="1.5"/>
      <line x1="6.5" y1="6.5" x2="6.5" y2="17" stroke={active ? '#0666e5' : '#7b94a3'} strokeWidth="1.5"/>
    </svg>
  ),
}

function SvgBarChart({ data, width }) {
  const svgH = 160, padL = 36, padR = 6, padT = 10, padB = 24
  const maxVal = Math.max(...data.map(d => d.value))
  const chartW = width - padL - padR
  const chartH = svgH - padT - padB
  const N = data.length
  const gW = chartW / N
  const toY = v => padT + chartH * (1 - v / (maxVal * 1.15))
  const baseY = padT + chartH
  const barW = Math.max(gW * 0.55, 3)
  const yTicks = [0, Math.round(maxVal * 0.5), Math.round(maxVal)]

  return (
    <svg width={width} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
      {yTicks.map(t => {
        const y = toY(t)
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={t === 0 ? '#d4dce6' : '#eef2f7'} strokeWidth={1}/>
            {t > 0 && <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9eb0bf" fontFamily={FF}>{t}</text>}
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padL + i * gW + (gW - barW) / 2
        const bh = Math.max(chartH * d.value / (maxVal * 1.15), 2)
        const showLabel = N <= 8 || i % Math.ceil(N / 8) === 0
        return (
          <g key={i}>
            <rect x={x} y={baseY - bh} width={barW} height={bh} fill="#0666e5" rx={2}/>
            {showLabel && <text x={padL + (i + 0.5) * gW} y={svgH - 5} textAnchor="middle" fontSize={9} fill="#9eb0bf" fontFamily={FF}>{d.label}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function SvgLineChart({ data, width }) {
  const svgH = 160, padL = 36, padR = 6, padT = 10, padB = 24
  const maxVal = Math.max(...data.map(d => d.value))
  const chartW = width - padL - padR
  const chartH = svgH - padT - padB
  const N = data.length
  const gW = chartW / N
  const ptX = i => padL + (i + 0.5) * gW
  const toY = v => padT + chartH * (1 - v / (maxVal * 1.15))
  const baseY = padT + chartH
  const yTicks = [0, Math.round(maxVal * 0.5), Math.round(maxVal)]
  const pts = data.map((d, i) => `${ptX(i)},${toY(d.value)}`).join(' ')

  return (
    <svg width={width} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`dg-${width}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0666e5" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#0666e5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {yTicks.map(t => {
        const y = toY(t)
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={t === 0 ? '#d4dce6' : '#eef2f7'} strokeWidth={1}/>
            {t > 0 && <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9eb0bf" fontFamily={FF}>{t}</text>}
          </g>
        )
      })}
      <path
        d={[`M ${ptX(0)} ${toY(data[0].value)}`, ...data.map((d, i) => `L ${ptX(i)} ${toY(d.value)}`), `L ${ptX(N - 1)} ${baseY}`, `L ${ptX(0)} ${baseY}`, 'Z'].join(' ')}
        fill={`url(#dg-${width})`}
      />
      <polyline points={pts} stroke="#0666e5" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d, i) => {
        const showLabel = N <= 8 || i % Math.ceil(N / 8) === 0
        return (
          <g key={i}>
            <circle cx={ptX(i)} cy={toY(d.value)} r={3} fill="#0666e5" stroke="white" strokeWidth={1.5}/>
            {showLabel && <text x={ptX(i)} y={svgH - 5} textAnchor="middle" fontSize={9} fill="#9eb0bf" fontFamily={FF}>{d.label}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function TableChart({ data }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={s.tableGrid}>
        <thead>
          <tr>
            <th>Period</th>
            <th style={{ textAlign: 'right' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.label}</td>
              <td style={{ textAlign: 'right', fontWeight: 500 }}>{d.valueLabel ?? d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WidgetCard({ widget }) {
  const [tab, setTab] = useState('column')
  const bodyRef = useRef(null)
  const [chartW, setChartW] = useState(300)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const update = () => setChartW(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const hasChartData = widget.data && widget.data.length > 0
  const sourceName = widget.source === 'rai' ? 'Research AI' : 'Crosstabs'

  const tabBtn = (id) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      className={`${s.chartTab} ${tab === id ? s.chartTabActive : ''}`}
      title={id.charAt(0).toUpperCase() + id.slice(1)}
    >
      {ChartIcons[id](tab === id)}
    </button>
  )

  return (
    <div className={s.widgetCard}>
      {/* Header */}
      <div className={s.widgetHeader}>
        <span className={s.widgetTitle}>{widget.title}</span>
        {hasChartData && (
          <div className={s.chartTabs}>
            {['column', 'line', 'table'].map(tabBtn)}
          </div>
        )}
        <button className={s.widgetDeleteBtn} onClick={() => removeWidget(widget.id)} title="Remove widget">
          <i className="ti ti-x" />
        </button>
      </div>

      {/* Body */}
      <div className={s.widgetBody} ref={bodyRef}>
        {hasChartData ? (
          <>
            {tab === 'column' && <SvgBarChart data={widget.data} width={chartW} />}
            {tab === 'line'   && <SvgLineChart data={widget.data} width={chartW} />}
            {tab === 'table'  && <TableChart data={widget.data} />}
          </>
        ) : (
          <div style={{ fontSize: 13, color: '#7b94a3', lineHeight: 1.5 }}>
            {widget.description ?? 'Widget data unavailable.'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={s.widgetFooter}>
        <div className={s.widgetFooterLeft}>
          {widget.meta && widget.meta.map((m, i) => (
            <span key={i} className={s.metaBadge}>{m}</span>
          ))}
        </div>
        <div className={s.widgetFooterSource}>
          <i className="ti ti-message-bolt" style={{ fontSize: 11 }} />
          {sourceName}
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  const dash = useDashboard()
  const [confirmClear, setConfirmClear] = useState(false)
  const widgets = dash.widgets ?? []

  function handleExport() {
    const json = JSON.stringify({ widgets }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dashboard.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    if (confirmClear) {
      clearDashboard()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <div className={s.content}>
      <div className={s.header}>
        <h1 className={s.title}>My Dashboard</h1>
        <div className={s.actions}>
          <button
            className={`${s.btn} ${s.btnDanger} ${s.btnIcon}`}
            onClick={handleClear}
            disabled={widgets.length === 0}
            title={confirmClear ? 'Click again to confirm' : 'Delete dashboard'}
          >
            <i className="ti ti-trash" />
          </button>
          <button className={s.btn} disabled={widgets.length === 0} title="Share dashboard">
            <i className="ti ti-share" />
            Share
          </button>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={handleExport} disabled={widgets.length === 0}>
            <i className="ti ti-download" />
            Export
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIcon}><i className="ti ti-layout-dashboard" /></div>
          <p className={s.emptyTitle}>Your dashboard is empty</p>
          <p className={s.emptyDesc}>
            Click "Add to dashboard" on any chart in Research AI to save it here.
          </p>
        </div>
      ) : (
        <div className={s.grid}>
          {widgets.map(w => <WidgetCard key={w.id} widget={w} />)}
        </div>
      )}
    </div>
  )
}

export { DashboardContent }

export default function DashboardPage() {
  return (
    <div className={s.page}>
      <GlobalNavbar />
      <div className={s.body}>
        <DashboardContent />
      </div>
    </div>
  )
}
