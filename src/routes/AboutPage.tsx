import { NavLink } from 'react-router'
import { ShieldCheckIcon, SpeakerWaveIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { VOICEY_HELP_DISCORD_URL } from '../constants/externalLinks'

const principles = [
    {
        title: "Un bot Discord né d'un cas concret",
        text: "Voicey a été créé par un développeur qui a lui-même modéré des serveurs Discord et fait face à la difficulté de gérer les incidents vocaux sans preuve exploitable.",
        icon: ExclamationTriangleIcon,
    },
    {
        title: "S'intégrer dans l'écosystème du serveur",
        text: "Les éléments principaux restent dans l'écosystème du serveur : dashboard, règles, historique et accès réservés aux personnes autorisées.",
        icon: ShieldCheckIcon,
    },
    {
        title: "Le record directement dans Discord",
        text: "Tout le monde n'a pas la possibilité technique de capturer un salon vocal depuis son PC. Voicey apporte cette capacité au niveau du serveur, sans imposer un setup local aux modérateurs.",
        icon: SpeakerWaveIcon,
    },
]

const roadmapSteps = [
    {
        title: 'Étape actuelle',
        period: "Aujourd'hui",
        text: "Voicey est déjà dans sa première étape: enregistrements exploitables, consultation via dashboard, archivage, garde-fous et outils concrets pour traiter un incident vocal.",
    },
    {
        title: "Bêta test et stabilité",
        period: "Étape 2",
        text: "La prochaine phase consiste à ouvrir davantage les tests pour consolider la stabilité du bot avant une diffusion plus large.",
    },
    {
        title: "Développement continu",
        period: "Étape 3",
        text: "Pour la suite s'imagine déjà des logs complètes des salons vocaux temporaires, une retranscription écrite des enregistrements et une internationalisation du bot. Voicey reste en développement continu et s'ouvre aux retours des personnes qui veulent aider.",
    },
]

export function AboutPage() {
    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-base-100">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-primary/18 blur-3xl" />
                <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-secondary/14 blur-3xl" />
                <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
            </div>

            <section>
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-12 lg:pb-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:px-10">
                    <div className="space-y-7">
                        <div className="badge badge-primary badge-outline badge-lg">Origine du projet</div>

                        <div className="max-w-3xl space-y-5">
                            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                                Modérer les salons vocaux est un vrai défi.
                            </h1>
                            <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
                                Combien de fois les modérateurs ont-ils dû faire confiance à des récits contradictoires ou à des enregistrements bricolés pour prendre une décision ? Combien de fois ont-ils dû se contenter d'un report vocal sans preuve exploitable ? Voicey est né de ce constat : la modération vocale mérite mieux que des solutions de fortune.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <NavLink to="/docs/recording" className="btn btn-primary">
                                Voir le record
                            </NavLink>
                            <NavLink to="/guidelines" className="btn btn-outline btn-secondary">
                                Lire la charte
                            </NavLink>
                        </div>

                    </div>

                    <figure className="diff aspect-[4/3] min-h-[26rem] overflow-hidden lg:min-h-[30rem]" tabIndex={0}>
                        <div className="diff-item-1" role="img" tabIndex={0} aria-label="Modérateur fatigué sans preuve exploitable">
                            <div className="flex h-full flex-col justify-between bg-base-100 p-6 text-base-content sm:p-8">
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-base-content/45">
                                    <span>Sans Voicey</span>
                                    <span>Report vocal</span>
                                </div>

                                <div className="flex-1 content-center py-8">
                                    <div className="mx-auto max-w-lg space-y-4">
                                        <blockquote className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl lg:text-[2.5rem]">
                                            “Encore un <span className="text-error">signalement en vocal</span> pour lequel il n'y a aucune preuve.”
                                        </blockquote>
                                        <p className="text-right text-xs font-black uppercase tracking-[0.2em] text-base-content/50">
                                            Modérateur fatigué
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="diff-item-2 after:bg-secondary" role="img" aria-label="Modérateur heureux avec preuve fournie par Voicey">
                            <div className="flex h-full flex-col justify-between bg-base-100 p-6 text-base-content sm:p-8">
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-base-content/45">
                                    <span>Avec Voicey</span>
                                    <span>Preuve exploitable</span>
                                </div>

                                <div className="flex-1 content-center py-8">
                                    <div className="mx-auto max-w-lg space-y-4">
                                        <blockquote className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl lg:text-[2.5rem]">
                                            “C'est bon, on a la <span className="text-primary">preuve</span> pour bannir ce fauteur de troubles grâce à Voicey!”
                                        </blockquote>
                                        <p className="text-right text-xs font-black uppercase tracking-[0.2em] text-base-content/50">
                                            Modérateur soulagé
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="diff-resizer"></div>
                    </figure>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 lg:pt-6 pb-8 lg:px-10">
                <div className="mb-8 max-w-2xl">
                    <div className="badge badge-secondary badge-soft">Fondements</div>
                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Les idées clefs</h2>
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
                    <div className="badge badge-secondary badge-soft">Roadmap</div>
                    <h2 className="mt-4 text-3xl font-black sm:text-4xl">La construction de Voicey, et la suite</h2>
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
                                            Rejoindre le Discord pour aider
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
