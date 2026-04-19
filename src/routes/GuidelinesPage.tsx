export function GuidelinesPage() {
    return (
        <main className="bg-base-100">
            <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-primary/10 via-base-100 to-base-100">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
                </div>
                <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
                    <div className="badge badge-primary badge-outline badge-lg">Charte d'utilisation</div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Charte d'utilisation de Voicey</h1>
                    <p className="mt-4 max-w-3xl text-base text-base-content/75 sm:text-lg">
                        Cette charte fixe le cadre d'un usage transparent, proportionné et compatible avec un bot Discord pensé pour la modération vocale.
                    </p>
                    <p className="text-2xl font-black italic leading-tight text-base-content sm:text-3xl mt-4">
                        “Un grand pouvoir implique de <span className="text-primary">grandes responsabilités</span>.”
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-10 mb-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Transparence</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Tout serveur Discord qui utilise Voicey ne doit pas chercher à cacher le fonctionnement des salons vocaux, du dashboard et de l'existence possible d'enregistrements à ses membres.
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Usage à seule fin de modération</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Les outils de Voicey doivent servir le seul objectif de préserver un espace communautaire. Tout usage des fonctionnalités de modération de Voicey n'ayant pas pour sens de documenter un incident ou faciliter une décision est à proscrire.
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Accès limité au dashboard</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Seuls les modérateurs et responsables habilités du serveur doivent pouvoir accéder au dashboard et consulter les éléments sensibles.
                        </p>
                    </article>
                    <article className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-black">Interdiction de surveillance, discrimination et de harcèlement</h2>
                        <p className="mt-4 text-sm leading-6 text-base-content/72">
                            Voicey ne doit jamais être utilisé pour surveiller des membres, constituer des dossiers personnels ou nourrir un comportement de harcèlement.
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 mb-12 lg:px-10">
                <div className="rounded-box border border-primary/20 bg-primary/8 p-6">
                    <h2 className="text-2xl font-black text-secondary">Non-respect de la charte</h2>
                    <p className="mt-4 text-sm text-base-content/75">
                        En cas de non-respect de cette charte, il est possible que l'accès au bot soit retiré à un serveur Discord ou bien à un utilisateur.
                    </p>
                </div>
            </section>
        </main>
    )
}