export function PrivacyPage() {
    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">Traitement des données</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Politique de confidentialité</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        Cette page décrit comment Voicey collecte, utilise et conserve les données
                        nécessaires à l'authentification Discord, au dashboard et aux fonctions de modération.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10">
                <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black">Principes généraux</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        La logique exposée sur le site repose sur un principe simple : collecter uniquement les données
                        nécessaires au fonctionnement du bot, à l'authentification des personnes autorisées, à la gestion
                        des serveurs Discord et à la mise à disposition des outils de modération présentés dans la
                        documentation.
                    </p>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        Voicey n'est pas présenté comme un outil de surveillance générale. Les traitements décrits ici
                        s'inscrivent dans un cadre de gestion vocale, de traçabilité utile et d'aide à la modération,
                        conformément aux pages publiques du site et à la charte d'utilisation.
                    </p>
                </article>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Données susceptibles d'être traitées</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Selon les fonctionnalités utilisées, le service peut traiter des données issues de Discord,
                            notamment des identifiants techniques, des noms d'utilisateur, des noms de serveur, des rôles
                            d'administration ou de modération, des informations de configuration de guildes et des éléments
                            nécessaires à l'accès au dashboard.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le service peut également traiter des données liées aux salons vocaux temporaires, à
                            l'historique des bannissements vocaux, aux restrictions de record, aux liens de messages ou
                            d'archives et, lorsque la fonctionnalité correspondante est utilisée, aux enregistrements
                            publiés dans Discord.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Authentification Discord</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            L'accès au dashboard repose sur une authentification via Discord. À cette fin, des données de
                            session et des informations liées au compte Discord connecté sont traitées pour identifier la
                            personne, maintenir sa session et déterminer si elle peut accéder au dashboard d'un serveur.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Ces traitements ont pour finalité de sécuriser l'accès aux pages privées et de réserver les
                            outils sensibles aux personnes disposant des droits nécessaires.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Finalités du traitement</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les données sont traitées afin de permettre la connexion au dashboard, d'afficher les serveurs
                            accessibles, de gérer les paramètres de guildes, de consulter les éléments de modération,
                            d'exploiter la documentation et de faire fonctionner les fonctionnalités décrites publiquement
                            sur le site.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Lorsqu'un record est déclenché, la finalité annoncée sur le site reste l'appui à une action de
                            modération légitime, et non un usage de confort, de curiosité ou de surveillance généralisée.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Enregistrements et stockage</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Conformément au contenu des pages publiques, les enregistrements sont publiés dans Discord,
                            dans le salon de modération du serveur concerné, avec une archive destinée à l'exploitation
                            via le dashboard.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le site présente cette architecture comme une logique de souveraineté des données adossée à
                            l'espace Discord du serveur utilisateur. Les enregistrements n'ont pas vocation à être stockés
                            comme une bibliothèque centralisée destinée à des usages étrangers à la modération du serveur.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Accès aux données</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le site et la documentation indiquent que le dashboard est réservé aux modérateurs et
                            responsables habilités du serveur. Les informations sensibles ne sont donc pas destinées à un
                            accès public ou généralisé aux membres d'une communauté.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les administrateurs et équipes de modération utilisant Voicey demeurent responsables du cadre
                            d'usage sur leur serveur, de l'information donnée aux membres et du respect des règles qu'ils
                            imposent localement.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Cookies et sessions</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le fonctionnement de l'authentification et du dashboard peut impliquer l'utilisation de
                            mécanismes techniques de session, indispensables à la connexion, au maintien de l'état
                            authentifié et à la sécurisation de l'accès aux pages privées.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Aucun engagement public distinct en faveur d'un suivi publicitaire ou d'un profilage marketing
                            n'est présenté sur le site dans le cadre des pages actuellement publiées.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Services tiers</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le service s'appuie sur des plateformes tierces, notamment Discord pour l'identité, les serveurs,
                            les messages et la publication des éléments liés à la modération, ainsi que GitHub Pages pour
                            l'hébergement du site public.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les traitements opérés par ces services tiers relèvent également de leurs propres politiques,
                            conditions et obligations techniques.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Droits et demandes</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Toute demande relative aux données traitées via le site, à l'accès au dashboard ou au cadre
                            d'utilisation présenté publiquement peut être adressée via le point de contact public du
                            projet indiqué sur le site, à savoir le serveur Discord d'assistance.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les demandes doivent être appréciées au regard du rôle du site, de la nature des données,
                            des contraintes de sécurité du dashboard, ainsi que des services tiers impliqués dans le
                            fonctionnement global de Voicey.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-14 pt-6 lg:px-10">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">Évolution de la politique</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        La présente politique peut évoluer pour tenir compte des modifications apportées à Roicey,
                        à Voicey, au dashboard, aux fonctionnalités de modération ou aux services tiers mobilisés par
                        le projet.
                    </p>
                </div>
            </section>
        </main>
    )
}