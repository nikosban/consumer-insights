import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboardStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/EmptyState'
import { Plus, LayoutDashboard } from 'lucide-react'

export default function DashboardsPage() {
  const navigate = useNavigate()
  const { dashboards } = useDashboardStore()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboards</h1>
          <p className="text-sm text-muted-foreground">Build and share interactive dashboards</p>
        </div>
        <Button onClick={() => navigate('/dashboards/new')}>
          <Plus className="h-4 w-4 mr-1" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((d) => (
            <Card
              key={d.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => navigate(`/dashboards/${d.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <LayoutDashboard className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">{d.name}</CardTitle>
                  </div>
                  {d.isShared && (
                    <Badge className="text-xs bg-primary/10 text-primary border-0 shrink-0">Shared</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {d.widgets.length} widget{d.widgets.length !== 1 ? 's' : ''} &nbsp;&bull;&nbsp;
                  Updated {new Date(d.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
