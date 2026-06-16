import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { IconArrowLeft, IconLayoutDashboard, IconFileText, IconPresentation, IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { cn } from '@/lib/utils'
import type { AnalysisSection, Widget } from '@/types'
import ChartRenderer from '@/components/charts/ChartRenderer'
import EmptyState from '@/components/EmptyState'
import { generateChartData } from '@/data/fakeGenerators'
import { toast } from '@/components/ui/Toaster'

// ─── Section catalogue ────────────────────────────────────────────────────────

type SectionTemplate = {
  id: string
  heading: string
  description: string
  content: string
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: 'trend',
    heading: 'Trend Analysis',
    description: 'Week-over-week and seasonal patterns',
    content: 'Longitudinal patterns across the measured audience reveal a steady improvement in purchase intent week-over-week. Seasonality effects are visible but moderate, with the strongest signals concentrated in the 25–44 age cohort. The trend is consistent across both the primary audience and benchmark, suggesting a category-wide lift rather than a segment-specific effect.',
  },
  {
    id: 'competitive',
    heading: 'Competitive Positioning',
    description: 'Brand index vs. category benchmarks',
    content: '• Brand awareness index sits 8 points above the category mean, a meaningful advantage entering Q2.\n• Share of voice analysis indicates the brand is punching above its media-spend weight in the 30–39 cohort.\n• Key vulnerability: the 50–64 segment shows below-average consideration scores, representing an underserved opportunity.',
  },
  {
    id: 'segment',
    heading: 'Segment Deep-Dive',
    description: 'Granular breakdown by age, gender & device',
    content: 'Segmentation reveals distinct behavioural clusters within the primary audience. The 25–34 cohort drives disproportionate intent volume and responds strongly to digital touchpoints. Female respondents index 14 points higher on brand affinity than the audience average. Mobile users show 22% higher purchase conversion than desktop, reinforcing the case for mobile-first activation.\n\n• 25–34: highest intent, digitally native, responsive to short-form content\n• Female 30–44: strong brand advocates, price-sensitive in premium tiers\n• Mobile-primary: faster conversion, lower dwell time, benefit from frictionless UX',
  },
  {
    id: 'opportunity',
    heading: 'Growth Opportunities',
    description: 'Underpenetrated segments and whitespace',
    content: 'Three growth vectors emerge from the data:\n\n1. **50–64 segment** — currently under-indexed on consideration (−8 vs average) but shows high income bracket concentration. A targeted upper-funnel push could unlock meaningful reach at lower CPM.\n2. **Cross-sell with sustainability messaging** — organic food preference correlates strongly with brand affinity among the 30–39 cohort, suggesting a values-based message extension.\n3. **EU market expansion** — German and French sub-audiences show similar intent profiles to US at lower competitive saturation.',
  },
  {
    id: 'methodology',
    heading: 'Methodology & Caveats',
    description: 'Data sources, sample sizes, limitations',
    content: 'All data drawn from the Consumer Insights survey panel. Sample size for primary audience: n = 1,100 (95% CI ±3pp). Benchmark audience: n = 850. Data collected across survey waves Jan–Mar. Index values normalised to 100 = population average. Caution: small-cell breakdowns (n < 50) are excluded from segment-level conclusions. Cross-tabulation p-values not shown; treat directional trends as indicative.',
  },
]

// ─── Streaming helper ─────────────────────────────────────────────────────────

function streamText(text: string, onChunk: (partial: string) => void, onDone: () => void) {
  let i = 0
  function tick() {
    if (i >= text.length) { onDone(); return }
    i = Math.min(i + 4, text.length)
    onChunk(text.slice(0, i))
    setTimeout(tick, 10)
  }
  tick()
}

// ─── Export modal ─────────────────────────────────────────────────────────────

