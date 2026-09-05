import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DocsCard } from '../../components/docs/DocsCard'
import { useLocalizedPath } from '../../hooks/useLocale'
import { seoMeta } from '../../config/seoMeta'

export function DocsRecordingPage() {
    const { t } = useTranslation()
    const localizedPath = useLocalizedPath()

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.recording.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.recording.intro')}
            </p>

            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                <DocsCard
                    title={t('docs.recording.card0Title')}
                    description={
                        <p>{t('docs.recording.triggerDescPre')} <code className="badge badge-ghost px-1">/record</code>.</p>
                    }
                />
                <DocsCard title={t('docs.recording.card1Title')} description={t('docs.recording.card1Desc')} />
                <DocsCard title={t('docs.recording.card2Title')} description={t('docs.recording.card2Desc')} />
                <DocsCard title={t('docs.recording.card3Title')} description={t('docs.recording.card3Desc')} />
            </div>

            <div className="mt-4 rounded-box border border-primary/20 bg-primary/8 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <p className="text-sm text-base-content/80">{t('docs.recording.footer')}</p>
                    <Link to={localizedPath('/guidelines')} className="btn btn-secondary btn-sm">
                        {t('docs.recording.footerButton')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DocsRecordingPage

export const meta = seoMeta('docsRecording')
