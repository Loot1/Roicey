import { Link, useOutletContext } from 'react-router'
import { Cog6ToothIcon, GlobeAltIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import type { DashboardLayoutContextValue } from '../../types'

function checkPermissions(permissions: string): { hasPerm: boolean; reason: string } {
    try {
        const permBigInt = BigInt(permissions)
        
        // Permissions requises pour Voicey: MANAGE_CHANNELS, MOVE_MEMBERS, MANAGE_ROLES
        // MANAGE_CHANNELS (16) | MOVE_MEMBERS (131072) | MANAGE_ROLES (268435456)
        // Ou juste ADMINISTRATOR (8) qui couvre tout
        const ADMINISTRATOR = BigInt(1 << 3)
        const MANAGE_CHANNELS = BigInt(1 << 4)
        const MOVE_MEMBERS = BigInt(1 << 17)
        const MANAGE_ROLES = BigInt(1 << 28)
        
        const requiredPermissions = MANAGE_CHANNELS | MOVE_MEMBERS | MANAGE_ROLES
        const hasAdmin = (permBigInt & ADMINISTRATOR) === ADMINISTRATOR
        const hasRequired = (permBigInt & requiredPermissions) === requiredPermissions
        
        if (hasAdmin || hasRequired) {
            return { hasPerm: true, reason: 'Le bot dispose de toutes les permissions nécessaires.' }
        } else {
            return { hasPerm: false, reason: 'Le bot manque de permissions pour fonctionner correctement.' }
        }
    } catch {
        return { hasPerm: false, reason: 'Impossible de vérifier les permissions.' }
    }
}

export function DashboardOverviewPage() {
    const { selectedGuild } = useOutletContext<DashboardLayoutContextValue>()

    if (!selectedGuild) {
        return (
            <div className="rounded-box border border-base-300 bg-base-200/40 p-8 text-base-content/70">
                Sélectionne une guilde pour afficher sa vue d’ensemble.
            </div>
        )
    }

    return (
        <section className="space-y-6">
            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl bg-primary/15 text-2xl font-black text-primary">
                            {selectedGuild.iconUrl ? (
                                <img
                                    src={selectedGuild.iconUrl}
                                    alt={selectedGuild.name}
                                    className="h-16 w-16 object-cover"
                                />
                            ) : (
                                selectedGuild.name.slice(0, 2).toUpperCase()
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">Vue d’ensemble</p>
                            <h1 className="text-3xl font-black leading-tight">{selectedGuild.name}</h1>
                            <p className="text-base-content/70">
                                {selectedGuild.owner ? 'Tu es propriétaire de cette guilde.' : 'Tu disposes d’un accès de gestion sur cette guilde.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link to="/dashboard/settings" className="btn btn-primary">
                            <Cog6ToothIcon className="h-5 w-5" />
                            Configuration
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-md">
                    <div className="mb-3 flex items-center gap-3 text-primary">
                        <ShieldCheckIcon className="h-5 w-5" />
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">Statut</p>
                    </div>
                    <p className="text-2xl font-black">{selectedGuild.owner ? 'Propriétaire' : 'Gestionnaire'}</p>
                    <p className="mt-1 text-sm text-base-content/70">Accès complet aux actions du dashboard.</p>
                </div>

                <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-md">
                    <div className="mb-3 flex items-center gap-3 text-primary">
                        <SparklesIcon className="h-5 w-5" />
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">Bot</p>
                    </div>
                    <p className="text-2xl font-black">{selectedGuild.botInGuild ? 'Présent' : 'Absent'}</p>
                    <p className="mt-1 text-sm text-base-content/70">
                        {selectedGuild.botInGuild ? 'Le bot est déjà connecté à cette guilde.' : 'Le bot doit rejoindre cette guilde avant la configuration.'}
                    </p>
                </div>

                <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-md">
                    <div className="mb-3 flex items-center gap-3 text-primary">
                        <GlobeAltIcon className="h-5 w-5" />
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">Permissions</p>
                    </div>
                    {(() => {
                        const { hasPerm, reason } = checkPermissions(selectedGuild.permissions)
                        return (
                            <>
                                <p className="text-2xl font-black">{hasPerm ? '✓ Complètes' : '✗ Insuffisantes'}</p>
                                <p className="mt-1 text-sm text-base-content/70">{reason}</p>
                            </>
                        )
                    })()}
                </div>

                <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-md">
                    <div className="mb-3 flex items-center gap-3 text-primary">
                        <Cog6ToothIcon className="h-5 w-5" />
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">Accès</p>
                    </div>
                    <p className="text-2xl font-black">Dashboard prêt</p>
                    <p className="mt-1 text-sm text-base-content/70">Passe à la configuration pour modifier les paramètres du serveur.</p>
                </div>
            </div>
        </section>
    )
}
