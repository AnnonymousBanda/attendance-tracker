'use client'

import { Loader } from '@/components'
import { getUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
    getAuth,
    signInWithPopup,
    signOut,
    OAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
    getRedirectResult,
} from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { app } from '@/firebase/firebase.config'

const auth = getAuth(app)
const provider = new OAuthProvider('microsoft.com')
provider.addScope('user.read')
provider.addScope('email')
provider.setCustomParameters({
    prompt: 'select_account',
})

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [showLoader, setShowLoader] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    const pathname = usePathname()
    const { query } = useRouter()

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth)
                if (result) {
                    const { displayName, email, uid } = result.user

                    const userData = await getUser(uid)

                    if (userData.status === 200) {
                        setUser(userData.data)
                        router.replace('/')
                        return
                    }

                    const credential =
                        OAuthProvider.credentialFromResult(result)
                    const accessToken = credential?.accessToken

                    router.replace(
                        `/register?displayName=${displayName}&email=${email}&uid=${uid}&accessToken=${accessToken}`
                    )
                }
            } catch (error) {
                console.error('Redirect login failed:', error)
                toast.error('Sign-in failed. Please try again.', {
                    className: 'toast-error',
                })
            }
        }

        const initAuth = async () => {
            // if (!isMobile()) await handleRedirectResult()
            if (user) return setShowLoader(false)

            const unsubscribe = onAuthStateChanged(
                auth,
                async (firebaseUser) => {
                    if (!firebaseUser) {
                        if (['/', '/lectures', '/stats'].includes(pathname))
                            router.replace('/login')

                        setShowLoader(false)
                        return
                    }

                    const userData = await getUser(firebaseUser.uid)

                    if (userData.status === 200) {
                        setUser(userData.data)

                        if (pathname === '/login' || pathname === '/register') {
                            router.replace('/')
                        }
                    } else if (['/', '/lectures', '/stats'].includes(pathname))
                        router.replace('/login')

                    setShowLoader(false)
                }
            )

            return unsubscribe
        }

        const unsubscribePromise = initAuth()

        return () => {
            unsubscribePromise.then((unsubscribe) => {
                if (typeof unsubscribe === 'function') unsubscribe()
            })
        }
    }, [pathname])

    const isMobile = () =>
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    const isAuthenticated = () => !!user

    const signInWithMicrosoft = async () => {
        if (isMobile()) {
            let userData = await getUser('t0gEKmUnqyRJdNsBi3Q5u0doz2H3')
            if (userData.status === 200) {
                setUser(userData.data)
                router.replace('/')
                setShowLoader(false)
                return
            }
            // signInWithRedirect(auth, provider)
            return
        }

        try {
            const result = await signInWithPopup(auth, provider)
            const { displayName, email, uid } = result.user

            let userData = await getUser(uid)
            if (userData.status === 200) {
                setUser(userData.data)
                router.replace('/')
                setShowLoader(false)
                return
            }

            const credential = OAuthProvider.credentialFromResult(result)
            const accessToken = credential?.accessToken

            router.replace(
                `/register?displayName=${displayName}&email=${email}&uid=${uid}&accessToken=${accessToken}`
            )
        } catch (error) {
            console.log('Sign-in error:', error.message)
            toast.error('Sign-in failed. Please try again.', {
                className: 'toast-error',
            })
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
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
