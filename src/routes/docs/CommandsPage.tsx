export function CommandsPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Commandes disponibles</h1>
            <p className="text-base-content/70">
                Voici l'ensemble des commandes slash que tu peux utiliser avec Voicey.
            </p>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Commande</th>
                            <th>Description</th>
                            <th className="hidden md:table-cell">Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <code className="badge badge-ghost">/config</code>
                            </td>
                            <td>Configure les catégories et limites de salons</td>
                            <td className="hidden md:table-cell">Admin</td>
                        </tr>
                        <tr>
                            <td>
                                <code className="badge badge-ghost">/settings</code>
                            </td>
                            <td>Paramètres avancés et permissions par rôle</td>
                            <td className="hidden md:table-cell">Admin</td>
                        </tr>
                        <tr>
                            <td>
                                <code className="badge badge-ghost">/ping</code>
                            </td>
                            <td>Vérifie la latence du bot</td>
                            <td className="hidden md:table-cell">Tous</td>
                        </tr>
                        <tr>
                            <td>
                                <code className="badge badge-ghost">/history</code>
                            </td>
                            <td>Affiche l'historique des actions</td>
                            <td className="hidden md:table-cell">Modérateur</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold">Boutons d'action</h2>
                <p className="text-base-content/70">
                    Dans chaque salon vocal créé, tu auras accès à ces boutons :
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">🔒 Lock</h3>
                            <p className="text-sm">Verrouille le salon pour les nouveaux entrants</p>
                        </div>
                    </div>
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">🔓 Unlock</h3>
                            <p className="text-sm">Déverrouille le salon</p>
                        </div>
                    </div>
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">🎯 Limit</h3>
                            <p className="text-sm">Ajuste la limite d'utilisateurs</p>
                        </div>
                    </div>
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">👑 Transfer</h3>
                            <p className="text-sm">Transfère la propriété du salon</p>
                        </div>
                    </div>
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">👢 Kick</h3>
                            <p className="text-sm">Éjecte un utilisateur</p>
                        </div>
                    </div>
                    <div className="card border border-base-300 bg-base-200/50">
                        <div className="card-body">
                            <h3 className="card-title text-lg">🚫 Ban</h3>
                            <p className="text-sm">Bannit un utilisateur du salon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
