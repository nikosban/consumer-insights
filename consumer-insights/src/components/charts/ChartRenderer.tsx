import React, { useState, useEffect, useRef } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Widget, ChartData, CrossTabConfig } from '@/types'
import { IconTrendingUp, IconTrendingDown, IconChevronRight, IconChevronDown } from '@tabler/icons-react'

type ChartRendererProps = {
  widget: Widget
  data: ChartData
  height?: number
  crossTabConfig?: CrossTabConfig
  extraRowsData?: Array<{ label: string; data: ChartData }>
  heatmap?: boolean
}

// Categorical palette — matches color.tokens.json chart.categorical (light .600 shades)
const CATEGORICAL_COLORS = [
  '#0666E5', // brand-600   (series 1 — primary)
  '#7C3AED', // violet-600  (series 2)
  '#0891B2', // cyan-600    (series 3)
  '#EA580C', // orange-600  (series 4)
  '#C026D3', // fuchsia-600 (series 5)
  '#0D9488', // teal-600    (series 6)
  '#4F46E5', // indigo-600  (series 7)
  '#65A30D', // lime-600    (series 8)
]

const SANS = "'Instrument Sans Variable', 'Instrument Sans', system-ui, sans-serif"

function useCSSVar(prop: string) {
  const [value, setValue] = useState(() =>
    getComputedStyle(document.documentElement).getPropertyValue(prop).trim()
  )
  const observer = useRef<MutationObserver | null>(null)
  useEffect(() => {
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(prop).trim())
    observer.current = new MutationObserver(read)
    observer.current.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.current?.disconnect()
  }, [prop])
  return value
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  const bg = useCSSVar('--popover')
  const border = useCSSVar('--border')
  const fg = useCSSVar('--popover-foreground')
  const fgMuted = useCSSVar('--muted-foreground')
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: `oklch(${bg})`,
      border: `1px solid oklch(${border})`,
      borderRadius: 6,
      padding: '6px 10px',
      fontSize: 12,
      fontFamily: SANS,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      lineHeight: '18px',
    }}>
      {label && <p style={{ fontWeight: 600, color: `oklch(${fg})`, marginBottom: 2 }}>{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: 0 }}>
          <span style={{ color: `oklch(${fgMuted})` }}>{entry.name}: </span>
          <span style={{ fontWeight: 600 }}>{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// Heatmap: map a 0–100 pct value to a blue background opacity
function heatmapBg(pct: number): string {
  const alpha = Math.round((pct / 100) * 0.35 * 100) / 100
  return `rgba(6,102,229,${alpha})`
}

export default function ChartRenderer({ widget, data, height = 200, crossTabConfig, extraRowsData = [], heatmap = false }: ChartRendererProps) {
  const { type } = widget
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const borderToken = useCSSVar('--border')
  const mutedFgToken = useCSSVar('--muted-foreground')
  const gridStroke = `oklch(${borderToken})`
  const axisStyle = { fontSize: 12, fill: `oklch(${mutedFgToken})`, fontFamily: SANS }

  function toggleGroup(name: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  if (type === 'bar') {
    const chartData = data.labels.map((label, i) => {
      const row: Record<string, string | number> = { label }
      data.series.forEach((s) => { row[s.name] = s.values[i] })
      return row
    })
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(6,102,229,0.04)' }} />
          {data.series.length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: SANS }} />}
          {data.series.map((s, idx) => (
            <Bar key={s.name} dataKey={s.name} fill={CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length]} radius={[3, 3, 0, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    const chartData = data.labels.map((label, i) => {
      const row: Record<string, string | number> = { label }
      data.series.forEach((s) => { row[s.name] = s.values[i] })
      return row
    })
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          {data.series.length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: SANS }} />}
          {data.series.map((s, idx) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length], strokeWidth: 0 }}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'pie') {
    const pieEntries = data.labels.map((label, i) => ({
      name: label,
      value: data.series[0]?.values[i] ?? 0,
    }))
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieEntries}
            cx="50%"
            cy="50%"
            innerRadius={Math.floor(height * 0.2)}
            outerRadius={Math.floor(height * 0.38)}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {pieEntries.map((_, idx) => (
              <Cell key={idx} fill={CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 12, fontFamily: SANS }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'scorecard') {
    const raw = data.series[0]?.values[0] ?? 0
    const benchmark = data.series[1]?.values[0]
    const diff = benchmark !== undefined ? raw - benchmark : null
    const compact = height < 90
    // Format large numbers: 1000000 → 1M, 1000 → 1K
    const value = raw >= 1_000_000
      ? `${(raw / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
      : raw >= 1_000
        ? `${(raw / 1_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K`
        : raw
    return (
      <div
        className="flex flex-col items-center justify-center w-full overflow-hidden"
        style={{ height, gap: compact ? 2 : 4 }}
      >
        <span className={compact ? 'text-2xl font-semibold text-foreground' : 'text-4xl font-semibold text-foreground'}>
          {value}
        </span>
        <span className={compact ? 'text-xs text-secondary-foreground' : 'text-sm text-secondary-foreground'}>
          {data.labels[0]}
        </span>
        {data.labels[1] && (
          <span className={compact ? 'text-xs text-muted-foreground/60' : 'text-xs text-muted-foreground/60'}>
            {data.labels[1]}
          </span>
        )}
        {diff !== null && (
          <div className={`flex items-center font-medium ${compact ? 'gap-0.5 text-xs' : 'gap-1 text-sm'} ${diff >= 0 ? 'text-green-600' : 'text-destructive'}`}>
            {diff >= 0
              ? <IconTrendingUp className={compact ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={2} />
              : <IconTrendingDown className={compact ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={2} />}
            {diff >= 0 ? '+' : ''}{diff} vs benchmark
          </div>
        )}
      </div>
    )
  }

  if (type === 'table') {
    const isCrosstable = !!widget.crossDimensionLabel

    if (isCrosstable) {
      const cfg: CrossTabConfig = crossTabConfig ?? {
        showTotal: true,
        showUniverse: true,
        showResponses: true,
        showPctCol: true,
        showPctRow: true,
        showIndex: true,
      }

      // Sub-columns for data groups
      const dataSubCols: Array<{ key: string; label: string }> = [
        ...(cfg.showUniverse   ? [{ key: 'univ',    label: 'Univ.'  }] : []),
        ...(cfg.showResponses  ? [{ key: 'resp',    label: 'Resp.'  }] : []),
        ...(cfg.showPctCol     ? [{ key: 'pctcol',  label: '% Col'  }] : []),
        ...(cfg.showPctRow     ? [{ key: 'pctrow',  label: '% Row'  }] : []),
        ...(cfg.showIndex      ? [{ key: 'index',   label: 'Index'  }] : []),
      ]
      const colsPerGroup = dataSubCols.length || 1

      // Sub-columns for Total group (no % Row or Index)
      const totalSubCols: Array<{ key: string; label: string }> = [
        ...(cfg.showUniverse   ? [{ key: 'univ',   label: 'Univ.'  }] : []),
        ...(cfg.showResponses  ? [{ key: 'resp',   label: 'Resp.'  }] : []),
        ...(cfg.showPctCol     ? [{ key: 'pctcol', label: '% Col'  }] : []),
      ]
      const totalColsPerGroup = totalSubCols.length || 1

      const thBase = 'py-1.5 px-2 font-medium text-secondary-foreground border-b border-border text-right whitespace-nowrap'
      const tdBase = 'py-1.5 px-2 tabular-nums text-right'

      const TOTAL_KEY = '__total__'
      const isTotalExpanded = expandedGroups.has(TOTAL_KEY)

      return (
        <div className="overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              {/* Group name row */}
              <tr className="bg-muted/50">
                <th className="text-left py-1.5 px-2 font-medium text-secondary-foreground border-b border-border sticky left-0 bg-muted/50 min-w-[140px]" rowSpan={2}>
                  Answers
                </th>
                {cfg.showTotal && (
                  <th
                    colSpan={isTotalExpanded ? totalColsPerGroup : 1}
                    className={`${thBase} border-l border-border cursor-pointer hover:bg-muted/70 transition-colors select-none`}
                    onClick={() => toggleGroup(TOTAL_KEY)}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      {isTotalExpanded
                        ? <IconChevronDown className="h-3 w-3 shrink-0" strokeWidth={2} />
                        : <IconChevronRight className="h-3 w-3 shrink-0" strokeWidth={2} />}
                      Total
                    </span>
                  </th>
                )}
                {data.series.map((s) => {
                  const isExp = expandedGroups.has(s.name)
                  return (
                    <th
                      key={s.name}
                      colSpan={isExp ? colsPerGroup : 1}
                      className={`${thBase} border-l border-border cursor-pointer hover:bg-muted/70 transition-colors select-none`}
                      onClick={() => toggleGroup(s.name)}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        {isExp
                          ? <IconChevronDown className="h-3 w-3 shrink-0" strokeWidth={2} />
                          : <IconChevronRight className="h-3 w-3 shrink-0" strokeWidth={2} />}
                        {s.name}
                      </span>
                    </th>
                  )
                })}
              </tr>
              {/* Sub-column row */}
              <tr className="bg-muted/30">
                {cfg.showTotal && (isTotalExpanded ? totalSubCols : totalSubCols.filter(c => c.key === 'pctcol')).map((col, ci) => (
                  <th key={col.key} className={`${thBase} font-normal text-xs${ci === 0 ? ' border-l border-border' : ''}`}>
                    {col.label}
                  </th>
                ))}
                {data.series.map((s) => {
                  const isExp = expandedGroups.has(s.name)
                  const visibleCols = isExp ? dataSubCols : dataSubCols.filter(c => c.key === 'pctcol')
                  return (
                    <React.Fragment key={s.name}>
                      {visibleCols.map((col, ci) => (
                        <th key={col.key} className={`${thBase} font-normal text-xs${ci === 0 ? ' border-l border-border' : ''}`}>
                          {col.label}
                        </th>
                      ))}
                    </React.Fragment>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Helper: render rows for a given dataset */}
              {(() => {
                const renderRows = (rowData: ChartData, groupLabel?: string) => {
                  const rTotals: number[] = rowData.labels.map((_, i) =>
                    rowData.series.reduce((sum, s) => sum + (s.absolutes?.[i] ?? 0), 0)
                  )
                  return (
                    <React.Fragment key={groupLabel ?? '__primary__'}>
                      {groupLabel && (
                        <>
                          <tr><td colSpan={999} className="h-3 bg-background p-0" /></tr>
                          <tr className="bg-muted/40">
                            <td
                              colSpan={999}
                              className="py-1 px-2 text-xs font-semibold text-muted-foreground tracking-wide border-y border-border"
                            >
                              {groupLabel}
                            </td>
                          </tr>
                        </>
                      )}
                      {rowData.labels.map((label, i) => (
                        <tr key={`${groupLabel ?? ''}${label}`} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-1.5 px-2 text-foreground sticky left-0 bg-background">{label}</td>
                          {cfg.showTotal && (isTotalExpanded ? totalSubCols : totalSubCols.filter(c => c.key === 'pctcol')).map((col, ci) => {
                            let cellVal: string
                            if (col.key === 'univ') {
                              const pop = rowData.totalSeries?.populations?.[i] ?? 0
                              cellVal = `${pop}m`
                            } else if (col.key === 'resp') {
                              cellVal = String(rowData.totalSeries?.absolutes?.[i] ?? 0)
                            } else {
                              cellVal = `${rowData.totalSeries?.values[i] ?? 0}%`
                            }
                            return (
                              <td key={col.key} className={`${tdBase} text-secondary-foreground${ci === 0 ? ' border-l border-border/40' : ''}`}>
                                {cellVal}
                              </td>
                            )
                          })}
                          {rowData.series.map((s) => {
                            const isExp = expandedGroups.has(s.name)
                            const visibleCols = isExp ? dataSubCols : dataSubCols.filter(c => c.key === 'pctcol')
                            return (
                              <React.Fragment key={s.name}>
                                {visibleCols.map((col, ci) => {
                                  let cellContent: React.ReactNode
                                  if (col.key === 'univ') {
                                    cellContent = <span className="text-secondary-foreground">{s.populations?.[i] ?? 0}m</span>
                                  } else if (col.key === 'resp') {
                                    cellContent = <span className="text-secondary-foreground">{s.absolutes?.[i] ?? 0}</span>
                                  } else if (col.key === 'pctcol') {
                                    cellContent = <span className="text-secondary-foreground">{s.values[i]}%</span>
                                    if (heatmap) return (
                                      <td key={col.key} className={`${tdBase}${ci === 0 ? ' border-l border-border/40' : ''}`}
                                        style={{ background: heatmapBg(s.values[i]) }}>
                                        {cellContent}
                                      </td>
                                    )
                                  } else if (col.key === 'pctrow') {
                                    const rt = rTotals[i]
                                    const pctRow = rt > 0 ? Math.round((s.absolutes?.[i] ?? 0) / rt * 100) : 0
                                    cellContent = <span className="text-secondary-foreground">{pctRow}%</span>
                                  } else {
                                    const idx = s.indexValues?.[i] ?? 100
                                    cellContent = (
                                      <span className="font-medium" style={{ color: idx >= 110 ? '#2563eb' : idx <= 90 ? '#9ca3af' : undefined }}>
                                        {idx}
                                      </span>
                                    )
                                  }
                                  return (
                                    <td key={col.key} className={`${tdBase}${ci === 0 ? ' border-l border-border/40' : ''}`}>
                                      {cellContent}
                                    </td>
                                  )
                                })}
                              </React.Fragment>
                            )
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                }

                return (
                  <>
                    {/* Primary row section — show label only if extra rows exist */}
                    {renderRows(data, extraRowsData.length > 0 ? widget.title : undefined)}
                    {/* Extra row sections */}
                    {extraRowsData.map(er => renderRows(er.data, er.label))}
                  </>
                )
              })()}
            </tbody>
          </table>
        </div>
      )
    }

    const renderSimpleRows = (rowData: ChartData, groupLabel?: string) => {
      const maxV = Math.max(...(rowData.series[0]?.values ?? [1]), 1)
      return (
        <React.Fragment key={groupLabel ?? '__primary__'}>
          {groupLabel && (
            <>
              <tr><td colSpan={3} className="h-3 bg-background p-0" /></tr>
              <tr className="bg-muted/40">
                <td colSpan={3} className="py-1 px-3 text-xs font-semibold text-muted-foreground tracking-wide border-y border-border">
                  {groupLabel}
                </td>
              </tr>
            </>
          )}
          {rowData.labels.map((label, i) => {
            const pct = rowData.series[0]?.values[i] ?? 0
            const barPct = Math.round((pct / maxV) * 100)
            return (
              <tr key={`${groupLabel ?? ''}${label}`} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="py-2 px-3 text-foreground">{label}</td>
                <td className="text-right py-2 px-3 tabular-nums font-medium"
                  style={heatmap ? { background: heatmapBg(pct) } : undefined}
                >{pct}%</td>
                <td className="py-2 px-3">
                  {!heatmap && (
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50 rounded-full" style={{ width: `${barPct}%` }} />
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </React.Fragment>
      )
    }

    return (
      <div className="overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-secondary-foreground border-b border-border">Answers</th>
              <th className="text-right py-2 px-3 font-medium text-secondary-foreground border-b border-border w-12">%</th>
              <th className="py-2 px-3 border-b border-border w-28" />
            </tr>
          </thead>
          <tbody>
            {renderSimpleRows(data, extraRowsData.length > 0 ? widget.title : undefined)}
            {extraRowsData.map(er => renderSimpleRows(er.data, er.label))}
          </tbody>
        </table>
      </div>
    )
  }

  // 'text' widgets render their own content in the card — ChartRenderer is not needed
  if (type === 'text') return null

  return null
}
