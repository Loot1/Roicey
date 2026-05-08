import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { HomePage, AboutPage, GuidelinesPage, PrivacyPage, LegalPage, NotFoundPage, DocsGettingStartedPage, DocsCommandsPage, DocsSettingsPage, DocsModerationPage, DocsFAQPage, DocsRecordingPage } from './routes'
import { Layout, DocsLayout, DemoLayout } from './components'

const DashboardLayout = lazy(() => import('./components/layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })))
const DashboardProvider = lazy(() => import('./contexts/DashboardContext').then(m => ({ default: m.DashboardProvider })))
const DashboardOverviewPage = lazy(() => import('./routes/dashboard/DashboardOverviewPage').then(m => ({ default: m.DashboardOverviewPage })))
const DashboardSettingsPage = lazy(() => import('./routes/dashboard/DashboardSettingsPage').then(m => ({ default: m.DashboardSettingsPage })))
const DashboardLogsViewerPage = lazy(() => import('./routes/dashboard/DashboardLogsViewerPage').then(m => ({ default: m.DashboardLogsViewerPage })))
const DashboardRecordRestrictionsPage = lazy(() => import('./routes/dashboard/DashboardRecordRestrictionsPage').then(m => ({ default: m.DashboardRecordRestrictionsPage })))
const DashboardRecordingsPage = lazy(() => import('./routes/dashboard/DashboardRecordingsPage').then(m => ({ default: m.DashboardRecordingsPage })))
const DashboardRecordingDetailPage = lazy(() => import('./routes/dashboard/DashboardRecordingDetailPage').then(m => ({ default: m.DashboardRecordingDetailPage })))

const DemoRecordingsPage = lazy(() => import('./routes/demo/DemoRecordingsPage').then(m => ({ default: m.DemoRecordingsPage })))

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={null}>
              <DashboardProvider>
                <DashboardLayout />
              </DashboardProvider>
            </Suspense>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
          <Route path="logs" element={<DashboardLogsViewerPage />} />
          <Route path="record-restrictions" element={<DashboardRecordRestrictionsPage />} />
          <Route path="recordings" element={<DashboardRecordingsPage />} />
          <Route path="recordings/detail" element={<DashboardRecordingDetailPage />} />
        </Route>
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<Suspense fallback={null}><DemoRecordingsPage /></Suspense>} />
        </Route>
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsGettingStartedPage />} />
          <Route path="commands" element={<DocsCommandsPage />} />
          <Route path="recording" element={<DocsRecordingPage />} />
          <Route path="settings" element={<DocsSettingsPage />} />
          <Route path="moderation" element={<DocsModerationPage />} />
          <Route path="faq" element={<DocsFAQPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}