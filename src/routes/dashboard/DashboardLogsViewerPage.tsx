import { DashboardPageHeader, DashboardStateCard } from '../../components'

export function DashboardLogsViewerPage() {
    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Logs"
                description="Consulte l'historique des événements et actions liées à ce serveur."
            />

            <div className="px-6 py-4 lg:px-8">
                <DashboardStateCard tone="dashed" className="text-base-content/70">
                    L'interface des logs sera disponible ici.
                </DashboardStateCard>
            </div>
        </section>
    )
}
