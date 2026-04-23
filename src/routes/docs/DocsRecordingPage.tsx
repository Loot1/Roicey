import { Link } from 'react-router'

import { DocsCard } from '../../components'

export function DocsRecordingPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Fonctionnalité d'enregistrement</h1>
            <p className="text-base-content/70">
                L'enregistrement est une des fonctionnalités qui différencie Voicey des bots de salons vocaux classiques : il apporte un outil de preuve directement dans Discord, pensé pour la modération.
            </p>

            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                <DocsCard
                    title="🎙️ Déclenchement simple"
                    description={
                        <p>Pour déclencher un enregistrement, il suffit d'utiliser le bouton du salon vocal temporaire ou bien la commande <code className="badge badge-ghost px-1">/record</code>.</p>
                    }
                />
                <DocsCard title="👾 Stockage côté Discord" description="L'enregistrement est publié dans le salon de logs du serveur sous forme de message audio, directement exploitable." />
                <DocsCard title="🔐 Archive scellée" description="Voicey génère une archive chiffrée destinée au dashboard, qui permet d'analyser en détail l'enregistrement tout en empêchant tout accès d'une personne qui n'est pas autorisée." />
                <DocsCard title="🌍 Souveraineté des données" description="Les éléments de preuve sont uniquement envoyés sur le serveur Discord qui utilise Voicey. Si vous souhaitez supprimer un enregistrement, il vous suffit de supprimer le message contenant la pièce jointe sur Discord."/>
            </div>

            <div className="mt-4 rounded-box border border-primary/20 bg-primary/8 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <p className="text-sm text-base-content/80">Les enregistrements ne sont pas un outil de confort ou de curiosité. Ils existent pour appuyer une action de modération légitime.</p>
                    <Link to="/guidelines" className="btn btn-secondary btn-sm">
                        Lire la charte
                    </Link>
                </div>
            </div>
        </div>
    )
}