import type { ReactNode } from 'react'

import { DocsTable } from '../../components'
import type { DocsTableColumn } from '../../components'

type SettingRow = {
    id: string
    setting: ReactNode
    description: ReactNode
    type: string
}

const settingColumns: DocsTableColumn<SettingRow>[] = [
    {
        key: 'setting',
        header: 'Paramètre',
        render: (row: SettingRow) => row.setting,
    },
    {
        key: 'description',
        header: 'Description',
        render: (row: SettingRow) => row.description,
    },
    {
        key: 'type',
        header: 'Type',
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
        render: (row: SettingRow) => row.type,
    },
]

const settingRows = [
    {
        id: 'voice-channel-creation-room',
        setting: '🔊 Salon de création des salons vocaux',
        description: "Le point d'entrée de Voicey est un salon vocal de création. Quand un membre le rejoint, le bot crée automatiquement un salon vocal temporaire.",
        type: 'Salon vocal',
    },
    {
        id: 'voice-channel-category',
        setting: '📁 Catégorie de création des salons vocaux',
        description: "La catégorie est l'endroit où sont créés les salons vocaux temporaires. Elle sert à organiser les salons vocaux et peut vous permettre de leur appliquer des permissions spécifiques.",
        type: 'Catégorie',
    },
    {
        id: 'moderation-channel',
        setting: '🧾 Salon de modération',
        description: "C'est le salon textuel dans lequel sont remontés les bannissements des salons vocaux, les résultats d'enregistrement et les éventuelles erreurs de configuration du bot sur votre serveur Discord. Sans que ce salon soit défini, les enregistrements ne peuvent pas fonctionner.",
        type: 'Salon textuel',
    },
    {
        id: 'moderation-roles',
        setting: '🔐 Rôles de modération',
        description: (
            <>
                <p>
                    Par défaut, Voicey considère modérateur tout utilisateur avec la permission Administrateur.
                </p>
                <p>
                    Toutefois, il est possible de définir des rôles spécifiques pour la gestion des salons vocaux. Les modérateurs peuvent :
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>utiliser les commandes <code className="badge badge-ghost px-1">/recordban</code> et <code className="badge badge-ghost px-1">/banhistory</code></li>
                    <li>accéder au dashboard de modération, consulter les enregistrements et les logs d'activité</li>
                    <li>gérer les salons vocaux temporaires, ils disposent des mêmes droits que les propriétaires des salons et sont immunisés : un propriétaire de salon ne peut pas bannir ou expulser un modérateur de son salon.</li>
                </ul>
            </>
        ),
        type: 'Rôles',
    },
    {
        id: 'member-limit',
        setting: '👥 Limite de places',
        description: 'Il est possible de modifier la limite de chaque salon vocal temporaire créé sur le serveur Discord par Voicey. Elle est de 7 par défaut.',
        type: 'Nombre',
    },
    {
        id: 'recording-duration',
        setting: "⏱️ Durée d'enregistrement",
        description: "C'est à chaque serveur de définir la durée d'un enregistrement déclenché avec Voicey. Par défaut, elle est de 1 minute. Elle doit être de minimum 10 secondes et de maximum 3 minutes.",
        type: 'Durée en secondes',
    },
] satisfies SettingRow[]

export function DocsSettingsPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Guide de configuration</h1>
            <p className="text-base-content/70">
                Ici, vous trouverez les différents paramètres de configuration de Voicey, ainsi que des informations pour vous aider à comprendre à quoi ils servent et comment les utiliser au mieux sur votre serveur Discord.
            </p>

            <DocsTable columns={settingColumns} rows={settingRows} rowKey={(row) => row.id} />
        </div>
    )
}
