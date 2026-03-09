import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite'; // loadEnv hinzugefügt
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    server: {
      host: true,
      port: Number(env.PORT) || 3021,
      strictPort: true,

    /*
     */

    },
  };
});
