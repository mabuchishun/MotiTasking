/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
    darkMode: ['selector', '[class*="app-dark"]'],
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    plugins: [PrimeUI],
    theme: {
        extend: {
            colors: {
                'primary': 'var(--primary-color)',
                'secondary': 'var(--surface-200)',
                'success': 'var(--green-500)',
                'info': 'var(--blue-500)',
                'warning': 'var(--yellow-500)',
                'danger': 'var(--red-500)',
                'light': 'var(--surface-100)',
                'dark': 'var(--surface-900)'
            }
        },
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px'
        }
    }
};
