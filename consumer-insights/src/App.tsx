import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import WorkspacePage from '@/pages/WorkspacePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import AudiencesPage from '@/pages/AudiencesPage'
import AudienceBuilderPage from '@/pages/AudienceBuilderPage'
import DashboardsPage from '@/pages/DashboardsPage'
import DashboardBuilderPage from '@/pages/DashboardBuilderPage'
import DashboardViewPage from '@/pages/DashboardViewPage'
import ResearchAIPage from '@/pages/ResearchAIPage'
import WidgetCreatorPage from '@/pages/WidgetCreatorPage'
import ChartsPage from '@/pages/ChartsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/workspace/:projectId" element={<ProjectDetailPage />} />
        <Route path="/audiences" element={<AudiencesPage />} />
        <Route path="/audiences/new" element={<AudienceBuilderPage />} />
        <Route path="/audiences/:id/edit" element={<AudienceBuilderPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/dashboards/new" element={<DashboardBuilderPage />} />
        <Route path="/dashboards/:id" element={<DashboardBuilderPage />} />
        <Route path="/research-ai" element={<ResearchAIPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/widgets/new" element={<WidgetCreatorPage />} />
      </Route>
      <Route path="/dashboards/:id/view" element={<DashboardViewPage />} />
    </Routes>
  )
}
