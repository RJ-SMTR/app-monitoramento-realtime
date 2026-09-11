import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/proxy-api-legado' precisa vir antes de '/proxy-api': o Vite casa por
      // startsWith na ordem de inserção, e '/proxy-api' é prefixo de '/proxy-api-legado'.
      '/proxy-api-legado': {
        target: 'https://dados.mobilidade.rio',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-api-legado/, ''),
      },
      '/proxy-api': {
        target: 'https://its.mobilidade.rio',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-api/, ''),
      },
    },
  },
})
