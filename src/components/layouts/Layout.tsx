import { Header } from '../navigation/Header'
import { Footer } from '../navigation/Footer'
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
