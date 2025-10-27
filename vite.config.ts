import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ElementPlusUnplugin from 'unplugin-element-plus/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ElementPlusUnplugin({})],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 7011,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
