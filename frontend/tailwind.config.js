/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#C9A227',
                    hover: '#A68B1F',
                },
                secondary: '#1E3A5F',
            },
        },
    },
    plugins: [],
}
