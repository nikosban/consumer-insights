import { useParams } from 'react-router-dom'
import { useState } from 'react'
import GridLayout from 'react-grid-layout'
import type { LayoutItem } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { Badge } from '@/components/ui/badge'
import ChartRenderer from '@/components/charts/ChartRenderer'
import { generateChartData } from '@/data/fakeGenerators'

const ROW_HEIGHT = 60

export default function DashboardViewPage() {
  const { id } = useParams<{ id: string }>()
  const { dashboards } = useDashboardStore()
  const { widgets } = useWidgetStore()
  const [containerWidth] = useState(900)

  const dashboard = dashboards.find((d) => d.id === id)

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">Dashboard not found</p>
          <p className="text-sm text-muted-foreground">This link may be invalid or the dashboard was deleted.</p>
        </div>
      </div>
    )
  }

  if (!dashboard.isShared) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-foreground mb-2">This dashboard is not shared</p>
          <p className="text-sm text-muted-foreground">The owner has not enabled public sharing for this dashboard.</p>
        </div>
      </div>
    )
  }

  const layout: LayoutItem[] = dashboard.widgets.map((dw) => ({
    i: dw.widgetId,
    x: dw.position.x,
    y: dw.position.y,
    w: dw.position.w,
    h: dw.position.h,
    static: true,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center px-6 gap-3">
        <span className="font-bold text-primary text-lg">CI</span>
        <span className="font-semibold text-foreground">{dashboard.name}</span>
        <Badge className="bg-primary/10 text-primary border-0 text-xs">Shared Dashboard</Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
        </span>
      </header>

      <div className="p-4" data-dashboard-canvas>
        <GridLayout
          layout={layout}
          gridConfig={{ cols: 12, rowHeight: ROW_HEIGHT, margin: [12, 12] }}
          dragConfig={{ enabled: false, bounded: false, threshold: 3 }}
          resizeConfig={{ enabled: false, handles: [] }}
          width={containerWidth}
        >
          {dashboard.widgets.map((dw) => {
            const widget = widgets.find((w) => w.id === dw.widgetId)
            if (!widget) return null
            const data = generateChartData(widget.type, Boolean(widget.benchmarkAudienceId))
            return (
              <div
                key={dw.widgetId}
                data-widget-id={dw.widgetId}
                className="bg-background border border-border rounded-lg flex flex-col overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
                  <span className="text-xs font-medium truncate flex-1">{widget.title}</span>
                  <Badge variant="secondary" className="text-xs">{widget.type}</Badge>
                </div>
                <div className="flex-1 min-h-0 p-2">
                  <ChartRenderer
                    widget={widget}
                    data={data}
                    height={dw.position.h * ROW_HEIGHT - 52}
                  />
                </div>
              </div>
            )
          })}
        </GridLayout>
      </div>
    </div>
  )
}
