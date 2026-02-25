/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                space: {
                    950: '#020812',
                    900: '#050d1a',
                    800: '#0a1628',
                    700: '#0f1f3d',
                    600: '#162952',
                    500: '#1d3461',
                    400: '#2a4a7f',
                    300: '#3a6099',
                },
                neon: {
                    green: '#39d353',
                    teal: '#2dd4bf',
                    blue: '#60a5fa',
                    purple: '#a78bfa',
                    gold: '#fbbf24',
                    pink: '#f472b6',
                    cyan: '#22d3ee',
                },
                star: {
                    white: '#e8f4fd',
                    dim: '#a8c4d4',
                },
            },
            fontFamily: {
                orbitron: ['Orbitron', 'monospace'],
                inter: ['Inter', 'sans-serif'],
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.55' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '15%': { transform: 'translateX(-7px)' },
                    '30%': { transform: 'translateX(7px)' },
                    '45%': { transform: 'translateX(-5px)' },
                    '60%': { transform: 'translateX(5px)' },
                    '75%': { transform: 'translateX(-2px)' },
                },
                popOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '40%': { transform: 'scale(1.6)', opacity: '0.9' },
                    '100%': { transform: 'scale(0)', opacity: '0' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '0.1' },
                    '50%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(24px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                spinSlow: {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                },
                rocketLaunch: {
                    '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                    '20%': { transform: 'translateY(-10px) scale(1.05)', opacity: '1' },
                    '100%': { transform: 'translateY(-300px) scale(0.6)', opacity: '0' },
                },
                shipLaunch: {
                    '0%': { transform: 'translateX(0) translateY(0)' },
                    '100%': { transform: 'translateX(300px) translateY(-100px)', opacity: '0' },
                },
                successBounce: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(1.15)' },
                    '60%': { transform: 'scale(0.95)' },
                },
                bounceBack: {
                    '0%': { transform: 'translateX(0)' },
                    '40%': { transform: 'translateX(40px)', opacity: '0.6' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
            animation: {
                float: 'float 3s ease-in-out infinite',
                floatSlow: 'floatSlow 5s ease-in-out infinite',
                pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
                shake: 'shake 0.5s ease-in-out',
                popOut: 'popOut 0.45s ease-out forwards',
                twinkle: 'twinkle 2.5s ease-in-out infinite',
                slideUp: 'slideUp 0.4s ease-out',
                spinSlow: 'spinSlow 20s linear infinite',
                rocketLaunch: 'rocketLaunch 1s ease-in forwards',
                shipLaunch: 'shipLaunch 0.9s ease-in forwards',
                successBounce: 'successBounce 0.5s ease-in-out',
                bounceBack: 'bounceBack 0.5s ease-in-out',
            },
        },
    },
    plugins: [],
}
