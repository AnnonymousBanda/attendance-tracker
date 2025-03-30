'use client'

import { Header, Loader, Navbar } from '@/components'
import { useAuth } from '@/context'

const layout = ({ children }) => {
    const { isAuthenticated } = useAuth()

    return !isAuthenticated() ? (
        <Loader />
    ) : (
        <main className="flex flex-col h-svh gap-[1rem]">
            <Header />
            <div className="max-container flex-1 overflow-auto">{children}</div>
            <Navbar />
        </main>
    )
}

export default layout
