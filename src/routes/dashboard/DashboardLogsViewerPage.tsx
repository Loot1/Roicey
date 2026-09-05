import { useTranslation } from 'react-i18next'
import { DashboardPageHeader, DashboardStateCard } from '../../components/dashboard'

export function DashboardLogsViewerPage() {
    const { t } = useTranslation()

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title={t('dashboard.logs.title')}
                description={t('dashboard.logs.description')}
            />

            <div className="px-6 py-4 lg:px-8">
                <DashboardStateCard tone="dashed" className="text-base-content/70">
                    {t('dashboard.logs.placeholder')}
                </DashboardStateCard>
            </div>
        </section>
    )
}

export default DashboardLogsViewerPage
