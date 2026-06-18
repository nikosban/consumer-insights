import { useState } from 'react'
import GlobalNavbar from '../GlobalNavbar/GlobalNavbar'
import { useDashboard, removeWidget, clearDashboard } from '../../hooks/useDashboard'
import s from './DashboardPage.module.css'

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div>
      {data.map((d, i) => (
        <div key={i} className={s.barRow}>
          <span className={s.barLabel}>{d.label}</span>
          <div className={s.barTrack}>
            <div className={s.barFill} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className={s.barVal}>{d.valueLabel ?? d.value}</span>
        </div>
      ))}
    </div>
  )
}

function TableView({ columns, rows }) {
  return (
    <table className={s.tableGrid}>
      <thead>
        <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map(c => <td key={c}>{row[c] ?? '–'}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function KpiGrid({ items }) {
  return (
    <div className={s.kpiGrid}>
      {items.map((item, i) => (
        <div key={i} className={s.kpi}>
          <div className={s.kpiVal}>{item.value}</div>
          <div className={s.kpiLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function WidgetBody({ widget }) {
  if (widget.chartType === 'bar' && widget.data) {
    return (
      <>
        {widget.chartTitle && <p className={s.chartTitle}>{widget.chartTitle}</p>}
        <BarChart data={widget.data} />
      </>
    )
  }
  if (widget.chartType === 'table' && widget.columns && widget.rows) {
    return <TableView columns={widget.columns} rows={widget.rows} />
  }
  if (widget.chartType === 'kpi' && widget.items) {
    return <KpiGrid items={widget.items} />
  }
  return (
    <div style={{ fontSize: 13, color: '#7b94a3', lineHeight: 1.5 }}>
      {widget.description ?? 'Widget data unavailable.'}
    </div>
  )
}

function WidgetCard({ widget }) {
  return (
    <div className={s.widgetCard}>
      <div className={s.widgetHeader}>
        <span className={s.widgetTitle}>{widget.title}</span>
        <span className={s.widgetSourceTag}>{widget.source === 'rai' ? 'Research AI' : 'Crosstabs'}</span>
        <button className={s.widgetDeleteBtn} onClick={() => removeWidget(widget.id)} title="Remove widget">
          <i className="ti ti-x" />
        </button>
      </div>
      <div className={s.widgetBody}>
        <WidgetBody widget={widget} />
      </div>
      {widget.meta && widget.meta.length > 0 && (
        <div className={s.widgetMeta}>
          {widget.meta.map((m, i) => <span key={i} className={s.metaBadge}>{m}</span>)}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
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

  const filledSlots = widgets.slice(0, 4)
  const emptyCount = Math.max(0, (widgets.length === 0 ? 0 : 4) - filledSlots.length)

  return (
    <div className={s.page}>
      <GlobalNavbar />
      <div className={s.body}>
        <div className={s.content}>
          <div className={s.header}>
            <h1 className={s.title}>My Dashboard</h1>
            <div className={s.actions}>
              <button className={s.btn} onClick={handleExport} disabled={widgets.length === 0}>
                <i className="ti ti-download" />
                Export
              </button>
              <button className={`${s.btn} ${s.btnDanger}`} onClick={handleClear} disabled={widgets.length === 0}>
                <i className="ti ti-trash" />
                {confirmClear ? 'Click again to confirm' : 'Delete dashboard'}
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
              {filledSlots.map(w => <WidgetCard key={w.id} widget={w} />)}
              {Array.from({ length: emptyCount }).map((_, i) => (
                <div key={i} className={s.emptySlot}>
                  <i className="ti ti-plus" />
                  <span>Add a widget</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
