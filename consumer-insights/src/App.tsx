import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import SearchModal from '@/components/ui/SearchModal'
import { Toaster } from '@/components/ui/Toaster'
import VersionSwitcherFab from '@/components/app/VersionSwitcherFab'

function FabMount() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  return <VersionSwitcherFab />
}

const LandingPage        = lazy(() => import('@/pages/landing/LandingPage'))
const AudiencesPage      = lazy(() => import('@/pages/AudiencesPage'))
const AudienceBuilderPage = lazy(() => import('@/pages/AudienceBuilderPage'))
const DashboardsPage     = lazy(() => import('@/pages/DashboardsPage'))
const DashboardBuilderPage = lazy(() => import('@/pages/DashboardBuilderPage'))
const DashboardViewPage  = lazy(() => import('@/pages/DashboardViewPage'))
const ResearchAIPage     = lazy(() => import('@/pages/ResearchAIPage'))
const ChartsPage         = lazy(() => import('@/pages/ChartsPage'))
const AnalysesPage       = lazy(() => import('@/pages/AnalysesPage'))
const AnalysisDetailPage = lazy(() => import('@/pages/AnalysisDetailPage'))
const PlaygroundPage     = lazy(() => import('@/pages/PlaygroundPage'))
const NotFoundPage       = lazy(() => import('@/pages/NotFoundPage'))
const LegacyAppRootV0    = lazy(() => import('@/legacy/v0/LegacyAppRoot'))
const LegacyAppRootV1    = lazy(() => import('@/legacy/v1/LegacyAppRoot'))

export default function App() {
  return (
    <>
      <SearchModal />
      <Toaster />
      <FabMount />
      <Suspense fallback={null}>
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
          <Route path="/consumer_insights_v0" element={<LegacyAppRootV0 />} />
          <Route path="/consumer_insights_v1" element={<LegacyAppRootV1 />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
