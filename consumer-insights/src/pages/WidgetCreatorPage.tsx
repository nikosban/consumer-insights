import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWidgetStore } from '@/store/widgetStore'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import ChartRenderer from '@/components/charts/ChartRenderer'
import { generateChartData } from '@/data/fakeGenerators'
import type { WidgetType, Widget } from '@/types'
import { METRICS, BREAKDOWNS } from '@/types'

type LocationState = { prefill?: Partial<Widget> }

const CHART_TYPES: WidgetType[] = ['bar', 'line', 'pie', 'scorecard', 'table']

export default function WidgetCreatorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { add } = useWidgetStore()
  const { audiences } = useAudienceStore()

  const prefill = (location.state as LocationState | null)?.prefill

  const [title, setTitle] = useState(prefill?.title ?? '')
  const [type, setType] = useState<WidgetType>(prefill?.type ?? 'bar')
  const [audienceId, setAudienceId] = useState(prefill?.audienceId ?? '')
  const [benchmarkAudienceId, setBenchmarkAudienceId] = useState(prefill?.benchmarkAudienceId ?? '')
  const [metric, setMetric] = useState(prefill?.metric ?? '')
  const [breakdown, setBreakdown] = useState(prefill?.breakdown ?? '')

  const chartData = generateChartData(type, Boolean(benchmarkAudienceId), undefined, `creator:${title || 'preview'}`)

  const previewWidget: Widget = {
    id: 'preview',
    type,
    title,
    audienceId,
    benchmarkAudienceId: benchmarkAudienceId || undefined,
    metric,
    breakdown: breakdown || undefined,
    createdAt: new Date().toISOString(),
  }

  function handleSave() {
    add({
      id: `wid-${Date.now()}`,
      type,
      title,
      audienceId,
      benchmarkAudienceId: benchmarkAudienceId || undefined,
      metric,
      breakdown: breakdown || undefined,
      createdAt: new Date().toISOString(),
    })
    navigate('/dashboards')
  }

  const canSave = title.trim() && audienceId && metric

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-muted-foreground hover:text-foreground mb-2"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-foreground">New Widget</h1>
        <p className="text-sm text-muted-foreground">Configure a chart and save it to your widget library</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="w-title">Title</Label>
            <Input
              id="w-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Purchase Intent by Age Group"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Chart type</Label>
              <Select value={type} onValueChange={(v) => { if (v !== null) setType(v as WidgetType) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Metric</Label>
              <Select value={metric} onValueChange={(v) => { if (v !== null) setMetric(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {METRICS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audienceId} onValueChange={(v) => { if (v !== null) setAudienceId(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Benchmark audience <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Select value={benchmarkAudienceId} onValueChange={(v) => setBenchmarkAudienceId(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {audiences.filter((a) => a.id !== audienceId).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Breakdown <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Select value={breakdown} onValueChange={(v) => setBreakdown(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {BREAKDOWNS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!canSave}>Save Widget</Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Live preview</p>
          <div className="border border-border rounded-lg bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <p className="text-xs font-medium text-foreground truncate flex-1">
                {title || 'Widget preview'}
              </p>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{type}</span>
            </div>
            <ChartRenderer widget={previewWidget} data={chartData} height={280} />
          </div>
          <p className="text-xs text-muted-foreground">Preview uses randomly generated sample data.</p>
        </div>
      </div>
    </div>
  )
}
