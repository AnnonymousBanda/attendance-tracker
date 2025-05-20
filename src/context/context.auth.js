'use client'

import { Loader } from '@/components'
import { getUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { generatePKCE } from '@/utils/pkce'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [showLoader, setShowLoader] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken')

                if (!accessToken) {
                    if (['/', '/lectures', '/stats'].includes(pathname))
                        router.replace('/login')

                    setShowLoader(false)
                    return
                }

                const user = await axios.get(
                    'https://graph.microsoft.com/v1.0/me',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )

                if (user.status !== 200) {
                    if (['/', '/lectures', '/stats'].includes(pathname))
                        router.replace('/login')

                    setShowLoader(false)
                    return
                }

                const userData = await getUser(user.data.id)

                if (userData.status !== 200) {
                    const { displayName, mail, id, jobTitle } = user.data

                    if (['/', '/lectures', '/stats'].includes(pathname))
                        router.replace(
                            `/register?displayName=${displayName}&email=${mail}&uuid=${id}&accessToken=${accessToken}&degree=${jobTitle}`
                        )
                    setShowLoader(false)
                    return
                }

                setUser(userData.data)

                if (pathname === '/login' || pathname === '/register')
                    router.replace('/')

                setShowLoader(false)
            } catch (error) {
                toast.error('Login failed. Please try again.')
                router.replace('/login')
            }
        }

        initAuth()
    }, [pathname])

    const isAuthenticated = () => !!user

    const signInWithMicrosoft = async () => {
        const { verifier, challenge } = await generatePKCE()
        localStorage.setItem('pkce_verifier', verifier)

        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
            response_type: 'code',
            redirect_uri: process.env.NEXT_PUBLIC_OUTLOOK_REDIRECT_URI,
            response_mode: 'query',
            scope: 'openid profile email offline_access https://graph.microsoft.com/User.Read',
            code_challenge: challenge,
            code_challenge_method: 'S256',
            prompt: 'select_account',
        })

        window.location.href = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`
    }

    const logout = async () => {
        try {
            localStorage.removeItem('accessToken')
            setUser(null)
            router.replace('/login')
        } catch (error) {
            toast.error('Logout failed. Please try again.', {
                className: 'toast-error',
            })
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                signInWithMicrosoft,
                isAuthenticated,
            }}
        >
            {showLoader ? <Loader /> : children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within a AuthProvider')
    return context
}

export { AuthProvider, useAuth }
