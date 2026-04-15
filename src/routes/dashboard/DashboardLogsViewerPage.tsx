import { useOutletContext } from 'react-router'
import { DashboardPageHeader } from '../../components'
import type { DashboardLayoutContextValue } from '../../types'

export function DashboardLogsViewerPage() {
    const { selectedGuild } = useOutletContext<DashboardLayoutContextValue>()

    if (!selectedGuild) {
        return (
            <section className="bg-base-100 px-6 py-8 lg:px-8">
                <div className="rounded-[1.5rem] border border-base-300 bg-base-200/40 p-8 text-base-content/70 shadow-sm">
                    Sélectionne un serveur dans la sidebar pour consulter ses logs.
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Logs"
                description="Consulte l’historique des événements et actions liées à ce serveur."
            />

            <div className="px-6 py-4 lg:px-8">
                <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-8 text-base-content/70 shadow-sm">
                    L’interface des logs sera disponible ici.
                </div>
            </div>
        </section>
    )
}
