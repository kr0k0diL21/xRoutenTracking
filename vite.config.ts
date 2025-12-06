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
      key: './localhost-key.pem', // Pfad zur Key-Datei
      cert: './localhost.pem', // Pfad zum Zertifikat
    },
    host: true, // wichtig, damit auch über IP erreichbar (z.B. Handy im gleichen Netzwerk)
    port: 3000, // oder 5173, was du willst
    strictPort: true,
  },
});
