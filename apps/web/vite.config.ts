import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.WEB_BASE ?? '/',
  server: { port: 5173, proxy: { '/v1': 'http://localhost:8787', '/healthz': 'http://localhost:8787' } },
  build: { target: 'es2022', sourcemap: true },
});
