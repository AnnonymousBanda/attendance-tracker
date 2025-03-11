import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,css}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', ...fontFamily.sans],
            },
            colors: {
                primary: '#f3f8fa',
                secondary: '#29303d',
                tertiary: '#a3bbd6',
            },
        },
    },
    plugins: [],
}
