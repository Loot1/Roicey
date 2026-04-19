import { DocsCard, DocsTable } from '../../components'
import type { DocsTableColumn } from '../../components'

type CommandRow = {
    command: string
    description: string
    permission: string
}

const commandColumns: DocsTableColumn<CommandRow>[] = [
    {
        key: 'command',
        header: 'Commande',
        render: (row: CommandRow) => <code className="badge badge-ghost">{row.command}</code>,
    },
    {
        key: 'description',
        header: 'Description',
        render: (row: CommandRow) => row.description,
    },
    {
        key: 'permission',
        header: 'Permissions',
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
        render: (row: CommandRow) => row.permission,
    },
]

const commandRows = [
    {
        command: '/config',
        description: "Ouvre l'assistant de configuration du serveur",
        permission: 'Administrateur',
    },
    {
        command: '/settings',
        description: 'Met à jour un paramètre spécifique du bot',
        permission: 'Administrateur',
    },
    {
        command: '/recordban',
        description: "Interdit à une personne d'utiliser la fonctionnalité d'enregistrement",
        permission: 'Modération',
    },
    {
        command: '/banhistory',
        description: "Consulte l'historique des bannissements d'un salon vocal d'une personne",
        permission: 'Modération',
    },
    {
        command: '/record',
        description: 'Lance un enregistrement du salon vocal courant avec la durée prévue par la configuration',
        permission: 'Membres',
    },
    {
        command: '/ping',
        description: 'Vérifie rapidement que le bot répond',
        permission: 'Membres',
    },
] satisfies CommandRow[]

export function DocsCommandsPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Commandes disponibles</h1>
            <p className="text-base-content/70">
                Voicey reste simple à utiliser : peu de slash commands et une gestion quotidienne directement via les boutons des salons vocaux.
            </p>

            <DocsTable columns={commandColumns} rows={commandRows} rowKey={(row) => row.command} />

            <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold">Boutons d'action</h2>
                <p className="text-base-content/70">
                    Dans chaque salon vocal géré par Voicey, les actions sont accessibles sans mémoriser de commande via des boutons :
                </p>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DocsCard title="🔒 Verrouiller" description="Ferme ou rouvre le salon aux nouveaux entrants." />
                    <DocsCard title="🎯 Limit" description="Change la limite de places du salon vocal." />
                    <DocsCard title="🫴 Claim" description="Récupère le contrôle du salon si le propriétaire n'est plus présent." />
                    <DocsCard title="👑 Transférer" description="Transfère la gestion du salon à un autre membre." />
                    <DocsCard title="🚫 Kick / Ban / Unban" description="Expulse, bannit ou débannit un membre d'un salon vocal." />
                    <DocsCard title="🎙️ Enregistrement" description="Ouvre une demande d'enregistrement dans le salon vocal." />
                </div>
            </div>
        </div>
    )
}
