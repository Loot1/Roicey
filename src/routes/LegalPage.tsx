export function LegalPage() {
    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">Informations légales</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Mentions légales</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        Cette page présente les informations légales relatives au site Roicey, interface web de
                        Voicey, ainsi que les principales conditions d'utilisation du contenu publié sur le site.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Éditeur du site</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le site Roicey est la vitrine et l'interface web du projet Voicey, dédié à la gestion de
                            salons vocaux Discord, à la modération vocale et à l'accès à un dashboard réservé aux
                            personnes autorisées.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            La publication du site est assurée pour le compte du projet Voicey. Les pages publiques ont
                            pour objet de présenter les fonctionnalités du bot, sa documentation, sa charte d'usage et
                            les informations associées à l'utilisation du service.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Hébergement</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le site est hébergé via GitHub Pages, service proposé par GitHub, Inc. Le contenu public du
                            site est distribué à partir de cette infrastructure d'hébergement statique.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            L'hébergement GitHub Pages concerne la partie site web. Les services applicatifs liés à
                            l'authentification Discord, au dashboard et aux fonctionnalités associées à Voicey relèvent
                            d'une infrastructure distincte du simple site statique.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black">Propriété intellectuelle</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        Les textes, éléments visuels, signes distinctifs, logos, compositions graphiques et contenus
                        présents sur le site sont protégés par les règles applicables en matière de propriété
                        intellectuelle. Sauf mention contraire, ils sont réservés au projet Voicey ou à leurs titulaires
                        respectifs.
                    </p>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        Toute reproduction, adaptation, extraction, republication ou réutilisation substantielle du site
                        ou de son contenu, en tout ou partie, sans autorisation préalable, peut constituer une
                        atteinte aux droits applicables.
                    </p>
                </article>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Fonction du site</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Roicey a pour fonction de présenter Voicey, d'exposer sa documentation, de fournir des pages
                            d'information publique et, pour les personnes autorisées, de servir d'accès au dashboard lié
                            aux serveurs Discord utilisant le bot.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les contenus du site ont une valeur informative et descriptive. Ils ne constituent pas, par
                            eux-mêmes, une garantie absolue de disponibilité, de compatibilité ou d'adéquation à un
                            besoin particulier.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Responsabilité</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Malgré le soin apporté à la rédaction du site, des imprécisions, omissions ou écarts entre la
                            documentation publique et le fonctionnement effectif du service peuvent exister. Le site peut
                            également évoluer à tout moment.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            L'utilisation de Voicey, du dashboard et des fonctionnalités de modération suppose en outre le
                            respect des règles du serveur Discord concerné, de la charte du site, ainsi que des conditions
                            applicables aux services tiers utilisés par le projet.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Liens externes et services tiers</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Le site peut renvoyer vers des services tiers, notamment Discord et GitHub Pages. Ces services
                            disposent de leurs propres conditions d'utilisation, règles techniques et politiques de
                            confidentialité.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les fonctionnalités de connexion, d'invitation du bot ou d'accès à certaines ressources
                            dépendent de ces services externes et de leur disponibilité.
                        </p>
                    </article>

                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Contact</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Pour toute question relative au site, au fonctionnement général de Voicey, à la documentation
                            ou au cadre d'utilisation, le point de contact public mis en avant sur le site demeure le
                            serveur Discord d'assistance du projet.
                        </p>
                        <p className="mt-4 text-sm leading-6 text-base-content/75">
                            Les demandes liées aux contenus publics du site ou aux informations légales peuvent y être
                            adressées afin d'être orientées vers le canal approprié.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 pb-14 lg:px-10 mt-6">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">Mise à jour</h2>
                    <p className="mt-4 text-sm leading-6 text-base-content/75">
                        Les présentes mentions légales peuvent être adaptées pour refléter l'évolution du site, de son
                        hébergement, de ses fonctionnalités ou du cadre d'utilisation de Voicey.
                    </p>
                </div>
            </section>
        </main>
    )
}
