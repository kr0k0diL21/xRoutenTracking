import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
    host: true,
    port: 3000,
    strictPort: true,

    proxy: {
      '/api-xrouten': {
        target: 'https://api.xrouten.de',
        changeOrigin: true,
        secure: true, // Xrouten nutzt HTTPS
        rewrite: (path) => path.replace(/^\/api-xrouten/, ''),
      },
    },
  },
});
