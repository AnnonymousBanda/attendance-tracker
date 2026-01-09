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
                request.destination === '' && url.pathname.endsWith('.json'),
            handler: 'NetworkFirst', // Try fetching from network, fallback to cache
            options: {
                cacheName: 'json-cache',
                expiration: {
                    maxEntries: 100, // Store up to 100 JSON responses
                    maxAgeSeconds: 60 * 60 * 24 * 7, // Cache JSON for 7 days
                },
                cacheableResponse: {
                    statuses: [200], // Only cache successful responses
                },
                networkTimeoutSeconds: 5, // Wait max 5 sec before using cache
            },
        },
    ],
})

const nextConfig = withPWA({
    reactStrictMode: true,
    turbopack: {},
})

export default nextConfig
