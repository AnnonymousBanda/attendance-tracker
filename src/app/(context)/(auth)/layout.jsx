'use client'

import { Loader } from '@/components'
import { useAuth } from '@/context'

const layout = ({ children }) => {
    const { isAuthenticated } = useAuth()

    return isAuthenticated() ? <Loader /> : children
}

export default layout
