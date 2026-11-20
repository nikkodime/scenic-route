import { defineConfig } from 'vite';

// API_URL points the dev proxy at an API on another port (8787 may be taken).
const api = process.env.API_URL ?? 'http://localhost:8787';

export default defineConfig({
  base: process.env.WEB_BASE ?? '/',
  server: { port: 5173, proxy: { '/v1': api, '/healthz': api } },
  build: { target: 'es2022', sourcemap: true },
});
