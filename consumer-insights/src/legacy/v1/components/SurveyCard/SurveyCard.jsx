import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getCardData, getColSplits, getCrosstabCell } from '../../data/cardData'
import { useLegacyStore } from '../../store/legacyStore'
import s from './SurveyCard.module.css'

const CHART_COLORS = [
  '#001327', '#0666e5', '#40a9ff', '#7bafd4', '#adc5ce',
  '#455f7c', '#0554c2', '#c4c4c4', '#1a9850', '#91cf60',
]

function heatmapBg(pct) {
  const t = Math.min(pct / 100, 1)
  const lightness = (95 - t * 72).toFixed(1)
  return `hsl(152, 55%, ${lightness}%)`
}
function heatmapTextColor(pct) {
  return pct > 62 ? '#fff' : 'inherit'
}

function parseVal(str, col) {
  if (!str) return 0
  if (col === 'pct') return parseFloat(str) || 0
  if (col === 'pop') return parseFloat(str) * (str.includes('m') ? 1e6 : 1)
  if (col === 'abs') return parseFloat(str.split('/')[0].replace(/,/g, '').trim()) || 0
  return str
}

const VIEWS = [
  { key: 'table',          icon: 'ti-table',     rotate: false, title: 'Table' },
  { key: 'heatmap',        icon: 'ti-grid-dots', rotate: false, title: 'Table Heatmap' },
  { key: 'bar-horizontal', icon: 'ti-chart-bar', rotate: true,  title: 'Bar Horizontal' },
  { key: 'bar-vertical',   icon: 'ti-chart-bar', rotate: false, title: 'Bar Vertical' },
  { key: 'pie',            icon: 'ti-chart-pie',  rotate: false, title: 'Pie' },
]

