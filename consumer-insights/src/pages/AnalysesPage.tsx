import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { ResourceCard, PageShell } from '@/components/app'
import EmptyState from '@/components/EmptyState'
import { FileText } from 'lucide-react'

export default function AnalysesPage() {
  const navigate = useNavigate()
  const { projects } = useProjectStore()

  const analyses = projects.flatMap((project) =>
    project.savedAnalyses.map((analysis) => ({ analysis, project }))
  )

  return (
    <PageShell className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Analyses</h1>
        <p className="text-sm text-muted-foreground">All your saved analyses</p>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          title="No analyses yet"
          description="Generate an analysis from a dashboard using the Generate button."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {analyses.map(({ analysis, project }) => (
            <ResourceCard
              key={analysis.id}
              icon={<FileText className="h-4 w-4" />}
              title={analysis.name}
              meta={`${analysis.sections?.length ?? 0} ${(analysis.sections?.length ?? 0) === 1 ? 'section' : 'sections'} · ${project.name}`}
              date={`Created ${new Date(analysis.createdAt).toLocaleDateString()}`}
              onClick={() => navigate(`/analyses/${analysis.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
