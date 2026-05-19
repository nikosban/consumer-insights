import React from 'react'
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
import type { Widget, ChartData } from '@/types'
import { TrendingUp, TrendingDown } from 'lucide-react'

type ChartRendererProps = {
  widget: Widget
  data: ChartData
  height?: number
}

const BLUE_SHADES = [
  '#0666E5',
  '#3384EA',
  '#66A3EF',
  '#99C1F4',
  '#CCE0FA',
]

const GRID_STROKE = '#e9eaec'
const AXIS_STYLE = { fontSize: 11, fill: '#8c8c8c', fontFamily: 'Open Sans, sans-serif' }

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e9eaec',
      borderRadius: 6,
      padding: '6px 10px',
      fontSize: 11,
      fontFamily: 'Open Sans, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      lineHeight: '18px',
    }}>
      {label && <p style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: 0 }}>
          <span style={{ color: '#555' }}>{entry.name}: </span>
          <span style={{ fontWeight: 600 }}>{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function ChartRenderer({ widget, data, height = 200 }: ChartRendererProps) {
  const { type } = widget

  if (type === 'bar') {
    const chartData = data.labels.map((label, i) => {
      const row: Record<string, string | number> = { label }
      data.series.forEach((s) => { row[s.name] = s.values[i] })
      return row
    })
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(6,102,229,0.04)' }} />
          {data.series.length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'Open Sans, sans-serif' }} />}
          {data.series.map((s, idx) => (
            <Bar key={s.name} dataKey={s.name} fill={BLUE_SHADES[idx % BLUE_SHADES.length]} radius={[3, 3, 0, 0]} maxBarSize={40} />
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
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          {data.series.length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'Open Sans, sans-serif' }} />}
          {data.series.map((s, idx) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={BLUE_SHADES[idx % BLUE_SHADES.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: BLUE_SHADES[idx % BLUE_SHADES.length], strokeWidth: 0 }}
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
      <ResponsiveContainer width="100%" height={height}>
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
              <Cell key={idx} fill={BLUE_SHADES[idx % BLUE_SHADES.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: 'Open Sans, sans-serif' }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'scorecard') {
    const value = data.series[0]?.values[0] ?? 0
    const benchmark = data.series[1]?.values[0]
    const diff = benchmark !== undefined ? value - benchmark : null
    return (
      <div className="flex flex-col items-center justify-center h-full gap-1 py-4">
        <span className="text-4xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{data.labels[0]}</span>
        {diff !== null && (
          <div className={`flex items-center gap-1 text-sm font-medium ${diff >= 0 ? 'text-green-600' : 'text-destructive'}`}>
            {diff >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {diff >= 0 ? '+' : ''}{diff} vs benchmark
          </div>
        )}
      </div>
    )
  }

  if (type === 'table') {
    const isCrosstable = !!widget.crossDimensionLabel

    if (isCrosstable) {
      const showIndex = !!widget.showIndex
      const showTotal = !!widget.showTotalShare
      const colsPerGroup = 1 + (showIndex ? 1 : 0) // Percent [+ Index]
      const totalColsPerGroup = 1 // just Percent for total

      const thBase = 'py-1.5 px-2 font-medium text-muted-foreground border-b border-border text-right whitespace-nowrap'
      const tdBase = 'py-1.5 px-2 tabular-nums text-right'

      return (
        <div className="overflow-auto" style={{ maxHeight: height }}>
          <table className="w-full text-xs border-collapse">
            <thead>
              {/* Group name row */}
              <tr className="bg-muted/50">
                <th className="text-left py-1.5 px-2 font-medium text-muted-foreground border-b border-border sticky left-0 bg-muted/50 min-w-[140px]" rowSpan={2}>
                  Answers
                </th>
                {showTotal && (
                  <th colSpan={totalColsPerGroup} className={`${thBase} border-l border-border`}>
                    Total
                  </th>
                )}
                {data.series.map((s) => (
                  <th key={s.name} colSpan={colsPerGroup} className={`${thBase} border-l border-border`}>
                    {s.name}
                  </th>
                ))}
              </tr>
              {/* Sub-column row */}
              <tr className="bg-muted/30">
                {showTotal && (
                  <th className={`${thBase} border-l border-border font-normal text-[10px]`}>%</th>
                )}
                {data.series.map((s) => (
                  <React.Fragment key={s.name}>
                    <th className={`${thBase} border-l border-border font-normal text-[10px]`}>%</th>
                    {showIndex && (
                      <th className={`${thBase} font-normal text-[10px]`}>Index</th>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.labels.map((label, i) => (
                <tr key={label} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="py-1.5 px-2 text-foreground sticky left-0 bg-background">{label}</td>
                  {showTotal && (
                    <td className={`${tdBase} text-muted-foreground border-l border-border/40`}>
                      {data.totalSeries?.values[i] ?? 0}%
                    </td>
                  )}
                  {data.series.map((s) => (
                    <React.Fragment key={s.name}>
                      <td className={`${tdBase} text-muted-foreground border-l border-border/40`}>
                        {s.values[i]}%
                      </td>
                      {showIndex && (
                        <td className={`${tdBase} font-medium`}
                          style={{ color: (s.indexValues?.[i] ?? 100) >= 110 ? '#2563eb' : (s.indexValues?.[i] ?? 100) <= 90 ? '#9ca3af' : undefined }}>
                          {s.indexValues?.[i] ?? 100}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    const maxVal = Math.max(...(data.series[0]?.values ?? [1]), 1)
    return (
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground border-b border-border">Answers</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground border-b border-border w-12">%</th>
              <th className="py-2 px-3 border-b border-border w-28" />
            </tr>
          </thead>
          <tbody>
            {data.labels.map((label, i) => {
              const pct = data.series[0]?.values[i] ?? 0
              const barPct = Math.round((pct / maxVal) * 100)
              return (
                <tr key={label} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-3 text-foreground">{label}</td>
                  <td className="text-right py-2 px-3 tabular-nums font-medium">{pct}%</td>
                  <td className="py-2 px-3">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50 rounded-full" style={{ width: `${barPct}%` }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}
