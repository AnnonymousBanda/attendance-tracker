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
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                tertiary: 'var(--color-tertiary)',
            },
        },
    },
    plugins: [],
}
