import nextPWA from '@ducanh2912/next-pwa'

const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavChaching: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === 'development',
    workboxOptions: {
        disableDevLogs: true,
    },
    runtimeCaching: [
        {
            urlPattern: ({ request, url }) =>
                request.destination === '' && url.pathname.endsWith('.json'), // Match JSON requests
            handler: 'NetworkFirst', // Try network first, fallback to cache
            options: {
                cacheName: 'json-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
                cacheableResponse: {
                    statuses: [200],
                },
            },
        },
    ],
})

const nextConfig = withPWA({
    reactStrictMode: true,
})

export default nextConfig
