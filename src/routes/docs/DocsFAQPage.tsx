import { DocsCollapse } from '../../components'

export function DocsFAQPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">FAQ - Questions fréquentes</h1>
            <p className="text-base-content/70">
                Les réponses aux questions les plus courantes sur Voicey.
            </p>

            <div className="space-y-3">
                <DocsCollapse name="faq" title="❓ Le bot a-t-il besoin d'accès administrateur ?" defaultChecked>
                    <p>
                        Non ! Voicey n'a besoin que des permissions minimales : créer/supprimer des salons, 
                        gérer les permissions et déplacer les utilisateurs. C'est plus sûr et respecte le 
                        principe du moindre privilège.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="💾 Combien de salons le bot peut-il gérer ?">
                    <p>
                        Il n'y a pas de limite technique. Voicey est conçu pour supporter 
                        des serveurs de toutes tailles jusqu'à plusieurs milliers de salons actifs. 
                        On a des serveurs avec 500+ salons temporaires par jour sans problèmes.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🗑️ Qu'est-ce qui ne se supprime pas ?">
                    <p>
                        Les salons ne sont supprimés que s'ils sont vides. Les salons contenant des voix 
                        ou des utilisateurs sont toujours préservés. Le bot respecte le premier entrant = 
                        propriétaire du salon.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🚀 Comment signaler un bug ?">
                    <p>
                        Rejoins notre serveur Discord et signale le bug dans le channel #support. Tes retours 
                        aident à améliorer Voicey ! Nous répondons généralement en moins de 24 heures.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="💰 Y a-t-il un plan premium ?">
                    <p>
                        Actuellement, Voicey est entièrement gratuit et open-source. Nous n'avons aucun plan 
                        payant prévu. Le bot dépend des donations et du soutien communautaire.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🔄 Peut-on avoir plusieurs canaux créateurs ?">
                    <p>
                        Oui ! Tu peux créer plusieurs canaux "Rejoindre pour créer" dans différentes 
                        catégories avec des configurations différentes. Parfait pour les Guildes ou les 
                        événements multiples.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="👥 Est-ce que le bot crée un salon par utilisateur ?">
                    <p>
                        Oui, chaque utilisateur qui rejoint un canal créateur se voit attribuer son propre 
                        salon personnel. S'il a déjà un salon actif, il est déplacé dans celui-ci au lieu 
                        d'en créer un nouveau.
                    </p>
                </DocsCollapse>

                <DocsCollapse name="faq" title="🔒 Mes données sont-elles sécurisées ?">
                    <p>
                        Oui. Nous utilisons des serveurs cloud sécurisés avec chiffrement et les données 
                        ne sont jamais vendues. Les logs de modération sont conservés conformément à la 
                        RGPD. Consulte notre politique de confidentialité pour plus de détails.
                    </p>
                </DocsCollapse>
            </div>

            <div className="alert alert-info mt-6">
                <p>Tu ne trouves pas ta réponse ? <a href="#" className="link link-primary">Rejoins le Discord</a> et pose la question !</p>
            </div>
        </div>
    )
}
