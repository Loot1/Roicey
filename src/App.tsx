import { Routes, Route } from 'react-router'
import { Layout } from './components/layouts/Layout'
import { HomePage } from './routes/HomePage'
import { AboutPage } from './routes/AboutPage'
import { LegalPage } from './routes/LegalPage'
import { DocsLayout } from './components/layouts/DocsLayout'
import { GettingStartedPage } from './routes/docs/GettingStartedPage'
import { CommandsPage } from './routes/docs/CommandsPage'
import { ConfigurationPage } from './routes/docs/ConfigurationPage'
import { ModerationPage } from './routes/docs/ModerationPage'
import { FAQPage } from './routes/docs/FAQPage'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<GettingStartedPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="moderation" element={<ModerationPage />} />
          <Route path="faq" element={<FAQPage />} />
        </Route>
      </Routes>
    </Layout>
  )
}