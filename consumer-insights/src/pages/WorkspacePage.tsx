import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/button'
import { ResourceCard, PageShell } from '@/components/app'
import EmptyState from '@/components/EmptyState'
import { IconPlus, IconFolder } from '@tabler/icons-react'

export default function WorkspacePage() {
  const navigate = useNavigate()
  const { projects, add } = useProjectStore()

  function handleNewWorkspace() {
    const id = `proj-${Date.now()}`
    add({
      id,
      name: 'Untitled Project',
      savedAnalyses: [],
      dashboardIds: [],
      createdAt: new Date().toISOString(),
    })
    navigate(`/workspace/${id}`)
  }

  return (
    <PageShell className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Workspaces</h1>
          <p className="text-sm text-muted-foreground">Organise your dashboards and analyses into folders</p>
        </div>
        <Button onClick={handleNewWorkspace}>
          <IconPlus className="h-4 w-4 mr-1" strokeWidth={2} />
          New Workspace
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organising your research, analyses, and dashboards."
          ctaLabel="Create your first project"
          onCta={handleNewWorkspace}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <ResourceCard
              key={project.id}
              icon={<IconFolder className="h-4 w-4" strokeWidth={2} />}
              title={project.name}
              meta={`${project.savedAnalyses.length} ${project.savedAnalyses.length === 1 ? 'analysis' : 'analyses'} · ${project.dashboardIds.length} ${project.dashboardIds.length === 1 ? 'dashboard' : 'dashboards'}`}
              date={`Created ${new Date(project.createdAt).toLocaleDateString()}`}
              onClick={() => navigate(`/workspace/${project.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
