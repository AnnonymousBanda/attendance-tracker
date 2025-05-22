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
                // const accessToken =
                // 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ijdhdzd1Vk5wd0hHSEplanFiaXpDLWtqZXM5dW5DTERBVFkxNThsN0JZdVEiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNTdmN2Q5Mi0wMzhlLTRkNGMtODI2NS03Y2QyYmViMzNiMzQvIiwiaWF0IjoxNzQ3ODgzNTExLCJuYmYiOjE3NDc4ODM1MTEsImV4cCI6MTc0Nzg4ODc1MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhaQUFBQWEvUWlVQlJmb0VMZGF4RmtkMVB5eTBWZEJoZnlpSDRrQVB6aGQ2VEQ5MU9TOS8vcHFlbEdqMDY3dUwzTmk3c0U4dlpuclBmakt0bGp2SVVCT3IzWHNRPT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IlRlc3QgQXBwIiwiYXBwaWQiOiI3ZTliMDAwMy02YmY3LTQ3MjAtOTQ2Yy0xZDgwOWQ3ODM4ODciLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJoYWdhdCIsImdpdmVuX25hbWUiOiJBbmtpdCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjQzLjI1MS4xNzkuMjUwIiwibmFtZSI6IkFua2l0IEJoYWdhdCIsIm9pZCI6IjhiNDU5YzAyLTVjZWEtNDMwZi05MGEzLTFlZGVlMjA3MWE3ZCIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMkQxMDhENjMxIiwicmgiOiIxLkFUNEFrbjFfcFk0RFRFMkNaWHpTdnJNN05BTUFBQUFBQUFBQXdBQUFBQUFBQUFBLUFQby1BQS4iLCJzY3AiOiJlbWFpbCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQiLCJzaWQiOiIwMDRmYWU4OS00M2RmLTJhYmMtNmE5YS1lZGJlZDk1NDA4NmQiLCJzdWIiOiJzRm9CaF9yWGRyeE5OUThEbFU4WGUtWFhJaHYxejI4TDB0TUQ5MENUOEdJIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiYTU3ZjdkOTItMDM4ZS00ZDRjLTgyNjUtN2NkMmJlYjMzYjM0IiwidW5pcXVlX25hbWUiOiJhbmtpdF8yMzAxY2UwM0BpaXRwLmFjLmluIiwidXBuIjoiYW5raXRfMjMwMWNlMDNAaWl0cC5hYy5pbiIsInV0aSI6IkJRVFBhLXppYUUtTVZaZ0xBWTR4QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfZnRkIjoiR0ZlTFREMHRKNnF2Mk9HREx2RFZBc200V09ieHVHdTZfOGFnSVhqeGE1NEJZWE5wWVhOdmRYUm9aV0Z6ZEMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIyMCAxIiwieG1zX3N0Ijp7InN1YiI6InB3dWpoQUJPN3FRWjVJaE9GOGZjQmVsdTMxczFPVVNlOTFTR0poVUZQWXMifSwieG1zX3RjZHQiOjE1ODUxMjM1ODN9.Y3a_qLE1_ibO8Gg9o6QfiztjoAcU8Tv1pqp5ImycpMRab_icgt3A3iwFZMEl7AZCWMe6duXEgWjaJG-ltKgdveRIBe6S7mWR3YmSrVT-aErPoh3-osC6BMSpva2yz1ZZ8wXY_ul0eeELECYtAggpTjoF036lVFJpbKJuFRqcru1CkxKXP7_WcR_RGtsTkbTLkobkgKTZHBcE5h_KJT1HwBkWzYHtinR1S8sm1DX6Hx0Jvfn-7z4JsCjoamDkxQakE_fuLUgkR2O1erNPrMhBZduNMTs3OqbWteYvMHxqO4t_MKBl6f7By6Y67fkwgmMAxvFNJN7cdYmu8q_Occ7bgq'

                if (!accessToken) {
                    if (!['/login', '/register', '/outlook'].includes(pathname))
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

                const userData = await getUser(user.data.id)

                if (userData.status === 404) {
                    const { displayName, mail, id, jobTitle } = user.data

                    router.replace(
                        `/register?displayName=${displayName}&email=${mail}&uuid=${id}&degree=${jobTitle}`
                    )
                    setShowLoader(false)
                    return
                }

                if (userData.status === 503) {
                    const error = new Error(userData.message)
                    error.status = userData.status
                    error.isFirebaseError = true
                    throw error
                }

                if (userData.status !== 200) {
                    const error = new Error(userData.message)
                    error.status = userData.status
                    error.isFirebaseError = true
                    throw error
                }

                setUser(userData.data)

                if (['/login', '/register', '/outlook'].includes(pathname))
                    router.replace('/')

                setShowLoader(false)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!error.response)
                        toast.error('Network error! Please try again.')
                    else if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
                        router.replace('/login')
                        setShowLoader(false)
                        return
                    }
                } else toast.error(error.message)

                if (!['/login', '/register', '/outlook'].includes(pathname))
                    router.replace('/login')

                setShowLoader(false)
                return
            }
        }

        initAuth()
    }, [pathname])

    const isAuthenticated = () => !!user

    const signInWithMicrosoft = async () => {
        const { verifier, challenge } = await generatePKCE()
        sessionStorage.setItem('expectingOAuthCallback', 'true')
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
