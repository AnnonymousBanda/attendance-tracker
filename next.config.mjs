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
})

const nextConfig = withPWA({
    reactStrictMode: true,
})

export default nextConfig