function ExportAnalysisModal({
  open, onClose, analysisName, sections,
}: {
  open: boolean
  onClose: () => void
  analysisName: string
  sections: AnalysisSection[]
}) {
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null)

  async function handlePDF() {
    setExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const margin = 56
      const pageW = pdf.internal.pageSize.getWidth()
      const maxW = pageW - margin * 2
      let y = margin

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.text(analysisName, margin, y)
      y += 32

      for (const section of sections) {
        if (y > 740) { pdf.addPage(); y = margin }
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(13)
        pdf.text(section.heading, margin, y)
        y += 20
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        const lines = pdf.splitTextToSize(section.content, maxW) as string[]
        for (const line of lines) {
          if (y > 760) { pdf.addPage(); y = margin }
          pdf.text(line, margin, y)
          y += 14
        }
        y += 18
      }
      pdf.save(`${analysisName}.pdf`)
      toast.success('PDF exported')
    } finally { setExporting(null); onClose() }
  }

  async function handlePPTX() {
    setExporting('pptx')
    try {
      const pptxgen = (await import('pptxgenjs')).default
      const pptx = new pptxgen()
      pptx.layout = 'LAYOUT_WIDE'

      const titleSlide = pptx.addSlide()
      titleSlide.addText(analysisName, {
        x: 0.8, y: 1.5, w: '85%', h: 1.2,
        fontSize: 28, bold: true, color: '0666E5',
      })
      titleSlide.addText('Consumer Insights Report', {
        x: 0.8, y: 2.8, w: '85%', h: 0.5,
        fontSize: 14, color: '666666',
      })

      for (const section of sections) {
        const slide = pptx.addSlide()
        slide.addText(section.heading, {
          x: 0.5, y: 0.3, w: '90%', h: 0.6,
          fontSize: 18, bold: true, color: '0666E5',
        })
        slide.addText(section.content, {
          x: 0.5, y: 1.1, w: '90%', h: 4.5,
          fontSize: 11, color: '333333',
          valign: 'top', wrap: true,
        })
      }
      await pptx.writeFile({ fileName: `${analysisName}.pptx` })
      toast.success('PPTX exported')
    } finally { setExporting(null); onClose() }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Analysis</DialogTitle>
          <DialogDescription>Choose a format for "{analysisName}"</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button variant="outline" className="justify-start gap-3 h-14" onClick={handlePPTX} disabled={exporting !== null}>
            <IconPresentation className="h-5 w-5 text-primary" strokeWidth={2} />
            <div className="text-left">
              <div className="font-medium">Export as PPTX</div>
              <div className="text-xs text-muted-foreground">One slide per section</div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start gap-3 h-14" onClick={handlePDF} disabled={exporting !== null}>
            <IconFileText className="h-5 w-5 text-primary" strokeWidth={2} />
            <div className="text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-xs text-muted-foreground">Full report as a single document</div>
            </div>
          </Button>
          {exporting && <p className="text-xs text-muted-foreground text-center">Generating {exporting.toUpperCase()}…</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalysisDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { projects, updateAnalysis } = useProjectStore()
  const { dashboards } = useDashboardStore()
  const { widgets } = useWidgetStore()

  const entry = projects.flatMap(p =>
    p.savedAnalyses.map(a => ({ analysis: a, projectId: p.id }))
  ).find(e => e.analysis.id === id)

  const [sections, setSections] = useState<AnalysisSection[]>(entry?.analysis.sections ?? [])
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'report' | 'slides'>('report')

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          title="Analysis not found"
          description="This analysis may have been deleted or the link is incorrect."
          ctaLabel="Back to projects"
          onCta={() => navigate(-1)}
        />
      </div>
    )
  }

  const { analysis, projectId } = entry
  const linkedDashboard = analysis.dashboardId ? dashboards.find(d => d.id === analysis.dashboardId) : null
  const linkedWidgets = linkedDashboard
    ? linkedDashboard.widgets.map(dw => widgets.find(w => w.id === dw.widgetId)).filter(Boolean)
    : []

  const addedHeadings = new Set(sections.map(s => s.heading))
  const suggestions = SECTION_TEMPLATES.filter(t => !addedHeadings.has(t.heading))

  function handleAddSection(template: SectionTemplate) {
    if (streamingId) return
    const newSection: AnalysisSection = { id: `s-${Date.now()}`, heading: template.heading, content: '' }
    const next = [...sections, newSection]
    setSections(next)
    setStreamingId(newSection.id)

    streamText(
      template.content,
      partial => {
        setSections(prev => prev.map(s => s.id === newSection.id ? { ...s, content: partial } : s))
      },
      () => {
        setStreamingId(null)
        const final = [...sections, { ...newSection, content: template.content }]
        updateAnalysis(projectId, analysis.id, { sections: final })
      }
    )
  }

  // Distribute widgets across sections (2 per section, cycling)
  const chartWidgets = linkedWidgets as Widget[]
  function getChartsForSection(idx: number): Widget[] {
    if (chartWidgets.length === 0) return []
    const start = (idx * 2) % chartWidgets.length
    return [chartWidgets[start], chartWidgets[(start + 1) % chartWidgets.length]].filter(Boolean)
  }

  function renderChart(w: Widget) {
    const displayType = w.type === 'scorecard' || w.type === 'table' ? 'bar' : w.type
    return (
      <div key={w.id} className="rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-secondary-foreground mb-2 truncate">{w.title}</p>
        <div className="h-36">
          <ChartRenderer
            widget={{ ...w, type: displayType }}
            data={generateChartData(displayType, false, undefined, `${w.id}:0`, w.metric, w.breakdown)}
            height={144}
          />
        </div>
      </div>
    )
  }

  // Slides: one slide per section (with its charts), plus a title slide
  const slides = [
    { id: 'title', heading: analysis.name, content: `Created ${new Date(analysis.createdAt).toLocaleDateString()}`, charts: [] as Widget[], isTitle: true },
    ...sections.map((s, i) => ({ id: s.id, heading: s.heading, content: s.content, charts: getChartsForSection(i), isTitle: false })),
  ]

  return (
    <div className="flex flex-1 min-h-0">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Header — always visible */}
        <div className="px-6 pt-8 pb-0 max-w-[760px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate('/analyses')}
              className="inline-flex items-center justify-center w-8 h-8 rounded border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            >
              <IconWrapper><IconArrowLeft size={ICON_SIZES.body} strokeWidth={2} /></IconWrapper>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{analysis.name}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sections.length} section{sections.length !== 1 ? 's' : ''} · Created {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => setExportOpen(true)}>
              <IconDownload className="h-3.5 w-3.5" strokeWidth={2} />
              Export
            </Button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-border">
            {(['report', 'slides'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  'px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors',
                  activeTab === t
                    ? 'border-primary text-primary'
                    : 'border-transparent text-secondary-foreground hover:text-foreground'
                )}
              >
                {t === 'slides' ? 'Slides preview' : 'Report'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'report' ? (
            <div className="max-w-[760px] mx-auto px-6 py-8">

              {/* Sections with inline charts */}
              <div className="space-y-10">
                {sections.map((section, i) => {
                  const sectionCharts = getChartsForSection(i)
                  return (
                    <div key={section.id} className={cn('transition-opacity', streamingId === section.id && 'opacity-80')}>
                      <h2 className="text-base font-semibold mb-3">{section.heading}</h2>
                      <div className="text-sm text-foreground leading-7 whitespace-pre-line mb-4">
                        {section.content}
                        {streamingId === section.id && (
                          <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                        )}
                      </div>
                      {sectionCharts.length > 0 && !streamingId && section.content && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {sectionCharts.map(renderChart)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {sections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                  <IconPresentation className="h-8 w-8 text-muted-foreground/30" strokeWidth={2} />
                  <p className="text-sm font-medium text-secondary-foreground">No sections yet</p>
                  <p className="text-xs text-muted-foreground/60">Add a section below to build the report</p>
                </div>
              )}

              {/* Suggested sections */}
              {suggestions.length > 0 && (
                <div className={cn('mt-10 pt-8 border-t border-border', sections.length === 0 && 'mt-0 pt-0 border-0')}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Add a section</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleAddSection(t)}
                        disabled={!!streamingId}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-accent hover:border-primary/30',
                          streamingId && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                          <span className="text-[10px] font-bold">+</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.heading}</p>
                          <p className="text-xs text-secondary-foreground mt-0.5">{t.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Slides preview */
            <div className="px-6 py-8">
              <div className="flex flex-col gap-6 max-w-[760px] mx-auto">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className="flex gap-4 items-start">
                    <span className="text-xs text-muted-foreground mt-3 w-5 shrink-0 text-right">{idx + 1}</span>
                    {/* Slide card — 16:9 */}
                    <div
                      className="flex-1 rounded-xl border border-border bg-background overflow-hidden shadow-sm"
                      style={{ aspectRatio: '16/9', position: 'relative' }}
                    >
                      {slide.isTitle ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary px-8 text-center">
                          <p className="text-white font-bold text-lg leading-tight">{slide.heading}</p>
                          <p className="text-white/60 text-xs mt-2">{slide.content}</p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex gap-0">
                          {/* Text column */}
                          <div className={cn('flex flex-col justify-start p-5 overflow-hidden', slide.charts.length > 0 ? 'w-[45%]' : 'w-full')}>
                            <p className="text-[11px] font-bold text-primary mb-2 uppercase tracking-wide truncate">{slide.heading}</p>
                            <p className="text-[10px] text-foreground leading-[1.55] line-clamp-[10] whitespace-pre-line">{slide.content}</p>
                          </div>
                          {/* Charts column */}
                          {slide.charts.length > 0 && (
                            <div className="w-[55%] flex flex-col gap-1 p-3 pl-0">
                              {slide.charts.map(w => {
                                const displayType = w.type === 'scorecard' || w.type === 'table' ? 'bar' : w.type
                                return (
                                  <div key={w.id} className="flex-1 rounded-lg border border-border bg-muted/20 px-2 pt-1 pb-0 overflow-hidden">
                                    <p className="text-[8px] font-medium text-muted-foreground truncate mb-0.5">{w.title}</p>
                                    <div className="h-full pb-2">
                                      <ChartRenderer
                                        widget={{ ...w, type: displayType }}
                                        data={generateChartData(displayType, false, undefined, `${w.id}:0`, w.metric, w.breakdown)}
                                        height={80}
                                      />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {linkedDashboard && (
        <div className="w-56 shrink-0 border-l border-border overflow-y-auto bg-muted/30 px-4 py-6">
          <div className="flex items-center gap-2 mb-3">
            <IconLayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</p>
          </div>
          <button
            onClick={() => navigate(`/dashboards/${linkedDashboard.id}`)}
            className="text-sm font-medium text-primary hover:underline mb-4 block text-left"
          >
            {linkedDashboard.name}
          </button>
          <div className="space-y-1.5">
            {linkedWidgets.map(w => w && (
              <div key={w.id} className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-xs font-medium truncate">{w.title}</p>
                <p className="text-[10px] text-secondary-foreground mt-0.5 uppercase">{w.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ExportAnalysisModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        analysisName={analysis.name}
        sections={sections}
      />
    </div>
  )
}
