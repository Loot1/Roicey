import { Cog6ToothIcon, GlobeAltIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useOutletContext } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DashboardPageHeader } from '../../components/dashboard'
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
            return { hasPerm: true, reason: 'ok' }
        }

        return { hasPerm: false, reason: 'missing' }
    } catch {
        return { hasPerm: false, reason: 'error' }
    }
}

export function DashboardOverviewPage() {
    const { selectedGuild } = useOutletContext<DashboardLayoutContextValue>()
    const { t } = useTranslation()
    const guild = selectedGuild!

    const { hasPerm } = checkPermissions(guild.permissions)
    const stats = [
        {
            id: 'status',
            icon: <ShieldCheckIcon className="h-5 w-5" />,
            label: t('dashboard.overview.statStatusLabel'),
            value: guild.owner ? t('dashboard.overview.statStatusOwner') : t('dashboard.overview.statStatusManager'),
            description: t('dashboard.overview.statStatusDesc'),
        },
        {
            id: 'bot',
            icon: <SparklesIcon className="h-5 w-5" />,
            label: t('dashboard.overview.statBotLabel'),
            value: guild.botInGuild ? t('dashboard.overview.statBotPresent') : t('dashboard.overview.statBotAbsent'),
            description: guild.botInGuild ? t('dashboard.overview.statBotPresentDesc') : t('dashboard.overview.statBotAbsentDesc'),
        },
        {
            id: 'permissions',
            icon: <GlobeAltIcon className="h-5 w-5" />,
            label: t('dashboard.overview.statPermLabel'),
            value: hasPerm ? t('dashboard.overview.statPermOk') : t('dashboard.overview.statPermFail'),
            description: hasPerm ? t('dashboard.overview.statPermOkDesc') : t('dashboard.overview.statPermFailDesc'),
        },
        {
            id: 'access',
            icon: <Cog6ToothIcon className="h-5 w-5" />,
            label: t('dashboard.overview.statAccessLabel'),
            value: t('dashboard.overview.statAccessValue'),
            description: t('dashboard.overview.statAccessDesc'),
        },
    ]

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title={t('dashboard.overview.title')}
                description={guild.owner ? t('dashboard.overview.descOwner') : t('dashboard.overview.descManager')}
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
