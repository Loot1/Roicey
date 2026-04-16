import { Cog6ToothIcon, GlobeAltIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useOutletContext } from 'react-router'
import { DashboardPageHeader } from '../../components'
import type { DashboardLayoutContextValue } from '../../types'

function checkPermissions(permissions: string): { hasPerm: boolean; reason: string } {
    try {
        const permBigInt = BigInt(permissions)

        const administrator = BigInt(1 << 3)
        const manageChannels = BigInt(1 << 4)
        const moveMembers = BigInt(1 << 17)
        const manageRoles = BigInt(1 << 28)

        const requiredPermissions = manageChannels | moveMembers | manageRoles
        const hasAdmin = (permBigInt & administrator) === administrator
        const hasRequired = (permBigInt & requiredPermissions) === requiredPermissions

        if (hasAdmin || hasRequired) {
            return { hasPerm: true, reason: 'Le bot dispose de toutes les permissions nécessaires.' }
        }

        return { hasPerm: false, reason: 'Le bot manque de permissions pour fonctionner correctement.' }
    } catch {
        return { hasPerm: false, reason: 'Impossible de vérifier les permissions.' }
    }
}

export function DashboardOverviewPage() {
    const { selectedGuild } = useOutletContext<DashboardLayoutContextValue>()

    if (!selectedGuild) {
        return (
            <section className="bg-base-100 px-6 py-8 lg:px-8">
                <div className="rounded-[1.5rem] border border-base-300 bg-base-200/40 p-8 text-base-content/70 shadow-sm">
                    Sélectionne une guilde pour afficher sa vue d'ensemble.
                </div>
            </section>
        )
    }

    const { hasPerm, reason } = checkPermissions(selectedGuild.permissions)
    const stats = [
        {
            id: 'status',
            icon: <ShieldCheckIcon className="h-5 w-5" />,
            label: 'Statut',
            value: selectedGuild.owner ? 'Propriétaire' : 'Gestionnaire',
            description: 'Accès complet aux actions du dashboard.',
        },
        {
            id: 'bot',
            icon: <SparklesIcon className="h-5 w-5" />,
            label: 'Bot',
            value: selectedGuild.botInGuild ? 'Présent' : 'Absent',
            description: selectedGuild.botInGuild ? 'Le bot est déjà connecté à cette guilde.' : 'Le bot doit rejoindre cette guilde avant la configuration.',
        },
        {
            id: 'permissions',
            icon: <GlobeAltIcon className="h-5 w-5" />,
            label: 'Permissions',
            value: hasPerm ? '✓ Complètes' : '✗ Insuffisantes',
            description: reason,
        },
        {
            id: 'access',
            icon: <Cog6ToothIcon className="h-5 w-5" />,
            label: 'Accès',
            value: 'Dashboard prêt',
            description: 'Passe à la configuration pour modifier les paramètres du serveur.',
        },
    ]

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Vue d'ensemble"
                description={selectedGuild.owner ? 'Tu es propriétaire de cette guilde.' : "Tu disposes d'un accès de gestion sur cette guilde."}
            />

            <div className="px-6 py-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.id} className="rounded-[1.4rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-3 text-primary">
                                {stat.icon}
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">{stat.label}</p>
                            </div>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <div className="mt-1 text-sm text-base-content/70">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
