'use client'

import { Loader } from '@/components'
import { getUser, resetLecturesIfNeeded } from '@/firebase/api/firebase.firestore'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { generatePKCE } from '@/utils/pkce'

const AuthContext = createContext()

const apiClient = axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0',
})

const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    const pathname = usePathname()

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
            logout(false)
            return null
        }
        try {
            const response = await axios.post(
                `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID}/oauth2/v2.0/token`,
                new URLSearchParams({
                    client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    scope: 'openid profile email offline_access https://graph.microsoft.com/User.Read',
                })
            )
            const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken)
            }
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
            return newAccessToken
        } catch (error) {
            logout()
            return null
        }
    }
    
    useEffect(() => {
        const interceptor = apiClient.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                        return apiClient(originalRequest);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => {
            apiClient.interceptors.response.eject(interceptor);
        };
    }, []);

    const fetchAndSetUser = async (currentAccessToken) => {
        if (!currentAccessToken) return false
        try {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentAccessToken}`
            const graphUserResponse = await apiClient.get('/me')
            const firestoreUser = await getUser(graphUserResponse.data.id)

            if (firestoreUser.status === 200) {
                setUser(firestoreUser.data)
                await resetLecturesIfNeeded(graphUserResponse.data.id)
                return true
            } else if (firestoreUser.status === 404) {
                const { displayName, mail, id, jobTitle } = graphUserResponse.data
                router.replace(`/register?displayName=${displayName}&email=${mail}&uuid=${id}&degree=${jobTitle}`)
                return false
            } else {
                throw new Error(firestoreUser.message || 'Failed to fetch user data.')
            }
        } catch (error) {
            logout()
            return false
        }
    }

    const login = async (accessToken, refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken)
        await fetchAndSetUser(accessToken)
    }

    const logout = (redirect = true) => {
        setUser(null)
        localStorage.removeItem('refreshToken')
        delete apiClient.defaults.headers.common['Authorization']
        if (redirect) {
            router.replace('/login')
        }
    }

    useEffect(() => {
        const initializeAuth = async () => {
            const token = await refreshAccessToken()
            if (token) {
                await fetchAndSetUser(token)
            }
            setIsLoading(false)
        }
        initializeAuth()
    }, [])

    useEffect(() => {
        if (!isLoading) {
            const isAuthPage = ['/login', '/register', '/outlook'].includes(pathname)
            if (user && isAuthPage) {
                router.replace('/')
            }
            if (!user && !isAuthPage) {
                router.replace('/login')
            }
        }
    }, [user, pathname, isLoading, router])

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

    const isAuthenticated = () => !!user

    return (
        <AuthContext.Provider
            value={{
                user,
                logout,
                signInWithMicrosoft,
                isAuthenticated,
                login,
            }}
        >
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within a AuthProvider')
    return context
}

export { AuthProvider, useAuth, apiClient }
