import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/EmptyState'
import { Plus, BarChart2, LayoutDashboard } from 'lucide-react'

export default function WorkspacePage() {
  const navigate = useNavigate()
  const { projects, add } = useProjectStore()

  function handleNewProject() {
    const id = `proj-${Date.now()}`
    add({
      id,
      name: 'Untitled Project',
      savedAnalyses: [],
      notes: [],
      dashboardIds: [],
      createdAt: new Date().toISOString(),
    })
    navigate(`/workspace/${id}`)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Your Workspace</h1>
          <p className="text-sm text-muted-foreground">Manage projects, analyses, and dashboards</p>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organising your research, analyses, and dashboards."
          ctaLabel="Create your first project"
          onCta={handleNewProject}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => navigate(`/workspace/${project.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BarChart2 className="h-3.5 w-3.5" />
                    {project.savedAnalyses.length} {project.savedAnalyses.length === 1 ? 'analysis' : 'analyses'}
                  </span>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    {project.dashboardIds.length} {project.dashboardIds.length === 1 ? 'dashboard' : 'dashboards'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
