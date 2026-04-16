import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { DocsStep } from '../../components'

export function GettingStartedPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Démarrage rapide</h1>
            <p className="text-base-content/70">
                Voici comment mettre en place Voicey en moins de 5 minutes.
            </p>

            <div className="space-y-4">
                <DocsStep
                    step={1}
                    title="Invite le bot"
                    description={'Clique sur le bouton "Ajouter au serveur" pour inviter Voicey sur ton serveur Discord.'}
                    action={<button className="btn btn-primary btn-sm w-fit">Inviter Voicey</button>}
                />

                <DocsStep
                    step={2}
                    title="Configure les permissions"
                    description="Assure-toi que Voicey a les permissions nécessaires :"
                >
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Gérer les salons (Create/Delete channels)</li>
                        <li>Gérer les permissions (Manage permissions)</li>
                        <li>Déplacer les utilisateurs (Move members)</li>
                        <li>Éjecter les utilisateurs (Kick members)</li>
                    </ul>
                </DocsStep>

                <DocsStep step={3} title="Lance la configuration">
                    <p className="text-sm text-base-content/70">
                        Utilise la commande <code className="badge badge-ghost">/config</code> pour commencer.
                    </p>
                </DocsStep>
            </div>

            <div className="alert alert-info mt-6">
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Besoin d'aide ? Rejoins notre serveur Discord pour poser des questions.</span>
            </div>
        </div>
    )
}
