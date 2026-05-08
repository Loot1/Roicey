import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DocsCard } from '../../components'

export function DocsModerationPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.moderation.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.moderation.intro')}
            </p>

            <div className="grid gap-4 xl:grid-cols-2">
                <DocsCard title={t('docs.moderation.card0Title')}>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card0Text1')}
                    </p>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card0Text2')}
                    </p>
                </DocsCard>

                <DocsCard title={t('docs.moderation.card1Title')}>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card1Text1')}
                    </p>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card1Text2Pre')} <code className="badge badge-ghost px-1">/recordban</code> {t('docs.moderation.card1Text2Post')}
                    </p>
                    <div className="mt-4">
                        <Link to="/docs/recording" className="btn btn-secondary btn-sm">
                            {t('docs.moderation.card1Button')}
                        </Link>
                    </div>
                </DocsCard>

                <DocsCard title={t('docs.moderation.card2Title')}>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card2Text')}
                    </p>
                    <div className="mt-4">
                        <Link to="/demo" className="btn btn-secondary btn-sm">
                            {t('docs.moderation.card2Button')}
                        </Link>
                    </div>
                </DocsCard>

                <DocsCard title={t('docs.moderation.card3Title')}>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card3Text1')}
                    </p>
                    <p className="text-sm text-base-content/70">
                        {t('docs.moderation.card3Text2Pre')} <code className="badge badge-ghost px-1">/banhistory</code>{t('docs.moderation.card3Text2Post')}
                    </p>
                </DocsCard>
            </div>
        </div>
    )
}
