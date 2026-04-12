import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export function GettingStartedPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Démarrage rapide</h1>
            <p className="text-base-content/70">
                Voici comment mettre en place Voicey en moins de 5 minutes.
            </p>

            <div className="space-y-4">
                <div className="card border border-base-300 bg-base-200/50">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Étape 1 : Invite le bot</h3>
                        <p className="mb-3 text-sm text-base-content/70">
                            Clique sur le bouton "Ajouter au serveur" pour inviter Voicey sur ton serveur Discord.
                        </p>
                        <button className="btn btn-primary btn-sm w-fit">Inviter Voicey</button>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-200/50">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Étape 2 : Configure les permissions</h3>
                        <p className="text-sm text-base-content/70">
                            Assure-toi que Voicey a les permissions nécessaires :
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                            <li>Gérer les salons (Create/Delete channels)</li>
                            <li>Gérer les permissions (Manage permissions)</li>
                            <li>Déplacer les utilisateurs (Move members)</li>
                            <li>Éjecter les utilisateurs (Kick members)</li>
                        </ul>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-200/50">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Étape 3 : Lance la configuration</h3>
                        <p className="text-sm text-base-content/70">
                            Utilise la commande <code className="badge badge-ghost">/config</code> pour commencer.
                        </p>
                    </div>
                </div>
            </div>

            <div className="alert alert-info mt-6">
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Besoin d'aide ? Rejoins notre serveur Discord pour poser des questions.</span>
            </div>
        </div>
    )
}
