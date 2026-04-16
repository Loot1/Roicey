export function PrivacyPage() {
    const collectedData = [
        'Informations publiques du compte Discord nécessaires à l\'authentification et à l\'affichage du dashboard.',
        'Identifiants de serveurs, rôles et configurations strictement utiles au fonctionnement de Voicey.',
        'Journaux techniques limités au diagnostic, à la modération et à la sécurisation du service.',
    ]

    const userRights = [
        'Demander des précisions sur les données conservées.',
        'Solliciter la suppression des données qui ne sont plus nécessaires.',
        'Retirer l\'accès au dashboard en coupant la connexion Discord ou en supprimant l\'intégration.',
    ]

    return (
        <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
            <div className="mb-10 max-w-3xl">
                <div className="badge badge-secondary badge-outline badge-lg">Confidentialité</div>
                <h1 className="mt-4 text-4xl font-black tracking-tight">Politique de confidentialité</h1>
                <p className="mt-4 text-base leading-7 text-base-content/75">
                    Cette page décrit comment Roicey et Voicey collectent, utilisent et conservent les données
                    nécessaires à l'authentification Discord, au dashboard et aux fonctions de modération.
                </p>
            </div>

            <div className="space-y-8">
                <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">Données collectées</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-base-content/75">
                        {collectedData.map((item) => (
                            <li key={item} className="rounded-lg bg-base-200/40 px-4 py-3">{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">Finalités d'usage</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <article className="rounded-xl border border-base-300/80 bg-base-200/30 p-4">
                            <h3 className="font-semibold">Authentification</h3>
                            <p className="mt-2 text-sm text-base-content/72">
                                Valider l'identité Discord de l'utilisateur et afficher les ressources auxquelles il a accès.
                            </p>
                        </article>
                        <article className="rounded-xl border border-base-300/80 bg-base-200/30 p-4">
                            <h3 className="font-semibold">Configuration</h3>
                            <p className="mt-2 text-sm text-base-content/72">
                                Sauvegarder les paramètres de serveur, les permissions et les options du bot.
                            </p>
                        </article>
                        <article className="rounded-xl border border-base-300/80 bg-base-200/30 p-4">
                            <h3 className="font-semibold">Sécurité</h3>
                            <p className="mt-2 text-sm text-base-content/72">
                                Détecter les anomalies, limiter les abus et conserver des traces techniques en cas d'incident.
                            </p>
                        </article>
                        <article className="rounded-xl border border-base-300/80 bg-base-200/30 p-4">
                            <h3 className="font-semibold">Support</h3>
                            <p className="mt-2 text-sm text-base-content/72">
                                Répondre à une demande légitime d'assistance ou de suppression de données.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">Durée de conservation</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        Les données sont conservées uniquement pendant la durée utile au service, à la modération ou au
                        respect des obligations légales. Les éléments techniques et journaux sont limités au strict besoin
                        opérationnel et doivent être purgés dès qu'ils ne sont plus nécessaires.
                    </p>
                </section>

                <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">Vos droits</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-base-content/75">
                        {userRights.map((item) => (
                            <li key={item} className="rounded-lg bg-base-200/40 px-4 py-3">{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-box border border-secondary/20 bg-secondary/8 p-6">
                    <h2 className="text-xl font-bold">Contact</h2>
                    <p className="mt-3 text-sm leading-6 text-base-content/75">
                        Pour toute question relative à la confidentialité, utilisez le serveur de support, les issues GitHub
                        ou l'adresse support@voicey.app.
                    </p>
                    <p className="mt-4 text-xs text-base-content/55">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </section>
            </div>
        </main>
    )
}