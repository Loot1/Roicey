import { Header } from '../Header'
import { Footer } from '../Footer'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
