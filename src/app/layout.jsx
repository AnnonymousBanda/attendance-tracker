'use client'

import { useEffect } from 'react'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
    useEffect(() => {
        console.log('Service Worker registration in progress...')
        if ('serviceWorker' in navigator) {
            console.log('Service Worker supported')
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log(
                            'Service Worker registered:',
                            registration.scope
                        )
                    })
                    .catch((error) => {
                        console.log(
                            'Service Worker registration failed:',
                            error
                        )
                    })
            })
        }
    }, [])

    return (
        <html lang="en">
            <head>
                {/* <meta charset="UTF-8" /> */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link
                    rel="icon"
                    href="/images/favicon.ico"
                    type="image/x-icon"
                />

                <meta name="theme-color" content="#f3f8fa" />

                <meta name="apple-mobile-web-app-title" content="AttTrack" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />

                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/images/logo-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/images/logo-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="167x167"
                    href="/images/logo-167x167.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/images/logo-180x180.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="192x192"
                    href="/images/logo-192x192.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="256x256"
                    href="/images/logo-256x256.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="384x384"
                    href="/images/logo-384x384.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="512x512"
                    href="/images/logo-512x512.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="1024x1024"
                    href="/images/logo-1024x1024.png"
                />

                <link rel="manifest" href="/manifest.json" />

                <meta
                    name="description"
                    content="Attendance Tracker is a PWA that helps users monitor their attendance overall and course-wise, ensuring they never fall short of 75%."
                />
                <meta
                    property="og:title"
                    content="AttTrack - Never Fall Short of 75%"
                />
                <meta
                    property="og:description"
                    content="A PWA that helps you track attendance overall and course-wise, ensuring you stay above 75%."
                />
                <meta
                    property="og:url"
                    content="https://attendance-tracker-2023.netlify.app/"
                />
                <meta
                    property="og:image"
                    content="https://attendance-tracker-2023.netlify.app/images/og-image.png"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="AttTrack - Never Fall Short of 75%"
                />
                <meta
                    name="twitter:description"
                    content="A PWA that helps you track attendance and stay above 75%."
                />
                <meta
                    name="twitter:image"
                    content="https://attendance-tracker-2023.netlify.app/images/og-image.png"
                />

                <title>AttTrack</title>
            </head>
            <body>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        success: {
                            iconTheme: {
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                secondary: '#fff',
                            },
                        },
                        style: {
                            padding: '1rem',
                            borderRadius: '0.8rem',
                            fontSize: '1.4rem',
                        },
                    }}
                />
                {children}
            </body>
        </html>
    )
}
