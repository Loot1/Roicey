import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ButtonOne } from '../../components/ButtonOne'
import { DashboardAlert, DashboardPageHeader } from '../../components/dashboard'

export function DashboardRecordingsPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    const [source, setSource] = useState(() => searchParams.get('source') ?? '')
    const [error, setError] = useState<string | null>(null)
    const hasSource = source.trim().length > 0

    const handleSearch = () => {
        const normalizedSource = source.trim()
        if (!normalizedSource) {
            setError(t('dashboard.recordings.invalidSource'))
            return
        }

        setError(null)
        navigate(`/dashboard/recordings/detail?source=${encodeURIComponent(normalizedSource)}`)
    }

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title={t('dashboard.recordings.title')}
                description={t('dashboard.recordings.description')}
                bottom={(
                    <div className="space-y-3">
                        <div className="text-sm text-base-content/60">{t('dashboard.recordings.hint')}</div>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <label className="flex items-center gap-3 rounded-[1.25rem] border border-base-300 bg-base-100 px-4 py-3 shadow-sm lg:flex-1">
                                <MagnifyingGlassIcon className="h-5 w-5 text-base-content/45" />
                                <input
                                    type="url"
                                    value={source}
                                    onChange={(event) => setSource(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault()
                                            handleSearch()
                                        }
                                    }}
                                    className="w-full bg-transparent text-sm outline-none"
                                    placeholder={t('dashboard.recordings.placeholder')}
                                />
                                {hasSource ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSource('')
                                            setError(null)
                                        }}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-base-300 text-base-content/55 transition hover:border-base-content/25 hover:text-base-content"
                                        aria-label={t('dashboard.recordings.clearSource')}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                ) : null}
                            </label>

                            <ButtonOne label={t('dashboard.recordings.openButton')} Icon={ArrowTopRightOnSquareIcon} onClick={handleSearch} className="lg:self-center" />
                        </div>
                    </div>
                )}
            />

            {error ? <DashboardAlert tone="warning" className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}
        </section>
    )
}