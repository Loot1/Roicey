import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DocsStep } from '../../components'
import { VOICEY_INVITE_URL } from '../../config'

export function DocsGettingStartedPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.gettingStarted.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.gettingStarted.intro')}
            </p>

            <div className="space-y-4">
                <DocsStep
                    step={1}
                    title={t('docs.gettingStarted.step1Title')}
                    description={t('docs.gettingStarted.step1Desc')}
                    action={<a href={VOICEY_INVITE_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm w-fit">{t('docs.gettingStarted.inviteButton')}</a>}
                />

                <DocsStep
                    step={2}
                    title={t('docs.gettingStarted.step2Title')}
                    description={t('docs.gettingStarted.step2Desc')}
                >
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>{t('docs.gettingStarted.step2List0')}</li>
                        <li>{t('docs.gettingStarted.step2List1')}</li>
                        <li>{t('docs.gettingStarted.step2List2')}</li>
                        <li>{t('docs.gettingStarted.step2List3')}</li>
                    </ul>
                </DocsStep>

                <DocsStep step={3} title={t('docs.gettingStarted.step3Title')}>
                    <p className="text-sm text-base-content/70">
                        {t('docs.gettingStarted.step3DescPre')} <code className="badge badge-ghost">/config</code>{t('docs.gettingStarted.step3DescPost')}
                    </p>
                </DocsStep>

            </div>

            <div className="mt-6 rounded-box border border-info/25 bg-info/12 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <p className="text-sm text-base-content/80">{t('docs.gettingStarted.footer')}</p>
                    <Link to="/docs/settings" className="btn btn-info btn-sm">
                        {t('docs.gettingStarted.footerButton')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
