'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function OutlookCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const getToken = async () => {
            if (!sessionStorage.getItem('expectingOAuthCallback')) {
                router.replace('/login')
                return
            }

            const code = searchParams.get('code')
            const verifier = localStorage.getItem('pkce_verifier')
            if (!code || !verifier) {
                toast.error(
                    'Error authenticating with Outlook! Please try again.'
                )
                router.replace('/login')
                return
            }

            const data = new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.NEXT_PUBLIC_OUTLOOK_REDIRECT_URI,
                code_verifier: verifier,
            })

            try {
                const response = await fetch(
                    `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID}/oauth2/v2.0/token`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: data.toString(),
                    }
                )

                const result = await response.json()

                if (!response.ok) {
                    toast.error(
                        'Error authenticating with Outlook! Please try again.'
                    )
                    router.replace('/login')
                    return
                }

                localStorage.setItem('accessToken', result.access_token)

                router.replace('/')
            } catch (error) {
                toast.error(
                    'Error authenticating with Outlook! Please try again.'
                )
                router.replace('/login')
            }
        }

        getToken()
    }, [searchParams])

    return <h1>Authenticating with Outlook...</h1>
}
