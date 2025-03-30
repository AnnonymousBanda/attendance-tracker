'use client'

import { Loader } from '@/components'
import { getUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import {
    getAuth,
    signInWithPopup,
    signOut,
    OAuthProvider,
    onAuthStateChanged,
} from 'firebase/auth'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'

const auth = getAuth()
const provider = new OAuthProvider('microsoft.com')
provider.addScope('user.read')
provider.addScope('email')

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    const pathname = usePathname()
    const initialRender = useRef(true)

    // Track Navigation (Avoid Initial Render)
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }

        console.log('Navigated to:', pathname)
        setLoading(false) // Stop loading after navigation
    }, [pathname])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true)

            if (firebaseUser) {
                const userData = await getUser(firebaseUser.uid)
                if (userData.status === 200) {
                    setUser(userData.data)
                    await router.push('/')
                } else {
                    await router.push('/login')
                }
            } else {
                setUser(null)
                await router.push('/login')
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const isAuthenticated = () => !!user

    const signInWithMicrosoft = async () => {
        try {
            setLoading(true)
            const result = await signInWithPopup(auth, provider)
            const { displayName, email, uid } = result.user

            let userData = await getUser(uid)
            if (userData.status === 200) {
                setUser(userData.data)
                await router.push('/')
                return
            }

            const credential = OAuthProvider.credentialFromResult(result)
            const accessToken = credential?.accessToken

            let photoURL = ''
            if (accessToken) {
                try {
                    const res = await axios.get(
                        'https://graph.microsoft.com/v1.0/me/photo/$value',
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                            responseType: 'arraybuffer',
                        }
                    )
                    const imageBase64 = Buffer.from(
                        res.data,
                        'binary'
                    ).toString('base64')
                    photoURL = `data:image/png;base64,${imageBase64}`
                } catch (err) {
                    console.error('Failed to fetch profile picture', err)
                }
            }

            const userInfo = { displayName, email, uid, photoURL }
            setUser(userInfo)

            await router.push('/register')
        } catch (error) {
            toast.error('Sign-in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoading(true)
            await signOut(auth)
            setUser(null)
            await router.push('/login')
        } catch (error) {
            toast.error('Logout failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                logout,
                signInWithMicrosoft,
            }}
        >
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within a AuthProvider')
    return context
}

export { AuthProvider, useAuth }
