import { Routes, Route } from 'react-router'
import { HomePage, AboutPage, GuidelinesPage, PrivacyPage, LegalPage, NotFoundPage, DashboardOverviewPage, DashboardSettingsPage, DashboardLogsViewerPage, DashboardRecordingsPage, DashboardRecordingDetailPage, DashboardRecordRestrictionsPage, DocsGettingStartedPage, DocsCommandsPage, DocsSettingsPage, DocsModerationPage, DocsFAQPage, DemoRecordingsPage } from './routes'
import { Layout, DocsLayout, DashboardLayout, DemoLayout } from './components'
import { DashboardProvider } from './contexts/DashboardContext'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<DashboardProvider><DashboardLayout /></DashboardProvider>}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
          <Route path="logs" element={<DashboardLogsViewerPage />} />
          <Route path="record-restrictions" element={<DashboardRecordRestrictionsPage />} />
          <Route path="recordings" element={<DashboardRecordingsPage />} />
          <Route path="recordings/:recordingId" element={<DashboardRecordingDetailPage />} />
        </Route>
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<DemoRecordingsPage />} />
        </Route>
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsGettingStartedPage />} />
          <Route path="commands" element={<DocsCommandsPage />} />
          <Route path="settings" element={<DocsSettingsPage />} />
          <Route path="moderation" element={<DocsModerationPage />} />
          <Route path="faq" element={<DocsFAQPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}