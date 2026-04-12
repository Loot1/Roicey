export function ConfigurationPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Guide de configuration</h1>
            <p className="text-base-content/70">
                Personnalise chaque aspect de Voicey selon tes besoins.
            </p>

            <div className="space-y-3">
                <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
                    <input type="radio" name="config" defaultChecked />
                    <div className="collapse-title font-semibold">📁 Catégories vocales</div>
                    <div className="collapse-content text-sm space-y-2">
                        <p>
                            Définis les catégories où les salons temporaires seront créés. Tu peux avoir plusieurs 
                            catégories avec des configurations différentes.
                        </p>
                        <p className="text-base-content/60">
                            <strong>Exemple :</strong> Une catégorie "Gaming" avec limite 5 personnes et une catégorie 
                            "Étude" avec limite 10 personnes.
                        </p>
                    </div>
                </div>

                <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
                    <input type="radio" name="config" />
                    <div className="collapse-title font-semibold">👥 Limites d'utilisateurs</div>
                    <div className="collapse-content text-sm space-y-2">
                        <p>
                            Configure le nombre maximum d'utilisateurs par défaut. Les propriétaires de salons 
                            peuvent encore l'ajuster avec le bouton "Limit".
                        </p>
                        <p className="text-base-content/60">
                            <strong>Limites disponibles :</strong> 1 à 99 utilisateurs (Discord API limit)
                        </p>
                    </div>
                </div>

                <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
                    <input type="radio" name="config" />
                    <div className="collapse-title font-semibold">🔐 Rôles et permissions</div>
                    <div className="collapse-content text-sm space-y-2">
                        <p>
                            Assigne des rôles spéciaux pour contrôler qui peut accéder à certaines fonctionnalités 
                            comme le ban ou le transfer de propriété.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Rôle Admin : Accès à toutes les commandes</li>
                            <li>Rôle Modérateur : Peut bannir/kicker</li>
                            <li>Rôle Utilisateur : Peut créer des salons</li>
                        </ul>
                    </div>
                </div>

                <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
                    <input type="radio" name="config" />
                    <div className="collapse-title font-semibold">📛 Nommage des salons</div>
                    <div className="collapse-content text-sm space-y-2">
                        <p>
                            Personnalise le format des noms de salons :
                        </p>
                        <div className="bg-base-100 p-2 rounded text-xs font-mono">
                            • username : salon-louis<br/>
                            • numéro : salon-1, salon-2<br/>
                            • ID : salon-123456789
                        </div>
                    </div>
                </div>

                <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
                    <input type="radio" name="config" />
                    <div className="collapse-title font-semibold">🗑️ Nettoyage automatique</div>
                    <div className="collapse-content text-sm space-y-2">
                        <p>
                            Configure le délai avant suppression des salons vides :
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Immédiat : Dès que vide</li>
                            <li>5 minutes : Délai de grâce</li>
                            <li>Jamais : Conservation manuelle</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="alert alert-success mt-6">
                <span>💡 Tip : Teste ta configuration sur un serveur test avant de la déployer en production !</span>
            </div>
        </div>
    )
}
