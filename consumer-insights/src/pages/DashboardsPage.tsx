import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboardStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResourceCard, IconBtn, PageShell } from '@/components/app'
import EmptyState from '@/components/EmptyState'
import { IconPlus, IconLayoutDashboard, IconPencil, IconTrash } from '@tabler/icons-react'

export default function DashboardsPage() {
  const navigate = useNavigate()
  const { dashboards, remove } = useDashboardStore()

  return (
    <PageShell className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboards</h1>
          <p className="text-sm text-secondary-foreground">Build and share interactive dashboards</p>
        </div>
        <Button onClick={() => navigate('/dashboards/new')}>
          <IconPlus className="h-4 w-4 mr-1" strokeWidth={2} />
          New Dashboard
        </Button>
      </div>

      {dashboards.length === 0 ? (
        <EmptyState
          title="No dashboards yet"
          description="Create your first dashboard by combining widgets onto a shared canvas."
          ctaLabel="Create a dashboard"
          onCta={() => navigate('/dashboards/new')}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {dashboards.map((d) => (
            <ResourceCard
              key={d.id}
              icon={<IconLayoutDashboard className="h-4 w-4" strokeWidth={2} />}
              title={d.name}
              meta={
                <>
                  {d.widgets.length} widget{d.widgets.length !== 1 ? 's' : ''}
                  {d.isShared && (
                    <Badge className="ml-2 text-[10px] bg-primary/10 text-primary border-0 align-middle">Shared</Badge>
                  )}
                </>
              }
              date={`Updated ${new Date(d.updatedAt).toLocaleDateString()}`}
              actions={
                <>
                  <IconBtn icon={<IconPencil className="h-3 w-3" strokeWidth={2} />} label="Edit" onClick={() => navigate(`/dashboards/${d.id}`)} />
                  <IconBtn icon={<IconTrash className="h-3 w-3" strokeWidth={2} />} label="Delete" destructive onClick={() => remove(d.id)} />
                </>
              }
              onClick={() => navigate(`/dashboards/${d.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
