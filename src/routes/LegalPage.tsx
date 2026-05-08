import { useTranslation } from 'react-i18next'

export function LegalPage() {
    const { t } = useTranslation()

    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">{t('legal.badge')}</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{t('legal.title')}</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        {t('legal.subtitle')}
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.editorTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.editorText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.editorText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.hostingTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.hostingText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.hostingText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black">{t('legal.ipTitle')}</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.ipText1')}</p>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.ipText2')}</p>
                </article>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.functionTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.functionText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.functionText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.responsabilityTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.responsabilityText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.responsabilityText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.externalLinksTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.externalLinksText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.externalLinksText2')}</p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">{t('legal.contactTitle')}</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.contactText1')}</p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.contactText2')}</p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-14 lg:px-10 mt-6">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">{t('legal.updateTitle')}</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">{t('legal.updateText')}</p>
                </div>
            </section>
        </main>
    )
}
