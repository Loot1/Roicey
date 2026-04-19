import { Header } from '../navigation/Header'
import { Footer } from '../navigation/Footer'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-base-100">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
        </div>
    )
}
