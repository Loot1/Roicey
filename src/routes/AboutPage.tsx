import {
    SparklesIcon,
    UserGroupIcon,
    CodeBracketIcon,
    HeartIcon,
} from '@heroicons/react/24/outline'

interface TeamMember {
    name: string
    role: string
    description: string
    icon: typeof UserGroupIcon
}

export function AboutPage() {
    const teamMembers: TeamMember[] = [
        {
            name: 'Développeur Principal',
            role: 'Architecture & Core',
            description: 'Conception et développement du cœur du bot, gestion des salons vocaux et logique automation.',
            icon: CodeBracketIcon,
        },
        {
            name: 'Modérateur Communauté',
            role: 'Support & Tests',
            description: 'Gestion du serveur Discord, tests des fonctionnalités et support utilisateur en français.',
            icon: UserGroupIcon,
        },
    ]

    return (
        <main className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-20">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 py-12 text-center lg:px-10">
                    <div className="mb-4 inline-block">
                        <div className="badge badge-primary badge-outline badge-lg">Notre Histoire</div>
                    </div>
                    <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                        Qui sommes-nous ?
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-base-content/70">
                        Voicey est né d'une simple observation : gérer les salons vocaux sur Discord était trop compliqué. 
                        Nous avons décidé de le rendre automatique, transparent et accessible.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <SparklesIcon className="h-6 w-6 flex-shrink-0 text-primary" />
                            <div>
                                <h3 className="font-semibold">Notre Mission</h3>
                                <p className="text-sm text-base-content/70">
                                    Rendre la gestion des salons vocaux Discord simple, rapide et accessible à tous les 
                                    serveurs, peu importe leur taille.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <HeartIcon className="h-6 w-6 flex-shrink-0 text-secondary" />
                            <div>
                                <h3 className="font-semibold">Notre Valeur</h3>
                                <p className="text-sm text-base-content/70">
                                    Chaque feature est pensée pour votre communauté. Sécurité, modération, flexibilité : 
                                    c'est notre fondation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-box border border-base-300 bg-base-200/50 p-6">
                        <h3 className="mb-4 font-semibold">Statistiques</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Serveurs actifs</span>
                                <span className="font-bold text-lg text-primary">890+</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Salons créés / jour</span>
                                <span className="font-bold text-lg text-secondary">2.4K</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Membres impactés</span>
                                <span className="font-bold text-lg text-accent">50K+</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Uptime</span>
                                <span className="font-bold text-lg text-success">99.9%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">L'équipe</h2>
                    <p className="mx-auto max-w-2xl text-base-content/70">
                        Une équipe passionnée par Discord et dédiée à améliorer continuellement Voicey.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {teamMembers.map((member, index) => {
                        const IconComponent = member.icon
                        return (
                            <article
                                key={index}
                                className="rounded-box border border-base-300 bg-base-200/30 p-6 transition hover:bg-base-200/60 hover:shadow-lg"
                            >
                                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                                    <IconComponent className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                                <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                                <p className="text-sm text-base-content/70">{member.description}</p>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* Values Section */}
            <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
                <h2 className="mb-12 text-center text-3xl font-extrabold sm:text-4xl">Nos valeurs</h2>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="card border border-base-300 bg-base-100 shadow">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Transparence</h3>
                            <p className="text-sm text-base-content/70">
                                Logs complets, permissions claires, et historique de modération pour une confiance totale.
                            </p>
                        </div>
                    </div>

                    <div className="card border border-base-300 bg-base-100 shadow">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Stabilité</h3>
                            <p className="text-sm text-base-content/70">
                                Infrastructure robuste et tests rigoureux pour zéro downtime et performances optimales.
                            </p>
                        </div>
                    </div>

                    <div className="card border border-base-300 bg-base-100 shadow">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Écoute</h3>
                            <p className="text-sm text-base-content/70">
                                Chaque suggestion compte. Vos retours façonnent les prochaines features de Voicey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-5xl px-6 pb-20 pt-12 lg:px-10">
                <div className="hero rounded-box border border-primary/30 bg-gradient-to-r from-primary/15 via-base-200 to-secondary/15 p-8">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl">
                            <h2 className="mb-4 text-3xl font-black sm:text-4xl">Rejoins notre communauté</h2>
                            <p className="mb-6 text-base-content/80">
                                Que tu sois développeur, modérateur ou simple utilisateur, ta voix compte !
                            </p>
                            <div className="join join-vertical gap-2 sm:join-horizontal">
                                <a href="#" className="btn join-item btn-primary">
                                    Rejoindre Discord
                                </a>
                                <a href="/docs" className="btn join-item btn-outline">
                                    Voir la documentation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
