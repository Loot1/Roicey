export function GuidelinesPage() {
    const pillars = [
        {
            title: 'Respect des serveurs',
            description: 'Roicey doit être utilisé pour faciliter la modération et la gestion vocale, jamais pour contourner les règles d\'un serveur Discord.',
        },
        {
            title: 'Usage responsable',
            description: 'Toute automatisation, configuration ou consultation des données doit rester proportionnée au besoin réel du serveur et de sa communauté.',
        },
        {
            title: 'Protection des membres',
            description: 'Les salons, logs et enregistrements éventuels doivent être utilisés avec transparence et uniquement dans un cadre légitime et annoncé.',
        },
        {
            title: 'Zero abus technique',
            description: 'Aucune tentative de surcharge, de détournement de fonctionnalité, de scraping agressif ou d\'exploitation de faille n\'est autorisée.',
        },
    ]

    const commitments = [
        'Respecter les Conditions d\'utilisation de Discord et la législation applicable.',
        'Configurer uniquement les permissions nécessaires au bon fonctionnement du bot et du dashboard.',
        'Informer clairement les membres lorsqu\'une fonctionnalité de log ou d\'enregistrement est activée.',
        'Ne pas utiliser Roicey pour harceler, surveiller abusivement ou discriminer des utilisateurs.',
        'Conserver une hygiène de sécurité minimale sur les comptes Discord ayant accès au dashboard.',
        'Signaler toute anomalie ou faille de sécurité plutôt que tenter de l\'exploiter.',
    ]

    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">Charte d'utilisation</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Charte d'utilisation de Roicey</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        Roicey est la vitrine et l'interface web de Voicey. Cette charte fixe le cadre d'un usage
                        propre, transparent et conforme aux attentes des communautés qui s'appuient sur le service.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-6 px-6 py-12 md:grid-cols-2 lg:px-10">
                {pillars.map((pillar) => (
                    <article key={pillar.title} className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-xl font-bold">{pillar.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-base-content/72">{pillar.description}</p>
                    </article>
                ))}
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-12 lg:px-10">
                <div className="rounded-box border border-base-300 bg-base-200/40 p-6 sm:p-8">
                    <h2 className="text-2xl font-black">Engagements attendus</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {commitments.map((commitment) => (
                            <div key={commitment} className="rounded-xl border border-base-300/80 bg-base-100 px-4 py-4 text-sm text-base-content/75">
                                {commitment}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-16 lg:px-10">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Modération et traces</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Les outils de modération, de journalisation et d'enregistrement doivent servir un objectif
                            clair : sécuriser l'espace communautaire, documenter un incident ou faciliter la gestion
                            d'un serveur. Ils ne doivent jamais devenir un moyen de surveillance opaque ou invasive.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Toute équipe utilisant Roicey s'engage à définir des règles internes simples, à limiter les
                            accès sensibles et à supprimer les données qui ne sont plus utiles à l'exploitation du service.
                        </p>
                    </article>

                    <aside className="rounded-box border border-primary/20 bg-primary/8 p-6">
                        <h2 className="text-lg font-bold">En pratique</h2>
                        <ul className="mt-4 space-y-3 text-sm text-base-content/75">
                            <li>Informer les membres des fonctionnalités actives.</li>
                            <li>Documenter qui a accès au dashboard.</li>
                            <li>Revoir régulièrement les permissions de modération.</li>
                            <li>Supprimer les données obsolètes dès qu'elles ne servent plus.</li>
                        </ul>
                    </aside>
                </div>
            </section>
        </main>
    )
}