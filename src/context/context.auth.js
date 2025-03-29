import { Loader } from '@/components'
import { getUser, addUser } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
    getAuth,
    signInWithPopup,
    signOut,
    OAuthProvider,
    onAuthStateChanged,
} from 'firebase/auth'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const auth = getAuth()
const provider = new OAuthProvider('microsoft.com')
provider.addScope('user.read')
provider.addScope('email')

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData = await getUser(firebaseUser.uid)

                if (userData.status === 200) {
                    setUser(userData.data)

                    router.push('/')
                    setLoading(false)
                } else {
                    router.push('/login')
                    setLoading(false)
                }
            }
        })

        return () => unsubscribe()
    }, [])

    const isAuthenticated = () => !!user

    const signInWithMicrosoft = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { displayName, email, uid } = result.user

            let userData = await getUser(uid)
            if (userData.status === 200) {
                setUser(userData.data)

                router.push('/')
                setLoading(false)

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

            const userInfo = {
                displayName,
                email,
                uid,
                photoURL,
            }

            setUser(userInfo)

            router.push('/register')
            setLoading(false)
        } catch (error) {
            toast.error('Sign-in failed. Please try again.')
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)

            setUser(null)

            router.push('/login')
            setLoading(false)
        } catch (error) {
            toast.error('Logout failed. Please try again.')
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
