import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {(tailwindConfig: object) => object} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
    darkMode: 'selector',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'pph-black': '#191917',
                'pph-green': '#98C743',
                'pph-green-deep': '#59ba52',
                'pph-white': '#FEFEFE',
                'primary-purple': '#98C743',
                'primary-purple-light': '#2a3e59'
            }
        },
    },

    plugins: [forms],
});
