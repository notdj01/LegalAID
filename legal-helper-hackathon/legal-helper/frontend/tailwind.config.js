/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a', // True neutral Black/Grey
                surface: '#171717',    // Neutral Dark Grey (Cards)
                primary: '#D4AF37',    // Metallic Gold
                primaryDark: '#B4941F', // Darker Gold
                textMain: '#e5e5e5',   // Off-white/Silver
                textMuted: '#a3a3a3',  // Neutral Grey
                accent: {
                    DEFAULT: '#8B0000', // Deep Dark Red (Crimson) for strong accents (like 'Repealed')
                    red: '#991b1b',
                    green: '#166534'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'fog-flow': 'fogFlow 20s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fogFlow: {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '100%': { transform: 'translate(-5%, -5%) scale(1.1)' },
                }
            }
        },
    },
    plugins: [],
}
