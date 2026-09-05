import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DocsCollapse } from '../../components/docs/DocsCollapse'
import { useLocalizedPath } from '../../hooks/useLocale'
import { seoMeta } from '../../config/seoMeta'

export function DocsFAQPage() {
    const { t } = useTranslation()
    const localizedPath = useLocalizedPath()

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.faq.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.faq.intro')}
            </p>

            <div className="space-y-3">
                <DocsCollapse name="faq" title={t('docs.faq.q0Title')} defaultChecked>
                    <p>{t('docs.faq.q0Text')}</p>
                </DocsCollapse>

                <DocsCollapse name="faq" title={t('docs.faq.q1Title')}>
                    <p>{t('docs.faq.q1Text')}</p>
                </DocsCollapse>

                <DocsCollapse name="faq" title={t('docs.faq.q2Title')}>
                    <p>{t('docs.faq.q2Text')}</p>
                </DocsCollapse>

                <DocsCollapse name="faq" title={t('docs.faq.q3Title')}>
                    <p>
                        {t('docs.faq.q3TextPre')} <code className="badge badge-ghost px-1">{t('docs.faq.q3Command')}</code> {t('docs.faq.q3TextPost')}
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title={t('docs.faq.q4Title')}>
                    <p>{t('docs.faq.q4Text')}</p>
                    <div className="mt-4">
                        <Link to={localizedPath('/guidelines')} className="btn btn-error btn-sm">
                            {t('docs.faq.q4Button')}
                        </Link>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="faq" title={t('docs.faq.q5Title')}>
                    <p>
                        {t('docs.faq.q5TextPre')} <code className="badge badge-ghost px-1">{t('docs.faq.q5Command')}</code> {t('docs.faq.q5TextPost')}
                    </p>
                </DocsCollapse>
            </div>
        </div>
    )
}

export default DocsFAQPage

export const meta = seoMeta('docsFaq')
