import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { generateSections } from '@/data/fakeAnalysisGenerator'
import { generateChartData } from '@/data/fakeGenerators'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/EmptyState'
import {
  Trash2,
  Pencil,
  Check,
  X,
  LayoutDashboard,
  FileText,
  Presentation,
  Sparkles,
  ChevronRight,
  Loader2,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Analysis, Widget, ChartData, WidgetType } from '@/types'
import { ResourceCard, IconBtn, PageShell } from '@/components/app'

function AnalysesTab({
  project,
  dashboards,
  newFrom,
  onSubViewChange,
}: {
  project: import('@/types').Project
  dashboards: import('@/types').Dashboard[]
  newFrom?: string
  onSubViewChange?: (inSubView: boolean) => void
}) {
  const { addAnalysis, updateAnalysis, removeAnalysis } = useProjectStore()
  const { widgets } = useWidgetStore()

  type Mode =
    | { type: 'list' }
    | { type: 'create'; dashboardId: string; template: 'summary' | 'full'; generating: boolean }
    | { type: 'detail'; analysisId: string }

  const [mode, setMode] = useState<Mode>(
    newFrom && dashboards.find(d => d.id === newFrom)
      ? { type: 'create', dashboardId: newFrom, template: 'summary', generating: false }
      : { type: 'list' }
  )

  function changeMode(next: Mode) {
    setMode(next)
    onSubViewChange?.(next.type !== 'list')
  }

  useEffect(() => {
    onSubViewChange?.(mode.type !== 'list')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null)
  const [brandColor, setBrandColor] = useState('#4F46E5')
  const [brandLogo, setBrandLogo] = useState<string | null>(null)

  function hexToRgb(hex: string) {
    const h = hex.replace('#', '')
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
  }
  const pptxColor = brandColor.replace('#', '')

  function goToDetail(analysisId: string) {
    changeMode({ type: 'detail', analysisId })
    setEditingSection(null)
  }

  // Stable widget data for the current analysis (memoised to keep random values fixed)
  const currentAnalysisId = mode.type === 'detail' ? mode.analysisId : null
  type WidgetDatum = { widget: Widget; data: ChartData }
  const widgetData = useMemo((): { scorecards: WidgetDatum[]; charts: WidgetDatum[] } => {
    if (!currentAnalysisId) return { scorecards: [], charts: [] }
    const analysis = project.savedAnalyses.find(a => a.id === currentAnalysisId)
    if (!analysis?.dashboardId) return { scorecards: [], charts: [] }
    const dashboard = dashboards.find(d => d.id === analysis.dashboardId)
    if (!dashboard) return { scorecards: [], charts: [] }
    const all = dashboard.widgets
      .map(dw => widgets.find(w => w.id === dw.widgetId))
      .filter((w): w is Widget => w !== undefined)
      .map(w => ({ widget: w, data: generateChartData(w.type, !!w.benchmarkAudienceId, w.crossDimensionLabel, `${w.id}:0`, w.metric, w.breakdown) }))
    return {
      scorecards: all.filter(d => d.widget.type === 'scorecard'),
      charts: all.filter(d => d.widget.type !== 'scorecard' && d.widget.type !== 'table'),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAnalysisId, dashboards, widgets])

  // ── helpers ──────────────────────────────────────────────────────────────

  function getWidgetTitles(dashboard: import('@/types').Dashboard) {
    return dashboard.widgets
      .map((dw) => widgets.find((w) => w.id === dw.widgetId)?.title ?? '')
      .filter(Boolean)
  }

  async function handleGenerate() {
    if (mode.type !== 'create' || !mode.dashboardId) return
    changeMode({ ...mode, generating: true })
    await new Promise((r) => setTimeout(r, 1500))
    const dashboard = dashboards.find((d) => d.id === mode.dashboardId)!
    const sections = generateSections(dashboard.name, getWidgetTitles(dashboard), mode.template)
    const analysis: Analysis = {
      id: `ana-${Date.now()}`,
      name: `${dashboard.name} — ${mode.template === 'summary' ? 'Summary' : 'Full Report'}`,
      dashboardId: dashboard.id,
      template: mode.template,
      sections,
      audienceId: '',
      widgetIds: [],
      createdAt: new Date().toISOString(),
    }
    addAnalysis(project.id, analysis)
    goToDetail(analysis.id)
  }

  async function exportPDF(analysis: Analysis) {
    setExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const { r, g, b } = hexToRgb(brandColor)

      const addPageHeader = (pageNum: number) => {
        if (brandLogo && pageNum > 1) {
          try { doc.addImage(brandLogo, 'PNG', 160, 6, 30, 10) } catch {}
        }
      }

      let y = 20; let pageNum = 1

      // Title block
      if (brandLogo) { try { doc.addImage(brandLogo, 'PNG', 14, 10, 40, 14) } catch {} y = 32 }
      doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(r, g, b)
      doc.text(analysis.name, 14, y); y += 9
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
      doc.text(`Generated ${new Date(analysis.createdAt).toLocaleDateString()}`, 14, y); y += 14

      // Key Metrics
      if (widgetData.scorecards.length > 0) {
        if (y > 240) { doc.addPage(); pageNum++; addPageHeader(pageNum); y = 20 }
        doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(r, g, b)
        doc.text('Key Metrics', 14, y); y += 8
        const cardW = 85; const cardH = 22
        widgetData.scorecards.forEach((d, i) => {
          const col = i % 2; const row = Math.floor(i / 2)
          const x = 14 + col * (cardW + 10); const cardY = y + row * (cardH + 5)
          doc.setFillColor(249, 250, 251); doc.setDrawColor(r, g, b)
          doc.roundedRect(x, cardY, cardW, cardH, 2, 2, 'FD')
          doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128)
          doc.text(d.widget.title, x + 4, cardY + 7)
          doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(r, g, b)
          doc.text(`${d.data.series[0].values[0]}%`, x + 4, cardY + 17)
          if (d.data.series[1]) {
            doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(156, 163, 175)
            doc.text(`Benchmark: ${d.data.series[1].values[0]}%`, x + 34, cardY + 17)
          }
        })
        y += Math.ceil(widgetData.scorecards.length / 2) * (cardH + 5) + 10
      }

      // Paired sections + charts
      const sections = analysis.sections ?? []
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        const chart = widgetData.charts[i]
        if (y > 220) { doc.addPage(); pageNum++; addPageHeader(pageNum); y = 20 }

        // Section heading
        doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(r, g, b)
        doc.text(sec.heading, 14, y); y += 7

        // Chart table (if paired)
        if (chart) {
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(107, 114, 128)
          doc.text(chart.widget.title, 14, y); y += 4
          doc.setFontSize(8); doc.setTextColor(107, 114, 128)
          doc.text('Category', 14, y)
          chart.data.series.forEach((s, si) => doc.text(s.name, 70 + si * 40, y))
          y += 3; doc.setDrawColor(229, 231, 235); doc.line(14, y, 196, y); y += 3
          doc.setFont('helvetica', 'normal')
          chart.data.labels.forEach((label, li) => {
            if (y > 270) { doc.addPage(); pageNum++; addPageHeader(pageNum); y = 20 }
            doc.setTextColor(55, 65, 81); doc.text(label, 14, y)
            chart.data.series.forEach((s, si) => doc.text(`${s.values[li]}%`, 70 + si * 40, y))
            y += 5
          })
          y += 5
        }

        // Narrative text
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(55, 65, 81)
        const lines = doc.splitTextToSize(sec.content, 180)
        if (y + lines.length * 5 > 270) { doc.addPage(); pageNum++; addPageHeader(pageNum); y = 20 }
        doc.text(lines, 14, y); y += lines.length * 5 + 12
      }

      doc.save(`${analysis.name}.pdf`)
    } finally {
      setExporting(null)
    }
  }

  async function exportPPTX(analysis: Analysis) {
    setExporting('pptx')
    try {
      const pptxgen = (await import('pptxgenjs')).default
      const pptx = new pptxgen()
      pptx.layout = 'LAYOUT_WIDE'

      const addLogo = (slide: ReturnType<typeof pptx.addSlide>, dark = false) => {
        if (!brandLogo) return
        try { slide.addImage({ data: brandLogo, x: 8.8, y: 0.1, w: 1.1, h: 0.45, sizing: { type: 'contain', w: 1.1, h: 0.45 } }) }
        catch { slide.addText('●', { x: 8.8, y: 0.1, w: 1.1, h: 0.45, fontSize: 8, color: dark ? 'FFFFFF' : '9CA3AF' }) }
      }

      // Title slide
      const title = pptx.addSlide()
      title.background = { color: pptxColor }
      if (brandLogo) {
        try { title.addImage({ data: brandLogo, x: 4.0, y: 0.5, w: 2, h: 0.8, sizing: { type: 'contain', w: 2, h: 0.8 } }) } catch {}
      }
      title.addText(analysis.name, { x: 1, y: brandLogo ? 1.6 : 1.8, w: 8, h: 1.2, fontSize: 28, bold: true, color: 'FFFFFF', align: 'center' })
      title.addText(`Generated ${new Date(analysis.createdAt).toLocaleDateString()}`, { x: 1, y: brandLogo ? 3.0 : 3.2, w: 8, h: 0.5, fontSize: 13, color: 'FFFFFF', transparency: 35, align: 'center' })

      // Key Metrics slide
      if (widgetData.scorecards.length > 0) {
        const ms = pptx.addSlide()
        addLogo(ms)
        ms.addShape('rect' as Parameters<typeof ms.addShape>[0], { x: 0, y: 0, w: 10, h: 0.65, fill: { color: pptxColor } })
        ms.addText('Key Metrics', { x: 0.4, y: 0.08, w: 9, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF' })
        const cols = Math.min(widgetData.scorecards.length, 3)
        const cardW = (9.5 / cols) - 0.15
        widgetData.scorecards.forEach((d, i) => {
          const col = i % cols; const row = Math.floor(i / cols)
          const x = 0.25 + col * (cardW + 0.15); const y = 0.85 + row * 1.7
          ms.addShape('rect' as Parameters<typeof ms.addShape>[0], { x, y, w: cardW, h: 1.5, fill: { color: 'F9FAFB' }, line: { color: 'E5E7EB', width: 0.5 } })
          ms.addText(d.widget.title, { x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.32, fontSize: 10, color: '6B7280' })
          ms.addText(`${d.data.series[0].values[0]}%`, { x: x + 0.12, y: y + 0.48, w: cardW - 0.24, h: 0.65, fontSize: 26, bold: true, color: pptxColor })
          if (d.data.series[1]) ms.addText(`vs ${d.data.series[1].values[0]}% benchmark`, { x: x + 0.12, y: y + 1.18, w: cardW - 0.24, h: 0.28, fontSize: 9, color: '9CA3AF' })
        })
      }

      // Paired section + chart slides
      const sections = analysis.sections ?? []
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        const chart = widgetData.charts[i]
        const slide = pptx.addSlide()
        addLogo(slide)

        // Branded header strip
        slide.addShape('rect' as Parameters<typeof slide.addShape>[0], { x: 0, y: 0, w: 10, h: 0.65, fill: { color: pptxColor } })
        slide.addText(sec.heading, { x: 0.4, y: 0.08, w: 9, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF' })

        if (chart) {
          // Chart left, text right
          const chartRows = chart.data.series.map(s => ({ name: s.name, labels: chart.data.labels, values: s.values }))
          const ct: WidgetType = chart.widget.type
          slide.addChart(
            ct === 'line' ? pptx.ChartType.line : ct === 'pie' ? pptx.ChartType.pie : pptx.ChartType.bar,
            chartRows,
            { x: 0.25, y: 0.75, w: 5.2, h: 4.4, chartColors: [pptxColor, '10B981', 'F59E0B', 'EF4444', '8B5CF6'], showLegend: chart.data.series.length > 1, legendPos: 'b', dataLabelFontSize: 8 },
          )
          slide.addText(sec.content, { x: 5.65, y: 0.75, w: 4.1, h: 4.4, fontSize: 11, color: '374151', valign: 'top' })
        } else {
          slide.addText(sec.content, { x: 0.4, y: 0.8, w: 9.2, h: 4.4, fontSize: 12, color: '374151', valign: 'top' })
        }
      }

      await pptx.writeFile({ fileName: `${analysis.name}.pptx` })
    } finally {
      setExporting(null)
    }
  }

  // ── list view ─────────────────────────────────────────────────────────────

  if (mode.type === 'list') {
    return (
      <div>
        {dashboards.length === 0 && (
          <p className="text-xs text-muted-foreground bg-muted rounded-lg px-4 py-3 mb-4">
            Link a dashboard to this project first, then generate an analysis from it.
          </p>
        )}

        {project.savedAnalyses.length === 0 && dashboards.length > 0 ? (
          <EmptyState
            title="No analyses yet"
            description="Generate a narrative report from any dashboard linked to this project."
            ctaLabel="New Analysis"
            onCta={() =>
              changeMode({ type: 'create', dashboardId: dashboards[0].id, template: 'summary', generating: false })
            }
          />
        ) : (
          <>
            {/* List header */}
            {project.savedAnalyses.length > 0 && (
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                  {project.savedAnalyses.length} {project.savedAnalyses.length === 1 ? 'analysis' : 'analyses'}
                </p>
              </div>
            )}

            {/* Rows */}
            <div className="flex flex-col gap-2">
              {project.savedAnalyses.map((analysis) => {
                const linkedDash = dashboards.find(d => d.id === analysis.dashboardId)
                return (
                  <ResourceCard
                    key={analysis.id}
                    icon={<FileText className="h-4 w-4" />}
                    title={analysis.name}
                    meta={[
                      `${analysis.sections?.length ?? 0} section${(analysis.sections?.length ?? 0) !== 1 ? 's' : ''}`,
                      linkedDash?.name,
                    ].filter(Boolean).join(' · ')}
                    date={new Date(analysis.createdAt).toLocaleDateString()}
                    actions={
                      <>
                        <IconBtn icon={<ChevronRight className="h-3 w-3" />} label="Open" onClick={() => goToDetail(analysis.id)} />
                        <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => removeAnalysis(project.id, analysis.id)} />
                      </>
                    }
                    onClick={() => goToDetail(analysis.id)}
                  />
                )
              })}
            </div>

            {/* New analysis CTA */}
            {dashboards.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    changeMode({ type: 'create', dashboardId: dashboards[0]?.id ?? '', template: 'summary', generating: false })
                  }
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  New Analysis
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // ── create view ───────────────────────────────────────────────────────────

  if (mode.type === 'create') {
    if (mode.generating) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Generating your analysis…</p>
        </div>
      )
    }

    return (
      <div className="space-y-6 max-w-lg">
        <button
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={() => changeMode({ type: 'list' })}
        >
          ← Back to analyses
        </button>

        {/* Dashboard picker */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-foreground">1. Choose a dashboard</p>
          <div className="space-y-2">
            {dashboards.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setMode({ ...mode, dashboardId: d.id })}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-colors',
                  mode.dashboardId === d.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border hover:bg-accent text-secondary-foreground'
                )}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.widgets.length} widget{d.widgets.length !== 1 ? 's' : ''}</p>
                </div>
                {mode.dashboardId === d.id && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Template picker */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-foreground">2. Report format</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'summary', label: 'Summary', desc: '3 sections · Quick read', badge: '~1 min' },
              { value: 'full', label: 'Full Report', desc: '5 sections · Deep analysis', badge: '~3 min' },
            ] as const).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setMode({ ...mode, template: t.value })}
                className={cn(
                  'flex flex-col gap-1.5 px-4 py-4 rounded-xl border text-left transition-colors',
                  mode.template === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                )}
              >
                <p className={cn('text-sm font-semibold', mode.template === t.value ? 'text-primary' : 'text-foreground')}>
                  {t.label}
                </p>
                <p className="text-xs text-secondary-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!mode.dashboardId}
          onClick={handleGenerate}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Generate Analysis
        </Button>
      </div>
    )
  }

  // ── detail view ───────────────────────────────────────────────────────────

  const analysis = project.savedAnalyses.find((a) => a.id === mode.analysisId)
  if (!analysis) return null

  function saveSection(sectionId: string) {
    if (!analysis) return
    const updated = (analysis.sections ?? []).map((s) =>
      s.id === sectionId ? { ...s, content: editContent } : s
    )
    updateAnalysis(project.id, analysis.id, { sections: updated })
    setEditingSection(null)
  }

  const sections = analysis.sections ?? []

  const PRESET_COLORS = ['#4F46E5', '#0F172A', '#DC2626', '#D97706', '#16A34A', '#0284C7', '#7C3AED', '#DB2777']

  return (
    <div className="flex gap-5 items-start">

    {/* ── Main content ─────────────────────────────────────────────────── */}
    <div className="flex-1 min-w-0 space-y-3">
      <button
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        onClick={() => { changeMode({ type: 'list' }); setEditingSection(null) }}
      >
        ← Back to analyses
      </button>

      {/* Key metrics — standalone summary at the top */}
      {widgetData.scorecards.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 gap-3">
              {widgetData.scorecards.map(d => (
                <div key={d.widget.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-secondary-foreground">{d.widget.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{d.data.series[0].values[0]}%</p>
                  {d.data.series[1] && (
                    <p className="text-xs text-muted-foreground mt-0.5">Benchmark {d.data.series[1].values[0]}%</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections paired with their chart (first section → first chart, etc.) */}
      {sections.map((sec, i) => {
        const paired = widgetData.charts[i]
        const max = paired ? Math.max(...paired.data.series[0].values) : 0
        return (
          <Card key={sec.id}>
            <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">{sec.heading}</CardTitle>
              {editingSection !== sec.id && (
                <button
                  onClick={() => { setEditingSection(sec.id); setEditContent(sec.content) }}
                  className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              {/* Chart for this section */}
              {paired && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-secondary-foreground">{paired.widget.title}</p>
                  <div className="space-y-1.5">
                    {paired.data.labels.map((label, li) => {
                      const pct = Math.round((paired.data.series[0].values[li] / max) * 100)
                      return (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-xs text-secondary-foreground w-20 shrink-0 truncate">{label}</span>
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: brandColor, opacity: 0.75 }} />
                          </div>
                          <span className="text-xs text-secondary-foreground w-8 tabular-nums text-right">{paired.data.series[0].values[li]}%</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t border-border mt-3 pt-3" />
                </div>
              )}
              {/* Narrative */}
              {editingSection === sec.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveSection(sec.id)}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingSection(null)}>
                      <X className="h-3.5 w-3.5 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-secondary-foreground whitespace-pre-line leading-relaxed">
                  {sec.content}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Export */}
      <div className="flex gap-3 pt-1">
        <Button variant="outline" className="flex-1" disabled={exporting !== null} onClick={() => exportPDF(analysis)}>
          {exporting === 'pdf' ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-2" />}
          Download PDF
        </Button>
        <Button variant="outline" className="flex-1" disabled={exporting !== null} onClick={() => exportPPTX(analysis)}>
          {exporting === 'pptx' ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Presentation className="h-3.5 w-3.5 mr-2" />}
          Download PPTX
        </Button>
      </div>
    </div>

    {/* ── Customization panel ───────────────────────────────────────────── */}
    <div className="w-56 shrink-0 sticky top-6 space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-3">Customization</p>

      {/* Brand color */}
      <div className="rounded-xl border border-border bg-white p-4 space-y-3">
        <p className="text-xs font-medium text-gray-700">Brand color</p>
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer">
            <span
              className="block w-8 h-8 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: brandColor }}
            />
            <input
              type="color"
              value={brandColor}
              onChange={e => setBrandColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </label>
          <span className="text-xs text-muted-foreground font-mono">{brandColor.toUpperCase()}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setBrandColor(c)}
              title={c}
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-transform hover:scale-110',
                brandColor.toLowerCase() === c.toLowerCase() ? 'border-gray-700 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="rounded-xl border border-border bg-white p-4 space-y-3">
        <p className="text-xs font-medium text-gray-700">Logo</p>
        {brandLogo ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center h-12 bg-gray-50 rounded-lg border border-border">
              <img src={brandLogo} className="max-h-10 max-w-[120px] object-contain" alt="logo" />
            </div>
            <button
              onClick={() => setBrandLogo(null)}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Remove logo
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload logo</span>
            <span className="text-[10px] text-gray-400">PNG, SVG, JPG</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = ev => setBrandLogo(ev.target?.result as string)
                reader.readAsDataURL(file)
              }}
            />
          </label>
        )}
      </div>
    </div>

    </div>
  )
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects, unlinkDashboard } = useProjectStore()
  const { audiences } = useAudienceStore()
  const { dashboards } = useDashboardStore()

  const project = projects.find((p) => p.id === projectId)

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'dashboards'
  const newFrom = searchParams.get('newFrom') ?? undefined

  useEffect(() => {
    if (newFrom) setSearchParams({ tab: 'analyses', newFrom }, { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [analysesSubView, setAnalysesSubView] = useState(!!newFrom)

  // suppress unused warning — audiences is used elsewhere in the app via this store
  void audiences

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="link" onClick={() => navigate('/workspace')}>Back to workspace</Button>
      </div>
    )
  }

  const proj = project
  const projectDashboards = dashboards.filter((d) => proj.dashboardIds.includes(d.id))

  return (
    <PageShell>
      <div className="mb-6">
        <button
          onClick={() => navigate('/workspace')}
          className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
        >
          ← Workspace
        </button>
        <h1 className="text-xl font-bold text-foreground">{proj.name}</h1>
        <p className="text-xs text-muted-foreground">Created {new Date(proj.createdAt).toLocaleDateString()}</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        {!(activeTab === 'analyses' && analysesSubView) && (
          <TabsList>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
          </TabsList>
        )}

        {/* Analyses */}
        <TabsContent value="analyses" className="mt-4">
          <AnalysesTab project={proj} dashboards={projectDashboards} newFrom={newFrom} onSubViewChange={setAnalysesSubView} />
        </TabsContent>

        {/* Dashboards */}
        <TabsContent value="dashboards" className="mt-4">
          {projectDashboards.length === 0 ? (
            <EmptyState
              title="No dashboards linked"
              description="Create a dashboard and link it to this project to track it here."
              ctaLabel="Create a dashboard"
              onCta={() => navigate('/dashboards/new')}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {projectDashboards.map((d) => (
                <ResourceCard
                  key={d.id}
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  title={d.name}
                  meta={`${d.widgets.length} widget${d.widgets.length !== 1 ? 's' : ''}`}
                  date={`Updated ${new Date(d.updatedAt).toLocaleDateString()}`}
                  actions={
                    <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Remove from project" destructive onClick={() => unlinkDashboard(proj.id, d.id)} />
                  }
                  onClick={() => navigate(`/dashboards/${d.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </PageShell>
  )
}
