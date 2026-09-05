import { DashboardProvider } from '../../contexts/DashboardContext'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { privateSeoMeta } from '../../config/seoMeta'

/** Route entry that pairs the dashboard layout with its data provider. */
export default function DashboardRoute() {
    return (
        <DashboardProvider>
            <DashboardLayout />
        </DashboardProvider>
    )
}

export const meta = privateSeoMeta('dashboard')
