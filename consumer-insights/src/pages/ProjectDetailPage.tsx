import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { generateSections } from '@/data/fakeAnalysisGenerator'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Dashboard, Analysis } from '@/types'

function DashboardRow({ dashboard, onOpen, onDelete }: {
  dashboard: Dashboard
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="group flex items-center gap-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer -mx-3 px-3"
      onClick={onOpen}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
        <LayoutDashboard className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{dashboard.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
          Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        type="button"
        title="Remove from project"
        onClick={e => { e.stopPropagation(); onDelete() }}
        className={cn(
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background',
          'text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive'
        )}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function AnalysesTab({
  project,
  dashboards,
}: {
  project: import('@/types').Project
  dashboards: import('@/types').Dashboard[]
}) {
  const { addAnalysis, updateAnalysis, removeAnalysis } = useProjectStore()
  const { widgets } = useWidgetStore()

  type Mode =
    | { type: 'list' }
    | { type: 'create'; dashboardId: string; template: 'summary' | 'full'; generating: boolean }
    | { type: 'detail'; analysisId: string }

  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null)

  // ── helpers ──────────────────────────────────────────────────────────────

  function getWidgetTitles(dashboard: import('@/types').Dashboard) {
    return dashboard.widgets
      .map((dw) => widgets.find((w) => w.id === dw.widgetId)?.title ?? '')
      .filter(Boolean)
  }

  async function handleGenerate() {
    if (mode.type !== 'create' || !mode.dashboardId) return
    setMode({ ...mode, generating: true })
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
    setMode({ type: 'detail', analysisId: analysis.id })
  }

  async function exportPDF(analysis: Analysis) {
    setExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      let y = 20
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(analysis.name, 14, y)
      y += 8
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 120)
      doc.text(`Generated ${new Date(analysis.createdAt).toLocaleDateString()}`, 14, y)
      y += 12
      for (const sec of analysis.sections ?? []) {
        if (y > 250) { doc.addPage(); y = 20 }
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(sec.heading, 14, y)
        y += 7
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(sec.content, 180)
        doc.text(lines, 14, y)
        y += lines.length * 5 + 10
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
      const title = pptx.addSlide()
      title.addText(analysis.name, { x: 1, y: 1.5, w: 8, h: 1.2, fontSize: 28, bold: true, color: '111827' })
      title.addText(`Generated ${new Date(analysis.createdAt).toLocaleDateString()}`, { x: 1, y: 3, w: 8, h: 0.5, fontSize: 14, color: '6B7280' })
      for (const sec of analysis.sections ?? []) {
        const slide = pptx.addSlide()
        slide.addText(sec.heading, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 20, bold: true, color: '111827' })
        slide.addText(sec.content, { x: 0.5, y: 1.1, w: 9, h: 5, fontSize: 12, color: '374151' })
      }
      await pptx.writeFile({ fileName: `${analysis.name}.pptx` })
    } finally {
      setExporting(null)
    }
  }

  // ── list view ─────────────────────────────────────────────────────────────

  if (mode.type === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {project.savedAnalyses.length === 0
              ? 'No analyses yet.'
              : `${project.savedAnalyses.length} analysis${project.savedAnalyses.length !== 1 ? 'es' : ''}`}
          </p>
          <Button
            size="sm"
            onClick={() =>
              setMode({ type: 'create', dashboardId: dashboards[0]?.id ?? '', template: 'summary', generating: false })
            }
            disabled={dashboards.length === 0}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            New Analysis
          </Button>
        </div>

        {dashboards.length === 0 && (
          <p className="text-xs text-muted-foreground bg-gray-50 rounded-lg px-4 py-3">
            Link a dashboard to this project first, then generate an analysis from it.
          </p>
        )}

        {project.savedAnalyses.length === 0 && dashboards.length > 0 ? (
          <EmptyState
            title="No analyses yet"
            description="Generate a narrative report from any dashboard linked to this project."
            ctaLabel="New Analysis"
            onCta={() =>
              setMode({ type: 'create', dashboardId: dashboards[0].id, template: 'summary', generating: false })
            }
          />
        ) : (
          <div className="space-y-2">
            {project.savedAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="group flex items-center gap-3 py-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3 px-3 cursor-pointer"
                onClick={() => setMode({ type: 'detail', analysisId: analysis.id })}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{analysis.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {analysis.sections?.length ?? 0} section{(analysis.sections?.length ?? 0) !== 1 ? 's' : ''} &nbsp;·&nbsp;
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                <button
                  type="button"
                  title="Delete analysis"
                  onClick={(e) => { e.stopPropagation(); removeAnalysis(project.id, analysis.id) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
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
          onClick={() => setMode({ type: 'list' })}
        >
          ← Back to analyses
        </button>

        <h2 className="text-base font-semibold text-gray-900">New Analysis</h2>

        {/* Dashboard picker */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">1. Choose a dashboard</p>
          <div className="space-y-2">
            {dashboards.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setMode({ ...mode, dashboardId: d.id })}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-colors',
                  mode.dashboardId === d.id
                    ? 'border-primary bg-primary/5 text-gray-900'
                    : 'border-border hover:border-gray-300 hover:bg-gray-50 text-gray-700'
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
          <p className="text-sm font-medium text-gray-700">2. Report format</p>
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
                    : 'border-border hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <p className={cn('text-sm font-semibold', mode.template === t.value ? 'text-primary' : 'text-gray-900')}>
                  {t.label}
                </p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            onClick={() => { setMode({ type: 'list' }); setEditingSection(null) }}
          >
            ← Back to analyses
          </button>
          <h2 className="text-base font-semibold text-gray-900">{analysis.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generated {new Date(analysis.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled={exporting !== null}
            onClick={() => exportPDF(analysis)}
          >
            {exporting === 'pdf'
              ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              : <FileText className="h-3.5 w-3.5 mr-1.5" />}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exporting !== null}
            onClick={() => exportPPTX(analysis)}
          >
            {exporting === 'pptx'
              ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              : <Presentation className="h-3.5 w-3.5 mr-1.5" />}
            PPTX
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {(analysis.sections ?? []).map((sec) => (
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
            <CardContent className="pb-4">
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
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {sec.content}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects, addNote, updateNote, removeNote, unlinkDashboard } = useProjectStore()
  const { audiences } = useAudienceStore()
  const { dashboards } = useDashboardStore()

  const project = projects.find((p) => p.id === projectId)

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'dashboards'

  const [noteText, setNoteText] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')

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

  function handleAddNote() {
    const trimmed = noteText.trim()
    if (!trimmed) return
    addNote(proj.id, {
      id: `note-${Date.now()}`,
      content: trimmed,
      createdAt: new Date().toISOString(),
    })
    setNoteText('')
  }

  function handleSaveEdit(noteId: string) {
    updateNote(proj.id, noteId, editingContent)
    setEditingNoteId(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Analyses */}
        <TabsContent value="analyses" className="mt-4">
          <AnalysesTab project={proj} dashboards={projectDashboards} />
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
            <div className="flex flex-col">
              {projectDashboards.map((d) => (
                <DashboardRow
                  key={d.id}
                  dashboard={d}
                  onOpen={() => navigate(`/dashboards/${d.id}`)}
                  onDelete={() => unlinkDashboard(proj.id, d.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Notes */}
        <TabsContent value="notes" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a note…"
              className="resize-none text-sm"
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button onClick={handleAddNote} disabled={!noteText.trim()}>
              Save
            </Button>
          </div>

          {proj.notes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              description="Add your first note to capture insights, follow-ups, or observations."
            />
          ) : (
            <div className="space-y-2">
              {proj.notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4 pb-3">
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={2}
                          className="text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(note.id)}>
                            <Check className="h-3.5 w-3.5 mr-1" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(null)}>
                            <X className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <p className="text-sm flex-1 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingNoteId(note.id); setEditingContent(note.content) }}
                            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeNote(proj.id, note.id)}
                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
