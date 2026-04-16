import { DocsCollapse } from '../../components'

export function ConfigurationPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Guide de configuration</h1>
            <p className="text-base-content/70">
                Personnalise chaque aspect de Voicey selon tes besoins.
            </p>

            <div className="space-y-3">
                <DocsCollapse name="config" title="📁 Catégories vocales" defaultChecked>
                    <div className="space-y-2">
                        <p>
                            Définis les catégories où les salons temporaires seront créés. Tu peux avoir plusieurs 
                            catégories avec des configurations différentes.
                        </p>
                        <p className="text-base-content/60">
                            <strong>Exemple :</strong> Une catégorie "Gaming" avec limite 5 personnes et une catégorie 
                            "Étude" avec limite 10 personnes.
                        </p>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="config" title="👥 Limites d'utilisateurs">
                    <div className="space-y-2">
                        <p>
                            Configure le nombre maximum d'utilisateurs par défaut. Les propriétaires de salons 
                            peuvent encore l'ajuster avec le bouton "Limit".
                        </p>
                        <p className="text-base-content/60">
                            <strong>Limites disponibles :</strong> 1 à 99 utilisateurs (Discord API limit)
                        </p>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="config" title="🔐 Rôles et permissions">
                    <div className="space-y-2">
                        <p>
                            Assigne des rôles spéciaux pour contrôler qui peut accéder à certaines fonctionnalités 
                            comme le ban ou le transfer de propriété.
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>Rôle Admin : Accès à toutes les commandes</li>
                            <li>Rôle Modérateur : Peut bannir/kicker</li>
                            <li>Rôle Utilisateur : Peut créer des salons</li>
                        </ul>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="config" title="📛 Nommage des salons">
                    <div className="space-y-2">
                        <p>
                            Personnalise le format des noms de salons :
                        </p>
                        <div className="bg-base-100 p-2 rounded text-xs font-mono">
                            • username : salon-louis<br/>
                            • numéro : salon-1, salon-2<br/>
                            • ID : salon-123456789
                        </div>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="config" title="🗑️ Nettoyage automatique">
                    <div className="space-y-2">
                        <p>
                            Configure le délai avant suppression des salons vides :
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>Immédiat : Dès que vide</li>
                            <li>5 minutes : Délai de grâce</li>
                            <li>Jamais : Conservation manuelle</li>
                        </ul>
                    </div>
                </DocsCollapse>
            </div>

            <div className="alert alert-success mt-6">
                <span>💡 Tip : Teste ta configuration sur un serveur test avant de la déployer en production !</span>
            </div>
        </div>
    )
}
