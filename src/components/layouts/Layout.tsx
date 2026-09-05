import { Outlet } from 'react-router'
import { Header } from '../navigation/Header'
import { Footer } from '../navigation/Footer'

/** Site chrome shared by every page. Mounted as a `layout()` route. */
export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-base-100">
            <Header />
            <main className="flex flex-1 flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
