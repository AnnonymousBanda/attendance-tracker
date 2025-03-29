'use client'

import { AuthProvider } from '@/context'

const layout = ({ children }) => {
    return <AuthProvider>{children}</AuthProvider>
}

export default layout
