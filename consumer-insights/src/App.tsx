import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import SearchModal from '@/components/ui/SearchModal'
import { Toaster } from '@/components/ui/Toaster'
import LandingPage from '@/pages/LandingPage'
import AudiencesPage from '@/pages/AudiencesPage'
import AudienceBuilderPage from '@/pages/AudienceBuilderPage'
import DashboardsPage from '@/pages/DashboardsPage'
import DashboardBuilderPage from '@/pages/DashboardBuilderPage'
import DashboardViewPage from '@/pages/DashboardViewPage'
import ResearchAIPage from '@/pages/ResearchAIPage'
import ChartsPage from '@/pages/ChartsPage'
import AnalysesPage from '@/pages/AnalysesPage'
import AnalysisDetailPage from '@/pages/AnalysisDetailPage'
import PlaygroundPage from '@/pages/PlaygroundPage'

export default function App() {
  return (
    <>
      <SearchModal />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/analyses" element={<AnalysesPage />} />
          <Route path="/analyses/:id" element={<AnalysisDetailPage />} />
          <Route path="/audiences" element={<AudiencesPage />} />
          <Route path="/audiences/new" element={<AudienceBuilderPage />} />
          <Route path="/audiences/:id/edit" element={<AudienceBuilderPage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/dashboards/new" element={<DashboardBuilderPage />} />
          <Route path="/dashboards/:id" element={<DashboardBuilderPage />} />
          <Route path="/research-ai" element={<ResearchAIPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Route>
        <Route path="/dashboards/:id/view" element={<DashboardViewPage />} />
      </Routes>
    </>
  )
}
