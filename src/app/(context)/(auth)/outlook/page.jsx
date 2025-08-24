'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/context.auth'
import { Loader } from '@/components'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export default function OutlookCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    useEffect(() => {
        const exchangeCodeForTokens = async () => {
            const code = searchParams.get('code')
            const verifier = localStorage.getItem('pkce_verifier')

            if (!code || !verifier || !sessionStorage.getItem('expectingOAuthCallback')) {
                router.replace('/login')
                return
            }
            sessionStorage.removeItem('expectingOAuthCallback')
            localStorage.removeItem('pkce_verifier')

            try {
                const params = new URLSearchParams({
                    client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
                    scope: 'openid profile email offline_access https://graph.microsoft.com/User.Read',
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: process.env.NEXT_PUBLIC_OUTLOOK_REDIRECT_URI,
                    code_verifier: verifier,
                })

                const response = await axios.post(
                    `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID}/oauth2/v2.0/token`,
                    params
                )

                const { access_token, refresh_token } = response.data
                await login(access_token, refresh_token)

            } catch (error) {
                toast.error('Authentication failed. Please try again.')
                router.replace('/login')
            }
        }
        exchangeCodeForTokens()
    }, [])

    return <Loader />
}
