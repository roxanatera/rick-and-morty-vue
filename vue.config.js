// raíz del proyecto
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        // Fuerza a postcss-loader (v3 en CLI 3) a cargar Tailwind con PostCSS 7
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  },
}
