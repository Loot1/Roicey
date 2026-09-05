import { Trans, useTranslation } from 'react-i18next'
import { seoMeta } from '../config/seoMeta'

export function GuidelinesPage() {
    const { t } = useTranslation()

    return (
        <div className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">{t('guidelines.badge')}</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{t('guidelines.title')}</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        {t('guidelines.subtitle')}
                    </p>
                    <p className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl mt-4">
                        <Trans
                            i18nKey="guidelines.quote"
                            components={{ primary: <span className="text-primary" /> }}
                        />
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10 mb-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('guidelines.transparencyTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            {t('guidelines.transparencyText')}
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('guidelines.moderationTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            {t('guidelines.moderationText')}
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('guidelines.accessTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            {t('guidelines.accessText')}
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('guidelines.harassmentTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            {t('guidelines.harassmentText')}
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 mb-12 lg:px-10">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">{t('guidelines.noncomplianceTitle')}</h2>
                    <p className="mt-4 text-sm text-base-content/75">
                        {t('guidelines.noncomplianceText')}
                    </p>
                </div>
            </section>
        </div>
    )
}

export default GuidelinesPage

export const meta = seoMeta('guidelines')