export default function SurveyCard({ name, data, onClose, onOpenDetails, detailsOpen }) {
  const colItems           = useLegacyStore(s => s.colItems)
  const displayOptions     = useLegacyStore(s => s.displayOptions)
  const appliedFilterGroupId = useLegacyStore(s => s.appliedFilterGroupId)

  const [chartView, setChartView] = useState('table')
  const [sortCol, setSortCol]     = useState(null)
  const [sortDir, setSortDir]     = useState('asc')

  const qParts = data.question.match(/^(.+?)\s*-\s*(.+?)\s*\(([^)]+)\)$/)
  const qName  = qParts ? qParts[1] : name
  const qText  = qParts ? qParts[2] : data.question
  const qType  = qParts ? qParts[3] : ''

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const sortedRows = useMemo(() => {
    const base = data.rows.filter(r => r.isBase)
    const rest  = data.rows.filter(r => !r.isBase)
    if (!sortCol) return [...base, ...rest]
    const sorted = [...rest].sort((a, b) => {
      const av = parseVal(a[sortCol], sortCol)
      const bv = parseVal(b[sortCol], sortCol)
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return [...base, ...sorted]
  }, [data.rows, sortCol, sortDir])

  const dataRows   = sortedRows.filter(r => !r.isBase)
  const chartData  = dataRows.map(r => ({ label: r.label, value: parseVal(r.pct, 'pct'), pct: r.pct }))

  const isCrosstab = colItems.length > 0
  const activeView = chartView

  const activeSubCols = useMemo(() => {
    const cols = []
    if (displayOptions.absolute)   cols.push({ key: 'abs', label: 'Absolute' })
    if (displayOptions.population) cols.push({ key: 'pop', label: 'Population' })
    if (displayOptions.percent)    cols.push({ key: 'pct', label: 'Index' })
    return cols.length > 0 ? cols : [{ key: 'pct', label: 'Index' }]
  }, [displayOptions.absolute, displayOptions.population, displayOptions.percent])

  const colGroups = useMemo(() =>
    colItems.map(colName => {
      const cd = getCardData(colName)
      const parts = cd.question.match(/^(.+?)\s*-\s*(.+?)\s*\(([^)]+)\)$/)
      const allSplits = getColSplits(colName)
      const splits = displayOptions.total
        ? allSplits
        : allSplits.filter(s => !s.startsWith('Total —'))
      return {
        name:   colName,
        isTotal: false,
        data:   cd,
        splits,
        qName:  parts ? parts[1] : colName,
        qText:  parts ? parts[2] : cd.question,
        qType:  parts ? parts[3] : '',
      }
    }), [colItems, displayOptions.total])

  const allGroups = useMemo(() => {
    if (!isCrosstab) return []
    return colGroups
  }, [isCrosstab, colGroups])

  const crosstabSeries = useMemo(() => {
    if (!isCrosstab) return []
    return allGroups.flatMap(g => g.splits)
  }, [isCrosstab, allGroups])

  const crosstabChartData = useMemo(() => {
    if (!isCrosstab) return []
    return dataRows.map(r => {
      const entry = { label: r.label }
      allGroups.forEach(g => {
        g.splits.forEach(split => {
          const cell = g.isTotal
            ? { pct: r.pct }
            : getCrosstabCell(name, g.name, split, r.label, false)
          entry[split] = parseVal(cell?.pct ?? '0', 'pct')
        })
      })
      return entry
    })
  }, [isCrosstab, allGroups, dataRows, name])

  const allDisabled    = !displayOptions.absolute && !displayOptions.population && !displayOptions.percent
  const showAbsolute   = displayOptions.absolute
  const showPopulation = displayOptions.population
  const showPercent    = displayOptions.percent || allDisabled

  function SortIcon({ col }) {
    if (sortCol !== col) return <i className={`ti ti-arrows-sort ${s.sort}`} />
    return <i className={`ti ${sortDir === 'asc' ? 'ti-sort-ascending' : 'ti-sort-descending'} ${s.sort} ${s.sortActive}`} />
  }

  return (
    <div className={s.card}>
      <button className={s.closeBtn} onClick={onClose}><i className="ti ti-x" /></button>

      <div className={s.header}>
        <span className={s.title}>{name}</span>
        <button className={s.compareBtn}>Compare</button>
      </div>

      {!isCrosstab && (
        <div className={s.meta}>
          <div className={s.metaName}>{qName}</div>
          <div className={s.metaType}>{qText}{qType ? ` (${qType})` : ''}</div>
          <div className={s.metaBase}><strong>Base:</strong> {data.base}</div>
        </div>
      )}

      <div className={s.body}>
        <div className={s.tableWrap}>
          {isCrosstab && (activeView === 'bar-horizontal' || activeView === 'bar-vertical') ? (
            <div className={s.crosstabChart}>
              {activeView === 'bar-horizontal' ? (
                <ResponsiveContainer width="100%" height={Math.max(160, dataRows.length * crosstabSeries.length * 14 + 80)}>
                  <BarChart data={crosstabChartData} layout="vertical" margin={{ top: 8, right: 40, bottom: 40, left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} />
                    <Tooltip formatter={(v, key) => [`${v}%`, key]} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    {crosstabSeries.map((split, i) => (
                      <Bar key={split} dataKey={split} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[0, 2, 2, 0]} barSize={8} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={crosstabChartData} margin={{ top: 8, right: 16, bottom: 60, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={(v, key) => [`${v}%`, key]} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    {crosstabSeries.map((split, i) => (
                      <Bar key={split} dataKey={split} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[2, 2, 0, 0]} barSize={8} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : isCrosstab ? (
            <table className={s.crosstabTable}>
              <thead>
                <tr>
                  <th rowSpan={2} className={`${s.stickyCol} ${s.leftMetaTh}`}>
                    <div className={s.leftMeta}>
                      <div className={s.metaName}>{qName}</div>
                      <div className={s.metaType}>{qText}{qType ? ` (${qType})` : ''}</div>
                      <div className={s.metaBase}><strong>Base:</strong> {data.base}</div>
                    </div>
                  </th>
                  {allGroups.flatMap((g, gi) => [
                    <th key={g.name} colSpan={g.splits.length * activeSubCols.length} className={`${s.colMetaHeader} ${g.isTotal ? s.totalColMeta : ''}`}>
                      <div className={s.colMetaContent}>
                        <div className={s.colMetaName}>{g.isTotal ? `Total – ${g.qName}` : g.qName}</div>
                        {!g.isTotal && <div className={s.colMetaDesc}>Based on &ldquo;{g.qText}{g.qType ? ` (${g.qType})` : ''}&rdquo;</div>}
                        <div className={s.colMetaBase}>Base: {g.data.base}</div>
                      </div>
                    </th>,
                    gi < allGroups.length - 1 ? <th key={`gap1-${gi}`} rowSpan={2} className={s.colGapTh} /> : null,
                  ])}
                </tr>
                <tr>
                  {allGroups.flatMap((g, gi) =>
                    g.splits.map((split, si) => {
                      const isFirst = gi === 0 && si === 0
                      return (
                        <th
                          key={`${g.name}-${split}`}
                          colSpan={activeSubCols.length}
                          className={`${s.splitHeader} ${!isFirst ? s.splitGroupStart : ''} ${g.isTotal ? s.totalSplitHeader : ''}`}
                        >
                          {split}
                        </th>
                      )
                    })
                  )}
                </tr>
                <tr>
                  <th className={`${s.stickyCol} ${s.answersHeader}`}>Answers</th>
                  {allGroups.flatMap((g, gi) => [
                    ...g.splits.flatMap((split, si) =>
                      activeSubCols.map((sc, sci) => {
                        const isFirstInSplit = sci === 0
                        const isVeryFirst = gi === 0 && si === 0
                        return (
                          <th
                            key={`${g.name}-${split}-${sc.key}`}
                            className={`${s.subColHeader} ${isFirstInSplit && !isVeryFirst ? s.splitGroupStart : ''}`}
                          >
                            {sc.label}
                          </th>
                        )
                      })
                    ),
                    gi < allGroups.length - 1 ? <th key={`gap3-${gi}`} className={s.colGapTh} /> : null,
                  ])}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((r, i) => {
                  const isAlt = !r.isBase && i % 2 === 0
                  const stickyBg = r.isBase ? s.stickyColBase : isAlt ? s.stickyColAlt : s.stickyColDefault
                  return (
                    <tr key={r.label} className={r.isBase ? s.baseRow : isAlt ? s.altRow : ''}>
                      <td className={`${s.stickyCol} ${stickyBg}`}>{r.label}</td>
                      {allGroups.flatMap((g, gi) => [
                        ...g.splits.flatMap((split, si) => {
                          const cell = g.isTotal
                            ? { abs: r.abs, pop: r.pop, pct: r.pct }
                            : getCrosstabCell(name, g.name, split, r.label, r.isBase)
                          const isVeryFirst = gi === 0 && si === 0
                          return activeSubCols.map((sc, sci) => {
                            const isFirstInSplit = sci === 0
                            const pctVal = parseVal(cell[sc.key], 'pct')
                            return (
                              <td
                                key={`${g.name}-${split}-${sc.key}`}
                                className={isFirstInSplit && !isVeryFirst ? s.splitGroupStart : ''}
                                style={sc.key === 'pct' && !r.isBase && activeView === 'heatmap' ? { backgroundColor: heatmapBg(pctVal), color: heatmapTextColor(pctVal) } : undefined}
                              >
                                {cell[sc.key]}
                              </td>
                            )
                          })
                        }),
                        gi < allGroups.length - 1 ? <td key={`gap-${gi}`} className={s.colGapCell} /> : null,
                      ])}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <>
              {(activeView === 'table' || activeView === 'heatmap') && (
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th className={s.sortable} onClick={() => handleSort('label')}>Answers <SortIcon col="label" /></th>
                      {showAbsolute   && <th className={s.sortable} onClick={() => handleSort('abs')}>Absolute <SortIcon col="abs" /></th>}
                      {showPopulation && <th className={s.sortable} onClick={() => handleSort('pop')}>Population <SortIcon col="pop" /></th>}
                      {showPercent    && <th className={s.sortable} onClick={() => handleSort('pct')}>Index <SortIcon col="pct" /></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((r, i) => {
                      const isAlt = !r.isBase && i % 2 === 0
                      const pctNum = parseVal(r.pct, 'pct')
                      return (
                        <tr key={r.label} className={r.isBase ? s.baseRow : isAlt ? s.altRow : ''}>
                          <td>{r.label}</td>
                          {showAbsolute   && <td>{r.abs}</td>}
                          {showPopulation && <td>{r.pop}</td>}
                          {showPercent && (
                            <td
                              className={s.pctCol}
                              style={activeView === 'heatmap' && !r.isBase ? { backgroundColor: heatmapBg(pctNum), color: heatmapTextColor(pctNum) } : undefined}
                            >
                              {r.pct}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}

              {activeView === 'bar-vertical' && (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 48, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={v => [`${v}%`, name]} />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[2, 2, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeView === 'bar-horizontal' && (
                <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 40 + 40)}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 40, bottom: 8, left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: 'var(--color-on-surface)' }} />
                    <Tooltip formatter={v => [`${v}%`, name]} />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeView === 'pie' && (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                      {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </>
          )}
        </div>

        <div className={s.actions}>
          <button className={`${s.actionBtn} ${detailsOpen ? s.infoBtnActive : ''}`} title="Info" onClick={onOpenDetails}>
            <i className="ti ti-info-circle" />
          </button>
          <div className={s.chartGroup}>
            {VIEWS.map(v => {
              const disabled = isCrosstab && v.key === 'pie'
              return (
                <button
                  key={v.key}
                  className={`${s.chartBtn} ${activeView === v.key ? s.chartBtnActive : ''} ${disabled ? s.chartBtnDisabled : ''}`}
                  title={disabled ? `${v.title} (unavailable in crosstab)` : v.title}
                  onClick={() => !disabled && setChartView(v.key)}
                >
                  <i className={`ti ${v.icon}${v.rotate ? ` ${s.iconRotate90}` : ''}`} />
                </button>
              )
            })}
          </div>
          <button className={s.actionBtn} title="Download"><i className="ti ti-download" /></button>
          <button className={s.actionBtn} title="Fullscreen"><i className="ti ti-arrows-maximize" /></button>
        </div>
      </div>
    </div>
  )
}
