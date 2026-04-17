import { Link } from 'react-router'
import { BoltIcon, ShieldCheckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../assets/images/voicey-logo.png'
import { startDiscordLogin } from '../api/discordAuth'
import { FeaturedServers } from '../components'

export function HomePage() {
    return (
        <main className="relative isolate overflow-hidden bg-base-100">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl"></div>
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
            </div>

            <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-8 px-6 py-14 md:grid-cols-2 lg:px-10">
                <div className="space-y-6">
                    <div className="badge badge-primary badge-outline badge-lg">Bot Discord Voicey</div>
                    <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                        Le bot Discord qui crée tes salons vocaux temporaires automatiquement
                    </h1>
                    <p className="max-w-2xl text-base-content/80 sm:text-lg">
                        Voicey est un bot Discord dédié aux salons vocaux : il détecte l&apos;arrivée d&apos;un membre,
                        crée son salon, applique les permissions, puis nettoie quand il est vide. Rapide, propre,
                        zéro friction pour ta communauté.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button className="btn btn-primary btn-wide" onClick={() => void startDiscordLogin('/dashboard').catch(console.error)}>
                            Se connecter au dashboard
                        </button>
                        <Link to="/docs/commands" className="btn btn-outline btn-secondary">
                            Voir les commandes Discord
                        </Link>
                    </div>
                    <div className="alert alert-info alert-soft max-w-xl">
                        <ShieldCheckIcon className="h-5 w-5" />
                        <span>Bot Discord sécurisé : permissions maîtrisées, logs de modération, et configuration par rôle.</span>
                    </div>
                </div>

                <div className="relative mr-0 flex items-center justify-end p-0 md:-mr-8 lg:-mr-12 xl:-mr-16">
                    <div className="hover-3d hover-3d-logo w-full max-w-[640px]">
                        <figure className="w-full max-w-[640px]">
                            <img
                                src={logoSansFond}
                                alt="Logo Voicey"
                                className="relative z-10 w-full max-w-[640px] object-contain"
                            />
                        </figure>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
                <div className="stats stats-vertical w-full bg-base-200/70 shadow md:stats-horizontal">
                    <div className="stat">
                        <div className="stat-title">Salons créés / jour</div>
                        <div className="stat-value text-primary">2.4K</div>
                        <div className="stat-desc">+18% cette semaine</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Temps moyen création</div>
                        <div className="stat-value text-secondary">&lt; 1s</div>
                        <div className="stat-desc">quasi instantané</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Serveurs actifs</div>
                        <div className="stat-value text-accent">890</div>
                        <div className="stat-desc">moderation integree</div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <h2 className="text-3xl font-extrabold sm:text-4xl">Fonctions principales</h2>
                <p className="mt-2 max-w-2xl text-base-content/70">
                    Une boîte à outils complète pour gérer des salons vocaux dynamiques sur Discord.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                        <div className="card-body">
                            <BoltIcon className="h-8 w-8 text-primary" />
                            <h3 className="card-title">Création instantanée</h3>
                            <p>Un membre rejoint le canal créateur, un salon privé est ouvert automatiquement.</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-primary badge-soft">Auto</span>
                            </div>
                        </div>
                    </article>

                    <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                        <div className="card-body">
                            <WrenchScrewdriverIcon className="h-8 w-8 text-secondary" />
                            <h3 className="card-title">Contrôles par boutons</h3>
                            <p>Lock, unlock, limit, transfer, kick, ban et reset sans taper de commande.</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-secondary badge-soft">UI</span>
                            </div>
                        </div>
                    </article>

                    <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl md:col-span-2 xl:col-span-1">
                        <div className="card-body">
                            <ShieldCheckIcon className="h-8 w-8 text-accent" />
                            <h3 className="card-title">Modération et historique</h3>
                            <p>Suivi des actions sensibles et historique des bans pour éviter les abus.</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-accent badge-soft">Secure</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-extrabold">Mise en place en 3 étapes</h2>
                        <ul className="steps steps-vertical mt-6 w-full lg:steps-horizontal">
                            <li className="step step-primary">Invite le bot</li>
                            <li className="step step-primary">Configure /config</li>
                            <li className="step">Ton serveur est live</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" defaultChecked />
                            <div className="collapse-title font-semibold">Le bot supprime les salons vides ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Oui. Quand le dernier membre quitte, le salon temporaire est retiré proprement.
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" />
                            <div className="collapse-title font-semibold">Puis-je limiter le nombre de places ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Oui, avec des présets par défaut et des ajustements en direct via bouton Limit.
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" />
                            <div className="collapse-title font-semibold">Compatible avec plusieurs catégories ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Oui, tu peux définir des catégories vocales différentes selon tes besoins communautaires.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedServers />

            <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10">
                <div className="hero rounded-box border border-primary/20 bg-gradient-to-r from-primary/20 via-base-200 to-secondary/20 p-2">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-black sm:text-4xl">Prêt à fluidifier ton vocal Discord ?</h2>
                            <p className="py-4 text-base-content/80">
                                Lance Voicey et donne à tes membres des salons perso, gérables en 1 clic.
                            </p>
                            <div className="join join-vertical gap-2 sm:join-horizontal">
                                <button className="btn join-item btn-primary">Ajouter Voicey</button>
                                <Link to="/docs" className="btn join-item btn-outline">
                                    Documentation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
