import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import SearchModal from '@/components/ui/SearchModal'
import { Toaster } from '@/components/ui/Toaster'
import VersionSwitcherFab from '@/components/app/VersionSwitcherFab'
import { useDemoMode } from '@/demo/useDemoMode'
import type { DemoModeHandle } from '@/demo/useDemoMode'
import DemoOverlay from '@/demo/DemoOverlay'
import { createContext, useContext } from 'react'

export const DemoContext = createContext<DemoModeHandle | null>(null)
export const useDemoContext = () => useContext(DemoContext)

function FabMount() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  if (pathname.startsWith('/research-ai') || pathname.startsWith('/analyses') || pathname.startsWith('/audiences') || pathname.startsWith('/dashboards') || pathname.startsWith('/charts') || pathname.startsWith('/playground')) return null
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
const LegacyAppRootV2    = lazy(() => import('@/legacy/v2/LegacyAppRoot'))
const ResearchAIRootV1   = lazy(() => import('@/legacy/v1/ResearchAIRoot'))
const ResearchAIRootV2   = lazy(() => import('@/legacy/v2/ResearchAIRoot'))
const DashboardRootV1    = lazy(() => import('@/legacy/v1/DashboardRoot'))
const DashboardRootV2    = lazy(() => import('@/legacy/v2/DashboardRoot'))

function AppInner() {
  const navigate = useNavigate()
  const demo = useDemoMode(navigate)
  return (
    <DemoContext.Provider value={demo}>
      <SearchModal />
      <Toaster />
      <FabMount />
      <DemoOverlay demo={demo} />
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
          <Route path="/consumer_insights_v1/research-ai" element={<ResearchAIRootV1 />} />
          <Route path="/consumer_insights_v1/dashboard" element={<DashboardRootV1 />} />
          <Route path="/consumer_insights_v1" element={<LegacyAppRootV1 />} />
          <Route path="/consumer_insights_v2/research-ai" element={<ResearchAIRootV2 />} />
          <Route path="/consumer_insights_v2/dashboard" element={<DashboardRootV2 />} />
          <Route path="/consumer_insights_v2" element={<LegacyAppRootV2 />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </DemoContext.Provider>
  )
}

export default function App() {
  return <AppInner />
}
