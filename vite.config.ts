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
    host: true, // macht die Seite im WLAN erreichbar
    port: 5173,
    https: {
      key: './localhost.key', // ← die Datei, die du vorhin mit openssl erstellt hast
      cert: './localhost.crt', // ← die zweite Datei
    },
  },
});
