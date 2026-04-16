import { DocsCard } from '../../components'

export function DocsModerationPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Outils de modération</h1>
            <p className="text-base-content/70">
                Voicey inclut des outils puissants pour maintenir un serveur sain et sécurisé.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                <DocsCard title="📜 Historique des bans">
                    <p className="text-sm text-base-content/70">
                        Chaque ban est tracé avec la date, l'auteur et la raison. Consulte l'historique 
                        à tout moment.
                    </p>
                </DocsCard>

                <DocsCard title="📝 Logs d'actions">
                    <p className="text-sm text-base-content/70">
                        Toutes les actions (kick, lock, transfer) sont enregistrées pour traçabilité 
                        et audit.
                    </p>
                </DocsCard>

                <DocsCard title="👮 Répartition des rôles">
                    <p className="text-sm text-base-content/70">
                        Contrôle qui peut ban, kick, ou transférer la propriété selon les rôles 
                        Discord.
                    </p>
                </DocsCard>

                <DocsCard title="🧹 Auto-cleanup">
                    <p className="text-sm text-base-content/70">
                        Les salons vides sont nettoyés automatiquement. Pas de salon mort sur ton 
                        serveur !
                    </p>
                </DocsCard>
            </div>

            <h2 className="text-2xl font-bold mt-6">Actions modérées</h2>
            <p className="text-base-content/70 mb-4">
                Voici les actions qui déclenchent une trace dans l'historique :
            </p>

            <div className="space-y-2">
                <div className="flex items-start gap-3">
                    <span className="badge badge-primary mt-1">BAN</span>
                    <div>
                        <p className="font-semibold">Bannissement d'un utilisateur</p>
                        <p className="text-sm text-base-content/70">Impossible d'accéder au salon</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="badge badge-secondary mt-1">KICK</span>
                    <div>
                        <p className="font-semibold">Expulsion d'un utilisateur</p>
                        <p className="text-sm text-base-content/70">Peut rejoindre plus tard</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="badge badge-accent mt-1">LOCK</span>
                    <div>
                        <p className="font-semibold">Verrouillage du salon</p>
                        <p className="text-sm text-base-content/70">Les nouveaux ne peuvent pas entrer</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="badge badge-info mt-1">TRANSFER</span>
                    <div>
                        <p className="font-semibold">Transfert de propriété</p>
                        <p className="text-sm text-base-content/70">Changement de propriétaire du salon</p>
                    </div>
                </div>
            </div>

            <div className="alert alert-warning mt-6">
                <p>⚠️ <strong>Important :</strong> Les logs de modération sont conservés pour 90 jours minimum pour des raisons légales.</p>
            </div>
        </div>
    )
}
