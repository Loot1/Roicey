import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useConsent } from '../hooks/useConsent'
import { useLocalizedPath } from '../hooks/useLocale'

/**
 * Analytics consent banner.
 *
 * Refusing must be as easy as accepting (CNIL), so both buttons share the same
 * style and sit on the first layer. Ignoring the banner is not consent: GA stays
 * off until "Accept" is clicked. Never part of the prerendered HTML, since the
 * consent status is `pending` until the page hydrates.
 */
export function CookieBanner() {
    const { t } = useTranslation()
    const localizedPath = useLocalizedPath()
    const { isBannerOpen, grant, deny } = useConsent()

    if (!isBannerOpen) {
        return null
    }

    return (
        <section aria-label={t('cookieBanner.aria')} className="fixed inset-x-0 bottom-0 z-50 p-4">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-xl sm:flex-row sm:items-center sm:gap-6">
                <div className="flex-1">
                    <h2 className="text-base font-black">{t('cookieBanner.title')}</h2>
                    <p className="mt-2 text-sm leading-6 text-base-content/75">
                        {t('cookieBanner.text')}{' '}
                        <Link to={localizedPath('/privacy-policy')} className="link link-primary">
                            {t('cookieBanner.learnMore')}
                        </Link>
                    </p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                    <button type="button" onClick={deny} className="btn btn-primary btn-sm flex-1">
                        {t('cookieBanner.deny')}
                    </button>
                    <button type="button" onClick={grant} className="btn btn-primary btn-sm flex-1">
                        {t('cookieBanner.grant')}
                    </button>
                </div>
            </div>
        </section>
    )
}
