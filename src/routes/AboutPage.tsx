import { NavLink } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { ShieldCheckIcon, SpeakerWaveIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { VOICEY_HELP_DISCORD_URL } from '../config/externalLinks'

const PRINCIPLES_ICONS = [ExclamationTriangleIcon, ShieldCheckIcon, SpeakerWaveIcon]

export function AboutPage() {
    const { t } = useTranslation()

    const principles = [
        { title: t('about.principle0Title'), text: t('about.principle0Text'), icon: PRINCIPLES_ICONS[0] },
        { title: t('about.principle1Title'), text: t('about.principle1Text'), icon: PRINCIPLES_ICONS[1] },
        { title: t('about.principle2Title'), text: t('about.principle2Text'), icon: PRINCIPLES_ICONS[2] },
    ]

    const roadmapSteps = [
        { title: t('about.roadmap0Title'), period: t('about.roadmap0Period'), text: t('about.roadmap0Text') },
        { title: t('about.roadmap1Title'), period: t('about.roadmap1Period'), text: t('about.roadmap1Text') },
        { title: t('about.roadmap2Title'), period: t('about.roadmap2Period'), text: t('about.roadmap2Text') },
    ]

    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-base-100">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-primary/18 blur-3xl" />
                <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-secondary/14 blur-3xl" />
                <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
            </div>

            <section>
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-12 pb-6 lg:pb-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:px-10">
                    <div className="space-y-7">
                        <div className="badge badge-primary badge-outline badge-lg">{t('about.badge')}</div>

                        <div className="max-w-3xl space-y-5">
                            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                                {t('about.title')}
                            </h1>
                            <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
                                {t('about.description')}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <NavLink to="/docs/recording" className="btn btn-primary">
                                {t('about.ctaRecord')}
                            </NavLink>
                            <NavLink to="/guidelines" className="btn btn-outline btn-secondary">
                                {t('about.ctaGuidelines')}
                            </NavLink>
                        </div>

                    </div>

                    <figure className="diff aspect-[4/3] min-h-[20rem] overflow-hidden lg:min-h-[24rem]" tabIndex={0}>
                        <div className="diff-item-1" role="img" tabIndex={0} aria-label={`${t('about.diffLeftLabel')} - ${t('about.diffLeftSublabel')}`}>
                            <div className="flex h-full flex-col justify-between bg-base-100 p-6 text-base-content sm:p-8">
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-base-content/45">
                                    <span>{t('about.diffLeftLabel')}</span>
                                    <span>{t('about.diffLeftSublabel')}</span>
                                </div>

                                <div className="flex flex-1 items-start pt-10">
                                    <div className="mx-auto flex h-full max-w-lg flex-col justify-between gap-4">
                                        <blockquote className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl lg:text-[2.5rem]">
                                            <Trans
                                                i18nKey="about.diffLeftQuote"
                                                components={{ error: <span className="text-error" /> }}
                                            />
                                        </blockquote>
                                        <p className="text-right text-xs font-black uppercase tracking-[0.2em] text-base-content/50">
                                            {t('about.diffLeftAuthor')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="diff-item-2 after:bg-secondary" role="img" aria-label={`${t('about.diffRightLabel')} - ${t('about.diffRightSublabel')}`}>
                            <div className="flex h-full flex-col justify-between bg-base-100 p-6 text-base-content sm:p-8">
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-base-content/45">
                                    <span>{t('about.diffRightLabel')}</span>
                                    <span>{t('about.diffRightSublabel')}</span>
                                </div>

                                <div className="flex flex-1 items-start pt-10">
                                    <div className="mx-auto flex h-full max-w-lg flex-col justify-between gap-4">
                                        <blockquote className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl lg:text-[2.5rem]">
                                            <Trans
                                                i18nKey="about.diffRightQuote"
                                                components={{ primary: <span className="text-primary" /> }}
                                            />
                                        </blockquote>
                                        <p className="text-right text-xs font-black uppercase tracking-[0.2em] text-base-content/50">
                                            {t('about.diffRightAuthor')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="diff-resizer"></div>
                    </figure>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 lg:px-10">
                <div className="mb-8 max-w-2xl">
                    <div className="badge badge-secondary badge-soft">{t('about.principlesBadge')}</div>
                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{t('about.principlesTitle')}</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {principles.map((item) => {
                        const Icon = item.icon

                        return (
                            <article key={item.title} className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                                <div className="card-body">
                                    <Icon className="h-8 w-8 text-secondary" />
                                    <h3 className="card-title text-lg">{item.title}</h3>
                                    <p className="text-base-content/72">{item.text}</p>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-10 max-w-3xl">
                    <div className="badge badge-secondary badge-soft">{t('about.roadmapBadge')}</div>
                    <h2 className="mt-4 text-3xl font-black sm:text-4xl">{t('about.roadmapTitle')}</h2>
                </div>

                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    {roadmapSteps.map((step, index) => (
                        <li key={step.title}>
                            {index > 0 ? <hr className="bg-base-300" /> : null}
                            <div className="timeline-middle">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-black text-primary">
                                    {index + 1}
                                </div>
                            </div>
                            <div className={`mb-10 rounded-[1.5rem] border border-base-300/70 bg-base-100 p-6 shadow-md ${index % 2 === 0 ? 'timeline-start md:text-end' : 'timeline-end'}`}>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-base-content/45">{step.period}</p>
                                <h3 className="mt-3 text-2xl font-black">{step.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-base-content/72 sm:text-base">{step.text}</p>
                                {index === roadmapSteps.length - 1 ? (
                                    <div className="mt-5">
                                        <a href={VOICEY_HELP_DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                                            {t('about.roadmapJoinDiscord')}
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                            {index < roadmapSteps.length - 1 ? <hr className="bg-base-300" /> : null}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}
