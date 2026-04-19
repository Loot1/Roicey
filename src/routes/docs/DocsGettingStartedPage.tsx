import { Link } from 'react-router'
import { DocsStep } from '../../components'
import { VOICEY_INVITE_URL } from '../../constants'

export function DocsGettingStartedPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Démarrage rapide</h1>
            <p className="text-base-content/70">
                Suivez ces étapes pour que Voicey soit opérationnel sur votre serveur. Vous pourrez ensuite consulter les autres pages de la documentation pour maîtriser tous les détails du fonctionnement du bot.
            </p>

            <div className="space-y-4">
                <DocsStep
                    step={1}
                    title="Invite le bot"
                    description={
                        "Ajoute Voicey sur ton serveur, puis vérifie qu'il peut créer des salons vocaux, modifier leurs permissions, rejoindre un salon vocal et écrire dans ton salon de modération."
                    }
                    action={<a href={VOICEY_INVITE_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm w-fit">Inviter Voicey</a>}
                />

                <DocsStep
                    step={2}
                    title="Configure les permissions"
                    description="Les permissions minimales à prévoir côté bot sont :"
                >
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Créer et supprimer des salons vocaux temporaires</li>
                        <li>Modifier les permissions d'accès des salons</li>
                        <li>Rejoindre un salon vocal pour lancer un enregistrement</li>
                        <li>Écrire dans le salon de modération configuré</li>
                    </ul>
                </DocsStep>

                <DocsStep step={3} title="Lance l'assistant de configuration">
                    <p className="text-sm text-base-content/70">
                        Utilise la commande <code className="badge badge-ghost">/config</code> pour régler les paramètres de base du bot.
                    </p>
                </DocsStep>

            </div>

            <div className="mt-6 rounded-box border border-info/25 bg-info/12 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <p className="text-sm text-base-content/80">Le démarrage rapide suffit pour que le bot fonctionne sur votre serveur Discord, mais n'hésitez pas à aller lire en détail les options de configuration.</p>
                    <Link to="/docs/settings" className="btn btn-info btn-sm">
                        Voir les paramètres
                    </Link>
                </div>
            </div>
        </div>
    )
}
