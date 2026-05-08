import { useTranslation } from 'react-i18next'
import type { FeaturedServer } from '../types'

const SKELETON_ITEMS = Array.from({ length: 7 }, (_, index) => index)

function ServerCardSkeleton() {
    return (
        <div className="flex-shrink-0 w-72">
            <div className="card h-full border border-base-300 bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                    <div className="skeleton h-20 w-20 rounded-lg"></div>
                    <div className="skeleton h-6 w-36"></div>
                    <div className="skeleton h-4 w-24"></div>
                    <div className="card-actions">
                        <div className="skeleton h-6 w-20 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeaturedServerCard({ server }: { server: FeaturedServer }) {
    const { t, i18n } = useTranslation()
    const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'
    const initials = server.name
        .split(' ')
        .map((chunk) => chunk[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <div className="flex-shrink-0 w-72">
            <div className="card h-full border border-base-300 bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                    <div
                        className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg text-3xl font-black text-primary ${
                            server.iconUrl ? '' : 'bg-primary/20'
                        }`}
                    >
                        {server.iconUrl ? (
                            <img src={server.iconUrl} alt={server.name} className="h-20 w-20 object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <h3 className="card-title text-lg">{server.name}</h3>
                    <p className="text-base-content/70">{t('featuredServers.memberCount', { count: server.memberCount.toLocaleString(locale) })}</p>
                </div>
            </div>
        </div>
    )
}

interface FeaturedServersProps {
    servers: FeaturedServer[]
    nonFeaturedActiveServers?: number
    loading?: boolean
    error?: string | null
}

export function FeaturedServers({ servers, nonFeaturedActiveServers = 0, loading = false, error = null }: FeaturedServersProps) {
    const { t, i18n } = useTranslation()
    const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'
    const shouldShowSkeleton = loading || error !== null

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <h2 className="text-3xl font-extrabold sm:text-4xl">{t('featuredServers.title')}</h2>
                <p className="mt-2 max-w-2xl text-base-content/70">
                    {t('featuredServers.subtitle')}
                </p>
            </div>

            <div className="mt-8 w-screen overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4 pl-6 pr-6 lg:pl-10 lg:pr-10">
                    {shouldShowSkeleton
                        ? SKELETON_ITEMS.map((item) => <ServerCardSkeleton key={item} />)
                        : servers.map((server) => <FeaturedServerCard key={server.id} server={server} />)}

                    {!shouldShowSkeleton ? (
                        <div className="flex-shrink-0 w-72">
                            <div className="card h-full border border-base-300 bg-base-100 shadow-md">
                                <div className="card-body items-center justify-center text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-base-300 text-4xl font-black text-base-content">
                                        +
                                    </div>
                                    <h3 className="card-title text-lg">{t('featuredServers.andMoreTitle')}</h3>
                                    <p className="text-base-content/70">{t('featuredServers.andMoreSubtitle', { count: nonFeaturedActiveServers.toLocaleString(locale) })}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {error ? (
                <div className="mx-auto mt-2 max-w-7xl px-6 lg:px-10">
                    <div className="alert alert-warning">
                        <span>{error}</span>
                    </div>
                </div>
            ) : null}
        </section>
    )
}