import { useTranslation } from 'react-i18next'
import { DocsCard, DocsTable } from '../../components'
import type { DocsTableColumn } from '../../components'

type CommandRow = {
    command: string
    description: string
    permission: string
}

export function DocsCommandsPage() {
    const { t } = useTranslation()

    const commandColumns: DocsTableColumn<CommandRow>[] = [
        {
            key: 'command',
            header: t('docs.commands.colCommand'),
            render: (row: CommandRow) => <code className="badge badge-ghost">{row.command}</code>,
        },
        {
            key: 'description',
            header: t('docs.commands.colDescription'),
            render: (row: CommandRow) => row.description,
        },
        {
            key: 'permission',
            header: t('docs.commands.colPermission'),
            headerClassName: 'hidden md:table-cell',
            cellClassName: 'hidden md:table-cell',
            render: (row: CommandRow) => row.permission,
        },
    ]

    const commandRows: CommandRow[] = [
        { command: '/config', description: t('docs.commands.configDesc'), permission: t('docs.commands.permAdmin') },
        { command: '/settings', description: t('docs.commands.settingsDesc'), permission: t('docs.commands.permAdmin') },
        { command: '/recordban', description: t('docs.commands.recordbanDesc'), permission: t('docs.commands.permMod') },
        { command: '/voicealert', description: t('docs.commands.voicealertDesc'), permission: t('docs.commands.permMod') },
        { command: '/banhistory', description: t('docs.commands.banhistoryDesc'), permission: t('docs.commands.permMod') },
        { command: '/record', description: t('docs.commands.recordDesc'), permission: t('docs.commands.permMember') },
        { command: '/ping', description: t('docs.commands.pingDesc'), permission: t('docs.commands.permMember') },
    ]

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.commands.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.commands.intro')}
            </p>

            <DocsTable columns={commandColumns} rows={commandRows} rowKey={(row) => row.command} />

            <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold">{t('docs.commands.buttonsTitle')}</h2>
                <p className="text-base-content/70">
                    {t('docs.commands.buttonsIntro')}
                </p>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <DocsCard title={t('docs.commands.btn0Title')} description={t('docs.commands.btn0Desc')} />
                    <DocsCard title={t('docs.commands.btn1Title')} description={t('docs.commands.btn1Desc')} />
                    <DocsCard title={t('docs.commands.btn2Title')} description={t('docs.commands.btn2Desc')} />
                    <DocsCard title={t('docs.commands.btn3Title')} description={t('docs.commands.btn3Desc')} />
                    <DocsCard title={t('docs.commands.btn4Title')} description={t('docs.commands.btn4Desc')} />
                    <DocsCard title={t('docs.commands.btn5Title')} description={t('docs.commands.btn5Desc')} />
                </div>
            </div>
        </div>
    )
}
