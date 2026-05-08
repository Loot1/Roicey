import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DocsTable } from '../../components'
import type { DocsTableColumn } from '../../components'

type SettingRow = {
    id: string
    setting: ReactNode
    description: ReactNode
    type: string
}

export function DocsSettingsPage() {
    const { t } = useTranslation()

    const settingColumns: DocsTableColumn<SettingRow>[] = [
        {
            key: 'setting',
            header: t('docs.settings.colSetting'),
            render: (row: SettingRow) => row.setting,
        },
        {
            key: 'description',
            header: t('docs.settings.colDescription'),
            render: (row: SettingRow) => row.description,
        },
        {
            key: 'type',
            header: t('docs.settings.colType'),
            headerClassName: 'hidden md:table-cell',
            cellClassName: 'hidden md:table-cell',
            render: (row: SettingRow) => row.type,
        },
    ]

    const settingRows: SettingRow[] = [
        {
            id: 'voice-channel-creation-room',
            setting: t('docs.settings.s0Name'),
            description: t('docs.settings.s0Desc'),
            type: t('docs.settings.typeVoiceChannel'),
        },
        {
            id: 'voice-channel-category',
            setting: t('docs.settings.s1Name'),
            description: t('docs.settings.s1Desc'),
            type: t('docs.settings.typeCategory'),
        },
        {
            id: 'moderation-channel',
            setting: t('docs.settings.s2Name'),
            description: t('docs.settings.s2Desc'),
            type: t('docs.settings.typeTextChannel'),
        },
        {
            id: 'moderation-roles',
            setting: t('docs.settings.s3Name'),
            description: (
                <>
                    <p>{t('docs.settings.s3Text1')}</p>
                    <p>{t('docs.settings.s3Text2')}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>{t('docs.settings.s3List0Pre')} <code className="badge badge-ghost px-1">/recordban</code> {t('docs.settings.s3List0And')} <code className="badge badge-ghost px-1">/banhistory</code></li>
                        <li>{t('docs.settings.s3List1')}</li>
                        <li>{t('docs.settings.s3List2')}</li>
                    </ul>
                    <p className="mt-2">{t('docs.settings.s3Text3')}</p>
                </>
            ),
            type: t('docs.settings.typeRoles'),
        },
        {
            id: 'member-limit',
            setting: t('docs.settings.s4Name'),
            description: t('docs.settings.s4Desc'),
            type: t('docs.settings.typeNumber'),
        },
        {
            id: 'recording-duration',
            setting: t('docs.settings.s5Name'),
            description: t('docs.settings.s5Desc'),
            type: t('docs.settings.typeDuration'),
        },
    ]

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{t('docs.settings.title')}</h1>
            <p className="text-base-content/70">
                {t('docs.settings.intro')}
            </p>

            <DocsTable columns={settingColumns} rows={settingRows} rowKey={(row) => row.id} />
        </div>
    )
}
