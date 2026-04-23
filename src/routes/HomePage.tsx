import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import { InformationCircleIcon, ShieldCheckIcon, SpeakerWaveIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../assets/images/voicey-logo.png'
import { FeaturedServers } from '../components'
import { getPublicStats } from '../api/discordAuth'
import { VOICEY_HELP_DISCORD_URL, VOICEY_INVITE_URL } from '../constants'
import type { FeaturedServer } from '../types'

export function HomePage() {
    const [stats, setStats] = useState({
        createdVoiceRoomsToday: 0,
        totalVoiceRooms: 0,
        totalActiveServers: 0,
        nonFeaturedActiveServers: 0,
    })
    const [featuredServers, setFeaturedServers] = useState<FeaturedServer[]>([])
    const [homeDataLoading, setHomeDataLoading] = useState(true)
    const [homeDataError, setHomeDataError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false

        const loadHomeData = async () => {
            try {
                const publicHomeData = await getPublicStats()
                if (!ignore) {
                    setStats(publicHomeData.stats)
                    setFeaturedServers(publicHomeData.servers)
                    setHomeDataError(null)
                }
            } catch {
                if (!ignore) {
                    setStats({
                        createdVoiceRoomsToday: 0,
                        totalVoiceRooms: 0,
                        totalActiveServers: 0,
                        nonFeaturedActiveServers: 0,
                    })
                    setFeaturedServers([])
                    setHomeDataError('Impossible de charger les données publiques de Voicey pour le moment.')
                }
            } finally {
                if (!ignore) {
                    setHomeDataLoading(false)
                }
            }
        }

        void loadHomeData()

        return () => {
            ignore = true
        }
    }, [])

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
                        Le bot de gestion des salons vocaux conçu pour la modération
                    </h1>
                    <p className="max-w-2xl text-base-content/80 sm:text-lg">
                        Voicey crée automatiquement les salons vocaux temporaires, les rend simples à piloter avec des boutons
                        et ajoute des fonctionnalités pensées pour la modération vocale.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href={VOICEY_INVITE_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-wide">
                            Ajouter Voicey
                        </a>
                        <a href={VOICEY_HELP_DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-outline btn-secondary">
                            Rejoindre le Discord
                        </a>
                    </div>
                    <div className="alert alert-info alert-soft max-w-xl">
                        <InformationCircleIcon className="h-5 w-5" />
                        <span>Enregistrements publiés dans Discord, historique des bannissements vocaux et dashboard réservé à la modération : Voicey facilite la modération de vos salons vocaux.</span>
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
                        <div className="stat-title">Salons créés aujourd'hui</div>
                        <div className="stat-value text-secondary">{stats.createdVoiceRoomsToday.toLocaleString('fr-FR')}</div>
                        <div className="stat-desc">{stats.totalVoiceRooms.toLocaleString('fr-FR')} au total</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Temps moyen création</div>
                        <div className="stat-value text-secondary">&lt; 1s</div>
                        <div className="stat-desc">instantané</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Serveurs actifs</div>
                        <div className="stat-value text-secondary">{stats.totalActiveServers.toLocaleString('fr-FR')}</div>
                        <div className="stat-desc">{stats.nonFeaturedActiveServers.toLocaleString('fr-FR')} autres hors featured</div>
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
                            <WrenchScrewdriverIcon className="h-8 w-8 text-secondary" />
                            <h3 className="card-title">Contrôles par boutons, menus et modals</h3>
                            <p>Verouiller, limiter, transférer, expulser et bannir de votre salon sans taper de commande. Gérer votre salon vocal Discord devient très simple!</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-secondary badge-soft">Accessibilité</span>
                            </div>
                        </div>
                    </article>

                    <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                        <div className="card-body">
                            <SpeakerWaveIcon className="h-8 w-8 text-secondary" />
                            <h3 className="card-title">Enregistrement à la demande</h3>
                            <p>Enregistrement vocal déclenché par vos membres et publié dans le salon de logs de votre serveur Discord pour fournir une preuve exploitable.</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-secondary badge-soft">Modération avancée</span>
                            </div>
                        </div>
                    </article>

                    <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                        <div className="card-body">
                            <ShieldCheckIcon className="h-8 w-8 text-secondary" />
                            <h3 className="card-title">Historique des bannissements</h3>
                            <p>Une alerte est envoyée dès qu'un utilisateur est banni d'un salon vocal et un historique est conservé consultable à tout moment.</p>
                            <div className="card-actions justify-end">
                                <span className="badge badge-secondary badge-soft">Traçabilité</span>
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
                            <li className="step step-primary">Configure avec /config</li>
                            <li className="step">C'est parti !</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" defaultChecked />
                            <div className="collapse-title font-semibold">Qui peut voir les enregistrements ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Uniquement les modérateurs autorisés dans le serveur, selon la configuration des rôles et des accès aux salons.
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" />
                            <div className="collapse-title font-semibold">Peut-on empêcher un membre d'utiliser /record ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Oui. Les modérateurs peuvent appliquer des restrictions ciblées pour bloquer la demande d'enregistrement à des utilisateurs précis.
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200/70">
                            <input type="radio" name="faq-voicey" />
                            <div className="collapse-title font-semibold">Les salons vocaux temporaires sont-ils nettoyés automatiquement ?</div>
                            <div className="collapse-content text-sm text-base-content/80">
                                Oui. Dès que le dernier membre quitte, le salon temporaire est retiré pour garder le serveur propre et lisible.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedServers
                servers={featuredServers}
                nonFeaturedActiveServers={stats.nonFeaturedActiveServers}
                loading={homeDataLoading}
                error={homeDataError}
            />

            <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10">
                <div className="hero rounded-box border border-primary/20 bg-gradient-to-r from-primary/20 via-base-200 to-secondary/20 p-2">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-black sm:text-4xl">Prêt à fluidifier ton vocal Discord ?</h2>
                            <p className="py-4 text-base-content/80">
                                Installe Voicey et donne à tes membres des salons vocaux simples à utiliser, avec une vraie boîte à outils de modération.
                            </p>
                            <div className="join join-vertical gap-2 sm:join-horizontal">
                                <a href={VOICEY_INVITE_URL} target="_blank" rel="noreferrer" className="btn join-item btn-primary">Ajouter Voicey</a>
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
