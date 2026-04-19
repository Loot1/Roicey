import { Link } from 'react-router'

import { DocsCollapse } from '../../components'

export function DocsFAQPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">FAQ - Questions fréquentes</h1>
            <p className="text-base-content/70">
                Les réponses aux questions les plus courantes sur Voicey.
            </p>

            <div className="space-y-3">
                <DocsCollapse name="faq" title="❓ Le bot a-t-il besoin de la permission Adminsitrateur ?" defaultChecked>
                    <p>
                        Non. Voicey a besoin des permissions utiles à sa mission, pas d'un accès administrateur global.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🛡️ Qui peut accéder au dashboard ?">
                    <p>
                        Le dashboard est réservé aux modérateurs et responsables du serveur qui disposent des droits de gestion nécessaires. Ce n'est pas un espace ouvert à tous les membres.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="💾 Où sont stockés les enregistrements ?">
                    <p>
                        Voicey publie les enregistrements dans le salon de modération Discord du serveur, avec une
                        archive prévue pour le dashboard. En aucun cas Voicey ne stocke les enregistements dans une base de données.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🚫 Peut-on empêcher une personne d'utiliser le record ?">
                    <p>
                        Oui. Les commandes <code className="badge badge-ghost px-1">/recordban</code> permettent de bloquer une personne sur cette fonctionnalité
                        sans l'exclure du serveur ni lui retirer l'accès aux salons vocaux standards.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🎧 Peut-on réutiliser une voix enregistrée dans un autre but ?">
                    <p>
                        Non. La voix enregistrée ne doit servir qu'à prouver une atteinte au règlement du serveur.
                        Toute réutilisation hors de ce cadre est contraire à la charte d'utilisation.
                    </p>
                    <div className="mt-4">
                        <Link to="/guidelines" className="btn btn-error btn-sm">
                            Lire la charte
                        </Link>
                    </div>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🎙️ Est-ce que l'on peut faire un enregistrement dans un salon qui n'a pas été créé par Voicey ?">
                    <p>
                        Totalement ! C'est possible en utilisant la commande <code className="badge badge-ghost px-1">/record</code> et en étant présent dans le salon.
                    </p>
                </DocsCollapse>
            </div>
        </div>
    )
}
