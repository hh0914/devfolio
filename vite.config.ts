import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site';

/** 把 site.theme.default 注入 index.html，避免首访主题与配置不一致导致闪烁 */
function themeDefaultPlugin(): Plugin {
  return {
    name: 'devfolio-theme-default',
    transformIndexHtml(html) {
      return html.replace('%THEME_DEFAULT%', site.theme.default);
    },
  };
}

export default defineConfig({
  plugins: [react(), themeDefaultPlugin()],
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
