'use client'

import { UserProvider } from '@/context'

const layout = ({ children }) => {
    return <UserProvider>{children}</UserProvider>
}

export default layout
