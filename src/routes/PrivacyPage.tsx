import { useTranslation } from 'react-i18next'

export function PrivacyPage() {
    const { t } = useTranslation()

    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">{t('privacy.badge')}</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{t('privacy.title')}</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        {t('privacy.subtitle')}
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10">
                <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black">{t('privacy.principlesTitle')}</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.principlesText1')}</p>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.principlesText2')}</p>
                </article>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.dataTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.dataText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.dataText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.authTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.authText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.authText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.purposeTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.purposeText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.purposeText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.recordingsTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.recordingsText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.recordingsText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.accessTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.accessText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.accessText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.cookiesTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.cookiesText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.cookiesText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.thirdPartyTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.thirdPartyText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.thirdPartyText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('privacy.rightsTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.rightsText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.rightsText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-14 pt-6 lg:px-10">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">{t('privacy.updateTitle')}</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('privacy.updateText')}</p>
                </div>
            </section>
        </main>
    )
}
