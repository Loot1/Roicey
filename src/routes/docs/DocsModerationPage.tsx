import { Link } from 'react-router'

import { DocsCard } from '../../components'

export function DocsModerationPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Accès et modération</h1>
            <p className="text-base-content/70">
                Voicey n'est pas que le bot Discord qui va gérer les salons vocaux, c'est un bot vocal orienté modération. Plusieurs fonctionnalités sont pensées pour faciliter le travail de modération au quotidien.
            </p>

            <div className="grid gap-4 xl:grid-cols-2">
                <DocsCard title="🏠 Salons vocaux temporaires pour contrôle modérateur">
                    <p className="text-sm text-base-content/70">
                        Les salons vocaux temporaires améliorent aussi la modération au quotidien, car ils donnent aux
                        modérateurs un vrai contrôle directement depuis les boutons du salon.
                    </p>
                    <p className="text-sm text-base-content/70">
                        Les modérateurs sont immunisés contre les actions de ban, de kick et les autres restrictions
                        appliquées par un propriétaire de salon, et peuvent utiliser les boutons pour reprendre la main,
                        retirer la gestion d'un salon ou corriger une situation abusive.
                    </p>
                </DocsCard>

                <DocsCard title="🎙️ Fonctionnalité de record">
                    <p className="text-sm text-base-content/70">
                        Voicey met aussi à disposition une fonctionnalité de record capable d'enregistrer puis de
                        transmettre le résultat dans le cadre prévu par le serveur.
                    </p>
                    <p className="text-sm text-base-content/70">
                        En cas d'abus, la commande <code className="badge badge-ghost px-1">/recordban</code> permet de bannir
                        les personnes qui détournent cette fonctionnalité, sans les exclure du reste du serveur.
                    </p>
                    <div className="mt-4">
                        <Link to="/docs/recording" className="btn btn-secondary btn-sm">
                            En savoir plus
                        </Link>
                    </div>
                </DocsCard>

                <DocsCard title="🛡️ Dashboard regroupant l'ensemble">
                    <p className="text-sm text-base-content/70">
                        Le dashboard regroupe ces informations et donne à la modération un outil de suivi simple et performant. 
                        Il peut permettre une lecture plus fine des enregistrements notamment avec une lecture de l'audio de chaque utilisateur.
                    </p>
                    <div className="mt-4">
                        <Link to="/demo" className="btn btn-secondary btn-sm">
                            Voir la démo
                        </Link>
                    </div>
                </DocsCard>

                <DocsCard title="📣 Alertes et historique des bans vocaux">
                    <p className="text-sm text-base-content/70">
                        Lorsqu'un bannissement est appliqué dans un salon vocal, une alerte est remontée afin que
                        l'équipe de modération sache immédiatement ce qui s'est passé.
                    </p>
                    <p className="text-sm text-base-content/70">
                        L'historique peut ensuite être consulté avec la commande <code className="badge badge-ghost px-1">/banhistory</code>,
                        afin de relire les bannissements de salons vocaux avec leur contexte.
                    </p>
                </DocsCard>
            </div>
        </div>
    )
}
